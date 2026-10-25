import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Building2, 
  X, 
  FileText,
  Loader2,
  SlidersHorizontal,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  ShieldCheck,
  Save,
  RefreshCw,
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

const DEFAULT_PLAN_RATES = {
  STARTER: { name: 'Starter Plan', rate: 600, annualRate: 500, defaultSeats: 30, desc: 'Essential skill assessment and taxonomy management for small teams.' },
  PRO: { name: 'Professional Plan', rate: 1200, annualRate: 1000, defaultSeats: 250, desc: 'Comprehensive AI gap detection, team leadership, and HR analytics for growing companies.' },
  ENTERPRISE: { name: 'Enterprise AI', rate: 2500, annualRate: 2000, defaultSeats: 1000, desc: 'Large-scale organization intelligence with 1,000 user seats and global integrations.' }
};

const BillingAndSubscriptions = () => {
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' | 'tier-models'
  const [subscriptions, setSubscriptions] = useState([]);
  const [pricingTiers, setPricingTiers] = useState(DEFAULT_PLAN_RATES);
  const [gatewayInfo, setGatewayInfo] = useState({ provider: 'Stripe', status: 'ONLINE', mode: 'Live/Test Connected' });
  const [loading, setLoading] = useState(true);
  const [savingTiers, setSavingTiers] = useState(false);
  const [tierSaveFeedback, setTierSaveFeedback] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Pagination State for Subscriptions Table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedEditTenant, setSelectedEditTenant] = useState(null);

  // Form states for Edit Tenant Plan
  const [editPlan, setEditPlan] = useState('PRO');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [editMaxUsers, setEditMaxUsers] = useState(250);
  const [updatingTenant, setUpdatingTenant] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Pricing Tiers and Gateway Status from DB
      let currentTiers = DEFAULT_PLAN_RATES;
      try {
        const tierRes = await adminAPI.getPricingTiers();
        if (tierRes?.success && tierRes.data) {
          currentTiers = { ...DEFAULT_PLAN_RATES, ...tierRes.data };
          setPricingTiers(currentTiers);
          if (tierRes.gateway) setGatewayInfo(tierRes.gateway);
        }
      } catch (tierErr) {
        console.warn('Using default pricing tiers:', tierErr);
      }

      // 2. Fetch all tenants directly from Neon PostgreSQL
      const res = await adminAPI.getTenants();
      if (res?.success && res.data) {
        const mapped = res.data.map(t => {
          const planKey = (t.plan || 'PRO').toUpperCase();
          const planConfig = currentTiers[planKey] || { name: `${t.plan} Plan`, rate: 1200, defaultSeats: 250 };
          
          const seats = t.maxUsers ?? planConfig.defaultSeats ?? 250;
          const activeUsers = t._count?.users ?? 0;
          const mrrValue = planConfig.rate;

          const created = new Date(t.createdAt);
          const now = new Date();
          const nextBilling = new Date(t.createdAt);
          while (nextBilling < now) {
            if (t.plan === 'ENTERPRISE') {
              nextBilling.setFullYear(nextBilling.getFullYear() + 1);
            } else {
              nextBilling.setMonth(nextBilling.getMonth() + 1);
            }
          }

          return {
            id: `SUB-${t.id.slice(-4).toUpperCase()}`,
            rawId: t.id,
            companyName: t.name,
            slug: t.slug,
            domain: t.domain,
            plan: t.plan,
            planLabel: planConfig.name,
            seats,
            activeUsers,
            mrrNumber: mrrValue,
            mrr: `$${mrrValue.toLocaleString()}`,
            billingCycle: t.plan === 'ENTERPRISE' ? 'Annual' : 'Monthly',
            status: t.status === 'ACTIVE' ? 'Active' : t.status === 'SUSPENDED' ? 'Suspended' : 'Past Due',
            rawStatus: t.status,
            createdAt: created.toLocaleDateString(),
            nextBillingDate: nextBilling.toLocaleDateString(),
            invoiceEmail: t.adminEmail || (t.domain ? `admin@${t.domain}` : 'No Email Registered'),
            stripeCustomerId: t.stripeCustomerId || 'None (Self-Managed)',
            stripeSubscriptionId: t.stripeSubscriptionId || 'None (Standard Provisioning)'
          };
        });
        setSubscriptions(mapped);
      }
    } catch (err) {
      console.warn('Failed to load subscriptions from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalMRR = useMemo(() => {
    return subscriptions
      .filter(s => s.status === 'Active')
      .reduce((acc, curr) => acc + curr.mrrNumber, 0);
  }, [subscriptions]);

  const totalARR = totalMRR * 12;

  const totalSeats = useMemo(() => {
    return subscriptions.reduce((acc, curr) => acc + curr.seats, 0);
  }, [subscriptions]);

  const activeSeats = useMemo(() => {
    return subscriptions.reduce((acc, curr) => acc + curr.activeUsers, 0);
  }, [subscriptions]);

  const pastDueCount = useMemo(() => {
    return subscriptions.filter(s => s.status !== 'Active').length;
  }, [subscriptions]);

  // Filter Logic
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(item => {
      const matchesSearch = item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchTerm, statusFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredSubscriptions.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredSubscriptions.length);
  const paginatedSubscriptions = useMemo(() => {
    return filteredSubscriptions.slice(startIndex, endIndex);
  }, [filteredSubscriptions, startIndex, endIndex]);

  // Open Edit Tenant Modal
  const openEditModal = (sub) => {
    setSelectedEditTenant(sub);
    const planKey = (sub.plan || 'PRO').toUpperCase();
    const fixedSeats = pricingTiers[planKey]?.defaultSeats || (planKey === 'STARTER' ? 30 : planKey === 'PRO' ? 250 : 1000);
    setEditPlan(planKey);
    setEditStatus(sub.rawStatus || 'ACTIVE');
    setEditMaxUsers(fixedSeats);
  };

  // Handle Plan Dropdown Change in Modal
  const handlePlanSelectChange = (newPlanKey) => {
    setEditPlan(newPlanKey);
    const fixedSeats = pricingTiers[newPlanKey]?.defaultSeats || (newPlanKey === 'STARTER' ? 30 : newPlanKey === 'PRO' ? 250 : 1000);
    setEditMaxUsers(fixedSeats);
  };

  // Handle Update Tenant Subscription Plan/Status
  const handleUpdateTenantSubscription = async (e) => {
    e.preventDefault();
    if (!selectedEditTenant) return;

    try {
      setUpdatingTenant(true);
      const res = await adminAPI.updateTenant(selectedEditTenant.rawId, {
        plan: editPlan,
        status: editStatus,
        maxUsers: Number(editMaxUsers)
      });
      if (res.success) {
        await loadData();
        setSelectedEditTenant(null);
      }
    } catch (err) {
      console.error("Failed to update tenant subscription:", err);
    } finally {
      setUpdatingTenant(false);
    }
  };

  // Handle Save Central SaaS Pricing Tier Models
  const handleSaveTierModels = async () => {
    try {
      setSavingTiers(true);
      setTierSaveFeedback(null);
      const res = await adminAPI.updatePricingTiers(pricingTiers);
      if (res.success) {
        setTierSaveFeedback({ type: 'success', message: 'SaaS pricing subscription tier models saved & synchronized in database.' });
        await loadData();
        setTimeout(() => setTierSaveFeedback(null), 5000);
      }
    } catch (err) {
      console.error("Failed to update pricing tiers:", err);
      setTierSaveFeedback({ type: 'error', message: err.message || 'Failed to update pricing tier models.' });
      setTimeout(() => setTierSaveFeedback(null), 5000);
    } finally {
      setSavingTiers(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-[#E9EAF7] text-[#17233E] font-sans relative overflow-x-hidden selection:bg-[#1988A3]/20 selection:text-[#17233E]">
      {/* Ambient Animated Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#1988A3]/20 to-[#11C6DE]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-[#1B3154]/15 to-[#8A9CB7]/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-[#11C6DE]/15 to-[#1988A3]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#8A9CB7_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <SuperadminSidebar activeItem="billing" />

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 px-3.5 sm:px-6 md:px-8 pt-20 lg:pt-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#BEDDF5]/70 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E] flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#1988A3] to-[#11C6DE] text-white shadow-lg shadow-[#1988A3]/25 inline-flex">
                <CreditCard className="w-7 h-7" />
              </span>
              Billing & Subscription Management
            </h1>
            <p className="text-[#5A6D89] text-sm mt-1">
              Track global platform ARR, manage enterprise tier pricing models, monitor billing cycles, and review invoices.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-white/70 border border-[#BEDDF5] rounded-xl sm:rounded-2xl shrink-0 shadow-sm w-full md:w-auto">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'subscriptions'
                  ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-md'
                  : 'text-[#5A6D89] hover:text-[#17233E]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Tenant Subscriptions ({subscriptions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('tier-models')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tier-models'
                  ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-md'
                  : 'text-[#5A6D89] hover:text-[#17233E]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>SaaS Tier Models & Gateway</span>
            </button>
          </div>
        </div>

        {/* Financial Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Annual Recurring Revenue (ARR)</p>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 flex items-center gap-2">
              ${totalARR.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#5A6D89] mt-1 font-mono">Calculated as Total MRR × 12 months</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Monthly Recurring Revenue (MRR)</p>
              <DollarSign className="w-4 h-4 text-[#1988A3]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#17233E] mt-1">${totalMRR.toLocaleString()}</p>
            <p className="text-[11px] text-[#5A6D89] mt-1">Active client tenant recurring billings</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Licensed Seat Volume</p>
              <Users className="w-4 h-4 text-[#1988A3]" />
            </div>
            <p className="text-3xl font-black text-[#1988A3] mt-1">
              {totalSeats.toLocaleString()} <span className="text-xs font-normal text-[#5A6D89]">Seats</span>
            </p>
            <p className="text-[11px] text-[#5A6D89] mt-1">{activeSeats} active users provisioned across tenants</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Suspended / Past Due</p>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-amber-700 mt-1 flex items-center gap-2">
              {pastDueCount} <span className="text-xs font-normal text-[#5A6D89]">{pastDueCount === 1 ? 'Account' : 'Accounts'}</span>
            </p>
            <p className="text-[11px] text-[#5A6D89] mt-1">
              {pastDueCount === 0 ? 'All tenant subscriptions are in good standing' : 'Action required to restore workspace access'}
            </p>
          </motion.div>
        </div>

        {/* TAB 1: TENANT SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9CB7]" />
                <input
                  type="text"
                  placeholder="Search tenant name or subscription ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white text-[#17233E] border border-[#BEDDF5] rounded-xl text-xs focus:outline-none focus:border-[#1988A3] shadow-sm transition-colors placeholder:text-[#8A9CB7]"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-white border border-[#BEDDF5] px-3 py-1.5 rounded-xl text-xs text-[#5A6D89] shadow-sm">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#1988A3]" />
                  <span className="font-semibold">Filter Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Past Due">Past Due</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subscriptions Table */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/80 border border-[#BEDDF5] rounded-2xl shadow-sm">
                <SkillPulseLoader message="Loading tenant subscriptions directly from PostgreSQL database..." />
              </div>
            ) : (
              <div className="bg-white/85 border border-[#BEDDF5] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#17233E]">
                    <thead className="bg-[#D8EBF9]/80 text-xs uppercase tracking-wider text-[#17233E] font-bold border-b border-[#BEDDF5]">
                      <tr>
                        <th className="py-4 px-6">Tenant / Subscription ID</th>
                        <th className="py-4 px-6">Tier Plan</th>
                        <th className="py-4 px-6">Seat Count</th>
                        <th className="py-4 px-6">MRR Value</th>
                        <th className="py-4 px-6">Billing Cycle</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#BEDDF5]/60 font-sans">
                      {paginatedSubscriptions.length > 0 ? (
                        paginatedSubscriptions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-white/60 transition-colors group">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white border border-[#BEDDF5] text-[#1988A3] shadow-sm">
                                  <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-bold text-[#17233E] text-sm">{sub.companyName}</p>
                                  <p className="text-xs text-[#5A6D89] font-mono">{sub.id}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <span className="font-bold text-[#17233E]">{sub.planLabel}</span>
                            </td>

                            <td className="py-4 px-6">
                              <span className="font-mono text-[#17233E] font-bold">{sub.seats.toLocaleString()} seats</span>
                              <span className="text-[11px] text-[#5A6D89] block">({sub.activeUsers} active / {sub.seats} max)</span>
                            </td>

                            <td className="py-4 px-6 font-bold text-emerald-700 font-mono">
                              {sub.mrr}/mo
                            </td>

                            <td className="py-4 px-6 text-xs text-[#5A6D89]">
                              {sub.billingCycle}
                            </td>

                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                sub.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                  : sub.status === 'Suspended'
                                  ? 'bg-rose-100 text-rose-700 border-rose-300'
                                  : 'bg-amber-100 text-amber-700 border-amber-300'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  sub.status === 'Active' ? 'bg-emerald-500 animate-pulse' :
                                  sub.status === 'Suspended' ? 'bg-rose-500' : 'bg-amber-500'
                                }`} />
                                {sub.status}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedInvoice(sub)}
                                  className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#5A6D89] border border-[#BEDDF5] shadow-sm transition-colors"
                                  title="View Invoice & Billing Details"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openEditModal(sub)}
                                  className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#1988A3] border border-[#BEDDF5] shadow-sm transition-colors"
                                  title="Edit Plan / Upgrade Tenant"
                                >
                                  <SlidersHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-12 text-[#5A6D89]">
                            No tenant subscriptions match current criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="p-4 bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 border-t border-[#BEDDF5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A6D89]">
                  <div className="flex items-center gap-4">
                    <span>
                      Showing <span className="font-bold text-[#17233E]">{filteredSubscriptions.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-[#17233E]">{endIndex}</span> of <span className="font-bold text-[#17233E]">{filteredSubscriptions.length}</span> tenant subscriptions
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[#5A6D89]">Rows per page:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="bg-white border border-[#BEDDF5] text-[#17233E] font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
                      >
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={8}>8</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
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
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAAS PRICING TIER MODELS & GATEWAY */}
        {activeTab === 'tier-models' && (
          <div className="space-y-6">
            {/* Feedback Alert */}
            <AnimatePresence>
              {tierSaveFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
                    tierSaveFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-rose-50 border-rose-300 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm font-semibold">{tierSaveFeedback.message}</span>
                  </div>
                  <button onClick={() => setTierSaveFeedback(null)} className="text-[#5A6D89] hover:text-[#17233E]">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gateway Status Header */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#635BFF]/15 border border-[#635BFF]/30 text-[#635BFF]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#17233E] text-base">Payment Gateway Integration Engine</h3>
                  <p className="text-xs text-[#5A6D89]">
                    Provider: <span className="text-[#17233E] font-bold">{gatewayInfo.provider}</span> · Status: <span className="text-emerald-700 font-bold">{gatewayInfo.status}</span> · Mode: <span className="text-[#1988A3] font-mono font-bold">{gatewayInfo.mode}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleSaveTierModels}
                disabled={savingTiers}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 transition-all shrink-0"
              >
                {savingTiers ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Tier Configurations</span>
              </button>
            </div>

            {/* Tier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['STARTER', 'PRO', 'ENTERPRISE'].map((tierKey) => {
                const tier = pricingTiers[tierKey] || DEFAULT_PLAN_RATES[tierKey];
                return (
                  <div
                    key={tierKey}
                    className="p-6 rounded-2xl bg-white/85 border border-[#BEDDF5] hover:border-[#1988A3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1988A3] font-mono">
                          {tierKey} TIER
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D8EBF9] text-[#17233E] border border-[#BEDDF5]">
                          {tier.defaultSeats} Fixed Seats
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-[#17233E] mb-2">{tier.name}</h3>
                      <p className="text-xs text-[#5A6D89] leading-relaxed mb-6">{tier.desc}</p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#5A6D89] mb-1">
                            Monthly Subscription Rate ($ USD)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9CB7] font-mono font-bold">$</span>
                            <input
                              type="number"
                              value={tier.rate}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setPricingTiers(prev => ({
                                  ...prev,
                                  [tierKey]: { ...prev[tierKey], rate: val }
                                }));
                              }}
                              className="w-full pl-8 pr-4 py-2 bg-white border border-[#BEDDF5] rounded-xl text-sm text-[#17233E] font-mono font-bold focus:outline-none focus:border-[#1988A3] shadow-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#5A6D89] mb-1">
                            Annual Discounted Rate ($ / month)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9CB7] font-mono font-bold">$</span>
                            <input
                              type="number"
                              value={tier.annualRate || Math.round(tier.rate * 0.83)}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setPricingTiers(prev => ({
                                  ...prev,
                                  [tierKey]: { ...prev[tierKey], annualRate: val }
                                }));
                              }}
                              className="w-full pl-8 pr-4 py-2 bg-white border border-[#BEDDF5] rounded-xl text-sm text-emerald-700 font-mono font-bold focus:outline-none focus:border-[#1988A3] shadow-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#5A6D89] mb-1">
                            Default Seat Allocation Limit
                          </label>
                          <input
                            type="number"
                            value={tier.defaultSeats}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setPricingTiers(prev => ({
                                ...prev,
                                [tierKey]: { ...prev[tierKey], defaultSeats: val }
                              }));
                            }}
                            className="w-full px-4 py-2 bg-white border border-[#BEDDF5] rounded-xl text-sm text-[#1988A3] font-mono font-bold focus:outline-none focus:border-[#1988A3] shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-6 border-t border-[#BEDDF5] text-[11px] text-[#5A6D89]">
                      Synchronizes across public signup, pricing calculator, and Stripe Checkout.
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Invoice Details Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/90 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#BEDDF5]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#17233E]">Invoice Statement</h2>
                    <p className="text-xs text-[#5A6D89] font-mono">INV-2026-SP-{selectedInvoice.rawId.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-[#5A6D89] hover:text-[#17233E]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 bg-white/80 rounded-xl border border-[#BEDDF5] grid grid-cols-2 gap-4 text-xs shadow-sm">
                  <div>
                    <span className="text-[#5A6D89] block font-semibold uppercase">Billed To</span>
                    <span className="text-[#17233E] font-bold text-sm block mt-0.5">{selectedInvoice.companyName}</span>
                    <span className="text-[#5A6D89] block font-mono">{selectedInvoice.invoiceEmail}</span>
                  </div>
                  <div>
                    <span className="text-[#5A6D89] block font-semibold uppercase">Billing Summary</span>
                    <span className="text-emerald-700 font-extrabold text-sm block mt-0.5">{selectedInvoice.mrr} / {selectedInvoice.billingCycle}</span>
                    <span className="text-[#5A6D89] block">Next Charge: {selectedInvoice.nextBillingDate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[#BEDDF5]">
                    <span className="text-[#5A6D89]">Subscription Tier Plan:</span>
                    <span className="text-[#17233E] font-bold">{selectedInvoice.planLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[#BEDDF5]">
                    <span className="text-[#5A6D89]">Licensed User Allocation:</span>
                    <span className="text-[#1988A3] font-mono font-bold">
                      {selectedInvoice.seats} User Licenses ({selectedInvoice.activeUsers} currently assigned)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[#BEDDF5]">
                    <span className="text-[#5A6D89]">Stripe Customer Reference:</span>
                    <span className="text-[#17233E] font-mono font-semibold">{selectedInvoice.stripeCustomerId}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[#BEDDF5]">
                    <span className="text-[#5A6D89]">Stripe Subscription ID:</span>
                    <span className="text-[#17233E] font-mono font-semibold">{selectedInvoice.stripeSubscriptionId}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[#BEDDF5]">
                    <span className="text-[#5A6D89]">Payment Status:</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      selectedInvoice.status === 'Active' ? 'text-emerald-700' :
                      selectedInvoice.status === 'Suspended' ? 'text-rose-700' : 'text-amber-700'
                    }`}>
                      {selectedInvoice.status === 'Active' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Paid & Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> {selectedInvoice.status}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#BEDDF5]">
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#5A6D89] text-xs font-semibold border border-[#BEDDF5] shadow-sm"
                  >
                    Close
                  </button>
                  <button
                    onClick={handlePrintInvoice}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#1988A3]/25"
                  >
                    <Printer className="w-4 h-4" /> Print / Save Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Tenant Subscription Modal */}
      <AnimatePresence>
        {selectedEditTenant && (
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
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#17233E]">Manage Tenant Subscription</h2>
                    <p className="text-xs text-[#5A6D89]">{selectedEditTenant.companyName} ({selectedEditTenant.id})</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEditTenant(null)} className="text-[#5A6D89] hover:text-[#17233E]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTenantSubscription} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Subscription Plan Tier</label>
                  <select
                    value={editPlan}
                    onChange={(e) => handlePlanSelectChange(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] font-bold shadow-sm"
                  >
                    <option value="STARTER">Starter Plan (${pricingTiers.STARTER?.rate || 600}/mo — {pricingTiers.STARTER?.defaultSeats || 30} Seats)</option>
                    <option value="PRO">Professional Plan (${pricingTiers.PRO?.rate || 1200}/mo — {pricingTiers.PRO?.defaultSeats || 250} Seats)</option>
                    <option value="ENTERPRISE">Enterprise AI (${pricingTiers.ENTERPRISE?.rate || 2500}/mo — {pricingTiers.ENTERPRISE?.defaultSeats || 1000} Seats)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended (Block Access)</option>
                    <option value="PENDING_PAYMENT">Pending Payment / Past Due</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89]">Maximum Licensed User Seats</label>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" /> Fixed by Plan Tier
                    </span>
                  </div>
                  <input
                    type="number"
                    readOnly
                    disabled
                    value={editMaxUsers}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-[#1988A3] font-mono font-bold focus:outline-none cursor-not-allowed select-none opacity-80"
                  />
                  <p className="text-[11px] text-[#5A6D89] mt-1.5 flex items-center gap-1.5">
                    <span>🔒</span>
                    <span>
                      Seat capacity is automatically fixed based on plan tier: Starter ({pricingTiers.STARTER?.defaultSeats || 30} seats) · Professional ({pricingTiers.PRO?.defaultSeats || 250} seats) · Enterprise AI ({pricingTiers.ENTERPRISE?.defaultSeats || 1000} seats). Cannot be manually edited.
                    </span>
                  </p>
                </div>

                <div className="pt-4 border-t border-[#BEDDF5] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEditTenant(null)}
                    className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#5A6D89] text-xs font-semibold border border-[#BEDDF5] shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingTenant}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 flex items-center gap-2"
                  >
                    {updatingTenant ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    Update Subscription
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

export default BillingAndSubscriptions;
