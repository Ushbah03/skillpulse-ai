import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
  )
};

// Reusable Controlled Input
const AuthInput = ({ label, name, type = 'text', placeholder, value, onChange, icon, required = true, suffix }) => (
  <div className="flex flex-col gap-1.5 w-full text-left group">
    <label className="text-slate-400 text-[11px] font-semibold ml-1 uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors duration-300">
      {label}
    </label>
    <div className="relative transform transition-transform duration-300 group-focus-within:translate-x-1 flex items-center">
      <span className="absolute left-4 text-slate-400/60 group-focus-within:text-indigo-400 transition-colors duration-300 transform group-focus-within:scale-110 z-10">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-[#1E2536]/40 border border-white/5 rounded-2xl py-3.5 pl-11 ${suffix ? 'pr-28' : 'pr-4'} text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all backdrop-blur-md shadow-2xl hover:border-white/15`}
      />
      {suffix && (
        <span className="absolute right-4 text-xs font-semibold text-indigo-400/80 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
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
  });

  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e) => {
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

    setTimeout(() => {
      setIsSubmitting(false);
      setShowPopup(true);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }, 1000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-10 font-sans text-white relative overflow-hidden selection:bg-indigo-600"
      style={{ background: `linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)` }}
    >
      <style>{`
        @keyframes drift-light { 0%, 100% { transform: translate(0px, 0px) scale(1); } 50% { transform: translate(40px, -30px) scale(1.15); } }
        @keyframes drift-light-rev { 0%, 100% { transform: translate(0px, 0px) scale(1); } 50% { transform: translate(-50px, 40px) scale(1.2); } }
        .bg-glow-1 { animation: drift-light 10s ease-in-out infinite; }
        .bg-glow-2 { animation: drift-light-rev 14s ease-in-out infinite; }
      `}</style>

      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none bg-glow-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none bg-glow-2" />

      {/* POPUP NOTIFICATION */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 bg-indigo-600/95 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(99,102,241,0.3)] border border-white/20 z-50 max-w-sm"
          >
            <p className="text-sm font-bold flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-ping" />
              Registration Submitted!
            </p>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              {signupType === 'create'
                ? `Workspace '${formData.workspaceSubdomain}.skillpulse-ai.com' is pending System Admin approval.`
                : `Account created for role ${formData.requestedRole}. Redirecting to login...`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEFT BRANDING */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="hidden lg:block space-y-8 text-left">
          <motion.div variants={fadeInUp}>
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 group-hover:scale-110 transform transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-4xl font-bold tracking-tight bg-clip-text bg-gradient-to-r from-white to-slate-200 group-hover:text-indigo-300 transition-colors">
                SkillPulse-AI
              </span>
            </Link>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-[56px] font-bold leading-[1.1] tracking-tight bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
            Enterprise Skill <br />
            <span className="bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 text-transparent">Intelligence SaaS</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-md opacity-90 leading-relaxed">
            Provision isolated multi-tenant organization workspaces, bridge skill gaps with AI analytics, and construct optimized career paths.
          </motion.p>
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#111827]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.5)] w-full max-w-xl mx-auto hover:border-white/20 transition-all duration-500"
        >
          <div className="mb-6 text-left">
            <h2 className="text-3xl font-bold mb-1 tracking-tight bg-clip-text bg-gradient-to-r from-white to-slate-200">
              Create your account
            </h2>
            <p className="text-slate-400 text-xs font-medium">Join or setup your SkillPulse-AI enterprise workspace</p>
          </div>

          {/* TOGGLE WORKSPACE MODE */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#1E2536]/60 rounded-2xl mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => handleModeSwitch('create')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${signupType === 'create' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}
            >
               Create New Workspace
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('join')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${signupType === 'join' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}
            >
               Join Existing Workspace
            </button>
          </div>

          {/* ERROR BANNER */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-3 px-4 rounded-xl text-left font-medium"
              >
                ⚠️ {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <AuthInput
              label="Full Name"
              name="fullName"
              placeholder="e.g. Alex Johnson"
              value={formData.fullName}
              onChange={handleChange}
              icon={<Icons.User />}
            />

            <AuthInput
              label="Work Email Address"
              name="email"
              type="email"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Icons.Mail />}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <AuthInput
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={<Icons.Lock />}
              />
              <AuthInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={<Icons.Lock />}
              />
            </div>

            {/* DYNAMIC WORKSPACE INPUTS BASED ON SAAS INTENT */}
            {signupType === 'create' ? (
              <div className="grid md:grid-cols-2 gap-4">
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
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <AuthInput
                  label="Organization Name"
                  name="organizationName"
                  placeholder="Acme Corp"
                  value={formData.organizationName}
                  onChange={handleChange}
                  icon={<Icons.Building />}
                />
                <AuthInput
                  label="Workspace Key / Invite Code"
                  name="inviteCode"
                  placeholder="ORG-XXXX-2026"
                  value={formData.inviteCode}
                  onChange={handleChange}
                  icon={<Icons.Key />}
                />
              </div>
            )}

            {/* ROLE SELECTOR */}
            <div className="flex flex-col gap-1.5 text-left group">
              <label className="text-slate-400 text-[11px] font-semibold ml-1 uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors duration-300">
                {signupType === 'create' ? 'Primary Workspace Role' : 'Requested Role'}
              </label>
              <div className="relative transform transition-transform duration-300 group-focus-within:translate-x-1">
                <select
                  name="requestedRole"
                  value={formData.requestedRole}
                  onChange={handleChange}
                  className="w-full bg-[#1E2536]/40 border border-white/5 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all backdrop-blur-md appearance-none cursor-pointer hover:border-white/10"
                >
                  {signupType === 'create' ? (
                    <option className="bg-[#111827] text-white" value="Company Admin">Company Admin (Tenant Owner)</option>
                  ) : (
                    <>
                      <option className="bg-[#111827] text-white" value="Employee">Employee</option>
                      <option className="bg-[#111827] text-white" value="Team Leader">Team Leader</option>
                      <option className="bg-[#111827] text-white" value="HR Manager">HR Manager</option>
                    </>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 pl-1 font-medium">
                {signupType === 'create'
                  ? 'Creating a new organization tenant requires approval from System Admin'
                  : 'Role assignment subject to approval by Company Admin'}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2, boxShadow: '0 15px 30px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 py-4 rounded-full font-bold transition-all duration-300 text-base mt-2 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
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

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-white font-bold underline hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;