import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null); // 'success' or 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus('error');
        }
        setTimeout(() => setStatus(null), 5000);
    };

    return (
        <div className="min-h-screen bg-[#050B14] text-white font-sans selection:bg-cyan-500/30 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
            
            {/* Header / Nav */}
            <header className="sticky top-0 z-50 bg-[#050B14]/80 backdrop-blur-xl border-b border-white/5">
                <nav className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 group">
                        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">SkillSpark</span>
                    </Link>
                    <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        &larr; Back to Home
                    </Link>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10 grid md:grid-cols-2 gap-16 items-start">
                {/* Left Side - Info */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">Let's build the future of hiring, <span className="text-cyan-400">together.</span></h1>
                    <p className="text-gray-400 text-lg mb-12">Whether you have a question about our Machine Learning models, pricing, or need technical support, our team is ready to answer all your questions.</p>
                    
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Email Us</h3>
                                <p className="text-gray-400">support@skillspark.ai</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Headquarters</h3>
                                <p className="text-gray-400">123 Tech Innovation Blvd<br/>San Francisco, CA 94105</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative"
                >
                    {status === 'success' && (
                        <div className="absolute inset-0 z-20 bg-[#050B14]/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-gray-400 text-center max-w-xs">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                            <input required type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="How can we help?" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                            <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none" placeholder="Tell us more about your inquiry..."></textarea>
                        </div>
                        <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </motion.div>
            </main>

            <footer className="bg-black py-8 border-t border-white/10 text-center text-gray-500 text-sm mt-20 relative z-10">
                &copy; {new Date().getFullYear()} SkillSpark Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default ContactUs;
