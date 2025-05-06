import mongoose from "mongoose";
import { getConfig } from "./index.mjs";

const config = getConfig();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      config.mongoDbUri,
      {}
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // logger.error(`Error connecting to MongoDB: ${error.message}`);
    if (error instanceof Error)
      console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
