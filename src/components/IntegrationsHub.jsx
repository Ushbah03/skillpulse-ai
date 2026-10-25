import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Layers, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Settings2, 
  Clock,
  Plus,
  Loader2
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

const IntegrationsHub = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedHub, setSelectedHub] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // New Integration Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHubData, setNewHubData] = useState({
    name: '',
    category: 'HRIS System',
    type: 'hris',
    description: '',
    apiKey: '',
    endpointUrl: ''
  });

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getIntegrations();
      if (res?.success) {
        setIntegrations(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  // Filter Connectors
  const filteredIntegrations = integrations.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Connected') return item.status === 'Connected';
    if (activeFilter === 'HRIS') return item.type === 'hris' || item.category?.toLowerCase().includes('hris');
    if (activeFilter === 'LMS') return item.type === 'lms' || item.category?.toLowerCase().includes('lms');
    if (activeFilter === 'Custom Webhooks') return item.type === 'api' || (!['lms', 'hris'].includes(item.type));
    return true;
  });

  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    stats: null
  });

  // Trigger Manual Global Sync
  const handleTriggerGlobalSync = async () => {
    if (integrations.length === 0) {
      setNotificationModal({
        isOpen: true,
        title: 'No Connectors Found',
        message: 'No active enterprise connectors are currently configured to synchronize.',
        type: 'info',
        stats: null
      });
      return;
    }
    setIsSyncing(true);
    try {
      const res = await adminAPI.triggerIntegrationSync();
      if (res?.success) {
        setNotificationModal({
          isOpen: true,
          title: 'Global Sync Completed',
          message: 'Successfully synchronized organizational directory and LMS course catalogs.',
          type: 'success',
          stats: { synced: integrations.length, target: 'Enterprise Hubs' }
        });
        fetchIntegrations();
      }
    } catch (err) {
      console.warn('Failed to sync integrations:', err);
      setNotificationModal({
        isOpen: true,
        title: 'Sync Error',
        message: 'Failed to complete enterprise hub synchronization. Please check connectivity.',
        type: 'error',
        stats: null
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncHRIS = async () => {
    setIsSyncing(true);
    try {
      const res = await adminAPI.syncHrisDirectory();
      if (res?.success) {
        setNotificationModal({
          isOpen: true,
          title: 'HRIS Directory Synced',
          message: `Successfully ingested employee directory data into workspace directory.`,
          type: 'success',
          stats: {
            item1: `${res.data?.createdUsers || 0} Employees Ingested`,
            item2: `${res.data?.createdDepartments || 0} Departments Synced`
          }
        });
        fetchIntegrations();
      }
    } catch (err) {
      console.warn('HRIS Directory Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncLMS = async () => {
    setIsSyncing(true);
    try {
      const res = await adminAPI.syncLmsCatalog();
      if (res?.success) {
        setNotificationModal({
          isOpen: true,
          title: 'YouTube LMS Catalog Synced!',
          message: `Ingested ${res.data?.createdCourses || 0} educational YouTube video courses into training course catalog.`,
          type: 'success',
          stats: {
            item1: `${res.data?.createdCourses || 0} Video Courses Synchronized`,
            item2: 'Skill Gap Recommendations Updated'
          }
        });
        fetchIntegrations();
      }
    } catch (err) {
      console.warn('LMS Catalog Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Hub Connection State
  const toggleConnection = async (id) => {
    const hub = integrations.find(h => h.id === id);
    if (!hub) return;
    const nextStatus = hub.status === 'Connected' ? 'Disconnected' : 'Connected';
    try {
      const res = await adminAPI.updateIntegrationStatus(id, nextStatus);
      if (res?.success) {
        if (selectedHub && selectedHub.id === id) {
          setIsConfigModalOpen(false);
        }
        fetchIntegrations();
      }
    } catch (err) {
      console.warn('Failed to update integration status:', err);
    }
  };

  const handleOpenConfig = (hub) => {
    setSelectedHub(hub);
    setIsConfigModalOpen(true);
  };

  const handleAddHubSubmit = async (e) => {
    e.preventDefault();
    if (!newHubData.name) return;
    setSaving(true);
    try {
      const res = await adminAPI.createIntegration({
        name: newHubData.name,
        category: newHubData.category,
        type: newHubData.type,
        description: newHubData.description || 'Custom configured enterprise integration endpoint.',
        apiKey: newHubData.apiKey,
        endpointUrl: newHubData.endpointUrl
      });
      if (res?.success) {
        setIsAddModalOpen(false);
        setNewHubData({ name: '', category: 'LMS Catalog', type: 'lms', description: '', apiKey: '', endpointUrl: '' });
        fetchIntegrations();
      }
    } catch (err) {
      console.warn('Failed to create integration hub:', err);
    } finally {
      setSaving(false);
    }
  };

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
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E]">
                Integrations & <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Enterprise Hubs</span>
              </h1>
            </div>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium mt-1.5 ml-0 sm:ml-12">
              Connect external HRIS directories, LMS catalogs, and SSO identity providers to your tenant.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Enterprise Hub</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleTriggerGlobalSync}
              disabled={isSyncing}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-white text-[#17233E] border border-white/85 text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-[#1988A3] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Trigger Sync'}</span>
            </motion.button>
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
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Total Connectors</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#17233E] mt-2 sm:mt-3 tracking-tight">{integrations.length}</p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1988A3]"></span> Configured integration hubs
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Active Connected</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-emerald-600 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2 sm:mt-3 tracking-tight">
              {integrations.filter(h => h.status === 'Connected').length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {integrations.length > 0 ? Math.round((integrations.filter(h => h.status === 'Connected').length / integrations.length) * 100) : 0}% active health
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
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">LMS & Learning</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-purple-600 shadow-sm">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-2 sm:mt-3 tracking-tight">
              {integrations.filter(h => h.type === 'lms').length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Video course catalogs
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
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">HRIS & Directory</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#11C6DE] shadow-sm">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#17233E] mt-2 sm:mt-3 tracking-tight">
              {integrations.filter(h => h.type === 'hris').length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE]"></span> Workforce directories
            </p>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/60 pb-4"
        >
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {['All', 'Connected', 'LMS', 'HRIS', 'Custom Webhooks'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeFilter === filter 
                    ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-lg shadow-[#1988A3]/25' 
                    : 'bg-white/70 text-[#17233E] hover:bg-white border border-white/85 shadow-xs'
                }`}
              >
                {filter === 'All' ? 'All Enterprise Connectors' : filter}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-[#8A9CB7] bg-white/60 px-3 py-1.5 rounded-2xl border border-white/80 shrink-0 self-start sm:self-auto">
            Showing <span className="text-[#17233E] font-extrabold">{filteredIntegrations.length}</span> of {integrations.length} hubs
          </span>
        </motion.div>

        {/* Integration Hub Cards Grid */}
        {loading ? (
          <SkillPulseLoader message="Querying Enterprise Connectors & Hubs..." fullScreen={false} />
        ) : filteredIntegrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {filteredIntegrations.map((hub, idx) => (
              <motion.div 
                key={hub.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(0.25, idx * 0.03) }}
                whileHover={{ y: -4 }}
                className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden hover:border-[#1988A3]/40"
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm group-hover:scale-105 transition-transform">
                      {hub.type === 'hris' && <Database className="w-6 h-6 text-[#11C6DE]" />}
                      {hub.type === 'lms' && <Layers className="w-6 h-6 text-purple-600" />}
                      {hub.type === 'auth' && <Key className="w-6 h-6 text-amber-600" />}
                      {hub.type === 'payment' && <ShieldCheck className="w-6 h-6 text-emerald-600" />}
                      {hub.type === 'api' && <Zap className="w-6 h-6 text-[#1988A3]" />}
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-xs ${
                      hub.status === 'Connected' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      hub.status === 'Action Required' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        hub.status === 'Connected' ? 'bg-emerald-600 animate-pulse' :
                        hub.status === 'Action Required' ? 'bg-amber-600 animate-pulse' :
                        'bg-slate-400'
                      }`} />
                      {hub.status}
                    </span>
                  </div>

                  {/* Hub Information */}
                  <h3 className="text-lg font-extrabold text-[#17233E] mb-1 group-hover:text-[#1988A3] transition-colors">{hub.name}</h3>
                  <p className="text-xs text-[#1988A3] font-bold mb-3">{hub.category}</p>
                  <p className="text-xs text-[#8A9CB7] font-medium leading-relaxed mb-6">{hub.description}</p>
                </div>

                {/* Footer Row */}
                <div className="pt-4 border-t border-white/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8A9CB7] font-mono font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#1988A3]" />
                    <span>{hub.lastSync}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenConfig(hub)}
                    className="flex items-center gap-1.5 text-xs text-[#17233E] hover:text-[#1988A3] font-bold transition-colors bg-white/80 hover:bg-white px-3 py-1.5 rounded-xl border border-white/85 shadow-sm cursor-pointer"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-[#1988A3]" />
                    Configure Hub
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 sm:p-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 text-center shadow-xl shadow-[#1B3154]/6">
            <div className="p-4 rounded-2xl bg-white/70 text-[#1988A3] border border-white/85 mb-4 shadow-sm">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#17233E] mb-2">No Enterprise Connectors Configured</h3>
            <p className="text-sm text-[#8A9CB7] font-medium max-w-md mb-6">
              Connect external HRIS directories, LMS catalogs, SSO providers, or custom event webhooks to synchronize organizational data.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Configure First Enterprise Hub
            </button>
          </div>
        )}

      </main>

      {/* Integration Configuration Drawer Modal */}
      <AnimatePresence>
        {isConfigModalOpen && selectedHub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-[#11C6DE]">
                    {selectedHub.type === 'hris' && <Database className="w-5 h-5" />}
                    {selectedHub.type === 'lms' && <Layers className="w-5 h-5" />}
                    {selectedHub.type === 'auth' && <Key className="w-5 h-5" />}
                    {selectedHub.type === 'api' && <Zap className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedHub.name}</h2>
                    <p className="text-xs text-[#8A9CB7]">{selectedHub.category}</p>
                  </div>
                </div>
                <button onClick={() => setIsConfigModalOpen(false)} className="text-[#8A9CB7] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">API Base Endpoint URL</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedHub.endpointUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/api/admin/integrations/${selectedHub.id}`}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Tenant Secret Access Key</label>
                  <input
                    type="password"
                    readOnly
                    value={selectedHub.apiKey ? (selectedHub.apiKey.length > 8 ? `${selectedHub.apiKey.slice(0, 4)}••••••••••••••••${selectedHub.apiKey.slice(-4)}` : '••••••••••••••••') : `vault_sec_${selectedHub.id ? selectedHub.id.slice(0, 8) : 'tenant'}`}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Automatic Sync Interval</p>
                    <p className="text-[11px] text-[#8A9CB7]">Scheduled sync every 6 hours</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#11C6DE]">6 Hours</span>
                </div>

                {(() => {
                  const hubName = (selectedHub?.name || '').toLowerCase();
                  const hubCat = (selectedHub?.category || '').toLowerCase();
                  const hubType = (selectedHub?.type || '').toLowerCase();

                  const isLms = hubType === 'lms' || hubName.includes('lms') || hubName.includes('youtube') || hubCat.includes('lms') || hubCat.includes('learning');
                  const isHris = hubType === 'hris' || hubName.includes('hris') || hubName.includes('workday') || hubName.includes('bamboohr') || hubCat.includes('hris');

                  if (isHris) {
                    return (
                      <div className="space-y-3 pt-2">
                        <div className="p-3 rounded-2xl bg-[#1988A3]/15 border border-[#1988A3]/30 text-xs text-[#11C6DE] flex items-center justify-between">
                          <span>Live API Provider</span>
                          <span className="font-bold bg-[#1988A3]/30 px-2 py-0.5 rounded text-[10px]">randomuser.me (Live REST API)</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleSyncHRIS}
                          disabled={isSyncing}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1988A3]/25 cursor-pointer"
                        >
                          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                          {isSyncing ? 'Syncing HRIS Directory...' : '⚡ Run Real HRIS Employee Directory Sync'}
                        </button>
                      </div>
                    );
                  }

                  if (isLms) {
                    return (
                      <div className="space-y-3 pt-2">
                        <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300 flex items-center justify-between">
                          <span>Live API Provider</span>
                          <span className="font-bold bg-purple-500/30 px-2 py-0.5 rounded text-[10px]">YouTube Data API v3 (Live)</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleSyncLMS}
                          disabled={isSyncing}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-[#1988A3] hover:from-purple-500 hover:to-[#157289] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
                        >
                          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                          {isSyncing ? 'Syncing LMS Catalog...' : '⚡ Run Real LMS Course Catalog Sync'}
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSyncLMS}
                        disabled={isSyncing}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1988A3]/25 cursor-pointer"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Syncing LMS Catalog...' : '⚡ Run Real LMS Course Catalog Sync'}
                      </button>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleConnection(selectedHub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedHub.status === 'Connected' 
                      ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30' 
                      : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
                  }`}
                >
                  {selectedHub.status === 'Connected' ? 'Disconnect Connector' : 'Connect Enterprise Hub'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedHub?.type === 'lms') {
                      handleSyncLMS();
                    } else if (selectedHub?.type === 'hris') {
                      handleSyncHRIS();
                    }
                    setIsConfigModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs font-bold transition-all shadow-md shadow-[#1988A3]/25 cursor-pointer"
                >
                  Save & Sync Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Enterprise Hub Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Configure New Enterprise Hub</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-[#8A9CB7] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddHubSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Hub Name</label>
                  <input
                    type="text"
                    required
                    value={newHubData.name}
                    onChange={(e) => setNewHubData({ ...newHubData, name: e.target.value })}
                    placeholder="e.g. YouTube Educational LMS or Coursera Enterprise"
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#11C6DE]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={newHubData.category}
                      onChange={(e) => setNewHubData({ ...newHubData, category: e.target.value })}
                      placeholder="e.g. LMS Catalog"
                      className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#11C6DE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Connector Type</label>
                    <select
                      value={newHubData.type}
                      onChange={(e) => setNewHubData({ ...newHubData, type: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#11C6DE]"
                    >
                      <option value="lms">LMS Video Catalog</option>
                      <option value="hris">HRIS Employee Directory</option>
                      <option value="api">Custom API Webhook</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Endpoint / Playlist / Channel URL (Optional)</label>
                  <input
                    type="text"
                    value={newHubData.endpointUrl}
                    onChange={(e) => setNewHubData({ ...newHubData, endpointUrl: e.target.value })}
                    placeholder="e.g. https://www.youtube.com/playlist?list=..."
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#11C6DE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">API Key / Token (Optional)</label>
                  <input
                    type="password"
                    value={newHubData.apiKey}
                    onChange={(e) => setNewHubData({ ...newHubData, apiKey: e.target.value })}
                    placeholder="Paste integration API key or OAuth token"
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#11C6DE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newHubData.description}
                    onChange={(e) => setNewHubData({ ...newHubData, description: e.target.value })}
                    placeholder="Brief description of this connector..."
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#11C6DE]"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting Hub...
                      </>
                    ) : (
                      'Connect Enterprise Hub'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sync Status Toast/Modal Notification */}
      <AnimatePresence>
        {notificationModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden text-white"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1988A3] via-[#11C6DE] to-emerald-400" />
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl border shrink-0 ${
                  notificationModal.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
                  notificationModal.type === 'error' ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' :
                  'bg-[#1988A3]/15 border-[#1988A3]/30 text-[#11C6DE]'
                }`}>
                  {notificationModal.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                  {notificationModal.type === 'error' && <AlertTriangle className="w-6 h-6" />}
                  {notificationModal.type === 'info' && <Zap className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{notificationModal.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{notificationModal.message}</p>

                  {notificationModal.stats && (
                    <div className="space-y-2 mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-slate-200">
                      {notificationModal.stats.item1 && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{notificationModal.stats.item1}</span>
                        </div>
                      )}
                      {notificationModal.stats.item2 && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#11C6DE]" />
                          <span>{notificationModal.stats.item2}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setNotificationModal({ ...notificationModal, isOpen: false })}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 transition-all cursor-pointer"
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default IntegrationsHub;
