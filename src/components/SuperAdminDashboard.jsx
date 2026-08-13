import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Cpu, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  HardDrive,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';

// Mock Quick System Alert Logs
const initialSystemAlerts = [
  { id: 'ALT-901', type: 'Warning', message: 'Apex Financial Services exceeded 90% seat limit quota.', time: '12 mins ago' },
  { id: 'ALT-902', type: 'Info', message: 'Automated HRIS Sync executed successfully for 12 enterprise tenants.', time: '1 hour ago' },
  { id: 'ALT-903', type: 'Error', message: 'AI Vector Database latency spike detected in US-East region.', time: '3 hours ago' },
  { id: 'ALT-904', type: 'Success', message: 'System Backup completed: 1.4 TB secure vault stored.', time: '6 hours ago' },
];

const SuperAdminDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-semibold">
                PLATFORM SUPERADMIN
              </span>
              <span className="text-xs text-slate-500">v2.4.0 High-Availability</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              System Control Tower
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Global overview of client tenants, multi-cloud LLM compute consumption, and system health status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Telemetry
            </button>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>

        {/* Global Platform KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Active Tenants */}
          <motion.div 
            whileHover={{ y: -2 }} 
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tenants</span>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">42</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12% MoM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Across 3 global cloud regions</p>
          </motion.div>

          {/* Provisioned Seat Utilization */}
          <motion.div 
            whileHover={{ y: -2 }} 
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Seat Utilization</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">14,280</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> 84.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Out of 16,960 total licensed seats</p>
          </motion.div>

          {/* Monthly AI Token Usage */}
          <motion.div 
            whileHover={{ y: -2 }} 
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">LLM Token Usage</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">88.4 M</span>
              <span className="text-xs font-semibold text-purple-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> Tokens/Mo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Avg latency: 142ms per inference</p>
          </motion.div>

          {/* SLA Uptime */}
          <motion.div 
            whileHover={{ y: -2 }} 
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform SLA</span>
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">99.98%</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Target Met
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Zero unplanned downtime this month</p>
          </motion.div>

        </div>

        {/* Core Dashboard Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Top Tenant Activity Overview (Spans 2 Columns) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Top Enterprise Tenants By Seat Quota</h2>
                  <p className="text-xs text-slate-400">Real-time seat allocation and status tracking.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { name: 'Acme Global Enterprises', domain: 'acmeglobal.com', seats: '184 / 250', tier: 'Enterprise AI', status: 'Active', usage: 73.6 },
                { name: 'Apex Financial Services', domain: 'apexfin.com', seats: '410 / 500', tier: 'Enterprise AI', status: 'Payment Past Due', usage: 82.0 },
                { name: 'Nexus Tech Solutions', domain: 'nexustech.io', seats: '92 / 100', tier: 'Professional', status: 'Active', usage: 92.0 },
                { name: 'Vanguard Health Systems', domain: 'vanguardhealth.org', seats: '48 / 50', tier: 'Starter', status: 'Suspended', usage: 96.0 }
              ].map((tenant, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#1E293B]/50 border border-slate-800/80 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{tenant.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({tenant.domain})</span>
                    </div>
                    <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${tenant.usage > 90 ? 'bg-amber-400' : 'bg-indigo-500'}`} 
                        style={{ width: `${tenant.usage}%` }} 
                      />
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-200">{tenant.seats} Seats</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      tenant.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      tenant.status === 'Payment Past Due' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {tenant.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick System Infrastructure Health */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">System Health</h2>
                  <p className="text-xs text-slate-400">Core infrastructure metrics</p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Vector DB Storage Pool</span>
                  <span className="text-slate-200 font-mono font-bold">1.8 TB / 5.0 TB</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '36%' }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-400 font-medium">Global API Rate Limit Capacity</span>
                  <span className="text-slate-200 font-mono font-bold">4,200 req/sec</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '62%' }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-400 font-medium">HRIS / LMS Webhook Queue</span>
                  <span className="text-emerald-400 font-mono font-bold">0 Pending</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6">
              <div className="p-3.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-between">
                <span className="text-xs text-indigo-300 font-medium">Primary AI Model Engine</span>
                <span className="text-xs font-mono font-bold text-indigo-400">GPT-4o / Claude 3.5</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Platform Security & Event Stream */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Live Platform Event Stream</h2>
                <p className="text-xs text-slate-400">Real-time platform warnings, sync events, and security logs.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 divide-y divide-slate-800/60">
            {initialSystemAlerts.map((alert) => (
              <div key={alert.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    alert.type === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    alert.type === 'Error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    alert.type === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-slate-200 font-medium">{alert.message}</span>
                </div>
                <span className="text-slate-500 font-mono text-[11px] shrink-0">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default SuperAdminDashboard;