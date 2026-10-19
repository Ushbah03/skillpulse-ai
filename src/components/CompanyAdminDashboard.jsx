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
  Loader2,
  Network,
  Clock,
  ExternalLink,
  Sparkles
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
    <div className="flex min-h-screen bg-[#0B1120]">
      {/* Sidebar Component */}
      <CompanyAdminSidebar />

      {/* Main Content Area */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1 text-slate-100 pl-0 lg:pl-80 pt-20 lg:pt-8 p-4 md:p-8 w-full font-sans"
      >
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                Tenant Control Tower
              </h1>
              <motion.span 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {dashboardData?.tenantName || "Workspace"}
              </motion.span>
            </div>
            <p className="text-slate-400 text-sm">
              Live telemetry of license consumption, workforce competency readiness, and active enterprise integrations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/company-admin/users')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200"
            >
              <UserPlus className="w-4 h-4" />
              Provision User
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={syncing}
              onClick={handleTriggerSync}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold shadow-sm transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Trigger Sync'}
            </motion.button>
          </div>
        </div>

        {/* Sync Notification Banner */}
        <AnimatePresence>
          {syncNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium ${
                syncNotice.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {syncNotice.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span>{syncNotice.message}</span>
              </div>
              <button 
                onClick={() => setSyncNotice(null)}
                className="text-xs uppercase tracking-wider opacity-60 hover:opacity-100"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold text-slate-400">Loading tenant telemetry directly from database...</p>
          </div>
        ) : (
          <>
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Seats & Licenses */}
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Seat Allocation</span>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">{totalUsers}</span>
              <span className="text-sm font-medium text-slate-400">/ {maxUsers} Seats</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${licensePct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" 
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5 flex items-center justify-between">
              <span className="text-emerald-400 font-semibold">{remainingSeats} seats available</span>
              <span className="text-slate-500 font-medium uppercase text-[10px] tracking-wide">{dashboardData?.plan || 'PRO'} Tier</span>
            </p>
          </motion.div>

          {/* Card 2: Skill Index */}
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Workforce Readiness</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">{dashboardData?.readinessPct ?? 0}%</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> DB Computed
              </span>
            </div>
            <p className="text-xs text-slate-400">Mean proficiency across assessed member skills</p>
          </motion.div>

          {/* Card 3: Enterprise Connectors */}
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise Connectors</span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Network className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">{activeIntegrationsCount}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {dashboardData?.integrationsCount ?? 0} connectors configured for workspace
            </p>
          </motion.div>

          {/* Card 4: LMS Catalog */}
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Course Catalog</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">{dashboardData?.courseCount ?? 0}</span>
              <span className="text-sm text-slate-400">Courses</span>
            </div>
            <p className="text-xs text-slate-400">Indexed in workspace learning catalog</p>
          </motion.div>

        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Chart 1: Active User Growth (2 Cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Monthly User Onboarding & Seat Utilization
                </h3>
                <p className="text-xs text-slate-400">Cumulative member count registered year-to-date (elapsed months only)</p>
              </div>
              <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg font-medium border border-indigo-500/20">
                YTD {new Date().getFullYear()}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activeColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'active' ? 'Registered Users' : 'Capacity']}
                    contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                  />
                  <Area type="monotone" dataKey="active" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#activeColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: Skill Completion by Department (1 Col) */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Department Competency Rates
              </h3>
              <p className="text-xs text-slate-400">Mean skill proficiency achieved per team</p>
            </div>

            {deptSkillCompletion.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptSkillCompletion} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                    <XAxis type="number" stroke="#64748B" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="dept" type="category" stroke="#94A3B8" fontSize={11} width={85} tickLine={false} />
                    <Tooltip 
                      formatter={(val, name, props) => [
                        `${val}%`, 
                        `Competency (${props.payload.memberCount} members, ${props.payload.skillsCount} skills)`
                      ]}
                      contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                    />
                    <Bar dataKey="rate" fill="#818CF8" radius={[0, 6, 6, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-500">No department competency evaluations recorded yet.</p>
              </div>
            )}
          </motion.div>

        </div>

        {/* Recent Tenant System Activity & Integration Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Live Integration Status Panel */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-400" /> Connected Enterprise Hubs
              </h3>
              <button 
                onClick={() => navigate('/company-admin/integrations')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
              >
                Configure Hubs <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Primary DB Hub */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1E293B]/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">PostgreSQL Prisma Data Hub</p>
                    <p className="text-[11px] text-slate-400">Primary Tenant Data Storage & Schema Engine</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Connected
                </span>
              </div>

              {/* Real Tenant Integrations from DB */}
              {integrations.length > 0 ? (
                integrations.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#1E293B]/50 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{item.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.configJson?.category || 'Enterprise Hub'} • {item.lastSyncAt ? `Synced ${new Date(item.lastSyncAt).toLocaleDateString()}` : 'Configured'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                      item.status === 'ACTIVE'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-slate-400 bg-slate-800 border-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#1E293B]/30 border border-slate-800/60 text-center">
                  <p className="text-xs text-slate-400 mb-2">No external third-party integrations configured for this workspace.</p>
                  <button
                    onClick={() => navigate('/company-admin/integrations')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    + Add Enterprise Connector
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Security & Audit Feed Summary */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" /> Recent Security & Audit Events
              </h3>
              <button 
                onClick={() => navigate('/company-admin/settings')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
              >
                View Full Trail <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentAuditLogs.length > 0 ? (
                recentAuditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-[#1E293B]/50 border border-slate-800 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-200 truncate">{log.action}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {log.user ? `${log.user.firstName} ${log.user.lastName} (${log.user.email})` : 'System Action'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No recent audit events recorded in database.
                </div>
              )}
            </div>
          </motion.div>

        </div>
        </>
        )}
      </motion.div>
    </div>
  );
};

export default CompanyAdminDashboard;