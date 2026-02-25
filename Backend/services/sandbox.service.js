import http from "http";
import https from "https";

// Optimized HTTPS agent with better connection pooling and timeouts
const httpsAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 30000,
    maxSockets: 20,
    maxFreeSockets: 10,
    timeout: 25000,
    freeSocketTimeout: 30000
});

const SANDBOX_API_BASE_URL = process.env.SANDBOX_API_BASE_URL || "https://api.sandbox.co.in";
const SANDBOX_API_KEY = process.env.SANDBOX_API_KEY;
const SANDBOX_API_SECRET = process.env.SANDBOX_API_SECRET;
const SANDBOX_API_VERSION = process.env.SANDBOX_API_VERSION || "2.0";
const SANDBOX_AUTH_VERSION = process.env.SANDBOX_AUTH_VERSION || "1.0.0";
const REQUEST_TIMEOUT = parseInt(process.env.SANDBOX_REQUEST_TIMEOUT || "20000"); // 20 seconds
const MAX_RETRIES = parseInt(process.env.MAX_API_RETRIES || "3");

let cachedToken = null;
let tokenExpiresAt = 0;
let tokenFetchPromise = null; // Prevents race condition for token fetches

// Retry logic with exponential backoff
async function requestJsonWithRetry(method, path, headers, body, retryCount = 0) {
    try {
        return await requestJson(method, path, headers, body);
    } catch (error) {
        if (retryCount < MAX_RETRIES && isRetryableError(error)) {
            const delayMs = Math.min(1000 * Math.pow(2, retryCount), 8000); // Exponential backoff: 1s, 2s, 4s, 8s max
            await new Promise(resolve => setTimeout(resolve, delayMs));
            return requestJsonWithRetry(method, path, headers, body, retryCount + 1);
        }
        throw error;
    }
}

// Determine if an error is retryable (network/timeout errors, not validation errors)
function isRetryableError(error) {
    const message = error.message?.toLowerCase() || '';
    return message.includes('timeout') || 
           message.includes('econnrefused') || 
           message.includes('econnreset') ||
           message.includes('socket') ||
           error.code === 'ETIMEDOUT' ||
           error.code === 'ECONNRESET';
}

function requestJson(method, path, headers, body) {
    const baseUrl = new URL(SANDBOX_API_BASE_URL);
    const isHttps = baseUrl.protocol === "https:";
    const lib = isHttps ? https : http;
    const payload = body ? JSON.stringify(body) : null;

    const reqHeaders = { ...headers };
    if (payload) {
        reqHeaders["Content-Type"] = "application/json";
        reqHeaders["Content-Length"] = Buffer.byteLength(payload);
    }

    const options = {
        method,
        hostname: baseUrl.hostname,
        port: baseUrl.port || (isHttps ? 443 : 80),
        path,
        headers: reqHeaders,
        timeout: REQUEST_TIMEOUT,
        agent: isHttps ? httpsAgent : undefined,
    };

    return new Promise((resolve, reject) => {
        const req = lib.request(options, (res) => {
            let raw = "";
            res.on("data", (chunk) => {
                raw += chunk;
            });
            res.on("end", () => {
                let data = null;
                try {
                    data = raw ? JSON.parse(raw) : null;
                } catch (err) {
                    return reject(new Error(`Failed to parse JSON response: ${err.message}`));
                }
                resolve({ status: res.statusCode, data });
            });
        });

        // Handle timeout
        req.on("timeout", () => {
            req.destroy();
            reject(new Error("Sandbox API request timeout - please try again"));
        });

        req.on("error", reject);
        if (payload) req.write(payload);
        req.end();
    });
}

// Improved token caching with concurrent request handling
async function getAccessToken() {
    // If token is valid, return it immediately (fast path)
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    // If token fetch is already in progress, wait for it (prevents race condition)
    if (tokenFetchPromise) {
        return tokenFetchPromise;
    }

    if (!SANDBOX_API_KEY || !SANDBOX_API_SECRET) {
        throw new Error("Missing SANDBOX_API_KEY or SANDBOX_API_SECRET in environment variables");
    }

    // Create new token fetch promise
    tokenFetchPromise = (async () => {
        try {
            const res = await requestJsonWithRetry("POST", "/authenticate", {
                "x-api-key": SANDBOX_API_KEY,
                "x-api-secret": SANDBOX_API_SECRET,
                "x-api-version": SANDBOX_AUTH_VERSION,
            });

            // Check res?.data?.data?.access_token as per friend's code, fallback to res?.data?.access_token
            const token = res?.data?.data?.access_token || res?.data?.access_token;
            if (!token) {
                throw new Error("Failed to get access token from Sandbox. Check credentials.");
            }

            cachedToken = token;
            tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;
            return token;
        } finally {
            // Clear the promise so next request can fetch a new token if needed
            tokenFetchPromise = null;
        }
    })();

    return tokenFetchPromise;
}

export async function generateAadhaarOtp({ aadhaarNumber, consent = "Y", reason = "Identity Verification" }) {
    const token = await getAccessToken();
    return requestJsonWithRetry(
        "POST",
        "/kyc/aadhaar/okyc/otp",
        {
            Authorization: token,
            "x-api-key": SANDBOX_API_KEY,
            "x-api-version": SANDBOX_API_VERSION,
        },
        {
            "@entity": "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
            aadhaar_number: aadhaarNumber,
            consent,
            reason,
        }
    );
}

export async function verifyAadhaarOtp({ reference_id, otp }) {
    const token = await getAccessToken();
    return requestJsonWithRetry(
        "POST",
        "/kyc/aadhaar/okyc/otp/verify",
        {
            Authorization: token,
            "x-api-key": SANDBOX_API_KEY,
            "x-api-version": SANDBOX_API_VERSION,
        },
        {
            "@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
            reference_id,
            otp,
        }
    );
}

export async function verifyPanDetails({
    pan,
    nameAsPerPan,
    dateOfBirth,
    consent = "Y",
    reason = "Identity Verification",
    acceptCache
}) {
    const token = await getAccessToken();
    const headers = {
        Authorization: token,
        "x-api-key": SANDBOX_API_KEY,
        "x-api-version": SANDBOX_API_VERSION
    };

    if (acceptCache !== undefined) {
        headers["x-accept-cache"] = String(acceptCache);
    }

    return requestJsonWithRetry(
        "POST",
        "/kyc/pan/verify",
        headers,
        {
            "@entity": "in.co.sandbox.kyc.pan_verification.request",
            pan,
            name_as_per_pan: nameAsPerPan,
            date_of_birth: dateOfBirth,
            consent,
            reason
        }
    );
}
