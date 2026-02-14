import express from "express";
import multer from "multer";
import upload from "../middlewares/uploadMiddleware.js";
import { createNgo } from "../controllers/ngo.controller.js";

const router = express.Router();
const ngoUpload = upload.fields([
  { name: "registrationCertificate", maxCount: 1 },
  { name: "ngoLogo", maxCount: 1 },
  { name: "certificate12A", maxCount: 1 },
  { name: "certificate80G", maxCount: 1 }
]);

const handleNgoUpload = (req, res, next) => {
  ngoUpload(req, res, (err) => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size cannot exceed 5MB"
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed"
    });
  });
};

router.post(
  "/create",
  handleNgoUpload,
  createNgo
);

export default router;
