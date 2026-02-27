import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  verifyPayment,
  getPayments,
  webhook
} from "../controllers/payment.controller.js";

const router = express.Router();

// Public endpoint to create an order (optionally authenticated)
router.post("/order", createOrder);

// Verify payment (client posts razorpay ids after payment)
router.post("/verify", verifyPayment);

// Webhook endpoint from Razorpay (no auth)
router.post("/webhook", express.raw({ type: "application/json" }), webhook);

// Get payment history for logged-in user
router.get("/history", verifyToken, getPayments);

export default router;
