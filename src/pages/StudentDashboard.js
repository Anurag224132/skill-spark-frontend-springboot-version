import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/student/JobCard';
import UploadResume from '../components/student/UploadResume';
import StudentAnalytics from '../components/student/StudentAnalytics';
import ProfileSection from '../components/student/ProfileSection';
import LogoutButton from '../components/common/LogoutButton';
import { useNavigate } from 'react-router-dom';
import JobDetails from '../components/student/JobDetails';
import api from '../utils/api';
import Pagination from '../components/common/Pagination';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State declarations
  const [userSkills, setUserSkills] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [page, setPage] = useState(0);
  const [showAppliedJobs, setShowAppliedJobs] = useState(false);
  const [showResumeViewer, setShowResumeViewer] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);

  // Check for previously uploaded resume on initial load
  // Sync local data on mount
  useEffect(() => {
    const hasResume = localStorage.getItem('hasUploadedResume') === 'true';
    if (hasResume) {
      setHasUploadedResume(true);
    }
  }, []);

  // Load user skills
  useEffect(() => {
    if (currentUser?.skills?.length > 0) {
      setUserSkills(currentUser.skills);
    }
  }, [currentUser]);

  // Use React Query for fetching recommended jobs
  const {
    data: jobsData,
    isLoading: loading
  } = useQuery({
    queryKey: ['recommendedJobs', page, userSkills, hasUploadedResume],
    queryFn: async () => {
      // Fetch jobs whether or not they have a resume (so something is always visible)
      console.log('Fetching active jobs from backend...');
      const jobsRes = await api.get(`/api/jobs?page=${page}&size=10`);
      const allJobs = jobsRes.data.content || jobsRes.data || [];
      const totalPages = jobsRes.data.totalPages || 0;

      if (!hasUploadedResume || allJobs.length === 0) {
        return { jobs: allJobs, totalPages, fitScores: {}, allJobs };
      }

      let scores = {};
      let rankedJobs = [...allJobs];

      // 1. Fetch Fit Scores in Batch (shows match scores for all fetched jobs)
      try {
        console.log('Calculating fit scores for', allJobs.length, 'jobs');
        const fitRes = await api.post('/api/applications/calculate-fit-batch', {
          jobIds: allJobs.map(j => j.id || j._id),
          resumeSkills: userSkills
        });
        scores = fitRes.data || {};
      } catch (fitErr) {
        console.error('Error fetching batch fit scores:', fitErr);
      }

      // 2. ML Ranking (Try matching but don't filter out unmatched ones)
      if (userSkills.length > 0 && process.env.REACT_APP_ML_API_URL) {
        try {
          console.log('Requesting ML ranking for user skills...');
          const matchRes = await axios.post(
            `${process.env.REACT_APP_ML_API_URL}/match_jobs`,
            {
              skills: userSkills,
              jobs: allJobs.map(job => ({ id: job.id || job._id, requiredSkills: job.requiredSkills || [] }))
            }
          );

          const matchedIds = (matchRes.data?.matches || []).map(m => m.id || m._id);

          if (matchedIds.length > 0) {
            // Sort jobs: matched ones first, then by match score if available
            rankedJobs.sort((a, b) => {
              const aId = a.id || a._id;
              const bId = b.id || b._id;
              const aMatched = matchedIds.includes(aId);
              const bMatched = matchedIds.includes(bId);

              if (aMatched && !bMatched) return -1;
              if (!aMatched && bMatched) return 1;

              // Second sort: higher match score first
              return (scores[bId] || 0) - (scores[aId] || 0);
            });
            console.log('Jobs ranked by relevance.');
          }
        } catch (mlErr) {
          console.error('ML Ranking failed, using score-only sorting:', mlErr);
          rankedJobs.sort((a, b) => (scores[b.id || b._id] || 0) - (scores[a.id || a._id] || 0));
        }
      }

      return { jobs: rankedJobs, totalPages, fitScores: scores, allJobs };
    },
    enabled: !!(currentUser && currentUser.role?.toLowerCase() === 'student')
  });

  const { jobs = [], totalPages = 0, fitScores = {}, allJobs = [] } = jobsData || {};

  const {
    data: appliedJobsData,
    isLoading: appliedJobsLoading,
  } = useQuery({
    queryKey: ['appliedJobs', currentUser?.id || currentUser?._id],
    queryFn: async () => {
      if (!currentUser) return [];
      const res = await api.get('/api/applications');
      const applications = res.data.content || res.data;
      return Array.isArray(applications) ? applications.map(app => ({
        ...app,
        status: app.status.toLowerCase()
      })) : [];
    },
    enabled: !!currentUser && (currentUser.role === 'student' || currentUser.role === 'STUDENT'),
  });

  const appliedJobs = useMemo(() => appliedJobsData || [], [appliedJobsData]);
  const appliedJobIds = useMemo(() => new Set(appliedJobs.map(app => app.job?.id || app.job?._id)), [appliedJobs]);

  // Handle resume parse update
  const handleResumeParsed = (parsedData) => {
    if (parsedData.skills?.length > 0) {
      setUserSkills(parsedData.skills);
      setHasUploadedResume(true);
      localStorage.setItem('hasUploadedResume', 'true');
    } else {
      alert('No skills found in the uploaded resume.');
    }
  };

  const handleViewResume = async () => {
    try {
      const res = await api.get('/api/resumes/download', {
        responseType: 'blob'
      });
      let type = res.headers['content-type'];
      if (!type || type === 'application/octet-stream' || type === 'application/json') {
        type = 'application/pdf'; // fallback to try to render pdf
      }
      const url = window.URL.createObjectURL(new Blob([res.data], { type }));
      setResumeUrl(url);
      setShowResumeViewer(true);
    } catch (err) {
      console.error('Error downloading resume:', err);
      alert('Could not open resume.');
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);

    // Track in recent jobs
    let viewed = JSON.parse(localStorage.getItem('recentJobs')) || [];
    const id = job.id || job._id;
    viewed = [job, ...viewed.filter(j => (j.id || j._id) !== id)].slice(0, 5);
    localStorage.setItem('recentJobs', JSON.stringify(viewed));
  };

  /**  Handle applied job click */
  const handleAppliedJobClick = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);

    let viewed = JSON.parse(localStorage.getItem('recentJobs')) || [];
    const id = job.id || job._id;
    viewed = [job, ...viewed.filter(j => (j.id || j._id) !== id)].slice(0, 5);
    localStorage.setItem('recentJobs', JSON.stringify(viewed));
  };

  // Filter applied jobs by status
  const filterByStatus = (status) => {
    if (status === 'all') {
      setStatusFilter(null);
    } else {
      setStatusFilter(status);
    }
    setShowAppliedJobs(true);
  };

  const filteredJobs = useMemo(() => {
    if (!statusFilter) return appliedJobs;
    return appliedJobs.filter(job => job.status === statusFilter);
  }, [appliedJobs, statusFilter]);

  // Clear status filter and hide list
  const clearFilter = () => {
    setStatusFilter(null);
    setShowAppliedJobs(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4 py-8">
      <div className="fixed top-6 right-6 z-50">
        <ProfileSection />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-glow flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Welcome back, {currentUser?.name}!
                </h1>
                <p className="text-cyan-300 font-semibold text-lg">Student Dashboard</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/recent-jobs')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-semibold hover:from-emerald-600 hover:to-cyan-600 transition transform hover:scale-105 active:scale-95"
              >
                📂 View Recently Viewed Jobs
              </button>
              <LogoutButton />
            </div>
          </div>
        </motion.div>

        {/* Analytics with status filtering */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-3xl"
        >
          <StudentAnalytics
            appliedJobs={appliedJobs}
            loading={appliedJobsLoading}
            onStatusClick={filterByStatus}
          />
        </motion.div>

        {/* Applied Jobs List (Visible by default if exists, or when status clicked) */}
        {showAppliedJobs && appliedJobs.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl relative animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400">
                {statusFilter === 'approved'
                  ? 'Approved Applications'
                  : statusFilter
                    ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Applications`
                    : 'All Applications'}
              </h2>
              <button
                onClick={clearFilter}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-indigo-600 transition"
              >
                Close List
              </button>
            </div>
            <div className="space-y-4">
              {filteredJobs.map((application) => {
                const jobExists = !!application.job;
                return (
                  <div
                    key={application.id || application._id}
                    className={`bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg transition ${jobExists
                      ? 'hover:shadow-emerald-400/20 cursor-pointer'
                      : 'cursor-not-allowed'
                      }`}
                    onClick={() => jobExists && handleAppliedJobClick(application.job)}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-emerald-300">
                          {application.jobTitle || (application.job && application.job.title) || 'Job no longer available'}
                        </h3>
                        <p className="text-gray-300">
                          {application.companyName || (application.job && application.job.companyName) || 'Unknown Company'}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Applied on: {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${application.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-300/30'
                          : application.status === 'approved'
                            ? 'bg-green-500/20 text-green-300 border border-green-300/30'
                            : 'bg-red-500/20 text-red-300 border border-red-300/30'
                          }`}>
                          {application.status.toUpperCase()}
                        </span>
                        <div className="text-sm text-gray-300 mt-2">
                          <p>Recruiter: {application.job && application.job.recruiter
                            ? application.job.recruiter.name
                            : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skills Banner */}
        {hasUploadedResume && userSkills.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-3xl relative overflow-hidden group"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
              <div className="flex items-center space-x-4 shrink-0 md:pr-6 md:border-r border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl flex items-center justify-center border border-blue-400/20 shadow-lg shadow-blue-500/5">
                  <span className="text-2xl group-hover:rotate-12 transition-transform">🎯</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Extracted Skills</h2>
                  <p className="text-xs text-blue-200/60 mt-0.5">Found in your resume</p>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap gap-2.5">
                  {userSkills.map((skill, idx) => (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (idx * 0.05), duration: 0.2 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-blue-300 rounded-xl text-sm font-medium border border-blue-500/20 shadow-lg shadow-blue-500/5 hover:border-blue-400/50 hover:shadow-blue-500/20 hover:text-blue-200 transition-all cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="space-y-8">
            {/* Upload Resume */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-8 rounded-3xl relative overflow-hidden group"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

              <div className="flex items-center mb-8 relative z-10 w-full">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.3)] relative overflow-hidden group-hover:scale-105 transition-all duration-300">
                    <div className="absolute inset-0 bg-emerald-400/20 animate-pulse"></div>
                    <svg className="w-6 h-6 text-emerald-300 relative z-10 group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Upload Resume
                  </h2>
                </div>
                
                {/* Parse Status Badge & View Button */}
                <div className="ml-auto flex items-center gap-3">
                  {hasUploadedResume && (
                    <button 
                      onClick={handleViewResume}
                      className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm shadow-blue-500/10 flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View
                    </button>
                  )}
                  
                  {hasUploadedResume ? (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                      Parsed
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                      Not Parsed
                    </span>
                  )}
                </div>
              </div>

              <div className="relative z-10 transition-all duration-300">
                <UploadResume onParsed={handleResumeParsed} />
              </div>

              {!hasUploadedResume && (
                <div className="mt-6 bg-cyan-900/20 backdrop-blur-sm p-4 rounded-xl border border-cyan-400/20 flex items-center space-x-3 relative z-10">
                  <span className="text-cyan-400 text-lg">💡</span>
                  <p className="text-cyan-200 text-sm">
                    Upload your resume to see your skills and get job recommendations
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            {/* Recommended Jobs */}
            <div className="glass-panel p-8 rounded-3xl">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">💼</span>
                <h2 id="recommended-jobs-title" className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Recommended Jobs
                </h2>
              </div>

              {!hasUploadedResume ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📄</div>
                  <p className="text-gray-300">Upload your resume to get started</p>
                  <p className="text-gray-400 text-sm mt-2">
                    We'll analyze your skills and show personalized recommendations
                  </p>
                  <button
                    onClick={() => document.getElementById('resume-upload-input')?.click()}
                    className="mt-4 px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition"
                  >
                    Upload Resume Now
                  </button>
                </div>
              ) : loading ? (
                <div className="flex justify-center items-center py-12 space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                  <p className="text-gray-300">Finding perfect matches for you...</p>
                </div>
              ) : (jobs.length === 0 && allJobs.length === 0) ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📢</div>
                  <p className="text-gray-300">No active jobs available in the system yet.</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later or try updating your resume.</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-gray-300">No jobs matching your specific skills currently.</p>
                  <p className="text-gray-400 text-sm mt-2">Try updating your resume with more skills or exploring all jobs.</p>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  {jobs.map((job) => (
                    <motion.div variants={itemVariants} key={job.id || job._id}>
                      <JobCard
                        job={job}
                        userSkills={userSkills}
                        onJobClick={handleJobClick}
                        preCalculatedFitScore={fitScores[job.id || job._id]}
                        isApplied={appliedJobIds.has(job.id || job._id)}
                      />
                    </motion.div>
                  ))}

                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => {
                      setPage(newPage);
                      // Scroll to top of job list
                      document.getElementById('recommended-jobs-title')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <JobDetails
              jobId={selectedJob.id || selectedJob._id}
              onClose={() => setShowJobDetails(false)}
            />
          </div>
        </div>
      )}

      {/* Resume Viewer Modal */}
      {showResumeViewer && resumeUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="bg-slate-900 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-white/10 shadow-2xl animate-fade-in">
            <div className="p-5 bg-slate-800/80 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                <span className="text-2xl">📄</span> Document Viewer
              </h3>
              <div className="flex gap-4">
                <a 
                  href={resumeUrl} 
                  download="My_Resume"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download
                </a>
                <button 
                  onClick={() => setShowResumeViewer(false)}
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe 
                src={resumeUrl} 
                className="w-full h-full border-none absolute inset-0" 
                title="Resume Viewer" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;