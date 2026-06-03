import React from 'react';
import noiseSvg from '../../assets/noise.svg';

const DashboardBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-cyan-600/5 dark:bg-cyan-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-float"></div>
            <div className="absolute inset-0 opacity-[0.08] dark:opacity-20 mix-blend-overlay" style={{ backgroundImage: `url(${noiseSvg})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 dark:via-[#050B14]/80 dark:to-[#050B14] transition-colors duration-300"></div>
        </div>
    );
};

export default DashboardBackground;
