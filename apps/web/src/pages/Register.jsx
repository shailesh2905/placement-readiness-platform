import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password, role }),
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
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error: Unable to connect to server on port 8000.');
    } finally {
      setLoading(false);
    }
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

      {/* Main Registration Card */}
      <div className="max-w-md w-full mx-auto my-auto space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Create candidate account
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
            Join PlacementAI to begin placement readiness calibration
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span>{error}</span>
                {error.includes('already exists') && (
                  <Link to="/login" className="block text-primary-600 font-bold hover:underline mt-0.5">
                    Click here to Sign In instead →
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                placeholder="e.g. Shailesh Yadav"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">University Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                placeholder="shailesh@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition font-medium"
              >
                <option value="STUDENT">🎓 Candidate / Student</option>
                <option value="MENTOR">👨‍🏫 Faculty Mentor / TPO</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 hover:underline">
              Sign In to Your Account →
            </Link>
          </p>
        </div>
      </div>

      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-400 py-2">
        © 2026 PlacementAI Platform • Campus Recruitment Engine
      </footer>
    </div>
  );
}
