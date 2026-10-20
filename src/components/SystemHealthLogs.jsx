import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  RefreshCw, 
  Filter, 
  Terminal, 
  Clock,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Check,
  Eye,
  X,
  Shield,
  Database,
  Radio,
  Sparkles,
  Building2
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const SystemHealthLogs = () => {
  const [logs, setLogs] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [tenantFilter, setTenantFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal / Inspection state
  const [selectedLog, setSelectedLog] = useState(null);
  const [copiedTrace, setCopiedTrace] = useState(false);

  const fetchLogsAndTelemetry = async () => {
    try {
      const [auditRes, telemetryRes] = await Promise.allSettled([
        adminAPI.getAuditLogs(),
        adminAPI.getGlobalTelemetry()
      ]);

      if (auditRes.status === 'fulfilled' && auditRes.value?.success && auditRes.value.data) {
        const mapped = auditRes.value.data.map(log => {
          const actionUpper = (log.action || '').toUpperCase();
          const level = actionUpper.includes('ERROR') || actionUpper.includes('FAIL') 
            ? 'ERROR' 
            : actionUpper.includes('WARN') || actionUpper.includes('SUSPEND')
            ? 'WARN' 
            : 'INFO';

          const userText = log.user 
            ? `${log.user.firstName || ''} ${log.user.lastName || ''} (${log.user.email || ''})`.trim()
            : 'System Kernel / Background Task';

          return {
            id: `LOG-${log.id.slice(-6).toUpperCase()}`,
            rawId: log.id,
            timestamp: new Date(log.createdAt).toLocaleString(),
            isoDate: log.createdAt,
            level,
            service: log.resource || 'System-Core',
            action: log.action,
            message: log.action,
            userText,
            userRole: log.user?.role || 'SYSTEM',
            tenant: log.tenant?.name || 'Global Platform',
            tenantSlug: log.tenant?.slug || 'global',
            details: log.details || {},
            ipAddress: log.ipAddress || '127.0.0.1 (Internal Mesh)'
          };
        });
        setLogs(mapped);
      }

      if (telemetryRes.status === 'fulfilled' && telemetryRes.value?.success && telemetryRes.value.telemetry) {
        setTelemetry(telemetryRes.value.telemetry);
      }
    } catch (err) {
      console.warn('Failed to load system audit logs or telemetry:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogsAndTelemetry();
  }, []);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, levelFilter, tenantFilter, pageSize]);

  // Extract unique tenant names for filter dropdown
  const uniqueTenants = useMemo(() => {
    const set = new Set();
    logs.forEach(l => {
      if (l.tenant) set.add(l.tenant);
    });
    return Array.from(set).sort();
  }, [logs]);

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.userText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === 'All' || log.level === levelFilter;
      const matchesTenant = tenantFilter === 'All' || log.tenant === tenantFilter;
      return matchesSearch && matchesLevel && matchesTenant;
    });
  }, [logs, searchTerm, levelFilter, tenantFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredLogs.length);
  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, startIndex, endIndex]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLogsAndTelemetry();
  };

  // Export CSV Feature (Box 7 in View Global Audit Logs & Activity.drawio)
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Log ID', 'Timestamp', 'Level', 'Service', 'Action / Event', 'Tenant', 'User', 'IP Address'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.level}"`,
      `"${l.service}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      `"${l.tenant}"`,
      `"${l.userText.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skillpulse_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyJSON = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120] relative overflow-hidden">
      {/* Lively Ambient Background Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full font-sans relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-indigo-400" />
              System Health & Operational Telemetry
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time platform event logs, API query latency, database node telemetry, and audit trail stream.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Box 7 in View Global Audit Logs & Activity: Export CSV Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportCSV}
              disabled={filteredLogs.length === 0}
              title="Export filtered audit logs as CSV spreadsheet"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700/80 text-xs font-semibold shadow-md transition-all duration-200"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Telemetry'}</span>
            </motion.button>
          </div>
        </div>

        {/* System Health Status Cards (100% Real Live Database Metrics) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <motion.div 
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800/80 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Global System Uptime</p>
              <Server className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              {telemetry ? telemetry.uptime : <Loader2 className="w-5 h-5 animate-spin text-slate-500" />}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Calculated across all enterprise tenants</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800/80 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Avg. Query Latency</p>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-1">
              {telemetry ? telemetry.latency : <Loader2 className="w-5 h-5 animate-spin text-slate-500" />}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">PostgreSQL database round-trip speed</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800/80 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Audit Error Ratio</p>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {telemetry ? telemetry.aiErrorRate : <Loader2 className="w-5 h-5 animate-spin text-slate-500" />}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Error actions vs total event traces</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800/80 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Server Heap Load</p>
              <Cpu className="w-4 h-4 text-indigo-300" />
            </div>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">
              {telemetry ? telemetry.cpuLoad : <Loader2 className="w-5 h-5 animate-spin text-slate-500" />}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Node.js process memory allocation</p>
          </motion.div>
        </div>

        {/* Search & Global Filter Constraints (Box 5 in View Global Audit Logs & Activity.drawio) */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search trace ID, action, user, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter by Tenant */}
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Workspace:</span>
              <select 
                value={tenantFilter}
                onChange={(e) => setTenantFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="All" className="bg-[#0F172A]">All Tenants</option>
                {uniqueTenants.map((t) => (
                  <option key={t} value={t} className="bg-[#0F172A]">{t}</option>
                ))}
              </select>
            </div>

            {/* Filter by Severity */}
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Severity:</span>
              <select 
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Levels</option>
                <option value="INFO" className="bg-[#0F172A]">INFO</option>
                <option value="WARN" className="bg-[#0F172A]">WARN</option>
                <option value="ERROR" className="bg-[#0F172A]">ERROR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Terminal Style System Log Feed */}
        <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-[#1E293B]/70 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>live_operational_telemetry.log</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Streaming Realtime ({logs.length} Events Logged)
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-xs text-slate-400 mt-3 font-sans">Querying real-time system audit logs from database...</p>
              </div>
            ) : paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <motion.div 
                  key={log.id}
                  whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.4)' }}
                  className="p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      log.level === 'ERROR' 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                        : log.level === 'WARN'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {log.level}
                    </span>

                    <span className="text-slate-500 shrink-0 text-[11px]">{log.timestamp}</span>

                    <span className="text-indigo-300 font-semibold shrink-0">
                      [{log.service}]
                    </span>

                    <p className="text-slate-300 truncate font-sans text-xs flex-1">
                      {log.action}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 justify-between md:justify-end">
                    <span className="text-[11px] text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-lg">
                      {log.tenant}
                    </span>

                    <button
                      onClick={() => setSelectedLog(log)}
                      title="Inspect Log Trace Details"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-16 text-center text-slate-500 font-sans text-xs">
                No system audit events match the active search or filter criteria.
              </div>
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          <div className="p-4 bg-[#1E293B]/40 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans">
            <div className="flex items-center gap-4">
              <span>
                Showing <span className="font-bold text-white">{filteredLogs.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-white">{endIndex}</span> of <span className="font-bold text-white">{filteredLogs.length}</span> event traces
              </span>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-[#1E293B] border border-slate-700 text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination Navigation */}
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
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

      </main>

      {/* Log Details Inspector Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Event Trace Details</span>
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {selectedLog.id}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">{selectedLog.timestamp}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-3 bg-[#1E293B]/70 p-3.5 rounded-xl border border-slate-700/60">
                  <div>
                    <span className="text-slate-500 font-semibold block uppercase text-[10px]">Action Resource</span>
                    <span className="text-white font-mono font-bold mt-0.5 block">{selectedLog.service}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block uppercase text-[10px]">Severity Level</span>
                    <span className={`inline-block font-mono font-bold mt-0.5 ${
                      selectedLog.level === 'ERROR' ? 'text-rose-400' :
                      selectedLog.level === 'WARN' ? 'text-amber-400' : 'text-indigo-400'
                    }`}>{selectedLog.level}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block uppercase text-[10px]">Workspace Tenant</span>
                    <span className="text-slate-300 font-bold mt-0.5 block">{selectedLog.tenant}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block uppercase text-[10px]">Initiator User</span>
                    <span className="text-slate-300 font-mono truncate block mt-0.5">{selectedLog.userText}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase text-slate-400">Structured Payload Trace (JSON)</span>
                    <button
                      onClick={() => handleCopyJSON(selectedLog.details)}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {copiedTrace ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTrace ? 'Copied' : 'Copy Payload'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-56">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Close Trace
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SystemHealthLogs;
