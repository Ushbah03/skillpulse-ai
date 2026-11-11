import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';
import VisitorBackdrop from './VisitorBackdrop';

// SVG Icons
const Icons = {
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Building: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="12" />
      <line x1="15" y1="22" x2="15" y2="12" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <path d="M9 12h6" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Key: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M21 2l-2 2m-1.5 1.5L14 9.5l-2.5-2.5L10 8.5 7.5 6 6 7.5 8.5 10l-6 6V21h5l6.5-6.5" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
};

// Reusable Controlled Input with Authentic Frosted Glass Styling & Animated Focus Micro-Interactions
const AuthInput = ({ label, name, type = 'text', placeholder, value, onChange, icon, required = true, suffix, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col gap-1.5 w-full text-left group"
  >
    <label className="text-[#5A6D89] text-[11px] font-bold ml-1 uppercase tracking-wider group-focus-within:text-[#1988A3] transition-colors duration-200 flex items-center justify-between">
      <span>{label}</span>
      {value && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-1.5 h-1.5 rounded-full bg-[#11C6DE]"
        />
      )}
    </label>
    <div className="relative flex items-center rounded-2xl transition-transform duration-200 group-focus-within:-translate-y-0.5">
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#1988A3]/0 via-[#11C6DE]/0 to-[#1988A3]/0 group-focus-within:from-[#1988A3]/35 group-focus-within:via-[#11C6DE]/45 group-focus-within:to-[#1988A3]/35 blur-[2px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <span className="absolute left-4 text-[#8A9CB7] group-focus-within:text-[#1988A3] group-focus-within:scale-110 transition-all duration-200 z-10 pointer-events-none">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`relative w-full bg-white/70 focus:bg-white/95 border border-[#8A9CB7]/30 text-sm text-[#17233E] pl-11 py-3.5 rounded-2xl focus:outline-none focus:border-[#1988A3] focus:ring-2 focus:ring-[#1988A3]/20 transition-all placeholder:text-[#8A9CB7] shadow-inner hover:border-[#8A9CB7]/55 ${
          suffix ? (typeof suffix === 'string' ? 'pr-[7.5rem]' : 'pr-11') : 'pr-4'
        }`}
      />
      {suffix && (
        <span className="absolute right-3.5 text-[#8A9CB7] text-[11px] font-semibold z-10 flex items-center">
          {suffix}
        </span>
      )}
      <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-[#1988A3] to-[#11C6DE] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
    </div>
  </motion.div>
);

const SignUp = () => {
  const navigate = useNavigate();

  // Mode: "create" (New SaaS Organization) or "join" (Existing Organization User)
  const [signupType, setSignupType] = useState('create');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    workspaceSubdomain: '',
    inviteCode: '',
    requestedRole: 'Company Admin',
    selectedPlan: 'Starter',
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Refs for stale closures
  const formDataRef = useRef(formData);
  const signupTypeRef = useRef(signupType);
  
  useEffect(() => {
    formDataRef.current = formData;
    signupTypeRef.current = signupType;
  }, [formData, signupType]);

  const handleGoogleSSO = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setErrorMessage('');
      try {
        const latestFormData = formDataRef.current;
        const latestSignupType = signupTypeRef.current;
        
        const roleMap = {
          'Employee': 'EMPLOYEE',
          'Company Admin': 'COMPANY_ADMIN',
          'HR Manager': 'HR_MANAGER',
          'Team Leader': 'TEAM_LEADER'
        };

        const payload = {
          credential: tokenResponse.access_token,
          isNewWorkspace: latestSignupType === 'create',
          organizationName: latestSignupType === 'create' ? latestFormData.organizationName : undefined,
          tenantSlug: latestSignupType === 'create' ? latestFormData.workspaceSubdomain : latestFormData.inviteCode,
          role: latestSignupType === 'create' ? 'COMPANY_ADMIN' : (roleMap[latestFormData.requestedRole] || 'EMPLOYEE'),
          plan: latestSignupType === 'create' ? latestFormData.selectedPlan : undefined
        };

        const res = await authAPI.googleSSO(payload);

        if (res?.success) {
          localStorage.setItem('token', res.token);
          const userData = res.user || res.data;
          localStorage.setItem('user', JSON.stringify(userData));

          if (signupType === 'create') {
            try {
              const seats = formData.selectedPlan === 'Enterprise AI' ? 1000 : formData.selectedPlan === 'Professional' ? 250 : 30;
              const checkoutRes = await import('../services/api').then(m => m.paymentAPI.createCheckoutSession(userData.tenant.id, formData.selectedPlan, seats));
              if (checkoutRes?.success && checkoutRes.url) {
                window.location.href = checkoutRes.url;
                return;
              }
            } catch (paymentErr) {
              console.error('Failed to initiate checkout:', paymentErr);
              setErrorMessage(paymentErr?.response?.data?.message || paymentErr?.message || 'Stripe Checkout failed to initialize. Please try again.');
              setGoogleLoading(false);
              return;
            }
          } else {
            const userRole = userData?.role;
            const { getRoleDefaultPath } = await import('./ProtectedRoute');
            window.location.href = getRoleDefaultPath(userRole);
          }
        } else {
          setErrorMessage(res?.message || 'Google Sign-In failed. Please try again.');
        }
      } catch (err) {
        setErrorMessage(err?.message || 'Google Sign-In failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setErrorMessage('Google Sign-In was cancelled or failed. Please try again.');
    },
    flow: 'implicit',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate subdomain slug when organization name changes
    if (name === 'organizationName' && signupType === 'create') {
      const autoSlug = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      setFormData((prev) => ({
        ...prev,
        organizationName: value,
        workspaceSubdomain: autoSlug,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errorMessage) setErrorMessage('');
  };

  const handleModeSwitch = (mode) => {
    setSignupType(mode);
    setFormData((prev) => ({
      ...prev,
      requestedRole: mode === 'create' ? 'Company Admin' : 'Employee',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (signupType === 'create' && !formData.workspaceSubdomain) {
      setErrorMessage('Workspace subdomain is required for multi-tenant isolation.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ') || 'User';
      
      const roleMap = {
        'Employee': 'EMPLOYEE',
        'Company Admin': 'COMPANY_ADMIN',
        'HR Manager': 'HR_MANAGER',
        'Team Leader': 'TEAM_LEADER'
      };

      const payload = {
        email: formData.email,
        password: formData.password,
        firstName,
        lastName,
        isNewWorkspace: signupType === 'create',
        organizationName: signupType === 'create' ? formData.organizationName : undefined,
        workspaceSubdomain: signupType === 'create' ? formData.workspaceSubdomain : undefined,
        inviteCode: signupType === 'join' ? formData.inviteCode : undefined,
        requestedRole: signupType === 'create' ? 'COMPANY_ADMIN' : (roleMap[formData.requestedRole] || 'EMPLOYEE'),
        plan: signupType === 'create' ? formData.selectedPlan : undefined,
      };

      const res = await authAPI.register(payload);

      if (res?.success) {
        setShowPopup(true);
        if (signupType === 'create') {
          try {
            const seats = formData.selectedPlan === 'Enterprise AI' ? 1000 : formData.selectedPlan === 'Professional' ? 250 : 30;
            const checkoutRes = await import('../services/api').then(m => m.paymentAPI.createCheckoutSession(res.user?.tenant?.id || res.tenant?.id, formData.selectedPlan, seats));
            if (checkoutRes?.success && checkoutRes.url) {
              window.location.href = checkoutRes.url;
              return;
            }
          } catch (paymentErr) {
            console.error('Failed to initiate checkout after signup:', paymentErr);
          }
        }

        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setErrorMessage(res?.message || 'Registration failed. Please check your data.');
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  // Live form progress & password feedback for animated UI feedback
  const trackedFields = [
    formData.fullName,
    formData.email,
    formData.password,
    formData.confirmPassword,
    formData.organizationName,
    signupType === 'create' ? formData.workspaceSubdomain : formData.inviteCode,
  ];
  const filledCount = trackedFields.filter((v) => String(v || '').trim().length > 0).length;
  const completionPct = Math.round((filledCount / trackedFields.length) * 100);

  const passwordScore = (() => {
    const pwd = formData.password || '';
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 8) score += 1;
    return score;
  })();

  const passwordsMatch =
    Boolean(formData.password) &&
    Boolean(formData.confirmPassword) &&
    formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans text-[#17233E] bg-[#E9EAF7] bg-gradient-to-b from-[#E9EAF7] via-[#E2EEFA] to-[#DCEAF8] relative overflow-hidden selection:bg-[#1988A3] selection:text-white">
      {/* Unified Light Ice-Blue Ambient Depth & Animated 3D Liquid Silk Wave */}
      <VisitorBackdrop waveIntensity={0.95} waveOpacityClass="opacity-85" />

      {/* POPUP NOTIFICATION */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 bg-[#17233E]/95 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(23,35,62,0.4)] border border-white/20 z-50 max-w-sm"
          >
            <p className="text-sm font-bold flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#11C6DE] animate-ping" />
              Registration Submitted!
            </p>
            <p className="text-xs text-[#E9EAF7] mt-1 font-medium">
              {signupType === 'create'
                ? `Workspace '${formData.workspaceSubdomain}.skillpulse.ai' is initialized. Redirecting...`
                : `Account created for role ${formData.requestedRole}. Redirecting to login...`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 items-center relative z-10 py-6 sm:py-10">
        
        {/* LEFT BRANDING + LIVE ANIMATED WORKSPACE PREVIEW */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="hidden lg:block space-y-6 text-left">
          <motion.div variants={fadeInUp}>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-[#17233E] rounded-xl flex items-center justify-center shadow-lg shadow-[#17233E]/30 transition-all duration-300 border border-white/40"
              >
                <svg className="w-5 h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </motion.div>
              <span className="text-2xl font-extrabold tracking-tight text-[#17233E]">
                SkillPulse <span className="text-[#1988A3]">-AI</span>
              </span>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-white/75 border border-[#1988A3]/25 px-3.5 py-1.5 rounded-full backdrop-blur-xl shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#11C6DE] animate-ping" />
            <span className="text-[11px] font-mono font-bold text-[#17233E] uppercase tracking-wider">
              {signupType === 'create' ? 'Tenant Provisioning Engine Ready' : 'Organization Directory Synced'}
            </span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#17233E]">
            Enterprise Skill <br />
            <span className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] bg-clip-text text-transparent">
              Intelligence SaaS
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-[#5A6D89] text-sm max-w-md leading-relaxed font-normal">
            Provision isolated multi-tenant organization workspaces, bridge skill gaps with AI models, and construct optimized career pathways.
          </motion.p>

          {/* Animated Live Workspace Preview Card */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="p-6 rounded-3xl max-w-sm glass-panel space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/70">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1988A3]">
                  Live Provision Preview
                </p>
                <p className="text-sm font-extrabold text-[#17233E] truncate max-w-[210px]">
                  {formData.organizationName || 'Your Organization'}
                </p>
              </div>
              <motion.span
                key={signupType}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-2.5 py-1 rounded-full bg-[#17233E] text-[#11C6DE] text-[10px] font-mono font-bold"
              >
                {signupType === 'create' ? formData.selectedPlan : formData.requestedRole}
              </motion.span>
            </div>

            {signupType === 'create' && (
              <div className="px-3 py-2 rounded-xl bg-white/70 border border-white text-[11px] font-mono text-[#17233E] flex items-center justify-between">
                <span className="truncate text-[#5A6D89]">
                  https://<strong className="text-[#1988A3]">{formData.workspaceSubdomain || 'workspace'}</strong>.skillpulse.ai
                </span>
                <span className="w-2 h-2 rounded-full bg-[#11C6DE] animate-pulse shrink-0 ml-2" />
              </div>
            )}

            <div className="space-y-2.5">
              {[
                { dot: 'bg-[#1988A3]', text: 'Multi-Tenant Row-Level Security' },
                { dot: 'bg-[#11C6DE]', text: 'Live AI Skill Readiness Scoring' },
                { dot: 'bg-[#5A6D89]', text: 'Seamless Stripe Enterprise Invoicing' },
              ].map((feat, idx) => (
                <motion.div
                  key={feat.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + idx * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-xs font-bold text-[#17233E] cursor-default"
                >
                  <span className={`w-2 h-2 rounded-full ${feat.dot} shadow-xs`} />
                  <span>{feat.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/75 backdrop-blur-3xl border border-white/95 rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-[0_30px_70px_rgba(23,35,62,0.12),inset_0_1.5px_2px_rgba(255,255,255,1)] w-full max-w-lg mx-auto relative overflow-hidden"
        >
          {/* Animated Live Onboarding Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#E9EAF7]/80">
            <motion.div
              className="h-full bg-gradient-to-r from-[#1988A3] via-[#11C6DE] to-[#17233E]"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
            />
          </div>

          {/* Mobile-Only Brand Header */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2.5 mb-5 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-9 h-9 bg-[#17233E] rounded-xl flex items-center justify-center shadow-md border border-white/40"
            >
              <svg className="w-5 h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight text-[#17233E]">
              SkillPulse <span className="text-[#1988A3]">-AI</span>
            </span>
          </Link>

          <div className="mb-5 text-left flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold mb-1 tracking-tight text-[#17233E]">
                Create your account
              </h2>
              <p className="text-[#5A6D89] text-xs font-medium">Join or setup your SkillPulse-AI enterprise workspace</p>
            </div>
            <motion.span
              key={completionPct}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              className="shrink-0 px-2.5 py-1 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-[10px] font-mono font-bold mt-1"
            >
              {completionPct}% Ready
            </motion.span>
          </div>

          {/* ANIMATED SPRING TOGGLE WORKSPACE MODE */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#E9EAF7]/90 rounded-2xl mb-6 border border-[#8A9CB7]/30 relative">
            {[
              { id: 'create', label: 'Create New Workspace' },
              { id: 'join', label: 'Join Existing Workspace' },
            ].map((tab) => {
              const active = signupType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleModeSwitch(tab.id)}
                  className={`relative py-2 text-xs font-bold rounded-xl transition-colors z-10 cursor-pointer ${
                    active ? 'text-white' : 'text-[#5A6D89] hover:text-[#17233E]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="signupModePill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#17233E] to-[#1B3154] rounded-xl shadow-md -z-10"
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ERROR BANNER */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8, x: -6 }}
                animate={{ opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-5 bg-red-50 border border-red-200 text-red-600 text-xs py-3 px-4 rounded-xl text-left font-medium"
              >
                ⚠️ {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <AuthInput
              label="Full Name"
              name="fullName"
              placeholder="Alex Johnson"
              value={formData.fullName}
              onChange={handleChange}
              icon={<Icons.User />}
              delay={0.05}
            />

            <AuthInput
              label="Work Email Address"
              name="email"
              type="email"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Icons.Mail />}
              delay={0.1}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <AuthInput
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={<Icons.Lock />}
                delay={0.14}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#8A9CB7] hover:text-[#17233E] transition-colors focus:outline-none cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                }
              />
              <AuthInput
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={<Icons.Lock />}
                delay={0.18}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#8A9CB7] hover:text-[#17233E] transition-colors focus:outline-none cursor-pointer"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                }
              />
            </div>

            {/* Animated Live Password Strength & Match Micro-Indicator */}
            <AnimatePresence>
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between gap-3 px-1 overflow-hidden"
                >
                  <div className="flex items-center gap-1.5 flex-1">
                    {[1, 2, 3].map((level) => (
                      <motion.span
                        key={level}
                        animate={{
                          scaleX: passwordScore >= level ? 1 : 0.85,
                          opacity: passwordScore >= level ? 1 : 0.3,
                        }}
                        className={`h-1.5 flex-1 rounded-full origin-left transition-colors ${
                          passwordScore === 1
                            ? 'bg-amber-400'
                            : passwordScore === 2
                              ? 'bg-[#1988A3]'
                              : passwordScore >= 3
                                ? 'bg-[#11C6DE]'
                                : 'bg-[#8A9CB7]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#5A6D89] shrink-0">
                    {passwordsMatch
                      ? '✓ Passwords Match'
                      : passwordScore >= 3
                        ? 'Strong Password'
                        : passwordScore === 2
                          ? 'Good Password'
                          : 'Min 6 chars'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* DYNAMIC WORKSPACE INPUTS WITH ANIMATED TRANSITION */}
            <AnimatePresence mode="wait">
              {signupType === 'create' ? (
                <motion.div
                  key="workspace-create"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <AuthInput
                    label="Organization Name"
                    name="organizationName"
                    placeholder="Acme Corp"
                    value={formData.organizationName}
                    onChange={handleChange}
                    icon={<Icons.Building />}
                  />
                  <AuthInput
                    label="Tenant Subdomain"
                    name="workspaceSubdomain"
                    placeholder="acme"
                    value={formData.workspaceSubdomain}
                    onChange={handleChange}
                    icon={<Icons.Globe />}
                    suffix=".skillpulse.ai"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="workspace-join"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="grid md:grid-cols-2 gap-4 items-end"
                >
                  <AuthInput
                    label="Organization Name"
                    name="organizationName"
                    placeholder="Acme Corp"
                    value={formData.organizationName}
                    onChange={handleChange}
                    icon={<Icons.Building />}
                  />
                  <AuthInput
                    label="Workspace Invite Code"
                    name="inviteCode"
                    placeholder="ORG-XXXX-2026"
                    value={formData.inviteCode}
                    onChange={handleChange}
                    icon={<Icons.Key />}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ROLE SELECTOR */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="flex flex-col gap-1.5 text-left group"
            >
              <label className="text-[#5A6D89] text-[11px] font-bold ml-1 uppercase tracking-wider group-focus-within:text-[#1988A3] transition-colors">
                {signupType === 'create' ? 'Primary Workspace Role' : 'Requested Role'}
              </label>
              <div className="relative">
                <select
                  name="requestedRole"
                  value={formData.requestedRole}
                  onChange={handleChange}
                  className="w-full bg-white/70 focus:bg-white/95 border border-[#8A9CB7]/30 rounded-2xl py-3.5 px-4 text-sm text-[#17233E] focus:outline-none focus:ring-2 focus:ring-[#1988A3]/25 focus:border-[#1988A3] transition-all appearance-none cursor-pointer hover:border-[#8A9CB7]/55"
                >
                  {signupType === 'create' ? (
                    <option value="Company Admin">Company Admin (Tenant Owner)</option>
                  ) : (
                    <>
                      <option value="Employee">Employee</option>
                      <option value="Team Leader">Team Leader</option>
                      <option value="HR Manager">HR Manager</option>
                    </>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#8A9CB7] group-focus-within:text-[#1988A3] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <AnimatePresence>
                {signupType === 'create' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-1.5 text-left group mt-3 overflow-hidden"
                  >
                    <label className="text-[#5A6D89] text-[11px] font-bold ml-1 uppercase tracking-wider group-focus-within:text-[#1988A3] transition-colors">
                      Subscription Plan
                    </label>
                    <div className="relative">
                      <select
                        name="selectedPlan"
                        value={formData.selectedPlan}
                        onChange={handleChange}
                        className="w-full bg-white/70 focus:bg-white/95 border border-[#8A9CB7]/30 rounded-2xl py-3.5 px-4 text-sm text-[#17233E] focus:outline-none focus:ring-2 focus:ring-[#1988A3]/25 focus:border-[#1988A3] transition-all appearance-none cursor-pointer hover:border-[#8A9CB7]/55"
                      >
                        <option value="Starter">Starter ($600/mo - 30 Seats)</option>
                        <option value="Professional">Professional ($1200/mo - 250 Seats)</option>
                        <option value="Enterprise AI">Enterprise AI ($2500/mo - 1000 Seats)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#8A9CB7] group-focus-within:text-[#1988A3] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-[10px] text-[#8A9CB7] mt-1 pl-1 font-medium">
                {signupType === 'create'
                  ? 'Creating a new organization tenant provisions row-level database partitioning.'
                  : 'Role assignment subject to approval by Company Admin'}
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.015, y: isSubmitting ? 0 : -2 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.985 }}
              disabled={isSubmitting}
              type="submit"
              className="relative overflow-hidden w-full bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] hover:from-[#1988A3] hover:to-[#11C6DE] disabled:opacity-50 py-3.5 sm:py-4 rounded-full font-extrabold transition-all duration-300 text-sm mt-2 shadow-xl shadow-[#17233E]/20 hover:shadow-[#1988A3]/35 text-white flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Request...
                </>
              ) : (
                signupType === 'create' ? 'Create Organization Tenant' : 'Request Account Access'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex-1 h-px bg-[#8A9CB7]/30"></div>
            <span className="text-[10px] uppercase font-bold text-[#8A9CB7] tracking-widest">or continue with</span>
            <div className="flex-1 h-px bg-[#8A9CB7]/30"></div>
          </div>

          {/* Google SSO Button */}
          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            type="button"
            onClick={() => handleGoogleSSO()}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 mt-4 py-3 bg-white/85 hover:bg-white border border-[#8A9CB7]/30 rounded-2xl text-xs sm:text-sm font-bold text-[#17233E] transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-[#1988A3] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
          </motion.button>

          <p className="text-center text-xs sm:text-sm text-[#5A6D89] mt-6 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-[#1988A3] font-bold hover:text-[#157289] hover:underline transition-colors ml-1">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;