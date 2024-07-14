import mongoose from "mongoose";

const DATABASE_URL = "mongodb://localhost:27017/DailyStocks";

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

async function connectDB() {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected!");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

export default connectDB;
