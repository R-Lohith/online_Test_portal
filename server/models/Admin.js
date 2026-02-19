import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    adminType: { type: String, default: "General" }, // e.g., SuperAdmin, Moderator
    permissions: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Admin", adminSchema);
