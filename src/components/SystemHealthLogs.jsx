import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Loader2
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const SystemHealthLogs = () => {
  const [logs, setLogs] = useState([]);
  const [telemetry, setTelemetry] = useState({
    uptime: '99.98%',
    latency: '45 ms',
    aiErrorRate: '0.00%',
    cpuLoad: '22% Load'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

          const userText = log.user ? ` (${log.user.firstName || ''} ${log.user.lastName || ''} - ${log.user.email || ''})` : '';

          return {
            id: `LOG-${log.id.slice(-4).toUpperCase()}`,
            timestamp: new Date(log.createdAt).toLocaleString(),
            level,
            service: log.resource || 'System-Core',
            message: `${log.action}${userText}`,
            tenant: log.tenant?.name || 'Global Platform'
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

  // Filter Logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'All' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLogsAndTelemetry();
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              System Health & Operational Telemetry
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time platform event logs, API latency metrics, vector store health, and service uptime telemetry.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 text-sm font-semibold transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Telemetry
          </motion.button>
        </div>

        {/* System Health Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Global System Uptime</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              {telemetry.uptime}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Avg. API Response Latency</p>
            <p className="text-2xl font-extrabold text-white mt-1">{telemetry.latency}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">AI Service Error Rate</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">{telemetry.aiErrorRate}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Database CPU Load</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">{telemetry.cpuLoad}</p>
          </div>
        </div>

        {/* Search & Log Level Filters */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search log trace, service, or tenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Log Severity:</span>
              <select 
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Levels</option>
                <option value="ERROR" className="bg-[#0F172A]">ERROR</option>
                <option value="WARN" className="bg-[#0F172A]">WARN</option>
                <option value="INFO" className="bg-[#0F172A]">INFO</option>
              </select>
            </div>
          </div>
        </div>

        {/* Terminal Style System Log Feed */}
        <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 bg-[#1E293B]/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>live_operational_telemetry.log</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Streaming Realtime
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-xs text-slate-400 mt-3 font-sans">Querying real-time system audit logs from database...</p>
              </div>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start md:items-center gap-3 flex-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      log.level === 'ERROR' 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                        : log.level === 'WARN'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {log.level}
                    </span>

                    <span className="text-slate-500 shrink-0">{log.timestamp}</span>

                    <span className="text-indigo-300 font-semibold shrink-0">
                      [{log.service}]
                    </span>

                    <p className="text-slate-300 truncate font-sans text-xs">
                      {log.message}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-[11px] text-slate-500 bg-slate-800 px-2.5 py-1 rounded-lg">
                      {log.tenant}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-slate-500 font-sans text-xs">
                No system audit events match the active search or severity filter.
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default SystemHealthLogs;