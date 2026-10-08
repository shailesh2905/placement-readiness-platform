import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link, Outlet } from 'react-router-dom';

export default function StudentLayout() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== 'STUDENT') {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-navy-800">
          <span className="font-bold text-xl text-primary-500">PlacementAI</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/student/dashboard" className="block px-4 py-2 rounded-md hover:bg-navy-800 transition-colors">Dashboard</Link>
          <Link to="/student/profile" className="block px-4 py-2 rounded-md hover:bg-navy-800 transition-colors">My Profile</Link>
          <Link to="/student/assessments" className="block px-4 py-2 rounded-md hover:bg-navy-800 transition-colors">Assessments</Link>
          <Link to="/student/learning-plan" className="block px-4 py-2 rounded-md hover:bg-navy-800 transition-colors">Learning Plan</Link>
        </nav>
        <div className="p-4 border-t border-navy-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm text-slate-300">Logged in as:</p>
            <p className="font-medium truncate">{user.name}</p>
          </div>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-navy-800 rounded-md transition-colors">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-navy-900">Student Portal</h1>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
