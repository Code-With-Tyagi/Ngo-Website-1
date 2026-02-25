import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import "../config/loadEnv.js";

// Verify JWT Token and Fetch Full User Object
export const authenticate = async (req, res, next) => {
    try {
        // Read token from cookie first, then Authorization header as fallback
        const authHeader = String(req.headers.authorization || "");
        const bearerToken = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : "";
        const token = req.cookies?.token || bearerToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login first."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Fetch full user object from database
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Attach complete user object to request
        req.user = {
            _id: user._id,
            id: user._id,
            userId: userId,
            name: user.name || user.firstName || "Admin",
            email: user.email,
            role: user.role,
            phone: user.phone
        };
        req.userId = userId;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again."
            });
        }

        console.error("Auth error:", error.message);
        res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
};

// Alias for backwards compatibility
export const verifyToken = authenticate;
