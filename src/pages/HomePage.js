import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/common/ThemeToggle';

import adminpic from '../assets/images/admin.png';
import appic from '../assets/images/app.png';
import applicationpic from '../assets/images/applicationTracking.png';
import recruiterpic from '../assets/images/recruiter.png';
import resumeparsing from '../assets/images/resumeParsing.png';
import studentpic from '../assets/images/student.png';

// --- Shared Animation Wrappers ---
const FadeInUp = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

const HomePage = () => {
    // Dynamic text for Hero Section
    const [textIndex, setTextIndex] = useState(0);
    const dynamicTexts = ["Intelligently.", "Instantly.", "Accurately.", "Effortlessly."];

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [dynamicTexts.length]);

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
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-white font-sans overflow-hidden selection:bg-cyan-500/30 transition-colors duration-300">
            {/* --- Global Background Effects --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-cyan-600/5 dark:bg-cyan-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-float"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] dark:opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 dark:via-[#050B14]/80 dark:to-[#050B14] transition-colors duration-300"></div>
            </div>

            {/* --- Header Navigation --- */}
            <header className="fixed w-full top-0 z-50 bg-slate-50/60 dark:bg-[#050B14]/60 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 transition-all duration-300">
                <nav className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <a href="/" className="text-2xl font-black tracking-tight flex items-center gap-2 group">
                        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                        <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">SkillSpark</span>
                    </a>
                    
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-gray-300">
                        <a href="#about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About</a>
                        <a href="#benefits" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Benefits</a>
                        <a href="#how-it-works" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">How it Works</a>
                        <a href="#gallery" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Gallery</a>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Link to="/login" className="hidden sm:block px-5 py-2.5 text-sm font-semibold rounded-full border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                            Log in
                        </Link>
                        <Link to="/signup" className="px-5 py-2.5 text-sm font-bold rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-cyan-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            Get Started
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-grow relative z-10">
                {/* --- Hero Section --- */}
                <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-4 text-center relative">
                    <div className="max-w-5xl mx-auto">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]"
                        >
                            Where Talent Meets Opportunity, <br className="hidden md:block"/>
                            <span className="inline-block min-w-[300px] text-left ml-4">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={textIndex}
                                        initial={{ opacity: 0, y: 20, rotateX: 90 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        exit={{ opacity: 0, y: -20, rotateX: -90 }}
                                        transition={{ duration: 0.4 }}
                                        className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent absolute"
                                    >
                                        {dynamicTexts[textIndex]}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="invisible">Effortlessly.</span> {/* Spacer */}
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                        >
                            Stop blindly submitting resumes. SkillSpark uses advanced Machine Learning to parse your skills, match you with exact job requirements, and instantly connect top talent with modern recruiters.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row justify-center items-center gap-4"
                        >
                             <Link to="/signup" className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-900 dark:border-transparent hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,0,0,0.08)] dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
                                Start Hiring / Applying
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-full border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center justify-center">
                                See How it Works
                            </a>
                        </motion.div>
                    </div>

                    {/* Dashboard Preview Graphic */}
                    <FadeInUp delay={0.6} className="mt-20 max-w-6xl mx-auto relative perspective-1000">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-[#050B14] z-10 bottom-0 h-1/2 mt-auto"></div>
                        <img 
                            src={appic} 
                            alt="SkillSpark Dashboard" 
                            className="rounded-xl border border-slate-200 dark:border-white/10 shadow-[0_0_100px_rgba(6,182,212,0.1)] dark:shadow-[0_0_100px_rgba(6,182,212,0.2)] transform rotateX-12 scale-105"
                            style={{ transform: "perspective(1000px) rotateX(5deg)" }}
                        />
                    </FadeInUp>
                </section>

                {/* --- Stats Banner --- */}
                <section className="py-12 border-y border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200 dark:divide-white/5">
                            <div className="text-center px-4">
                                <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-2">98<span className="text-cyan-500">%</span></h4>
                                <p className="text-sm font-medium text-slate-500 dark:text-gray-550 uppercase tracking-wider">Parsing Accuracy</p>
                            </div>
                            <div className="text-center px-4">
                                <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-2">10k<span className="text-emerald-500">+</span></h4>
                                <p className="text-sm font-medium text-slate-500 dark:text-gray-550 uppercase tracking-wider">Jobs Matched</p>
                            </div>
                            <div className="text-center px-4">
                                <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-2">500k<span className="text-orange-500">+</span></h4>
                                <p className="text-sm font-medium text-slate-500 dark:text-gray-550 uppercase tracking-wider">Skill Gaps Found</p>
                            </div>
                            <div className="text-center px-4">
                                <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-2">24<span className="text-blue-500">/7</span></h4>
                                <p className="text-sm font-medium text-slate-500 dark:text-gray-550 uppercase tracking-wider">ML Processing</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- About Section --- */}
                <section id="about" className="py-32 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <FadeInUp className="text-center mb-20 max-w-3xl mx-auto">
                            <h2 className="text-cyan-600 dark:text-cyan-400 font-bold tracking-wide uppercase text-sm mb-3">What is SkillSpark?</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">The new standard for recruitment.</h3>
                            <p className="text-lg text-slate-600 dark:text-gray-400">We replace outdated keyword scanners with contextual Machine Learning. SkillSpark understands what you actually know, not just the buzzwords on your PDF.</p>
                        </FadeInUp>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "AI Resume Parsing",
                                    desc: "Upload any PDF. Our models extract dense skills, education, and experience contexts in milliseconds, structuring your data perfectly.",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                },
                                {
                                    title: "ML Fit Scoring",
                                    desc: "Every job you view is instantly ranked with a 0-100% Fit Score based on a deep semantic comparison of your capabilities vs job requirements.",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                },
                                {
                                    title: "Recruiter Analytics",
                                    desc: "See exact skill gaps across your entire applicant pool. Know exactly why a candidate is an 85% match and what they are missing.",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                }
                            ].map((feature, i) => (
                                <FadeInUp key={i} delay={i * 0.15} className="bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 p-8 rounded-3xl hover:bg-slate-200/30 dark:hover:bg-white/[0.05] transition-all duration-300 group">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-500/20 dark:border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {feature.icon}
                                        </svg>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h4>
                                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                                </FadeInUp>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Benefits Section --- */}
                <section id="benefits" className="py-32 bg-slate-100/60 dark:bg-[#08101C] relative border-y border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <FadeInUp>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Built for both sides of the table.</h2>
                                <p className="text-lg text-slate-600 dark:text-gray-400 mb-8">Whether you are trying to land your dream role or trying to hire the perfect developer, SkillSpark eliminates the noise.</p>
                                
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                                            <span className="text-xl">🎓</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">For Candidates</h4>
                                            <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">No more black holes. Get immediate feedback on how well your resume matches a job. See what skills you need to learn to bump your match score from 70% to 95%.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                                            <span className="text-xl">💼</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">For Recruiters</h4>
                                            <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">Stop reading 500 identical resumes. View a dashboard of applicants pre-ranked by our ML algorithm. Identify skill gaps before scheduling the first phone screen.</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeInUp>
                            
                            <FadeInUp delay={0.3} className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 dark:from-emerald-500/20 dark:to-cyan-500/20 blur-[100px] rounded-full"></div>
                                <div className="relative bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-lg dark:shadow-none">
                                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                                        <div>
                                            <div className="text-sm text-slate-500 dark:text-gray-400 mb-1">Applicant Match Score</div>
                                            <div className="text-3xl font-black text-slate-900 dark:text-white">94% Fit</div>
                                        </div>
                                        <div className="px-4 py-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/20 dark:border-emerald-500/30">
                                            Highly Recommended
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2"><span className="text-slate-800 dark:text-white">React.js</span><span className="text-cyan-600 dark:text-cyan-400">Match</span></div>
                                            <div className="h-2 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-full"></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2"><span className="text-slate-800 dark:text-white">Spring Boot</span><span className="text-cyan-600 dark:text-cyan-400">Match</span></div>
                                            <div className="h-2 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-full"></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2"><span className="text-slate-800 dark:text-white">Docker</span><span className="text-orange-500 dark:text-orange-400">Missing Gap</span></div>
                                            <div className="h-2 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-orange-400 w-[20%]"></div></div>
                                        </div>
                                    </div>
                                </div>
                            </FadeInUp>
                        </div>
                    </div>
                </section>

                {/* --- Deep Dive Features (Bento Box) --- */}
                <section className="py-32 bg-slate-50 dark:bg-[#050B14] transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-6">
                        <FadeInUp className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Tools that give you an advantage.</h2>
                            <p className="text-lg text-slate-600 dark:text-gray-400">We built exclusive features deep into the platform to ensure candidates never get lost in the void and recruiters always know exactly what they are missing.</p>
                        </FadeInUp>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-6xl mx-auto">
                            {/* Card 1: Skill Gap Analysis */}
                            <FadeInUp delay={0.1} className="md:col-span-2 bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-900 dark:to-[#0A1628] border border-slate-200 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-md dark:shadow-none">
                                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-20 group-hover:opacity-10 dark:group-hover:opacity-40 transition-opacity">
                                    <svg className="w-32 h-32 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                                <div className="relative z-10 h-full flex flex-col justify-end">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center mb-6">
                                        <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Skill Gap Analytics</h3>
                                    <p className="text-slate-600 dark:text-gray-400 max-w-md">Recruiters can instantly visualize the exact skills missing from their entire applicant pool, allowing them to adjust job requirements dynamically or know exactly what to train new hires on.</p>
                                </div>
                            </FadeInUp>

                            {/* Card 2: Direct Messaging */}
                            <FadeInUp delay={0.2} className="bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-900 dark:to-[#100B20] border border-slate-200 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-md dark:shadow-none">
                                <div className="relative z-10 h-full flex flex-col justify-end">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-6">
                                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Direct Messaging</h3>
                                    <p className="text-slate-600 dark:text-gray-400 text-sm">Cut out the email ping-pong. Secure, direct communication built right into the platform.</p>
                                </div>
                            </FadeInUp>

                            {/* Card 3: Application Tracking */}
                            <FadeInUp delay={0.3} className="bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-900 dark:to-[#0A1A15] border border-slate-200 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-md dark:shadow-none">
                                <div className="relative z-10 h-full flex flex-col justify-end">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-6">
                                        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Live Status Tracking</h3>
                                    <p className="text-slate-600 dark:text-gray-400 text-sm">Candidates see exactly where they stand: Pending, Interviewing, or Rejected in real-time.</p>
                                </div>
                            </FadeInUp>

                            {/* Card 4: Intelligent History */}
                            <FadeInUp delay={0.4} className="md:col-span-2 bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-900 dark:to-[#1A1010] border border-slate-200 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-md dark:shadow-none">
                                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-20 group-hover:opacity-10 dark:group-hover:opacity-40 transition-opacity">
                                    <svg className="w-32 h-32 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="relative z-10 h-full flex flex-col justify-end">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center mb-6">
                                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Intelligent History</h3>
                                    <p className="text-slate-600 dark:text-gray-400 max-w-md">Never lose track of a job posting again. The platform securely logs your recently viewed opportunities so you can seamlessly pick up right where you left off.</p>
                                </div>
                            </FadeInUp>
                        </div>
                    </div>
                </section>

                {/* --- How It Works Stepper --- */}
                <section id="how-it-works" className="py-32">
                    <div className="max-w-5xl mx-auto px-6">
                        <FadeInUp className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">How SkillSpark Works</h2>
                            <p className="text-lg text-slate-600 dark:text-gray-400">A seamless pipeline from PDF upload to job offer.</p>
                        </FadeInUp>

                        <div className="relative border-l border-slate-200 dark:border-white/10 ml-6 md:ml-0 md:border-none space-y-12 md:space-y-0">
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent -translate-y-1/2"></div>
                            
                            <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative z-10">
                                {[
                                    {
                                        step: "01",
                                        title: "Upload Resume",
                                        desc: "Drop your PDF. We extract every skill, timeline, and detail instantly.",
                                        color: "from-blue-500 to-cyan-500"
                                    },
                                    {
                                        step: "02",
                                        title: "AI Analysis",
                                        desc: "Our ML models map your profile against active job market requirements.",
                                        color: "from-cyan-500 to-emerald-500"
                                    },
                                    {
                                        step: "03",
                                        title: "Get Matched",
                                        desc: "Apply to jobs where you have a 90%+ fit score. Bypass the screening phase.",
                                        color: "from-emerald-500 to-green-500"
                                    }
                                ].map((item, i) => (
                                    <FadeInUp key={i} delay={i * 0.2} className="relative pl-8 md:pl-0 text-left md:text-center">
                                        <div className={`absolute left-[-32px] md:relative md:left-auto md:mx-auto w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center font-black text-lg text-white mb-6 shadow-lg shadow-cyan-500/20 border-4 border-slate-50 dark:border-[#050B14] transition-all`}>
                                            {item.step}
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                                        <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                                    </FadeInUp>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Gallery Section --- */}
                <section id="gallery" className="py-32 bg-slate-100/60 dark:bg-[#08101C] border-y border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-6">
                        <FadeInUp className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">See Inside the Platform</h2>
                            <p className="text-lg text-slate-600 dark:text-gray-400">Beautiful, dark-mode first dashboards for ultimate productivity.</p>
                        </FadeInUp>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {screenshots.map((screenshot, index) => (
                                <FadeInUp 
                                    key={index} 
                                    delay={index * 0.1}
                                    className="group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-3 overflow-hidden cursor-crosshair shadow-sm dark:shadow-none"
                                >
                                    <div className="overflow-hidden rounded-2xl mb-4 relative aspect-video">
                                        <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                        <img src={screenshot.imageUrl} alt={screenshot.title} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"/>
                                    </div>
                                    <div className="px-3 pb-3">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{screenshot.title}</h3>
                                        <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed">{screenshot.description}</p>
                                    </div>
                                </FadeInUp>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Massive CTA Section --- */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/10 dark:to-cyan-900/20"></div>
                    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                        <FadeInUp>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Ready to spark <br/> your career?</h2>
                            <p className="text-xl text-cyan-900/70 dark:text-cyan-100/70 mb-10 max-w-2xl mx-auto">Join thousands of students and top-tier companies using SkillSpark to make hiring intelligent, fair, and incredibly fast.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link to="/signup" className="px-10 py-5 text-lg font-bold rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-900 dark:border-transparent hover:scale-105 transition-transform shadow-[0_0_40px_rgba(0,0,0,0.08)] dark:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                    Create Free Account
                                </Link>
                                <Link to="/login" className="px-10 py-5 text-lg font-bold rounded-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                    Log in to Dashboard
                                </Link>
                            </div>
                        </FadeInUp>
                    </div>
                </section>
            </main>

             {/* --- Footer --- */}
            <footer className="bg-slate-100 dark:bg-black py-12 border-t border-slate-200 dark:border-white/10 relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white tracking-wide">SkillSpark</span>
                    </div>
                    <div className="text-slate-500 dark:text-gray-550 text-sm">
                        &copy; {new Date().getFullYear()} SkillSpark Inc. All rights reserved. Built for the future of hiring.
                    </div>
                    <div className="flex gap-4 text-sm text-slate-600 dark:text-gray-400">
                        <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
                        <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
