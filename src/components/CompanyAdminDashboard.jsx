import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowUpRight, 
  UserPlus, 
  Settings, 
  Layers, 
  Zap, 
  Database, 
  Activity, 
  ShieldAlert,
  Loader2
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
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await adminAPI.getDashboard();
        if (isMounted && res?.success) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.warn('Failed to load admin dashboard stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  const totalUsers = dashboardData?.totalUsersCount || 0;
  const maxUsers = dashboardData?.maxUsers || 100;
  const activeUsers = dashboardData?.activeUsersCount || 0;
  const remainingSeats = Math.max(0, maxUsers - totalUsers);
  const licensePct = Math.min(100, Math.round((totalUsers / maxUsers) * 100));

  const userActivityData = dashboardData?.userActivityData || [];
  const deptSkillCompletion = dashboardData?.deptSkillCompletion || [];

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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
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
        className="flex-1 text-slate-100 p-8 pl-80 font-sans"
      >
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Tenant Control Tower
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {dashboardData?.tenantName || "Enterprise Workspace"}
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Overview of license consumption, workforce readiness, and platform integration health.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/company-admin/users')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
            >
              <UserPlus className="w-4 h-4" />
              Provision User
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/company-admin/integrations')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              Trigger Sync
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold text-slate-400">Loading tenant control stats from database...</p>
          </div>
        ) : (
          <>
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Seats & Licenses */}
          <motion.div variants={itemVariants} className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">License Usage</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">{totalUsers}</span>
              <span className="text-sm font-medium text-slate-400">/ {maxUsers} Seats</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${licensePct}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">{remainingSeats} seats remaining</span> in {dashboardData?.plan || 'PRO'} tier
            </p>
          </motion.div>

          {/* Card 2: Skill Index */}
          <motion.div variants={itemVariants} className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tenant Readiness</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">{dashboardData?.readinessPct ?? 0}%</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> DB Computed
              </span>
            </div>
            <p className="text-xs text-slate-400">Average proficiency across user skills</p>
          </motion.div>

          {/* Card 3: HRIS Integration Health */}
          <motion.div variants={itemVariants} className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">HRIS Connector</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-white">Database Direct</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400">PostgreSQL Prisma Engine</p>
          </motion.div>

          {/* Card 4: LMS Catalog */}
          <motion.div variants={itemVariants} className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Course Catalog</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">{dashboardData?.courseCount ?? 0}</span>
              <span className="text-sm text-slate-400">Courses</span>
            </div>
            <p className="text-xs text-slate-400">Indexed in database catalog</p>
          </motion.div>

        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Chart 1: Active User Growth (2 Cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Monthly Active User Engagement</h3>
                <p className="text-xs text-slate-400">Active seat usage over total allocated tier capacity</p>
              </div>
              <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg font-medium border border-indigo-500/20">
                H2 2026 Metrics
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
                    contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                  />
                  <Area type="monotone" dataKey="active" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#activeColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: Skill Completion by Department (1 Col) */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="mb-6">
              <h3 className="text-base font-bold text-white">Department Competency Rates</h3>
              <p className="text-xs text-slate-400">Target skill benchmark completion per dept</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptSkillCompletion} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                  <XAxis type="number" stroke="#64748B" fontSize={10} domain={[0, 100]} />
                  <YAxis dataKey="dept" type="category" stroke="#94A3B8" fontSize={11} width={80} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                  />
                  <Bar dataKey="rate" fill="#3B82F6" radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* Recent Tenant System Activity & Integration Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Live Integration Status Panel */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" /> Connected Enterprise Hubs
              </h3>
              <button 
                onClick={() => navigate('/company-admin/integrations')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Configure Hubs →
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1E293B]/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">PostgreSQL Prisma Data Hub</p>
                    <p className="text-[11px] text-slate-400">Primary Tenant Data Storage Engine</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Connected
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#1E293B]/30 border border-slate-800/60 text-center">
                <p className="text-xs text-slate-400 mb-2">No external HRIS or LMS integrations linked.</p>
                <button
                  onClick={() => navigate('/company-admin/integrations')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  + Add Enterprise Connector
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security & Audit Feed Summary */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" /> Recent Audit Events
              </h3>
              <button 
                onClick={() => navigate('/company-admin/settings')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                View Full Trail →
              </button>
            </div>

            <div className="space-y-3">
              {dashboardData?.recentAuditLogs?.length > 0 ? (
                dashboardData.recentAuditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-[#1E293B]/50 border border-slate-800 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{log.action}</p>
                      <p className="text-xs text-slate-400">
                        {log.user ? `${log.user.firstName} ${log.user.lastName} (${log.user.email})` : 'System Action'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
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