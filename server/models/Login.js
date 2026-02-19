import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  loginAt: { type: Date, default: Date.now },
  ip: { type: String },
  userAgent: { type: String }
});

export default mongoose.model("Login", loginSchema);
