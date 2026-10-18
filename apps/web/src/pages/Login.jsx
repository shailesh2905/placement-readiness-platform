import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center py-2">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-primary-500/30">
            P
          </div>
          <span className="font-extrabold text-2xl text-navy-900 tracking-tight">PlacementAI</span>
        </Link>
        <Link
          to="/"
          className="text-xs font-bold text-slate-500 hover:text-navy-900 transition flex items-center gap-1"
        >
          <span>← Back to Home</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
            Sign in to access your placement readiness forecast
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please use standard demo credentials or reset via admin.'); }} className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 mr-2"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 hover:underline">
              Register for Campus Access →
            </Link>
          </p>
        </div>
      </div>

      {/* Sleek Bottom Demo Dock */}
      <div className="max-w-md w-full mx-auto mt-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs text-slate-600">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Test Drive Demonstration Accounts</span>
          </span>
          <span className="text-[10px] text-slate-400">1-Click Autofill</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('student@demo.com', 'password123')}
            className="p-2 text-left bg-slate-50 hover:bg-primary-50 hover:border-primary-200 border border-slate-200/80 rounded-xl transition"
          >
            <span className="font-bold text-navy-900 block">🎓 Candidate View</span>
            <span className="text-[10px] text-slate-400 truncate block">student@demo.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin@nexcart.ai', 'password123')}
            className="p-2 text-left bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/80 rounded-xl transition"
          >
            <span className="font-bold text-navy-900 block">👨‍🏫 Placement Officer</span>
            <span className="text-[10px] text-slate-400 truncate block">admin@nexcart.ai</span>
          </button>
        </div>
      </div>
    </div>
  );
}
