import express from 'express';
import Student from '../models/Student.js';
import ManualQuestion from '../models/ManualQuestion.js';
import AIQuestion from '../models/AIQuestion.js';
import StudentResult from '../models/StudentResult.js';

const router = express.Router();

// @route   GET /api/student/questions/:level
// @desc    Get questions for a specific level
// @access  Student
router.get('/questions/:level', async (req, res) => {
    try {
        const { level } = req.params;
        // Limit number of questions per test? Let's say 10 mixed
        const manualQs = await ManualQuestion.aggregate([
            { $match: { difficulty: level } },
            { $sample: { size: 5 } }
        ]);

        const aiQs = await AIQuestion.aggregate([
            { $match: { difficulty: level } },
            { $sample: { size: 5 } }
        ]);

        const questions = [...manualQs.map(q => ({ ...q, type: 'Manual' })), ...aiQs.map(q => ({ ...q, type: 'AI' }))];
        // Shuffle
        const shuffled = questions.sort(() => 0.5 - Math.random());

        res.json(shuffled);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   POST /api/student/submit
// @desc    Submit test results
// @access  Student
router.post('/submit', async (req, res) => {
    try {
        const { studentId, level, answers } = req.body;

        // Calculate Score
        let score = 0;
        const totalQuestions = answers.length;
        const processedAnswers = [];

        for (let ans of answers) {
            // client sends { questionId, selectedAnswer, questionType }
            let question;
            if (ans.questionType === 'Manual') {
                question = await ManualQuestion.findById(ans.questionId);
            } else {
                question = await AIQuestion.findById(ans.questionId);
            }

            const isCorrect = question && question.correctAnswer === ans.selectedAnswer;
            if (isCorrect) score++;

            processedAnswers.push({
                questionId: ans.questionId,
                questionType: ans.questionType,
                selectedAnswer: ans.selectedAnswer,
                correctAnswer: question ? question.correctAnswer : 'N/A', // Security measure?
                isCorrect
            });
        }

        const passPercentage = 60; // Example passing criteria
        const percentage = (score / totalQuestions) * 100;
        const status = percentage >= passPercentage ? 'Pass' : 'Fail';

        // Save result
        // First find the actual student document to link correctly
        const studentDoc = await Student.findOne({ user: studentId });
        if (!studentDoc) return res.status(404).json({ message: 'Student profile not found' });

        const result = new StudentResult({
            studentId: studentDoc._id,
            level,
            score,
            totalQuestions,
            status,
            answers: processedAnswers
        });
        await result.save();

        // Unlock next level if passed
        if (status === 'Pass') {
            const student = await Student.findOne({ user: studentId }); // studentId here is actually userId from frontend
            if (student) {
                let nextLevel = '';
                if (level === 'Easy') nextLevel = 'Medium';
                if (level === 'Medium') nextLevel = 'Hard';

                if (nextLevel && !student.unlockedLevels.includes(nextLevel)) {
                    student.unlockedLevels.push(nextLevel);
                    // Update current level if it's the next logical step
                    if (student.currentLevel === level) {
                        student.currentLevel = nextLevel;
                    }
                    await student.save();
                }
            }
        }

        res.json({ result, unlockedNextLevel: status === 'Pass' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   GET /api/student/:id/history
// @desc    Get student test history
// @access  Student
router.get('/:id/history', async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.params.id });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const results = await StudentResult.find({ studentId: student._id }).sort({ attemptedAt: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   GET /api/student/:id/profile
// @desc    Get student profile (levels)
// @access  Student
router.get('/:id/profile', async (req, res) => {
    try {
        // Find student by the User ID (which is passed as :id)
        const student = await Student.findOne({ user: req.params.id });
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

export default router;
