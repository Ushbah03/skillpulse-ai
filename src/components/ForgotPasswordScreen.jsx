import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, KeyRound, CheckCircle, AlertCircle, ArrowRight, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPasswordScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL parameters for reset token flow
  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  // State
  const [email, setEmail] = useState(emailFromUrl);
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Dev/Demo support info returned from backend
  const [generatedResetUrl, setGeneratedResetUrl] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');

  // Mode: 'request' (enter email) or 'reset' (enter token + new password)
  const [mode, setMode] = useState(tokenFromUrl ? 'reset' : 'request');

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setMode('reset');
    }
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [tokenFromUrl, emailFromUrl]);

  // Request Reset Link (Step 1)
  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your work email address');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await authAPI.forgotPassword(email);
      setIsLoading(false);
      setIsSubmitted(true);
      if (res.resetUrl) {
        setGeneratedResetUrl(res.resetUrl);
      }
      if (res.resetToken) {
        setGeneratedToken(res.resetToken);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to dispatch reset email. Please try again.');
    }
  };

  // Reset Password Submit (Step 2)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Password reset token is required');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await authAPI.resetPassword({
        token: token.trim(),
        email: email.trim(),
        newPassword
      });
      setIsLoading(false);
      setSuccessMessage(res.message || 'Password successfully updated!');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to reset password. Token may be invalid or expired.');
    }
  };

  const bgStyle = {
    background: `linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)`,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 relative overflow-hidden" style={bgStyle}>
      {/* Background overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-noise.png")' }}></div>

      {/* Main card */}
      <div className="bg-[#111827]/80 border border-white/10 rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-12 backdrop-blur-3xl shadow-2xl w-full max-w-lg mx-auto relative z-10 text-left">
        
        {/* SUCCESS MESSAGE STATE */}
        {successMessage ? (
          <div className="space-y-6 text-center py-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Password Reset Complete!</h2>
              <p className="text-slate-400 text-sm max-w-sm">{successMessage}</p>
              <p className="text-xs text-indigo-400 mt-4 animate-pulse">Redirecting to login page...</p>
            </div>
            <div className="pt-2 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors">
                <ArrowLeft size={16} /> Go to Login Now
              </Link>
            </div>
          </div>
        ) : mode === 'reset' ? (
          /* RESET PASSWORD FORM (STEP 2) */
          <div className="space-y-6">
            <div className="text-left flex flex-col items-start">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40 mb-6">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Set New Password</h2>
              <p className="text-slate-400 text-sm">Enter your security token and choose a new password for your account.</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-slate-400 text-xs font-semibold ml-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#1E2536]/50 border border-white/5 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-slate-400 text-xs font-semibold ml-1">Reset Token</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  placeholder="Paste your reset token"
                  className="w-full bg-[#1E2536]/50 border border-white/5 rounded-2xl py-3.5 px-4 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-slate-400 text-xs font-semibold ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#1E2536]/50 border border-white/5 rounded-2xl py-3.5 px-4 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-slate-400 text-xs font-semibold ml-1">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="w-full bg-[#1E2536]/50 border border-white/5 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-full font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Update Password <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => setMode('request')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Need a new reset token?
              </button>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        ) : !isSubmitted ? (
          /* REQUEST RESET FORM (STEP 1) */
          <div className="space-y-6">
            <div className="text-left flex flex-col items-start">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40 mb-6">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Forgot Password?</h2>
              <p className="text-slate-400 text-sm">No worries, it happens. Enter your work email below and we'll dispatch a secure recovery token.</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-slate-400 text-xs font-semibold ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Mail className="w-4 h-4" /></span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your work email address"
                    className="w-full bg-[#1E2536]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-full font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Send Reset Instructions <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Already have a token?
              </button>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        ) : (
          /* DISPATCH SUCCESS STATE */
          <div className="space-y-6 text-center py-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shadow-lg mb-6">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Check Your Email</h2>
              <p className="text-slate-400 text-sm max-w-sm">We've dispatched password recovery instructions to:</p>
              <p className="text-xs font-semibold text-indigo-400 mt-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl inline-block font-mono">
                {email}
              </p>
              <p className="text-xs text-slate-400 mt-4 max-w-xs leading-relaxed">
                Please check your inbox or spam folder. Click the secure link inside the email to reset your password.
              </p>
            </div>

            <hr className="border-white/5" />

            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Have a reset token code?
              </p>
              <button
                onClick={() => setMode('reset')}
                className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4"
              >
                Enter Reset Token Manually
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Try another email
              </button>
              <Link to="/login" className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;