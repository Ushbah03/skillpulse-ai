import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Plus, 
  Search, 
  Building2, 
  X, 
  FileText 
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';

// Mock Client Subscriptions
const initialSubscriptions = [
  {
    id: 'SUB-9021',
    companyName: 'Acme Corporation',
    plan: 'Enterprise Pro',
    seats: 1200,
    mrr: '$14,400',
    billingCycle: 'Annual',
    status: 'Active',
    nextBillingDate: 'Oct 15, 2026',
    invoiceEmail: 'billing@acme.corp'
  },
  {
    id: 'SUB-8812',
    companyName: 'Starlight Tech Solutions',
    plan: 'Enterprise Standard',
    seats: 450,
    mrr: '$4,500',
    billingCycle: 'Monthly',
    status: 'Active',
    nextBillingDate: 'Sep 01, 2026',
    invoiceEmail: 'finance@starlight.io'
  },
  {
    id: 'SUB-7734',
    companyName: 'Apex Health Systems',
    plan: 'Custom Scale',
    seats: 3500,
    mrr: '$38,500',
    billingCycle: 'Annual',
    status: 'Active',
    nextBillingDate: 'Dec 12, 2026',
    invoiceEmail: 'accounts@apexhealth.org'
  },
  {
    id: 'SUB-6621',
    companyName: 'Vanguard Global',
    plan: 'Enterprise Pro',
    seats: 800,
    mrr: '$9,600',
    billingCycle: 'Monthly',
    status: 'Past Due',
    nextBillingDate: 'Aug 10, 2026',
    invoiceEmail: 'ap@vanguardglobal.com'
  }
];

const BillingAndSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Filter Logic
  const filteredSubscriptions = subscriptions.filter(item => {
    const matchesSearch = item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsPlanModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Custom Plan
          </motion.button>
        </div>

        {/* Financial Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Annual Recurring Revenue (ARR)</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              $804,000
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue (MRR)</p>
            <p className="text-2xl font-extrabold text-white mt-1">$67,000</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Licensed Seat Volume</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">5,950 Seats</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Past Due Accounts</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              1 Account
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
              <option value="Past Due">Past Due</option>
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
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
                {filteredSubscriptions.map((sub) => (
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
                      <span className="font-medium text-slate-200">{sub.plan}</span>
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
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {sub.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Create Custom Plan Modal */}
      <AnimatePresence>
        {isPlanModalOpen && (
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
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Create Enterprise Plan Tier</h2>
                    <p className="text-xs text-slate-400">Define custom seat limits and AI token allocations.</p>
                  </div>
                </div>
                <button onClick={() => setIsPlanModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setIsPlanModalOpen(false); }} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Plan Tier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Enterprise Global Scale"
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Base Price / Seat ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="12.00"
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Monthly Token Cap</label>
                    <input
                      type="text"
                      required
                      placeholder="5,000,000"
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlanModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    Save Tier Plan
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