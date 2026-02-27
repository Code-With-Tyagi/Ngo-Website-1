import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/Apiresponse.js";
import ApiError from "../utils/ApiError.js";
import Payment from "../models/payment.model.js";
import crypto from "crypto";
import "../config/loadEnv.js";

const KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

async function getRazorpayClient() {
  try {
    const mod = await import("razorpay");
    const Razorpay = mod.default || mod;
    return new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
  } catch (err) {
    return null;
  }
}

// Create order and persist minimal payment record
export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = "INR", receipt, notes } = req.body || {};

  if (!amount || Number(amount) <= 0) {
    throw new ApiError(400, "Invalid amount provided");
  }

  const options = {
    amount: Math.round(Number(amount)),
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    payment_capture: 1,
    notes: notes || {}
  };

  const client = await getRazorpayClient();
  let order;
  if (client && client.orders && typeof client.orders.create === "function") {
    order = await client.orders.create(options);
  } else {
    order = { id: `order_mock_${Date.now()}`, ...options };
  }

  const paymentDoc = await Payment.create({
    user: req.userId || null,
    amount: Number(amount),
    currency,
    receipt: options.receipt,
    notes: options.notes,
    razorpayOrderId: order.id,
    status: "created"
  });

  return res.status(201).json(new ApiResponse(201, "Order created", { order, payment: paymentDoc }));
});

// Verify incoming payment and update record
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id) {
    throw new ApiError(400, "Missing razorpay order/payment fields");
  }

  // Find stored payment by order id
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

  if (!payment) {
    // create fallback record so history exists
    // continue and set status below
  }

  if (KEY_SECRET) {
    if (!razorpay_signature) throw new ApiError(400, "Missing razorpay signature");

    const expected = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expected !== razorpay_signature) {
      if (payment) {
        payment.status = "failed";
        await payment.save();
      }
      throw new ApiError(400, "Invalid payment signature");
    }
  } else {
    // dev: auto-approve
    console.warn("Razorpay secret not configured; auto-approving payment");
  }

  const update = {
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature || null,
    status: "paid"
  };

  const updated = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { $set: update, $setOnInsert: { amount: null, currency: null } },
    { new: true, upsert: true }
  );

  return res.status(200).json(new ApiResponse(200, "Payment verified and recorded", updated));
});

// Get payment history for current user
export const getPayments = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Number(req.query.limit || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.userId) filter.user = req.userId;

  const [payments, total] = await Promise.all([
    Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Payment.countDocuments(filter)
  ]);

  return res.status(200).json(new ApiResponse(200, "Payments fetched", { payments, pagination: { total, page, limit } }));
});

// Expose webhook handling by delegating to payments/rozerpay handler if desired
import { handleWebhook as razorpayWebhookHandler } from "../payments/rozerpay.js";

export const webhook = razorpayWebhookHandler;

export default {
  createOrder,
  verifyPayment,
  getPayments,
  webhook
};
