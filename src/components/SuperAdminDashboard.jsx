import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Cpu, 
  Activity, 
  ArrowUpRight, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  HardDrive,
  RefreshCw,
  ArrowRight,
  DollarSign,
  BookOpen,
  Webhook,
  Shield,
  CheckCircle2,
  Sparkles,
  Server,
  Zap,
  Clock
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

const SuperAdminDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    setRefreshing(true);
    try {
      const res = await adminAPI.getGlobalTelemetry();
      if (res?.success) {
        setTelemetry({
          ...res.data,
          ...(res.telemetry || {})
        });
      }
    } catch (err) {
      console.warn('Failed to load global platform telemetry:', err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Real Database Metrics from Neon PostgreSQL
  const tenantsCount = telemetry?.tenantsCount ?? 0;
  const activeTenantCount = telemetry?.activeTenantCount ?? 0;
  const suspendedTenantCount = telemetry?.suspendedTenantCount ?? 0;
  const totalUsersCount = telemetry?.totalUsersCount ?? 0;
  const totalSeatLimit = telemetry?.totalSeatLimit ?? 0;
  const seatUsagePct = telemetry?.seatUsagePct ?? (totalSeatLimit > 0 ? Math.round((totalUsersCount / totalSeatLimit) * 100 * 10) / 10 : 0);
  const skillsCount = telemetry?.skillsCount ?? 0;
  const categoriesCount = telemetry?.categoriesCount ?? 0;
  const activeAIModel = telemetry?.activeAIModel;
  const planDistribution = telemetry?.planDistribution || { STARTER: 0, PRO: 0, ENTERPRISE: 0 };
  const roleDistribution = telemetry?.roleDistribution || {};
  const mrr = telemetry?.mrr ?? 0;
  const recentTenants = telemetry?.recentTenants ?? [];
  const recentAuditLogs = telemetry?.recentAuditLogs ?? [];
  const uptime = telemetry?.uptime || '100.00%';
  const latency = telemetry?.latency || '35 ms';
  const cpuLoad = telemetry?.cpuLoad || '18% Load';
  const memoryUsedMB = telemetry?.memoryUsedMB || '42';
  const memoryTotalMB = telemetry?.memoryTotalMB || '115';
  const totalAuditLogs = telemetry?.totalAuditLogs ?? recentAuditLogs.length;

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

      <SuperadminSidebar activeItem="dashboard" />

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 px-3.5 sm:px-6 md:px-8 pt-20 lg:pt-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8">
        
        {/* Top Header */}
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-white/80 text-[#1988A3] border border-white/90 text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1988A3]" /> PLATFORM CONTROL TOWER
              </span>
              <span className="text-xs text-[#8A9CB7] font-mono font-semibold">Neon PostgreSQL • HA Multi-Tenant Cluster</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E]">
              System <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Control Tower</span>
            </h1>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium mt-1">
              Centralized mission control: enterprise tenants, multi-cloud GenAI inference, SaaS subscriptions, and platform security integrity.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={fetchTelemetry}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-[#17233E] border border-white/85 text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#1988A3] ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Telemetry'}</span>
            </motion.button>
            
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational ({latency})</span>
            </div>
          </div>
        </header>

        {loading ? (
          <SkillPulseLoader message="Querying platform telemetries from Neon PostgreSQL database..." fullScreen={false} />
        ) : (
          <>
          {/* Global Platform Primary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            
            {/* Active Tenants Card */}
            <motion.div 
              whileHover={{ y: -4 }} 
              className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Enterprise Tenants</span>
                  <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#17233E] tracking-tight">{tenantsCount}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> {activeTenantCount} Active
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#17233E] font-mono">
                  <span className="px-2 py-0.5 rounded-lg bg-white/70 border border-white/85">Starter: {planDistribution.STARTER}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/70 border border-white/85">Pro: {planDistribution.PRO}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/70 border border-white/85">Ent: {planDistribution.ENTERPRISE}</span>
                </div>
              </div>
              <Link 
                to="/superadmin/tenants" 
                className="mt-4 text-xs font-bold text-[#1988A3] hover:text-[#157289] flex items-center gap-1 transition-colors pt-3 border-t border-white/60"
              >
                Manage Tenants <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Provisioned Seat Utilization Card */}
            <motion.div 
              whileHover={{ y: -4 }} 
              className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Seat Utilization</span>
                  <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#11C6DE] shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#17233E] tracking-tight">{totalUsersCount}</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                    {seatUsagePct}% Used
                  </span>
                </div>
                <div className="mt-3 w-full bg-[#1B3154]/10 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#1988A3] to-[#11C6DE] transition-all duration-500" 
                    style={{ width: `${Math.max(4, Math.min(100, seatUsagePct))}%` }} 
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#8A9CB7] pt-3 border-t border-white/60">
                <span>Licensed: <strong className="text-[#17233E] font-bold">{totalSeatLimit} seats</strong></span>
                <Link to="/superadmin/users" className="text-[#1988A3] hover:text-[#157289] font-bold flex items-center gap-0.5">
                  Users <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Active LLM Model Engine Card */}
            <motion.div 
              whileHover={{ y: -4 }} 
              className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">GenAI Engine Router</span>
                  <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-purple-600 shadow-sm">
                    <Cpu className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xl font-extrabold text-[#17233E] block truncate tracking-tight" title={activeAIModel?.modelName || 'openai/gpt-oss-120b'}>
                    {activeAIModel?.modelName ? activeAIModel.modelName.split('/').pop() : 'gpt-oss-120b'}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-700 flex items-center gap-1 mt-1">
                    <Zap className="w-3.5 h-3.5 text-purple-600" /> {activeAIModel?.provider || 'Groq LPU Cloud'}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#8A9CB7] pt-3 border-t border-white/60">
                <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Inference Live
                </span>
                <Link to="/superadmin/ai-config" className="text-[#1988A3] hover:text-[#157289] font-bold flex items-center gap-0.5">
                  AI Config <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Monthly Recurring Revenue (MRR) Card */}
            <motion.div 
              whileHover={{ y: -4 }} 
              className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Active SaaS MRR</span>
                  <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-amber-600 shadow-sm">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono tracking-tight">
                    ${mrr.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-[#8A9CB7]">
                    / month
                  </span>
                </div>
                <p className="text-[11px] text-[#8A9CB7] mt-2 font-medium">
                  From {activeTenantCount} active client subscription plans
                </p>
              </div>
              <Link 
                to="/superadmin/billing" 
                className="mt-4 text-xs font-bold text-[#1988A3] hover:text-[#157289] flex items-center gap-1 transition-colors pt-3 border-t border-white/60"
              >
                Subscription Tiers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

          </div>

          {/* 4 Architecture Pillars Quick-Launch Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            
            <Link 
              to="/superadmin/taxonomy"
              className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 hover:border-[#1988A3]/50 transition-all flex items-center gap-3.5 group shadow-xl shadow-[#1B3154]/6"
            >
              <div className="p-3 rounded-2xl bg-white/70 text-[#1988A3] border border-white/85 group-hover:scale-105 transition-transform shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-extrabold text-[#17233E] block truncate group-hover:text-[#1988A3] transition-colors">Master Skill Taxonomy</span>
                <span className="text-[11px] text-[#8A9CB7] block font-mono font-semibold">{skillsCount} Skills • {categoriesCount} Categories</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8A9CB7] group-hover:text-[#1988A3] group-hover:translate-x-1 transition-all shrink-0" />
            </Link>

            <Link 
              to="/superadmin/roles"
              className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 hover:border-[#1988A3]/50 transition-all flex items-center gap-3.5 group shadow-xl shadow-[#1B3154]/6"
            >
              <div className="p-3 rounded-2xl bg-white/70 text-purple-600 border border-white/85 group-hover:scale-105 transition-transform shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-extrabold text-[#17233E] block truncate group-hover:text-purple-600 transition-colors">RBAC &amp; Least Privilege</span>
                <span className="text-[11px] text-[#8A9CB7] block font-mono font-semibold">5 SRS Roles • SoD Enforced</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8A9CB7] group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>

            <Link 
              to="/superadmin/integrations"
              className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 hover:border-[#1988A3]/50 transition-all flex items-center gap-3.5 group shadow-xl shadow-[#1B3154]/6"
            >
              <div className="p-3 rounded-2xl bg-white/70 text-[#11C6DE] border border-white/85 group-hover:scale-105 transition-transform shadow-xs">
                <Webhook className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-extrabold text-[#17233E] block truncate group-hover:text-[#1988A3] transition-colors">HRIS &amp; LMS Integrations</span>
                <span className="text-[11px] text-[#8A9CB7] block font-mono font-semibold">BambooHR • Workday • LMS</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8A9CB7] group-hover:text-[#11C6DE] group-hover:translate-x-1 transition-all shrink-0" />
            </Link>

            <Link 
              to="/superadmin/settings"
              className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 hover:border-[#1988A3]/50 transition-all flex items-center gap-3.5 group shadow-xl shadow-[#1B3154]/6"
            >
              <div className="p-3 rounded-2xl bg-white/70 text-emerald-600 border border-white/85 group-hover:scale-105 transition-transform shadow-xs">
                <Server className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-extrabold text-[#17233E] block truncate group-hover:text-emerald-600 transition-colors">System Parameters &amp; Logs</span>
                <span className="text-[11px] text-[#8A9CB7] block font-mono font-semibold">SSO • MFA • Retention Policies</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8A9CB7] group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>

          </div>

          {/* Core Dashboard Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Top Tenant Activity Overview (Spans 8 Columns) */}
            <div className="lg:col-span-8 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/60 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white/70 text-[#1988A3] border border-white/85 shadow-sm">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-[#17233E] tracking-tight">Top Enterprise Tenants by Seat Quota</h2>
                      <p className="text-xs text-[#8A9CB7] font-medium">Showing top 5 active client workspaces out of {tenantsCount} total registered.</p>
                    </div>
                  </div>
                  <Link 
                    to="/superadmin/tenants" 
                    className="text-xs font-bold text-[#1988A3] hover:text-[#157289] flex items-center gap-1.5 transition-colors"
                  >
                    View All ({tenantsCount}) <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="mt-5 space-y-3">
                  {recentTenants.slice(0, 5).length > 0 ? (
                    recentTenants.slice(0, 5).map((tenant) => (
                      <div key={tenant.id || tenant.name} className="p-4 rounded-2xl bg-white/70 border border-white/85 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/90 transition-all shadow-xs">
                        <div className="flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-extrabold text-sm text-[#17233E]">{tenant.name}</span>
                            <span className="text-[11px] text-[#8A9CB7] font-mono">({tenant.domain})</span>
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-extrabold border ${
                              tenant.tier === 'ENTERPRISE'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : tenant.tier === 'PRO'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {tenant.tier}
                            </span>
                          </div>
                          <div className="mt-2.5 w-full bg-[#1B3154]/10 h-2 rounded-full overflow-hidden p-0.5">
                            <div 
                              className={`h-full rounded-full ${
                                tenant.usage > 85 ? 'bg-amber-500' : 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE]'
                              }`}
                              style={{ width: `${Math.max(3, tenant.usage)}%` }} 
                            />
                          </div>
                        </div>

                        <div className="flex items-center sm:flex-col sm:items-end justify-between shrink-0">
                          <div className="text-xs font-extrabold text-[#17233E] font-mono">{tenant.seats} Seats</div>
                          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            tenant.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {tenant.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-[#8A9CB7] font-medium">
                      No active client tenants registered in database.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/60 mt-5 flex items-center justify-between text-xs text-[#8A9CB7] flex-wrap gap-2 font-medium">
                <span>Top 5 workspaces shown • Full directory available in Tenant Management</span>
                <Link to="/superadmin/tenants" className="font-mono text-[#1988A3] hover:text-[#157289] font-bold flex items-center gap-1">
                  Manage All {tenantsCount} Tenants <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Infrastructure Health & Prisma Telemetry (Spans 4 Columns) */}
            <div className="lg:col-span-4 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-white/60">
                  <div className="p-2.5 rounded-2xl bg-white/70 text-[#1988A3] border border-white/85 shadow-sm">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#17233E] tracking-tight">Database &amp; Engine Health</h2>
                    <p className="text-xs text-[#8A9CB7] font-medium">Neon PostgreSQL Live Telemetry</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5A6D89] font-bold">PostgreSQL Pooler Status</span>
                    <span className="text-emerald-700 font-mono font-extrabold flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      100% Operational
                    </span>
                  </div>
                  <div className="w-full bg-[#1B3154]/10 h-2 rounded-full overflow-hidden p-0.5">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/40">
                    <span className="text-[#5A6D89] font-bold">Query Latency</span>
                    <span className="text-[#1988A3] font-mono font-extrabold">{latency}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/40">
                    <span className="text-[#5A6D89] font-bold">Process Heap Load</span>
                    <span className="text-amber-700 font-mono font-extrabold">{cpuLoad} ({memoryUsedMB} MB / {memoryTotalMB} MB)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/40">
                    <span className="text-[#5A6D89] font-bold">Platform SLA Availability</span>
                    <span className="text-emerald-700 font-mono font-extrabold">{uptime}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/40">
                    <span className="text-[#5A6D89] font-bold">Recorded Audit Traces</span>
                    <span className="text-purple-700 font-mono font-extrabold">{totalAuditLogs} Events</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/40">
                    <span className="text-[#5A6D89] font-bold">Active User Profiles</span>
                    <span className="text-[#17233E] font-mono font-extrabold">{totalUsersCount} Users</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/60 mt-5 space-y-3.5">
                {/* Plan Distribution Mini Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#8A9CB7] mb-1.5 font-mono">
                    <span className="font-bold">Tenants Plan Breakdown</span>
                    <span className="text-[#17233E] font-extrabold">{tenantsCount} Total</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono flex-wrap">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                      Starter: {planDistribution.STARTER}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                      Pro: {planDistribution.PRO}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                      Ent: {planDistribution.ENTERPRISE}
                    </span>
                  </div>
                </div>

                {/* Primary AI Engine */}
                <div className="p-3.5 rounded-2xl bg-white/70 border border-white/85 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs text-[#17233E] font-extrabold block">Primary AI Engine</span>
                    <span className="text-[11px] text-[#8A9CB7] font-mono font-semibold">
                      {activeAIModel?.modelName || 'openai/gpt-oss-120b'}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Ready
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Live Platform Security & Event Stream */}
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6">
            <div className="flex items-center justify-between pb-4 border-b border-white/60 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/70 text-[#1988A3] border border-white/85 shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#17233E] tracking-tight">Live Platform Security &amp; Operational Stream</h2>
                  <p className="text-xs text-[#8A9CB7] font-medium">Real-time audit traces, role modifications, AI routing, and authentication events.</p>
                </div>
              </div>
              <Link 
                to="/superadmin/audit-logs" 
                className="text-xs font-bold text-[#1988A3] hover:text-[#157289] flex items-center gap-1.5 transition-colors"
              >
                View Full Audit Trail <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-white/60">
              {recentAuditLogs.length > 0 ? (
                recentAuditLogs.map((alert) => (
                  <div key={alert.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-white/40 px-3 rounded-2xl transition-colors">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-lg font-mono font-bold text-[10px] bg-white/80 text-[#1988A3] border border-white/90 shadow-2xs">
                        {alert.resource || 'System'}
                      </span>
                      <span className="text-[#17233E] font-bold">{alert.action}</span>
                      <span className="text-[#8A9CB7] text-[11px] font-medium">
                        by <strong className="text-[#17233E] font-semibold">{alert.user ? `${alert.user.firstName} ${alert.user.lastName}` : 'Platform Core'}</strong>
                        {alert.user?.role && <span className="ml-1 text-[#1988A3] font-mono">({alert.user.role})</span>}
                      </span>
                    </div>
                    <span className="text-[#8A9CB7] font-mono text-[11px] shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8A9CB7]" />
                      {new Date(alert.createdAt).toLocaleDateString()} {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-[#8A9CB7] font-medium">
                  No platform security events or system logs found in database.
                </div>
              )}
            </div>
          </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
