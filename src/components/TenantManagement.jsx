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
  RefreshCw,
  Edit3,
  Users,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
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

  // Edit Tenant State
  const [editingTenant, setEditingTenant] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    domain: '',
    tier: 'Professional',
    maxUsers: 250,
    status: 'ACTIVE'
  });
  const [updatingTenant, setUpdatingTenant] = useState(false);

  // Form State for Onboarding Tenant
  const [newTenant, setNewTenant] = useState({
    name: '',
    domain: '',
    tier: 'Enterprise AI',
    allocatedSeats: 1000,
    adminEmail: '',
    adminPassword: 'AdminPass2026!',
    authMethod: 'STANDARD',
    adminFirstName: 'Company',
    adminLastName: 'Admin'
  });

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getTenants();
      if (res?.success && Array.isArray(res.data)) {
        const mapped = res.data.map(t => ({
          id: t.id,
          name: t.name,
          domain: t.domain || 'enterprise.com',
          tier: PLAN_MAP[t.plan] || t.plan,
          rawPlan: t.plan,
          status: STATUS_MAP[t.status] || t.status,
          rawStatus: t.status,
          seats: `${t.userCount || 0} / ${t.maxUsers || 100}`,
          usedSeats: t.userCount || 0,
          totalSeats: t.maxUsers || 100,
          adminEmail: t.users?.[0]?.email || 'admin@tenant.com',
          adminName: t.users?.[0]?.name || 'Primary Admin',
          authProvider: t.authMethod || 'STANDARD',
          departmentsCount: t.departments?.length || 0,
          createdAt: t.createdAt
        }));
        setTenants(mapped);
      }
    } catch (err) {
      console.warn('Failed to load real tenants from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: newTenant.name,
        domain: newTenant.domain,
        plan: PLAN_REVERSE[newTenant.tier] || 'ENTERPRISE',
        maxUsers: Number(newTenant.allocatedSeats),
        adminEmail: newTenant.adminEmail,
        adminPassword: newTenant.adminPassword,
        authMethod: newTenant.authMethod,
        adminFirstName: newTenant.adminFirstName || 'Company',
        adminLastName: newTenant.adminLastName || 'Admin'
      };

      const res = await adminAPI.createTenant(payload);
      if (res?.success) {
        setCreatedCredentials({
          tenantName: newTenant.name,
          email: newTenant.adminEmail,
          password: newTenant.adminPassword,
          authMethod: newTenant.authMethod,
          tenantId: res.data?.id
        });

        setIsModalOpen(false);
        setNewTenant({
          name: '',
          domain: '',
          tier: 'Enterprise AI',
          allocatedSeats: 1000,
          adminEmail: '',
          adminPassword: 'AdminPass2026!',
          authMethod: 'STANDARD',
          adminFirstName: 'Company',
          adminLastName: 'Admin'
        });
        fetchTenants();
      }
    } catch (err) {
      console.warn('Failed to onboard new tenant in database:', err);
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (tenant) => {
    setEditingTenant(tenant);
    setEditForm({
      name: tenant.name,
      domain: tenant.domain,
      tier: tenant.tier,
      maxUsers: tenant.totalSeats,
      status: tenant.rawStatus
    });
  };

  // Save Tenant Edits
  const handleSaveTenantEdits = async (e) => {
    e.preventDefault();
    if (!editingTenant) return;
    setUpdatingTenant(true);
    try {
      const payload = {
        name: editForm.name,
        domain: editForm.domain,
        plan: PLAN_REVERSE[editForm.tier] || 'PRO',
        maxUsers: Number(editForm.maxUsers),
        status: editForm.status
      };

      const res = await adminAPI.updateTenant(editingTenant.id, payload);
      if (res?.success) {
        setEditingTenant(null);
        fetchTenants();
      }
    } catch (err) {
      console.warn('Failed to update tenant configuration:', err);
    } finally {
      setUpdatingTenant(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = 'SP-';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += '!';
    setNewTenant({ ...newTenant, adminPassword: pass });
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tenant.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'All' || tenant.tier === tierFilter;
    const matchesStatus = statusFilter === 'All' || tenant.status === statusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalSeatsAllocated = tenants.reduce((acc, curr) => acc + Number(curr.totalSeats), 0);
  const totalSeatsUsed = tenants.reduce((acc, curr) => acc + Number(curr.usedSeats), 0);
  const activeTenantsCount = tenants.filter(t => t.rawStatus === 'ACTIVE').length;
  const pendingOrSuspendedCount = tenants.filter(t => t.rawStatus !== 'ACTIVE').length;

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

      <SuperadminSidebar activeItem="tenants" />

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 relative z-10 space-y-8">
        
        {/* Header */}
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E]">
                Tenant &amp; <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Organization Management</span>
              </h1>
              <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-white/80 text-[#1988A3] border border-white/90 shadow-xs">
                {tenants.length} Workspaces
              </span>
            </div>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium mt-1.5 ml-12">
              Onboard client workspaces, adjust seat quotas, configure SLA tiers, and monitor live PostgreSQL tenant environments.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Onboard New Tenant
          </motion.button>
        </header>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          
          {/* Metric 1 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Total Workspaces</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#17233E] tracking-tight">{tenants.length}</p>
            <p className="text-[11px] text-[#8A9CB7] mt-2 font-semibold">
              <span className="text-[#1988A3] font-bold">{totalSeatsUsed} active users</span> across organizations
            </p>
          </motion.div>

          {/* Metric 2 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Active Workspaces</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">{activeTenantsCount}</p>
            <p className="text-[11px] text-[#8A9CB7] mt-2 font-semibold">
              Operational &amp; verified SLA access
            </p>
          </motion.div>

          {/* Metric 3 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Allocated Seats</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-purple-600 shadow-sm">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#17233E] tracking-tight">{totalSeatsAllocated.toLocaleString()}</p>
            <p className="text-[11px] text-[#8A9CB7] mt-2 font-semibold">
              <span className="text-purple-600 font-bold">{totalSeatsUsed} consumed</span> ({totalSeatsAllocated > 0 ? Math.round((totalSeatsUsed / totalSeatsAllocated) * 100) : 0}% utilization)
            </p>
          </motion.div>

          {/* Metric 4 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-amber-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Pending / Suspended</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-amber-600 shadow-sm">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-amber-600 tracking-tight">{pendingOrSuspendedCount}</p>
            <p className="text-[11px] text-[#8A9CB7] mt-2 font-semibold">
              {tenants.filter(t => t.rawStatus === 'PENDING_PAYMENT').length} pending payment • {tenants.filter(t => t.rawStatus === 'SUSPENDED').length} suspended
            </p>
          </motion.div>

        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9CB7]" />
            <input
              type="text"
              placeholder="Search by workspace, domain, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 text-[#17233E] border border-white/90 rounded-2xl text-sm focus:outline-none focus:border-[#1988A3] transition-colors placeholder:text-[#8A9CB7] shadow-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-between md:justify-end">
            <div className="flex items-center gap-2 bg-white/80 border border-white/90 px-3 py-1.5 rounded-2xl text-xs text-[#17233E] shadow-sm">
              <Filter className="w-3.5 h-3.5 text-[#1988A3]" />
              <span className="font-semibold">SLA Tier:</span>
              <select 
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Tiers</option>
                <option value="Enterprise AI">Enterprise AI</option>
                <option value="Professional">Professional</option>
                <option value="Starter">Starter</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white/80 border border-white/90 px-3 py-1.5 rounded-2xl text-xs text-[#17233E] shadow-sm">
              <span className="font-semibold">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Payment Pending">Payment Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <SkillPulseLoader message="Fetching real client environments from PostgreSQL database..." fullScreen={false} />
        ) : (
        /* Directory Table */
        <div className="rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#17233E]">
              <thead className="bg-[#17233E]/10 text-xs font-bold uppercase tracking-wider text-[#17233E] border-b border-white/60">
                <tr>
                  <th className="px-6 py-4">Workspace &amp; Domain</th>
                  <th className="px-6 py-4">SLA Plan Tier</th>
                  <th className="px-6 py-4">Seat Utilization</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Primary Administrator</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-white/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-xs group-hover:scale-105 transition-transform">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-[#17233E] flex items-center gap-2">
                              {tenant.name}
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-white/70 text-[#8A9CB7] border border-white/80">
                                {tenant.id}
                              </span>
                            </div>
                            <div className="text-xs text-[#8A9CB7] flex items-center gap-2 mt-0.5 font-medium">
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3 text-[#1988A3]" />
                                {tenant.domain}
                              </span>
                              <span>•</span>
                              <span>{tenant.departmentsCount} Depts</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-xs ${
                          tenant.tier === 'Enterprise AI'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : tenant.tier === 'Professional'
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                            : 'bg-white/80 text-[#17233E] border-white/90'
                        }`}>
                          <CreditCard className="w-3 h-3 text-[#1988A3]" />
                          {tenant.tier}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-[#1B3154]/10 h-2.5 rounded-full overflow-hidden p-0.5">
                            <div 
                              className={`h-full rounded-full ${
                                (tenant.usedSeats / tenant.totalSeats) > 0.85 ? 'bg-amber-500' : 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE]'
                              }`}
                              style={{ width: `${Math.max(4, Math.min(100, (tenant.usedSeats / tenant.totalSeats) * 100))}%` }} 
                            />
                          </div>
                          <span className="font-mono text-xs font-extrabold text-[#17233E]">{tenant.seats}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${
                          tenant.rawStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : tenant.rawStatus === 'PENDING_PAYMENT'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            tenant.rawStatus === 'ACTIVE' ? 'bg-emerald-600' : tenant.rawStatus === 'PENDING_PAYMENT' ? 'bg-amber-600 animate-pulse' : 'bg-rose-600'
                          }`} />
                          {tenant.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-[#17233E]">
                        <p className="font-bold">{tenant.adminName}</p>
                        <p className="text-[11px] text-[#8A9CB7] font-mono">{tenant.adminEmail}</p>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openEditModal(tenant)}
                          className="px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#1988A3] border border-white/85 text-xs font-bold shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Configure
                        </motion.button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-[#8A9CB7] font-medium">
                      No tenant workspaces match the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

      </main>

      {/* Edit Tenant Modal */}
      <AnimatePresence>
        {editingTenant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/85 rounded-3xl shadow-2xl p-6 md:p-8 text-[#17233E]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/80 text-[#1988A3] border border-white/90 shadow-xs">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#17233E]">Edit Tenant Configuration</h2>
                    <p className="text-xs text-[#8A9CB7] font-semibold">{editingTenant.name} ({editingTenant.id})</p>
                  </div>
                </div>
                <button onClick={() => setEditingTenant(null)} className="p-1 rounded-xl text-[#8A9CB7] hover:text-[#17233E] hover:bg-white/60 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTenantEdits} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Company Legal Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Domain / Subdomain</label>
                    <input
                      type="text"
                      value={editForm.domain}
                      onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer font-bold shadow-xs"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">SLA Subscription Tier</label>
                    <select
                      value={editForm.tier}
                      onChange={(e) => {
                        const selectedTier = e.target.value;
                        const defaultSeats = selectedTier === 'Starter' ? 30 : selectedTier === 'Professional' ? 250 : 1000;
                        setEditForm({ ...editForm, tier: selectedTier, maxUsers: defaultSeats });
                      }}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer font-bold shadow-xs"
                    >
                      <option value="Enterprise AI">Enterprise AI (1000 Seats)</option>
                      <option value="Professional">Professional (250 Seats)</option>
                      <option value="Starter">Starter (30 Seats)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Max Seat License Limit</label>
                    <input
                      type="number"
                      min={editingTenant.usedSeats}
                      required
                      value={editForm.maxUsers}
                      onChange={(e) => setEditForm({ ...editForm, maxUsers: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] font-mono font-bold shadow-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/60 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingTenant(null)}
                    className="px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-[#17233E] text-xs font-bold transition-colors cursor-pointer border border-white/85 shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingTenant}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 cursor-pointer"
                  >
                    {updatingTenant && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Configuration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Onboard New Tenant Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/85 rounded-3xl shadow-2xl p-6 md:p-8 text-[#17233E]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/80 text-[#1988A3] border border-white/90 shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#17233E]">Onboard New Client Tenant</h2>
                    <p className="text-xs text-[#8A9CB7] font-semibold">Configure isolated tenant workspace &amp; admin access in PostgreSQL.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-[#8A9CB7] hover:text-[#17233E] hover:bg-white/60 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTenant} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Company Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs placeholder:text-[#8A9CB7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Domain / Subdomain</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. acme"
                      value={newTenant.domain}
                      onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs placeholder:text-[#8A9CB7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Primary Admin Email</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@acme.com"
                      value={newTenant.adminEmail}
                      onChange={(e) => setNewTenant({ ...newTenant, adminEmail: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs placeholder:text-[#8A9CB7]"
                    />
                  </div>
                </div>

                {/* Auth Provider Toggle */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-2">Admin Authentication Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewTenant({ ...newTenant, authMethod: 'STANDARD' })}
                      className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                        newTenant.authMethod === 'STANDARD'
                          ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white border-transparent shadow-md shadow-[#1988A3]/25'
                          : 'bg-white/80 border-white/90 text-[#17233E] hover:bg-white'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5" />
                      Standard Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewTenant({ ...newTenant, authMethod: 'GOOGLE_SSO' })}
                      className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                        newTenant.authMethod === 'GOOGLE_SSO'
                          ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white border-transparent shadow-md shadow-[#1988A3]/25'
                          : 'bg-white/80 border-white/90 text-[#17233E] hover:bg-white'
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
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Initial Admin Password</label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[11px] text-[#1988A3] hover:text-[#157289] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={newTenant.adminPassword}
                      onChange={(e) => setNewTenant({ ...newTenant, adminPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs font-mono font-bold text-[#1988A3] focus:outline-none focus:border-[#1988A3] shadow-xs"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">SLA Subscription Tier</label>
                    <select
                      value={newTenant.tier}
                      onChange={(e) => {
                        const selectedTier = e.target.value;
                        const defaultSeats = selectedTier === 'Starter' ? 30 : selectedTier === 'Professional' ? 250 : 1000;
                        setNewTenant({ ...newTenant, tier: selectedTier, allocatedSeats: defaultSeats });
                      }}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer font-bold shadow-xs"
                    >
                      <option value="Enterprise AI">Enterprise AI (1000 Seats)</option>
                      <option value="Professional">Professional (250 Seats)</option>
                      <option value="Starter">Starter (30 Seats)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Max Seat License Limit</label>
                    <div className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs font-black text-[#1988A3] flex items-center justify-between shadow-xs">
                      <span>{newTenant.allocatedSeats} Seats</span>
                      <span className="text-[10px] font-bold text-[#8A9CB7] uppercase tracking-wider">Preset Limit</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/60 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-[#17233E] text-xs font-bold transition-colors cursor-pointer border border-white/85 shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/85 rounded-3xl shadow-2xl p-6 md:p-8 text-[#17233E]"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-white/60">
                <div className="p-2.5 rounded-2xl bg-white/80 text-emerald-600 border border-white/90 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#17233E]">Tenant Workspace Onboarded!</h2>
                  <p className="text-xs text-amber-700 font-bold flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Status: PENDING_PAYMENT
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-white/80 border border-white/90 space-y-3 shadow-xs">
                  <div>
                    <p className="text-[11px] font-bold text-[#8A9CB7] uppercase tracking-wider">Tenant Workspace</p>
                    <p className="text-sm font-extrabold text-[#17233E]">{createdCredentials.tenantName}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-[#8A9CB7] uppercase tracking-wider">Primary Admin Email</p>
                    <p className="text-xs font-mono font-semibold text-[#1988A3] mt-0.5">{createdCredentials.email}</p>
                  </div>

                  {createdCredentials.authMethod === 'STANDARD' ? (
                    <div>
                      <p className="text-[11px] font-bold text-[#8A9CB7] uppercase tracking-wider">Initial Admin Password</p>
                      <div className="flex items-center justify-between mt-1 p-2.5 bg-white/90 rounded-xl border border-white font-mono text-xs text-emerald-700 font-bold shadow-2xs">
                        <span>{createdCredentials.password}</span>
                        <button 
                          onClick={() => copyToClipboard(createdCredentials.password)}
                          className="text-[#8A9CB7] hover:text-[#17233E] transition-colors p-1 cursor-pointer"
                          title="Copy Password"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-700 font-semibold">
                      Primary admin will log in using Google Single Sign-On (SSO).
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs leading-relaxed flex items-start gap-2.5 shadow-2xs">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block mb-0.5">Portal Access Block Active</span>
                    This tenant status is set to <span className="font-extrabold underline">PENDING_PAYMENT</span>. Until payment is cleared by Super Admin or completed online, no employees or admins can access their workspace.
                  </div>
                </div>

                <button
                  onClick={() => setCreatedCredentials(null)}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white font-bold text-xs transition-all shadow-md shadow-[#1988A3]/25 cursor-pointer"
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
