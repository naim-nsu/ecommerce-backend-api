import config from "@/configs";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(config.dbUri);
    console.log("MongoDB connected");
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;
