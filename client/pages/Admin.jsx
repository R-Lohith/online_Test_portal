import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Award, TrendingUp, FileText, Plus, PlusCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const adminName = user?.username || 'Administrator';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("[Admin] VITE_API_URL is not set!");
      setLoadingTopics(false);
      return;
    }
    const endpoint = `${apiUrl}/api/mcq/topics`;
    console.log("[Admin] GET", endpoint);

    fetch(endpoint)
      .then(async (res) => {
        if (res.status === 404) throw new Error("API endpoint not found (404)");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((d) => setTopics(Array.isArray(d) ? d : []))
      .catch((err) => { console.error("[Admin] Topics fetch error:", err.message); setTopics([]); })
      .finally(() => setLoadingTopics(false));
  }, []);

  const totalQuestions = topics.reduce((s, t) => s + t.total, 0);
  const totalTopics = topics.length;

  const stats = [
    { label: 'Total Topics', value: loadingTopics ? '…' : totalTopics, icon: FileText, from: '#6366f1', to: '#8b5cf6' },
    { label: 'Total Questions', value: loadingTopics ? '…' : totalQuestions, icon: Award, from: '#10b981', to: '#059669' },
    { label: 'Active Students', value: '—', icon: Users, from: '#f59e0b', to: '#d97706' },
    { label: 'Avg Performance', value: '—', icon: TrendingUp, from: '#3b82f6', to: '#2563eb' },
  ];

  const levelColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '0' }}>

      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #4f46e5 50%, #7c3aed 100%)',
        borderRadius: 20, padding: '40px 48px', marginBottom: 32, color: '#fff',
        boxShadow: '0 16px 48px rgba(79,70,229,0.35)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', fontSize: '1.5rem', flexShrink: 0 }}>
              👤
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{greeting} 👋 &nbsp;·&nbsp; BIT Test Portal</p>
              <h1 style={{ margin: '4px 0 0', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Welcome, {adminName}!</h1>
            </div>
          </div>
          <p style={{ margin: '6px 0 0', opacity: 0.8, fontSize: '1rem', maxWidth: 560, lineHeight: 1.65 }}>
            Manage your MCQ question bank — add questions manually or generate them instantly using AI.
          </p>

          {/* Quick action button */}
          <button
            onClick={() => navigate('/admin/questions')}
            style={{
              marginTop: 24, padding: '13px 28px', background: 'rgba(255,255,255,0.18)',
              border: '2px solid rgba(255,255,255,0.4)', borderRadius: 50, color: '#fff',
              fontWeight: 700, fontSize: '0.98rem', cursor: 'pointer', backdropFilter: 'blur(8px)',
              display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
          >
            <PlusCircle size={18} />
            Manage Question Bank
          </button>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 18, marginBottom: 32 }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '24px 20px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${s.from},${s.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={22} color="#fff" />
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Add Questions Card ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>

        {/* Manual Entry */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '2px solid #e0e7ff', cursor: 'pointer', transition: 'all 0.2s' }}
          onClick={() => navigate('/admin/questions')}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e7ff'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}
        >
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Plus size={26} color="#fff" />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>Manual Entry</h3>
          <p style={{ margin: '0 0 18px', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.55 }}>
            Write your own questions with custom options. Choose topic, level, and mark the correct answer.
          </p>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 5 }}>
            Go to Manual Entry →
          </span>
        </div>

        {/* AI Generate */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '2px solid #ede9fe', cursor: 'pointer', transition: 'all 0.2s' }}
          onClick={() => navigate('/admin/questions')}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#ede9fe'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}
        >
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: '1.5rem' }}>
            🤖
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>AI Generate</h3>
          <p style={{ margin: '0 0 18px', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.55 }}>
            Let Gemini 2.5 Flash auto-generate MCQs for any topic instantly. Questions saved directly to MongoDB.
          </p>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 5 }}>
            Go to AI Generate →
          </span>
        </div>
      </div>

      {/* ── Question Bank Overview ─────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 18, padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>📦 Question Bank Overview</h2>
            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>Overview of all question topics and difficulty levels</p>
          </div>
          <button onClick={() => navigate('/admin/questions')} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
            + Add Questions
          </button>
        </div>

        {loadingTopics ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>Loading…</div>
        ) : topics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>📭</div>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>No questions yet. <button onClick={() => navigate('/admin/questions')} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Add questions now →</button></p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Topic', 'Easy', 'Medium', 'Hard', 'Total', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topics.map((t) => {
                  const getCount = (lvl) => t.levels.find(l => l.level === lvl)?.count || 0;
                  return (
                    <tr key={t.collectionName} style={{ borderBottom: '1px solid #f8fafc' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px', fontWeight: 700, color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.95rem' }}>{t.displayName}</span>
                        </div>
                      </td>
                      {['easy', 'medium', 'hard'].map(lvl => (
                        <td key={lvl} style={{ padding: '14px' }}>
                          {getCount(lvl) > 0
                            ? <span style={{ background: `${levelColors[lvl]}18`, color: levelColors[lvl], padding: '4px 10px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 700 }}>{getCount(lvl)}</span>
                            : <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>—</span>}
                        </td>
                      ))}
                      <td style={{ padding: '14px', fontWeight: 800, color: '#1e293b' }}>{t.total}</td>
                      <td style={{ padding: '14px' }}>
                        <button onClick={() => navigate('/admin/questions')} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#f1f5f9', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>View →</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
