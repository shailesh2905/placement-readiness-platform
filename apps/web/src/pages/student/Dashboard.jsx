import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, token } = useAuthStore();
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReadiness = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/readiness', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setReadiness(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load readiness data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReadiness();
  }, [token]);

  if (loading) return <div className="text-slate-500 text-center py-12">Loading ML Readiness Insights...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-navy-900">Good morning, {user?.name.split(' ')[0]}</h2>
        <p className="text-slate-500 mt-1">Here is your AI-generated placement readiness status.</p>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>

      {readiness && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-1 flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-lg font-medium text-slate-700 mb-6 z-10">AI Readiness Score</h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-[12px] border-slate-100 z-10">
              <div 
                className="absolute inset-0 rounded-full border-[12px] border-primary-500"
                style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 ${100 - readiness.readiness_score}%)` }}
              ></div>
              <div className="text-center z-10 bg-white rounded-full w-36 h-36 flex flex-col items-center justify-center shadow-sm">
                <span className="text-4xl font-extrabold text-navy-900">{Math.round(readiness.readiness_score)}</span>
                <span className="text-sm text-slate-500 block">/ 100</span>
              </div>
            </div>
            
            <p className="mt-6 font-bold text-lg text-primary-700 z-10 bg-primary-50 px-4 py-1 rounded-full">
              {readiness.readiness_category}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-1 md:col-span-2">
            <div className="flex justify-between items-end mb-6 border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-navy-900">Top Skill Gaps</h3>
                <p className="text-xs text-slate-500 mt-1">Identified via SHAP feature importance</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {readiness.top_gaps.map((gap, index) => {
                // Color scale based on severity (negative impact magnitude)
                const severityClass = gap.impact_score < -5 ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50';
                const textClass = gap.impact_score < -5 ? 'text-red-900' : 'text-orange-900';
                const labelClass = gap.impact_score < -5 ? 'text-red-700' : 'text-orange-700';
                
                return (
                  <div key={index} className={`flex justify-between items-center p-4 rounded-lg border ${severityClass}`}>
                    <div>
                      <p className={`font-bold ${textClass} capitalize`}>{gap.feature.replace('_', ' ')}</p>
                      <p className={`text-xs ${labelClass} mt-1 font-medium`}>
                        Current Value: {gap.current_value} | Impact: {gap.impact_score}
                      </p>
                    </div>
                    <Link to="/student/assessments" className={`px-4 py-2 bg-white ${labelClass} text-sm font-bold rounded border ${severityClass} hover:bg-white shadow-sm transition-all`}>
                      Improve Skill
                    </Link>
                  </div>
                )
              })}
              
              {readiness.top_gaps.length === 0 && (
                <div className="p-4 text-center text-green-700 bg-green-50 rounded-lg border border-green-200 font-medium">
                  No critical skill gaps identified! Keep up the good work.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {readiness && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-navy-900 mb-4 border-b pb-2">AI Personalized Action Plan</h3>
          <ul className="space-y-4">
            {readiness.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-sm font-bold mr-4 shrink-0">
                  {idx + 1}
                </span>
                <p className="text-slate-700 leading-relaxed font-medium mt-1">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
