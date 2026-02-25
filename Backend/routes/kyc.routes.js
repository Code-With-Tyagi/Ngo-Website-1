import express from "express";
import { requestAadhaarOtp, verifyAadhaar, verifyPan } from "../controllers/kyc.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/aadhaar-otp", verifyToken, requestAadhaarOtp);
router.post("/verify-aadhaar", verifyToken, verifyAadhaar);
router.post("/verify-pan", verifyToken, verifyPan);

export default router;
