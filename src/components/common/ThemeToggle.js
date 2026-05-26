import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-18 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
        theme === 'dark' ? 'bg-slate-800 border border-white/10' : 'bg-slate-200 border border-slate-300'
      } ${className}`}
      aria-label="Toggle Theme"
    >
      <span className="sr-only">Toggle dark mode</span>
      {/* Sliding Toggle Circle */}
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br transition-all duration-300 shadow-md ${
          theme === 'dark'
            ? 'translate-x-10 from-indigo-500 to-purple-600'
            : 'translate-x-1 from-amber-400 to-orange-500'
        }`}
      >
        {theme === 'dark' ? (
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464-5.228a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zm1.878 7.518a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM11 16a1 1 0 11-2 0v-1a1 1 0 11-2 0v1zm-5.657-1.343a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zm-1.414-7.518a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707z" clipRule="evenodd" />
          </svg>
        )}
      </span>
      {/* Background Icons */}
      <span className="absolute left-2.5 pointer-events-none text-amber-500 opacity-80 dark:opacity-0 transition-opacity duration-300">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464-5.228a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zm1.878 7.518a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM11 16a1 1 0 11-2 0v-1a1 1 0 11-2 0v1zm-5.657-1.343a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zm-1.414-7.518a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="absolute right-2.5 pointer-events-none text-indigo-400 opacity-0 dark:opacity-80 transition-opacity duration-300">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;
