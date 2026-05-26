import React from 'react';
import { useNavigate } from 'react-router-dom';

const AppliedJobsList = ({ appliedJobs, loading, onJobClick }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
        <p className="text-slate-600 dark:text-gray-305 mt-2">Loading your applications...</p>
      </div>
    );
  }

  // Safely handle job data
  const getJobTitle = (job) => {
    if (!job) return "Job no longer available";
    return job.title || "Untitled Position";
  };

  const getCompanyName = (job) => {
    if (!job) return "Unknown Company";
    if (!job.recruiter) return "Unknown Company";
    return job.recruiter.company || job.recruiter.companyName || job.recruiter.name || "Unknown Company";
  };

  const getJobSkills = (job) => {
    if (!job) return [];
    return job.requiredSkills || [];
  };

  const handleJobClick = (application) => {
    // Only proceed if job exists
    if (application.job) {
      if (typeof onJobClick === 'function') {
        onJobClick(application.job);
      }
      navigate(`/jobs/${application.job.id || application.job._id}`);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">📋</span>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Your Applications
        </h2>
      </div>

      {appliedJobs.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-600 dark:text-gray-300">You haven't applied to any jobs yet.</p>
          <p className="text-slate-500 dark:text-gray-405 text-sm mt-2">Apply to jobs to track your applications here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appliedJobs.map((application) => {
            const jobExists = !!application.job;

            return (
              <div
                key={application.id || application._id}
                onClick={() => jobExists && handleJobClick(application)}
                className={`p-4 rounded-2xl backdrop-blur-sm border transition ${jobExists
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-100 dark:border-indigo-500/20 hover:border-cyan-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg dark:hover:shadow-cyan-500/10 cursor-pointer"
                    : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-rose-100 dark:border-rose-500/20 cursor-not-allowed"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-cyan-600 dark:text-cyan-300">
                      {getJobTitle(application.job)}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-300 font-semibold">
                      {getCompanyName(application.job)}
                    </p>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
                      Applied on: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${application.status === 'approved'
                      ? "bg-emerald-55 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-305 border-emerald-200 dark:border-emerald-500/30"
                      : application.status === 'rejected'
                        ? "bg-red-55 dark:bg-red-600/20 text-red-600 dark:text-red-305 border-red-200 dark:border-red-500/30"
                        : "bg-amber-55 dark:bg-amber-600/20 text-amber-600 dark:text-amber-305 border-amber-200 dark:border-amber-500/30"
                    }`}>
                    {application.status === 'approved' ? 'Approved' : application.status || 'Submitted'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {getJobSkills(application.job).slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full text-xs border border-indigo-100 dark:border-indigo-550/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {!jobExists && (
                  <div className="mt-3 text-red-500 dark:text-rose-400/80 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    This job has been removed by the recruiter
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppliedJobsList;