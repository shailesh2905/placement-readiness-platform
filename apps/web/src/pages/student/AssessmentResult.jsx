import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  if (loading) return <div className="text-slate-500 text-center py-12">Loading results...</div>;
  if (!attempt) return <div className="text-red-500 text-center py-12">Result not found</div>;

  const totalQuestions = attempt.answers.length;
  const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((attempt.totalScore / (totalQuestions * 2)) * 100); // Assuming 2 marks each

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Assessment Completed!</h2>
        <p className="text-slate-500 mb-8">{attempt.assessment.title}</p>
        
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-[12px] border-slate-100">
            <div 
              className="absolute inset-0 rounded-full border-[12px] border-primary-500"
              style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 ${100 - percentage}%)` }}
            ></div>
            <div className="text-center z-10 bg-white rounded-full w-36 h-36 flex flex-col items-center justify-center shadow-sm">
              <span className="text-4xl font-extrabold text-navy-900">{attempt.totalScore}</span>
              <span className="text-sm text-slate-500 font-medium">Marks</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8 border-t border-b border-slate-100 py-4">
          <div>
            <p className="text-2xl font-bold text-navy-900">{totalQuestions}</p>
            <p className="text-xs text-slate-500 uppercase font-bold">Questions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
            <p className="text-xs text-green-600 uppercase font-bold">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{totalQuestions - correctAnswers}</p>
            <p className="text-xs text-red-500 uppercase font-bold">Incorrect</p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/student/dashboard')}
          className="px-8 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-navy-900 mb-6">Detailed Review</h3>
        <div className="space-y-6">
          {attempt.answers.map((answer, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${answer.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-slate-800">Q{idx + 1}. {answer.question.text}</span>
                <span className={`text-sm font-bold ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {answer.marksAwarded} / {answer.question.marks}
                </span>
              </div>
              <div className="text-sm mt-3 space-y-2">
                <p>
                  <span className="font-semibold text-slate-600">Your Answer: </span> 
                  <span className={answer.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {answer.selectedOption || 'Not Attempted'}
                  </span>
                </p>
                {!answer.isCorrect && (
                  <p>
                    <span className="font-semibold text-slate-600">Correct Answer: </span> 
                    <span className="text-green-700 font-medium">{answer.question.correctAnswer}</span>
                  </p>
                )}
                {answer.question.explanation && (
                  <p className="text-slate-600 mt-2 text-xs p-2 bg-white rounded border border-slate-200">
                    💡 <strong>Explanation:</strong> {answer.question.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
