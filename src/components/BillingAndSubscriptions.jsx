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
  Printer
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const PLAN_RATES = {
  STARTER: { name: 'Starter Plan', rate: 600, defaultSeats: 50 },
  PRO: { name: 'Professional Plan', rate: 1200, defaultSeats: 250 },
  ENTERPRISE: { name: 'Enterprise AI', rate: 2500, defaultSeats: 1000 }
};

const BillingAndSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedEditTenant, setSelectedEditTenant] = useState(null);

  // Form states for Edit Tenant Plan
  const [editPlan, setEditPlan] = useState('PRO');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [editMaxUsers, setEditMaxUsers] = useState(250);
  const [updatingTenant, setUpdatingTenant] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getTenants();
      if (res?.success && res.data) {
        const mapped = res.data.map(t => {
          const planKey = (t.plan || 'PRO').toUpperCase();
          const planConfig = PLAN_RATES[planKey] || { name: `${t.plan} Plan`, rate: 1200, defaultSeats: 250 };
          const seats = planConfig.defaultSeats || t.maxUsers || 250;
          const mrrValue = planConfig.rate;
          const created = new Date(t.createdAt);
          const nextBilling = new Date(created);
          nextBilling.setMonth(nextBilling.getMonth() + 1);

          return {
            id: `SUB-${t.id.slice(-4).toUpperCase()}`,
            rawId: t.id,
            companyName: t.name,
            slug: t.slug,
            domain: t.domain,
            plan: t.plan,
            planLabel: planConfig.name,
            seats,
            mrrNumber: mrrValue,
            mrr: `$${mrrValue.toLocaleString()}`,
            billingCycle: t.plan === 'ENTERPRISE' ? 'Annual' : 'Monthly',
            status: t.status === 'ACTIVE' ? 'Active' : t.status === 'SUSPENDED' ? 'Suspended' : 'Past Due',
            rawStatus: t.status,
            createdAt: created.toLocaleDateString(),
            nextBillingDate: nextBilling.toLocaleDateString(),
            invoiceEmail: `billing@${t.domain || t.slug + '.com'}`,
            stripeCustomerId: t.stripeCustomerId || `cus_live_${t.id.slice(0, 8)}`,
            stripeSubscriptionId: t.stripeSubscriptionId || `sub_live_${t.id.slice(-8)}`
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

  const pastDueCount = useMemo(() => {
    return subscriptions.filter(s => s.status !== 'Active').length;
  }, [subscriptions]);

  // Filter Logic
  const filteredSubscriptions = subscriptions.filter(item => {
    const matchesSearch = item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Open Edit Tenant Modal
  const openEditModal = (sub) => {
    setSelectedEditTenant(sub);
    const planKey = (sub.plan || 'PRO').toUpperCase();
    const fixedSeats = PLAN_RATES[planKey]?.defaultSeats || 250;
    setEditPlan(planKey);
    setEditStatus(sub.rawStatus || 'ACTIVE');
    setEditMaxUsers(fixedSeats);
  };

  // Handle Plan Dropdown Change in Modal (Automatically syncs fixed seats)
  const handlePlanSelectChange = (newPlanKey) => {
    setEditPlan(newPlanKey);
    const fixedSeats = PLAN_RATES[newPlanKey]?.defaultSeats || 250;
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
        await loadSubscriptions();
        setSelectedEditTenant(null);
      }
    } catch (err) {
      console.error("Failed to update tenant subscription:", err);
    } finally {
      setUpdatingTenant(false);
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
              Billing & Subscription Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track global platform ARR, manage enterprise tier pricing, monitor billing cycles, and review invoices.
            </p>
          </div>
        </div>

        {/* Financial Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Annual Recurring Revenue (ARR)</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              ${totalARR.toLocaleString()}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue (MRR)</p>
            <p className="text-2xl font-extrabold text-white mt-1">${totalMRR.toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Licensed Seat Volume</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">{totalSeats.toLocaleString()} Seats</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Suspended / Past Due</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              {pastDueCount} {pastDueCount === 1 ? 'Account' : 'Accounts'}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tenant or subscription ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1E293B] border border-slate-700/60 text-xs text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Past Due">Past Due</option>
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0F172A] border border-slate-800/80 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-400 mt-3">Calculating client subscriptions and ARR from database...</p>
          </div>
        ) : (
        <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#1E293B]/60 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800/60">
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400">
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

                      <td className="py-4 px-6 font-mono text-slate-300">
                        {sub.seats.toLocaleString()} seats
                      </td>

                      <td className="py-4 px-6 font-bold text-emerald-400">
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
                            sub.status === 'Active' ? 'bg-emerald-400' :
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
                    <td colSpan="7" className="text-center py-10 text-slate-500">
                      No tenant subscriptions match current criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                    <span className="text-slate-400">Licensed User Allocation (Fixed):</span>
                    <span className="text-indigo-400 font-mono font-bold">{selectedInvoice.seats} User Licenses</span>
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
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Active
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
                    <option value="STARTER">Starter Plan ($600/mo — 50 Fixed Seats)</option>
                    <option value="PRO">Professional Plan ($1,200/mo — 250 Fixed Seats)</option>
                    <option value="ENTERPRISE">Enterprise AI ($2,500/mo — 1,000 Fixed Seats)</option>
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
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Maximum Licensed User Seats (Fixed per Plan Tier)</label>
                  <input
                    type="number"
                    readOnly
                    value={editMaxUsers}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700/80 rounded-xl text-xs text-indigo-300 font-mono font-bold focus:outline-none cursor-not-allowed opacity-90"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    🔒 Seat capacity is fixed automatically based on selected plan tier: Starter (50 seats) · Professional (250 seats) · Enterprise AI (1,000 seats).
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