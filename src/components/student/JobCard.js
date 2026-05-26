import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const JobCard = ({ job, userSkills = [], onJobClick, preCalculatedFitScore, isApplied = false }) => {

  const { currentUser } = useAuth();
  const [fitScore, setFitScore] = useState(null);
  const [applied, setApplied] = useState(isApplied);
  const [isLoading, setIsLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setApplied(isApplied);
  }, [isApplied]);

  useEffect(() => {
    if (preCalculatedFitScore !== undefined && preCalculatedFitScore !== null) {
      setFitScore(preCalculatedFitScore);
    } else if (userSkills.length > 0) {
      calculateFitScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSkills, preCalculatedFitScore]);

  const calculateFitScore = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/api/applications/calculate-fit', {
        resumeSkills: userSkills,
        jobId: job.id || job._id,
      });
      setFitScore(res.data.score);
    } catch (err) {
      console.error('❌ Error calculating fit score:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.stopPropagation();

    if (!(currentUser?.id || currentUser?._id)) {
      alert('Please log in to apply for jobs');
      return;
    }

    if (fitScore === null) {
      alert('Please wait while we calculate your fit score');
      return;
    }

    setApplying(true);
    try {
      const response = await api.post('/api/applications', {
        jobId: job.id || job._id
      });

      // Robust check: any 2xx response with a truthy body is a success
      if (response.status === 200 || response.status === 201 || (response.data && (response.data.id || response.data._id))) {
        setApplied(true);
        alert('✅ Application submitted successfully!');
      } else {
        console.warn('Unexpected response structure:', response.data);
        throw new Error('Server returned a success status but missing application ID');
      }
    } catch (error) {
      console.error('Application error:', error);
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to submit application';
      alert(`Application failed: ${errorMessage}`);
    } finally {
      setApplying(false);
    }
  };

  const getFitScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-green-405';
    if (score >= 60) return 'from-yellow-500 to-orange-400';
    return 'from-red-500 to-pink-400';
  };

  const getFitScoreText = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  const handleViewJob = () => {
    if (typeof onJobClick === 'function') {
      onJobClick(job);
    }
  };

  const togglePopup = (e) => {
    e.stopPropagation();
    setShowPopup(!showPopup);
  };

  return (
    <>
      {/* Job Card (Compact View) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleViewJob}
        className="cursor-pointer glass-panel p-6 rounded-3xl hover:shadow-glow transition-all duration-300 text-slate-800 dark:text-white group"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Basic Job Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent truncate">
              {job.title}
            </h3>
            <div className="flex items-center space-x-4 text-slate-500 dark:text-gray-300 text-sm mt-1">
              {job.companyName && (
                <div className="flex items-center space-x-1 truncate font-medium">
                  <span>🏢</span>
                  <span className="truncate">{job.companyName}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>{job.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fit Score & Details Button */}
          <div className="flex items-center space-x-4 sm:w-48">
            {/* Fit Score */}
            <div className="text-center min-w-[60px]">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin h-5 w-5 border-b-2 border-emerald-500"></div>
                </div>
              ) : fitScore !== null ? (
                <div className="space-y-1">
                  <div className={`text-lg font-bold bg-gradient-to-r ${getFitScoreColor(fitScore)} bg-clip-text text-transparent`}>
                    {fitScore}%
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 dark:text-gray-400 text-xs">No score</div>
              )}
            </div>

            {/* Details Button */}
            <button
              onClick={togglePopup}
              className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200/50 dark:border-transparent text-slate-800 dark:text-white rounded-lg text-sm transition font-semibold"
            >
              Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-800 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header with close button */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{job.title}</h2>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-100 dark:border-transparent">
                    {job.companyName || 'Unknown Company'}
                  </span>
                  {job.remote && (
                    <span className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold border border-blue-100 dark:border-transparent">
                      Remote
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={togglePopup}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Job Details Content */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Job Description</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-slate-700 dark:text-slate-200 whitespace-pre-line border border-slate-200/50 dark:border-transparent">
                  {job.description || 'No description provided.'}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${userSkills.includes(skill)
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-305 border border-emerald-200 dark:border-transparent'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-transparent'
                        }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/50 dark:border-transparent">
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Location</div>
                  <div className="text-slate-800 dark:text-white font-medium">{job.location || 'Not specified'}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/50 dark:border-transparent">
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Salary</div>
                  <div className="text-slate-800 dark:text-white font-medium">{job.salary || 'Not specified'}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/50 dark:border-transparent">
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Job Type</div>
                  <div className="text-slate-800 dark:text-white font-medium capitalize">{job.type?.toLowerCase() || 'Not specified'}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/50 dark:border-transparent">
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Experience Level</div>
                  <div className="text-slate-800 dark:text-white font-medium capitalize">{job.experience?.toLowerCase() || 'Not specified'}</div>
                </div>
              </div>

              {/* Fit Score Visualization */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/50 dark:border-transparent animate-fade-in">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Your Match Score</h3>
                {fitScore !== null ? (
                  <div className="space-y-4">
                    <div className={`text-4xl font-bold text-center bg-gradient-to-r ${getFitScoreColor(fitScore)} bg-clip-text text-transparent`}>
                      {fitScore}%
                    </div>
                    <div className={`text-center px-3 py-1 rounded-full ${getFitScoreColor(fitScore)} text-white text-sm font-semibold shadow-md`}>
                      {getFitScoreText(fitScore)}
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full bg-gradient-to-r ${getFitScoreColor(fitScore)}`}
                        style={{ width: `${fitScore}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400">Score not calculated</div>
                )}
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                disabled={applied || applying || fitScore === null}
                className={`w-full py-3.5 rounded-xl font-bold transition-all transform hover:scale-[1.01] active:scale-95 shadow-md ${applied
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : applying
                    ? 'bg-gray-500 text-white cursor-not-allowed animate-pulse'
                    : fitScore === null
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-450 dark:text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white hover:opacity-90 shadow-cyan-500/25'
                  }`}
              >
                {applied ? '✅ Applied' : applying ? 'Applying...' : '🚀 Apply Now'}
              </button>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobCard;