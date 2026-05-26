import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 hover:scale-105 active:scale-95 ${
        theme === 'dark'
          ? 'bg-slate-800/80 border border-white/10 text-cyan-400 hover:bg-slate-700'
          : 'bg-white border border-slate-200 text-amber-500 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
