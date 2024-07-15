import mongoose, { ConnectOptions } from "mongoose";
require("dotenv").config();

const DATABASE_URL = process.env.MONGODB_URI;

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(DATABASE_URL!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Database connected!");
  } catch (err: any) {
    console.error("Database connection error:", err);
  }
}

export default connectDB;
