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
  Sparkles
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
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

  // Reset to page 1 whenever filters change
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
          
          // Use real database values: t.maxUsers and actual active users count
          const seats = t.maxUsers ?? planConfig.defaultSeats ?? 250;
          const activeUsers = t._count?.users ?? 0;
          const mrrValue = planConfig.rate;

          // Dynamic calculation of next billing cycle renewal date from t.createdAt
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
    const fixedSeats = sub.seats || pricingTiers[planKey]?.defaultSeats || 250;
    setEditPlan(planKey);
    setEditStatus(sub.rawStatus || 'ACTIVE');
    setEditMaxUsers(fixedSeats);
  };

  // Handle Plan Dropdown Change in Modal
  const handlePlanSelectChange = (newPlanKey) => {
    setEditPlan(newPlanKey);
    const fixedSeats = pricingTiers[newPlanKey]?.defaultSeats || 250;
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

  // Handle Save Central SaaS Pricing Tier Models (Feature 6.7.6 Box 5 & 7)
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
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-indigo-400" />
              Billing & Subscription Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track global platform ARR, manage enterprise tier pricing models, monitor billing cycles, and review invoices.
            </p>
          </div>

          {/* Tab Navigation (Subscriptions vs SaaS Pricing Tier Models) */}
          <div className="flex items-center gap-2 p-1.5 bg-[#0F172A] border border-slate-800/80 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'subscriptions'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Tenant Subscriptions ({subscriptions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('tier-models')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tier-models'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>SaaS Tier Models & Gateway</span>
            </button>
          </div>
        </div>

        {/* Financial Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Annual Recurring Revenue (ARR)</p>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2">
              ${totalARR.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Calculated as Total MRR × 12 months</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue (MRR)</p>
              <DollarSign className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-1">${totalMRR.toLocaleString()}</p>
            <p className="text-[11px] text-slate-500 mt-1">Active client tenant recurring billings</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Licensed Seat Volume</p>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {totalSeats.toLocaleString()} <span className="text-xs font-normal text-slate-400">Seats</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">{activeSeats} active users provisioned across tenants</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Suspended / Past Due</p>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-amber-400 mt-1 flex items-center gap-2">
              {pastDueCount} <span className="text-xs font-normal text-slate-400">{pastDueCount === 1 ? 'Account' : 'Accounts'}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {pastDueCount === 0 ? 'All tenant subscriptions are in good standing' : 'Action required to restore workspace access'}
            </p>
          </motion.div>
        </div>

        {/* TAB 1: TENANT SUBSCRIPTIONS (WITH TABLE PAGINATION) */}
        {activeTab === 'subscriptions' && (
          <div>
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tenant name or subscription ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filter Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-[#0F172A]">All Statuses</option>
                    <option value="Active" className="bg-[#0F172A]">Active</option>
                    <option value="Suspended" className="bg-[#0F172A]">Suspended</option>
                    <option value="Past Due" className="bg-[#0F172A]">Past Due</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subscriptions Table */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-[#0F172A] border border-slate-800/80 rounded-2xl">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm text-slate-400 mt-3">Loading tenant subscriptions directly from PostgreSQL database...</p>
              </div>
            ) : (
              <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-[#1E293B]/70 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
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
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {paginatedSubscriptions.length > 0 ? (
                        paginatedSubscriptions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors group">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
                                  <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-bold text-white text-sm">{sub.companyName}</p>
                                  <p className="text-xs text-slate-400 font-mono">{sub.id}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <span className="font-medium text-slate-200">{sub.planLabel}</span>
                            </td>

                            <td className="py-4 px-6">
                              <span className="font-mono text-slate-200 font-bold">{sub.seats.toLocaleString()} seats</span>
                              <span className="text-[11px] text-slate-500 block">({sub.activeUsers} active / {sub.seats} max)</span>
                            </td>

                            <td className="py-4 px-6 font-bold text-emerald-400 font-mono">
                              {sub.mrr}/mo
                            </td>

                            <td className="py-4 px-6 text-xs text-slate-400">
                              {sub.billingCycle}
                            </td>

                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                sub.status === 'Active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : sub.status === 'Suspended'
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  sub.status === 'Active' ? 'bg-emerald-400 animate-pulse' :
                                  sub.status === 'Suspended' ? 'bg-red-400' : 'bg-amber-400'
                                }`} />
                                {sub.status}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedInvoice(sub)}
                                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                                  title="View Invoice & Billing Details"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openEditModal(sub)}
                                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 transition-colors"
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
                          <td colSpan="7" className="text-center py-12 text-slate-500">
                            No tenant subscriptions match current criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION CONTROLS (MARKED AREA IN SCREENSHOT) */}
                <div className="p-4 bg-[#1E293B]/40 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>
                      Showing <span className="font-bold text-white">{filteredSubscriptions.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-white">{endIndex}</span> of <span className="font-bold text-white">{filteredSubscriptions.length}</span> tenant subscriptions
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Rows per page:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="bg-[#1E293B] border border-slate-700 text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
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
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700/60"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      title="Previous Page"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700/60"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Numbered Page Buttons */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                            currentPage === page
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60'
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
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700/60"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      title="Last Page"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700/60"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAAS PRICING TIER MODELS & GATEWAY (6.7.6 Payment Gateway Integration) */}
        {activeTab === 'tier-models' && (
          <div className="space-y-6">
            {/* Feedback Alert */}
            <AnimatePresence>
              {tierSaveFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    tierSaveFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium">{tierSaveFeedback.message}</span>
                  </div>
                  <button onClick={() => setTierSaveFeedback(null)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gateway Status Header */}
            <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Payment Gateway Integration Engine</h3>
                  <p className="text-xs text-slate-400">
                    Provider: <span className="text-white font-semibold">{gatewayInfo.provider}</span> · Status: <span className="text-emerald-400 font-semibold">{gatewayInfo.status}</span> · Mode: <span className="text-indigo-400 font-mono">{gatewayInfo.mode}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleSaveTierModels}
                disabled={savingTiers}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
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
                    className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800/80 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                          {tierKey} TIER
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {tier.defaultSeats} Fixed Seats
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-white mb-2">{tier.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-6">{tier.desc}</p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Monthly Subscription Rate ($ USD)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
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
                              className="w-full pl-8 pr-4 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Annual Discounted Rate ($ / month)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
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
                              className="w-full pl-8 pr-4 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">
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
                            className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-indigo-300 font-mono font-bold focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-6 border-t border-slate-800 text-[11px] text-slate-500">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Invoice Statement</h2>
                    <p className="text-xs text-slate-400 font-mono">INV-2026-SP-{selectedInvoice.rawId.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 bg-[#1E293B] rounded-xl border border-slate-700/60 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Billed To</span>
                    <span className="text-white font-bold text-sm block mt-0.5">{selectedInvoice.companyName}</span>
                    <span className="text-slate-400 block font-mono">{selectedInvoice.invoiceEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Billing Summary</span>
                    <span className="text-emerald-400 font-extrabold text-sm block mt-0.5">{selectedInvoice.mrr} / {selectedInvoice.billingCycle}</span>
                    <span className="text-slate-400 block">Next Charge: {selectedInvoice.nextBillingDate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                    <span className="text-slate-400">Subscription Tier Plan:</span>
                    <span className="text-white font-bold">{selectedInvoice.planLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                    <span className="text-slate-400">Licensed User Allocation:</span>
                    <span className="text-indigo-400 font-mono font-bold">
                      {selectedInvoice.seats} User Licenses ({selectedInvoice.activeUsers} currently assigned)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                    <span className="text-slate-400">Stripe Customer Reference:</span>
                    <span className="text-slate-300 font-mono">{selectedInvoice.stripeCustomerId}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                    <span className="text-slate-400">Stripe Subscription ID:</span>
                    <span className="text-slate-300 font-mono">{selectedInvoice.stripeSubscriptionId}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      selectedInvoice.status === 'Active' ? 'text-emerald-400' :
                      selectedInvoice.status === 'Suspended' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {selectedInvoice.status === 'Active' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" /> {selectedInvoice.status}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Close
                  </button>
                  <button
                    onClick={handlePrintInvoice}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
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
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Manage Tenant Subscription</h2>
                    <p className="text-xs text-slate-400">{selectedEditTenant.companyName} ({selectedEditTenant.id})</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEditTenant(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTenantSubscription} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Subscription Plan Tier</label>
                  <select
                    value={editPlan}
                    onChange={(e) => handlePlanSelectChange(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="STARTER">Starter Plan (${pricingTiers.STARTER?.rate || 600}/mo — {pricingTiers.STARTER?.defaultSeats || 30} Seats)</option>
                    <option value="PRO">Professional Plan (${pricingTiers.PRO?.rate || 1200}/mo — {pricingTiers.PRO?.defaultSeats || 250} Seats)</option>
                    <option value="ENTERPRISE">Enterprise AI (${pricingTiers.ENTERPRISE?.rate || 2500}/mo — {pricingTiers.ENTERPRISE?.defaultSeats || 1000} Seats)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended (Block Access)</option>
                    <option value="PENDING_PAYMENT">Pending Payment / Past Due</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Maximum Licensed User Seats</label>
                  <input
                    type="number"
                    value={editMaxUsers}
                    onChange={(e) => setEditMaxUsers(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700/80 rounded-xl text-xs text-indigo-300 font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Default seats based on plan: Starter ({pricingTiers.STARTER?.defaultSeats || 30}) · Professional ({pricingTiers.PRO?.defaultSeats || 250}) · Enterprise AI ({pricingTiers.ENTERPRISE?.defaultSeats || 1000}).
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEditTenant(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingTenant}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
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
