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
  CheckCircle: () => <svg className="w-4 h-4 text-[#1988A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Shield: () => <svg className="w-3.5 h-3.5 text-[#1988A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
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
      <path fill="#17233E" d="M11.5 0h-11.5v11.5h11.5v-11.5zM23 0h-11.5v11.5h11.5v-11.5zM11.5 11.5h-11.5v11.5h11.5v-11.5zM23 11.5h-11.5v11.5h11.5v-11.5z" />
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
    password: '',
    rememberMe: false
  });

  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

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
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans text-[#17233E] bg-[#E9EAF7] relative overflow-hidden selection:bg-[#1988A3] selection:text-white">
      {/* Ambient Gradient Depth - Vibrant glowing mesh lights behind frosted glass */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[550px] h-[550px] bg-[#1988A3]/25 blur-[100px] rounded-full" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#11C6DE]/20 blur-[110px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-[#1B3154]/20 blur-[110px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-[#8A9CB7]/35 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.10)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 items-center relative z-10 py-6 sm:py-10">
        
        {/* LEFT SIDE: Content & Branding */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="hidden lg:block space-y-6 text-left"
        >
          <motion.div variants={intenseUp} className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 bg-[#17233E] rounded-xl flex items-center justify-center shadow-lg shadow-[#17233E]/30 group-hover:scale-105 transition-all duration-300 border border-white/40">
              <svg className="w-5 h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#17233E]">
              SkillPulse <span className="text-[#1988A3]">-AI</span>
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 variants={intenseUp} className="text-3xl lg:text-4xl font-extrabold leading-tight text-[#17233E] tracking-tight">
              Welcome to <br />
              <span className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] bg-clip-text text-transparent">
                SkillPulse-AI
              </span>
            </motion.h1>
            <motion.p variants={intenseUp} className="text-[#5A6D89] text-sm max-w-md leading-relaxed font-normal">
              AI-Powered Skill Intelligence Platform for Modern Organizations. Measure readiness and optimize talent.
            </motion.p>
          </div>

          <motion.ul variants={staggerContainer} className="space-y-4">
            {[
              "Measure workforce readiness in real time",
              "Identify critical skill gaps with AI models",
              "Accelerate enterprise career growth"
            ].map((item, index) => (
              <motion.li 
                key={index} 
                variants={intenseUp}
                whileHover={{ x: 6 }}
                className="flex items-center gap-3 text-[#17233E] font-medium cursor-default transition-colors"
              >
                <div className="bg-[#1988A3]/15 text-[#1988A3] p-1 rounded-full shadow-sm">
                  <Icons.CheckCircle />
                </div>
                <span className="text-sm font-semibold">{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Metric Preview Card */}
          <motion.div 
            variants={intenseUp}
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl max-w-sm glass-panel transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#5A6D89] font-mono font-bold mb-1">Team Readiness</p>
                <h4 className="text-2xl font-extrabold text-[#17233E]">84% Optimal</h4>
              </div>
              <span className="bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/25 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                +12% Live
              </span>
            </div>
            <div className="flex items-end gap-2.5 h-20">
              {[40, 60, 90, 50, 100].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.3 + (i * 0.1) }}
                  className={`flex-1 rounded-t-lg transition-all duration-500 ${
                    i === 4 ? 'bg-[#1988A3] shadow-md shadow-[#1988A3]/40' : 'bg-[#17233E]/20'
                  }`} 
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Login Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="bg-white/70 backdrop-blur-3xl border border-white/90 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-[0_30px_70px_rgba(23,35,62,0.12),inset_0_1.5px_2px_rgba(255,255,255,1)] w-full max-w-lg mx-auto transition-all duration-300"
        >
          <div className="mb-6 sm:mb-8 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-1.5 text-[#17233E] tracking-tight">Sign in to your account</h2>
            <p className="text-[#5A6D89] text-xs sm:text-sm font-medium">Enter your credentials to continue</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* Workspace / Tenant Domain Input */}
            <div className="space-y-2 text-left group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[#5A6D89] text-xs font-bold uppercase tracking-wider group-focus-within:text-[#1988A3] transition-colors">
                  Workspace / Organization
                </label>
                <span className="text-[10px] text-[#8A9CB7] font-medium">(Optional for global accounts)</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9CB7] group-focus-within:text-[#1988A3] transition-colors">
                  <Icons.Building />
                </span>
                <input 
                  type="text" 
                  name="workspace"
                  value={formData.workspace}
                  onChange={handleChange}
                  placeholder="acme-corp (or leave blank)" 
                  className="w-full bg-white/60 border border-[#8A9CB7]/30 rounded-2xl py-3.5 pl-12 pr-28 text-sm text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:ring-2 focus:ring-[#1988A3]/25 focus:border-[#1988A3] transition-all shadow-inner hover:border-[#8A9CB7]/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8A9CB7] pointer-events-none">
                  .skillpulse.ai
                </span>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2 text-left group">
              <label className="text-[#5A6D89] text-xs font-bold uppercase tracking-wider ml-1 group-focus-within:text-[#1988A3] transition-colors">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9CB7] group-focus-within:text-[#1988A3] transition-colors">
                  <Icons.Mail />
                </span>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@company.com" 
                  className="w-full bg-white/60 border border-[#8A9CB7]/30 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:ring-2 focus:ring-[#1988A3]/25 focus:border-[#1988A3] transition-all shadow-inner hover:border-[#8A9CB7]/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 text-left group">
              <label className="text-[#5A6D89] text-xs font-bold uppercase tracking-wider ml-1 group-focus-within:text-[#1988A3] transition-colors">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9CB7] group-focus-within:text-[#1988A3] transition-colors">
                  <Icons.Lock />
                </span>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password" 
                  className="w-full bg-white/60 border border-[#8A9CB7]/30 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:ring-2 focus:ring-[#1988A3]/25 focus:border-[#1988A3] transition-all shadow-inner hover:border-[#8A9CB7]/50"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9CB7] hover:text-[#17233E] transition-colors"
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#5A6D89] hover:text-[#17233E] transition-colors select-none">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#8A9CB7]/40 text-[#1988A3] focus:ring-[#1988A3]" 
                />
                Remember Me
              </label>
              
              <Link to="/forgot-password" className="text-[#1988A3] hover:text-[#157289] font-bold transition-colors hover:underline">
                Forgot Password?
              </Link>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <motion.button 
              whileHover={{ scale: isLoading ? 1 : 1.01, y: isLoading ? 0 : -1 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#17233E] hover:bg-[#1988A3] active:bg-[#157289] text-white py-3.5 sm:py-4 rounded-full font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-[#17233E]/20 hover:shadow-[#1988A3]/30 text-sm mt-2 ${
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
            <div className="absolute inset-0 flex items-center px-4"><div className="w-full border-t border-[#8A9CB7]/20"></div></div>
            <span className="relative bg-white/80 px-4 text-[10px] font-bold text-[#8A9CB7] uppercase tracking-widest rounded-full">Or continue with</span>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-white/80 hover:bg-white border border-[#8A9CB7]/30 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#17233E] transition-all shadow-sm disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <span className="w-4 h-4 border-2 border-[#1988A3] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icons.Google />
              )}
              Continue with Google
            </motion.button>
          </div>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-[#5A6D89] font-medium">
              Don't have an account? <Link to="/signup" className="text-[#1988A3] font-bold hover:text-[#157289] hover:underline transition-colors ml-1">Sign Up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;