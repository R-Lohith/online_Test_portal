import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, BookOpen, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const levelMeta = {
  easy: { label: 'Easy', emoji: '🟢', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  medium: { label: 'Medium', emoji: '🟡', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
  hard: { label: 'Hard', emoji: '🔴', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
};

// Cycle colours for cards
const cardAccents = [
  { grad: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200' },
  { grad: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200' },
  { grad: 'from-teal-500 to-emerald-600', shadow: 'shadow-teal-200' },
  { grad: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-200' },
  { grad: 'from-orange-500 to-amber-600', shadow: 'shadow-orange-200' },
  { grad: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-200' },
];

const MCQTests = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // ── Fetch topics from DB ────────────────────────────────────────────────────
  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) throw new Error('API URL is not configured. Check VITE_API_URL env variable.');

      const endpoint = `${apiUrl}/api/mcq/topics`;
      console.log('[MCQTests] GET', endpoint);

      const res = await fetch(endpoint);

      if (res.status === 404) {
        throw new Error('API endpoint not found (404). Check backend route /api/mcq/topics.');
      }
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[MCQTests] fetchTopics error:', err.message);
      setError(err.message || 'Could not load topics.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = topics.filter(t => {
    const matchSearch = t.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel =
      selectedLevel === 'All' ||
      t.levels.some(l => l.level === selectedLevel.toLowerCase());
    return matchSearch && matchLevel;
  });

  // ── Navigate to test ────────────────────────────────────────────────────────
  const startTest = (topic, level) => {
    // encode topic name for URL safety
    const encoded = encodeURIComponent(topic.collectionName);
    navigate(`/mcq-tests/${encoded}?level=${level}&name=${encodeURIComponent(topic.displayName)}`);
  };

  // ── Empty / Loading states ──────────────────────────────────────────────────
  const renderEmpty = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-md">
      <div className="text-6xl mb-4">📭</div>
      <p className="text-xl font-semibold text-gray-700 mb-1">No tests found</p>
      <p className="text-gray-500 text-sm">
        {topics.length === 0
          ? 'No questions have been added yet. Ask your admin to add questions in Manage Questions.'
          : 'No tests match your current search or filter.'}
      </p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">📝 MCQ Tests</h1>
            <p className="text-blue-100 text-sm">
              Choose a topic and difficulty level to begin your assessment
            </p>
          </div>
          <button
            onClick={fetchTopics}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2.5 rounded-xl font-semibold transition-all text-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Search + Level filter ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search topics…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-400 focus:outline-none transition-colors text-sm"
            />
          </div>

          {/* Level pills */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'Easy', 'Medium', 'Hard'].map(lv => (
              <button
                key={lv}
                onClick={() => setSelectedLevel(lv)}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${selectedLevel === lv
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {lv === 'Easy' ? '🟢 ' : lv === 'Medium' ? '🟡 ' : lv === 'Hard' ? '🔴 ' : ''}{lv}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <Filter size={13} />
          <span>
            {loading
              ? 'Loading…'
              : `${filtered.length} topic${filtered.length !== 1 ? 's' : ''} available`}
          </span>
        </div>
      </div>

      {/* ── Error banner ────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm font-medium">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
              <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded-lg w-2/3" />
                <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
                <div className="flex gap-2 mt-4">
                  <div className="h-7 bg-gray-100 rounded-lg w-16" />
                  <div className="h-7 bg-gray-100 rounded-lg w-16" />
                </div>
                <div className="h-10 bg-gray-100 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Topic Cards ──────────────────────────────────────────────────────── */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0
            ? renderEmpty()
            : filtered.map((topic, idx) => {
              const accent = cardAccents[idx % cardAccents.length];
              const levels = topic.levels; // [{ level: 'easy', count: 5 }, ...]

              return (
                <div
                  key={topic.collectionName}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
                >
                  {/* Top gradient strip */}
                  <div className={`h-2 bg-gradient-to-r ${accent.grad}`} />

                  <div className="p-6">
                    {/* Title + icon */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${accent.grad} text-white shadow-md ${accent.shadow} flex-shrink-0`}>
                        <BookOpen size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-extrabold text-gray-800 leading-tight truncate">
                          {topic.displayName}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {topic.total} question{topic.total !== 1 ? 's' : ''} available
                        </p>
                      </div>
                    </div>

                    {/* Level breakdown chips */}
                    <div className="flex gap-2 flex-wrap mb-5">
                      {['easy', 'medium', 'hard'].map(lv => {
                        const found = levels.find(l => l.level === lv);
                        if (!found) return null;
                        const m = levelMeta[lv];
                        return (
                          <span
                            key={lv}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${m.bg} ${m.text} ${m.ring}`}
                          >
                            {m.emoji} {m.label}
                            <span className="opacity-60">({found.count})</span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Per-level start buttons */}
                    <div className="space-y-2">
                      {['easy', 'medium', 'hard'].map(lv => {
                        const found = levels.find(l => l.level === lv);
                        if (!found) return null;
                        const m = levelMeta[lv];
                        return (
                          <button
                            key={lv}
                            onClick={() => startTest(topic, lv)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all duration-200 font-semibold text-sm
                                ${m.bg} ${m.text} ${m.ring.replace('ring', 'border')}
                                hover:brightness-95 hover:shadow-sm group/btn`}
                          >
                            <span className="flex items-center gap-2">
                              <Zap size={14} />
                              Start {m.label} Test
                            </span>
                            <span className="text-xs opacity-60 group-hover/btn:opacity-100 transition-opacity">
                              {found.count} Qs →
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default MCQTests;
