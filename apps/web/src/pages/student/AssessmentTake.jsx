import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AssessmentTake() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [markedForReview, setMarkedForReview] = useState(new Set()); // Set of questionIds
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Safety Modals
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/assessments/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setAssessment(data.data);
          setTimeLeft(data.data.timeLimit * 60); // minutes to seconds
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id, token]);

  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) {
      if (timeLeft === 0 && assessment) {
        handleSubmit(); // Auto-submit when time is up
      }
      return;
    }
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, assessment]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview(prev => {
      const updated = new Set(prev);
      if (updated.has(questionId)) {
        updated.delete(questionId);
      } else {
        updated.add(questionId);
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowSubmitModal(false);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      }));

      const response = await fetch(`http://localhost:8000/api/v1/assessments/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });
      const data = await response.json();
      if (data.success) {
        navigate(`/student/assessments/result/${data.data.id}`); // attempt ID
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-slate-700">Loading Assessment Environment...</p>
      </div>
    );
  }

  if (!assessment) return <div className="text-red-500 text-center py-12">Assessment not found</div>;

  const currentQuestionObj = assessment.questions[currentQuestionIndex]?.question;
  if (!currentQuestionObj) return <div>No questions in this assessment.</div>;
  
  const options = JSON.parse(currentQuestionObj.options);
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;
  const totalQuestions = assessment.questions.length;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Bar with Back/Exit, Title, and Timer */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <span>←</span>
            <span>Exit Exam</span>
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-navy-900">{assessment.title}</h2>
            <p className="text-xs text-slate-400">
              Question {currentQuestionIndex + 1} of {totalQuestions} • {answeredCount} Answered
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className={`px-4 py-2 rounded-xl font-mono text-sm font-bold flex items-center gap-2 ${
          timeLeft < 120 ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-primary-50 text-primary-700 border border-primary-200'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatTime(timeLeft)} Remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="mb-4 flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  Topic: {currentQuestionObj.topic}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {currentQuestionObj.marks} Marks
                </span>
              </div>
              
              <h3 className="text-base sm:text-lg text-navy-900 font-bold mb-6 leading-relaxed">
                {currentQuestionObj.text}
              </h3>
              
              <div className="space-y-3">
                {options.map((option, idx) => {
                  const isSelected = answers[currentQuestionObj.id] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(currentQuestionObj.id, option)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        isSelected 
                          ? 'border-primary-600 bg-primary-50/70 text-navy-900 font-semibold shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                          isSelected ? 'border-primary-600 bg-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
                        </div>
                        <span className="text-xs sm:text-sm">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Question Controls */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3 mt-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  disabled={currentQuestionIndex === 0 || submitting}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 disabled:opacity-40 transition"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => toggleMarkForReview(currentQuestionObj.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition border ${
                    markedForReview.has(currentQuestionObj.id)
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {markedForReview.has(currentQuestionObj.id) ? '★ Marked for Review' : '☆ Mark for Review'}
                </button>
              </div>

              {isLastQuestion ? (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  disabled={submitting}
                  className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-md shadow-emerald-500/25 active:scale-95"
                >
                  {submitting ? 'Evaluating...' : 'Review & Submit Exam'}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs transition shadow-md shadow-primary-500/20 active:scale-95"
                >
                  Next Question →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Real-world Question Palette Navigator (1 col) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-5 h-fit">
          <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider pb-3 border-b border-slate-100">
            Question Palette
          </h4>

          {/* Palette Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {assessment.questions.map((q, idx) => {
              const qId = q.question.id;
              const isAnswered = !!answers[qId];
              const isMarked = markedForReview.has(qId);
              const isCurrent = idx === currentQuestionIndex;

              let style = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
              if (isMarked) {
                style = 'bg-purple-100 text-purple-800 font-bold border border-purple-300';
              } else if (isAnswered) {
                style = 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300';
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-10 h-10 rounded-xl text-xs flex items-center justify-center transition-all ${style} ${
                    isCurrent ? 'ring-2 ring-primary-600 ring-offset-2 scale-105' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300"></span>
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-purple-100 border border-purple-300"></span>
              <span>Marked for Review ({markedForReview.size})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-slate-100"></span>
              <span>Unanswered ({totalQuestions - answeredCount})</span>
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-xs"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Exit Confirmation Guard Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-navy-900">Forfeit Assessment?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to exit? Your answers will not be scored and this attempt will be cancelled.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Continue Test
              </button>
              <button
                onClick={() => navigate('/student/assessments')}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition"
              >
                Exit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-navy-900">Submit Assessment?</h3>
            
            <div className="p-4 bg-slate-50 rounded-2xl grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Answered</span>
                <span className="font-extrabold text-emerald-600 text-base">{answeredCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">For Review</span>
                <span className="font-extrabold text-purple-600 text-base">{markedForReview.size}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Unanswered</span>
                <span className="font-extrabold text-red-500 text-base">{totalQuestions - answeredCount}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Your test will be evaluated immediately and results will calibrate your placement readiness score.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Review More
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-500/25"
              >
                {submitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
