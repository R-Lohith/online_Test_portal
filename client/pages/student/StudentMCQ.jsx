import { useEffect, useState } from 'react';

const StudentMCQ = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(()=>{ fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    const mockData = [
      { _id: '1', source: 'manual', questionText: 'What is React?', options: ['Library', 'Framework', 'Language', 'Tool'], correctAnswer: 'Library' },
      { _id: '2', source: 'ai', questionText: 'HTML stands for?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyper Loop Machine Language', 'None'], correctAnswer: 'Hyper Text Markup Language' }
    ];
    setQuestions(mockData);
  };

  const selectAnswer = (qId, source, idx) => {
    setAnswers((prev)=>({ ...prev, [qId+"::"+source]: idx }));
  };

  const handleSubmit = async () => {
    const payload = { studentId: 'guest', answers: Object.entries(answers).map(([k,v])=>{ const [id, source] = k.split('::'); return { questionId: id, source, selectedIndex: v } }) };
    // Mock validation
    let score = 0;
    payload.answers.forEach(ans => {
      const q = questions.find(x => x._id === ans.questionId && x.source === ans.source);
      if (q && q.options[ans.selectedIndex] === q.correctAnswer) score++;
    });
    setResult({ score, total: questions.length });
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
