import mongoose from "mongoose";
// import { logger } from "../utils/logger";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI ?? "", {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // logger.error(`Error connecting to MongoDB: ${error.message}`);
    if (error instanceof Error)
      console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
