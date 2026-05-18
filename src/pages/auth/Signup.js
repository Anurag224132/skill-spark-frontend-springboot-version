import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register'); // 'register' | 'verify'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/auth/register', { name, email, password, role });
      if (response.data.nextStep === 'verify-otp') {
        setStep('verify');
      } else {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/verify-otp', { email, otp, name, password, role });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Registration successful! You are now logged in.');
        navigate(`/${role.toLowerCase()}/dashboard`);
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        'Verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };


  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/resend-otp', { email });
      alert('OTP resent to your email.');
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        'Could not resend OTP.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050B14] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative font-sans text-white selection:bg-cyan-500/30">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 animate-slide-fade">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            {step === 'register' ? 'Join SkillSpark Today' : 'Verify Your Email'}
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
            {step === 'register' 
              ? 'Create an account to unlock personalized career opportunities, smart tracking, and intelligent skill analytics.' 
              : `We've sent a 6-digit verification code to ${email}`}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {step === 'register' ? (
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="Enter your full name" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email Address</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="Enter your email address" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-300 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-400">I am a...</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none cursor-pointer">
                  <option value="student" className="bg-[#050B14]">🎓 Student</option>
                  <option value="recruiter" className="bg-[#050B14]">💼 Recruiter</option>
                  <option value="admin" className="bg-[#050B14]">⚡ Admin</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                    Sending OTP...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-bold text-white hover:text-cyan-400 transition-colors"
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerify}>
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-400">Verification Code</label>
                <input id="otp" type="text" required value={otp} maxLength={6} inputMode="numeric"
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all tracking-[0.5em] text-center font-mono text-xl" placeholder="••••••" />
                <p className="text-sm text-gray-500 mt-2 text-center">Check your email for the verification code</p>
                <div className="text-center">
                  <button type="button" onClick={handleResendOtp} disabled={loading}
                    className="text-sm font-medium text-cyan-400 hover:text-cyan-300 mt-2 transition-colors disabled:opacity-50">
                    Resend OTP
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify & Complete Registration'
                )}
              </button>
              
              <div className="text-center mt-6">
                <button type="button" onClick={() => setStep('register')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  ← Go back to registration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-fade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-fade {
          animation: slide-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Signup;