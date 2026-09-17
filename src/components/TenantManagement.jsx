import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  CreditCard, 
  Globe, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Copy,
  Check,
  Key,
  Lock,
  RefreshCw
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const PLAN_MAP = {
  STARTER: 'Starter',
  PRO: 'Professional',
  ENTERPRISE: 'Enterprise AI'
};

const PLAN_REVERSE = {
  'Starter': 'STARTER',
  'Professional': 'PRO',
  'Enterprise AI': 'ENTERPRISE'
};

const STATUS_MAP = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  TRIAL: 'Trial',
  PENDING_PAYMENT: 'Payment Pending'
};

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form State for Onboarding Tenant
  const [newTenant, setNewTenant] = useState({
    name: '',
    domain: '',
    tier: 'Enterprise AI',
    allocatedSeats: 1000,
    adminEmail: '',
    adminPassword: 'AdminPass2026!',
    authMethod: 'STANDARD', // 'STANDARD' | 'GOOGLE_SSO'
    adminFirstName: 'Company',
    adminLastName: 'Admin',
    region: 'US-East (N. Virginia)'
  });

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewTenant(prev => ({ ...prev, adminPassword: pass }));
  };

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getTenants();
      if (res?.success) {
        const mapped = res.data.map(t => ({
          id: `TEN-${t.id.slice(-4).toUpperCase()}`,
          rawId: t.id,
          name: t.name,
          domain: t.domain || `${t.slug}.com`,
          tier: PLAN_MAP[t.plan] || 'Professional',
          status: STATUS_MAP[t.status] || 'Active',
          rawStatus: t.status,
          allocatedSeats: t.maxUsers || 500,
          usedSeats: t._count?.users || 0,
          adminEmail: t.adminEmail || 'admin@' + (t.domain || `${t.slug}.com`),
          joinedDate: new Date(t.createdAt).toISOString().split('T')[0],
          renewalDate: new Date(new Date(t.createdAt).setFullYear(new Date(t.createdAt).getFullYear() + 1)).toISOString().split('T')[0],
          region: t.region || 'US-East (N. Virginia)'
        }));
        setTenants(mapped);
      }
    } catch (err) {
      console.warn('Failed to load tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Filter Tenants
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = tierFilter === 'All' || tenant.tier === tierFilter;
    const matchesStatus = statusFilter === 'All' || tenant.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Create New Tenant Handler
  const handleCreateTenant = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = newTenant.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const res = await adminAPI.createTenant({
        name: newTenant.name,
        slug,
        domain: newTenant.domain,
        plan: PLAN_REVERSE[newTenant.tier] || 'PRO',
        maxUsers: parseInt(newTenant.allocatedSeats),
        adminEmail: newTenant.adminEmail,
        adminPassword: newTenant.adminPassword,
        authMethod: newTenant.authMethod,
        adminFirstName: newTenant.adminFirstName,
        adminLastName: newTenant.adminLastName
      });
      if (res?.success) {
        setIsModalOpen(false);
        if (res.adminCredentials) {
          setCreatedCredentials({
            tenantName: res.data?.name || newTenant.name,
            tenantId: res.data?.id,
            email: res.adminCredentials.email,
            password: res.adminCredentials.password,
            authMethod: res.adminCredentials.authMethod,
            status: 'PENDING_PAYMENT'
          });
        }
        setNewTenant({
          name: '',
          domain: '',
          tier: 'Enterprise AI',
          allocatedSeats: 1000,
          adminEmail: '',
          adminPassword: 'AdminPass2026!',
          authMethod: 'STANDARD',
          adminFirstName: 'Company',
          adminLastName: 'Admin',
          region: 'US-East (N. Virginia)'
        });
        fetchTenants();
      }
    } catch (err) {
      console.warn('Failed to create tenant:', err);
    } finally {
      setSaving(false);
    }
  };

  // Change Tenant Status (ACTIVE, SUSPENDED, PENDING_PAYMENT)
  const changeTenantStatus = async (id, newStatus) => {
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) return;
    try {
      await adminAPI.updateTenant(tenant.rawId, { status: newStatus });
      fetchTenants();
    } catch (err) {
      console.warn('Failed to update tenant status:', err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 ml-64 p-8 w-full font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Tenant &amp; Organization Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Onboard new client companies, adjust seat quotas, manage SLA tiers, and control payment activation.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Onboard New Tenant
          </motion.button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Total Registered Tenants</p>
            <p className="text-2xl font-extrabold text-white mt-1">{tenants.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Active Subscriptions</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              {tenants.filter(t => t.status === 'Active').length}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Total Provisioned Seats</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {tenants.reduce((acc, curr) => acc + Number(curr.allocatedSeats), 0)}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Pending Payment / Suspended</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">
              {tenants.filter(t => t.status !== 'Active').length}
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, domain, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>SLA Tier:</span>
              <select 
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Tiers</option>
                <option value="Enterprise AI" className="bg-[#0F172A]">Enterprise AI</option>
                <option value="Professional" className="bg-[#0F172A]">Professional</option>
                <option value="Starter" className="bg-[#0F172A]">Starter</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <span>Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Statuses</option>
                <option value="Active" className="bg-[#0F172A]">Active</option>
                <option value="Payment Pending" className="bg-[#0F172A]">Payment Pending</option>
                <option value="Suspended" className="bg-[#0F172A]">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0F172A] border border-slate-800/80 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-400 mt-3">Fetching client environments from database...</p>
          </div>
        ) : (
        /* Directory Table */
        <div className="rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#1E293B]/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Tenant / Domain</th>
                  <th className="px-6 py-4">SLA Plan Tier</th>
                  <th className="px-6 py-4">Seat Utilization</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Primary Admin</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              {tenant.name}
                              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                {tenant.id}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Globe className="w-3 h-3 text-slate-500" />
                              {tenant.domain}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <CreditCard className="w-3 h-3" />
                          {tenant.tier}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-36">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-200">{tenant.usedSeats} / {tenant.allocatedSeats}</span>
                            <span className="text-slate-400 text-[11px]">{Math.round((tenant.usedSeats / tenant.allocatedSeats) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                (tenant.usedSeats / tenant.allocatedSeats) > 0.9 ? 'bg-amber-400' : 'bg-indigo-500'
                              }`} 
                              style={{ width: `${(tenant.usedSeats / tenant.allocatedSeats) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          tenant.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          tenant.status === 'Payment Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            tenant.status === 'Active' ? 'bg-emerald-400' :
                            tenant.status === 'Payment Pending' ? 'bg-amber-400 animate-pulse' :
                            'bg-rose-400'
                          }`} />
                          {tenant.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-300 font-mono">
                        {tenant.adminEmail}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {tenant.status === 'Payment Pending' && (
                            <button
                              onClick={() => changeTenantStatus(tenant.id, 'ACTIVE')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1"
                              title="Clear payment & enable portal access"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Clear Payment &amp; Activate
                            </button>
                          )}

                          {tenant.status === 'Active' && (
                            <button
                              onClick={() => changeTenantStatus(tenant.id, 'SUSPENDED')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                            >
                              Suspend Access
                            </button>
                          )}

                          {tenant.status === 'Suspended' && (
                            <button
                              onClick={() => changeTenantStatus(tenant.id, 'ACTIVE')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all"
                            >
                              Resume Access
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-500">
                      No client tenants match the active filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

      </main>

      {/* Onboard New Tenant Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Onboard New Client Tenant</h2>
                    <p className="text-xs text-slate-400">Configure isolated tenant workspace &amp; admin access.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTenant} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Domain</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. acme.com"
                      value={newTenant.domain}
                      onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Primary Admin Email</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@acme.com"
                      value={newTenant.adminEmail}
                      onChange={(e) => setNewTenant({ ...newTenant, adminEmail: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Auth Provider Toggle */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Admin Authentication Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewTenant({ ...newTenant, authMethod: 'STANDARD' })}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        newTenant.authMethod === 'STANDARD'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-[#1E293B] border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5" />
                      Standard Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewTenant({ ...newTenant, authMethod: 'GOOGLE_SSO' })}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        newTenant.authMethod === 'GOOGLE_SSO'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-[#1E293B] border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Google SSO
                    </button>
                  </div>
                </div>

                {/* Password field if Standard Auth */}
                {newTenant.authMethod === 'STANDARD' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold uppercase text-slate-400">Initial Admin Password</label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={newTenant.adminPassword}
                      onChange={(e) => setNewTenant({ ...newTenant, adminPassword: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">SLA Subscription Tier</label>
                    <select
                      value={newTenant.tier}
                      onChange={(e) => {
                        const selectedTier = e.target.value;
                        const defaultSeats = selectedTier === 'Starter' ? 30 : selectedTier === 'Professional' ? 250 : 1000;
                        setNewTenant({ ...newTenant, tier: selectedTier, allocatedSeats: defaultSeats });
                      }}
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-semibold"
                    >
                      <option value="Enterprise AI">Enterprise AI (1000 Seats)</option>
                      <option value="Professional">Professional (250 Seats)</option>
                      <option value="Starter">Starter (30 Seats)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Max Seat License Limit</label>
                    <div className="w-full px-3.5 py-2.5 bg-[#1E293B]/70 border border-slate-700/60 rounded-xl text-xs font-black text-indigo-400 flex items-center justify-between">
                      <span>{newTenant.allocatedSeats} Seats</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preset Limit</span>
                    </div>
                  </div>
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
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Confirm Onboarding
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal with Admin Credentials & Payment Warning */}
      <AnimatePresence>
        {createdCredentials && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Tenant Onboarded!</h2>
                  <p className="text-xs text-amber-400 font-medium flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Initial Status: PENDING_PAYMENT
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Tenant Workspace</p>
                    <p className="text-sm font-bold text-white">{createdCredentials.tenantName}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Primary Admin Email</p>
                    <p className="text-xs font-mono text-indigo-300 mt-0.5">{createdCredentials.email}</p>
                  </div>

                  {createdCredentials.authMethod === 'STANDARD' ? (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase">Initial Admin Password</p>
                      <div className="flex items-center justify-between mt-1 p-2 bg-[#1E293B] rounded-lg border border-slate-700 font-mono text-xs text-emerald-400">
                        <span>{createdCredentials.password}</span>
                        <button 
                          onClick={() => copyToClipboard(createdCredentials.password)}
                          className="text-slate-400 hover:text-white transition-colors p-1"
                          title="Copy Password"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-300">
                      Primary admin will log in using Google Single Sign-On (SSO).
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Portal Access Block Active</span>
                    This tenant status is set to <span className="font-bold underline">PENDING_PAYMENT</span>. Until payment is cleared by Super Admin or completed online, no employees or admins can access their portal.
                  </div>
                </div>

                <button
                  onClick={() => setCreatedCredentials(null)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                >
                  Done &amp; Return to Directory
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TenantManagement;