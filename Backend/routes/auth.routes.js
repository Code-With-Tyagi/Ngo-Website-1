import express from "express";
let router=express.Router();
import {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

// Register a new user
router.post("/register", registerUser);
// Login user
router.post("/login", loginUser);
// Google login
router.post("/google-login", googleLogin);
// Forgot password
router.post("/forgot-password", forgotPassword);
// Reset password
router.post("/reset-password/:token", resetPassword);
// Logout user (protected route)
router.post("/logout", verifyToken, logoutUser);

export default router;
