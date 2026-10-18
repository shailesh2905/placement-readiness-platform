import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Features from './pages/Features';
import NotFound from './pages/NotFound';
import MentorDashboard from './pages/mentor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import StudentLayout from './pages/student/Layout';
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import Assessments from './pages/student/Assessments';
import AssessmentTake from './pages/student/AssessmentTake';
import AssessmentResult from './pages/student/AssessmentResult';
import LearningPlan from './pages/student/LearningPlan';

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="bg-white shadow-xs sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-extrabold text-2xl text-primary-600 tracking-tight">PlacementAI</span>
            </div>
            <nav className="flex space-x-6 items-center">
              <Link to="/features" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-sm font-semibold transition">
                Platform Features
              </Link>
              <Link to="/login" className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-xs transition-all active:scale-95">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-200 mb-6">
            <span>✨ Phase 1–7 System Live</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            <span>SHAP XAI & Resume Parsing</span>
          </div>

          <h1 className="text-4xl tracking-tight font-extrabold text-navy-900 sm:text-5xl md:text-6xl">
            <span className="block">Turn Your Skills Into</span>
            <span className="block text-primary-600">Placement Readiness.</span>
          </h1>
          <p className="mt-4 max-w-md mx-auto text-base text-slate-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            AI-powered assessment, explainable skill-gap analysis, and tailored recommendations for campus recruitment success.
          </p>

          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/25 transition-all active:scale-95"
            >
              Get Started Free
            </Link>
            <Link
              to="/features"
              className="flex items-center justify-center px-8 py-3.5 border border-slate-200 text-base font-bold rounded-xl text-navy-900 bg-white hover:bg-slate-50 shadow-xs transition-all"
            >
              Explore Platform
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © 2026 PlacementAI Platform • Data Science & Engineering
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Mentor & Admin Routes */}
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="assessments/:id" element={<AssessmentTake />} />
          <Route path="assessments/result/:attemptId" element={<AssessmentResult />} />
          <Route path="learning-plan" element={<LearningPlan />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
