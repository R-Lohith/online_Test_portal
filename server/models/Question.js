import mongoose from 'mongoose';

/**
 * Unified Question Schema
 * 
 * DB Structure:
 *   Collection: "questions"
 *   Each document belongs to a topic (e.g. "React") and a level (easy / medium / hard).
 *   The combination of topic + level acts as the hierarchical key.
 * 
 *   Example document:
 *   {
 *     topic: "React",
 *     subject: "Web Development",
 *     level: "easy",
 *     source: "manual" | "ai",
 *     questionText: "What is JSX?",
 *     options: ["A markup syntax", "A database", "A style sheet", "A server"],
 *     correctAnswer: "A markup syntax",   // plain text – NOT encrypted
 *     correctIndex: 0,                    // index of correct option
 *     createdAt: Date
 *   }
 */
const QuestionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    default: '',
    trim: true,
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    lowercase: true,
  },
  source: {
    type: String,
    enum: ['manual', 'ai'],
    required: true,
    default: 'manual',
  },
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (val) => val.length >= 2,
      message: 'At least 2 options are required',
    },
  },
  // Correct answer stored as PLAIN TEXT (no encryption)
  correctAnswer: {
    type: String,
    required: true,
    trim: true,
  },
  // Index of the correct option (0-based)
  correctIndex: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast lookups by topic + level
QuestionSchema.index({ topic: 1, level: 1 });

export default mongoose.model('Question', QuestionSchema);
