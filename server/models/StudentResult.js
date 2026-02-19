import mongoose from 'mongoose';

const StudentResultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    level: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pass', 'Fail'],
        required: true,
    },
    answers: [{
        questionId: String,
        questionType: { type: String, enum: ['Manual', 'AI'] },
        selectedAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean
    }],
    attemptedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('StudentResult', StudentResultSchema);
