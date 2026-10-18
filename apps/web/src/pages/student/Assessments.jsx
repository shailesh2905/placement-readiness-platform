import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Assessments() {
  const { token } = useAuthStore();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/assessments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setAssessments(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, [token]);

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                          a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'ALL' || a.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-slate-700">Loading Skill Assessments Catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-primary-950 to-primary-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-primary-300 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Timed Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Skill Assessments & Coding Challenges
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Take timed adaptive technical and aptitude examinations to calibrate your placement readiness score and update your learning plan.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex items-center space-x-6 text-center">
          <div>
            <span className="text-xs text-slate-300 block font-medium">Available</span>
            <span className="text-2xl font-black text-white">{assessments.length}</span>
            <span className="text-[10px] text-slate-400 block">Tests</span>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div>
            <span className="text-xs text-slate-300 block font-medium">Evaluation</span>
            <span className="text-2xl font-black text-emerald-400">Instant</span>
            <span className="text-[10px] text-slate-400 block">Auto-Score</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Search assessments by topic or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Category Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'TECHNICAL', 'APTITUDE', 'COMMUNICATION'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  categoryFilter === cat ? 'bg-white text-navy-900 shadow-xs font-bold' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                {cat === 'ALL' ? 'All Domains' : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">All Levels</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-extrabold rounded-full border border-primary-200/60 uppercase tracking-wider">
                  {assessment.category}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full uppercase ${
                  assessment.difficulty === 'EASY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  assessment.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {assessment.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-navy-900 mb-2 leading-snug">
                {assessment.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                {assessment.description}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-5 border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1.5">
                  ⏱ <strong>{assessment.timeLimit} Mins</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  📝 <strong>{assessment._count?.questions || assessment.questions?.length || 5} Questions</strong>
                </span>
              </div>

              <button
                onClick={() => navigate(`/student/assessments/${assessment.id}`)}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white rounded-xl font-bold text-xs transition shadow-md shadow-primary-500/20 flex items-center justify-center gap-2"
              >
                <span>Start Timed Exam</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ))}

        {filteredAssessments.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
            <p className="text-base font-bold text-navy-900">No assessments found</p>
            <p className="text-xs text-slate-400">Try adjusting your domain filter or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
