import React, { useState } from 'react';
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
  AlertTriangle 
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';

// Initial Mock Tenants Data
const initialTenants = [
  {
    id: 'TEN-101',
    name: 'Acme Global Enterprises',
    domain: 'acmeglobal.com',
    tier: 'Enterprise AI',
    status: 'Active',
    allocatedSeats: 250,
    usedSeats: 184,
    adminEmail: 'alex.vance@acmeglobal.com',
    joinedDate: '2025-11-12',
    renewalDate: '2026-11-12',
    region: 'US-East (N. Virginia)'
  },
  {
    id: 'TEN-102',
    name: 'Nexus Tech Solutions',
    domain: 'nexustech.io',
    tier: 'Professional',
    status: 'Active',
    allocatedSeats: 100,
    usedSeats: 92,
    adminEmail: 'admin@nexustech.io',
    joinedDate: '2026-01-15',
    renewalDate: '2027-01-15',
    region: 'EU-Central (Frankfurt)'
  },
  {
    id: 'TEN-103',
    name: 'Apex Financial Services',
    domain: 'apexfin.com',
    tier: 'Enterprise AI',
    status: 'Payment Past Due',
    allocatedSeats: 500,
    usedSeats: 410,
    adminEmail: 'compliance@apexfin.com',
    joinedDate: '2025-08-20',
    renewalDate: '2026-08-20',
    region: 'US-West (Oregon)'
  },
  {
    id: 'TEN-104',
    name: 'Vanguard Health Systems',
    domain: 'vanguardhealth.org',
    tier: 'Starter',
    status: 'Suspended',
    allocatedSeats: 50,
    usedSeats: 48,
    adminEmail: 'ops@vanguardhealth.org',
    joinedDate: '2026-03-10',
    renewalDate: '2026-09-10',
    region: 'US-East (N. Virginia)'
  }
];

const TenantManagement = () => {
  const [tenants, setTenants] = useState(initialTenants);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for Onboarding Tenant
  const [newTenant, setNewTenant] = useState({
    name: '',
    domain: '',
    tier: 'Enterprise AI',
    allocatedSeats: 100,
    adminEmail: '',
    region: 'US-East (N. Virginia)'
  });

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
  const handleCreateTenant = (e) => {
    e.preventDefault();
    const created = {
      ...newTenant,
      id: `TEN-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Active',
      usedSeats: 1,
      joinedDate: new Date().toISOString().split('T')[0],
      renewalDate: '2027-08-13'
    };
    setTenants([created, ...tenants]);
    setIsModalOpen(false);
    setNewTenant({
      name: '',
      domain: '',
      tier: 'Enterprise AI',
      allocatedSeats: 100,
      adminEmail: '',
      region: 'US-East (N. Virginia)'
    });
  };

  // Toggle Tenant Status (Active / Suspended)
  const toggleTenantStatus = (id) => {
    setTenants(tenants.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'Suspended' ? 'Active' : 'Suspended'
        };
      }
      return t;
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
              Tenant & Organization Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Onboard new client companies, adjust seat quotas, manage SLA tiers, and monitor tenant health.
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
            <p className="text-xs text-slate-400 font-medium">Suspended / Past Due</p>
            <p className="text-2xl font-extrabold text-rose-400 mt-1">
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
                <option value="Payment Past Due" className="bg-[#0F172A]">Payment Past Due</option>
                <option value="Suspended" className="bg-[#0F172A]">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table */}
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
                          tenant.status === 'Payment Past Due' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            tenant.status === 'Active' ? 'bg-emerald-400' :
                            tenant.status === 'Payment Past Due' ? 'bg-amber-400 animate-pulse' :
                            'bg-rose-400'
                          }`} />
                          {tenant.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-300 font-mono">
                        {tenant.adminEmail}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleTenantStatus(tenant.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            tenant.status === 'Suspended'
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                          }`}
                        >
                          {tenant.status === 'Suspended' ? 'Activate Tenant' : 'Suspend Access'}
                        </button>
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

      </main>

      {/* Onboard New Tenant Modal */}
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
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Onboard New Client Tenant</h2>
                    <p className="text-xs text-slate-400">Configure a isolated tenant workspace.</p>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">SLA Subscription Tier</label>
                    <select
                      value={newTenant.tier}
                      onChange={(e) => setNewTenant({ ...newTenant, tier: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Enterprise AI">Enterprise AI</option>
                      <option value="Professional">Professional</option>
                      <option value="Starter">Starter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Max Seat License Limit</label>
                    <input
                      type="number"
                      required
                      min="10"
                      max="10000"
                      value={newTenant.allocatedSeats}
                      onChange={(e) => setNewTenant({ ...newTenant, allocatedSeats: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
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
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    Confirm Onboarding
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

export default TenantManagement;