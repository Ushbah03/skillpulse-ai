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
  Layers,
  Sparkles
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
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
  const [savingOrg, setSavingOrg] = useState(false);

  // Organization Form State (populated from database)
  const [orgData, setOrgData] = useState({
    legalName: '',
    domain: '',
    themeColor: '#1988A3',
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
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

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
          
          try {
            const meRes = await authAPI.getMe();
            if (meRes?.success && meRes.user) {
              localStorage.setItem('user', JSON.stringify(meRes.user));
              window.dispatchEvent(new Event('user-updated'));
            }
          } catch(e) {
            console.error('Failed to update local user state:', e);
          }
        }
      }

      const res = await adminAPI.getDashboard();
      if (res?.success && res.data) {
        const d = res.data;
        setOrgData({
          legalName: d.tenantName || '',
          domain: d.domain || d.slug || '',
          themeColor: d.themeSettings?.primaryColor || '#1988A3',
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

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await adminAPI.getAuditLogs();
      if (res?.success && res.data) {
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
    fetchOrgData();
    fetchAuditLogs();
  }, []);

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

  // Handle Org Settings Form Save with real API call
  const handleSaveOrgSettings = async (e) => {
    e.preventDefault();
    setSavingOrg(true);
    try {
      const res = await adminAPI.updateOrganizationProfile({
        legalName: orgData.legalName,
        domain: orgData.domain,
        themeColor: orgData.themeColor
      });
      if (res?.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
        fetchOrgData();
      }
    } catch (err) {
      console.warn('Failed to update organization profile:', err);
    } finally {
      setSavingOrg(false);
    }
  };

  // Filter Audit Logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const seatUsagePercentage = orgData.maxSeats > 0 ? Math.round((orgData.activeSeats / orgData.maxSeats) * 100) : 0;

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

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 px-3.5 sm:px-6 md:px-8 pt-20 lg:pt-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8">
        
        {/* Page Header */}
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E]">
                Organization Settings & <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Audit Logs</span>
              </h1>
            </div>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium mt-1.5 ml-0 sm:ml-12">
              Manage enterprise branding, subscription usage, and monitor tenant audit activity trails.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-white/70 backdrop-blur-md border border-white/85 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-xs shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 md:flex-none text-center px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-md shadow-[#1988A3]/25' 
                  : 'text-[#17233E] hover:bg-white/80'
              }`}
            >
              Org Settings
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 md:flex-none text-center px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'audit' 
                  ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-md shadow-[#1988A3]/25' 
                  : 'text-[#17233E] hover:bg-white/80'
              }`}
            >
              Audit Logs ({auditLogs.length})
            </button>
          </div>
        </header>

        {/* Live Framework KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Seats Allocated</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <User className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#17233E] mt-2 sm:mt-3 tracking-tight">
              {orgData.activeSeats} <span className="text-sm font-bold text-[#8A9CB7]">/ {orgData.maxSeats}</span>
            </p>
            <div className="w-full bg-[#1B3154]/10 rounded-full h-2 mt-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${seatUsagePercentage}%` }}
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
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Active Plan</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-purple-600 shadow-sm">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-2 sm:mt-3 tracking-tight">
              {orgData.subscriptionTier || 'PRO'}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Enterprise SLA Active
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Audit Records</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-emerald-600 shadow-sm">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2 sm:mt-3 tracking-tight">
              {auditLogs.length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Tracked compliance events
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Tenant Domain</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#11C6DE] shadow-sm">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-[#11C6DE] mt-2 sm:mt-3 tracking-tight truncate">
              {orgData.domain || 'apextech'}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE]"></span> Workspace subdomain
            </p>
          </motion.div>
        </div>

        {/* Tab 1: Organization Settings */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
            
            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 flex items-center gap-3 text-sm font-bold shadow-md"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  Organization profile and settings updated successfully in workspace!
                </motion.div>
              )}
            </AnimatePresence>

            {/* License Overview */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                  <CreditCard className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#17233E]">{orgData.subscriptionTier} Plan</h3>
                  <p className="text-xs text-[#8A9CB7] font-medium mt-0.5">Enterprise SLA & Priority AI Model Compute Active</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6 border-t md:border-t-0 md:border-l border-white/60 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-start">
                <div>
                  <p className="text-xs text-[#8A9CB7] font-semibold">Allocated Seats</p>
                  <p className="text-xl font-extrabold text-[#17233E] mt-0.5">{orgData.activeSeats} / {orgData.maxSeats}</p>
                </div>
                <div className="w-24 bg-[#1B3154]/10 h-2 rounded-full overflow-hidden mr-4">
                  <div className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] h-full rounded-full" style={{ width: `${seatUsagePercentage}%` }} />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs font-bold rounded-2xl shadow-lg shadow-[#1988A3]/25 transition-all shrink-0 cursor-pointer"
                >
                  Upgrade Plan
                </motion.button>
              </div>
            </motion.div>

            {/* Organization Form */}
            <form onSubmit={handleSaveOrgSettings} className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/60">
                <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#17233E]">General Organization Profile</h2>
                  <p className="text-xs text-[#8A9CB7] font-medium mt-0.5">Manage tenant display names, subdomains, and corporate branding.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#17233E] mb-1.5">Company Legal Name</label>
                  <input
                    type="text"
                    required
                    value={orgData.legalName}
                    onChange={(e) => setOrgData({ ...orgData, legalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17233E] mb-1.5">Primary Domain / Subdomain</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9CB7]" />
                    <input
                      type="text"
                      required
                      value={orgData.domain}
                      onChange={(e) => setOrgData({ ...orgData, domain: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17233E] mb-1.5">Primary Theme Brand Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={orgData.themeColor}
                      onChange={(e) => setOrgData({ ...orgData, themeColor: e.target.value })}
                      className="w-10 h-10 rounded-2xl border border-white/85 bg-white cursor-pointer p-1 shadow-xs"
                    />
                    <input
                      type="text"
                      value={orgData.themeColor}
                      onChange={(e) => setOrgData({ ...orgData, themeColor: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-white/90 rounded-2xl text-xs text-[#17233E] font-mono font-bold focus:outline-none focus:border-[#1988A3] shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/60 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={savingOrg || loadingOrg}
                  type="submit"
                  className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {savingOrg ? 'Saving Settings...' : 'Save Organization Settings'}
                </motion.button>
              </div>
            </form>

          </motion.div>
        )}

        {/* Tab 2: Audit Logs */}
        {activeTab === 'audit' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Search and Filters */}
            <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9CB7]" />
                <input
                  type="text"
                  placeholder="Search by action, user, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/80 text-[#17233E] border border-white/90 rounded-2xl text-sm focus:outline-none focus:border-[#1988A3] transition-colors placeholder:text-[#8A9CB7] shadow-sm font-medium"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
                <div className="flex items-center gap-2 bg-white/80 border border-white/90 px-3 py-1.5 rounded-2xl text-xs text-[#17233E] shadow-sm">
                  <Filter className="w-3.5 h-3.5 text-[#1988A3]" />
                  <span className="font-semibold">Severity:</span>
                  <select 
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Levels</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-[#17233E] border border-white/85 text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#1988A3]" />
                  Export Logs
                </motion.button>
              </div>
            </div>

            {loadingLogs ? (
              <SkillPulseLoader message="Loading audit activity trail..." fullScreen={false} />
            ) : (
            /* Audit Trail Table */
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-sm text-[#17233E] min-w-[700px]">
                  <thead className="bg-[#17233E]/10 text-xs font-bold uppercase tracking-wider text-[#17233E] border-b border-white/60">
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
                  <tbody className="divide-y divide-white/60">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-[#1988A3] font-bold">
                            {log.id}
                          </td>
                          <td className="px-6 py-4 font-bold text-[#17233E] text-xs">
                            {log.user}
                          </td>
                          <td className="px-6 py-4 text-xs text-[#17233E] font-medium">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-[#8A9CB7]">
                            {log.target}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[#8A9CB7]">
                            {log.ip}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border shadow-xs ${
                              log.severity === 'High' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                              log.severity === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                              'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[#8A9CB7]">
                            {log.timestamp}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-10 text-[#8A9CB7] font-medium">
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
                className="bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative text-white"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Download className="w-5 h-5 text-[#11C6DE]" /> Export Audit Logs
                  </h3>
                  <p className="text-xs text-[#8A9CB7] mt-1">Select the format you want to download.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={handleExportCSV} className="w-full py-3 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <Binary className="w-4 h-4" /> Download as CSV
                  </button>
                  <button onClick={handleExportJSON} className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <FileText className="w-4 h-4 text-[#11C6DE]" /> Download as JSON
                  </button>
                </div>
                <button onClick={() => setIsExportModalOpen(false)} className="absolute top-4 right-4 text-[#8A9CB7] hover:text-white cursor-pointer">
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
                className="bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative my-4 sm:my-8 text-white"
              >
                <button onClick={() => setIsUpgradeModalOpen(false)} className="absolute top-6 right-6 text-[#8A9CB7] hover:text-white bg-white/10 p-2 rounded-full transition-all cursor-pointer">
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">Upgrade Your Enterprise Plan</h2>
                  <p className="text-[#8A9CB7] mt-3 max-w-xl mx-auto text-sm">
                    Select the plan that fits your organization's needs. Your current plan is <span className="font-bold text-[#11C6DE]">{orgData.subscriptionTier}</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Starter Plan */}
                  <div className={`relative p-6 rounded-3xl border flex flex-col ${orgData.subscriptionTier === 'STARTER' ? 'border-[#11C6DE] bg-white/10' : 'border-white/10 bg-white/5'}`}>
                    {orgData.subscriptionTier === 'STARTER' && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#11C6DE] text-[#17233E] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Current Plan
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-extrabold text-white">$600</span>
                      <span className="text-sm text-[#8A9CB7]">/ mo</span>
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
                      className={`w-full py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${orgData.subscriptionTier === 'STARTER' ? 'bg-white/10 text-[#8A9CB7] cursor-not-allowed' : 'bg-white text-[#17233E] hover:bg-slate-200'}`}
                    >
                      {checkoutLoading === 'Starter' ? 'Processing...' : orgData.subscriptionTier === 'STARTER' ? 'Active' : 'Downgrade to Starter'}
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className={`relative p-6 rounded-3xl border flex flex-col ${orgData.subscriptionTier === 'PRO' || orgData.subscriptionTier === 'Professional' ? 'border-[#11C6DE] bg-white/15 scale-105 shadow-2xl shadow-[#11C6DE]/20' : 'border-white/10 bg-white/5'}`}>
                    {(orgData.subscriptionTier === 'PRO' || orgData.subscriptionTier === 'Professional') && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#11C6DE] text-[#17233E] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Current Plan
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-[#11C6DE] mb-2">Professional</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-extrabold text-white">$1200</span>
                      <span className="text-sm text-[#8A9CB7]">/ mo</span>
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
                      className={`w-full py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${(orgData.subscriptionTier === 'PRO' || orgData.subscriptionTier === 'Professional') ? 'bg-white/10 text-[#8A9CB7] cursor-not-allowed' : 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white hover:from-[#157289] hover:to-[#0EB3C9] shadow-lg shadow-[#1988A3]/25'}`}
                    >
                      {checkoutLoading === 'Professional' ? 'Processing...' : (orgData.subscriptionTier === 'PRO' || orgData.subscriptionTier === 'Professional') ? 'Active' : 'Upgrade to Pro'}
                    </button>
                  </div>

                  {/* Enterprise Plan */}
                  <div className={`relative p-6 rounded-3xl border flex flex-col ${orgData.subscriptionTier === 'ENTERPRISE' || orgData.subscriptionTier === 'Enterprise AI' ? 'border-[#11C6DE] bg-white/10' : 'border-white/10 bg-white/5'}`}>
                    {(orgData.subscriptionTier === 'ENTERPRISE' || orgData.subscriptionTier === 'Enterprise AI') && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#11C6DE] text-[#17233E] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Current Plan
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">Enterprise AI</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-extrabold text-white">$2500</span>
                      <span className="text-sm text-[#8A9CB7]">/ mo</span>
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
                      className={`w-full py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${(orgData.subscriptionTier === 'ENTERPRISE' || orgData.subscriptionTier === 'Enterprise AI') ? 'bg-white/10 text-[#8A9CB7] cursor-not-allowed' : 'bg-white text-[#17233E] hover:bg-slate-200'}`}
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
