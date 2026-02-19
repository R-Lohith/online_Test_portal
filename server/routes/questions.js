import express from 'express';
import ManualQuestion from '../models/ManualQuestion.js';
import AIQuestion from '../models/AIQuestion.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is admin (placeholder if auth.js doesn't export it yet)
const isAdmin = (req, res, next) => {
    // Implement actual admin check based on your auth setup
    // For now, assuming request comes from an admin if they hit these routes
    next();
};

// @route   POST /api/questions/manual
// @desc    Add a manual question
// @access  Admin
router.post('/manual', async (req, res) => {
    try {
        const { subject, topic, difficulty, questionText, options, correctAnswer } = req.body;

        const newQuestion = new ManualQuestion({
            subject,
            topic,
            difficulty,
            questionText,
            options,
            correctAnswer
        });

        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   POST /api/questions/ai/generate
// @desc    Generate AI questions (Mock)
// @access  Admin
router.post('/ai/generate', async (req, res) => {
    try {
        const { subject, topic, difficulty, count } = req.body;

        // Mock AI Generation Logic
        const generatedQuestions = [];
        for (let i = 0; i < count; i++) {
            generatedQuestions.push({
                subject,
                topic,
                difficulty,
                questionText: `[AI Generated] Question ${i + 1} about ${topic} (${difficulty})`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 'Option A'
            });
        }

        const savedQuestions = await AIQuestion.insertMany(generatedQuestions);
        res.status(201).json(savedQuestions);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   GET /api/questions
// @desc    Get questions (Manual + AI)
// @access  Public/Private
router.get('/', async (req, res) => {
    try {
        const { difficulty, type } = req.query;
        let questions = [];

        if (!type || type === 'manual') {
            const manualQuery = difficulty ? { difficulty } : {};
            const manualQs = await ManualQuestion.find(manualQuery);
            questions = [...questions, ...manualQs.map(q => ({ ...q.toObject(), type: 'Manual' }))];
        }

        if (!type || type === 'ai') {
            const aiQuery = difficulty ? { difficulty } : {};
            const aiQs = await AIQuestion.find(aiQuery);
            questions = [...questions, ...aiQs.map(q => ({ ...q.toObject(), type: 'AI' }))];
        }

        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

export default router;
