import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';

const Icons = {
  Mail: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Lock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Building: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><line x1="12" y1="2" x2="12" y2="5"/><path d="M9 12h6"/></svg>,
  CheckCircle: () => <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Shield: () => <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Google: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  Microsoft: () => (
    <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
      <path fill="#f3f3f3" d="M11.5 0h-11.5v11.5h11.5v-11.5zM23 0h-11.5v11.5h11.5v-11.5zM11.5 11.5h-11.5v11.5h11.5v-11.5zM23 11.5h-11.5v11.5h11.5v-11.5z" />
    </svg>
  )
};

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    workspace: '',
    email: '',
    password: ''
  });

  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const bgStyle = {
    background: `linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)`
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password, formData.workspace);

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        const role = response.user.role;

        if (response.user.tenant?.status === 'SUSPENDED' && role !== 'SUPER_ADMIN') {
          navigate('/workspace-suspended');
          return;
        }

        if (role === 'EMPLOYEE') {
          navigate('/dashboard');
        } else if (role === 'TEAM_LEADER') {
          navigate('/team-leader');
        } else if (role === 'HR_MANAGER') {
          navigate('/hr-dashboard');
        } else if (role === 'COMPANY_ADMIN') {
          navigate('/company-admin');
        } else if (role === 'SUPER_ADMIN') {
          navigate('/superadmin');
        } else {
          navigate('/select-role');
        }
      } else {
        if (response?.isAccountSuspended) {
          localStorage.setItem('user', JSON.stringify({
            email: response.email || formData.email,
            tenant: { name: response.tenantName },
            tenantName: response.tenantName,
            status: 'INACTIVE'
          }));
          navigate('/account-suspended');
          return;
        }
        setErrorMsg(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setErrorMsg(error.message || 'Unable to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setErrorMsg('');
      try {
        const tenantSlug = formDataRef.current.workspace || undefined;
        const res = await authAPI.googleSSO({ credential: tokenResponse.access_token, tenantSlug });
        if (res?.success && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user || res.data));
          const role = (res.user || res.data)?.role;
          if (role === 'EMPLOYEE') navigate('/dashboard');
          else if (role === 'TEAM_LEADER') navigate('/team-leader');
          else if (role === 'HR_MANAGER') navigate('/hr-dashboard');
          else if (role === 'COMPANY_ADMIN') navigate('/company-admin');
          else if (role === 'SUPER_ADMIN') navigate('/superadmin');
          else navigate('/login');
        } else {
          setErrorMsg(res?.message || 'Google Sign-In failed. Please try again.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Google authentication error. Please try again.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setErrorMsg('Google Sign-In was cancelled or failed. Please try again.');
    },
    flow: 'implicit',
  });

  const intenseUp = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-600 text-white" style={bgStyle}>
      
      <style>{`
        @keyframes liquidDriftOne { 0%, 100% { transform: translate(0px, 0px) scale(1); } 50% { transform: translate(50px, -40px) scale(1.15); } }
        @keyframes liquidDriftTwo { 0%, 100% { transform: translate(0px, 0px) scale(1); } 50% { transform: translate(-60px, 50px) scale(1.2); } }
        .animate-plasma-1 { animation: liquidDriftOne 12s ease-in-out infinite; }
        .animate-plasma-2 { animation: liquidDriftTwo 16s ease-in-out infinite; }
      `}</style>

      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none animate-plasma-1" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none animate-plasma-2" />
      
      <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />

      <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEFT SIDE: Content & Branding */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="hidden lg:block space-y-10 text-left"
        >
          <motion.div variants={intenseUp} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40 group-hover:bg-indigo-500 transform group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white to-slate-200">SkillPulse-AI</span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 variants={intenseUp} className="text-[52px] font-bold leading-tight text-white tracking-tight">
              Welcome to <br />
              <span className="text-indigo-400 bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">SkillPulse-AI</span>
            </motion.h1>
            <motion.p variants={intenseUp} className="text-slate-400 text-lg max-w-md leading-relaxed opacity-90">
              AI-Powered Skill Intelligence Platform for Modern Organizations.
            </motion.p>
          </div>

          <motion.ul variants={staggerContainer} className="space-y-4">
            {[
              "Measure workforce readiness",
              "Identify skill gaps with AI",
              "Accelerate career growth"
            ].map((item, index) => (
              <motion.li 
                key={index} 
                variants={intenseUp}
                whileHover={{ x: 6 }}
                className="flex items-center gap-3 text-slate-300 font-medium cursor-default transition-colors hover:text-white"
              >
                <div className="bg-indigo-500/20 p-1 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <Icons.CheckCircle />
                </div>
                {item}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div 
            variants={intenseUp}
            whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.2)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 max-w-sm backdrop-blur-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Team Readiness</p>
                <h4 className="text-xl font-bold text-white">84% Optimal</h4>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse">+12%</span>
            </div>
            <div className="flex items-end gap-2 h-20">
              {[40, 60, 90, 50, 100].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.3 + (i * 0.1) }}
                  className={`flex-1 rounded-t-lg transition-all duration-500 hover:opacity-80 ${i === 4 ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'bg-indigo-500/40'}`} 
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Login Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 70, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="bg-[#111827]/60 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] w-full max-w-lg mx-auto hover:border-white/15 transition-all duration-500"
        >
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Sign in to your account</h2>
            <p className="text-slate-500 text-sm font-medium">Enter your credentials to continue</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* Added: Workspace / Tenant Domain Input */}
            <div className="space-y-2 text-left group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-slate-400 text-xs font-semibold group-focus-within:text-indigo-400 transition-colors duration-300">
                  Workspace / Organization
                </label>
                <span className="text-[10px] text-slate-500 font-medium">(Optional for global accounts)</span>
              </div>
              <div className="relative transform transition-transform duration-300 group-focus-within:translate-x-0.5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                  <Icons.Building />
                </span>
                <input 
                  type="text" 
                  name="workspace"
                  value={formData.workspace}
                  onChange={handleChange}
                  placeholder="acme-corp (or leave blank)" 
                  className="w-full bg-[#1E2536]/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-28 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all shadow-inner placeholder:text-slate-600 hover:border-white/10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 pointer-events-none">
                  .skillpulse.ai
                </span>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2 text-left group">
              <label className="text-slate-400 text-xs font-semibold ml-1 group-focus-within:text-indigo-400 transition-colors duration-300">Email Address</label>
              <div className="relative transform transition-transform duration-300 group-focus-within:translate-x-0.5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300"><Icons.Mail /></span>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address" 
                  className="w-full bg-[#1E2536]/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all shadow-inner placeholder:text-slate-600 hover:border-white/10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 text-left group">
              <label className="text-slate-400 text-xs font-semibold ml-1 group-focus-within:text-indigo-400 transition-colors duration-300">Password</label>
              <div className="relative transform transition-transform duration-300 group-focus-within:translate-x-0.5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300"><Icons.Lock /></span>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password" 
                  className="w-full bg-[#1E2536]/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all shadow-inner placeholder:text-slate-600 hover:border-white/10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 transition-colors select-none">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/10 bg-transparent accent-indigo-600 transition-transform duration-200 active:scale-90" 
                />
                Remember Me
              </label>
              
              <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300 transition-colors hover:underline">
                Forgot Password?
              </Link>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <motion.button 
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -1, boxShadow: "0 15px 30px rgba(99,102,241,0.35)" }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
              type="submit"
              disabled={isLoading}
              className={`w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-base mt-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-6 text-center select-none">
            <div className="absolute inset-0 flex items-center px-4"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative bg-[#151b2b] px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or continue with</span>
          </div>

          <div className="mt-6 flex flex-col gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 bg-white/[0.03] border border-white/10 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icons.Google />
                )}
                Continue with Google
              </motion.button>
            </div>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account? <Link to="/signup" className="text-white font-bold hover:text-indigo-400 hover:underline transition-colors ml-1">Sign Up</Link>
            </p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium bg-emerald-500/5 py-2 rounded-lg inline-flex mx-auto px-4 border border-emerald-500/10 cursor-default shadow-sm"
            >
              <Icons.Shield /> Protected with enterprise-grade security
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;