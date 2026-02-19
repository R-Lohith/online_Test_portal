import { useEffect, useState } from 'react';

const StudentMCQ = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(()=>{ fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    const res = await fetch('/api/mcq/questions');
    if (!res.ok) return;
    const j = await res.json();
    setQuestions(j);
  };

  const selectAnswer = (qId, source, idx) => {
    setAnswers((prev)=>({ ...prev, [qId+"::"+source]: idx }));
  };

  const handleSubmit = async () => {
    const payload = { studentId: 'guest', answers: Object.entries(answers).map(([k,v])=>{ const [id, source] = k.split('::'); return { questionId: id, source, selectedIndex: v } }) };
    const res = await fetch('/api/mcq/submit', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const j = await res.json();
    setResult(j);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Student MCQ Dashboard</h1>
        <p className="text-sm text-gray-600">Questions loaded from manual and AI collections.</p>
      </div>

      <div className="grid gap-4">
        {questions.map((q)=> (
          <div key={q._id + '::' + q.source} className="bg-white p-4 rounded shadow">
            <p className="font-medium">{q.questionText}</p>
            <div className="mt-2 space-y-2">
              {q.options.map((opt, idx)=>(
                <label key={idx} className="flex items-center gap-2">
                  <input type="radio" name={q._id+q.source} checked={answers[q._id+"::"+q.source]===idx} onChange={()=>selectAnswer(q._id, q.source, idx)} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Submit Answers</button>
        {result && <div className="text-sm">Score: {result.score}/{result.total}</div>}
      </div>
    </div>
  );
};

export default StudentMCQ;
