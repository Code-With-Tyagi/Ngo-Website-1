
import express from "express";
import { applyVolunteer } from "../controllers/volunteer.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/apply", verifyToken, applyVolunteer);

export default router;
