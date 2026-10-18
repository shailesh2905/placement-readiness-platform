import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (data.success) {
        login(data.data, data.data.token);
        if (data.data.role === 'MENTOR') {
          navigate('/mentor/dashboard');
        } else if (data.data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        setError(data.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      setError('Network error: Unable to reach backend server (port 8000).');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center">
          <Link to="/" className="inline-block text-primary-600 font-extrabold text-2xl tracking-tight mb-2">
            PlacementAI
          </Link>
          <h2 className="text-2xl font-extrabold text-navy-900">
            Sign in to your account
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Access your AI readiness assessment & dashboard
          </p>
        </div>

        {/* 1-Click Quick Demo Credentials Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
          <p className="font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <span>⚡️ Quick Test Accounts:</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student@demo.com', 'password123')}
              className="p-2 text-left bg-white hover:bg-primary-50 hover:border-primary-300 border rounded-lg transition"
            >
              <span className="font-bold text-navy-900 block">🎓 Demo Student</span>
              <span className="text-[10px] text-slate-500 truncate block">student@demo.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@nexcart.ai', 'password123')}
              className="p-2 text-left bg-white hover:bg-emerald-50 hover:border-emerald-300 border rounded-lg transition"
            >
              <span className="font-bold text-navy-900 block">👨‍🏫 Mentor / Admin</span>
              <span className="text-[10px] text-slate-500 truncate block">admin@nexcart.ai</span>
            </button>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>{loading ? 'Authenticating...' : 'Sign in'}</span>
            </button>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
