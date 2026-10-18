import { Link } from 'react-router-dom';

export default function Features() {
  const featuresList = [
    {
      title: "AI Placement Readiness Prediction",
      desc: "Trained Random Forest machine learning model calculating real-time placement probability (0-100) based on academic metrics, coding platform scores, and soft skills.",
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      badge: "ML Powered"
    },
    {
      title: "Explainable AI (SHAP Skill Gaps)",
      desc: "Transparent model predictions with SHAP TreeExplainer feature importance, isolating the exact negative contributors dragging down student readiness scores.",
      icon: (
        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      badge: "XAI Transparency"
    },
    {
      title: "Smart AI Resume Parser",
      desc: "Automated PDF resume parsing with NLP. Instantly extracts technical skills (Python, SQL, React), education degrees, projects, and contact details with 1-click sync.",
      icon: (
        <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: "Automated NLP Extraction"
    },
    {
      title: "Timed Adaptive Assessment Engine",
      desc: "Timed technical and aptitude exams with live countdown, question shuffling, instant scoring, and granular performance tracking per topic.",
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badge: "Auto Evaluated"
    },
    {
      title: "Personalized Learning Roadmaps",
      desc: "Converts identified competency deficits into custom week-by-week study milestones, curated LeetCode problems, and interview prep checklists.",
      icon: (
        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      badge: "Targeted Prep"
    },
    {
      title: "Placement Cell & Mentor Dashboards",
      desc: "Institutional insights for TPOs and faculty mentors to monitor batch readiness, filter eligible candidates for drives, and track skill growth.",
      icon: (
        <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: "Institutional"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-xs border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl text-primary-600 tracking-tight flex items-center gap-2">
            <span>PlacementAI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Home</Link>
            <Link to="/login" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-xs transition">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight mt-4">
            Engineered for Campus Recruitment Success
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-4">
            Explore the comprehensive suite of AI, machine learning, and assessment technologies powering the next generation of placement readiness.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-primary-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-gradient-to-r from-navy-900 via-primary-950 to-primary-900 rounded-3xl p-10 sm:p-14 text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">Ready to test your readiness score?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            Create your candidate profile, upload your resume, take domain assessments, and get your AI readiness forecast today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg transition active:scale-95"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold backdrop-blur-sm border border-white/10 transition"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
