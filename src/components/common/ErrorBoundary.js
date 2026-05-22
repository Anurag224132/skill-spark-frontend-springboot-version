import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log the error to console or an analytics service
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050B14] text-white p-6 relative font-sans select-none overflow-hidden">
          {/* Background decorative orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-2xl w-full bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl relative z-10 text-center space-y-8 animate-fade-in hover:border-cyan-500/30 transition-all duration-300">
            {/* Warning Icon with Glow */}
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-gradient-to-br from-red-500/20 to-amber-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.25)] animate-bounce-slow">
                <svg className="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-red-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">
                Something went wrong
              </h1>
              <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
                An unexpected rendering error occurred. Our team has been notified. Let's get you back on track.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19" />
                </svg>
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-8 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold border border-white/10 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Home
              </button>
            </div>

            {/* Collapsible Error Info for developers */}
            {this.state.error && (
              <div className="border border-white/10 rounded-2xl overflow-hidden text-left bg-black/40">
                <button
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  className="w-full px-5 py-3 text-sm font-semibold text-gray-400 hover:text-white flex justify-between items-center transition-colors focus:outline-none"
                >
                  <span>Technical details</span>
                  <svg className={`w-4 h-4 transform transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {this.state.showDetails && (
                  <div className="p-5 border-t border-white/10 font-mono text-xs text-red-300 max-h-48 overflow-y-auto selection:bg-red-500/30">
                    <p className="font-bold mb-2">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="whitespace-pre-wrap leading-relaxed text-gray-500">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-bounce-slow {
              animation: bounce 2s infinite;
            }
            @keyframes bounce {
              0%, 100% {
                transform: translateY(-5%);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
              }
              50% {
                transform: translateY(0);
                animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
