import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Assessments() {
  const { token } = useAuthStore();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/assessments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setAssessments(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, [token]);

  if (loading) return <div className="text-slate-500">Loading assessments...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-navy-900">Skill Assessments</h2>
        <p className="text-slate-500 mt-1">Take assessments to identify your skill gaps and improve your readiness score.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map(assessment => (
          <div key={assessment.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-md uppercase">
                {assessment.category}
              </span>
              <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase ${
                assessment.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                assessment.difficulty === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {assessment.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">{assessment.title}</h3>
            <p className="text-sm text-slate-500 flex-1 mb-6">{assessment.description}</p>
            
            <div className="flex justify-between items-center text-sm text-slate-600 mb-6 border-t pt-4">
              <span>⏱ {assessment.timeLimit} mins</span>
              <span>📝 {assessment._count.questions} questions</span>
            </div>
            
            <button 
              onClick={() => navigate(`/student/assessments/${assessment.id}`)}
              className="w-full py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              Start Assessment
            </button>
          </div>
        ))}
        {assessments.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-100 text-slate-500">
            No assessments available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
