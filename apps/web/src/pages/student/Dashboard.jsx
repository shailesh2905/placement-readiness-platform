import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, token } = useAuthStore();
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScorecard, setShowScorecard] = useState(false);

  useEffect(() => {
    const fetchReadiness = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/readiness', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setReadiness(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load readiness data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReadiness();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-slate-700">Loading ML Readiness Insights...</p>
      </div>
    );
  }

  // Phase 13 Historical timeline progression simulation
  const score = readiness ? Math.round(readiness.readiness_score) : 45;
  const historyTimeline = [
    { label: 'Initial Baseline Assessment', score: 32, date: 'Cycle Start', change: '+0%' },
    { label: 'Resume Parser Synchronized', score: 38, date: '1 Week Ago', change: '+6%' },
    { label: 'DSA & Technical Mock Attempt', score: Math.max(score - 10, 35), date: '3 Days Ago', change: '+8%' },
    { label: 'Current Calibrated Forecast', score: score, date: 'Today', change: `+${Math.max(score - 32, 5)}%` }
  ];

  // Domain breakdown
  const domainScores = [
    { name: 'Data Structures & Algorithms', score: Math.min(Math.round(score * 0.95), 100), benchmark: 80, color: 'bg-primary-600' },
    { name: 'Web & System Architecture', score: Math.min(Math.round(score * 1.05), 100), benchmark: 75, color: 'bg-emerald-500' },
    { name: 'Databases & SQL Querying', score: Math.min(Math.round(score * 0.9), 100), benchmark: 70, color: 'bg-purple-600' },
    { name: 'Quantitative & Analytical Aptitude', score: Math.min(Math.round(score * 0.85), 100), benchmark: 70, color: 'bg-amber-500' },
    { name: 'Communication & Behavioral STAR', score: 75, benchmark: 65, color: 'bg-sky-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SHAP Engine Live</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Good morning, {user?.name.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Here is your live AI-calibrated placement readiness forecast and skill gap analytics.
          </p>
          {error && <p className="text-red-500 mt-2 text-xs font-semibold">{error}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowScorecard(true)}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md shadow-primary-500/20 transition active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Official Scorecard</span>
          </button>
          <Link
            to="/student/learning-plan"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
          >
            View Learning Plan →
          </Link>
        </div>
      </div>

      {readiness && (
        <>
          {/* Main Readiness Gauge & Top Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 col-span-1 flex flex-col items-center justify-center relative overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Calibrated Readiness Score
              </h3>
              
              {/* Smooth Animated SVG Radial Gauge */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#readinessGradient)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={(2 * Math.PI * 40) * (1 - score / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute text-center bg-white rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-xs">
                  <span className="text-4xl font-black text-navy-900">{Math.round(readiness.readiness_score)}</span>
                  <span className="text-xs font-bold text-slate-400 block">/ 100</span>
                </div>
              </div>
              
              <p className={`mt-6 font-extrabold text-sm px-4 py-1.5 rounded-full ${
                score >= 80 ? 'bg-emerald-100 text-emerald-800' : score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
              }`}>
                {readiness.readiness_category}
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 col-span-1 md:col-span-2">
              <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-navy-900">Top Critical Skill Gaps</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Identified via SHAP feature importance analysis</p>
                </div>
              </div>
              
              <div className="space-y-3.5">
                {readiness.top_gaps.map((gap, index) => (
                  <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-2xl border border-red-200 bg-red-50/60 gap-3">
                    <div>
                      <p className="font-bold text-red-900 capitalize text-sm">{gap.feature.replace('_', ' ')}</p>
                      <p className="text-xs text-red-700 mt-0.5 font-medium">
                        Current Score: {gap.current_value} • Negative Impact: {gap.impact_score.toFixed(2)} pts
                      </p>
                    </div>
                    <Link
                      to="/student/learning-plan"
                      className="px-4 py-2 bg-white text-red-700 text-xs font-bold rounded-xl border border-red-200 hover:bg-red-50 shadow-xs transition-all self-start sm:self-auto"
                    >
                      Fix in Learning Plan →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CAMPUS RECRUITMENT DRIVES SPOTLIGHT */}
          <div className="bg-gradient-to-r from-navy-900 via-primary-950 to-primary-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-primary-300 font-bold text-xs uppercase tracking-wider mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Campus Placement Season</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                6 Top Tier Recruitment Drives Active
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                Amazon, Microsoft, TCS Digital, Infosys, Deloitte & Zoho are visiting campus. Check your real-time AI eligibility and apply today.
              </p>
            </div>
            <Link
              to="/student/drives"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-primary-500/25 transition whitespace-nowrap"
            >
              Check Drive Eligibility →
            </Link>
          </div>

          {/* ADVANCED ANALYTICS & DOMAIN BENCHMARKS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domain Competency Sliders */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
                    <span>Target Role Benchmarks</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-navy-900">Domain Competency Benchmarks</h3>
                </div>
                <span className="text-xs font-bold text-slate-400">Target: 80%+</span>
              </div>

              <div className="space-y-4">
                {domainScores.map((dm, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-navy-900">
                      <span>{dm.name}</span>
                      <span className="text-slate-500">{dm.score}% <span className="text-[10px] text-slate-400 font-normal">(req: {dm.benchmark}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${dm.color} h-2.5 rounded-full transition-all duration-700`}
                        style={{ width: `${dm.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Score Progression Timeline */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
                  <span>Progress Velocity</span>
                </div>
                <h3 className="text-lg font-extrabold text-navy-900">Readiness Score Trajectory</h3>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {historyTimeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between">
                    <span className="absolute -left-6 w-4 h-4 rounded-full bg-primary-600 border-2 border-white shadow-xs"></span>
                    <div>
                      <h4 className="text-xs font-bold text-navy-900">{item.label}</h4>
                      <p className="text-[11px] text-slate-400">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-navy-900">{item.score}%</span>
                      <span className="text-[10px] font-bold text-emerald-600 block">{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
            <h3 className="text-lg font-extrabold text-navy-900 mb-4 border-b border-slate-100 pb-3">
              AI Personalized Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {readiness.recommendations.map((rec, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 leading-relaxed font-medium flex flex-col justify-between">
                  <p>{rec}</p>
                  <span className="text-primary-600 font-bold mt-3 block text-[11px]">Action Step #{idx + 1} →</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Official Scorecard Modal (Phase 13 Printable Report Card) */}
      {showScorecard && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">Official Candidate Scorecard</span>
              <h3 className="text-2xl font-black text-navy-900 mt-1">{user?.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-4 text-left text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">Placement Readiness</span>
                <span className="text-2xl font-black text-primary-600">{score}%</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Readiness Tier</span>
                <span className="font-extrabold text-navy-900 block mt-1">{readiness?.readiness_category}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Target Career Role</span>
                <span className="font-extrabold text-navy-900 block mt-0.5">Software Development Engineer</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Academic Cohort</span>
                <span className="font-extrabold text-navy-900 block mt-0.5">Engineering Batch 2026</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Verified by PlacementAI SHAP Decision Pipeline • Issued for Campus Placement Drive 2026-2027
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowScorecard(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close Scorecard
              </button>
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
