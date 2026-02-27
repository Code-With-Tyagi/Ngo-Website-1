import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Ngo from "../models/ngo.model.js";
import "../config/loadEnv.js";

/**
 * Middleware to verify NGO dashboard access
 * User must be logged in AND have an associated verified NGO
 */
export const requireNgoAuth = async (req, res, next) => {
    try {
        // Get token
        const authHeader = String(req.headers.authorization || "");
        const bearerToken = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : "";
        const token = req.cookies?.token || bearerToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user has an associated NGO
        if (!user.ngoId) {
            return res.status(403).json({
                success: false,
                message: "No NGO associated with this account",
                code: "NO_NGO"
            });
        }

        // Fetch the NGO
        const ngo = await Ngo.findById(user.ngoId);
        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "Associated NGO not found",
                code: "NGO_NOT_FOUND"
            });
        }

        // Check if NGO is verified
        if (!ngo.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Your NGO is pending verification",
                code: "NGO_PENDING",
                ngo: {
                    _id: ngo._id,
                    ngoName: ngo.ngoName,
                    email: ngo.email,
                    isVerified: ngo.isVerified,
                    createdAt: ngo.createdAt
                }
            });
        }

        // Attach user and NGO to request
        req.user = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            ngoId: user.ngoId,
            ngoRole: user.ngoRole
        };
        req.ngo = ngo;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }

        console.error("NGO Auth Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};

/**
 * Middleware to check NGO status (for pending page)
 * Allows access even if NGO is pending
 */
export const checkNgoStatus = async (req, res, next) => {
    try {
        const authHeader = String(req.headers.authorization || "");
        const bearerToken = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : "";
        const token = req.cookies?.token || bearerToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            ngoId: user.ngoId,
            ngoRole: user.ngoRole
        };

        // If user has ngoId, try to fetch NGO
        if (user.ngoId) {
            const ngo = await Ngo.findById(user.ngoId);
            req.ngo = ngo || null;
        } else {
            // Check if user has a pending NGO by email
            const pendingNgo = await Ngo.findOne({ 
                email: user.email.toLowerCase(),
                isVerified: false 
            });
            req.ngo = pendingNgo || null;
            req.ngoPending = !!pendingNgo;
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

export default { requireNgoAuth, checkNgoStatus };
