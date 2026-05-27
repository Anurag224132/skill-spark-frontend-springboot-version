import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-white font-sans selection:bg-cyan-500/30 transition-colors duration-300">
            {/* Header / Nav */}
            <header className="sticky top-0 z-50 bg-slate-50/80 dark:bg-[#050B14]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-all duration-300">
                <nav className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 group">
                        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                        <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">SkillSpark</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <Link to="/" className="text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            &larr; Back to Home
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-grow max-w-4xl mx-auto px-6 py-20 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
                    <p className="text-slate-600 dark:text-gray-400 mb-12 border-b border-slate-200 dark:border-white/10 pb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <div className="space-y-10 text-slate-750 dark:text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold">1</span>
                                Information We Collect
                            </h2>
                            <p className="mb-4">At SkillSpark, we collect information to provide better services to our users. This includes:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-gray-400">
                                <li><strong>Personal Data:</strong> Name, email address, and contact details provided during registration.</li>
                                <li><strong>Professional Data:</strong> Resumes, portfolios, job history, and skills uploaded for parsing.</li>
                                <li><strong>Usage Data:</strong> Interaction metrics, job views, and application history.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-bold">2</span>
                                How We Use AI & Machine Learning
                            </h2>
                            <p className="mb-4">
                                SkillSpark uses advanced Machine Learning algorithms to parse resumes and generate Fit Scores. 
                                By uploading your resume, you consent to our automated systems analyzing your professional data. 
                                We do not sell your resume data to third parties; it is strictly used to match you with recruiters on the platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
                                Data Sharing & Disclosure
                            </h2>
                            <p className="mb-4">We only share your professional data (Resumes and Fit Scores) with registered recruiters on the SkillSpark platform when you explicitly apply for a job or opt-in to be discoverable in the talent pool.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold">4</span>
                                Data Security
                            </h2>
                            <p className="mb-4">
                                We implement industry-standard security measures, including encryption at rest and in transit, to protect your personal information from unauthorized access, alteration, or disclosure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-650 dark:text-orange-400 text-sm font-bold">5</span>
                                Contact Us
                            </h2>
                            <p>
                                If you have questions about this Privacy Policy, please contact our Data Protection Officer via our <Link to="/contact" className="text-cyan-600 dark:text-cyan-400 hover:underline">Contact Page</Link>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>

            <footer className="bg-slate-100 dark:bg-black py-8 border-t border-slate-200 dark:border-white/10 text-center text-slate-500 dark:text-gray-550 text-sm mt-20">
                &copy; {new Date().getFullYear()} SkillSpark Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
