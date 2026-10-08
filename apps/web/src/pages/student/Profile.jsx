import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function Profile() {
  const { token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">My Profile</h2>
          <p className="text-slate-500 mt-1">Manage your academic and professional details.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">Edit Profile</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b pb-2">Basic Info</h3>
          <dl className="space-y-3 text-sm">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Target Role</dt>
              <dd className="col-span-2 text-slate-900">{profile?.targetRole || 'Not set'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Location</dt>
              <dd className="col-span-2 text-slate-900">{profile?.location || 'Not set'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Phone</dt>
              <dd className="col-span-2 text-slate-900">{profile?.phone || 'Not set'}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-medium text-slate-800">Education</h3>
            <button className="text-primary-600 text-sm hover:underline">+ Add</button>
          </div>
          {profile?.education?.length > 0 ? (
            <ul className="space-y-4">
              {profile.education.map(edu => (
                <li key={edu.id} className="text-sm">
                  <p className="font-semibold text-navy-900">{edu.degree}</p>
                  <p className="text-slate-600">{edu.university}</p>
                  <p className="text-slate-500">CGPA: {edu.cgpa} | Class of {edu.graduationYear}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm italic">No education details added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
