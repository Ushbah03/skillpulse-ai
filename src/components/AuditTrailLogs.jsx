import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  FileSpreadsheet
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';

// Mock Global Audit Events
const initialAuditLogs = [
  {
    id: 'AUDIT-8801',
    actor: 'Alex Mercer (SuperAdmin)',
    ipAddress: '192.168.1.104',
    action: 'TENANT_SUSPENDED',
    target: 'Vanguard Global (TEN-004)',
    details: 'Suspended company access due to past-due subscription billing.',
    timestamp: '2026-08-13 16:45:12',
    status: 'SUCCESS'
  },
  {
    id: 'AUDIT-8800',
    actor: 'Sophia Chen (SuperAdmin)',
    ipAddress: '10.0.4.22',
    action: 'AI_CONFIG_UPDATED',
    target: 'Global AI Model Configuration',
    details: 'Updated primary model routing to Claude 3.5 Sonnet for Skill Assessments.',
    timestamp: '2026-08-13 15:12:30',
    status: 'SUCCESS'
  },
  {
    id: 'AUDIT-8799',
    actor: 'Alex Mercer (SuperAdmin)',
    ipAddress: '192.168.1.104',
    action: 'TAXONOMY_NODE_ADDED',
    target: 'Software Engineering Category',
    details: 'Inserted skill competency node: SK-ENG-04 (Rust System Programming).',
    timestamp: '2026-08-13 14:02:11',
    status: 'SUCCESS'
  },
  {
    id: 'AUDIT-8798',
    actor: 'System Auto-Worker',
    ipAddress: '127.0.0.1',
    action: 'INTEGRATION_SYNC_FAILED',
    target: 'BambooHR Connector',
    details: 'OAuth token refresh failed for BambooHR integration.',
    timestamp: '2026-08-13 12:30:00',
    status: 'FAILED'
  }
];

const AuditTrailLogs = () => {
  const [logs, setLogs] = useState(initialAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  // Filter Logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
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
            onClick={() => alert('Exporting Audit Trail to CSV/JSON...')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            <Download className="w-4 h-4" />
            Export Compliance Audit
          </motion.button>
        </div>

        {/* Audit Trail Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Logged Admin Actions (24h)</p>
            <p className="text-2xl font-extrabold text-white mt-1">142 Events</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">SOC 2 Compliance Status</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Fully Verified
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Active SuperAdmin Sessions</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">2 Active Admins</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Retention Policy</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">365 Days Logged</p>
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
        </div>

        {/* Audit Logs Table */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AuditTrailLogs;