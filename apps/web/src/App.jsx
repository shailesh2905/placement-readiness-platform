import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentLayout from './pages/student/Layout';
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import Assessments from './pages/student/Assessments';
import AssessmentTake from './pages/student/AssessmentTake';
import AssessmentResult from './pages/student/AssessmentResult';

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-primary-600">PlacementAI</span>
            </div>
            <nav className="flex space-x-8">
              <Link to="/" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium">Home</Link>
              <Link to="/login" className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md font-medium transition-colors">Sign In</Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-navy-900 sm:text-5xl md:text-6xl">
            <span className="block">Turn Your Skills Into</span>
            <span className="block text-primary-600">Placement Readiness.</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            AI-powered assessment, skill-gap analysis, and personalised recommendations for smarter placement preparation.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link to="/register" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Link>
              <Link to="/features" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors">
                Explore Platform
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="assessments/:id" element={<AssessmentTake />} />
          <Route path="assessments/result/:attemptId" element={<AssessmentResult />} />
          <Route path="learning-plan" element={<div className="p-4 bg-white shadow rounded-lg text-slate-600">Learning Plan Module Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
