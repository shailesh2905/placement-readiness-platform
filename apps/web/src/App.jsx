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
import Drives from './pages/student/Drives';
import LandingPage from './pages/LandingPage';

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
          <Route path="drives" element={<Drives />} />
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
