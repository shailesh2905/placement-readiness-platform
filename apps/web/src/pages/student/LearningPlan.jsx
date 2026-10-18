import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function LearningPlan() {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [filterWeek, setFilterWeek] = useState('ALL'); // ALL, 1, 2, 3, 4

  const fetchPlan = async (roleKey = '') => {
    setLoading(true);
    try {
      const url = roleKey
        ? `http://localhost:8000/api/v1/learning-plan?role=${roleKey}`
        : 'http://localhost:8000/api/v1/learning-plan';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const res = await response.json();
      if (res.success) {
        setData(res.data);
        if (!selectedRole) {
          setSelectedRole(res.data.activeRole.id);
        }
      }
    } catch (err) {
      console.error('Failed to load learning plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [token]);

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    fetchPlan(roleId);
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    setUpdatingTaskId(taskId);
    const newStatus = !currentStatus;

    // Optimistic UI update
    setData((prev) => {
      if (!prev) return prev;
      let newCompleted = prev.progress.completedTasks + (newStatus ? 1 : -1);
      const newWeeks = prev.learningRoadmap.map((w) => ({
        ...w,
        tasks: w.tasks.map((t) => (t.id === taskId ? { ...t, completed: newStatus } : t))
      }));
      return {
        ...prev,
        learningRoadmap: newWeeks,
        progress: {
          ...prev.progress,
          completedTasks: newCompleted,
          progressPercentage: Math.round((newCompleted / prev.progress.totalTasks) * 100)
        }
      };
    });

    try {
      await fetch('http://localhost:8000/api/v1/learning-plan/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId, completed: newStatus })
      });
    } catch (err) {
      console.error('Failed to save task progress:', err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-slate-700">Generating Personalized Learning Roadmap...</p>
        <p className="text-xs text-slate-400 mt-1">Analyzing skill gaps against role benchmarks</p>
      </div>
    );
  }

  const { activeRole, allRoles, skillGapAnalysis, learningRoadmap, progress } = data || {};
  const matchPct = skillGapAnalysis?.matchPercentage || 0;

  const filteredWeeks = filterWeek === 'ALL'
    ? learningRoadmap
    : learningRoadmap?.filter(w => w.week.toString() === filterWeek);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-primary-950 to-primary-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-primary-300 font-bold text-xs uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
              <span>Target Role Skill Deficit Roadmap</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Personalized Learning Roadmap
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Curated week-by-week study milestones generated directly from your identified skill gaps and assessment deficits.
            </p>
          </div>

          {/* Overall Completion Metric Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex items-center space-x-5 min-w-[240px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary-400"
                  strokeDasharray={`${progress?.progressPercentage || 0}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-black text-sm text-white">
                {progress?.progressPercentage}%
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-300 block font-medium">Roadmap Progress</span>
              <span className="text-lg font-extrabold text-white">
                {progress?.completedTasks} / {progress?.totalTasks}
              </span>
              <span className="text-[10px] text-primary-200 block">Milestones Completed</span>
            </div>
          </div>
        </div>

        {/* Target Role Selector Tabs */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-2">
          <span className="text-xs text-slate-300 font-semibold self-center mr-2">Target Job Role:</span>
          {allRoles?.map((r) => (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === r.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-950/40 border border-primary-400/30 scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/5'
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* PHASE 8: ROLE-SKILL GAP MATRIX CARD */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <span>Phase 8 Analysis</span>
            </div>
            <h2 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Role Competency Benchmark Matrix: {activeRole?.title}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Comparing your profile competencies & assessment scores against recruiter hiring thresholds.
            </p>
          </div>

          {/* Role Match Score Badge */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/70 p-3 rounded-2xl">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
              matchPct >= 75 ? 'bg-emerald-100 text-emerald-700' : matchPct >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
            }`}>
              {matchPct}%
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Role Competency Fit</span>
              <span className="font-extrabold text-navy-900 text-sm">
                {matchPct >= 75 ? 'Strong Match' : matchPct >= 50 ? 'Moderate Match' : 'High Priority Gaps'}
              </span>
            </div>
          </div>
        </div>

        {/* Skills Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Acquired Skills */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Acquired Competencies ({skillGapAnalysis?.acquiredSkills?.length || 0})
            </h3>
            <p className="text-xs text-emerald-700 mb-3">
              Skills validated through resume parsing or assessment records matching this role:
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGapAnalysis?.acquiredSkills?.length > 0 ? (
                skillGapAnalysis.acquiredSkills.map((skill, idx) => (
                  <span key={idx} className="bg-white text-emerald-800 text-xs font-semibold px-3 py-1 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No matching competencies registered yet.</span>
              )}
            </div>
          </div>

          {/* Missing Skill Gaps */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Critical Competency Gaps ({skillGapAnalysis?.missingSkills?.length || 0})
            </h3>
            <p className="text-xs text-amber-700 mb-3">
              Required by hiring companies for this role that need to be acquired:
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGapAnalysis?.missingSkills?.length > 0 ? (
                skillGapAnalysis.missingSkills.map((skill, idx) => (
                  <span key={idx} className="bg-white text-amber-800 text-xs font-semibold px-3 py-1 rounded-xl border border-amber-200 shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-600 font-semibold">🎉 All core role skills acquired!</span>
              )}
            </div>
          </div>
        </div>

        {/* Benchmark Score Sliders */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Recruiter Benchmark Thresholds vs Your Readiness Metrics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* DSA Benchmark */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-navy-900">DSA & Algorithms</span>
                <span className="text-slate-500 font-semibold">{skillGapAnalysis?.currentMetrics?.dsa_score || 0} / {activeRole?.benchmarks?.dsa_score}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((skillGapAnalysis?.currentMetrics?.dsa_score || 0) / (activeRole?.benchmarks?.dsa_score || 1)) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Threshold: {activeRole?.benchmarks?.dsa_score}% minimum</span>
            </div>

            {/* Technical Domain */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-navy-900">Domain Technical</span>
                <span className="text-slate-500 font-semibold">{skillGapAnalysis?.currentMetrics?.technical_score || 0} / {activeRole?.benchmarks?.technical_score}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((skillGapAnalysis?.currentMetrics?.technical_score || 0) / (activeRole?.benchmarks?.technical_score || 1)) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Threshold: {activeRole?.benchmarks?.technical_score}% minimum</span>
            </div>

            {/* Quantitative Aptitude */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-navy-900">Quantitative Aptitude</span>
                <span className="text-slate-500 font-semibold">{skillGapAnalysis?.currentMetrics?.aptitude_score || 0} / {activeRole?.benchmarks?.aptitude_score}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((skillGapAnalysis?.currentMetrics?.aptitude_score || 0) / (activeRole?.benchmarks?.aptitude_score || 1)) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Threshold: {activeRole?.benchmarks?.aptitude_score}% minimum</span>
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 9: ACTIONABLE WEEK-BY-WEEK LEARNING ROADMAP */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <span>Phase 9 Recommendation Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold text-navy-900">
              4-Week Actionable Preparation Schedule
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Check off completed milestones. Your progress synchronizes automatically with your profile.
            </p>
          </div>

          {/* Week Filters */}
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold">
            {['ALL', '1', '2', '3', '4'].map((wk) => (
              <button
                key={wk}
                onClick={() => setFilterWeek(wk)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterWeek === wk
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {wk === 'ALL' ? 'All Weeks' : `W${wk}`}
              </button>
            ))}
          </div>
        </div>

        {/* Roadmap Cards */}
        <div className="space-y-6">
          {filteredWeeks?.map((weekItem) => {
            const completedCount = weekItem.tasks.filter((t) => t.completed).length;
            const weekProgress = Math.round((completedCount / weekItem.tasks.length) * 100);

            return (
              <div
                key={weekItem.week}
                className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8 transition hover:border-primary-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 font-black text-sm flex items-center justify-center border border-primary-200 shadow-inner">
                      W{weekItem.week}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900">{weekItem.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-primary-600">{weekItem.theme}</span>
                        <span>• Approx {weekItem.estimatedHours} hrs</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-bold text-slate-600">{completedCount}/{weekItem.tasks.length} Done</span>
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${weekProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Task Checklist */}
                <div className="mt-5 space-y-3">
                  {weekItem.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        task.completed
                          ? 'bg-emerald-50/40 border-emerald-200/80'
                          : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/60'
                      }`}
                    >
                      <button
                        type="button"
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition ${
                          task.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white hover:border-primary-500'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-navy-900'}`}>
                            {task.title}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.type === 'ASSESSMENT' ? 'bg-purple-100 text-purple-700' : task.type === 'PROJECT' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {task.type}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${task.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                          {task.desc}
                        </p>
                      </div>

                      {task.type === 'ASSESSMENT' && (
                        <Link
                          to="/student/assessments"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-primary-600 bg-white border border-primary-200 px-3 py-1.5 rounded-xl hover:bg-primary-50 transition shadow-xs flex-shrink-0"
                        >
                          Take Test →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
