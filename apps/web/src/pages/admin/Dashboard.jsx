import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [minScore, setMinScore] = useState('');
  const [minCgpa, setMinCgpa] = useState('');

  // Selected student for detail modal
  const [activeStudent, setActiveStudent] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedRole !== 'ALL') params.append('role', selectedRole);
      if (minScore) params.append('minScore', minScore);
      if (minCgpa) params.append('minCgpa', minCgpa);

      const res = await fetch(`http://localhost:8000/api/v1/admin/students?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchStudents();
  }, [token]);

  // Trigger search on filter changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedRole, minScore, minCgpa]);

  const handleDownloadCSV = () => {
    window.open('http://localhost:8000/api/v1/admin/export-csv', '_blank');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      {/* Top Navbar */}
      <header className="bg-navy-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-xl text-primary-400 tracking-tight">PlacementAI</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold uppercase">
              TPO & Admin Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/student/dashboard"
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white font-medium transition"
            >
              Preview Student View →
            </Link>
            <div className="text-right text-xs hidden sm:block">
              <span className="text-slate-400 block">Signed in as:</span>
              <span className="font-semibold text-white">{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Banner with CSV Export */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <span>Phase 12 Administrative Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Training & Placement Cell (TPO) Hub
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Cohort-wide readiness distribution, company drive shortlisting, and candidate exports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadCSV}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md shadow-primary-500/20 transition active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Candidate Roster (CSV)</span>
            </button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Candidates</span>
            <div className="text-3xl font-black text-navy-900 mt-2">{analytics?.totalStudents || 0}</div>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Active Engineering Cohort</span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Placement Ready (≥80%)</span>
            <div className="text-3xl font-black text-emerald-600 mt-2">{analytics?.readyCount || 0}</div>
            <span className="text-xs text-emerald-700 font-semibold mt-1 block">
              {analytics?.readyPercentage || 0}% of cohort eligible for Day 1
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Needs Refinement (60-79%)</span>
            <div className="text-3xl font-black text-amber-500 mt-2">{analytics?.refiningCount || 0}</div>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Targeting skill gap workshops</span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Avg Calibrated Readiness</span>
            <div className="text-3xl font-black text-primary-600 mt-2">{analytics?.avgScore || 0}%</div>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Trained ML Model Score</span>
          </div>
        </div>

        {/* Top Cohort Skills Distribution */}
        {analytics?.topSkills?.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Top Verified Skills Across Batch
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {analytics.topSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2"
                >
                  <span className="font-bold text-navy-900">{sk.name}</span>
                  <span className="bg-primary-100 text-primary-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {sk.count} students
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Candidates for Placement Drives
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Showing {students.length} candidates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Search Input */}
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Search Student or Skill</label>
              <input
                type="text"
                placeholder="e.g. Rohan, Python, React"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Target Role Dropdown */}
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Target Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">All Job Roles</option>
                <option value="Software Development">Software Engineer (SDE)</option>
                <option value="Data Scientist">Data Scientist / AI</option>
                <option value="Frontend">Frontend Engineer</option>
                <option value="Backend">Backend / Cloud</option>
              </select>
            </div>

            {/* Min Readiness */}
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Min Readiness Score</label>
              <select
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any Readiness Score</option>
                <option value="80">≥ 80% (Placement Ready)</option>
                <option value="60">≥ 60% (Developing & Above)</option>
              </select>
            </div>

            {/* Min CGPA */}
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Min Academic CGPA</label>
              <select
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any CGPA</option>
                <option value="8.5">≥ 8.5 CGPA</option>
                <option value="8.0">≥ 8.0 CGPA</option>
                <option value="7.5">≥ 7.5 CGPA</option>
                <option value="7.0">≥ 7.0 CGPA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidate Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Candidate Details</th>
                  <th className="py-3.5 px-6">Degree & CGPA</th>
                  <th className="py-3.5 px-6">Target Role</th>
                  <th className="py-3.5 px-6">Readiness Score</th>
                  <th className="py-3.5 px-6">Verified Skills</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 font-extrabold flex items-center justify-center text-sm shadow-xs">
                          {st.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-navy-900">{st.name}</div>
                          <div className="text-xs text-slate-400">{st.email} • {st.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-xs font-semibold text-slate-800">{st.degree}</div>
                      <span className="inline-block bg-primary-50 text-primary-700 text-[11px] font-bold px-2 py-0.5 rounded-md mt-0.5">
                        CGPA {st.cgpa}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                      {st.targetRole}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-sm ${
                          st.readinessScore >= 80 ? 'text-emerald-600' : st.readinessScore >= 60 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {st.readinessScore}%
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          st.readinessScore >= 80 ? 'bg-emerald-100 text-emerald-800' : st.readinessScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {st.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {st.skills.slice(0, 4).map((sk, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                            {sk}
                          </span>
                        ))}
                        {st.skills.length > 4 && (
                          <span className="text-[10px] text-slate-400 font-semibold self-center">
                            +{st.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setActiveStudent(st)}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3.5 py-1.5 rounded-xl transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidate Detail Modal */}
        {activeStudent && (
          <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                    {activeStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-navy-900">{activeStudent.name}</h3>
                    <p className="text-xs text-slate-500">{activeStudent.email} • {activeStudent.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStudent(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-semibold">Target Career Role</span>
                  <span className="font-extrabold text-navy-900 text-sm mt-0.5 block">{activeStudent.targetRole}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-semibold">Academic Profile</span>
                  <span className="font-extrabold text-navy-900 text-sm mt-0.5 block">{activeStudent.degree} (CGPA {activeStudent.cgpa})</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Verified Technical Skills ({activeStudent.skills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeStudent.skills.map((sk, idx) => (
                    <span key={idx} className="bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-xl border border-primary-200">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setActiveStudent(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Close
                </button>
                <Link
                  to="/student/dashboard"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Open Full Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
