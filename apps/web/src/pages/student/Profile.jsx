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

  // Add Education Modal / Inline
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [eduForm, setEduForm] = useState({ degree: 'B.Tech', university: '', cgpa: '', graduationYear: 2026 });

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium text-slate-600">Loading student profile...</p>
      </div>
    );
  }

  const skillsCount = profile?.skills?.length || 0;
  const eduCount = profile?.education?.length || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-primary-950 to-primary-900 text-white p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl font-bold shadow-md shadow-primary-950/40 border border-white/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user?.name}</h1>
                <span className="bg-primary-500/20 text-primary-300 text-xs px-2.5 py-0.5 rounded-full border border-primary-500/30 font-semibold uppercase">
                  Candidate
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1 flex items-center gap-2">
                <span>{user?.email}</span>
                {profile?.phone && <span>• {profile.phone}</span>}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  Role: <strong className="text-primary-300">{profile?.targetRole || 'Software Engineer'}</strong>
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  Skills: <strong className="text-primary-300">{skillsCount} Extracted</strong>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition backdrop-blur-sm border border-white/10"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Readiness
            </Link>
          </div>
        </div>
      </div>

      {/* PHASE 7: AI RESUME SCANNER & AUTO-EXTRACTOR CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-primary-600 font-semibold text-sm mb-1">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>
              <span>Phase 7 Feature</span>
            </div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              AI Resume Parser & Profile Auto-Fill
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Upload your PDF resume. Our NLP engine will extract technical skills, contact details, and education automatically.
            </p>
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
              ⚡️ Extracts Skills, Degree, Projects & Contact in seconds.
            </div>

            <button
              onClick={handleUploadResume}
              disabled={!file || uploading}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 ${
                !file || uploading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20 active:scale-95'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Parsing Resume via AI...</span>
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

          {/* Error Message */}
          {uploadError && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{uploadError}</span>
            </div>
          )}

          {/* Extraction Success Card */}
          {uploadSuccess && (
            <div className="mt-5 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-base text-emerald-800 mb-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resume Parsed Successfully!
              </div>
              <p className="text-xs text-emerald-700 mb-4">
                Your profile has been automatically synced with the extracted data.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block">Degree Detected</span>
                  <span className="font-bold text-navy-900 text-sm">
                    {uploadSuccess.extracted?.education_degree || 'Detected'}
                  </span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block">Skills Extracted</span>
                  <span className="font-bold text-navy-900 text-sm">
                    {uploadSuccess.skillsAdded?.length || 0} Skills
                  </span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block">Est. Projects</span>
                  <span className="font-bold text-navy-900 text-sm">
                    {uploadSuccess.extracted?.projects_estimated || 0}
                  </span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block">Phone</span>
                  <span className="font-bold text-navy-900 text-sm">
                    {uploadSuccess.extracted?.phone || 'Not found'}
                  </span>
                </div>
              </div>

              {uploadSuccess.skillsAdded?.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-semibold text-emerald-800 block mb-1.5">Extracted Competencies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {uploadSuccess.skillsAdded.map((skill, idx) => (
                      <span key={idx} className="bg-emerald-100/90 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Info Column */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Basic Details
            </h3>
            <button
              onClick={() => setEditingBasic(!editingBasic)}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition"
            >
              {editingBasic ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingBasic ? (
            <form onSubmit={handleSaveBasic} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Role</label>
                <input
                  type="text"
                  value={basicForm.targetRole}
                  onChange={(e) => setBasicForm({ ...basicForm, targetRole: e.target.value })}
                  placeholder="e.g. Full Stack Developer, Data Analyst"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  value={basicForm.location}
                  onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
                  placeholder="e.g. Chennai, Bangalore, Hybrid"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={basicForm.phone}
                  onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary-600 text-white rounded-lg font-semibold text-xs hover:bg-primary-700 transition"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <dl className="space-y-3.5 text-sm">
              <div>
                <dt className="text-xs text-slate-500 font-medium">Target Role</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">{profile?.targetRole || 'Software Development Engineer'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 font-medium">Location</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">{profile?.location || 'Chennai, India'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 font-medium">Phone</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">{profile?.phone || 'Not provided'}</dd>
              </div>
            </dl>
          )}
        </div>

        {/* Education Column */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Academic Background
            </h3>
            <button
              onClick={() => setShowAddEdu(!showAddEdu)}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition"
            >
              {showAddEdu ? 'Cancel' : '+ Add'}
            </button>
          </div>

          {showAddEdu && (
            <form onSubmit={handleAddEducation} className="mb-4 p-3 bg-slate-50 rounded-xl space-y-3 text-xs border border-slate-200">
              <div>
                <label className="font-semibold text-slate-600">Degree</label>
                <input
                  type="text"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="e.g. B.Tech CSE"
                  className="w-full mt-1 px-2.5 py-1.5 border rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">University / College</label>
                <input
                  type="text"
                  value={eduForm.university}
                  onChange={(e) => setEduForm({ ...eduForm, university: e.target.value })}
                  placeholder="College Name"
                  className="w-full mt-1 px-2.5 py-1.5 border rounded-lg bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600">CGPA</label>
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
                  <label className="font-semibold text-slate-600">Graduation Year</label>
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
                className="w-full py-1.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Add Record
              </button>
            </form>
          )}

          {eduCount > 0 ? (
            <ul className="space-y-4">
              {profile.education.map((edu) => (
                <li key={edu.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-navy-900 text-sm">{edu.degree}</span>
                    <span className="bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      CGPA {edu.cgpa}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{edu.university}</p>
                  <p className="text-slate-400 mt-0.5">Batch of {edu.graduationYear}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              <p>No education details yet.</p>
              <p className="mt-1 text-primary-600">Upload your resume to extract automatically.</p>
            </div>
          )}
        </div>

        {/* Skills & Competencies Column */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <div>
              <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Skills & Tech Stack
              </h3>
            </div>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {skillsCount}
            </span>
          </div>

          {skillsCount > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Skills identified from assessment results and resume parser:
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200/60 shadow-xs"
                  >
                    {s.skill?.name || 'Skill'}
                    <span className="ml-1.5 text-[10px] text-primary-400 uppercase">• {s.level || 'INTERMEDIATE'}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              <svg className="w-10 h-10 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="font-medium text-slate-600">No skills registered yet</p>
              <p className="mt-1">Drop your resume above to detect and populate your technical skills automatically!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
