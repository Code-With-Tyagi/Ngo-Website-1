import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import volunteerRoutes from "./routes/volunteer.route.js";
import ngoRoutes from "./routes/ngo.route.js";
import contactRoutes from "./routes/contact.route.js";
import kycRoutes from "./routes/kyc.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";

import "./config/loadEnv.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import seedAdmin from "./utils/seedAdmin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// ─── Serve Static Files ───
// Allow access to uploaded files (NGO docs, avatars, etc)
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  maxAge: "1d",
  etag: false
}));

app.use("/api", authRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
