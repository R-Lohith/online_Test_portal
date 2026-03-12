import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';

// ─── Centered popup toast ────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast || toast.type === 'loading') return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: '✅',
    error: '❌',
    loading: '⏳',
  };
  const colors = {
    success: { accent: '#10b981', bg: '#ecfdf5', text: '#065f46' },
    error: { accent: '#ef4444', bg: '#fef2f2', text: '#991b1b' },
    loading: { accent: '#6366f1', bg: '#eef2ff', text: '#3730a3' },
  };
  const c = colors[toast.type] || colors.success;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.2s ease',
    }}
      onClick={toast.type !== 'loading' ? onClose : undefined}
    >
      <div style={{
        background: '#fff', borderRadius: 24, padding: '44px 52px',
        maxWidth: 460, width: '90%', textAlign: 'center',
        boxShadow: `0 32px 80px ${c.accent}33, 0 8px 32px rgba(0,0,0,0.12)`,
        animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        borderTop: `4px solid ${c.accent}`,
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          width: 70, height: 70, borderRadius: '50%',
          background: c.bg, border: `2px solid ${c.accent}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 20px',
        }}>
          {toast.type === 'loading'
            ? <div style={{ width: 32, height: 32, border: `3px solid ${c.accent}33`, borderTop: `3px solid ${c.accent}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            : icons[toast.type]}
        </div>
        <h3 style={{ margin: '0 0 10px', fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{toast.title}</h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: '1rem', lineHeight: 1.65 }}>{toast.message}</p>
        {toast.type !== 'loading' && (
          <button onClick={onClose} style={{
            marginTop: 28, padding: '11px 36px', borderRadius: 50, border: 'none',
            background: c.accent, color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
          }}>OK</button>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

// ─── Small helpers ───────────────────────────────────────────────────────────
const LevelBadge = ({ level }) => {
  const s = { easy: ['#d1fae5', '#065f46'], medium: ['#fef3c7', '#92400e'], hard: ['#fee2e2', '#991b1b'] };
  const [bg, col] = s[level] || s.easy;
  return <span style={{ background: bg, color: col, padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize' }}>{level}</span>;
};
const SourceBadge = ({ source }) => (
  <span style={{
    padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
    background: source === 'ai' ? '#ede9fe' : '#e0f2fe',
    color: source === 'ai' ? '#5b21b6' : '#0369a1',
  }}>{source === 'ai' ? '🤖 AI' : '✍️ Manual'}</span>
);

const inp = { width: '100%', padding: '11px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: '0.95rem', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', transition: 'border-color 0.2s' };
const FInput = (props) => { const [f, setF] = useState(false); return <input {...props} style={{ ...inp, ...props.style, borderColor: f ? '#6366f1' : '#e2e8f0' }} onFocus={() => setF(true)} onBlur={() => setF(false)} />; };
const FTextarea = (props) => { const [f, setF] = useState(false); return <textarea {...props} rows={3} style={{ ...inp, ...props.style, borderColor: f ? '#6366f1' : '#e2e8f0', resize: 'vertical' }} onFocus={() => setF(true)} onBlur={() => setF(false)} />; };
const FSelect = ({ children, ...props }) => { const [f, setF] = useState(false); return <select {...props} style={{ ...inp, borderColor: f ? '#6366f1' : '#e2e8f0', cursor: 'pointer' }} onFocus={() => setF(true)} onBlur={() => setF(false)}>{children}</select>; };
const Field = ({ label, children }) => <div style={{ marginBottom: 18 }}><label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{label}</label>{children}</div>;

// ════════════════════════════════════════════════════════════════════════════
const ManageQuestions = () => {
  const { user } = useAuth();
  const adminName = user?.username || 'Administrator';

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const [tab, setTab] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Topics list (for browse tab)
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

  // Questions within a selected topic
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [qLoading, setQLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState('');

  // Manual form
  const [mf, setMf] = useState({ topic: '', subject: '', level: 'easy', questionText: '', options: ['', '', '', ''], correctAnswer: '' });

  // AI form
  const [af, setAf] = useState({ topic: '', subject: '', level: 'easy', count: 5 });


  // ── Load topics ───────────────────────────────────────────────────────────
  const loadTopics = useCallback(async () => {
    setTopicsLoading(true);
    try {
      const r = await fetch('/api/mcq/topics');
      const d = await r.json();
      setTopics(Array.isArray(d) ? d : []);
    } catch { setTopics([]); }
    setTopicsLoading(false);
  }, []);

  // ── Load questions for selected topic ─────────────────────────────────────
  const loadQuestions = useCallback(async (topicName, level = '') => {
    if (!topicName) { setQuestions([]); return; }
    setQLoading(true);
    try {
      const p = new URLSearchParams({ topic: topicName });
      if (level) p.set('level', level);
      const r = await fetch(`/api/mcq/questions?${p}`);
      const d = await r.json();
      setQuestions(Array.isArray(d) ? d : []);
    } catch { setQuestions([]); }
    setQLoading(false);
  }, []);

  useEffect(() => { if (tab === 'browse') loadTopics(); }, [tab, loadTopics]);
  useEffect(() => { if (selectedTopic) loadQuestions(selectedTopic, filterLevel); }, [selectedTopic, filterLevel, loadQuestions]);

  // ── Manual form handlers ──────────────────────────────────────────────────
  const handleMfChange = e => setMf(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleOptChange = (i, v) => { const o = [...mf.options]; o[i] = v; setMf(f => ({ ...f, options: o })); };
  const resetManual = () => setMf({ topic: '', subject: '', level: 'easy', questionText: '', options: ['', '', '', ''], correctAnswer: '' });

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const filled = mf.options.filter(Boolean);
    if (!mf.topic || !mf.level || !mf.questionText || filled.length < 2 || !mf.correctAnswer) {
      setToast({ type: 'error', title: 'Missing Fields', message: 'Please fill in all fields and at least 2 options.' });
      return;
    }
    if (!filled.includes(mf.correctAnswer)) {
      setToast({ type: 'error', title: 'Invalid Answer', message: 'Correct answer must match one of the options.' });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch('/api/mcq/manual', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mf, options: filled }),
      });
      const d = await r.json();
      if (r.ok) {
        setToast({
          type: 'success',
          title: '✅ Question Saved!',
          message: `Question stored in MongoDB collection "${d.collection}" under level "${d.level}".`,
        });
        resetManual();
        loadTopics();
      } else {
        setToast({ type: 'error', title: 'Failed', message: d.message });
      }
    } catch (err) { setToast({ type: 'error', title: 'Network Error', message: err.message }); }
    setLoading(false);
  };

  // ── AI form submit ─────────────────────────────────────────────────────────
  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!af.topic || !af.level) {
      setToast({ type: 'error', title: 'Missing Fields', message: 'Topic and level are required.' });
      return;
    }
    setLoading(true);
    setToast({ type: 'loading', title: '🤖 Gemini is generating…', message: `Creating ${af.count} "${af.level}" level questions for topic "${af.topic}"…` });
    try {
      const r = await fetch('/api/mcq/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(af),
      });
      const d = await r.json();
      if (r.ok) {
        setToast({
          type: 'success',
          title: '🎉 AI Questions Generated!',
          message: `${d.createdCount} questions saved to MongoDB collection "${d.collection}" (${d.level} level).`,
        });
        setAf(f => ({ ...f, topic: '', subject: '' }));
        loadTopics();
      } else {
        setToast({ type: 'error', title: 'AI Generation Failed', message: d.message });
      }
    } catch (err) { setToast({ type: 'error', title: 'Network Error', message: err.message }); }
    setLoading(false);
  };


  // ── Delete question ────────────────────────────────────────────────────────
  const handleDelete = async (qid, topicCol) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await fetch(`/api/mcq/questions/${topicCol}/${qid}`, { method: 'DELETE' });
      setQuestions(qs => qs.filter(q => q._id !== qid));
      setToast({ type: 'success', title: 'Deleted', message: 'Question removed from the collection.' });
      loadTopics();
    } catch (err) { setToast({ type: 'error', title: 'Error', message: err.message }); }
  };

  // ── Tabs config ────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'manual', label: '✍️ Manual Entry', color: '#6366f1' },
    { id: 'ai', label: '🤖 AI Generate', color: '#7c3aed' },
    { id: 'browse', label: '📚 Browse Topics', color: '#0ea5e9' },
  ];

  // ── Level order for display ────────────────────────────────────────────────
  const levelOrder = ['easy', 'medium', 'hard'];
  const levelColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0f4ff,#faf5ff)', padding: '32px 24px', fontFamily: 'Inter,sans-serif' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Welcome Header ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg,#1e3a8a 0%,#4f46e5 50%,#7c3aed 100%)',
        borderRadius: 20, padding: '36px 44px', marginBottom: 32, color: '#fff',
        boxShadow: '0 16px 48px rgba(79,70,229,0.3)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            border: '2px solid rgba(255,255,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', flexShrink: 0, backdropFilter: 'blur(10px)',
          }}>
            👤
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.75, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {greeting} 👋
            </p>
            <h1 style={{ margin: '4px 0 6px', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Welcome, {adminName}!
            </h1>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.97rem', lineHeight: 1.55 }}>
              Manage your question bank — add questions manually or generate them instantly with AI.
            </p>
          </div>

          {/* Badge */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 50, padding: '8px 20px',
            backdropFilter: 'blur(8px)',
            fontSize: '0.85rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            🛡️ Administrator
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '12px 28px', borderRadius: 50, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s',
            background: tab === t.id ? t.color : '#fff',
            color: tab === t.id ? '#fff' : '#64748b',
            boxShadow: tab === t.id ? `0 6px 20px ${t.color}55` : '0 2px 8px rgba(0,0,0,0.08)',
            transform: tab === t.id ? 'translateY(-2px)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Card */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '36px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', maxWidth: tab === 'browse' ? 1100 : 700 }}>

        {/* ── MANUAL ENTRY ─────────────────────────────────────────────────── */}
        {tab === 'manual' && (
          <>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>✍️ Manual Question Entry</h2>
            <p style={{ margin: '0 0 28px', color: '#94a3b8', fontSize: '0.92rem' }}>
              Enter a topic and difficulty level, fill in the question and options, then save.
            </p>
            <form onSubmit={handleManualSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Topic *">
                  <FInput name="topic" value={mf.topic} onChange={handleMfChange} placeholder='e.g. React, Node.js, MongoDB…' required />
                </Field>
                <Field label="Subject (optional)">
                  <FInput name="subject" value={mf.subject} onChange={handleMfChange} placeholder='e.g. Web Development…' />
                </Field>
              </div>

              <Field label="Difficulty Level *">
                <FSelect name="level" value={mf.level} onChange={handleMfChange}>
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </FSelect>
              </Field>

              <Field label="Question Text *">
                <FTextarea name="questionText" value={mf.questionText} onChange={handleMfChange} placeholder="Type the question…" required />
              </Field>

              <Field label="Options (min 2) *">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {mf.options.map((opt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6366f1', flexShrink: 0, fontSize: '0.85rem' }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <FInput value={opt} onChange={e => handleOptChange(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="Correct Answer *">
                <FSelect name="correctAnswer" value={mf.correctAnswer} onChange={handleMfChange} required>
                  <option value="">Select the correct option…</option>
                  {mf.options.map((opt, i) => opt ? <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option> : null)}
                </FSelect>
              </Field>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" disabled={loading} style={{
                  flex: 1, padding: '14px 0', borderRadius: 12, border: 'none',
                  background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                }}>{loading ? '⏳ Saving…' : '💾 Save Question'}</button>
                <button type="button" onClick={resetManual} style={{ padding: '14px 24px', borderRadius: 12, border: '2px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Reset</button>
              </div>
            </form>
          </>
        )}

        {/* ── AI GENERATE ──────────────────────────────────────────────────── */}
        {tab === 'ai' && (
          <>
            <h2 style={{ margin: '0 0 24px', fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>🤖 AI Question Generator</h2>

            <form onSubmit={handleAiSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Topic *">
                  <FInput value={af.topic} onChange={e => setAf(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. React, JavaScript, SQL…" required />
                </Field>
                <Field label="Subject (optional)">
                  <FInput value={af.subject} onChange={e => setAf(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Frontend, Backend…" />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Difficulty Level *">
                  <FSelect value={af.level} onChange={e => setAf(f => ({ ...f, level: e.target.value }))}>
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                  </FSelect>
                </Field>
                <Field label="Number of Questions">
                  <FInput type="number" value={af.count} onChange={e => setAf(f => ({ ...f, count: parseInt(e.target.value) || 5 }))} min={1} max={20} />
                </Field>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '15px 0', borderRadius: 12, border: 'none', marginTop: 8,
                background: loading ? '#c4b5fd' : 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                color: '#fff', fontWeight: 700, fontSize: '1.05rem', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(124,58,237,0.35)',
              }}>{loading ? '⏳ Gemini is generating…' : '✨ Generate with Gemini AI'}</button>
            </form>
          </>
        )}

        {/* ── BROWSE TOPICS ─────────────────────────────────────────────────── */}
        {tab === 'browse' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>Browse Topics</h2>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.92rem' }}>View and manage questions organized by topic.</p>
              </div>
              <button onClick={loadTopics} style={{
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: '#fff',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
              }}>🔄 Refresh</button>
            </div>

            {/* Topic cards grid */}
            {topicsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                Loading topics…
              </div>
            ) : topics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>📭</div>
                <p style={{ fontSize: '1.1rem' }}>No topic collections yet. Add questions via Manual or AI tab!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginBottom: 32 }}>
                {topics.map(t => (
                  <div key={t.collectionName} onClick={() => { setSelectedTopic(t.collectionName); setFilterLevel(''); }}
                    style={{
                      border: selectedTopic === t.collectionName ? '2px solid #6366f1' : '2px solid #e2e8f0',
                      borderRadius: 14, padding: '20px', cursor: 'pointer',
                      background: selectedTopic === t.collectionName ? '#eef2ff' : '#fafafa',
                      transition: 'all 0.2s', boxShadow: selectedTopic === t.collectionName ? '0 4px 16px rgba(99,102,241,0.2)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>{t.displayName}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      {levelOrder.map(l => {
                        const found = t.levels.find(x => x.level === l);
                        return found ? (
                          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${levelColors[l]}18`, borderRadius: 8, padding: '4px 10px' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: levelColors[l] }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: levelColors[l], textTransform: 'capitalize' }}>{l}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>({found.count})</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total: {t.total} question{t.total !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Questions panel for selected topic */}
            {selectedTopic && (
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>
                    Questions — {topics.find(t => t.collectionName === selectedTopic)?.displayName || selectedTopic}
                  </h3>
                  <FSelect value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ width: 'auto', padding: '8px 14px' }}>
                    <option value="">All Levels</option>
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                  </FSelect>
                  <button onClick={() => setSelectedTopic('')} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>✕ Close</button>
                </div>

                {qLoading ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                    <div style={{ width: 28, height: 28, border: '3px solid #e2e8f0', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
                    Loading…
                  </div>
                ) : questions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>No questions found for this filter.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {questions.map((q, idx) => (
                      <div key={q._id} style={{ background: '#f8fafc', borderRadius: 14, padding: '18px 22px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{idx + 1}</span>
                            <LevelBadge level={q.level} />
                            <SourceBadge source={q.source} />
                            {q.subject && <span style={{ background: '#f1f5f9', color: '#64748b', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem' }}>{q.subject}</span>}
                          </div>
                          <button onClick={() => handleDelete(q._id, q._topic || selectedTopic)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0 }}>🗑 Delete</button>
                        </div>
                        <p style={{ margin: '0 0 10px', fontWeight: 600, color: '#1e293b', lineHeight: 1.55 }}>{q.questionText}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                          {q.options.map((opt, i) => (
                            <div key={i} style={{ padding: '7px 12px', borderRadius: 8, fontSize: '0.87rem', border: `2px solid ${opt === q.correctAnswer ? '#10b981' : '#e2e8f0'}`, background: opt === q.correctAnswer ? '#d1fae5' : '#fff', color: opt === q.correctAnswer ? '#065f46' : '#475569', fontWeight: opt === q.correctAnswer ? 700 : 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ opacity: 0.55, fontWeight: 700 }}>{String.fromCharCode(65 + i)}.</span>{opt}
                              {opt === q.correctAnswer && <span style={{ marginLeft: 'auto' }}>✓</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


          </>
        )}
      </div>
    </div>
  );
};

export default ManageQuestions;
