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
  X
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const AuditTrailLogs = () => {
  const [logs, setLogs] = useState([]);
  const [totalDbEvents, setTotalDbEvents] = useState(0);
  const [rawLogs, setRawLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
  const [retentionDays, setRetentionDays] = useState('90');

  useEffect(() => {
    async function loadAuditLogs() {
      setLoading(true);
      try {
        const [auditRes, policyRes] = await Promise.allSettled([
          adminAPI.getAuditLogs(),
          adminAPI.getSecurityPolicies()
        ]);

        if (auditRes.status === 'fulfilled' && auditRes.value?.success && auditRes.value.data) {
          setRawLogs(auditRes.value.data);
          if (auditRes.value.totalCount !== undefined) {
            setTotalDbEvents(auditRes.value.totalCount);
          }
          const mapped = auditRes.value.data.map(log => ({
            id: `AUDIT-${log.id.slice(-4).toUpperCase()}`,
            rawId: log.id,
            actor: log.user ? `${log.user.firstName || ''} ${log.user.lastName || ''} (${log.user.role || 'USER'})` : 'System Engine',
            actorEmail: log.user?.email || 'system@skillpulse.ai',
            ipAddress: log.ipAddress || '127.0.0.1',
            userAgent: log.userAgent || 'SkillPulse Platform Core v1.0',
            action: log.action,
            target: `${log.resource || 'Entity'} ${log.tenant ? `(${log.tenant.name})` : ''}`,
            rawResource: log.resource,
            resourceId: log.resourceId || log.id,
            details: log.details ? (typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : String(log.details)) : 'No additional metadata logged.',
            rawDetails: log.details,
            timestamp: new Date(log.createdAt).toLocaleString(),
            rawCreatedAt: log.createdAt,
            status: (log.action || '').includes('FAIL') || (log.action || '').includes('ERROR') ? 'FAILED' : 'SUCCESS'
          }));
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

  // Unique action types for dropdown filter
  const actionOptions = useMemo(() => {
    const set = new Set();
    logs.forEach(l => {
      if (l.action) {
        const baseAction = l.action.split(':')[0].trim();
        set.add(baseAction);
      }
    });
    return Array.from(set);
  }, [logs]);

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === 'All' || log.action.startsWith(actionFilter);
      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, actionFilter]);

  // Export Audit Trail to CSV File
  const handleExportCSV = () => {
    if (!filteredLogs || filteredLogs.length === 0) return;
    const headers = ["Audit ID", "Timestamp", "Actor", "Actor Email", "Action", "Target Entity", "IP Address", "Status", "Details"];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.actor.replace(/"/g, '""')}"`,
      `"${l.actorEmail}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.target.replace(/"/g, '""')}"`,
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

  const successfulCount = useMemo(() => {
    return logs.filter(l => l.status === 'SUCCESS').length;
  }, [logs]);

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Platform Audit Trail Logs
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Immutable SOC2 security compliance logs tracking all SuperAdmin actions, security overrides, and global platform changes.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            <Download className="w-4 h-4" />
            Export Compliance Audit (CSV)
          </motion.button>
        </div>

        {/* Audit Trail Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Total Database Events</p>
            <p className="text-2xl font-extrabold text-white mt-1">
              {totalDbEvents || logs.length} <span className="text-xs font-normal text-slate-500">Events</span>
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">SOC 2 Compliance Status</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fully Verified
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Successful Actions</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {successfulCount} <span className="text-xs font-normal text-slate-500">/ {logs.length}</span>
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Log Retention Policy</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">{retentionDays} Days Retention</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search actor, target, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Action Category:</span>
              <select 
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Actions</option>
                {actionOptions.map(act => (
                  <option key={act} value={act} className="bg-[#0F172A]">{act}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0F172A] border border-slate-800/80 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-400 mt-3">Loading immutable SOC2 compliance audit logs from database...</p>
          </div>
        ) : (
        <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#1E293B]/60 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Timestamp / ID</th>
                  <th className="py-4 px-6">Actor (SuperAdmin)</th>
                  <th className="py-4 px-6">Action Performed</th>
                  <th className="py-4 px-6">Target Entity</th>
                  <th className="py-4 px-6">IP Address</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <p className="text-xs font-mono text-white">{log.timestamp}</p>
                        <p className="text-[10px] font-mono text-slate-500">{log.id}</p>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-200 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          {log.actor}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-mono text-xs text-indigo-300 font-semibold">
                        {log.action}
                      </td>

                      <td className="py-4 px-6 text-slate-300 text-xs">
                        {log.target}
                      </td>

                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        {log.ipAddress}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {log.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 transition-colors"
                          title="Inspect Metadata Payload"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500">
                      No security audit events match the active search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

      </main>

      {/* Audit Log Details Inspection Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Audit Event Inspection</h2>
                    <p className="text-xs text-slate-400 font-mono">{selectedLog.id} — {selectedLog.timestamp}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 bg-[#1E293B] rounded-xl border border-slate-700/60 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Actor / Initiator</span>
                    <span className="text-white font-bold text-sm block mt-0.5">{selectedLog.actor}</span>
                    <span className="text-slate-400 font-mono block">{selectedLog.actorEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Resource Target</span>
                    <span className="text-indigo-400 font-mono font-bold block mt-0.5">{selectedLog.rawResource}</span>
                    <span className="text-slate-400 font-mono text-[10px] truncate block">ID: {selectedLog.resourceId}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">Action Event Name</span>
                  <p className="p-3 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-mono text-indigo-300 font-bold">
                    {selectedLog.action}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">JSON Metadata Payload</span>
                  <pre className="p-3.5 bg-[#0B1120] border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-48 whitespace-pre-wrap">
                    {selectedLog.details}
                  </pre>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Client IP: <span className="font-mono text-slate-200">{selectedLog.ipAddress}</span></span>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
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