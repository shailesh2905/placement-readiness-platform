import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AssessmentResult() {
  const { attemptId } = useParams();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/assessments/attempt/${attemptId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setAttempt(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attemptId, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-slate-700">Calibrating Diagnostic Scorecard...</p>
      </div>
    );
  }

  if (!attempt) return <div className="text-red-500 text-center py-12">Result not found</div>;

  const totalQuestions = attempt.answers.length;
  const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((attempt.totalScore / (totalQuestions * 2)) * 100); // 2 marks each

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Banner & Radial Scorecard */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200/80 text-center">
        <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Examination Completed & Evaluated</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-1">
          {attempt.assessment.title}
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-8">
          Detailed performance breakdown and answer explanations
        </p>
        
        {/* Smooth SVG Radial Score Ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f1f5f9"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#resultScoreGrad)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={(2 * Math.PI * 40) * (1 - Math.min(percentage, 100) / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="resultScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute text-center bg-white rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-xs">
              <span className="text-4xl font-black text-navy-900">{attempt.totalScore}</span>
              <span className="text-xs font-bold text-slate-400 block">{percentage}% Accuracy</span>
            </div>
          </div>
        </div>

        {/* 3-Col KPI Metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8 border-t border-b border-slate-100 py-5">
          <div>
            <p className="text-2xl font-black text-navy-900">{totalQuestions}</p>
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Total Questions</p>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-600">{correctAnswers}</p>
            <p className="text-[11px] text-emerald-600 uppercase font-bold tracking-wider mt-0.5">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-black text-red-500">{totalQuestions - correctAnswers}</p>
            <p className="text-[11px] text-red-500 uppercase font-bold tracking-wider mt-0.5">Incorrect</p>
          </div>
        </div>

        {/* Action Buttons: Back, Learning Plan, Dashboard */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/student/assessments"
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
          >
            ← Back to Assessments
          </Link>
          <button
            onClick={() => navigate(`/student/assessments/${attempt.assessmentId}`)}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-navy-900 rounded-xl font-bold text-xs transition shadow-xs"
          >
            🔄 Retake Test
          </button>
          <Link
            to="/student/learning-plan"
            className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs transition"
          >
            Fix Deficits in Roadmap →
          </Link>
          <button 
            onClick={() => navigate('/student/dashboard')}
            className="px-7 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white rounded-xl font-bold text-xs transition shadow-md shadow-primary-500/25"
          >
            Return to Dashboard
          </button>
        </div>
      </div>

      {/* Granular Question by Question Review */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80">
        <h3 className="text-lg font-extrabold text-navy-900 mb-6 pb-3 border-b border-slate-100">
          Detailed Question Explanations & Solutions
        </h3>
        <div className="space-y-6">
          {attempt.answers.map((answer, idx) => (
            <div key={idx} className={`p-5 rounded-2xl border-l-4 ${answer.isCorrect ? 'border-emerald-500 bg-emerald-50/40' : 'border-red-500 bg-red-50/40'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-navy-900 text-sm">Q{idx + 1}. {answer.question.text}</span>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${answer.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {answer.marksAwarded} / {answer.question.marks} Pts
                </span>
              </div>
              <div className="text-xs mt-3 space-y-2">
                <p>
                  <span className="font-bold text-slate-500">Your Answer: </span> 
                  <span className={answer.isCorrect ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                    {answer.selectedOption || 'Not Attempted'}
                  </span>
                </p>
                {!answer.isCorrect && (
                  <p>
                    <span className="font-bold text-slate-500">Correct Answer: </span> 
                    <span className="text-emerald-700 font-bold">{answer.question.correctAnswer}</span>
                  </p>
                )}
                {answer.question.explanation && (
                  <div className="text-slate-700 mt-2 p-3 bg-white rounded-xl border border-slate-200/80 leading-relaxed">
                    💡 <strong>Explanation:</strong> {answer.question.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
