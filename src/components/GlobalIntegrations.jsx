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
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

const CATEGORY_COLORS = {
  'Payment Gateway': 'text-emerald-700 bg-emerald-100 border-emerald-300',
  'SSO & Identity':  'text-indigo-700 bg-indigo-100 border-indigo-300',
  'HRIS & HCM':      'text-amber-700 bg-amber-100 border-amber-300',
  'LMS / Learning':  'text-purple-700 bg-purple-100 border-purple-300',
  'Collaboration':   'text-sky-700 bg-sky-100 border-sky-300',
};

const ConnectorIcon = ({ icon, name }) => {
  if (icon === 'stripe' || name?.toLowerCase().includes('stripe')) return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#635BFF]/15 to-indigo-100 border border-[#635BFF]/30 flex items-center justify-center shrink-0 shadow-sm">
      <CreditCard className="w-6 h-6 text-[#635BFF]" />
    </div>
  );
  if (icon === 'google' || name?.toLowerCase().includes('google')) return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-100 to-amber-100 border border-red-200 flex items-center justify-center shrink-0 shadow-sm">
      <ShieldCheck className="w-6 h-6 text-red-600" />
    </div>
  );
  return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1988A3]/15 to-[#11C6DE]/20 border border-[#1988A3]/30 flex items-center justify-center shrink-0 shadow-sm">
      <Globe className="w-6 h-6 text-[#1988A3]" />
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
    <div className="flex min-h-screen bg-[#E9EAF7] text-[#17233E] font-sans relative overflow-x-hidden selection:bg-[#1988A3]/20 selection:text-[#17233E]">
      {/* Ambient Animated Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#1988A3]/20 to-[#11C6DE]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-[#1B3154]/15 to-[#8A9CB7]/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-[#11C6DE]/15 to-[#1988A3]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#8A9CB7_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <SuperadminSidebar activeItem="integrations" />

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full font-sans relative z-10 space-y-8">
        
        {/* Sync Feedback Toast Banner */}
        <AnimatePresence>
          {syncFeedback && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg backdrop-blur-md ${
                syncFeedback.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {syncFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span className="text-sm font-semibold">{syncFeedback.message}</span>
              </div>
              <button 
                onClick={() => setSyncFeedback(null)} 
                className="text-[#5A6D89] hover:text-[#17233E] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#BEDDF5]/70 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E] flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#1988A3] to-[#11C6DE] text-white shadow-lg shadow-[#1988A3]/25 inline-flex">
                <Cable className="w-7 h-7" />
              </span>
              Global Enterprise Connectors
            </h1>
            <p className="text-[#5A6D89] text-sm mt-1">
              Manage platform-wide integrations for HRIS, LMS, Identity SSO, and API webhooks across all enterprise tenants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTriggerSync}
              disabled={isSyncing}
              title="Execute manual sync across all active connectors"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-[#BEDDF5] text-[#17233E] text-xs font-semibold shadow-sm hover:border-[#1988A3] transition-all"
            >
              <RefreshCw className={`w-4 h-4 text-[#1988A3] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Trigger Global Sync'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedIntegration(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Custom Integration
            </motion.button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Active Connectors</p>
              <Server className="w-4 h-4 text-[#1988A3]" />
            </div>
            <p className="text-3xl font-black text-[#17233E] mt-1">
              {activeCount} <span className="text-sm font-normal text-[#5A6D89]">/ {totalCount}</span>
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Platform Integrations</p>
              <Lock className="w-4 h-4 text-[#1988A3]" />
            </div>
            <p className="text-3xl font-black text-[#1988A3] mt-1">
              {platformCount} <span className="text-xs font-normal text-[#5A6D89]">core</span>
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Sync Engine Health</p>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <p className={`text-lg font-black mt-2 flex items-center gap-2 ${
              healthPercentage === 100 ? 'text-emerald-700' :
              healthPercentage >= 50 ? 'text-amber-700' : 'text-rose-700'
            }`}>
              {healthPercentage === 100 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              {healthPercentage}% {healthPercentage === 100 ? 'Operational' : 'Degraded'}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Global API Rate Limit</p>
              <Zap className="w-4 h-4 text-[#1988A3]" />
            </div>
            <p className="text-3xl font-black text-[#17233E] mt-1">
              {rateLimit} <span className="text-sm font-normal text-[#5A6D89]">req/min</span>
            </p>
          </motion.div>
        </div>

        {/* Filter & Search */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9CB7]" />
            <input
              type="text"
              placeholder="Search connectors by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-[#17233E] border border-[#BEDDF5] rounded-xl text-xs focus:outline-none focus:border-[#1988A3] shadow-sm transition-colors placeholder:text-[#8A9CB7]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white border border-[#BEDDF5] px-3 py-1.5 rounded-xl text-xs text-[#5A6D89] shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1988A3]" />
              <span className="font-semibold">Category:</span>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Payment Gateway">Payment Gateway</option>
                <option value="SSO & Identity">SSO & Identity</option>
                <option value="HRIS & HCM">HRIS & HCM</option>
                <option value="LMS / Learning">LMS / Learning</option>
                <option value="Collaboration">Collaboration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="p-16 text-center rounded-2xl bg-white/80 border border-[#BEDDF5] shadow-sm flex flex-col items-center justify-center gap-3">
            <SkillPulseLoader message="Loading Enterprise Integrations from Database..." />
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
                  className={`p-6 rounded-2xl border shadow-sm hover:shadow-md flex flex-col justify-between relative transition-all duration-200 ${
                    isPlatform
                      ? 'bg-gradient-to-br from-white via-white to-[#D8EBF9]/60 border-[#1988A3]/40'
                      : 'bg-white border-[#BEDDF5]'
                  }`}
                >
                  {isPlatform && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-[#1988A3] bg-[#1988A3]/10 border border-[#1988A3]/30 px-2.5 py-1 rounded-full shadow-sm">
                      <Lock className="w-2.5 h-2.5 text-[#1988A3]" /> PLATFORM CORE
                    </div>
                  )}

                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <ConnectorIcon icon={item.icon} name={item.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[#17233E] text-base truncate pr-20">{item.name}</h3>
                          {item.status === 'Connected' && (
                            <span className="relative flex h-2 w-2 shrink-0" title="Active Connection">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          )}
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${CATEGORY_COLORS[item.category] || 'text-[#5A6D89] bg-slate-100 border-slate-200'}`}>
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#5A6D89] leading-relaxed mb-4">{item.description}</p>

                    {item.details && item.details.length > 0 && (
                      <div className="bg-[#D8EBF9]/40 border border-[#BEDDF5] rounded-xl p-3 space-y-2 mb-4">
                        {item.details.map((d, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px]">
                            <span className="text-[#5A6D89] font-medium">{d.label}</span>
                            <span className={`font-mono font-bold truncate max-w-[160px] text-right ${
                              d.label === 'Webhook Status' ? 'text-amber-700' :
                              d.label === 'Mode' ? 'text-emerald-700' : 'text-[#17233E]'
                            }`}>{d.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Live Latency & Validation Telemetry */}
                    {item.lastLatencyMs !== null && item.lastLatencyMs !== undefined && (
                      <div className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-xl bg-white border border-[#BEDDF5] text-[#5A6D89] mb-4 font-mono shadow-sm">
                        <span className="flex items-center gap-1.5 text-[#5A6D89]">
                          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> Endpoint Status:
                        </span>
                        <span className="text-emerald-700 font-bold">
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
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-rose-50 border-rose-300 text-rose-800'
                          }`}
                        >
                          {validationFeedback.status === 'ONLINE' ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                          )}
                          <span className="truncate font-medium">{validationFeedback.message}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-4 border-t border-[#BEDDF5]">
                    <div className="flex items-center justify-between text-xs text-[#5A6D89] mb-4 font-mono">
                      <span>Tenants Connected:</span>
                      <span className="text-[#1988A3] font-bold">{item.activeTenants}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleValidateEndpoint(item)}
                        disabled={isCurrentlyValidating || updatingId === item.id}
                        title="Validate endpoint connection and measure latency"
                        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#17233E] border border-[#BEDDF5] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        {isCurrentlyValidating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1988A3]" />
                        ) : (
                          <Activity className="w-3.5 h-3.5 text-[#1988A3]" />
                        )}
                        <span>{isCurrentlyValidating ? 'Testing...' : 'Validate'}</span>
                      </button>

                      <button
                        onClick={() => toggleConnection(item)}
                        disabled={updatingId === item.id || isCurrentlyValidating}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          item.status === 'Connected'
                            ? isPlatform
                              ? 'bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700'
                              : 'bg-white hover:bg-slate-50 text-[#5A6D89] border border-[#BEDDF5]'
                            : 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white shadow-md shadow-[#1988A3]/20'
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
                        className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#5A6D89] border border-[#BEDDF5] transition-colors shadow-sm"
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
              <div className="col-span-3 p-12 text-center rounded-2xl bg-white/80 border border-[#BEDDF5] shadow-sm">
                <Cable className="w-12 h-12 text-[#8A9CB7] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#17233E]">No Connectors Match</h3>
                <p className="text-xs text-[#5A6D89] mt-1">Try a different category or search term.</p>
              </div>
            )}
          </div>
        )}

        {/* PAGINATION CONTROLS FOR CONNECTORS */}
        {!loading && filteredIntegrations.length > 0 && (
          <div className="p-4 bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A6D89]">
            <div className="flex items-center gap-4">
              <span>
                Showing <span className="font-bold text-[#17233E]">{filteredIntegrations.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-[#17233E]">{endIndex}</span> of <span className="font-bold text-[#17233E]">{filteredIntegrations.length}</span> enterprise connectors
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[#5A6D89]">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-white border border-[#BEDDF5] text-[#17233E] font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-[#1988A3] cursor-pointer font-mono shadow-sm"
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
                className="p-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-[#17233E] transition-colors border border-[#BEDDF5] shadow-sm"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                title="Previous Page"
                className="p-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-[#17233E] transition-colors border border-[#BEDDF5] shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-[#5A6D89] border border-[#BEDDF5]'
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
                className="p-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-[#17233E] transition-colors border border-[#BEDDF5] shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Last Page"
                className="p-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-[#17233E] transition-colors border border-[#BEDDF5] shadow-sm"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/90 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#BEDDF5]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20">
                    <Cable className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#17233E]">
                      {selectedIntegration ? `${selectedIntegration.name}` : 'Register Custom Integration'}
                    </h2>
                    <p className="text-xs text-[#5A6D89]">
                      {(selectedIntegration?.isPlatform || selectedIntegration?.type === 'platform') 
                        ? 'Platform-level core connector parameters.' 
                        : 'Configure global OAuth parameters, endpoints, and credentials.'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-[#5A6D89] hover:text-[#17233E] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedIntegration ? (
                <div className="mt-5 space-y-3">
                  {selectedIntegration.endpointUrl && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold uppercase text-[#5A6D89]">Vendor Endpoint URL</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={selectedIntegration.endpointUrl}
                          className="w-full px-3.5 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] font-mono focus:outline-none shadow-sm"
                        />
                        <button
                          onClick={() => handleCopy(selectedIntegration.endpointUrl, 'endpoint')}
                          className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#5A6D89] border border-[#BEDDF5] text-xs transition-colors shrink-0 shadow-sm"
                          title="Copy Endpoint"
                        >
                          {copiedField === 'endpoint' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedIntegration.details && selectedIntegration.details.map((d, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold uppercase text-[#5A6D89]">{d.label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          defaultValue={d.value}
                          className="w-full px-3.5 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] font-mono focus:outline-none shadow-sm"
                        />
                        <button
                          onClick={() => handleCopy(d.value, `detail-${i}`)}
                          className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#5A6D89] border border-[#BEDDF5] text-xs transition-colors shrink-0 shadow-sm"
                          title="Copy Value"
                        >
                          {copiedField === `detail-${i}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-2 p-3 bg-white/80 border border-[#BEDDF5] rounded-xl flex items-start gap-2 shadow-sm">
                    <AlertTriangle className="w-4 h-4 text-[#1988A3] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#5A6D89]">
                      {selectedIntegration.name?.includes('Stripe')
                        ? 'Stripe Webhooks are synchronized with backend billing routes. For public webhook testing, configure Stripe CLI or provide HTTPS URL.'
                        : selectedIntegration.name?.includes('Google')
                        ? 'Authorized JavaScript Origins and Redirect URIs are managed via Google Cloud Platform Console for OAuth 2.0.'
                        : 'Integration configuration and vendor credentials are stored securely and synchronized live via the SkillPulse database engine.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#BEDDF5]">
                    <button
                      onClick={() => handleValidateEndpoint(selectedIntegration)}
                      disabled={validatingId === selectedIntegration.id}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#1988A3] border border-[#BEDDF5] text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      {validatingId === selectedIntegration.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Activity className="w-3.5 h-3.5 text-[#1988A3]" />
                      )}
                      <span>{validatingId === selectedIntegration.id ? 'Validating...' : 'Validate Connection'}</span>
                    </button>

                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#5A6D89] text-xs font-semibold border border-[#BEDDF5] shadow-sm transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddIntegration} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Connector / Provider Name</label>
                    <input type="text" required placeholder="e.g. Workday HCM, Coursera LMS, Okta SSO"
                      value={newIntegrationName} onChange={(e) => setNewIntegrationName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Integration Category</label>
                    <select value={newIntegrationCategory} onChange={(e) => setNewIntegrationCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm">
                      <option value="HRIS & HCM">HRIS & HCM</option>
                      <option value="LMS / Learning">LMS / Learning</option>
                      <option value="SSO & Identity">SSO & Identity</option>
                      <option value="Collaboration">Collaboration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Webhook / API Endpoint Base URL</label>
                    <input type="url" required placeholder="https://api.enterprise.com/v1/skillpulse-sync"
                      value={newEndpointUrl} onChange={(e) => setNewEndpointUrl(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Global OAuth2 Client ID / API Key</label>
                    <input type="text" required placeholder="sp_client_live_99a8b7c6..."
                      value={newClientId} onChange={(e) => setNewClientId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] font-mono focus:outline-none focus:border-[#1988A3] shadow-sm" />
                  </div>
                  <div className="pt-4 border-t border-[#BEDDF5] flex justify-end gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#5A6D89] text-xs font-semibold border border-[#BEDDF5] shadow-sm">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 flex items-center gap-2">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-rose-300 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-700">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#17233E]">Critical Integration Warning</h2>
                  <p className="text-xs text-rose-700 font-medium mt-0.5">This action will affect all enterprise tenants</p>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-5 space-y-2">
                <p className="text-sm text-[#17233E] font-bold">
                  You are about to disconnect: <span className="text-rose-700">{dangerModal.name}</span>
                </p>
                <ul className="text-xs text-[#5A6D89] space-y-1.5 mt-2">
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

              <p className="text-xs text-[#5A6D89] mb-5">
                As Super Admin, you have full authority to make this change. This action is reversible — you can re-enable the connector at any time.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDangerModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#5A6D89] border border-[#BEDDF5] text-sm font-semibold transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDisconnect}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors shadow-md shadow-rose-600/20"
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
