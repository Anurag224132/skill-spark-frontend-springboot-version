import { useState, useRef } from 'react';
import api from '../../utils/api';

const UploadResume = ({ onParsed }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const resetInput = () => {
    // Reset the native file input so the same file can be picked again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setError('');
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await api.post('/api/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 seconds (allows for backend parsing + Cloudinary upload + Render cold start)
      });

      onParsed(res.data);
      setSuccess(true);
      resetInput();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to parse resume. Please try again.');
      console.error('Upload error', err);
      resetInput(); // also reset on error so user can retry
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Main Card */}
      <div className="w-full space-y-5 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(52,211,153,0.2)] relative overflow-hidden group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <div className="absolute inset-0 bg-emerald-400/10 animate-[pulse_2s_ease-in-out_infinite]"></div>
            <svg className="h-8 w-8 text-emerald-550 dark:text-emerald-400 relative z-10 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Supported formats: PDF, DOC, DOCX</p>
        </div>

        {/* File Input container */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-1 transition-colors duration-300">
            <input
              id="resume-upload-input"
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-800 dark:text-gray-300 cursor-pointer focus:outline-none file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-600 dark:file:text-emerald-400 hover:file:bg-emerald-500/20 file:cursor-pointer transition-all"
            />
          </div>
        </div>

        {/* File Selected Indicator */}
        {file && !error && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm flex items-center space-x-3">
            <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate font-semibold">{file.name}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center space-x-3">
            <svg className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate font-semibold">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm flex items-center space-x-3 animate-fade-in shadow-lg shadow-emerald-500/10">
            <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate font-semibold">Resume uploaded successfully! See your skills above.</span>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isLoading || !file}
          className="group w-full flex justify-center items-center px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-emerald-500/25"
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? 'Uploading & Analyzing...' : 'Upload Resume'}
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UploadResume;
