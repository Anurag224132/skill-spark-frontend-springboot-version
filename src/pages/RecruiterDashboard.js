import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import PostJob from '../components/recruiter/PostJob';
import ManageJobs from '../components/recruiter/ManageJobs';
import ViewApplicants from '../components/recruiter/ViewApplicants';
import RecruiterAnalytics from '../components/recruiter/RecruiterAnalytics';
import SkillGapAnalysis from '../components/recruiter/SkillGapAnalysis';
import LogoutButton from '../components/common/LogoutButton';
import { useAuth } from '../context/AuthContext';
import DashboardBackground from '../components/common/DashboardBackground';

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

const RecruiterDashboard = () => {
  const [view, setView] = useState('manage');
  const { currentUser } = useAuth();
  // Use React Query for fetching global skill gap data
  const {
    data: skillGapsData,
    isLoading: loadingSkillGaps,
  } = useQuery({
    queryKey: ['skillGaps'],
    queryFn: async () => {
      const res = await api.get('/api/recruiter/skill-gap');
      return res.data.missingSkills || [];
    },
    enabled: view === 'skillgap',
  });

  const skillGaps = skillGapsData || [];


  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans overflow-hidden selection:bg-cyan-500/30 relative px-4 py-8">
      <DashboardBackground />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto space-y-8"
      >
        {/* Dark Theme Header */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 group"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Recruiter Command Center
              </h1>
              {currentUser && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Welcome back, {currentUser.name}</p>
                    <p className="text-cyan-300 text-sm font-medium">🎯 {currentUser.role}</p>
                  </div>
                </div>
              )}
            </div>
            <LogoutButton />
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300"
        >
          <div className="flex flex-wrap gap-3 md:gap-4">
            {[
              { key: 'manage', label: 'Manage Jobs', icon: '💼', color: 'cyan', glow: 'shadow-cyan-500/50' },
              { key: 'post', label: 'Post New Job', icon: '🚀', color: 'emerald', glow: 'shadow-emerald-500/50' },
              { key: 'applicants', label: 'View Applicants', icon: '👥', color: 'purple', glow: 'shadow-purple-500/50' },
              { key: 'analytics', label: 'Analytics', icon: '📊', color: 'orange', glow: 'shadow-orange-500/50' },
              { key: 'skillgap', label: 'Skill Gap Analysis', icon: '🎯', color: 'pink', glow: 'shadow-pink-500/50' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setView(tab.key)}
                className={`flex items-center space-x-3 px-6 md:px-8 py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${view === tab.key
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/20'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Content with Dark Theme */}
        <motion.div 
          variants={itemVariants}
          className="transition-all duration-700 ease-in-out"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'manage' && <ManageJobs />}
          {view === 'post' && (
            <PostJob onJobPosted={() => setView('manage')} />
          )}
          {view === 'applicants' && <ViewApplicants />}
          {view === 'analytics' && <RecruiterAnalytics />}
              {view === 'skillgap' && (
                <SkillGapAnalysis 
                  gaps={skillGaps} 
                  loading={loadingSkillGaps} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RecruiterDashboard;