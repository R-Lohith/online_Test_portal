import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const TestInterface = () => {
    const { level } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const mockQuestions = [
                    { _id: '1', questionText: 'What is 1 + 1?', options: ['1', '2', '3', '4'] },
                    { _id: '2', questionText: 'Capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'] }
                ];
                const simulateFetch = () => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve(mockQuestions) }), 500));
                
                const response = await simulateFetch();
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data);
                }
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [level]);

    const handleOptionSelect = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        setLoading(true);
        try {
            // Format answers for backend
            const formattedAnswers = questions.map(q => ({
                questionId: q._id,
                selectedAnswer: answers[q._id],
                questionType: q.type
            }));

            const userId = localStorage.getItem('userId') || user?.uid;

            const simulateSubmit = () => new Promise(resolve => setTimeout(() => resolve({ 
                ok: true, 
                json: () => Promise.resolve({
                    result: { status: 'Pass', score: questions.length, totalQuestions: questions.length },
                    unlockedNextLevel: true
                }) 
            }), 500));

            const response = await simulateSubmit();

            if (response.ok) {
                const data = await response.json();
                setResult(data);
                setSubmitted(true);
            }
        } catch (error) {
            console.error("Submit failed", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    if (submitted && result) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Test Results</h1>
                <div className={`p-6 rounded-lg text-white ${result.result.status === 'Pass' ? 'bg-green-500' : 'bg-red-500'}`}>
                    <h2 className="text-2xl font-bold">Status: {result.result.status}</h2>
                    <p className="text-xl">Score: {result.result.score} / {result.result.totalQuestions}</p>
                    {result.unlockedNextLevel && (
                        <p className="mt-2 font-bold bg-white text-green-600 p-2 rounded inline-block">
                            Next Level Unlocked!
                        </p>
                    )}
                </div>
                <button
                    onClick={() => navigate('/student/dashboard')}
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{level} Level Test</h1>
                <span className="text-gray-600">Questions: {questions.length}</span>
            </div>

            <div className="space-y-6">
                {questions.map((q, index) => (
                    <div key={q._id} className="bg-white p-6 rounded shadow border">
                        <h2 className="text-lg font-semibold mb-3">Q{index + 1}: {q.questionText}</h2>
                        <div className="space-y-2">
                            {q.options.map((opt, i) => (
                                <label key={i} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="radio"
                                        name={`q-${q._id}`}
                                        value={opt}
                                        checked={answers[q._id] === opt}
                                        onChange={() => handleOptionSelect(q._id, opt)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg"
                >
                    Submit Test
                </button>
            </div>
        </div>
    );
};

export default TestInterface;
