import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const StudentAnalytics = ({ appliedJobs, loading, onStatusClick }) => {
  const validJobs = appliedJobs.filter(app => app.job);

  const total = validJobs.length;
  const accepted = validJobs.filter(job => job.status === 'approved').length;
  const rejected = validJobs.filter(job => job.status === 'rejected').length;
  const pending = validJobs.filter(job => job.status === 'pending').length;

  const avgFit = total > 0
    ? (validJobs.reduce((sum, job) => sum + (Number(job.fitScore) || 0), 0) / total).toFixed(0)
    : 0;

  const successRate = total > 0 ? ((accepted / total) * 100).toFixed(0) : 0;

  if (loading) {
     return (
       <div className="flex justify-center items-center py-8">
         <div className="w-8 h-8 border-t-2 border-emerald-400 rounded-full animate-spin"></div>
       </div>
     );
  }

  return (
    <div className="relative overflow-hidden bg-slate-900/60 border border-white/5 rounded-3xl p-4 md:p-5 shadow-lg backdrop-blur-md">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3"
      >
        {/* Stat Cards */}
        {[
          { label: 'Total', value: total, filter: 'all', icon: '📝', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Accepted', value: accepted, filter: 'approved', icon: '🎉', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Rejected', value: rejected, filter: 'rejected', icon: '📉', color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Pending', value: pending, filter: 'pending', icon: '⏳', color: 'text-amber-400', bg: 'bg-amber-500/10' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -2 }}
            onClick={() => onStatusClick(stat.filter)}
            className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/[0.08] transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 group-hover:text-slate-300">{stat.label}</p>
              <h3 className={`text-xl font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}

        {/* Mini Progress Bars */}
        <motion.div variants={cardVariants} className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-center gap-1.5 hover:bg-white/[0.05] transition-colors">
           <div className="flex justify-between items-center w-full">
             <p className="text-xs font-medium text-slate-400">Success Rate</p>
             <span className="text-sm font-bold text-emerald-400">{successRate}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
             <motion.div 
               initial={{ width: 0 }} animate={{ width: `${successRate}%` }} transition={{ duration: 1 }}
               className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
             />
           </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-center gap-1.5 hover:bg-white/[0.05] transition-colors">
           <div className="flex justify-between items-center w-full">
             <p className="text-xs font-medium text-slate-400">Avg Fit Score</p>
             <span className="text-sm font-bold text-amber-400">{avgFit}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
             <motion.div 
               initial={{ width: 0 }} animate={{ width: `${avgFit}%` }} transition={{ duration: 1 }}
               className="h-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
             />
           </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default StudentAnalytics;