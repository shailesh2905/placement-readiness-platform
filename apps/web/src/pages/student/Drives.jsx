import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function Drives() {
  const { token, user } = useAuthStore();
  const [drives, setDrives] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterEligibility, setFilterEligibility] = useState('ALL'); // ALL, ELIGIBLE, APPLIED
  
  // Selected Drive for Detail Modal
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccessMessage, setApplySuccessMessage] = useState('');

  const fetchDrives = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/drives', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDrives(data.data);
        setSummary(data.summary);
      } else {
        setError(data.message || 'Failed to load recruitment drives.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error connecting to recruitment server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [token]);

  const handleApply = async (driveId) => {
    setApplying(true);
    setApplySuccessMessage('');
    try {
      const res = await fetch(`http://localhost:8000/api/v1/drives/${driveId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setApplySuccessMessage(data.message);
        // Refresh drives to update application state
        fetchDrives();
        setTimeout(() => {
          setSelectedDrive(null);
          setApplySuccessMessage('');
        }, 2000);
      } else {
        alert(data.message || 'Application failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  const filteredDrives = drives.filter(d => {
    const matchesSearch = d.company.toLowerCase().includes(search.toLowerCase()) ||
                          d.role.toLowerCase().includes(search.toLowerCase()) ||
                          d.location.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterEligibility === 'ELIGIBLE') return d.isEligible;
    if (filterEligibility === 'APPLIED') return d.hasApplied;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-slate-700">Loading Campus Recruitment Drives...</p>
        <p className="text-xs text-slate-400 mt-1">Evaluating live CGPA and readiness score criteria</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-primary-950 to-primary-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-primary-300 font-bold text-xs uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Campus Recruitment Season 2026-2027</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Recruitment Drives & Campus Opportunities
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Explore participating companies, check real-time AI eligibility based on your CGPA and readiness score, and submit 1-click applications.
            </p>
          </div>

          {/* Quick Metrics */}
          {summary && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 grid grid-cols-2 gap-4 text-center min-w-[260px]">
              <div>
                <span className="text-xs text-slate-300 block font-medium">Eligible Drives</span>
                <span className="text-2xl font-black text-emerald-400">{summary.eligibleDrives} / {summary.totalDrives}</span>
                <span className="text-[10px] text-slate-400 block">Drives Qualified</span>
              </div>
              <div>
                <span className="text-xs text-slate-300 block font-medium">Applications</span>
                <span className="text-2xl font-black text-primary-300">{summary.appliedDrives}</span>
                <span className="text-[10px] text-slate-400 block">Submitted</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search company, job role, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs font-semibold">
          <button
            onClick={() => setFilterEligibility('ALL')}
            className={`px-4 py-2 rounded-xl transition ${
              filterEligibility === 'ALL'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Drives ({drives.length})
          </button>
          <button
            onClick={() => setFilterEligibility('ELIGIBLE')}
            className={`px-4 py-2 rounded-xl transition ${
              filterEligibility === 'ELIGIBLE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Eligible Only ({summary?.eligibleDrives || 0})
          </button>
          <button
            onClick={() => setFilterEligibility('APPLIED')}
            className={`px-4 py-2 rounded-xl transition ${
              filterEligibility === 'APPLIED'
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            My Applications ({summary?.appliedDrives || 0})
          </button>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrives.map((drive) => (
          <div
            key={drive.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Company, Role & Package */}
              <div className="flex justify-between items-start gap-3 mb-3">
                <div>
                  <h3 className="text-xl font-extrabold text-navy-900">{drive.company}</h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">{drive.role}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-xs rounded-full whitespace-nowrap shadow-xs">
                  {drive.packageCTC}
                </span>
              </div>

              {/* Location & Openings */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  📍 {drive.location}
                </span>
                <span>•</span>
                <span>👥 {drive.openings} Openings</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                {drive.description}
              </p>

              {/* Required Skills */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Target Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {drive.requiredSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Real-time Eligibility Pill */}
              <div className={`p-3.5 rounded-2xl border text-xs mb-5 ${
                drive.isEligible
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    {drive.isEligible ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Criteria Verified Eligible</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Eligibility Deficit</span>
                      </>
                    )}
                  </span>
                  <span className="text-[11px] font-extrabold">
                    {drive.eligibilityDetails.skillMatchPercentage}% Skill Fit
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between mt-1 pt-1 border-t border-slate-200/50">
                  <span>CGPA: <strong>{drive.eligibilityDetails.userCgpa}</strong> (Req: {drive.minCgpa})</span>
                  <span>Readiness: <strong>{drive.eligibilityDetails.userReadiness}%</strong> (Req: {drive.minReadiness}%)</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedDrive(drive)}
                className="text-xs font-bold text-slate-600 hover:text-navy-900 transition"
              >
                Drive Details →
              </button>

              {drive.hasApplied ? (
                <span className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Applied</span>
                </span>
              ) : drive.isEligible ? (
                <button
                  onClick={() => handleApply(drive.id)}
                  disabled={applying}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-primary-500/20 transition"
                >
                  Apply Now
                </button>
              ) : (
                <Link
                  to="/student/learning-plan"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Fix Skill Gaps
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDrives.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <p className="text-base font-bold text-navy-900">No recruitment drives matching your filters</p>
          <p className="text-xs text-slate-400">Try adjusting your search criteria or view all drives.</p>
        </div>
      )}

      {/* Drive Details & Hiring Stages Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-200 mb-1 inline-block">
                  Campus Drive Briefing
                </span>
                <h3 className="text-2xl font-black text-navy-900">{selectedDrive.company}</h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{selectedDrive.role}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-sm rounded-full">
                {selectedDrive.packageCTC}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-navy-900 uppercase text-[11px] tracking-wider text-slate-400 mb-1">
                  About the Role & Team
                </h4>
                <p className="text-slate-600 leading-relaxed">{selectedDrive.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-navy-900 uppercase text-[11px] tracking-wider text-slate-400 mb-2">
                  Hiring & Selection Rounds
                </h4>
                <div className="space-y-2">
                  {selectedDrive.rounds.map((round, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-primary-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-800">{round}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium block">Application Deadline</span>
                  <span className="font-extrabold text-navy-900">{selectedDrive.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Drive Assessment Date</span>
                  <span className="font-extrabold text-navy-900">{selectedDrive.driveDate}</span>
                </div>
              </div>

              {applySuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center font-bold">
                  {applySuccessMessage}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDrive(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
              {!selectedDrive.hasApplied && selectedDrive.isEligible && (
                <button
                  onClick={() => handleApply(selectedDrive.id)}
                  disabled={applying}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-primary-500/20 active:scale-95"
                >
                  {applying ? 'Submitting Application...' : 'Confirm & Apply'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
