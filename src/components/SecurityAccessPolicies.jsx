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
  Loader2,
  Shield,
  Activity,
  Layers
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
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
    <div className="flex min-h-screen bg-[#0B1120]">
      <CompanyAdminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Security & Access Control
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1.5 ml-12">
              Configure tenant-wide authentication parameters, MFA rules, session parameters, and access controls.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSavePolicies}
            disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200 shrink-0"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Applying Policies...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Security Policies
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Live Framework KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.4)" }}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#131D31] to-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Score</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <p className="text-3xl font-extrabold text-white tracking-tight">{complianceScore}%</p>
              <span className="text-xs font-semibold text-emerald-400">Active</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${complianceScore}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -4, borderColor: "rgba(168, 85, 247, 0.4)" }}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#131D31] to-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password Rule</span>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-purple-400 mt-3 tracking-tight">
              ≥ {passwordMinLength} Chars
            </p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              {requireSpecialChar ? 'Symbols & Numbers Enforced' : 'Standard Alpha'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            whileHover={{ y: -4, borderColor: "rgba(56, 189, 248, 0.4)" }}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#131D31] to-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Session Timeout</span>
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-sky-400 mt-3 tracking-tight">
              {sessionTimeout} Mins
            </p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span> Automatic inactivity expiry
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            whileHover={{ y: -4, borderColor: "rgba(16, 185, 129, 0.4)" }}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#131D31] to-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audit Log Trail</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400 mt-3 tracking-tight">
              {auditLogRetentionDays} Days
            </p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {auditLogCount} Events recorded in workspace
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
              className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm font-medium"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Organization security policies and access rules successfully updated and enforced!
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSavePolicies} className="space-y-6 max-w-5xl">
          
          {/* Section 1: Authentication & Single Sign-On */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Authentication & SSO Policy</h2>
                <p className="text-xs text-slate-400">Enforce enterprise identity provider standards across all active organization users.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Enforce SSO Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E293B]/50 border border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-white">Mandatory SSO Authentication</h3>
                  <p className="text-xs text-slate-400">Force all workspace users to sign in via configured Identity Provider (SAML 2.0 / OAuth2).</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSsoEnforced(!ssoEnforced)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    ssoEnforced ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    ssoEnforced ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* MFA Requirement */}
              <div className="p-4 rounded-xl bg-[#1E293B]/50 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-300">Multi-Factor Authentication (MFA) Enforcement</label>
                <select
                  value={mfaRequirement}
                  onChange={(e) => setMfaRequirement(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
            className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Session & Password Policy</h2>
                <p className="text-xs text-slate-400">Define session expiration limits and strict password complexity rules.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Inactivity Session Timeout</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="15">15 Minutes Inactivity Limit</option>
                  <option value="30">30 Minutes Inactivity Limit</option>
                  <option value="60">1 Hour Inactivity Limit (Recommended)</option>
                  <option value="480">8 Hours (Full Shift)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Minimum Password Length</label>
                <input
                  type="number"
                  min="8"
                  max="32"
                  value={passwordMinLength}
                  onChange={(e) => setPasswordMinLength(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E293B]/50 border border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Require Special Characters & Numbers</h3>
                <p className="text-xs text-slate-400">Ensure passwords include upper/lowercase letters, special symbols, and numbers.</p>
              </div>
              <button
                type="button"
                onClick={() => setRequireSpecialChar(!requireSpecialChar)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  requireSpecialChar ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
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
            className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Audit Log & Compliance Retention</h2>
                <p className="text-xs text-slate-400">Define retention windows for security activity streams and compliance logs.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Audit Trail Log Retention Period</label>
              <select
                value={auditLogRetentionDays}
                onChange={(e) => setAuditLogRetentionDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value={30}>30 Days Retention</option>
                <option value={90}>90 Days Retention (Standard)</option>
                <option value={180}>180 Days Retention</option>
                <option value={365}>365 Days (1 Year Compliance)</option>
              </select>
            </div>
          </motion.div>

        </form>

      </main>
    </div>
  );
};

export default SecurityAccessPolicies;