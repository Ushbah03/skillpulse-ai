import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Building2, 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  Save, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  User, 
  Globe, 
  Palette,
  FileText,
  Loader2,
  X,
  Binary,
  Database
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import { adminAPI } from '../services/api';

const SEVERITY_LABEL = (action) => {
  const a = (action || '').toUpperCase();
  if (a.includes('ROLE') || a.includes('DEACTIVAT') || a.includes('DELETE') || a.includes('SECURITY')) return 'High';
  if (a.includes('UPDATE') || a.includes('MODIFIED') || a.includes('TAXONOMY') || a.includes('CREATED')) return 'Medium';
  return 'Low';
};

const OrgSettingsAuditLogs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('settings');
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingOrg, setLoadingOrg] = useState(true);

  // Organization Form State (populated from backend)
  const [orgData, setOrgData] = useState({
    legalName: '',
    domain: '',
    themeColor: '#6366F1',
    maxSeats: 0,
    activeSeats: 0,
    subscriptionTier: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Upgrade Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState([]);

  // Check for plan restriction redirect
  useEffect(() => {
    if (location.state?.planRestricted) {
      setIsUpgradeModalOpen(true);
      // Clear state so it doesn't keep reopening on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchOrgData = async () => {
      setLoadingOrg(true);
      try {
        // Handle Stripe payment success verification
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        if (sessionId) {
          const { paymentAPI, authAPI } = await import('../services/api');
          const verifyRes = await paymentAPI.verifySession(sessionId);
          if (verifyRes?.success) {
            window.history.replaceState({}, document.title, window.location.pathname);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            
            // Fetch fresh user data to update plan in localStorage so Sidebar unlocks
            try {
              const meRes = await authAPI.getMe();
              if (meRes?.success && meRes.user) {
                localStorage.setItem('user', JSON.stringify(meRes.user));
                // Force a custom event to re-render the sidebar immediately
                window.dispatchEvent(new Event('user-updated'));
              }
            } catch(e) {
              console.error('Failed to update local user state:', e);
            }
          }
        }

        const res = await adminAPI.getDashboard();
        if (res?.success) {
          const d = res.data;
          setOrgData({
            legalName: d.tenantName || '',
            domain: '',
            themeColor: '#6366F1',
            maxSeats: d.maxUsers || 0,
            activeSeats: d.activeUsersCount || 0,
            subscriptionTier: d.plan || 'PRO'
          });
        }
      } catch (err) {
        console.warn('Failed to load org data:', err);
      } finally {
        setLoadingOrg(false);
      }
    };
    fetchOrgData();
  }, []);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await adminAPI.getAuditLogs();
      if (res?.success) {
        const mapped = res.data.map(log => ({
          id: `LOG-${log.id.slice(-4).toUpperCase()}`,
          user: log.user ? `${log.user.firstName} ${log.user.lastName} (${log.user.role})` : 'System',
          action: log.action,
          target: log.resource || 'System',
          ip: log.ipAddress || 'N/A',
          severity: SEVERITY_LABEL(log.action),
          timestamp: new Date(log.createdAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' })
        }));
        setAuditLogs(mapped);
      }
    } catch (err) {
      console.warn('Failed to load audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit') {
      fetchAuditLogs();
    }
  }, [activeTab]);


  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Event ID', 'User Agent', 'Action Executed', 'Target Module', 'IP Address', 'Severity', 'Timestamp'];
    const csvRows = [
      headers.join(','),
      ...filteredLogs.map(log => [
        `"${log.id}"`,
        `"${log.user.replace(/"/g, '""')}"`,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${log.target.replace(/"/g, '""')}"`,
        `"${log.ip}"`,
        `"${log.severity}"`,
        `"${log.timestamp}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportModalOpen(false);
  };

  const handleExportJSON = () => {
    if (filteredLogs.length === 0) return;
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportModalOpen(false);
  };

  // Handle Org Settings Form Save
  const handleSaveOrgSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  // Filter Audit Logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <CompanyAdminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Organization Settings & Audit Logs
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage enterprise branding, subscription usage, and monitor tenant audit activity trails.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-800 p-1.5 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'settings' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Org Settings
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'audit' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Audit Logs
            </button>
          </div>
        </div>

        {/* Tab 1: Organization Settings */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
            
            {saveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Organization parameters updated successfully!
              </div>
            )}

            {/* License Overview */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <CreditCard className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{orgData.subscriptionTier}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Enterprise SLA & Priority AI Model Compute Active</p>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-start">
                <div>
                  <p className="text-xs text-slate-400">Allocated Seats</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">{orgData.activeSeats} / {orgData.maxSeats}</p>
                </div>
                <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden mr-4">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(orgData.activeSeats / orgData.maxSeats) * 100}%` }} />
                </div>
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all shrink-0"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Organization Form */}
            <form onSubmit={handleSaveOrgSettings} className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">General Organization Profile</h2>
                  <p className="text-xs text-slate-400">Manage tenant display names, subdomains, and corporate branding.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Company Legal Name</label>
                  <input
                    type="text"
                    required
                    value={orgData.companyName}
                    onChange={(e) => setOrgData({ ...orgData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Primary Domain</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={orgData.domain}
                      onChange={(e) => setOrgData({ ...orgData, domain: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Primary Theme Brand Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={orgData.primaryColor}
                      onChange={(e) => setOrgData({ ...orgData, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={orgData.primaryColor}
                      onChange={(e) => setOrgData({ ...orgData, primaryColor: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  Save Organization Settings
                </motion.button>
              </div>
            </form>

          </motion.div>
        )}

        {/* Tab 2: Audit Logs */}
        {activeTab === 'audit' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Search and Filters */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by action, user, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Severity:</span>
                  <select 
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-[#0F172A]">All Levels</option>
                    <option value="Low" className="bg-[#0F172A]">Low</option>
                    <option value="Medium" className="bg-[#0F172A]">Medium</option>
                    <option value="High" className="bg-[#0F172A]">High</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shrink-0"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  Export Logs
                </button>
              </div>
            </div>

            {loadingLogs ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm font-semibold text-slate-400">Loading audit trail from database...</p>
              </div>
            ) : (
            /* Audit Trail Table */
            <div className="rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#1E293B]/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Event ID</th>
                      <th className="px-6 py-4">User Agent</th>
                      <th className="px-6 py-4">Action Executed</th>
                      <th className="px-6 py-4">Target Module</th>
                      <th className="px-6 py-4">IP Address</th>
                      <th className="px-6 py-4">Severity</th>
                      <th className="px-6 py-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-semibold">
                            {log.id}
                          </td>
                          <td className="px-6 py-4 font-medium text-white text-xs">
                            {log.user}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-300">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-400">
                            {log.target}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-400">
                            {log.ip}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${
                              log.severity === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              log.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-400">
                            {log.timestamp}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-10 text-slate-500">
                          No audit log entries match the search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            )}

          </motion.div>
        )}

        {/* Custom Export Modal */}
        <AnimatePresence>
          {isExportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Download className="w-5 h-5 text-indigo-400" /> Export Audit Logs
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Select the format you want to download.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={handleExportCSV} className="w-full py-3 bg-[#1E293B] hover:bg-[#2A374A] border border-slate-700/50 rounded-xl text-sm font-medium text-slate-200 transition-colors flex items-center justify-center gap-2">
                    <Binary className="w-4 h-4 text-slate-400" /> Download as CSV
                  </button>
                  <button onClick={handleExportJSON} className="w-full py-3 bg-[#1E293B] hover:bg-[#2A374A] border border-slate-700/50 rounded-xl text-sm font-medium text-slate-200 transition-colors flex items-center justify-center gap-2">
                    <Database className="w-4 h-4 text-slate-400" /> Download as JSON
                  </button>
                </div>
                <button onClick={() => setIsExportModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Pricing & Upgrade Modal */}
        <AnimatePresence>
          {isUpgradeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 w-full max-w-5xl shadow-2xl relative my-8"
              >
                <button onClick={() => setIsUpgradeModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-300 bg-slate-800/50 p-2 rounded-full transition-all hover:bg-slate-700/50">
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">Upgrade Your Enterprise Plan</h2>
                  <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
                    Select the plan that fits your organization's needs. Your current plan is <span className="font-bold text-indigo-400">{orgData.subscriptionTier}</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Starter Plan */}
                  <div className={`relative p-6 rounded-3xl border flex flex-col ${orgData.subscriptionTier === 'STARTER' ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-[#151E32]'}`}>
                    {orgData.subscriptionTier === 'STARTER' && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Current Plan
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-extrabold text-white">$600</span>
                      <span className="text-sm text-slate-400">/ mo</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 50 Seats</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Basic AI Inferencing</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Standard Support</li>
                    </ul>
                    <button
                      disabled={orgData.subscriptionTier === 'STARTER' || checkoutLoading === 'Starter'}
                      onClick={async () => {
                        setCheckoutLoading('Starter');
                        try {
                          const user = JSON.parse(localStorage.getItem('user'));
                          const res = await import('../services/api').then(m => m.paymentAPI.createCheckoutSession(user?.tenantId || user?.tenant?.id, 'Starter', 50));
                          if (res?.success && res?.url) window.location.href = res.url;
                        } finally { setCheckoutLoading(null); }
                      }}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${orgData.subscriptionTier === 'STARTER' ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
                    >
                      {checkoutLoading === 'Starter' ? 'Processing...' : orgData.subscriptionTier === 'STARTER' ? 'Active' : 'Downgrade to Starter'}
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className={`relative p-6 rounded-3xl border flex flex-col ${orgData.subscriptionTier === 'PRO' || orgData.subscriptionTier === 'Professional' ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-2xl shadow-indigo-500/20' : 'border-slate-800 bg-[#151E32]'}`}>
                    {(orgData.subscriptionTier === 'PRO' || orgData.subscriptionTier === 'Professional') && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Current Plan
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-indigo-400 mb-2">Professional</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-extrabold text-white">$1200</span>
                      <span className="text-sm text-slate-400">/ mo</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 250 Seats</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Advanced AI Analytics</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Custom HRIS Integrations</li>
                    </ul>
                    <button
                      disabled={orgData.subscriptionTier === 'PRO' || orgData.subscriptionTier === 'Professional' || checkoutLoading === 'Professional'}
                      onClick={async () => {
                        setCheckoutLoading('Professional');
                        try {
                          const user = JSON.parse(localStorage.getItem('user'));
                          const res = await import('../services/api').then(m => m.paymentAPI.createCheckoutSession(user?.tenantId || user?.tenant?.id, 'Professional', 250));
                          if (res?.success && res?.url) window.location.href = res.url;
                        } finally { setCheckoutLoading(null); }
                      }}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${(orgData.subscriptionTier === 'PRO' || orgData.subscriptionTier === 'Professional') ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'}`}
                    >
                      {checkoutLoading === 'Professional' ? 'Processing...' : (orgData.subscriptionTier === 'PRO' || orgData.subscriptionTier === 'Professional') ? 'Active' : 'Upgrade to Pro'}
                    </button>
                  </div>

                  {/* Enterprise Plan */}
                  <div className={`relative p-6 rounded-3xl border flex flex-col ${orgData.subscriptionTier === 'ENTERPRISE' || orgData.subscriptionTier === 'Enterprise AI' ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-[#151E32]'}`}>
                    {(orgData.subscriptionTier === 'ENTERPRISE' || orgData.subscriptionTier === 'Enterprise AI') && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Current Plan
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">Enterprise AI</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-extrabold text-white">$2500</span>
                      <span className="text-sm text-slate-400">/ mo</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Seats</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Priority AI Model Compute</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 24/7 Dedicated SLA Support</li>
                    </ul>
                    <button
                      disabled={orgData.subscriptionTier === 'ENTERPRISE' || orgData.subscriptionTier === 'Enterprise AI' || checkoutLoading === 'Enterprise AI'}
                      onClick={async () => {
                        setCheckoutLoading('Enterprise AI');
                        try {
                          const user = JSON.parse(localStorage.getItem('user'));
                          const res = await import('../services/api').then(m => m.paymentAPI.createCheckoutSession(user?.tenantId || user?.tenant?.id, 'Enterprise AI', 500));
                          if (res?.success && res?.url) window.location.href = res.url;
                        } finally { setCheckoutLoading(null); }
                      }}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${(orgData.subscriptionTier === 'ENTERPRISE' || orgData.subscriptionTier === 'Enterprise AI') ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
                    >
                      {checkoutLoading === 'Enterprise AI' ? 'Processing...' : (orgData.subscriptionTier === 'ENTERPRISE' || orgData.subscriptionTier === 'Enterprise AI') ? 'Active' : 'Upgrade to Enterprise'}
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default OrgSettingsAuditLogs;