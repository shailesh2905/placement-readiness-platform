import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

export default function MentorDashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback modal state
  const [reviewModalStudent, setReviewModalStudent] = useState(null);
  const [techRating, setTechRating] = useState(4);
  const [commRating, setCommRating] = useState(4);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/mentor/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (err) {
      console.error('Error loading mentees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!reviewModalStudent || !remarks.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/mentor/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: reviewModalStudent.id,
          technicalRating: techRating,
          communicationRating: commRating,
          remarks: remarks.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackSuccess(true);
        setTimeout(() => {
          setReviewModalStudent(null);
          setRemarks('');
          setFeedbackSuccess(false);
          fetchStudents();
        }, 1200);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      {/* Top Navbar */}
      <header className="bg-navy-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-xl text-primary-400 tracking-tight">PlacementAI</span>
            <span className="bg-primary-500/20 text-primary-300 text-xs px-2.5 py-0.5 rounded-full border border-primary-500/30 font-semibold uppercase">
              Mentor Supervision Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/student/dashboard"
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white font-medium transition"
            >
              Preview Student View →
            </Link>
            <div className="text-right text-xs hidden sm:block">
              <span className="text-slate-400 block">Signed in as:</span>
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
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <span>Candidate Mentorship & Mock Review</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Assigned Mentee Supervision & Feedback
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review student progress, conduct mock technical interviews, and log targeted mentor guidance.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-extrabold px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {students.length} Candidates Supervised
            </span>
          </div>
        </div>

        {/* Mentees Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-base font-extrabold text-navy-900">Student Readiness & Mock Assessments</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Target Role</th>
                  <th className="py-3.5 px-6">Readiness Status</th>
                  <th className="py-3.5 px-6">Verified Competencies</th>
                  <th className="py-3.5 px-6">Latest Remarks</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-900">{st.name}</div>
                      <div className="text-xs text-slate-400">{st.email}</div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-700 font-medium">
                      {st.targetRole}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-sm ${
                          st.readinessScore >= 80 ? 'text-emerald-600' : st.readinessScore >= 60 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {st.readinessScore}%
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          st.readinessScore >= 80 ? 'bg-emerald-100 text-emerald-800' : st.readinessScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {st.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {st.skills.slice(0, 3).map((sk, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                            {sk}
                          </span>
                        ))}
                        {st.skills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold self-center">
                            +{st.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500 max-w-xs truncate">
                      {st.feedback?.[0]?.remarks ? (
                        <span className="italic text-slate-700">"{st.feedback[0].remarks}"</span>
                      ) : (
                        <span className="text-slate-400 italic">No feedback submitted yet</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setReviewModalStudent(st)}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-xl transition"
                      >
                        + Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Modal */}
        {reviewModalStudent && (
          <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-navy-900">
                    Submit Mock Review for {reviewModalStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target: {reviewModalStudent.targetRole} • Readiness: {reviewModalStudent.readinessScore}%
                  </p>
                </div>
                <button
                  onClick={() => setReviewModalStudent(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>

              {feedbackSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-center rounded-2xl font-bold text-sm">
                  🎉 Feedback recorded successfully!
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Technical Rating</label>
                      <select
                        value={techRating}
                        onChange={(e) => setTechRating(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white text-sm"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ Exceptional (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ Proficient (4/5)</option>
                        <option value="3">⭐⭐⭐ Developing (3/5)</option>
                        <option value="2">⭐⭐ Needs Improvement (2/5)</option>
                        <option value="1">⭐ Critical Deficit (1/5)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Communication Rating</label>
                      <select
                        value={commRating}
                        onChange={(e) => setCommRating(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white text-sm"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ Articulate (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ Confident (4/5)</option>
                        <option value="3">⭐⭐⭐ Clear (3/5)</option>
                        <option value="2">⭐⭐ Needs Structure (2/5)</option>
                        <option value="1">⭐ Hesitant (1/5)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Actionable Remarks & Recommendations</label>
                    <textarea
                      required
                      rows="3"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Strong conceptual grasp of Binary Trees, but needs to practice SQL join syntax and STAR format for behavioral questions."
                      className="w-full p-3 border rounded-xl bg-white text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setReviewModalStudent(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition shadow-xs"
                    >
                      {submitting ? 'Saving...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
