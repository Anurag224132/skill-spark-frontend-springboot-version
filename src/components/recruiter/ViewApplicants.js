import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../common/Pagination';

const ViewApplicants = () => {
    const { currentUser } = useAuth();
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentApplication, setCurrentApplication] = useState(null);
    const [modalType, setModalType] = useState(''); // 'accept' or 'reject'
    const [interviewDate, setInterviewDate] = useState('');
    const [notes, setNotes] = useState('');
    const [emailStatus, setEmailStatus] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // Resume viewer state
    const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
    const [resumeUrl, setResumeUrl] = useState(null);
    const [resumeFilename, setResumeFilename] = useState('Resume.pdf');
    const [resumeLoading, setResumeLoading] = useState(false);

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/applications/recruiter/${currentUser.id || currentUser._id}?page=${page}&size=10`);
            const apps = res.data.content || res.data || [];
            setTotalPages(res.data.totalPages || 0);
            setApplications(apps);
            setFilteredApplications(apps);
        } catch (err) {
            console.error('❌ Failed to fetch applicants:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter applications based on selected status
    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredApplications(applications);
        } else {
            const filtered = applications.filter(app => app.status === statusFilter);
            setFilteredApplications(filtered);
        }
    }, [statusFilter, applications]);

    const handleViewResume = async (applicationId, applicantName) => {
        setResumeLoading(true);
        try {
            const infoRes = await api.get(`/api/applications/${applicationId}/resume-url`);
            const { url, isCloud, filename } = infoRes.data;
            const safeFilename = filename || `${(applicantName || 'Applicant').replace(/\s+/g, '_')}_Resume.pdf`;

            let blobUrl;
            if (isCloud === 'true') {
                // Cloudinary supports CORS * — fetch directly
                const resp = await fetch(url);
                if (!resp.ok) throw new Error('Failed to fetch from Cloudinary: ' + resp.status);
                const blob = await resp.blob();
                blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            } else {
                // Local file — serve through backend
                const resp = await api.get(`/api/applications/${applicationId}/download-resume`, { responseType: 'blob' });
                blobUrl = URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }));
            }

            setResumeUrl(blobUrl);
            setResumeFilename(safeFilename);
            setResumeViewerOpen(true);
        } catch (err) {
            console.error('❌ View resume failed:', err);
            const msg = err?.response?.data?.message || err.message || 'Could not open resume.';
            alert('Resume error: ' + msg);
        } finally {
            setResumeLoading(false);
        }
    };

    const handleForceDownload = () => {
        if (!resumeUrl) return;
        const a = document.createElement('a');
        a.href = resumeUrl;
        a.download = resumeFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleOpenModal = (app, type) => {
        setCurrentApplication(app);
        setModalType(type);
        setShowModal(true);
        setEmailStatus('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentApplication(null);
        setModalType('');
        setInterviewDate('');
        setNotes('');
        setEmailStatus('');
    };

    const handleStatusChange = async (appId, newStatus, notes = '') => {
        try {
            await api.put(`/api/applications/${appId}/status`,
                { status: newStatus, notes }
            );

            // Update local state
            setApplications(prev => prev.map(app =>
                (app.id || app._id) === appId ? { ...app, status: newStatus, notes } : app
            ));
        } catch (err) {
            console.error('❌ Failed to update status:', err.response?.data || err.message);
        }
    };

    const handleSendEmail = async () => {
        if (!interviewDate) {
            setEmailStatus('Please select an interview date');
            return;
        }

        setEmailStatus('Sending email...');

        try {
            // Schedule interview and send email
            const response = await api.put(`/api/applications/${currentApplication.id || currentApplication._id}/schedule-interview`,
                { interviewDate }
            );

            // Update local state with interview details
            setApplications(prev => prev.map(app =>
                (app.id || app._id) === (currentApplication.id || currentApplication._id) ? {
                    ...app,
                    status: 'interview_scheduled',
                    interviewDate: response.data.application?.interviewDate || response.data.interviewDate,
                    interviewLink: response.data.application?.interviewLink || response.data.interviewLink
                } : app
            ));

            setEmailStatus('Email sent successfully!');

            // Close modal after 2 seconds
            setTimeout(() => {
                handleCloseModal();
            }, 2000);
        } catch (err) {
            console.error('❌ Failed to send email:', err);

            // Enhanced error message
            let errorMsg = 'Failed to send email';
            if (err.response) {
                errorMsg += `: ${err.response.data.error || err.response.data.msg || 'Server error'}`;
            } else if (err.request) {
                errorMsg += ': No response from server';
            } else {
                errorMsg += `: ${err.message}`;
            }

            setEmailStatus(errorMsg);
        }
    };

    useEffect(() => {
        if (currentUser?.role === 'recruiter') {
            fetchApplicants();
        }
    }, [currentUser, page]);

    // Get counts for each status
    const getStatusCount = (status) => {
        return applications.filter(app => app.status === status).length;
    };

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#050B14] dark:to-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-white/5 relative overflow-hidden transition-colors duration-300 text-slate-800 dark:text-white">
            {/* Modal for Accept/Reject */}
            {showModal && currentApplication && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-hidden text-slate-800 dark:text-white">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                                {modalType === 'accept' ? (
                                    <>
                                        <span className="text-emerald-500">📅</span>
                                        Schedule Interview
                                    </>
                                ) : (
                                    <>
                                        <span className="text-rose-500">❌</span>
                                        Reject Application
                                    </>
                                )}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 dark:text-gray-300 mb-1.5">
                                    Notes for Applicant
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400 dark:placeholder-gray-500 transition-all resize-none"
                                    placeholder="Add personal notes for the applicant..."
                                    rows={3}
                                />
                            </div>

                            {modalType === 'accept' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 dark:text-gray-300 mb-1.5">
                                            Interview Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={interviewDate}
                                            onChange={(e) => setInterviewDate(e.target.value)}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:scheme-dark"
                                        />
                                    </div>

                                    {emailStatus && (
                                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                                            emailStatus.includes('successfully')
                                                ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                                                : emailStatus.includes('Sending')
                                                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-605 dark:text-blue-400'
                                                    : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                                        }`}>
                                            <div className="flex-1 text-sm font-medium">{emailStatus}</div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                            <button
                                onClick={handleCloseModal}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (modalType === 'accept') {
                                        handleSendEmail();
                                    } else {
                                        handleStatusChange(currentApplication.id || currentApplication._id, 'rejected', notes);
                                        handleCloseModal();
                                    }
                                }}
                                className={`px-5 py-2.5 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                                    modalType === 'accept'
                                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-emerald-500/25'
                                        : 'bg-gradient-to-r from-red-50 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-red-500/25 text-white bg-red-600'
                                }`}
                            >
                                {modalType === 'accept' ? 'Send Email & Schedule' : 'Reject Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/25">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            View Applicants
                        </h2>
                        <p className="text-slate-500 dark:text-gray-400 mt-1">Review and manage job applications</p>
                    </div>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${statusFilter === 'all'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10'
                            }`}
                    >
                        All Applications
                        <span className="ml-2 bg-white/20 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs">
                            {applications.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${statusFilter === 'pending'
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/25'
                            : 'bg-amber-100/50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20'
                            }`}
                    >
                        Pending
                        <span className="ml-2 bg-white/20 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs">
                            {getStatusCount('pending')}
                        </span>
                    </button>

                    <button
                        onClick={() => setStatusFilter('interview_scheduled')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${statusFilter === 'interview_scheduled'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                            : 'bg-green-100/50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20'
                            }`}
                    >
                        Interview Scheduled
                        <span className="ml-2 bg-white/20 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs">
                            {getStatusCount('interview_scheduled')}
                        </span>
                    </button>

                    <button
                        onClick={() => setStatusFilter('rejected')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${statusFilter === 'rejected'
                            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25'
                            : 'bg-red-100/50 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20'
                            }`}
                    >
                        Rejected
                        <span className="ml-2 bg-white/20 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs">
                            {getStatusCount('rejected')}
                        </span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin">
                                <div className="w-6 h-6 bg-white dark:bg-slate-900 rounded-full m-1"></div>
                            </div>
                            <p className="text-slate-500 dark:text-gray-400 font-semibold">Loading applicants...</p>
                        </div>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-750 dark:text-slate-200 mb-2">
                            No {statusFilter === 'all' ? '' : statusFilter.split('_').join(' ').toLowerCase() + ' '}applications
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            {statusFilter === 'all'
                                ? "Applications will appear here once candidates start applying to your job postings."
                                : "No applications match this status filter."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Applications Count */}
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-white/5 dark:to-transparent p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 backdrop-blur-sm mb-6">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-3 shadow-md shadow-emerald-500/25">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-slate-800 dark:text-white font-bold">
                                        {filteredApplications.length} {statusFilter === 'all' ? 'Application' : statusFilter.split('_').join(' ')} {filteredApplications.length === 1 ? '' : 's'}
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {statusFilter === 'all'
                                            ? 'Total applications received'
                                            : `Filtered from ${applications.length} total applications`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Applications List */}
                        {filteredApplications.map((app, index) => (
                            <div
                                key={app.id || app._id}
                                className="group bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-900/90 dark:to-slate-800/90 border border-slate-200/50 dark:border-white/5 p-6 rounded-2xl hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-black/30 transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm relative overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    {/* Applicant Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-md shadow-blue-500/25">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-cyan-300 transition-colors duration-200">
                                                    {app.studentName || 'Applicant'}
                                                </h3>
                                                <p className="text-slate-500 dark:text-gray-400 text-sm">{app.studentEmail || 'No email'}</p>
                                            </div>
                                        </div>
                                        {/* Status Badge */}
                                        <div className={`px-4 py-2 rounded-full text-xs font-bold ${
                                            app.status === 'approved' || app.status === 'hired' || app.status === 'interview_scheduled'
                                            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-transparent' :
                                            app.status === 'rejected'
                                                ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-transparent' :
                                                app.status === 'pending'
                                                    ? 'bg-amber-55 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-transparent'
                                                    : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-transparent'
                                            }`}>
                                            {app.status === 'approved' || app.status === 'interview_scheduled'
                                                ? 'Approved'
                                                : app.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </div>
                                    </div>

                                    {/* Application Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-slate-50/50 dark:bg-slate-805/50 p-4 rounded-xl border border-slate-200/30 dark:border-white/5">
                                            <div className="flex items-center mb-2">
                                                <svg className="w-4 h-4 text-slate-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5" />
                                                </svg>
                                                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Applied to</span>
                                            </div>
                                            <p className="text-slate-800 dark:text-white font-bold">{app.job?.title || 'Job'}</p>
                                        </div>

                                        <div className="bg-slate-50/50 dark:bg-slate-805/50 p-4 rounded-xl border border-slate-200/30 dark:border-white/5">
                                            <div className="flex items-center mb-2">
                                                <svg className="w-4 h-4 text-slate-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Fit Score</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-2xl font-bold text-slate-800 dark:text-white mr-2">{app.fitScore}%</span>
                                                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-1000 ${app.fitScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                                            app.fitScore >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                                                                'bg-gradient-to-r from-red-500 to-rose-500'
                                                            }`}
                                                        style={{ width: `${app.fitScore}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {app.status === 'pending' && (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => handleOpenModal(app, 'accept')}
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(app, 'reject')}
                                                className="flex-1 bg-gradient-to-r from-red-50 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-white bg-red-600"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleViewResume(app.id || app._id, app.studentName || 'Applicant')}
                                                disabled={resumeLoading}
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {resumeLoading ? (
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                )}
                                                View Resume
                                            </button>
                                        </div>
                                    )}

                                    {/* Status Message for Non-Pending */}
                                    {app.status !== 'pending' && (
                                        <div className={`p-4 rounded-xl border font-medium ${app.status === 'accepted' || app.status === 'interview_scheduled' || app.status === 'hired'
                                            ? 'bg-green-50 dark:bg-green-550/10 border-green-200/50 text-green-700 dark:text-green-400'
                                            : 'bg-red-50 dark:bg-red-550/10 border-red-200/50 text-red-700 dark:text-red-400'
                                            }`}>
                                            <div className="flex items-center">
                                                <svg className={`w-5 h-5 mr-2 ${app.status === 'rejected' ? 'text-red-500' : 'text-green-500'
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {app.status === 'rejected' ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    )}
                                                </svg>
                                                <span className="font-semibold">
                                                    Application has been {app.status.split('_').join(' ')}
                                                    {app.status === 'interview_scheduled' && app.interviewDate && (
                                                        <span className="font-bold text-slate-800 dark:text-white"> on {new Date(app.interviewDate).toLocaleString()}</span>
                                                    )}
                                                </span>
                                            </div>
                                            {app.notes && (
                                                <div className="mt-2 p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Recruiter Notes:</p>
                                                    <p className="text-sm text-slate-700 dark:text-slate-205">{app.notes}</p>
                                                </div>
                                            )}
                                            {app.interviewLink && (
                                                <div className="mt-2">
                                                    <a
                                                        href={app.interviewLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-cyan-600 dark:text-cyan-405 hover:underline text-sm font-bold flex items-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        Interview Link
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={(newPage) => setPage(newPage)} 
                        />
                    </div>
                )}
            </div>

            {/* Resume Viewer Modal */}
            {resumeViewerOpen && resumeUrl && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10 flex justify-between items-center flex-shrink-0 text-slate-850 dark:text-white">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
                                <span className="text-2xl">📄</span>
                                {resumeFilename.replace('_Resume.pdf', '').replace(/_/g, ' ')}'s Resume
                            </h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleForceDownload}
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Download
                                </button>
                                <button
                                    onClick={() => { setResumeViewerOpen(false); setResumeUrl(null); }}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-bold transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        {/* PDF iframe */}
                        <div className="flex-1 bg-white relative">
                            <iframe
                                src={resumeUrl}
                                className="w-full h-full border-none absolute inset-0"
                                title={resumeFilename}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewApplicants;