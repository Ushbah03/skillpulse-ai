import React, { useState } from 'react';
import { Mail, ArrowLeft, KeyRound, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordScreen = () => {
  // --- WORKFLOW STATE MANAGEMENT ---
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- SUBMISSION HANDLER ---
  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your work email address');
      return;
    }
    
    setError('');
    setIsLoading(true);

    // Simulated API payload dispatch delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1400);
  };

  // ── VISUAL BACKGROUND PATTERN ──
  // Replicating the dual-tone diagonal split and dark theme from image_c0a928.jpg
  const bgStyle = {
    background: `linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)`,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 relative overflow-hidden" style={bgStyle}>
      
      {/* Dynamic Background Noise Overlays (image_c0a928.jpg) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-noise.png")' }}></div>

      {/* ── CENTRAL AUTHENTICATION CARD (image_c0a928.jpg) ── */}
      <div className="bg-[#111827]/80 border border-white/10 rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-12 backdrop-blur-3xl shadow-2xl w-full max-w-lg mx-auto relative z-10 text-left">
        
        {/* STATE A: ACTIVE REQUEST RESET FORM */}
        {!isSubmitted ? (
          <div className="space-y-6">
            
            {/* Branding & Sub-Header (image_c0a928.jpg) */}
            <div className="text-left flex flex-col items-start">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40 mb-6">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Forgot Password?</h2>
              <p className="text-slate-500 text-sm">No worries, it happens. Enter your work email below and we'll dispatch a secure recovery link.</p>
            </div>

            {/* Error messaging layer (image_c0a928.jpg) */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Core input and button form (image_c0a928.jpg) */}
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-slate-400 text-xs font-semibold ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Mail className="w-4 h-4" /></span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address" 
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

            <div className="pt-2 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-colors">
                <ArrowLeft size={14} /> Return to Login screen
              </Link>
            </div>

          </div>
        ) : (
          
          /* STATE B: DISPATCH SUCCESS & INSTRUCTIONS PANEL (image_c0a928.jpg) */
          <div className="space-y-6 text-center py-4">
            
            {/* Checked Visual Block (image_c0a928.jpg) */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shadow-lg mb-6">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Check Your Email</h2>
              <p className="text-slate-500 text-sm max-w-sm">We've fired secure recovery tokens dispatch vectors to:</p>
              <p className="text-xs font-semibold text-indigo-400 mt-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl inline-block font-mono">
                {email}
              </p>
            </div>

            <hr className="border-white/5" />

            {/* Resend Pathways Controls (image_c0a928.jpg) */}
            <div className="space-y-3">
              <p className="text-sm text-slate-500">
                Didn't catch the email?
              </p>
              <button 
                onClick={handleResetSubmit}
                className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Resend Email Link
              </button>
            </div>

            <div className="pt-2 text-center">
              <button 
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-colors"
              >
                <ArrowLeft size={14} /> Try another email address
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default ForgotPasswordScreen;