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
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    setSubmitting(true);
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

  if (loading) return <div className="text-slate-500 text-center py-12">Loading assessment...</div>;
  if (!assessment) return <div className="text-red-500 text-center py-12">Assessment not found</div>;

  const currentQuestionObj = assessment.questions[currentQuestionIndex]?.question;
  if (!currentQuestionObj) return <div>No questions in this assessment.</div>;
  
  const options = JSON.parse(currentQuestionObj.options);
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900">{assessment.title}</h2>
          <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {assessment.questions.length}</p>
        </div>
        <div className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-primary-600'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-6 min-h-[400px]">
        <div className="mb-4 flex justify-between">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
            {currentQuestionObj.topic}
          </span>
          <span className="text-sm font-medium text-slate-500">
            {currentQuestionObj.marks} Marks
          </span>
        </div>
        
        <h3 className="text-lg text-slate-800 font-medium mb-8 leading-relaxed">
          {currentQuestionObj.text}
        </h3>
        
        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = answers[currentQuestionObj.id] === option;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(currentQuestionObj.id, option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 text-primary-900' 
                    : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${
                    isSelected ? 'border-primary-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-primary-600" />}
                  </div>
                  {option}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0 || submitting}
          className="px-6 py-2 bg-slate-100 text-slate-600 rounded-md font-medium hover:bg-slate-200 disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        
        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg"
          >
            {submitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            className="px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
