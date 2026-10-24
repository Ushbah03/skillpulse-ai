import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowUpRight, 
  UserPlus, 
  Layers, 
  Zap, 
  Database, 
  Activity, 
  ShieldAlert, 
  Network, 
  Clock, 
  ExternalLink, 
  Sparkles,
  Building2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

const CompanyAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await adminAPI.getDashboard();
      if (res?.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.warn('Failed to load admin dashboard stats:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  const handleTriggerSync = async () => {
    setSyncing(true);
    setSyncNotice(null);
    try {
      const res = await adminAPI.triggerIntegrationSync();
      if (res?.success) {
        setSyncNotice({ type: 'success', message: 'All active enterprise connectors synchronized with database!' });
        await fetchDashboard(true);
      } else {
        setSyncNotice({ type: 'error', message: res?.message || 'Sync failed.' });
      }
    } catch (err) {
      setSyncNotice({ type: 'error', message: err?.message || 'Failed to trigger synchronization.' });
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const totalUsers = dashboardData?.totalUsersCount || 0;
  const maxUsers = dashboardData?.maxUsers || 0;
  const activeUsers = dashboardData?.activeUsersCount || 0;
  const remainingSeats = Math.max(0, maxUsers - totalUsers);
  const licensePct = maxUsers > 0 ? Math.min(100, Math.round((totalUsers / maxUsers) * 100)) : 0;

  const userActivityData = dashboardData?.userActivityData || [];
  const deptSkillCompletion = dashboardData?.deptSkillCompletion || [];
  const integrations = dashboardData?.integrations || [];
  const activeIntegrationsCount = dashboardData?.activeIntegrationsCount ?? 0;
  const recentAuditLogs = dashboardData?.recentAuditLogs || [];

  // Container Animation Variant
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, staggerChildren: 0.08 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

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

      {/* Sidebar Component */}
      <CompanyAdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full relative z-10 space-y-8">
        {/* Header Banner */}
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E] flex items-center gap-2.5">
                Tenant <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Control Tower</span>
              </h1>
              <motion.span 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1 text-xs font-bold rounded-xl bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/25 flex items-center gap-1.5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE] animate-pulse" />
                {dashboardData?.tenantName || "Workspace"}
              </motion.span>
            </div>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium">
              Live telemetry of license consumption, workforce competency readiness, and active enterprise integrations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/company-admin/users')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Provision User
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={syncing}
              onClick={handleTriggerSync}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-[#17233E] border border-white/85 text-sm font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-[#1988A3] ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Trigger Sync'}
            </motion.button>
          </div>
        </header>

        {/* Sync Notification Banner */}
        <AnimatePresence>
          {syncNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-semibold shadow-md ${
                syncNotice.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {syncNotice.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{syncNotice.message}</span>
              </div>
              <button 
                onClick={() => setSyncNotice(null)}
                className="text-xs uppercase tracking-wider font-bold opacity-60 hover:opacity-100 cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <SkillPulseLoader message="Querying Enterprise Tenant Telemetry..." fullScreen={false} />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Seats & Licenses */}
              <motion.div 
                variants={itemVariants} 
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Seat Allocation</span>
                  <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-extrabold text-[#17233E]">{totalUsers}</span>
                  <span className="text-sm font-semibold text-[#8A9CB7]">/ {maxUsers} Seats</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-[#1B3154]/10 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${licensePct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] h-full rounded-full" 
                  />
                </div>
                <p className="text-xs text-[#8A9CB7] mt-3 flex items-center justify-between font-semibold">
                  <span className="text-emerald-600">{remainingSeats} seats available</span>
                  <span className="text-[#1988A3] uppercase text-[10px] tracking-wide font-bold">{dashboardData?.plan || 'PRO'} Tier</span>
                </p>
              </motion.div>

              {/* Card 2: Skill Index */}
              <motion.div 
                variants={itemVariants} 
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Workforce Readiness</span>
                  <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-emerald-600 shadow-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-extrabold text-[#17233E]">{dashboardData?.readinessPct ?? 0}%</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" /> DB Computed
                  </span>
                </div>
                <p className="text-xs text-[#8A9CB7] font-medium">Mean proficiency across assessed member skills</p>
              </motion.div>

              {/* Card 3: Enterprise Connectors */}
              <motion.div 
                variants={itemVariants} 
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Enterprise Connectors</span>
                  <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                    <Network className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-extrabold text-[#17233E]">{activeIntegrationsCount}</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#8A9CB7] font-medium">
                  {dashboardData?.integrationsCount ?? 0} connectors configured for workspace
                </p>
              </motion.div>

              {/* Card 4: LMS Catalog */}
              <motion.div 
                variants={itemVariants} 
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Course Catalog</span>
                  <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#11C6DE] shadow-sm">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-extrabold text-[#17233E]">{dashboardData?.courseCount ?? 0}</span>
                  <span className="text-sm font-semibold text-[#8A9CB7]">Courses</span>
                </div>
                <p className="text-xs text-[#8A9CB7] font-medium">Indexed in workspace learning catalog</p>
              </motion.div>

            </div>

            {/* Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: Active User Growth (2 Cols) */}
              <motion.div variants={itemVariants} className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-[#17233E] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#1988A3]" />
                      Monthly User Onboarding & Seat Utilization
                    </h3>
                    <p className="text-xs text-[#8A9CB7] font-medium mt-0.5">Cumulative member count registered year-to-date (elapsed months only)</p>
                  </div>
                  <span className="text-xs text-[#1988A3] bg-[#1988A3]/10 px-3 py-1 rounded-xl font-bold border border-[#1988A3]/20">
                    YTD {new Date().getFullYear()}
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="activeColorAdmin" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1988A3" stopOpacity={0.45}/>
                          <stop offset="95%" stopColor="#11C6DE" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,49,84,0.08)" />
                      <XAxis dataKey="month" stroke="#8A9CB7" fontSize={12} tickLine={false} />
                      <YAxis stroke="#8A9CB7" fontSize={12} tickLine={false} />
                      <Tooltip 
                        formatter={(value, name) => [value, name === 'active' ? 'Registered Users' : 'Capacity']}
                        contentStyle={{ backgroundColor: '#17233E', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', color: '#FFF' }}
                      />
                      <Area type="monotone" dataKey="active" stroke="#1988A3" strokeWidth={3} fillOpacity={1} fill="url(#activeColorAdmin)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Chart 2: Skill Completion by Department (1 Col) */}
              <motion.div variants={itemVariants} className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between">
                <div className="mb-4">
                  <h3 className="text-base font-extrabold text-[#17233E] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1988A3]" />
                    Department Competency Rates
                  </h3>
                  <p className="text-xs text-[#8A9CB7] font-medium mt-0.5">Mean skill proficiency achieved per team</p>
                </div>

                {deptSkillCompletion.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptSkillCompletion} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,49,84,0.08)" horizontal={false} />
                        <XAxis type="number" stroke="#8A9CB7" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <YAxis dataKey="dept" type="category" stroke="#17233E" fontSize={11} width={85} tickLine={false} />
                        <Tooltip 
                          formatter={(val, name, props) => [
                            `${val}%`, 
                            `Competency (${props.payload.memberCount} members, ${props.payload.skillsCount} skills)`
                          ]}
                          contentStyle={{ backgroundColor: '#17233E', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', color: '#FFF' }}
                        />
                        <Bar dataKey="rate" fill="#1988A3" radius={[0, 8, 8, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-[#1B3154]/20 rounded-2xl bg-white/40">
                    <p className="text-xs text-[#8A9CB7] font-medium">No department competency evaluations recorded yet.</p>
                  </div>
                )}
              </motion.div>

            </div>

            {/* Recent Tenant System Activity & Integration Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Live Integration Status Panel */}
              <motion.div variants={itemVariants} className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-[#17233E] flex items-center gap-2">
                    <Network className="w-4 h-4 text-[#1988A3]" /> Connected Enterprise Hubs
                  </h3>
                  <button 
                    onClick={() => navigate('/company-admin/integrations')}
                    className="text-xs text-[#1988A3] hover:text-[#157289] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Configure Hubs <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Primary DB Hub */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/85 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <p className="text-sm font-bold text-[#17233E]">PostgreSQL Prisma Data Hub</p>
                        <p className="text-[11px] text-[#8A9CB7]">Primary Tenant Data Storage & Schema Engine</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/25">
                      Connected
                    </span>
                  </div>

                  {/* Real Tenant Integrations from DB */}
                  {integrations.length > 0 ? (
                    integrations.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/85 shadow-sm hover:border-[#1988A3]/50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          <div>
                            <p className="text-sm font-bold text-[#17233E]">{item.name}</p>
                            <p className="text-[11px] text-[#8A9CB7]">
                              {item.configJson?.category || 'Enterprise Hub'} • {item.lastSyncAt ? `Synced ${new Date(item.lastSyncAt).toLocaleDateString()}` : 'Configured'}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                          item.status === 'ACTIVE'
                            ? 'text-emerald-700 bg-emerald-500/15 border-emerald-500/25'
                            : 'text-[#8A9CB7] bg-white/80 border-slate-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-2xl bg-white/40 border border-dashed border-[#1B3154]/20 text-center">
                      <p className="text-xs text-[#8A9CB7] font-medium mb-2">No external third-party integrations configured for this workspace.</p>
                      <button
                        onClick={() => navigate('/company-admin/integrations')}
                        className="text-xs text-[#1988A3] hover:text-[#157289] font-bold cursor-pointer"
                      >
                        + Add Enterprise Connector
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Security & Audit Feed Summary */}
              <motion.div variants={itemVariants} className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-[#17233E] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#1988A3]" /> Recent Security & Audit Events
                  </h3>
                  <button 
                    onClick={() => navigate('/company-admin/settings')}
                    className="text-xs text-[#1988A3] hover:text-[#157289] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    View Full Trail <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {recentAuditLogs.length > 0 ? (
                    recentAuditLogs.map((log) => (
                      <div key={log.id} className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/85 shadow-sm hover:border-[#1988A3]/50 transition-all flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#17233E] truncate">{log.action}</p>
                          <p className="text-xs text-[#8A9CB7] truncate">
                            {log.user ? `${log.user.firstName} ${log.user.lastName} (${log.user.email})` : 'System Action'}
                          </p>
                        </div>
                        <span className="text-[10px] text-[#8A9CB7] font-mono shrink-0 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-[#1988A3]" />
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-[#8A9CB7] font-medium border border-dashed border-[#1B3154]/20 rounded-2xl bg-white/40">
                      No recent audit events recorded in database.
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CompanyAdminDashboard;
