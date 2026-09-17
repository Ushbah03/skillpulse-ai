import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Globe, 
  Clock, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Server,
  Loader2
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import { adminAPI } from '../services/api';

const SecurityAccessPolicies = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security Policy States (stored in SystemParameter table in DB)
  const [ssoEnforced, setSsoEnforced] = useState(true);
  const [mfaRequirement, setMfaRequirement] = useState('all'); // 'all' | 'admins' | 'optional'
  const [sessionTimeout, setSessionTimeout] = useState('60'); // minutes
  const [ipWhitelistingEnabled, setIpWhitelistingEnabled] = useState(false);
  const [whitelistedIPs, setWhitelistedIPs] = useState('192.168.1.1/24, 10.0.0.1');
  const [passwordMinLength, setPasswordMinLength] = useState(12);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState(90);

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
          if (d.ipWhitelistingEnabled !== undefined) setIpWhitelistingEnabled(d.ipWhitelistingEnabled);
          if (d.whitelistedIPs) setWhitelistedIPs(d.whitelistedIPs);
          if (d.passwordMinLength) setPasswordMinLength(d.passwordMinLength);
          if (d.requireSpecialChar !== undefined) setRequireSpecialChar(d.requireSpecialChar);
          if (d.auditLogRetentionDays) setAuditLogRetentionDays(d.auditLogRetentionDays);
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
        ipWhitelistingEnabled,
        whitelistedIPs,
        passwordMinLength,
        requireSpecialChar,
        auditLogRetentionDays
      };
      const res = await adminAPI.updateSecurityPolicies(payload);
      if (res?.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.warn('Failed to save security policies:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <CompanyAdminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Security & Access Control
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure tenant-wide authentication parameters, MFA rules, session parameters, and access controls.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSavePolicies}
            disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving to Database...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Security Policies
              </>
            )}
          </motion.button>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Security policies and tenant access rules updated successfully!
          </motion.div>
        )}

        <form onSubmit={handleSavePolicies} className="space-y-6 max-w-5xl">
          
          {/* Section 1: Authentication & Single Sign-On */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Authentication & SSO Policy</h2>
                <p className="text-xs text-slate-400">Enforce enterprise identity provider standards across all active users.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Enforce SSO Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E293B]/50 border border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-white">Mandatory SSO Authentication</h3>
                  <p className="text-xs text-slate-400">Force all non-superadmin users to sign in via configured Identity Provider (SAML 2.0 / OAuth2).</p>
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
                  <option value="admins">Enforce MFA for System Admins & Team Leads Only</option>
                  <option value="optional">Optional (User Managed)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Password Complexity & Session Timeouts */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Session & Password Policy</h2>
                <p className="text-xs text-slate-400">Define session expiration limits and fallback password rules.</p>
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
                  <option value="30">30 Minutes Inactivity Limit (Recommended)</option>
                  <option value="60">1 Hour Inactivity Limit</option>
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
          </div>

          {/* Section 3: IP Whitelisting & Network Restrictions */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Network & IP Whitelisting</h2>
                <p className="text-xs text-slate-400">Restrict access to specific corporate IP ranges and VPN subnets.</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E293B]/50 border border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Enable Corporate IP Restriction</h3>
                <p className="text-xs text-slate-400">Block logins attempted outside authorized corporate IP subnets.</p>
              </div>
              <button
                type="button"
                onClick={() => setIpWhitelistingEnabled(!ipWhitelistingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  ipWhitelistingEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  ipWhitelistingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {ipWhitelistingEnabled && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Whitelisted Subnets / CIDR Blocks (Comma Separated)</label>
                <textarea
                  rows="3"
                  value={whitelistedIPs}
                  onChange={(e) => setWhitelistedIPs(e.target.value)}
                  placeholder="e.g. 192.168.1.1/24, 10.0.0.1"
                  className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Section 4: Audit Data Retention */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6">
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
          </div>

        </form>

      </main>
    </div>
  );
};

export default SecurityAccessPolicies;