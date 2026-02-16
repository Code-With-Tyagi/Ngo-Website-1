import jwt from "jsonwebtoken";
import "../config/loadEnv.js";

// Verify JWT Token
export const verifyToken = (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login first."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID to request object for use in controllers
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again."
            });
        }

        res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
};
