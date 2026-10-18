import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Resume upload states
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Profile Edit Modal / Inline states
  const [editingBasic, setEditingBasic] = useState(false);
  const [basicForm, setBasicForm] = useState({ targetRole: '', location: '', phone: '' });

  // Education state
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [eduForm, setEduForm] = useState({ degree: 'B.Tech', university: '', cgpa: '', graduationYear: 2026 });

  // Project state
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: ''
  });

  // Experience state
  const [showAddExp, setShowAddExp] = useState(false);
  const [expForm, setExpForm] = useState({
    organization: '',
    role: '',
    duration: '3 Months (Summer)',
    responsibilities: ''
  });

  // Manual Skill state
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: '', level: 'INTERMEDIATE' });

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/student/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        setBasicForm({
          targetRole: data.data.targetRole || '',
          location: data.data.location || '',
          phone: data.data.phone || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(droppedFile);
        setUploadError(null);
      } else {
        setUploadError('Please select a valid PDF file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.name.toLowerCase().endsWith('.pdf')) {
        setFile(selected);
        setUploadError(null);
      } else {
        setUploadError('Please select a valid PDF file.');
      }
    }
  };

  // Upload and parse resume
  const handleUploadResume = async () => {
    if (!file) {
      setUploadError('Please select a PDF resume to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/student/profile/upload-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setUploadSuccess({
          message: data.message,
          extracted: data.extracted,
          skillsAdded: data.skillsAdded || []
        });
        setProfile(data.data);
        setFile(null);
      } else {
        setUploadError(data.message || 'Failed to parse resume.');
      }
    } catch (err) {
      console.error(err);
      setUploadError('Network or server error while uploading resume.');
    } finally {
      setUploading(false);
    }
  };

  // Save basic info
  const handleSaveBasic = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(basicForm)
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        setEditingBasic(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add education
  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/student/profile/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eduForm)
      });
      const data = await response.json();
      if (data.success) {
        setShowAddEdu(false);
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/student/profile/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectForm)
      });
      const data = await response.json();
      if (data.success) {
        setShowAddProject(false);
        setProjectForm({ name: '', description: '', technologies: '', githubUrl: '', liveUrl: '' });
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/v1/student/profile/project/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Experience
  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/student/profile/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expForm)
      });
      const data = await response.json();
      if (data.success) {
        setShowAddExp(false);
        setExpForm({ organization: '', role: '', duration: '3 Months (Summer)', responsibilities: '' });
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Experience
  const handleDeleteExperience = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/v1/student/profile/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Manual Skill
  const handleAddSkillManual = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    try {
      const response = await fetch('http://localhost:8000/api/v1/student/profile/skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skillForm)
      });
      const data = await response.json();
      if (data.success) {
        setShowAddSkill(false);
        setSkillForm({ name: '', level: 'INTERMEDIATE' });
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (skillId) => {
    try {
      await fetch(`http://localhost:8000/api/v1/student/profile/skill/${skillId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-slate-700">Loading Candidate Profile...</p>
      </div>
    );
  }

  const skillsCount = profile?.skills?.length || 0;
  const eduCount = profile?.education?.length || 0;
  const projectCount = profile?.projects?.length || 0;
  const expCount = profile?.experiences?.length || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Profile Header Hero */}
      <div className="bg-gradient-to-r from-navy-900 via-primary-950 to-primary-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-400 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg border-2 border-white/20 flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user?.name}</h1>
                <span className="bg-primary-500/20 text-primary-300 text-xs px-2.5 py-0.5 rounded-full border border-primary-500/30 font-semibold uppercase">
                  Active Candidate
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 flex items-center gap-2">
                <span>{user?.email}</span>
                {profile?.phone && <span>• {profile.phone}</span>}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  Role: <strong className="text-primary-300">{profile?.targetRole || 'Software Development Engineer'}</strong>
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  Skills: <strong className="text-emerald-300">{skillsCount} Registered</strong>
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  Projects: <strong className="text-primary-300">{projectCount}</strong>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/drives"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition backdrop-blur-sm border border-white/10"
            >
              🏢 View Campus Drives
            </Link>
            <Link
              to="/student/dashboard"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition shadow-md shadow-primary-500/25"
            >
              📊 Readiness Forecast
            </Link>
          </div>
        </div>
      </div>

      {/* AI RESUME SCANNER & AUTO-EXTRACTOR CARD */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>
              <span>AI Resume Intelligence Engine</span>
            </div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume Parser & Auto-Sync Pipeline
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Upload your PDF resume. Our NLP pipeline extracts technical skills, education degrees, contact information, and checks ATS format compatibility.
            </p>
          </div>

          {/* ATS Compatibility Meter */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
              88%
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-emerald-900 block">ATS Format Fit</span>
              <span className="text-emerald-700 font-medium">Standard Machine Readable</span>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div className="mt-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-primary-500 bg-primary-50/70 scale-[1.01]'
                : file
                ? 'border-emerald-400 bg-emerald-50/30'
                : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex flex-col items-center justify-center">
              {file ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-slate-800 text-base">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze</p>
                  <p className="text-xs text-primary-600 font-medium mt-2 hover:underline">Click or drop to select a different file</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    <span className="text-primary-600">Click to upload</span> or drag and drop your resume
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF file format only (Max 10MB)</p>
                </>
              )}
            </div>
          </div>

          {/* Action Button & Status */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              ⚡️ Extracts Skills, Degree, Projects & Contact automatically.
            </div>

            <button
              onClick={handleUploadResume}
              disabled={!file || uploading}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2 ${
                !file || uploading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20 active:scale-95'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Parsing Resume via AI Engine...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Extract & Auto-Fill Profile</span>
                </>
              )}
            </button>
          </div>

          {uploadError && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {uploadError}
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-5 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 animate-fadeIn text-xs">
              <p className="font-bold">{uploadSuccess.message}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {uploadSuccess.skillsAdded.map((sk, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-emerald-300 rounded-md font-semibold text-emerald-800">
                    +{sk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 1: Basic Info, Education, Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Info Column */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h3 className="text-base font-extrabold text-navy-900">Basic Details</h3>
            <button
              onClick={() => setEditingBasic(!editingBasic)}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 transition"
            >
              {editingBasic ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingBasic ? (
            <form onSubmit={handleSaveBasic} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Target Role</label>
                <input
                  type="text"
                  value={basicForm.targetRole}
                  onChange={(e) => setBasicForm({ ...basicForm, targetRole: e.target.value })}
                  placeholder="e.g. Software Development Engineer"
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  value={basicForm.location}
                  onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
                  placeholder="e.g. Bangalore, Chennai"
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={basicForm.phone}
                  onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary-600 text-white rounded-xl font-bold text-xs hover:bg-primary-700 transition"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <dl className="space-y-3.5 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">Target Role</dt>
                <dd className="font-bold text-navy-900 mt-0.5">{profile?.targetRole || 'Software Development Engineer'}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Location</dt>
                <dd className="font-bold text-navy-900 mt-0.5">{profile?.location || 'Bangalore, India'}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Phone</dt>
                <dd className="font-bold text-navy-900 mt-0.5">{profile?.phone || 'Not provided'}</dd>
              </div>
            </dl>
          )}
        </div>

        {/* Academic Background Column */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h3 className="text-base font-extrabold text-navy-900">Academic Background</h3>
            <button
              onClick={() => setShowAddEdu(!showAddEdu)}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 transition"
            >
              {showAddEdu ? 'Cancel' : '+ Add'}
            </button>
          </div>

          {showAddEdu && (
            <form onSubmit={handleAddEducation} className="mb-4 p-3 bg-slate-50 rounded-2xl space-y-3 text-xs border border-slate-200">
              <div>
                <label className="font-bold text-slate-600">Degree</label>
                <input
                  type="text"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="B.Tech Computer Science"
                  className="w-full mt-1 px-2.5 py-1.5 border rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">University</label>
                <input
                  type="text"
                  value={eduForm.university}
                  onChange={(e) => setEduForm({ ...eduForm, university: e.target.value })}
                  placeholder="Institute Name"
                  className="w-full mt-1 px-2.5 py-1.5 border rounded-lg bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={eduForm.cgpa}
                    onChange={(e) => setEduForm({ ...eduForm, cgpa: e.target.value })}
                    placeholder="8.5"
                    className="w-full mt-1 px-2.5 py-1.5 border rounded-lg bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Grad Year</label>
                  <input
                    type="number"
                    value={eduForm.graduationYear}
                    onChange={(e) => setEduForm({ ...eduForm, graduationYear: e.target.value })}
                    placeholder="2026"
                    className="w-full mt-1 px-2.5 py-1.5 border rounded-lg bg-white"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition"
              >
                Save Record
              </button>
            </form>
          )}

          {eduCount > 0 ? (
            <ul className="space-y-3">
              {profile.education.map((edu) => (
                <li key={edu.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-navy-900">{edu.degree}</span>
                    <span className="bg-primary-100 text-primary-700 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                      CGPA {edu.cgpa}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{edu.university}</p>
                  <p className="text-slate-400 mt-0.5 text-[11px]">Batch of {edu.graduationYear}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              <p>No education details yet.</p>
              <p className="mt-1 text-primary-600">Drop your resume above to extract automatically.</p>
            </div>
          )}
        </div>

        {/* Skills & Competencies Column */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h3 className="text-base font-extrabold text-navy-900">Skills & Tech Stack</h3>
            <button
              onClick={() => setShowAddSkill(!showAddSkill)}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 transition"
            >
              {showAddSkill ? 'Cancel' : '+ Add Skill'}
            </button>
          </div>

          {showAddSkill && (
            <form onSubmit={handleAddSkillManual} className="mb-4 p-3 bg-slate-50 rounded-2xl space-y-2 text-xs border border-slate-200">
              <input
                type="text"
                placeholder="Skill name (e.g. Docker, TypeScript)"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                required
              />
              <div className="flex gap-2">
                <select
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded-lg bg-white text-xs"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary-600 text-white rounded-lg font-bold"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          {skillsCount > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto">
                {profile.skills.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200/60 shadow-2xs group"
                  >
                    <span>{s.skill?.name || 'Skill'}</span>
                    <button
                      onClick={() => handleDeleteSkill(s.skillId)}
                      className="ml-1.5 text-slate-400 hover:text-red-500 font-bold"
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              <p className="font-bold text-slate-600">No skills registered yet</p>
              <p className="mt-1">Add manual skills or upload resume to populate automatically.</p>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Projects & Work Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-navy-900">Technical Projects</h3>
              <p className="text-xs text-slate-400">Showcase software products, hackathons, and systems</p>
            </div>
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 font-bold text-xs border border-primary-200 hover:bg-primary-100 transition"
            >
              {showAddProject ? 'Cancel' : '+ Add Project'}
            </button>
          </div>

          {showAddProject && (
            <form onSubmit={handleAddProject} className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Cache System"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Technologies Used</label>
                <input
                  type="text"
                  placeholder="e.g. Go, Redis, Docker, gRPC"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows="2"
                  placeholder="Key architecture, problems solved, and performance results..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
              >
                Save Project
              </button>
            </form>
          )}

          {projectCount > 0 ? (
            <div className="space-y-4">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-navy-900 text-sm">{proj.name}</h4>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-slate-400 hover:text-red-500 font-bold"
                        title="Delete project"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                    {proj.technologies && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {proj.technologies.split(',').map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {(proj.githubUrl || proj.liveUrl) && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex gap-3 text-[11px] font-bold">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                          GitHub Repo →
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              <p className="font-bold text-slate-600">No projects added yet</p>
              <p className="mt-1">Add your best technical projects to boost your recruitment eligibility.</p>
            </div>
          )}
        </div>

        {/* Internships & Work Experience */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-navy-900">Internships & Experience</h3>
              <p className="text-xs text-slate-400">Industry work experience and corporate internships</p>
            </div>
            <button
              onClick={() => setShowAddExp(!showAddExp)}
              className="px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 font-bold text-xs border border-primary-200 hover:bg-primary-100 transition"
            >
              {showAddExp ? 'Cancel' : '+ Add Experience'}
            </button>
          </div>

          {showAddExp && (
            <form onSubmit={handleAddExperience} className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Infosys, Start-up Labs"
                  value={expForm.organization}
                  onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Role</label>
                  <input
                    type="text"
                    placeholder="e.g. SDE Intern"
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. May 2025 - July 2025"
                    value={expForm.duration}
                    onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700">Responsibilities</label>
                <textarea
                  rows="2"
                  placeholder="Developed REST APIs, optimized DB queries..."
                  value={expForm.responsibilities}
                  onChange={(e) => setExpForm({ ...expForm, responsibilities: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
              >
                Save Experience
              </button>
            </form>
          )}

          {expCount > 0 ? (
            <div className="space-y-4">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-navy-900 text-sm">{exp.role}</h4>
                      <p className="text-primary-600 font-bold mt-0.5">{exp.organization}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border">
                        {exp.duration}
                      </span>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-slate-400 hover:text-red-500 font-bold"
                        title="Delete experience"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {exp.responsibilities && (
                    <p className="text-slate-600 mt-2 leading-relaxed">{exp.responsibilities}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              <p className="font-bold text-slate-600">No work experience logged</p>
              <p className="mt-1">Add your internships or practical training experiences here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
