import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rollNumber: { type: String, unique: true, sparse: true },
    department: { type: String },
    year: { type: String },
    section: { type: String },
    currentLevel: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    unlockedLevels: { type: [String], enum: ['Easy', 'Medium', 'Hard'], default: ['Easy'] },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Student", studentSchema);
