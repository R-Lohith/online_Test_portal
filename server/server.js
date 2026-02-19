import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import mcqRoutes from "./routes/mcq.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/mcq", mcqRoutes);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
