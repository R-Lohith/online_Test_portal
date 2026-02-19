import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/bit_test";
    const connectOptions = {};

    // For troubleshooting TLS/SSL errors with Atlas you can set
    // MONGODB_TLS_INSECURE=true in your .env to disable certificate
    // validation temporarily (NOT recommended for production).
    if (process.env.MONGODB_TLS_INSECURE === "true") {
      connectOptions.tls = true;
      connectOptions.tlsAllowInvalidCertificates = true;
      // 'tlsInsecure' is not supported together with
      // 'tlsAllowInvalidCertificates' in recent drivers. Use
      // 'tlsAllowInvalidHostnames' to relax hostname validation
      // if needed for debugging.
      connectOptions.tlsAllowInvalidHostnames = true;
    }

    const conn = await mongoose.connect(mongoUri, connectOptions);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("💡 Make sure MongoDB is running or update MONGODB_URI in .env file");
    process.exit(1);
  }
};