import User from "../models/user.model.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login first."
            });
        }

        const user = await User.findById(req.userId).select("role").lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authorization error",
            error: error.message
        });
    }
};
