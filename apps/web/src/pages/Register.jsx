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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center">
          <Link to="/" className="inline-block text-primary-600 font-extrabold text-2xl tracking-tight mb-2">
            PlacementAI
          </Link>
          <h2 className="text-2xl font-extrabold text-navy-900">
            Create an account
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Join PlacementAI to begin placement readiness evaluation
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
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

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="e.g. Shailesh Yadav"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              >
                <option value="STUDENT">Student Candidate</option>
                <option value="MENTOR">Faculty / Mentor</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
