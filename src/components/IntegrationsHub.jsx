import React, { useState } from 'react';
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
  Clock 
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';

// Initial Mock Connectors Data
const initialIntegrations = [
  {
    id: 'workday',
    name: 'Workday HRIS',
    category: 'HRIS System',
    type: 'hris',
    status: 'Connected',
    lastSync: '14 mins ago',
    iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Automated employee directory sync, org hierarchy mapping, and real-time onboarding data feed.'
  },
  {
    id: 'coursera',
    name: 'Coursera Enterprise',
    category: 'Learning System (LMS)',
    type: 'lms',
    status: 'Connected',
    lastSync: '1 hour ago',
    iconColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'Fetch global course catalogs, sync completion certificates, and track skill mastery credits.'
  },
  {
    id: 'azure-ad',
    name: 'Azure Active Directory',
    category: 'SSO & Identity Provider',
    type: 'auth',
    status: 'Action Required',
    lastSync: 'Expired SAML Cert',
    iconColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'SAML 2.0 Single Sign-On and automated user provisioning via SCIM protocol.'
  },
  {
    id: 'udemy',
    name: 'Udemy Business',
    category: 'Learning System (LMS)',
    type: 'lms',
    status: 'Disconnected',
    lastSync: 'Never',
    iconColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Ingest user learning activity streams and skill badge verifications directly into SkillPulse.'
  },
  {
    id: 'bamboohr',
    name: 'BambooHR',
    category: 'HRIS System',
    type: 'hris',
    status: 'Disconnected',
    lastSync: 'Never',
    iconColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Sync employee department rosters, manager hierarchies, and operational skill profiles.'
  },
  {
    id: 'custom-webhooks',
    name: 'Custom Webhooks',
    category: 'Event API Connector',
    type: 'api',
    status: 'Connected',
    lastSync: 'Live Stream Active',
    iconColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    description: 'Real-time JSON event dispatching for enterprise data warehouses and SIEM security logging.'
  }
];

const IntegrationsHub = () => {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedHub, setSelectedHub] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Filter Connectors
  const filteredIntegrations = integrations.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Connected') return item.status === 'Connected';
    if (activeFilter === 'HRIS') return item.type === 'hris';
    if (activeFilter === 'LMS') return item.type === 'lms';
    return true;
  });

  // Trigger Manual Global Sync Simulation
  const handleTriggerGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Global sync completed across all operational enterprise connectors.');
    }, 1800);
  };

  // Toggle Hub Connection State
  const toggleConnection = (id) => {
    setIntegrations(integrations.map(hub => {
      if (hub.id === id) {
        const nextStatus = hub.status === 'Connected' ? 'Disconnected' : 'Connected';
        return {
          ...hub,
          status: nextStatus,
          lastSync: nextStatus === 'Connected' ? 'Just now' : 'Never'
        };
      }
      return hub;
    }));
    if (selectedHub && selectedHub.id === id) {
      setIsConfigModalOpen(false);
    }
  };

  const handleOpenConfig = (hub) => {
    setSelectedHub(hub);
    setIsConfigModalOpen(true);
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTriggerGlobalSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronizing Enterprise Hubs...' : 'Trigger Instant Sync'}
          </motion.button>
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

    </div>
  );
};

export default IntegrationsHub;