import express from "express";
import authRoutes from "./routes/auth.routes.js";
import volunteerRoutes from "./routes/volunteer.route.js";
import ngoRoutes from "./routes/ngo.route.js";
import contactRoutes from "./routes/contact.route.js";

import "./config/loadEnv.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));


app.use("/api", authRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
