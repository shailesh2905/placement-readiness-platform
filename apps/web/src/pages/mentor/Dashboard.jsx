import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

export default function MentorDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock list of assigned students for mentor view
  const [students] = useState([
    { id: '1', name: 'Shailesh Yadav', role: 'Full Stack Engineer', readiness: 84, status: 'Placement Ready', gaps: ['System Design', 'Docker'] },
    { id: '2', name: 'Aarav Sharma', role: 'Data Analyst', readiness: 68, status: 'Needs Refinement', gaps: ['SQL Optimization', 'Tableau'] },
    { id: '3', name: 'Priya Patel', role: 'Frontend Developer', readiness: 74, status: 'Needs Refinement', gaps: ['React Performance', 'TypeScript'] },
    { id: '4', name: 'Rohan Verma', role: 'Backend Developer', readiness: 52, status: 'Significant Prep Needed', gaps: ['DSA (Dynamic Programming)', 'Microservices'] }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-navy-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-xl text-primary-400">PlacementAI</span>
            <span className="bg-primary-500/20 text-primary-300 text-xs px-2.5 py-0.5 rounded-full border border-primary-500/30 font-semibold uppercase">
              Mentor Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/student/dashboard"
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white font-medium transition"
            >
              Preview Student View →
            </Link>
            <div className="text-right text-xs">
              <span className="text-slate-400 block">Logged in as:</span>
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
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Mentor Supervision Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Review assigned students, track SHAP-identified skill gaps, and schedule mock reviews.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              4 Students Assigned
            </span>
          </div>
        </div>

        {/* Assigned Mentees Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-navy-900">Mentees & Readiness Forecast</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Student Name</th>
                  <th className="py-3 px-6">Target Role</th>
                  <th className="py-3 px-6">Readiness Score</th>
                  <th className="py-3 px-6">Identified Skill Gaps</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-navy-900">{st.name}</td>
                    <td className="py-4 px-6 text-slate-600">{st.role}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${st.readiness >= 80 ? 'text-emerald-600' : st.readiness >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          {st.readiness}%
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          st.readiness >= 80 ? 'bg-emerald-100 text-emerald-800' : st.readiness >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {st.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {st.gaps.map((gap, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md font-medium">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/student/dashboard"
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition"
                      >
                        Inspect Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
