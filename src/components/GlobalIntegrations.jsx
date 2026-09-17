import React, { useState, useEffect } from 'react';
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
  Loader2
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
    <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/30 flex items-center justify-center shrink-0">
      <CreditCard className="w-6 h-6 text-[#635BFF]" />
    </div>
  );
  if (icon === 'google' || name?.toLowerCase().includes('google')) return (
    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
      <ShieldCheck className="w-6 h-6 text-red-400" />
    </div>
  );
  return (
    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
      <Globe className="w-6 h-6 text-indigo-400" />
    </div>
  );
};

const GlobalIntegrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [rateLimit, setRateLimit] = useState('10,000');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  
  // Form fields for new integration
  const [newIntegrationName, setNewIntegrationName] = useState('');
  const [newIntegrationCategory, setNewIntegrationCategory] = useState('HRIS & HCM');
  const [newEndpointUrl, setNewEndpointUrl] = useState('');
  const [newClientId, setNewClientId] = useState('');

  const [dangerModal, setDangerModal] = useState(null); // { integration } when danger confirm is open
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

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

  const filteredIntegrations = integrations.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
    if (item.type === 'platform' && item.status === 'Connected') {
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
  const platformCount = integrations.filter(i => i.type === 'platform').length;
  const healthPercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 100;

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 ml-64 p-8 w-full font-sans">
        
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Active Connectors</p>
            <p className="text-2xl font-extrabold text-white mt-1">
              {activeCount} / {totalCount}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Platform Integrations</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {platformCount} <span className="text-xs font-normal text-slate-500">core</span>
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Sync Engine Health</p>
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
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Global API Rate Limit</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">
              {rateLimit} <span className="text-sm font-normal text-slate-400">req/min</span>
            </p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search connectors..."
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
            {filteredIntegrations.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                className={`p-6 rounded-2xl border shadow-xl flex flex-col justify-between relative ${
                  item.type === 'platform'
                    ? 'bg-[#0F172A] border-indigo-500/20'
                    : 'bg-[#0F172A] border-slate-800/80'
                }`}
              >
                {item.type === 'platform' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-full">
                    <Lock className="w-2.5 h-2.5" /> PLATFORM CORE
                  </div>
                )}

                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <ConnectorIcon icon={item.icon} name={item.name} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base truncate pr-24">{item.name}</h3>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${CATEGORY_COLORS[item.category] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>

                  {item.details && item.details.length > 0 && (
                    <div className="bg-[#1E293B] rounded-xl p-3 space-y-2 mb-4">
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
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4 font-mono">
                    <span>Tenants Connected:</span>
                    <span className="text-indigo-400 font-bold">{item.activeTenants}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleConnection(item)}
                      disabled={updatingId === item.id}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                        item.status === 'Connected'
                          ? item.type === 'platform'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      }`}
                    >
                      {updatingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : item.status === 'Connected' ? (
                        item.type === 'platform' ? '⚡ Live & Active — Click to Disconnect' : 'Disconnect'
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
            ))}

            {filteredIntegrations.length === 0 && (
              <div className="col-span-3 p-12 text-center rounded-2xl bg-[#0F172A] border border-slate-800/80">
                <Cable className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Connectors Match</h3>
                <p className="text-xs text-slate-400 mt-1">Try a different category or search term.</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal */}
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
                      {selectedIntegration?.type === 'platform' ? 'Edit platform-level connector configuration.' : 'Configure global OAuth parameters and endpoints.'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedIntegration ? (
                <div className="mt-5 space-y-3">
                  {selectedIntegration.details && selectedIntegration.details.map((d, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold uppercase text-slate-400">{d.label}</label>
                      <input
                        type="text"
                        readOnly
                        defaultValue={d.value}
                        className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  ))}
                  <div className="mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-300">
                      {selectedIntegration.id === 'stripe-global' || selectedIntegration.name?.includes('Stripe')
                        ? 'Stripe Webhooks will become fully automatic once deployed to a public HTTPS URL. For local testing, use Stripe CLI.'
                        : selectedIntegration.name?.includes('Google')
                        ? 'To add more Authorized Origins, update your GCP Console → OAuth 2.0 Client → Authorized JavaScript Origins.'
                        : 'Integration configuration is stored and synchronized live via the SkillPulse database engine.'}
                    </p>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors">
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
                  {(dangerModal.id === 'stripe-global' || dangerModal.name?.includes('Stripe')) && <>
                    <li className="flex items-center gap-2">⛔ All tenant subscription payments will stop processing</li>
                    <li className="flex items-center gap-2">⛔ Plan upgrade/downgrade flows will break for all companies</li>
                    <li className="flex items-center gap-2">⛔ Stripe webhooks will no longer update plan status</li>
                  </>}
                  {(dangerModal.id === 'google-sso-global' || dangerModal.name?.includes('Google')) && <>
                    <li className="flex items-center gap-2">⛔ All users using Google Sign-In will be locked out</li>
                    <li className="flex items-center gap-2">⛔ "Sign in with Google" button will stop working platform-wide</li>
                    <li className="flex items-center gap-2">⛔ Auto-provisioned Google accounts will lose access</li>
                  </>}
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