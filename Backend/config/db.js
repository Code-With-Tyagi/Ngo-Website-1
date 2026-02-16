import mongoose from "mongoose";
// import dns from "node:dns";
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");
};

export default connectDB;
