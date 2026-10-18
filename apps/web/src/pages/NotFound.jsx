import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200/80">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4 text-2xl font-black">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 text-sm mb-6">
          The requested page could not be located or may have moved.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/student/dashboard"
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition shadow-xs"
          >
            Go to Student Dashboard
          </Link>
          <Link
            to="/"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
