import mongoose from 'mongoose';

const AnswerRecord = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  source: { type: String, enum: ['manual', 'ai'], required: true },
  selectedIndex: { type: Number, required: true },
  correctIndex: { type: Number, required: true },
  correct: { type: Boolean, required: true }
});

const ResultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  answers: { type: [AnswerRecord], required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Result', ResultSchema);
