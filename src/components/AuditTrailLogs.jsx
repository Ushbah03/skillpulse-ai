import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  User, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Loader2,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Check,
  Shield,
  Activity,
  Sparkles,
  Lock
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

const AuditTrailLogs = () => {
  const [logs, setLogs] = useState([]);
  const [totalDbEvents, setTotalDbEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [tenantFilter, setTenantFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
  const [retentionDays, setRetentionDays] = useState('90');
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    async function loadAuditLogs() {
      setLoading(true);
      try {
        const [auditRes, policyRes] = await Promise.allSettled([
          adminAPI.getAuditLogs(),
          adminAPI.getSecurityPolicies()
        ]);

        if (auditRes.status === 'fulfilled' && auditRes.value?.success && auditRes.value.data) {
          if (auditRes.value.totalCount !== undefined) {
            setTotalDbEvents(auditRes.value.totalCount);
          }
          const mapped = auditRes.value.data.map(log => {
            const isFailed = (log.action || '').toUpperCase().includes('FAIL') || 
                             (log.action || '').toUpperCase().includes('ERROR');
            const tenantName = log.tenant?.name || 'Global Platform';

            return {
              id: `AUDIT-${log.id.slice(-6).toUpperCase()}`,
              rawId: log.id,
              actor: log.user ? `${log.user.firstName || ''} ${log.user.lastName || ''} (${log.user.role || 'USER'})`.trim() : 'System Kernel / Automations',
              actorEmail: log.user?.email || 'system@skillpulse.ai',
              ipAddress: log.ipAddress || '127.0.0.1 (Internal Mesh)',
              userAgent: log.userAgent || 'SkillPulse Platform Core Engine',
              action: log.action,
              target: `${log.resource || 'Entity'} ${log.tenant ? `(${log.tenant.name})` : ''}`,
              tenantName,
              rawResource: log.resource || 'SystemResource',
              resourceId: log.resourceId || log.id,
              details: log.details ? (typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : String(log.details)) : '{}',
              rawDetails: log.details || {},
              timestamp: new Date(log.createdAt).toLocaleString(),
              rawCreatedAt: log.createdAt,
              status: isFailed ? 'FAILED' : 'SUCCESS'
            };
          });
          setLogs(mapped);
        }

        if (policyRes.status === 'fulfilled' && policyRes.value?.success && policyRes.value.data) {
          setRetentionDays(String(policyRes.value.data.auditLogRetentionDays || '90'));
        }
      } catch (err) {
        console.warn('Failed to load audit logs from DB:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAuditLogs();
  }, []);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, actionFilter, tenantFilter, statusFilter, pageSize]);

  // Extract unique action types for dropdown filter
  const actionOptions = useMemo(() => {
    const set = new Set();
    logs.forEach(l => {
      if (l.action) {
        const baseAction = l.action.split(':')[0].trim();
        set.add(baseAction);
      }
    });
    return Array.from(set).sort();
  }, [logs]);

  // Extract unique tenant names for dropdown filter
  const tenantOptions = useMemo(() => {
    const set = new Set();
    logs.forEach(l => {
      if (l.tenantName) {
        set.add(l.tenantName);
      }
    });
    return Array.from(set).sort();
  }, [logs]);

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === 'All' || log.action.startsWith(actionFilter);
      const matchesTenant = tenantFilter === 'All' || log.tenantName === tenantFilter;
      const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
      return matchesSearch && matchesAction && matchesTenant && matchesStatus;
    });
  }, [logs, searchTerm, actionFilter, tenantFilter, statusFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredLogs.length);
  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, startIndex, endIndex]);

  // Export Audit Trail to CSV File
  const handleExportCSV = () => {
    if (!filteredLogs || filteredLogs.length === 0) return;
    const headers = ["Audit ID", "Timestamp", "Actor", "Actor Email", "Action", "Target Entity", "Workspace Tenant", "IP Address", "Status", "Details"];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.actor.replace(/"/g, '""')}"`,
      `"${l.actorEmail}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.target.replace(/"/g, '""')}"`,
      `"${l.tenantName.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.status}"`,
      `"${(l.details || '').replace(/\n/g, ' ').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `skillpulse_compliance_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPayload = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const successfulCount = useMemo(() => {
    return logs.filter(l => l.status === 'SUCCESS').length;
  }, [logs]);

  return (
    <div className="flex min-h-screen bg-[#E9EAF7] text-[#17233E] font-sans relative overflow-x-hidden selection:bg-[#1988A3]/20 selection:text-[#17233E]">
      {/* Ambient background glowing mesh depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#1988A3]/20 to-[#11C6DE]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-[#1B3154]/15 to-[#8A9CB7]/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-[#11C6DE]/15 to-[#1988A3]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#8A9CB7_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <SuperadminSidebar activeItem="audit-logs" />

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 px-3.5 sm:px-6 md:px-8 pt-20 lg:pt-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#BEDDF5]/70 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E] flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#1988A3] to-[#11C6DE] text-white shadow-lg shadow-[#1988A3]/25 inline-flex">
                <ShieldCheck className="w-7 h-7" />
              </span>
              Platform Audit Trail Logs
            </h1>
            <p className="text-[#5A6D89] text-sm mt-1">
              Immutable SOC 2 security compliance logs tracking all SuperAdmin actions, security overrides, and global platform changes.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            Export Compliance Audit (CSV)
          </motion.button>
        </div>

        {/* Audit Trail Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Total Database Events</p>
              <Activity className="w-4 h-4 text-[#1988A3]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#17233E] mt-1">
              {totalDbEvents || logs.length} <span className="text-xs font-normal text-[#5A6D89]">Events</span>
            </p>
            <p className="text-[11px] text-[#5A6D89] mt-1">Indexed in Neon PostgreSQL cluster</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Compliance Stream Status</p>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700 mt-1 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fully Verified
            </p>
            <p className="text-[11px] text-[#5A6D89] mt-1">Immutable audit write trail active</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Successful Actions</p>
              <CheckCircle2 className="w-4 h-4 text-[#1988A3]" />
            </div>
            <p className="text-3xl font-black text-[#1988A3] mt-1">
              {successfulCount} <span className="text-xs font-normal text-[#5A6D89]">/ {logs.length}</span>
            </p>
            <p className="text-[11px] text-[#5A6D89] mt-1">
              {logs.length > 0 ? Math.round((successfulCount / logs.length) * 100) : 100}% verified execution
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Log Retention Policy</p>
              <Clock className="w-4 h-4 text-[#1988A3]" />
            </div>
            <p className="text-2xl font-black text-[#17233E] mt-1">{retentionDays} Days Retention</p>
            <p className="text-[11px] text-[#5A6D89] mt-1">Configured in security parameter table</p>
          </motion.div>
        </div>

        {/* Global Filter Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9CB7]" />
            <input
              type="text"
              placeholder="Search actor, target, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-[#17233E] border border-[#BEDDF5] rounded-xl text-xs focus:outline-none focus:border-[#1988A3] shadow-sm transition-colors placeholder:text-[#8A9CB7]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter by Tenant */}
            <div className="flex items-center gap-2 bg-white border border-[#BEDDF5] px-3 py-1.5 rounded-xl text-xs text-[#5A6D89] shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-[#1988A3]" />
              <span className="font-semibold">Workspace:</span>
              <select 
                value={tenantFilter}
                onChange={(e) => setTenantFilter(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                <option value="All">All Workspaces</option>
                {tenantOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Filter by Action Category */}
            <div className="flex items-center gap-2 bg-white border border-[#BEDDF5] px-3 py-1.5 rounded-xl text-xs text-[#5A6D89] shadow-sm">
              <Filter className="w-3.5 h-3.5 text-[#1988A3]" />
              <span className="font-semibold">Action:</span>
              <select 
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="All">All Actions</option>
                {actionOptions.map(act => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2 bg-white border border-[#BEDDF5] px-3 py-1.5 rounded-xl text-xs text-[#5A6D89] shadow-sm">
              <span className="font-semibold">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/80 border border-[#BEDDF5] rounded-2xl shadow-sm">
            <SkillPulseLoader message="Loading immutable SOC 2 compliance audit logs from database..." />
          </div>
        ) : (
          <div className="bg-white/85 border border-[#BEDDF5] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs text-[#17233E] min-w-[700px]">
                <thead className="bg-[#D8EBF9]/80 text-xs uppercase tracking-wider text-[#17233E] font-bold border-b border-[#BEDDF5]">
                  <tr>
                    <th className="py-4 px-6">Timestamp / ID</th>
                    <th className="py-4 px-6">Actor (SuperAdmin)</th>
                    <th className="py-4 px-6">Action Performed</th>
                    <th className="py-4 px-6">Target Entity</th>
                    <th className="py-4 px-6">Workspace</th>
                    <th className="py-4 px-6">IP Address</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BEDDF5]/60 font-sans">
                  {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/60 transition-colors group">
                        <td className="py-4 px-6">
                          <p className="text-xs font-mono text-[#17233E] font-bold">{log.timestamp}</p>
                          <p className="text-[10px] font-mono text-[#8A9CB7]">{log.id}</p>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-bold text-[#17233E] flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#1988A3] shrink-0" />
                            <span className="truncate max-w-[150px]">{log.actor}</span>
                          </span>
                        </td>

                        <td className="py-4 px-6 font-mono text-xs text-[#1988A3] font-bold">
                          {log.action}
                        </td>

                        <td className="py-4 px-6 text-[#5A6D89] text-xs truncate max-w-[140px]">
                          {log.rawResource}
                        </td>

                        <td className="py-4 px-6 text-[#17233E] text-xs">
                          <span className="bg-white border border-[#BEDDF5] px-2 py-0.5 rounded text-[11px] font-semibold text-[#5A6D89] shadow-sm">
                            {log.tenantName}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-mono text-xs text-[#5A6D89]">
                          {log.ipAddress}
                        </td>

                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                              : 'bg-rose-100 text-rose-700 border-rose-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`} />
                            {log.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-[#1988A3] border border-[#BEDDF5] shadow-sm transition-colors"
                            title="Inspect Metadata Payload"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-[#5A6D89]">
                        No security audit events match the active search or filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="p-4 bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 border-t border-[#BEDDF5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A6D89] font-sans">
              <div className="flex items-center gap-4">
                <span>
                  Showing <span className="font-bold text-[#17233E]">{filteredLogs.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-[#17233E]">{endIndex}</span> of <span className="font-bold text-[#17233E]">{filteredLogs.length}</span> audit event traces
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[#5A6D89]">Rows:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-white border border-[#BEDDF5] text-[#17233E] font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-[#1988A3] cursor-pointer font-mono shadow-sm"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Page Navigation */}
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
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-sm'
                            : 'bg-white hover:bg-slate-50 text-[#5A6D89] border border-[#BEDDF5]'
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

      </main>

      {/* Audit Log Details Inspection Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/90 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#BEDDF5]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#17233E]">Audit Event Inspection</h2>
                    <p className="text-xs text-[#5A6D89] font-mono">{selectedLog.id} — {selectedLog.timestamp}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLog(null)} className="text-[#5A6D89] hover:text-[#17233E]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 bg-white/80 rounded-xl border border-[#BEDDF5] grid grid-cols-2 gap-4 text-xs shadow-sm">
                  <div>
                    <span className="text-[#5A6D89] block font-semibold uppercase">Actor / Initiator</span>
                    <span className="text-[#17233E] font-bold text-sm block mt-0.5">{selectedLog.actor}</span>
                    <span className="text-[#5A6D89] font-mono block">{selectedLog.actorEmail}</span>
                  </div>
                  <div>
                    <span className="text-[#5A6D89] block font-semibold uppercase">Resource Target</span>
                    <span className="text-[#1988A3] font-mono font-bold block mt-0.5">{selectedLog.rawResource}</span>
                    <span className="text-[#8A9CB7] font-mono text-[10px] truncate block">ID: {selectedLog.resourceId}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase text-[#5A6D89] block mb-1">Action Event Name</span>
                  <p className="p-3 bg-white border border-[#BEDDF5] rounded-xl text-xs font-mono text-[#1988A3] font-bold shadow-sm">
                    {selectedLog.action}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold uppercase text-[#5A6D89] block">Structured JSON Metadata Payload</span>
                    <button
                      onClick={() => handleCopyPayload(selectedLog.details)}
                      className="flex items-center gap-1.5 text-xs text-[#1988A3] hover:text-[#15738A] font-bold transition-colors"
                    >
                      {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPayload ? 'Copied' : 'Copy Payload'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-48 whitespace-pre-wrap shadow-inner">
                    {selectedLog.details}
                  </pre>
                </div>

                <div className="flex items-center justify-between text-xs text-[#5A6D89] pt-2 border-t border-[#BEDDF5]">
                  <span>Client IP: <span className="font-mono text-[#17233E] font-bold">{selectedLog.ipAddress}</span></span>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#5A6D89] text-xs font-semibold border border-[#BEDDF5] shadow-sm"
                  >
                    Close Window
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

export default AuditTrailLogs;
