import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { sendResetPasswordEmail } from "../services/mail.service.js";
import "../config/loadEnv.js";

const DEFAULT_BCRYPT_SALT_ROUNDS = 8;
const BCRYPT_SALT_ROUNDS = (() => {
    const parsedRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    return Number.isInteger(parsedRounds) && parsedRounds >= 8 && parsedRounds <= 14
        ? parsedRounds
        : DEFAULT_BCRYPT_SALT_ROUNDS;
})();

const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID || "").trim();
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return token;
};

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const toUserPayload = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || null,
    authProvider: user.authProvider || "local"
});

const hashResetToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const buildResetPasswordUrl = (token) => {
    const base =
        process.env.RESET_PASSWORD_URL ||
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`;

    const normalizedBase = String(base).trim();

    if (normalizedBase.includes("{token}")) {
        return normalizedBase.replace("{token}", encodeURIComponent(token));
    }

    if (normalizedBase.includes(":token")) {
        return normalizedBase.replace(":token", encodeURIComponent(token));
    }

    const separator = normalizedBase.includes("?") ? "&" : "?";
    return `${normalizedBase}${separator}resetToken=${encodeURIComponent(token)}`;
};

const verifyGoogleIdToken = async (idToken) => {
    if (!googleClient || !GOOGLE_CLIENT_ID) {
        throw new Error("Google sign-in is not configured yet.");
    }

    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("Invalid Google credential payload.");
    }

    return payload;
};

//Register a new user /api/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const cleanName = String(name || "").trim();
        const cleanEmail = normalizeEmail(email);

        // Validation checks
        if (!cleanName || !cleanEmail || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // finding the existing user
        const existingUser = await User.findOne({ email: cleanEmail })
            .select("_id")
            .lean();

        // if user already exists
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please log in instead."
            });
        }

        // hashing the password before saving to database
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        const newUser = new User({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword
        });
        await newUser.save();

        // Generate token and set cookie
        const token = generateToken(res, newUser._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            data: toUserPayload(newUser)
        });
    } catch (error) {
        if (error?.code === 11000 && error?.keyPattern?.email) {
            return res.status(409).json({
                success: false,
                message: "Email already registered. Please log in instead."
            });
        }

        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
}

// Login user /api/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = normalizeEmail(email);

        if (!cleanEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist. Please register first."
            });
        }

        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token and set cookie
        const token = generateToken(res, user._id);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            data: toUserPayload(user)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in user",
            error: error.message
        });
    }
}

// Google login /api/google-login
export const googleLogin = async (req, res) => {
    try {
        if (!googleClient || !GOOGLE_CLIENT_ID) {
            return res.status(503).json({
                success: false,
                message: "Google sign-in is not configured yet."
            });
        }

        const credential = String(req.body?.credential || "").trim();
        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required"
            });
        }

        let googlePayload;
        try {
            googlePayload = await verifyGoogleIdToken(credential);
        } catch (tokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid Google credential",
                error: tokenError.message
            });
        }

        const googleId = String(googlePayload.sub || "").trim();
        const cleanEmail = normalizeEmail(googlePayload.email);
        const cleanName =
            String(googlePayload.name || "").trim() ||
            (cleanEmail ? cleanEmail.split("@")[0] : "User");
        const avatar =
            typeof googlePayload.picture === "string"
                ? googlePayload.picture.trim()
                : "";
        const emailVerified = Boolean(googlePayload.email_verified);

        if (!googleId || !cleanEmail) {
            return res.status(400).json({
                success: false,
                message: "Google account email is unavailable"
            });
        }

        if (!emailVerified) {
            return res.status(403).json({
                success: false,
                message: "Google email is not verified"
            });
        }

        let user = await User.findOne({
            $or: [{ googleId }, { email: cleanEmail }]
        });

        if (!user) {
            user = await User.create({
                name: cleanName,
                email: cleanEmail,
                authProvider: "google",
                googleId,
                avatar: avatar || null,
                emailVerified: true
            });
        } else {
            if (user.googleId && user.googleId !== googleId) {
                return res.status(409).json({
                    success: false,
                    message: "This email is linked to a different Google account."
                });
            }

            const updates = {};
            if (!user.googleId) updates.googleId = googleId;
            if (!user.avatar && avatar) updates.avatar = avatar;
            if (!user.emailVerified) updates.emailVerified = true;
            if (!user.name && cleanName) updates.name = cleanName;

            if (Object.keys(updates).length > 0) {
                user = await User.findByIdAndUpdate(
                    user._id,
                    { $set: updates },
                    { new: true }
                );
            }
        }

        const token = generateToken(res, user._id);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            data: toUserPayload(user)
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Account already exists. Please try logging in again."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error logging in with Google",
            error: error.message
        });
    }
};

// Forgot password /api/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const cleanEmail = normalizeEmail(req.body?.email);
        const genericMessage = "A password reset link has been sent. Please check your email.";

        if (!cleanEmail) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email: cleanEmail }).select("_id name email");

        if (!user) {
            return res.status(200).json({
                success: true,
                message: genericMessage
            });
        }

        const rawResetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = hashResetToken(rawResetToken);
        const expiryMinutes = Number(process.env.RESET_PASSWORD_TOKEN_EXP_MIN || 15);
        const expiresAt = new Date(Date.now() + Math.max(expiryMinutes, 1) * 60 * 1000);

        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    resetPasswordTokenHash: resetTokenHash,
                    resetPasswordExpiresAt: expiresAt
                }
            }
        );

        const resetUrl = buildResetPasswordUrl(rawResetToken);
        setImmediate(() => {
            sendResetPasswordEmail({
                name: user.name,
                email: user.email,
                resetUrl,
                expiryMinutes: Math.max(expiryMinutes, 1)
            }).catch(async (mailError) => {
                console.error("forgotPassword mail error:", mailError.message);
                try {
                    await User.updateOne(
                        { _id: user._id, resetPasswordTokenHash: resetTokenHash },
                        { $set: { resetPasswordTokenHash: null, resetPasswordExpiresAt: null } }
                    );
                } catch (rollbackError) {
                    console.error("forgotPassword rollback error:", rollbackError.message);
                }
            });
        });

        return res.status(200).json({
            success: true,
            message: genericMessage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to process forgot password request",
            error: error.message
        });
    }
};

// Reset password /api/reset-password/:token
export const resetPassword = async (req, res) => {
    try {
        const token = String(req.params?.token || "").trim();
        const password = String(req.body?.password || "");

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const resetTokenHash = hashResetToken(token);

        const user = await User.findOne({
            resetPasswordTokenHash: resetTokenHash,
            resetPasswordExpiresAt: { $gt: new Date() }
        }).select("_id name email");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset link is invalid or has expired"
            });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        const updateResult = await User.updateOne(
            { _id: user._id, resetPasswordTokenHash: resetTokenHash },
            {
                $set: {
                    password: hashedPassword,
                    resetPasswordTokenHash: null,
                    resetPasswordExpiresAt: null
                }
            }
        );

        if (!updateResult?.matchedCount) {
            return res.status(400).json({
                success: false,
                message: "Reset link is invalid or has expired"
            });
        }

        const authToken = generateToken(res, user._id);

        return res.status(200).json({
            success: true,
            message: "Password reset successful. You are now logged in.",
            token: authToken,
            data: toUserPayload(user)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: error.message
        });
    }
};

// Logout user /api/logout
export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging out user",
            error: error.message
        });
    }
}
