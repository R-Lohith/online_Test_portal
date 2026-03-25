import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, CheckCircle2, XCircle,
    Clock, BookOpen, Award, RotateCcw, ArrowLeft,
} from 'lucide-react';

// ── tiny helpers ──────────────────────────────────────────────────────────────
const levelMeta = {
    easy: { label: 'Easy', emoji: '🟢', accent: '#10b981', light: '#d1fae5', dark: '#065f46' },
    medium: { label: 'Medium', emoji: '🟡', accent: '#f59e0b', light: '#fef3c7', dark: '#92400e' },
    hard: { label: 'Hard', emoji: '🔴', accent: '#ef4444', light: '#fee2e2', dark: '#991b1b' },
};

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function useTimer(running) {
    const [elapsed, setElapsed] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        if (running) {
            ref.current = setInterval(() => setElapsed(s => s + 1), 1000);
        } else {
            clearInterval(ref.current);
        }
        return () => clearInterval(ref.current);
    }, [running]);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    return `${mm}:${ss}`;
}

// ═════════════════════════════════════════════════════════════════════════════
const TopicTestPage = () => {
    const { topicKey } = useParams();           // collectionName from URL
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const level = params.get('level') || 'easy';
    const displayName = params.get('name') || decodeURIComponent(topicKey);
    const meta = levelMeta[level] || levelMeta.easy;

    // ── state ──────────────────────────────────────────────────────────────────
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});   // { qId: selectedOption }
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [timerOn, setTimerOn] = useState(false);
    const elapsed = useTimer(timerOn && !submitted);

    // ── fetch questions ────────────────────────────────────────────────────────
    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Mock questions data
            const mockQuestions = [
                { _id: 'q1', questionText: 'What is the output of 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4' },
                { _id: 'q2', questionText: 'Which keyword is used to declare a block-scoped variable?', options: ['var', 'let', 'const', 'both let and const'], correctAnswer: 'both let and const' },
                { _id: 'q3', questionText: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Model', 'Document Oriented Model', 'Data Oriented Model'], correctAnswer: 'Document Object Model' },
                { _id: 'q4', questionText: 'Is JavaScript statically typed?', options: ['Yes', 'No', 'Sometimes', 'Partially'], correctAnswer: 'No' },
                { _id: 'q5', questionText: 'Which function is used to serialize an object into a JSON string?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.serialize()', 'JSON.toString()'], correctAnswer: 'JSON.stringify()' }
            ];

            const simulateFetch = () => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve(mockQuestions) }), 500));
            const res = await simulateFetch();
            const data = await res.json();
            
            if (!Array.isArray(data) || data.length === 0) {
                setError('No questions found for this topic and level.');
                setQuestions([]);
            } else {
                setQuestions(shuffle(data));
                setTimerOn(true);
            }
        } catch (err) {
            setError('Failed to load questions. Please try again.');
        }
        setLoading(false);
    }, [topicKey, level]);

    useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

    // ── answer selection ───────────────────────────────────────────────────────
    const selectAnswer = (qId, option) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qId]: option }));
    };

    // ── navigation ─────────────────────────────────────────────────────────────
    const goPrev = () => setCurrent(c => Math.max(0, c - 1));
    const goNext = () => setCurrent(c => Math.min(questions.length - 1, c + 1));

    // ── submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = () => {
        const unanswered = questions.filter(q => !answers[q._id]);
        if (unanswered.length > 0) {
            const proceed = window.confirm(
                `You have ${unanswered.length} unanswered question(s). Submit anyway?`
            );
            if (!proceed) return;
        }
        setTimerOn(false);
        setSubmitted(true);

        // calculate locally (correctAnswer is plain text in the DB)
        let score = 0;
        const details = questions.map(q => {
            const selected = answers[q._id] || null;
            const correct = selected === q.correctAnswer;
            if (correct) score++;
            return { ...q, selected, correct };
        });
        const percentage = Math.round((score / questions.length) * 100);
        setResult({ score, total: questions.length, percentage, details });
    };

    // ── retry ──────────────────────────────────────────────────────────────────
    const retry = () => {
        setSubmitted(false);
        setResult(null);
        setAnswers({});
        setCurrent(0);
        setQuestions(shuffle(questions));
        setTimerOn(true);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // LOADING
    // ─────────────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div style={{
                width: 56, height: 56, borderRadius: '50%',
                border: `4px solid ${meta.light}`,
                borderTop: `4px solid ${meta.accent}`,
                animation: 'spin 0.9s linear infinite',
            }} />
            <p className="text-gray-500 font-medium">Loading questions…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────────
    // ERROR
    // ─────────────────────────────────────────────────────────────────────────
    if (error) return (
        <div className="max-w-lg mx-auto mt-16 bg-white rounded-2xl shadow-lg p-10 text-center space-y-4">
            <div className="text-5xl">😕</div>
            <h2 className="text-xl font-bold text-gray-700">{error}</h2>
            <div className="flex gap-3 justify-center">
                <button
                    onClick={() => navigate('/mcq-tests')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={fetchQuestions}
                    className="px-5 py-2.5 rounded-xl text-white font-semibold transition"
                    style={{ background: meta.accent }}
                >
                    Retry
                </button>
            </div>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────────
    // RESULT SCREEN
    // ─────────────────────────────────────────────────────────────────────────
    if (submitted && result) {
        const passed = result.percentage >= 60;
        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">

                {/* Score banner */}
                <div
                    className="rounded-2xl p-8 text-white text-center shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${passed ? '#059669' : '#dc2626'}, ${passed ? '#10b981' : '#ef4444'})` }}
                >
                    <div className="text-5xl mb-3">{passed ? '🎉' : '😅'}</div>
                    <h1 className="text-3xl font-extrabold">{passed ? 'Well Done!' : 'Keep Practising!'}</h1>
                    <p className="mt-1 text-white/80 text-sm">{displayName} · {meta.emoji} {meta.label}</p>

                    <div className="mt-6 flex justify-center gap-8">
                        <div>
                            <p className="text-4xl font-black">{result.score}<span className="text-xl opacity-70">/{result.total}</span></p>
                            <p className="text-xs uppercase tracking-widest opacity-70 mt-1">Score</p>
                        </div>
                        <div className="w-px bg-white/30" />
                        <div>
                            <p className="text-4xl font-black">{result.percentage}%</p>
                            <p className="text-xs uppercase tracking-widest opacity-70 mt-1">Accuracy</p>
                        </div>
                        <div className="w-px bg-white/30" />
                        <div>
                            <p className="text-4xl font-black">{elapsed}</p>
                            <p className="text-xs uppercase tracking-widest opacity-70 mt-1">Time</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6 bg-white/20 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-3 rounded-full bg-white transition-all duration-700"
                            style={{ width: `${result.percentage}%` }}
                        />
                    </div>
                    <p className="text-xs mt-1.5 opacity-60">{passed ? 'Passed ✓ (≥60%)' : 'Need 60% to pass'}</p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 justify-center flex-wrap">
                    <button
                        onClick={() => navigate('/mcq-tests')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition shadow-sm"
                    >
                        <ArrowLeft size={16} /> All Topics
                    </button>
                    <button
                        onClick={retry}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition shadow-md hover:brightness-105"
                        style={{ background: meta.accent }}
                    >
                        <RotateCcw size={16} /> Try Again
                    </button>
                </div>

                {/* Question review */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <Award size={18} className="text-indigo-500" />
                        <h2 className="font-bold text-gray-700">Detailed Review</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {result.details.map((q, idx) => (
                            <div key={q._id} className="p-5">
                                {/* Question row */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`mt-0.5 flex-shrink-0 ${q.correct ? 'text-emerald-500' : 'text-red-400'}`}>
                                        {q.correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    </div>
                                    <p className="font-semibold text-gray-800 text-sm leading-relaxed">
                                        <span className="text-gray-400 mr-1">Q{idx + 1}.</span>
                                        {q.questionText}
                                    </p>
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
                                    {q.options.map((opt, i) => {
                                        const isCorrect = opt === q.correctAnswer;
                                        const isSelected = opt === q.selected;
                                        let bg = 'bg-gray-50 border-gray-200 text-gray-600';
                                        if (isCorrect) bg = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold';
                                        if (isSelected && !isCorrect) bg = 'bg-red-50 border-red-300 text-red-700 font-semibold';
                                        return (
                                            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm ${bg}`}>
                                                <span className="opacity-50 font-bold">{String.fromCharCode(65 + i)}.</span>
                                                <span className="flex-1">{opt}</span>
                                                {isCorrect && <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />}
                                                {isSelected && !isCorrect && <XCircle size={14} className="text-red-400 flex-shrink-0" />}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation badge if wrong */}
                                {!q.correct && q.selected && (
                                    <p className="ml-8 mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5 inline-block">
                                        ✅ Correct answer: <strong>{q.correctAnswer}</strong>
                                    </p>
                                )}
                                {!q.selected && (
                                    <p className="ml-8 mt-2 text-xs text-gray-400 italic">Not answered</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TEST SCREEN
    // ─────────────────────────────────────────────────────────────────────────
    const q = questions[current];
    const answered = Object.keys(answers).length;
    const progress = Math.round((answered / questions.length) * 100);

    return (
        <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">

            {/* ── Top bar ──────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl px-5 py-4 shadow-md flex items-center justify-between flex-wrap gap-3">
                <button
                    onClick={() => navigate('/mcq-tests')}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 font-semibold text-sm transition"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="flex items-center gap-4">
                    {/* Timer */}
                    <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-gray-600">
                        <Clock size={15} className="text-gray-400" /> {elapsed}
                    </div>

                    {/* Topic + level badge */}
                    <div className="flex items-center gap-2">
                        <BookOpen size={15} className="text-gray-400" />
                        <span className="font-bold text-gray-700 text-sm">{displayName}</span>
                        <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: meta.light, color: meta.dark }}
                        >
                            {meta.emoji} {meta.label}
                        </span>
                    </div>

                    {/* Question counter */}
                    <span className="text-xs text-gray-400 font-medium">
                        {current + 1} / {questions.length}
                    </span>
                </div>
            </div>

            {/* ── Progress bar ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl px-5 py-3 shadow-sm">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>{answered} answered</span>
                    <span>{questions.length - answered} remaining</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, background: meta.accent }}
                    />
                </div>
            </div>

            {/* ── Question card ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Accent top strip */}
                <div className="h-1.5" style={{ background: meta.accent }} />

                <div className="p-7">
                    {/* Question */}
                    <div className="flex items-start gap-3 mb-6">
                        <span
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: meta.accent }}
                        >
                            {current + 1}
                        </span>
                        <p className="text-gray-800 font-semibold text-lg leading-relaxed">{q.questionText}</p>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {q.options.map((opt, i) => {
                            const selected = answers[q._id] === opt;
                            return (
                                <button
                                    key={i}
                                    onClick={() => selectAnswer(q._id, opt)}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 text-sm font-medium"
                                    style={{
                                        borderColor: selected ? meta.accent : '#e2e8f0',
                                        background: selected ? meta.light : '#fafafa',
                                        color: selected ? meta.dark : '#374151',
                                        boxShadow: selected ? `0 0 0 3px ${meta.accent}22` : 'none',
                                    }}
                                >
                                    {/* Circle indicator */}
                                    <span
                                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                        style={{
                                            background: selected ? meta.accent : '#f1f5f9',
                                            color: selected ? '#fff' : '#64748b',
                                        }}
                                    >
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="flex-1 leading-snug">{opt}</span>
                                    {selected && (
                                        <CheckCircle2 size={18} style={{ color: meta.accent, flexShrink: 0 }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Navigation + Submit ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 flex-wrap">

                {/* Prev */}
                <button
                    onClick={goPrev}
                    disabled={current === 0}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                {/* Question dots (max 10 shown) */}
                <div className="flex gap-1.5 flex-wrap justify-center">
                    {questions.slice(0, 15).map((qd, idx) => (
                        <button
                            key={qd._id}
                            onClick={() => setCurrent(idx)}
                            className="w-7 h-7 rounded-full text-xs font-bold transition-all border-2"
                            style={{
                                background: answers[qd._id]
                                    ? (idx === current ? meta.accent : `${meta.accent}aa`)
                                    : (idx === current ? '#e2e8f0' : '#f8fafc'),
                                borderColor: idx === current ? meta.accent : 'transparent',
                                color: answers[qd._id] ? '#fff' : '#94a3b8',
                            }}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    {questions.length > 15 && (
                        <span className="text-xs text-gray-400 self-center">…+{questions.length - 15}</span>
                    )}
                </div>

                {/* Next or Submit */}
                {current < questions.length - 1 ? (
                    <button
                        onClick={goNext}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition hover:brightness-105 shadow-md"
                        style={{ background: meta.accent }}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-white font-bold text-sm transition hover:brightness-105 shadow-md"
                        style={{ background: '#6366f1' }}
                    >
                        <CheckCircle2 size={16} /> Submit Test
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopicTestPage;
