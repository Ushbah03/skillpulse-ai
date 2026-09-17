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
    description: ''
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
    if (activeFilter === 'HRIS') return item.type === 'hris';
    if (activeFilter === 'LMS') return item.type === 'lms';
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
          message: `Successfully ingested employee directory data into PostgreSQL database.`,
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
          message: `Ingested ${res.data?.createdCourses || 0} educational YouTube video courses into PostgreSQL catalog.`,
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
      console.warn('Failed to create integration hub in database:', err);
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
              Integrations & Enterprise Hubs
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Connect external HRIS directories, LMS catalogs, and SSO identity providers to your tenant.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Enterprise Hub
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTriggerGlobalSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 disabled:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 text-slate-400 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Synchronizing...' : 'Trigger Sync'}
            </motion.button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 overflow-x-auto">
          {['All', 'Connected', 'HRIS', 'LMS'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === filter 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-[#0F172A] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {filter === 'All' ? 'All Enterprise Connectors' : filter}
            </button>
          ))}
        </div>

        {/* Integration Hub Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold text-slate-400">Loading enterprise connectors from database...</p>
          </div>
        ) : filteredIntegrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((hub) => (
              <motion.div 
                key={hub.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl flex flex-col justify-between group hover:border-slate-700/80 transition-all"
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl border ${hub.iconColor}`}>
                      {hub.type === 'hris' && <Database className="w-6 h-6" />}
                      {hub.type === 'lms' && <Layers className="w-6 h-6" />}
                      {hub.type === 'auth' && <Key className="w-6 h-6" />}
                      {hub.type === 'api' && <Zap className="w-6 h-6" />}
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      hub.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      hub.status === 'Action Required' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        hub.status === 'Connected' ? 'bg-emerald-400' :
                        hub.status === 'Action Required' ? 'bg-amber-400 animate-pulse' :
                        'bg-slate-500'
                      }`} />
                      {hub.status}
                    </span>
                  </div>

                  {/* Hub Information */}
                  <h3 className="text-lg font-bold text-white mb-1">{hub.name}</h3>
                  <p className="text-xs text-indigo-400 font-semibold mb-3">{hub.category}</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{hub.description}</p>
                </div>

                {/* Footer Row */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{hub.lastSync}</span>
                  </div>

                  <button
                    onClick={() => handleOpenConfig(hub)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    Configure Hub
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 rounded-2xl bg-[#0F172A] border border-slate-800/80 text-center">
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Enterprise Connectors Configured</h3>
            <p className="text-sm text-slate-400 max-w-md mb-6">
              Connect external HRIS directories, LMS catalogs, SSO providers, or custom event webhooks to synchronize organizational data.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
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
              className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${selectedHub.iconColor}`}>
                    {selectedHub.type === 'hris' && <Database className="w-5 h-5" />}
                    {selectedHub.type === 'lms' && <Layers className="w-5 h-5" />}
                    {selectedHub.type === 'auth' && <Key className="w-5 h-5" />}
                    {selectedHub.type === 'api' && <Zap className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedHub.name}</h2>
                    <p className="text-xs text-slate-400">{selectedHub.category}</p>
                  </div>
                </div>
                <button onClick={() => setIsConfigModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">API Base Endpoint URL</label>
                  <input
                    type="text"
                    readOnly
                    value={`https://api.skillpulse.io/v1/connectors/${selectedHub.id}`}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Tenant Secret Access Key</label>
                  <input
                    type="password"
                    readOnly
                    value="sk_live_99481a8b9204c81a293f001"
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#1E293B]/50 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Automatic Sync Interval</p>
                    <p className="text-[11px] text-slate-400">Scheduled sync every 6 hours</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400">6 Hours</span>
                </div>

                {selectedHub.type === 'hris' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
                      <span>Live API Provider</span>
                      <span className="font-bold bg-blue-500/20 px-2 py-0.5 rounded text-[10px]">randomuser.me (Live REST API)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSyncHRIS}
                      disabled={isSyncing}
                      className="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Syncing HRIS Directory...' : 'Run Real HRIS Employee Directory Sync'}
                    </button>
                  </div>
                )}

                {selectedHub.type === 'lms' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
                      <span>Live API Provider</span>
                      <span className="font-bold bg-purple-500/20 px-2 py-0.5 rounded text-[10px]">YouTube Data API v3 (Live)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSyncLMS}
                      disabled={isSyncing}
                      className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Syncing LMS Catalog...' : 'Run Real LMS Course Catalog Sync'}
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleConnection(selectedHub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedHub.status === 'Connected' 
                      ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                  }`}
                >
                  {selectedHub.status === 'Connected' ? 'Disconnect Connector' : 'Connect Enterprise Hub'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  Save Configuration
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
              className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Configure New Enterprise Hub</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddHubSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Hub Name</label>
                  <input
                    type="text"
                    required
                    value={newHubData.name}
                    onChange={(e) => setNewHubData({ ...newHubData, name: e.target.value })}
                    placeholder="e.g. YouTube Educational LMS or Coursera Enterprise"
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={newHubData.category}
                      onChange={(e) => setNewHubData({ ...newHubData, category: e.target.value })}
                      placeholder="e.g. LMS Catalog"
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Connector Type</label>
                    <select
                      value={newHubData.type}
                      onChange={(e) => setNewHubData({ ...newHubData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="lms">LMS Video Catalog</option>
                      <option value="hris">HRIS System</option>
                      <option value="auth">SSO Identity Provider</option>
                      <option value="api">Custom API Webhook</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Endpoint / Playlist / Channel URL (Optional)</label>
                  <input
                    type="text"
                    value={newHubData.endpointUrl}
                    onChange={(e) => setNewHubData({ ...newHubData, endpointUrl: e.target.value })}
                    placeholder="e.g. https://www.youtube.com/playlist?list=..."
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">API Key / Token (Optional)</label>
                  <input
                    type="password"
                    value={newHubData.apiKey}
                    onChange={(e) => setNewHubData({ ...newHubData, apiKey: e.target.value })}
                    placeholder="Paste integration API key or OAuth token"
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newHubData.description}
                    onChange={(e) => setNewHubData({ ...newHubData, description: e.target.value })}
                    placeholder="Brief description of this connector..."
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-2"
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
              className="w-full max-w-md bg-[#0F172A] border border-indigo-500/30 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl border shrink-0 ${
                  notificationModal.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  notificationModal.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                  'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                }`}>
                  {notificationModal.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                  {notificationModal.type === 'error' && <AlertTriangle className="w-6 h-6" />}
                  {notificationModal.type === 'info' && <Zap className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{notificationModal.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{notificationModal.message}</p>

                  {notificationModal.stats && (
                    <div className="space-y-2 mb-4 p-3 rounded-xl bg-[#1E293B]/80 border border-slate-800 text-xs font-medium text-slate-300">
                      {notificationModal.stats.item1 && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{notificationModal.stats.item1}</span>
                        </div>
                      )}
                      {notificationModal.stats.item2 && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" />
                          <span>{notificationModal.stats.item2}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setNotificationModal({ ...notificationModal, isOpen: false })}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
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