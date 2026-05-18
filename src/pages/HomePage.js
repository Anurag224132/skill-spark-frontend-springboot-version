import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import adminpic from '../assets/images/admin.png';
import appic from '../assets/images/app.png';
import applicationpic from '../assets/images/applicationTracking.png';
import recruiterpic from '../assets/images/recruiter.png';
import resumeparsing from '../assets/images/resumeParsing.png';
import studentpic from '../assets/images/student.png';

// Main Home Page Component
const HomePage = () => {
    // Helper component for Feature Cards
    const FeatureCard = ({ icon, title, children, delay }) => (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-panel p-8 rounded-3xl text-center group cursor-default"
        >
            <div className="mb-6 inline-block p-4 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl shadow-glow group-hover:from-emerald-500 group-hover:to-cyan-500 transition-all duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
        </motion.div>
    );

    // Helper component for "How It Works" Steps
    const StepCard = ({ number, title, children, delay }) => (
         <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            className="relative pl-12 pb-10 border-l-2 border-slate-700/50 last:border-transparent last:pb-0"
         >
            <div className="absolute left-[-17px] top-0 flex items-center justify-center w-8 h-8 font-bold text-white bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full shadow-glow">
                {number}
            </div>
            <h4 className="font-bold text-lg text-white mb-2">{title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
        </motion.div>
    );

    const screenshots = [
      {
        title: "Student Dashboard",
        description: "Personalized job recommendations with AI-powered fit scores.",
        imageUrl: studentpic
      },
      {
        title: "Recruiter Analytics",
        description: "In-depth analytics and skill-gap analysis for recruiters.",
        imageUrl: recruiterpic
      },
      {
        title: "Admin Control Panel",
        description: "Comprehensive user and job management for administrators.",
        imageUrl: adminpic
      },
      {
        title: "Job Application View",
        description: "Track the status of all your job applications in one place.",
        imageUrl: applicationpic
      },
      {
        title: "AI Resume Parsing",
        description: "Upload your resume and see our AI extract your skills in real-time.",
        imageUrl: resumeparsing
      }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white font-sans">
            {/* Header */}
            <header className="py-5 px-4 md:px-8 sticky top-0 z-50 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
                <nav className="max-w-7xl mx-auto flex justify-between items-center">
                    <a href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        SkillSpark
                    </a>
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                        <a href="#features" className="hover:text-cyan-400 transition">Features</a>
                        <a href="#gallery" className="hover:text-cyan-400 transition">Gallery</a>
                        <a href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</a>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link to="/login" className="px-4 py-2 text-sm rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition">
                            Login
                        </Link>
                        <Link to="/signup" className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg">
                            Sign Up
                        </Link>
                    </div>
                </nav>
            </header>

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 md:pt-40 md:pb-32 text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-grid-slate-700/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)] animate-pulse-slow"></div>
                     <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
                     <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                     
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6 leading-tight drop-shadow-2xl"
                        >
                            Where Talent Meets Opportunity, Intelligently.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
                        >
                            Our AI-powered platform analyzes your skills to connect you with the perfect job, and helps recruiters find the ideal candidate faster than ever.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex justify-center gap-4"
                        >
                             <Link to="/signup" className="px-8 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-glow">
                                Get Started
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-slate-900/40">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white">A Smarter Way to Hire and Get Hired</h2>
                            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">SkillSpark is more than a job board. It's a smart ecosystem with dedicated features for everyone.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard delay={0.1} title="For Students: Smart Job Matching" icon={<svg className="w-8 h-8 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m6-7h3m-18 0h3m6 7a5 5 0 100-10 5 5 0 000 10z" /></svg>}>
                                Upload your resume and our AI will instantly parse your skills to provide a "Fit Score" for every job, showing you the best opportunities first.
                            </FeatureCard>
                            <FeatureCard delay={0.2} title="For Recruiters: Data-Driven Hiring" icon={<svg className="w-8 h-8 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
                                Get a ranked list of candidates, perform skill-gap analysis on your applicant pool, and use predictive analytics to forecast hiring trends.
                            </FeatureCard>
                            <FeatureCard delay={0.3} title="For Admins: Total Control" icon={<svg className="w-8 h-8 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}>
                                A comprehensive dashboard to manage users, oversee job postings, and monitor system-wide analytics with a full audit log of all admin actions.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section id="gallery" className="py-24">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white">See SkillSpark in Action</h2>
                            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">A glimpse into the user-friendly and powerful dashboards that drive our platform.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {screenshots.map((screenshot, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group glass-panel p-4 rounded-3xl cursor-default"
                                >
                                    <div className="overflow-hidden rounded-2xl mb-4">
                                        <img src={screenshot.imageUrl} alt={screenshot.title} className="w-full h-auto transition-transform duration-500 group-hover:scale-105"/>
                                    </div>
                                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-cyan-300 transition-colors">{screenshot.title}</h3>
                                    <p className="text-gray-400 text-sm">{screenshot.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-24 bg-slate-900/40">
                     <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-bold text-white mb-4">Get Started in 4 Easy Steps</h2>
                            <p className="text-gray-400 mb-12">Our streamlined process makes it simple to find your next career move or your next star employee.</p>
                            <div className="space-y-4">
                                <StepCard delay={0.1} number="1" title="Create Your Account">
                                    Sign up in seconds as a student looking for opportunities or a recruiter ready to hire.
                                </StepCard>
                                 <StepCard delay={0.2} number="2" title="Upload Your Resume">
                                    Students can upload their resume, and our AI will parse, analyze, and map out their skills.
                                </StepCard>
                                <StepCard delay={0.3} number="3" title="Post or Find Jobs">
                                    Recruiters post jobs with required skills. Students see jobs ranked by their "Fit Score".
                                </StepCard>
                                <StepCard delay={0.4} number="4" title="Connect and Grow">
                                    Apply with confidence, track your application status, and connect with top talent.
                                </StepCard>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                           <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg">
                                <img src={appic} alt="App Screenshot" className="rounded-lg shadow-2xl"/>
                           </div>
                        </div>
                    </div>
                </section>
            </main>

             {/* Footer */}
            <footer className="bg-slate-900/50 border-t border-white/10 mt-10">
                <div className="max-w-7xl mx-auto py-8 px-4 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} SkillSpark. All Rights Reserved.</p>
                </div>
            </footer>
             <style>{`
                .bg-grid-slate-700\\/20 {
                    background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px);
                    background-size: 4rem 4rem;
                    background-color: transparent;
                    opacity: 0.1;
                }
            `}</style>
        </div>
    );
};

export default HomePage;

