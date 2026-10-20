import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cable, 
  CheckCircle2, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  X, 
  ShieldCheck, 
  Globe, 
  CreditCard, 
  Lock, 
  AlertTriangle, 
  Loader2,
  RefreshCw,
  Activity,
  Zap,
  ExternalLink,
  Copy,
  Check,
  Radio,
  Server,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const CATEGORY_COLORS = {
  'Payment Gateway': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'SSO & Identity':  'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  'HRIS & HCM':      'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'LMS / Learning':  'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'Collaboration':   'text-sky-400 bg-sky-500/10 border-sky-500/20',
};

const ConnectorIcon = ({ icon, name }) => {
  if (icon === 'stripe' || name?.toLowerCase().includes('stripe')) return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#635BFF]/20 to-indigo-900/40 border border-[#635BFF]/30 flex items-center justify-center shrink-0 shadow-lg shadow-[#635BFF]/10">
      <CreditCard className="w-6 h-6 text-[#635BFF]" />
    </div>
  );
  if (icon === 'google' || name?.toLowerCase().includes('google')) return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-900/40 border border-red-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/10">
      <ShieldCheck className="w-6 h-6 text-red-400" />
    </div>
  );
  return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-slate-800 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/10">
      <Globe className="w-6 h-6 text-indigo-400" />
    </div>
  );
};

const GlobalIntegrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [rateLimit, setRateLimit] = useState('10,000');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);
  const [validatingId, setValidatingId] = useState(null);
  const [validationFeedback, setValidationFeedback] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  
  // Form fields for new integration
  const [newIntegrationName, setNewIntegrationName] = useState('');
  const [newIntegrationCategory, setNewIntegrationCategory] = useState('HRIS & HCM');
  const [newEndpointUrl, setNewEndpointUrl] = useState('');
  const [newClientId, setNewClientId] = useState('');

  const [dangerModal, setDangerModal] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Pagination State for Connectors
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  // Reset to page 1 when filter/search/pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, pageSize]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getIntegrations();
      if (res.success) {
        setIntegrations(res.data || []);
        if (res.rateLimit) {
          setRateLimit(res.rateLimit);
        }
      }
    } catch (err) {
      console.error("Failed to fetch global integrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [integrations, searchTerm, categoryFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredIntegrations.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredIntegrations.length);
  const paginatedIntegrations = useMemo(() => {
    return filteredIntegrations.slice(startIndex, endIndex);
  }, [filteredIntegrations, startIndex, endIndex]);

  const handleUpdateStatus = async (id, targetStatus) => {
    try {
      setUpdatingId(id);
      const res = await adminAPI.updateIntegrationStatus(id, targetStatus);
      if (res.success) {
        setIntegrations(prev => prev.map(item => 
          item.id === id ? { ...item, status: targetStatus } : item
        ));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleConnection = (item) => {
    const isPlatform = item.isPlatform || item.type === 'platform';
    if (isPlatform && item.status === 'Connected') {
      setDangerModal(item);
      return;
    }
    const newStatus = item.status === 'Connected' ? 'Disconnected' : 'Connected';
    handleUpdateStatus(item.id, newStatus);
  };

  const confirmDisconnect = async () => {
    if (!dangerModal) return;
    const itemToDisconnect = dangerModal;
    setDangerModal(null);
    await handleUpdateStatus(itemToDisconnect.id, 'Disconnected');
  };

  const handleTriggerSync = async () => {
    try {
      setIsSyncing(true);
      setSyncFeedback(null);
      const res = await adminAPI.triggerIntegrationSync();
      if (res.success) {
        setSyncFeedback({
          type: 'success',
          message: res.message || 'Global sync triggered successfully across all active enterprise connectors.'
        });
        await fetchIntegrations();
        setTimeout(() => setSyncFeedback(null), 6000);
      }
    } catch (err) {
      console.error("Failed to trigger global sync:", err);
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Failed to execute global integration sync.'
      });
      setTimeout(() => setSyncFeedback(null), 6000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleValidateEndpoint = async (item) => {
    if (!item?.id) return;
    try {
      setValidatingId(item.id);
      setValidationFeedback(null);
      const res = await adminAPI.validateIntegration(item.id, { endpointUrl: item.endpointUrl });
      setValidationFeedback({
        id: item.id,
        status: res.status || (res.success ? 'ONLINE' : 'OFFLINE'),
        message: res.message,
        latencyMs: res.latencyMs,
        httpStatus: res.httpStatus
      });
      await fetchIntegrations();
      setTimeout(() => setValidationFeedback(null), 8000);
    } catch (err) {
      console.error("Endpoint validation failed:", err);
      setValidationFeedback({
        id: item.id,
        status: 'OFFLINE',
        message: err.message || 'Network error reaching remote endpoint.',
        latencyMs: null
      });
      setTimeout(() => setValidationFeedback(null), 8000);
    } finally {
      setValidatingId(null);
    }
  };

  const handleCopy = (text, fieldKey) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddIntegration = async (e) => {
    e.preventDefault();
    if (!newIntegrationName.trim()) return;

    try {
      setSubmitting(true);
      const res = await adminAPI.createIntegration({
        name: newIntegrationName.trim(),
        category: newIntegrationCategory,
        endpointUrl: newEndpointUrl.trim() || undefined,
        clientId: newClientId.trim() || undefined,
        description: `Enterprise connection for ${newIntegrationName.trim()} synchronized with SkillPulse platform.`
      });

      if (res.success) {
        await fetchIntegrations();
        setIsModalOpen(false);
        setNewIntegrationName('');
        setNewEndpointUrl('');
        setNewClientId('');
      }
    } catch (err) {
      console.error("Failed to create integration:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalCount = integrations.length;
  const activeCount = integrations.filter(i => i.status === 'Connected').length;
  const platformCount = integrations.filter(i => i.isPlatform || i.type === 'platform').length;
  const healthPercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 100;

  return (
    <div className="flex min-h-screen bg-[#0B1120] relative overflow-hidden">
      {/* Ambient Animated Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full font-sans relative z-10">
        
        {/* Sync Feedback Toast Banner */}
        <AnimatePresence>
          {syncFeedback && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-2xl border flex items-center justify-between shadow-2xl backdrop-blur-md ${
                syncFeedback.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {syncFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span className="text-sm font-medium">{syncFeedback.message}</span>
              </div>
              <button 
                onClick={() => setSyncFeedback(null)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Cable className="w-8 h-8 text-indigo-400" />
              Global Enterprise Connectors
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage platform-wide integrations for HRIS, LMS, Identity SSO, and API webhooks across all enterprise tenants.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Box 12 in 6.3.9 HRIS Integration: Manual Sync Trigger across all connectors */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTriggerSync}
              disabled={isSyncing}
              title="Execute manual sync across all active connectors"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-200 text-sm font-semibold shadow-lg hover:shadow-indigo-500/10 transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Trigger Global Sync'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedIntegration(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Custom Integration
            </motion.button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900/80 border border-slate-800/80 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Active Connectors</p>
              <Server className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-1">
              {activeCount} <span className="text-sm font-normal text-slate-500">/ {totalCount}</span>
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900/80 border border-slate-800/80 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Platform Integrations</p>
              <Lock className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {platformCount} <span className="text-xs font-normal text-slate-500">core</span>
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900/80 border border-slate-800/80 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Sync Engine Health</p>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className={`text-lg font-extrabold mt-1 flex items-center gap-2 ${
              healthPercentage === 100 ? 'text-emerald-400' :
              healthPercentage >= 50 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {healthPercentage === 100 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              {healthPercentage}% {healthPercentage === 100 ? 'Operational' : 'Degraded'}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900/80 border border-slate-800/80 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Global API Rate Limit</p>
              <Zap className="w-4 h-4 text-indigo-300" />
            </div>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">
              {rateLimit} <span className="text-sm font-normal text-slate-400">req/min</span>
            </p>
          </motion.div>
        </div>

        {/* Filter & Search */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search connectors by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Category:</span>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Categories</option>
                <option value="Payment Gateway" className="bg-[#0F172A]">Payment Gateway</option>
                <option value="SSO & Identity" className="bg-[#0F172A]">SSO & Identity</option>
                <option value="HRIS & HCM" className="bg-[#0F172A]">HRIS & HCM</option>
                <option value="LMS / Learning" className="bg-[#0F172A]">LMS / Learning</option>
                <option value="Collaboration" className="bg-[#0F172A]">Collaboration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="p-16 text-center rounded-2xl bg-[#0F172A] border border-slate-800/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-slate-400">Loading Enterprise Integrations from Database...</p>
          </div>
        ) : (
          /* Connector Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedIntegrations.map((item) => {
              const isPlatform = item.isPlatform || item.type === 'platform';
              const isCurrentlyValidating = validatingId === item.id;
              const hasFeedback = validationFeedback && validationFeedback.id === item.id;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`p-6 rounded-2xl border shadow-xl flex flex-col justify-between relative transition-all duration-200 ${
                    isPlatform
                      ? 'bg-gradient-to-br from-[#0F172A] via-[#0F172A] to-indigo-950/20 border-indigo-500/30'
                      : 'bg-gradient-to-br from-[#0F172A] to-slate-900 border-slate-800/80'
                  }`}
                >
                  {isPlatform && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-full shadow-sm">
                      <Lock className="w-2.5 h-2.5 text-indigo-400" /> PLATFORM CORE
                    </div>
                  )}

                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <ConnectorIcon icon={item.icon} name={item.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base truncate pr-20">{item.name}</h3>
                          {item.status === 'Connected' && (
                            <span className="relative flex h-2 w-2 shrink-0" title="Active Connection">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          )}
                        </div>
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${CATEGORY_COLORS[item.category] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>

                    {item.details && item.details.length > 0 && (
                      <div className="bg-[#1E293B]/70 border border-slate-800 rounded-xl p-3 space-y-2 mb-4">
                        {item.details.map((d, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">{d.label}</span>
                            <span className={`font-mono font-semibold truncate max-w-[160px] text-right ${
                              d.label === 'Webhook Status' ? 'text-amber-400' :
                              d.label === 'Mode' ? 'text-emerald-400' : 'text-slate-300'
                            }`}>{d.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Live Latency & Validation Telemetry */}
                    {item.lastLatencyMs !== null && item.lastLatencyMs !== undefined && (
                      <div className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 mb-4 font-mono">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Endpoint Status:
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          {item.endpointStatus || 'ONLINE'} · {item.lastLatencyMs}ms
                        </span>
                      </div>
                    )}

                    {/* Validation Feedback Alert */}
                    <AnimatePresence>
                      {hasFeedback && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 mb-4 ${
                            validationFeedback.status === 'ONLINE'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-red-500/10 border-red-500/30 text-red-300'
                          }`}
                        >
                          {validationFeedback.status === 'ONLINE' ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                          )}
                          <span className="truncate">{validationFeedback.message}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4 font-mono">
                      <span>Tenants Connected:</span>
                      <span className="text-indigo-400 font-bold">{item.activeTenants}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Box 7 & 10 in Third-Party API Integration: Validate Global Endpoint Connection */}
                      <button
                        onClick={() => handleValidateEndpoint(item)}
                        disabled={isCurrentlyValidating || updatingId === item.id}
                        title="Validate endpoint connection and measure latency"
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        {isCurrentlyValidating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        ) : (
                          <Activity className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        <span>{isCurrentlyValidating ? 'Testing...' : 'Validate'}</span>
                      </button>

                      <button
                        onClick={() => toggleConnection(item)}
                        disabled={updatingId === item.id || isCurrentlyValidating}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                          item.status === 'Connected'
                            ? isPlatform
                              ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/25 hover:text-red-400'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                        }`}
                      >
                        {updatingId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : item.status === 'Connected' ? (
                          isPlatform ? '⚡ Live & Active' : 'Disconnect'
                        ) : (
                          'Enable Connector'
                        )}
                      </button>

                      <button
                        onClick={() => { setSelectedIntegration(item); setIsModalOpen(true); }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title="View Config"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredIntegrations.length === 0 && (
              <div className="col-span-3 p-12 text-center rounded-2xl bg-[#0F172A] border border-slate-800/80">
                <Cable className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Connectors Match</h3>
                <p className="text-xs text-slate-400 mt-1">Try a different category or search term.</p>
              </div>
            )}
          </div>
        )}

        {/* PAGINATION CONTROLS FOR CONNECTORS */}
        {!loading && filteredIntegrations.length > 0 && (
          <div className="mt-8 p-4 bg-[#0F172A] border border-slate-800/80 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>
                Showing <span className="font-bold text-white">{filteredIntegrations.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-white">{endIndex}</span> of <span className="font-bold text-white">{filteredIntegrations.length}</span> enterprise connectors
              </span>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-[#1E293B] border border-slate-700 text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
                >
                  <option value={3}>3</option>
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </div>
            </div>

            {/* Pagination Navigation */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                title="First Page"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700/60"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                title="Previous Page"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700/60"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Next Page"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700/60"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Last Page"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700/60"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Modal: View Details / Add New Connector */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Cable className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selectedIntegration ? `${selectedIntegration.name}` : 'Register Custom Integration'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {(selectedIntegration?.isPlatform || selectedIntegration?.type === 'platform') 
                        ? 'Platform-level core connector parameters.' 
                        : 'Configure global OAuth parameters, endpoints, and credentials.'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedIntegration ? (
                <div className="mt-5 space-y-3">
                  {selectedIntegration.endpointUrl && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold uppercase text-slate-400">Vendor Endpoint URL</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={selectedIntegration.endpointUrl}
                          className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none"
                        />
                        <button
                          onClick={() => handleCopy(selectedIntegration.endpointUrl, 'endpoint')}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors shrink-0"
                          title="Copy Endpoint"
                        >
                          {copiedField === 'endpoint' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedIntegration.details && selectedIntegration.details.map((d, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold uppercase text-slate-400">{d.label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          defaultValue={d.value}
                          className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                          onClick={() => handleCopy(d.value, `detail-${i}`)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors shrink-0"
                          title="Copy Value"
                        >
                          {copiedField === `detail-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-300">
                      {selectedIntegration.name?.includes('Stripe')
                        ? 'Stripe Webhooks are synchronized with backend billing routes. For public webhook testing, configure Stripe CLI or provide HTTPS URL.'
                        : selectedIntegration.name?.includes('Google')
                        ? 'Authorized JavaScript Origins and Redirect URIs are managed via Google Cloud Platform Console for OAuth 2.0.'
                        : 'Integration configuration and vendor credentials are stored securely and synchronized live via the SkillPulse database engine.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleValidateEndpoint(selectedIntegration)}
                      disabled={validatingId === selectedIntegration.id}
                      className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      {validatingId === selectedIntegration.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Activity className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>{validatingId === selectedIntegration.id ? 'Validating...' : 'Validate Connection'}</span>
                    </button>

                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddIntegration} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Connector / Provider Name</label>
                    <input type="text" required placeholder="e.g. Workday HCM, Coursera LMS, Okta SSO"
                      value={newIntegrationName} onChange={(e) => setNewIntegrationName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Integration Category</label>
                    <select value={newIntegrationCategory} onChange={(e) => setNewIntegrationCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                      <option value="HRIS & HCM">HRIS & HCM</option>
                      <option value="LMS / Learning">LMS / Learning</option>
                      <option value="SSO & Identity">SSO & Identity</option>
                      <option value="Collaboration">Collaboration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Webhook / API Endpoint Base URL</label>
                    <input type="url" required placeholder="https://api.enterprise.com/v1/skillpulse-sync"
                      value={newEndpointUrl} onChange={(e) => setNewEndpointUrl(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Global OAuth2 Client ID / API Key</label>
                    <input type="text" required placeholder="sp_client_live_99a8b7c6..."
                      value={newClientId} onChange={(e) => setNewClientId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2">
                      {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Save Connector
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Danger Confirmation Modal for Platform Connectors */}
      <AnimatePresence>
        {dangerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0F172A] border border-red-500/30 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Critical Integration Warning</h2>
                  <p className="text-xs text-red-400 font-medium mt-0.5">This action will affect all enterprise tenants</p>
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-5 space-y-2">
                <p className="text-sm text-slate-200 font-semibold">
                  You are about to disconnect: <span className="text-red-400">{dangerModal.name}</span>
                </p>
                <ul className="text-xs text-slate-400 space-y-1.5 mt-2">
                  {(dangerModal.id === 'stripe-global' || dangerModal.name?.includes('Stripe')) && (
                    <>
                      <li className="flex items-center gap-2">⛔ All tenant subscription payments will stop processing</li>
                      <li className="flex items-center gap-2">⛔ Plan upgrade/downgrade flows will break for all companies</li>
                      <li className="flex items-center gap-2">⛔ Stripe webhooks will no longer update plan status</li>
                    </>
                  )}
                  {(dangerModal.id === 'google-sso-global' || dangerModal.name?.includes('Google')) && (
                    <>
                      <li className="flex items-center gap-2">⛔ All users using Google Sign-In will be locked out</li>
                      <li className="flex items-center gap-2">⛔ "Sign in with Google" button will stop working platform-wide</li>
                      <li className="flex items-center gap-2">⛔ Auto-provisioned Google accounts will lose access</li>
                    </>
                  )}
                </ul>
              </div>

              <p className="text-xs text-slate-500 mb-5">
                As Super Admin, you have full authority to make this change. This action is reversible — you can re-enable the connector at any time.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDangerModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDisconnect}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-red-600/20"
                >
                  Yes, Disconnect
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GlobalIntegrations;