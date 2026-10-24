import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Clock, 
  Save, 
  CheckCircle2, 
  Server, 
  Shield, 
  Activity, 
  Layers 
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

const SecurityAccessPolicies = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security Policy States (loaded dynamically from PostgreSQL SystemParameter table)
  const [ssoEnforced, setSsoEnforced] = useState(false);
  const [mfaRequirement, setMfaRequirement] = useState('optional'); // 'all' | 'admins' | 'optional'
  const [sessionTimeout, setSessionTimeout] = useState('60'); // minutes
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState(90);
  const [auditLogCount, setAuditLogCount] = useState(0);

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const res = await adminAPI.getSecurityPolicies();
        if (res?.success && res.data) {
          const d = res.data;
          if (d.ssoEnforced !== undefined) setSsoEnforced(d.ssoEnforced);
          if (d.mfaRequirement) setMfaRequirement(d.mfaRequirement);
          if (d.sessionTimeout) setSessionTimeout(String(d.sessionTimeout));
          if (d.passwordMinLength) setPasswordMinLength(d.passwordMinLength);
          if (d.requireSpecialChar !== undefined) setRequireSpecialChar(d.requireSpecialChar);
          if (d.auditLogRetentionDays) setAuditLogRetentionDays(d.auditLogRetentionDays);
          if (res.auditLogCount !== undefined) setAuditLogCount(res.auditLogCount);
        }
      } catch (err) {
        console.warn('Failed to load security policies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleSavePolicies = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ssoEnforced,
        mfaRequirement,
        sessionTimeout,
        passwordMinLength,
        requireSpecialChar,
        auditLogRetentionDays
      };
      const res = await adminAPI.updateSecurityPolicies(payload);
      if (res?.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3500);
      }
    } catch (err) {
      console.warn('Failed to save security policies:', err);
    } finally {
      setSaving(false);
    }
  };

  // Dynamic security posture calculation from actual active settings
  const complianceScore = Math.min(100, (
    (passwordMinLength >= 12 ? 30 : passwordMinLength >= 8 ? 20 : 10) +
    (requireSpecialChar ? 25 : 0) +
    (Number(sessionTimeout) <= 60 ? 25 : Number(sessionTimeout) <= 120 ? 15 : 10) +
    (mfaRequirement === 'all' ? 20 : mfaRequirement === 'admins' ? 15 : 5)
  ));

  return (
    <div className="flex min-h-screen bg-[#E9EAF7] font-sans text-[#17233E] relative overflow-x-hidden selection:bg-[#1988A3] selection:text-white">
      {/* Ambient Gradient Depth Mesh Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-[#1988A3]/20 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#11C6DE]/16 blur-[140px] rounded-full" />
        <div className="absolute top-2/3 left-10 w-[600px] h-[600px] bg-[#1B3154]/16 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-[#8A9CB7]/28 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.10)_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
      </div>

      <CompanyAdminSidebar />

      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full relative z-10 space-y-8">
        
        {/* Page Header */}
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E]">
                Security & <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Access Control</span>
              </h1>
            </div>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium mt-1.5 ml-12">
              Configure tenant-wide authentication parameters, MFA rules, session parameters, and access controls.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSavePolicies}
            disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all duration-200 shrink-0 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Applying Policies...' : 'Save Security Policies'}
          </motion.button>
        </header>

        {/* Live Framework KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Security Score</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <p className="text-3xl font-extrabold text-[#17233E] tracking-tight">{complianceScore}%</p>
              <span className="text-xs font-bold text-emerald-600">Active</span>
            </div>
            <div className="w-full bg-[#1B3154]/10 rounded-full h-2 mt-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${complianceScore}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] h-2 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Password Rule</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-purple-600 shadow-sm">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-purple-600 mt-3 tracking-tight">
              ≥ {passwordMinLength} Chars
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              {requireSpecialChar ? 'Symbols & Numbers Enforced' : 'Standard Alpha'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Session Timeout</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#11C6DE] shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#11C6DE] mt-3 tracking-tight">
              {sessionTimeout} Mins
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE] animate-pulse"></span> Automatic inactivity expiry
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Audit Log Trail</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-emerald-600 shadow-sm">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 mt-3 tracking-tight">
              {auditLogRetentionDays} Days
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {auditLogCount} Events recorded
            </p>
          </motion.div>
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 flex items-center gap-3 text-sm font-bold shadow-md"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              Organization security policies and access rules successfully updated and enforced!
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <SkillPulseLoader message="Querying Enterprise Security Policies..." fullScreen={false} />
        ) : (
          <form onSubmit={handleSavePolicies} className="space-y-6 max-w-5xl">
            
            {/* Section 1: Authentication & Single Sign-On */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-white/60">
                <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#17233E]">Authentication & SSO Policy</h2>
                  <p className="text-xs text-[#8A9CB7] font-medium mt-0.5">Enforce enterprise identity provider standards across all active organization users.</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Enforce SSO Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/85 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-[#17233E]">Mandatory SSO Authentication</h3>
                    <p className="text-xs text-[#8A9CB7] font-medium">Force all workspace users to sign in via configured Identity Provider (SAML 2.0 / OAuth2).</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSsoEnforced(!ssoEnforced)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      ssoEnforced ? 'bg-[#1988A3]' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                      ssoEnforced ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* MFA Requirement */}
                <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/85 shadow-sm space-y-2">
                  <label className="block text-xs font-bold uppercase text-[#17233E]">Multi-Factor Authentication (MFA) Enforcement</label>
                  <select
                    value={mfaRequirement}
                    onChange={(e) => setMfaRequirement(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-white/90 rounded-xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                  >
                    <option value="all">Enforce MFA for All Enterprise Users</option>
                    <option value="admins">Enforce MFA for Admins & Team Leaders Only</option>
                    <option value="optional">Optional (User Managed)</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Section 2: Password Complexity & Session Timeouts */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-white/60">
                <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-purple-600 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#17233E]">Session & Password Policy</h2>
                  <p className="text-xs text-[#8A9CB7] font-medium mt-0.5">Define session expiration limits and strict password complexity rules.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#17233E] mb-1.5">Inactivity Session Timeout</label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-white/90 rounded-xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                  >
                    <option value="15">15 Minutes Inactivity Limit</option>
                    <option value="30">30 Minutes Inactivity Limit</option>
                    <option value="60">1 Hour Inactivity Limit (Recommended)</option>
                    <option value="480">8 Hours (Full Shift)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17233E] mb-1.5">Minimum Password Length</label>
                  <input
                    type="number"
                    min="8"
                    max="32"
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-white/90 rounded-xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/85 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-[#17233E]">Require Special Characters & Numbers</h3>
                  <p className="text-xs text-[#8A9CB7] font-medium">Ensure passwords include upper/lowercase letters, special symbols, and numbers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireSpecialChar(!requireSpecialChar)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    requireSpecialChar ? 'bg-[#1988A3]' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    requireSpecialChar ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </motion.div>

            {/* Section 3: Audit Data Retention */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-white/60">
                <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-emerald-600 shadow-sm">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#17233E]">Audit Log & Compliance Retention</h2>
                  <p className="text-xs text-[#8A9CB7] font-medium mt-0.5">Define retention windows for security activity streams and compliance logs.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#17233E] mb-1.5">Audit Trail Log Retention Period</label>
                <select
                  value={auditLogRetentionDays}
                  onChange={(e) => setAuditLogRetentionDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-white/90 rounded-xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                >
                  <option value={30}>30 Days Retention</option>
                  <option value={90}>90 Days Retention (Standard)</option>
                  <option value={180}>180 Days Retention</option>
                  <option value={365}>365 Days (1 Year Compliance)</option>
                </select>
              </div>
            </motion.div>

          </form>
        )}

      </main>
    </div>
  );
};

export default SecurityAccessPolicies;
