import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';

const TermsOfService = () => {
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
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Terms of Service</h1>
                    <p className="text-slate-600 dark:text-gray-400 mb-12 border-b border-slate-200 dark:border-white/10 pb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <div className="space-y-10 text-slate-750 dark:text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold">1</span>
                                Acceptance of Terms
                            </h2>
                            <p className="mb-4">
                                By accessing or using the SkillSpark platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-bold">2</span>
                                User Responsibilities
                            </h2>
                            <p className="mb-4">As a user (Student, Recruiter, or Admin), you agree to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-gray-400">
                                <li>Provide accurate and truthful information on your profile and resume.</li>
                                <li>Not use the platform for any illegal or unauthorized purpose.</li>
                                <li>Not attempt to exploit, hack, or manipulate the Machine Learning algorithms governing Fit Scores.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
                                Artificial Intelligence & Fit Scores
                            </h2>
                            <p className="mb-4">
                                SkillSpark provides "Fit Scores" and candidate rankings based on advisory Machine Learning. Employers retain full discretion over their hiring decisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold">4</span>
                                Intellectual Property
                            </h2>
                            <p className="mb-4">
                                All content, logos, algorithms, and code on the SkillSpark platform are the intellectual property of SkillSpark Inc. You may not copy, distribute, or reverse-engineer our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-650 dark:text-orange-400 text-sm font-bold">5</span>
                                Termination
                            </h2>
                            <p>
                                We reserve the right to suspend or terminate your account at any time for violations of these Terms of Service or for any behavior deemed harmful to the platform community.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>

            <footer className="bg-slate-100 dark:bg-black py-8 border-t border-slate-200 dark:border-white/10 text-center text-slate-500 dark:text-gray-555 text-sm mt-20">
                &copy; {new Date().getFullYear()} SkillSpark Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default TermsOfService;
