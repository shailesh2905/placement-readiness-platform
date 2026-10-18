import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-navy-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-xl text-primary-400">PlacementAI</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold uppercase">
              TPO / Admin Portal
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
            <h1 className="text-2xl font-bold text-navy-900">Training & Placement Cell (TPO)</h1>
            <p className="text-slate-500 text-sm mt-1">
              Institutional placement analytics, drive eligibility filters, and candidate exports.
            </p>
          </div>
          <button
            onClick={() => alert('Exporting candidate readiness roster (CSV)...')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            Export Candidate Roster (CSV)
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Registered</span>
            <div className="text-3xl font-extrabold text-navy-900 mt-2">1,248</div>
            <span className="text-xs text-emerald-600 font-medium mt-1 block">↑ 12% from last cycle</span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Placement Ready (≥80%)</span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2">782</div>
            <span className="text-xs text-slate-400 font-medium mt-1 block">62.6% of cohort</span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Needs Refinement (60-79%)</span>
            <div className="text-3xl font-extrabold text-amber-500 mt-2">340</div>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Targeting workshop</span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Avg Readiness Score</span>
            <div className="text-3xl font-extrabold text-primary-600 mt-2">76.4</div>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Calibrated via ML</span>
          </div>
        </div>
      </main>
    </div>
  );
}
