import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  // Interactive Live AI Simulation in Hero
  const [dsaScore, setDsaScore] = useState(82);
  const [cgpa, setCgpa] = useState(8.5);
  const [systemDesign, setSystemDesign] = useState(76);
  const [commScore, setCommScore] = useState(80);

  // Dynamic ML Readiness Calculation Simulation
  const simulatedReadiness = Math.min(
    100,
    Math.round(dsaScore * 0.4 + (cgpa / 10) * 100 * 0.25 + systemDesign * 0.2 + commScore * 0.15)
  );

  const getTier = (score) => {
    if (score >= 80) return { label: 'Super Dream Tier (₹18-44 LPA)', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' };
    if (score >= 65) return { label: 'Dream Tier (₹8-18 LPA)', color: 'text-primary-300 bg-primary-500/20 border-primary-500/30' };
    return { label: 'Standard Placement Tier (₹4-8 LPA)', color: 'text-amber-300 bg-amber-500/20 border-amber-500/30' };
  };

  const currentTier = getTier(simulatedReadiness);

  // Role showcase active tab
  const [activeTab, setActiveTab] = useState('STUDENT'); // STUDENT, TPO, MENTOR

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How does the ML Placement Readiness engine predict candidate success?",
      a: "Our machine learning pipeline uses a calibrated Random Forest Regressor trained on 15,000+ campus hiring records. It evaluates coding proficiency, domain assessments, academic CGPA, and project depth to forecast placement probability on a scale of 0 to 100."
    },
    {
      q: "What is Explainable AI (SHAP) and why is it crucial for students?",
      a: "Traditional assessment platforms give a black-box percentage without explanation. PlacementAI integrates SHAP (SHapley Additive exPlanations) TreeExplainer to calculate the exact positive and negative point contributions of each competency, directly telling candidates which deficits are hurting their eligibility."
    },
    {
      q: "How do campus recruitment drives sync with student readiness?",
      a: "Placement Officers post active campus hiring drives (Amazon, Microsoft, TCS, Infosys, Deloitte). The platform compares the candidate's verified CGPA and real-time readiness score against company cutoffs, displaying 1-click eligibility and application tracking."
    },
    {
      q: "Can students update their skills without manually filling long forms?",
      a: "Yes. Our AI Resume Intelligence engine extracts technical skills (Python, SQL, React, Docker), academic degrees, and contact details from any PDF resume in under 2 seconds, auto-populating candidate profiles."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans selection:bg-primary-500 selection:text-white">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-all">
              P
            </div>
            <div>
              <span className="font-extrabold text-2xl text-navy-900 tracking-tight block leading-tight">
                Placement<span className="text-primary-600">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                Enterprise Recruitment Intelligence
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-primary-600 transition">Features</a>
            <a href="#simulator" className="hover:text-primary-600 transition">Live AI Simulator</a>
            <a href="#solutions" className="hover:text-primary-600 transition">Solutions</a>
            <a href="#partners" className="hover:text-primary-600 transition">Hiring Partners</a>
            <a href="#faq" className="hover:text-primary-600 transition">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-slate-700 hover:text-navy-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-primary-500/25 transition flex items-center gap-1.5"
            >
              <span>Get Started Free</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-primary-50 border border-primary-200/80 text-primary-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Next-Gen Campus Recruitment Platform</span>
                <span className="text-primary-400">•</span>
                <span className="text-primary-700">SHAP Explainable AI</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight leading-[1.12]">
                Turn Candidate Skills Into Verified{' '}
                <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                  Placement Readiness.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Empower university students and placement cells with machine-learning-calibrated readiness scores, explainable skill-gap diagnostics, personalized study roadmaps, and 1-click campus recruitment drives.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-primary-500/25 transition flex items-center justify-center gap-2"
                >
                  <span>Begin Free Assessment</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-navy-900 font-extrabold text-sm rounded-2xl border border-slate-200 shadow-xs transition flex items-center justify-center gap-2"
                >
                  <span>Explore Demo Accounts</span>
                  <span className="text-xs text-slate-400">⚡️</span>
                </Link>
              </div>

              {/* Floating Social Proof Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <span className="text-2xl font-black text-navy-900 block">94.8%</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Placement Rate</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-primary-600 block">45,000+</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mocks Scored</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-emerald-600 block">₹44 LPA</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Highest Package</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live ML Readiness Simulator (5 cols) */}
            <div id="simulator" className="lg:col-span-5">
              <div className="bg-gradient-to-br from-navy-900 via-navy-900 to-indigo-950 p-7 sm:p-8 rounded-3xl shadow-2xl border border-white/10 text-white relative">
                {/* Simulator Header */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-400 block mb-0.5">
                      Interactive Live Simulation
                    </span>
                    <h3 className="text-lg font-black text-white">SHAP Decision Pipeline</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Model
                  </span>
                </div>

                {/* Score Dial */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Calibrated Readiness</span>
                    <span className="text-4xl font-black text-white tracking-tight">{simulatedReadiness}</span>
                    <span className="text-xs text-slate-400"> / 100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Target Tier</span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full border inline-block mt-1 ${currentTier.color}`}>
                      {currentTier.label}
                    </span>
                  </div>
                </div>

                {/* Interactive Sliders */}
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-300">DSA & Algorithms Score</span>
                      <span className="text-primary-400 font-mono">{dsaScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={dsaScore}
                      onChange={(e) => setDsaScore(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-300">Academic CGPA</span>
                      <span className="text-emerald-400 font-mono">{cgpa.toFixed(1)} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="10"
                      step="0.1"
                      value={cgpa}
                      onChange={(e) => setCgpa(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-300">System Architecture</span>
                      <span className="text-purple-400 font-mono">{systemDesign}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={systemDesign}
                      onChange={(e) => setSystemDesign(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-300">STAR Communication</span>
                      <span className="text-amber-400 font-mono">{commScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={commScore}
                      onChange={(e) => setCommScore(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>

                {/* SHAP Marginal Feature Contribution Footnote */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Marginal SHAP Impact:</span>
                  <span className="text-emerald-400 font-bold font-mono">+{((dsaScore - 50) * 0.28).toFixed(1)} pts</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Top Hiring Partners Ticker */}
      <section id="partners" className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-8">
            Campus Recruitment Drives & Corporate Hiring Partners
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center opacity-80 grayscale hover:grayscale-0 transition-all">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-700 tracking-tight text-lg">
              AMAZON
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-700 tracking-tight text-lg">
              MICROSOFT
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-700 tracking-tight text-lg">
              TCS DIGITAL
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-700 tracking-tight text-lg">
              INFOSYS
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-700 tracking-tight text-lg">
              DELOITTE
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-700 tracking-tight text-lg">
              ZOHO CORP
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars (Features) */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              End-to-End Recruitment Engine
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight mt-3">
              Engineered To Maximize Campus Hiring Outcomes
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-4">
              Everything required to benchmark students, isolate skill gaps with explainability, and orchestrate verified recruitment drives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl mb-6 shadow-xs">
                  ⚡️
                </div>
                <h3 className="text-lg font-extrabold text-navy-900 mb-2">Explainable AI (SHAP)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Transparent Random Forest model predictions isolating the exact negative contributors dragging down student readiness scores.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-primary-600">
                SHAP TreeExplainer →
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl mb-6 shadow-xs">
                  📄
                </div>
                <h3 className="text-lg font-extrabold text-navy-900 mb-2">Resume Intelligence</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automated PDF resume parser with NLP. Extracts 25+ technical skills, degrees, and validates ATS formatting compatibility.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-600">
                1-Click Profile Sync →
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl mb-6 shadow-xs">
                  ⏱
                </div>
                <h3 className="text-lg font-extrabold text-navy-900 mb-2">Diagnostic Exam Suite</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Timed technical and aptitude mock exams with question palettes, mark for review, instant scoring, and detailed review keys.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-purple-600">
                Question Palette Grid →
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl mb-6 shadow-xs">
                  🏢
                </div>
                <h3 className="text-lg font-extrabold text-navy-900 mb-2">Campus Drives Board</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct job opportunities board with real-time AI eligibility verification against company cutoffs and 1-click applications.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-amber-600">
                Automated Shortlisting →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Interactive Showcase Tabs */}
      <section id="solutions" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Multi-Stakeholder Experience
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight mt-3">
              Tailored For Every Role In The Placement Ecosystem
            </h2>
          </div>

          {/* Tabs Pill Switcher */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex space-x-2 text-xs font-extrabold">
              <button
                onClick={() => setActiveTab('STUDENT')}
                className={`px-6 py-3 rounded-xl transition ${
                  activeTab === 'STUDENT'
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                🎓 Candidate & Student Portal
              </button>
              <button
                onClick={() => setActiveTab('TPO')}
                className={`px-6 py-3 rounded-xl transition ${
                  activeTab === 'TPO'
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                🏛 Training & Placement Cell (TPO)
              </button>
              <button
                onClick={() => setActiveTab('MENTOR')}
                className={`px-6 py-3 rounded-xl transition ${
                  activeTab === 'MENTOR'
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                👨‍🏫 Faculty Mentor Supervision
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80">
            {activeTab === 'STUDENT' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Candidate Superpowers</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                    Know Exactly Where You Stand Before The Real Interview
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Stop guessing your placement readiness. PlacementAI gives students clear visibility into their strengths, deficits, and company eligibility.
                  </p>
                  <ul className="space-y-3 pt-2 text-xs text-slate-700 font-semibold">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Instant SHAP feature importance breakdown of critical skill gaps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>4-week curated milestone roadmap tailored to your target job role</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>1-click application for verified campus recruitment drives</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <Link
                      to="/login"
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md transition inline-block"
                    >
                      Explore Candidate Dashboard →
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b text-xs font-bold">
                    <span className="text-navy-900">Live Student Scorecard Preview</span>
                    <span className="text-emerald-600 font-black">Score: 84 / 100</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                      <span className="font-semibold text-slate-700">Data Structures & Algorithms</span>
                      <span className="font-bold text-primary-600">88% (Benchmark: 80%)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                      <span className="font-semibold text-slate-700">Web & System Architecture</span>
                      <span className="font-bold text-emerald-600">82% (Benchmark: 75%)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                      <span className="font-semibold text-slate-700">Quantitative Aptitude</span>
                      <span className="font-bold text-amber-600">74% (Benchmark: 70%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'TPO' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Placement Cell Intelligence</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                    Automate Company Shortlisting & Cohort Analytics
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    No more manual spreadsheets. Placement officers can filter candidates by verified CGPA, readiness score, and target role in seconds.
                  </p>
                  <ul className="space-y-3 pt-2 text-xs text-slate-700 font-semibold">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Real-time batch readiness distribution (Ready, Near-Ready, Needs Remediation)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>1-click CSV roster download formatted for corporate recruiters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Batch-wide skill deficit discovery to plan faculty training workshops</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <Link
                      to="/login"
                      className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow-md transition inline-block"
                    >
                      Access Placement Cell Portal →
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b text-xs font-bold">
                    <span className="text-navy-900">Campus Cohort Distribution</span>
                    <span className="text-primary-600">120 Total Candidates</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <span className="font-black text-emerald-700 text-lg block">68</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Ready</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <span className="font-black text-amber-700 text-lg block">37</span>
                      <span className="text-[10px] text-amber-600 font-bold">Near-Ready</span>
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl">
                      <span className="font-black text-red-700 text-lg block">15</span>
                      <span className="text-[10px] text-red-600 font-bold">Remediation</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MENTOR' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Faculty Mentorship</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                    Conduct Structured Mock Interviews with STAR Rubrics
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Faculty mentors can supervise assigned mentees, evaluate mock interviews on structured technical and communication rubrics, and record feedback.
                  </p>
                  <ul className="space-y-3 pt-2 text-xs text-slate-700 font-semibold">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Assigned candidate roster with live performance trajectories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Structured 5-star scoring for technical depth and behavioral STAR responses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Direct sync into student learning roadmaps with mentor action steps</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <Link
                      to="/login"
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md transition inline-block"
                    >
                      Access Mentor Portal →
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b text-xs font-bold">
                    <span className="text-navy-900">Mock Interview Evaluation Rubric</span>
                    <span className="text-purple-600">STAR Methodology</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="font-semibold text-slate-700">Technical Problem Solving</span>
                      <span className="text-amber-500 font-bold">★★★★☆ (4/5)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="font-semibold text-slate-700">Communication & Articulation</span>
                      <span className="text-amber-500 font-bold">★★★★★ (5/5)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4-Step Placement Roadmap Architecture */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              The Placement Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight mt-3">
              How PlacementAI Accelerates Campus Careers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <span className="w-8 h-8 rounded-xl bg-primary-600 text-white font-black text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="font-extrabold text-navy-900 text-base mb-1">Resume Ingestion</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                NLP pipeline extracts skills, degrees, and validates ATS formatting compatibility in seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <span className="w-8 h-8 rounded-xl bg-primary-600 text-white font-black text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="font-extrabold text-navy-900 text-base mb-1">Diagnostic Exams</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Timed adaptive mock challenges test algorithmic depth, system architecture, and aptitude.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <span className="w-8 h-8 rounded-xl bg-primary-600 text-white font-black text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="font-extrabold text-navy-900 text-base mb-1">SHAP AI Calibration</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Machine learning model calculates readiness score and isolates negative feature deficits.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h3 className="font-extrabold text-navy-900 text-base mb-1">Drive Placement</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Check 1-click criteria eligibility and apply directly to visiting campus recruitment drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student & Recruiter Testimonials */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Proven Student Success
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight mt-3">
              Stories From Candidates Who Achieved Dream Offers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                "The SHAP skill gap insights showed me exactly why my backend architecture score was dragging down my overall readiness. Two weeks following the roadmap and I cleared the Amazon OA and technical rounds."
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center">
                  R
                </div>
                <div>
                  <h4 className="font-extrabold text-navy-900 text-xs">Rohan Sharma</h4>
                  <p className="text-[11px] text-emerald-600 font-bold">Placed at Amazon • ₹28.5 LPA</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                "The Question Palette and timed assessments matched the exact pressure of real campus placement exams. PlacementAI gave me the confidence to ace the coding challenges."
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                  A
                </div>
                <div>
                  <h4 className="font-extrabold text-navy-900 text-xs">Ananya Iyer</h4>
                  <p className="text-[11px] text-indigo-600 font-bold">Placed at Microsoft • ₹44.0 LPA</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                "Generating filtered rosters for visiting companies like Deloitte and TCS used to take our placement cell 3 days. With PlacementAI, we export verified eligible candidates in 10 seconds."
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy-900 text-white font-bold flex items-center justify-center">
                  V
                </div>
                <div>
                  <h4 className="font-extrabold text-navy-900 text-xs">Dr. V. Sundaram</h4>
                  <p className="text-[11px] text-slate-500 font-bold">Head of Placement Cell & TPO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight mt-3">
              Clear Answers About The Platform
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex justify-between items-center font-bold text-navy-900 text-sm hover:text-primary-600 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-bold text-slate-400">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="py-20 bg-gradient-to-r from-navy-900 via-primary-950 to-primary-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest inline-block">
            Start Your Placement Preparation
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready To Turn Skills Into Verified Campus Offers?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join thousands of university candidates using machine learning and explainable AI to calibrate readiness and clear dream corporate recruitment drives.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-primary-500/30 transition"
            >
              Get Started Free →
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-2xl border border-white/20 backdrop-blur-sm transition"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="bg-navy-950 text-slate-400 text-xs py-12 border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-extrabold text-lg mb-3">
              <span className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs">P</span>
              <span>PlacementAI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enterprise campus recruitment and AI skill gap calibration platform connecting engineering talent with top tier hiring partners.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Platform Capabilities</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:text-white transition">SHAP Explainable AI</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Resume NLP Parser</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Timed Coding Challenges</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Campus Recruitment Drives</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Stakeholders</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-white transition">Candidate Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Placement Cell (TPO)</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Faculty Mentorship</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Corporate Recruiters</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">System Status</h4>
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Microservices Operational</span>
            </div>
            <p className="text-[11px] text-slate-500">
              FastAPI ML Pipeline • Express REST Core • SQLite Engine
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-navy-900 text-center text-slate-500 text-[11px]">
          © 2026 PlacementAI Platform • Data Science & Engineering. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
