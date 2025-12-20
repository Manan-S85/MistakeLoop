import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.log("No MongoDB URI provided - running without database");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "interview_diagnostics"
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.log("Continuing without database...");
  }
}
