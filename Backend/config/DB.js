import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const connectDB = async () => {
  if (!MONGODB_URL) {
    console.error("❌ MONGODB_URL not defined - database connection failed");
    console.error("⚠️  Please set MONGODB_URL in your .env file");
    throw new Error("MONGODB_URL is required");
  }

  let retries = 0;

  const attemptConnection = async () => {
    try {
      console.log(`🔄 Attempting MongoDB connection (Attempt ${retries + 1}/${MAX_RETRIES})...`);

      const conn = await mongoose.connect(MONGODB_URL, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        w: "majority",
        maxPoolSize: 10,
        minPoolSize: 2
      });

      console.log(`✅ MongoDB connected successfully!`);
      console.log(`📍 Database: ${conn.connection.host}`);
      console.log(`🗂️  Database Name: ${conn.connection.name}`);

      // Connection event listeners
      mongoose.connection.on("error", (err) => {
        console.error(`❌ MongoDB connection error: ${err.message}`);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  MongoDB disconnected");
      });

      mongoose.connection.on("reconnected", () => {
        console.log("✅ MongoDB reconnected");
      });

      process.on("SIGINT", async () => {
        try {
          await mongoose.connection.close();
          console.log("✅ MongoDB connection closed through app termination");
          process.exit(0);
        } catch (err) {
          console.error("Error closing MongoDB connection:", err);
          process.exit(1);
        }
      });

      return true;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection failed: ${error.message}`);

      if (retries >= MAX_RETRIES) {
        throw new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
      }

      console.log(`⏱️  Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return attemptConnection();
    }
  };

  await attemptConnection();
};

export default connectDB;
