import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import mcqRoutes from "./routes/mcq.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from Vercel frontend and local dev
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,          // e.g. https://your-app.vercel.app
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // If ALLOWED_ORIGIN not set, allow all (open CORS) – tighten in production
    if (!process.env.ALLOWED_ORIGIN) return callback(null, true);
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/mcq", mcqRoutes);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
