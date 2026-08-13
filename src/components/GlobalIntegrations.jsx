import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cable, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  Key, 
  SlidersHorizontal, 
  X, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';

// Initial Mock Platform Integrations
const initialIntegrations = [
  {
    id: 'INT-01',
    name: 'Workday HRIS',
    category: 'HRIS & HCM',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80',
    status: 'Connected',
    activeTenants: 14,
    lastSync: '12 mins ago',
    description: 'Sync employee profiles, job architectures, and organizational hierarchies automatically.'
  },
  {
    id: 'INT-02',
    name: 'Cornerstone OnDemand',
    category: 'LMS / Learning',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    status: 'Connected',
    activeTenants: 9,
    lastSync: '1 hour ago',
    description: 'Bi-directional synchronization of learning course completions and skill assessment scores.'
  },
  {
    id: 'INT-03',
    name: 'Okta Identity Cloud',
    category: 'SSO & Identity',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    status: 'Connected',
    activeTenants: 22,
    lastSync: 'Active Realtime',
    description: 'Enterprise OAuth2 / SAML 2.0 Single Sign-On and automated user provisioning (SCIM).'
  },
  {
    id: 'INT-04',
    name: 'BambooHR',
    category: 'HRIS & HCM',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
    status: 'Disconnected',
    activeTenants: 0,
    lastSync: 'Never',
    description: 'Automated employee lifecycle tracking and departmental skill mapping.'
  },
  {
    id: 'INT-05',
    name: 'Microsoft Teams & Slack',
    category: 'Collaboration',
    logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&auto=format&fit=crop&q=80',
    status: 'Connected',
    activeTenants: 18,
    lastSync: 'Just now',
    description: 'AI nudges, skill growth alerts, and assessment notifications directly in messaging channels.'
  }
];

const GlobalIntegrations = () => {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  // Filter Logic
  const filteredIntegrations = integrations.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Toggle Connection Status
  const toggleConnection = (id) => {
    setIntegrations(integrations.map(item => {
      if (item.id === id) {
        const isConn = item.status === 'Connected';
        return {
          ...item,
          status: isConn ? 'Disconnected' : 'Connected',
          lastSync: isConn ? 'Never' : 'Just now'
        };
      }
      return item;
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Global Enterprise Connectors
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage platform-wide integrations for HRIS, LMS, Identity SSO, and API webhooks across all enterprise tenants.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedIntegration(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Custom Integration
          </motion.button>
        </div>

        {/* Integration Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Active Connectors</p>
            <p className="text-2xl font-extrabold text-white mt-1">
              {integrations.filter(i => i.status === 'Connected').length} / {integrations.length}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Total Tenant Connections</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {integrations.reduce((acc, curr) => acc + curr.activeTenants, 0)}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Sync Engine Health</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" /> 100% Operational
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Global API Rate Limit</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">10,000 req/min</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search integration connectors..."
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
                <option value="HRIS & HCM" className="bg-[#0F172A]">HRIS & HCM</option>
                <option value="LMS / Learning" className="bg-[#0F172A]">LMS / Learning</option>
                <option value="SSO & Identity" className="bg-[#0F172A]">SSO & Identity</option>
                <option value="Collaboration" className="bg-[#0F172A]">Collaboration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                      <Globe className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{item.name}</h3>
                      <span className="text-[11px] font-mono text-slate-400">{item.category}</span>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    item.status === 'Connected' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Connected' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 font-mono">
                  <span>Tenants Connected:</span>
                  <span className="text-indigo-400 font-bold">{item.activeTenants} Enterprise Tenants</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleConnection(item.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      item.status === 'Connected'
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    }`}
                  >
                    {item.status === 'Connected' ? 'Disconnect Platform' : 'Enable Connector'}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedIntegration(item);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </main>

      {/* Modal: Integration Settings / Add New */}
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
                      {selectedIntegration ? `${selectedIntegration.name} Configuration` : 'Register Custom Webhook Integration'}
                    </h2>
                    <p className="text-xs text-slate-400">Configure global OAuth parameters and endpoints.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Webhook / API Endpoint Base URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://api.workday.com/v1/skillpulse-sync"
                    defaultValue={selectedIntegration ? `https://api.${selectedIntegration.name.toLowerCase().replace(/\s+/g, '')}.com/v1` : ''}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Global OAuth2 Client ID</label>
                  <input
                    type="text"
                    required
                    placeholder="sp_client_live_99a8b7c6..."
                    defaultValue={selectedIntegration ? 'sp_client_live_99a8b7c6d5e4f3' : ''}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Client Secret Token</label>
                  <input
                    type="password"
                    required
                    value="••••••••••••••••••••••••••••••••"
                    readOnly
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    Save Connector Settings
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GlobalIntegrations;