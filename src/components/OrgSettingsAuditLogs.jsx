import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  Save, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  User, 
  Globe, 
  Palette,
  FileText
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';

// Initial Mock Audit Log Data
const initialAuditLogs = [
  { id: 'LOG-8821', user: 'Alex Vance (Admin)', action: 'Updated Security Policies (Enforced MFA)', target: 'Tenant Security', ip: '192.168.1.45', timestamp: '2026-08-13 14:22:10', severity: 'High' },
  { id: 'LOG-8820', user: 'Sarah Jenkins (HR)', action: 'Exported Org Skill Gap Report', target: 'Analytics Engine', ip: '10.0.4.12', timestamp: '2026-08-13 13:10:05', severity: 'Low' },
  { id: 'LOG-8819', user: 'Alex Vance (Admin)', action: 'Created New Skill: Kubernetes Cluster Mgmt', target: 'Skill Taxonomy', ip: '192.168.1.45', timestamp: '2026-08-13 11:45:30', severity: 'Medium' },
  { id: 'LOG-8818', user: 'System Connector', action: 'Automated Sync Executed: Workday HRIS', target: 'Integrations Hub', ip: '52.14.88.201', timestamp: '2026-08-13 08:00:00', severity: 'Low' },
  { id: 'LOG-8817', user: 'David Miller (Lead)', action: 'Modified Team Member Competency Rating', target: 'User Profiles', ip: '172.16.0.88', timestamp: '2026-08-12 17:35:12', severity: 'Medium' },
  { id: 'LOG-8816', user: 'Alex Vance (Admin)', action: 'Revoked User Access for John Doe', target: 'User Role Governance', ip: '192.168.1.45', timestamp: '2026-08-12 15:12:40', severity: 'High' },
];

const OrgSettingsAuditLogs = () => {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'audit'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Organization Form State
  const [orgData, setOrgData] = useState({
    companyName: 'Acme Global Enterprises',
    domain: 'acmeglobal.com',
    primaryColor: '#6366F1',
    maxSeats: 250,
    activeSeats: 184,
    subscriptionTier: 'Enterprise AI Suite'
  });

  // Audit Log State
  const [auditLogs] = useState(initialAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  // Handle Org Settings Form Save
  const handleSaveOrgSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  // Filter Audit Logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <CompanyAdminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Organization Settings & Audit Logs
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage enterprise branding, subscription usage, and monitor tenant audit activity trails.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-800 p-1.5 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'settings' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Org Settings
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'audit' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Audit Logs
            </button>
          </div>
        </div>

        {/* Tab 1: Organization Settings */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
            
            {saveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Organization parameters updated successfully!
              </div>
            )}

            {/* License Overview */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <CreditCard className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{orgData.subscriptionTier}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Enterprise SLA & Priority AI Model Compute Active</p>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-start">
                <div>
                  <p className="text-xs text-slate-400">Allocated Seats</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">{orgData.activeSeats} / {orgData.maxSeats}</p>
                </div>
                <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(orgData.activeSeats / orgData.maxSeats) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Organization Form */}
            <form onSubmit={handleSaveOrgSettings} className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">General Organization Profile</h2>
                  <p className="text-xs text-slate-400">Manage tenant display names, subdomains, and corporate branding.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Company Legal Name</label>
                  <input
                    type="text"
                    required
                    value={orgData.companyName}
                    onChange={(e) => setOrgData({ ...orgData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Primary Domain</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={orgData.domain}
                      onChange={(e) => setOrgData({ ...orgData, domain: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Primary Theme Brand Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={orgData.primaryColor}
                      onChange={(e) => setOrgData({ ...orgData, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={orgData.primaryColor}
                      onChange={(e) => setOrgData({ ...orgData, primaryColor: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  Save Organization Settings
                </motion.button>
              </div>
            </form>

          </motion.div>
        )}

        {/* Tab 2: Audit Logs */}
        {activeTab === 'audit' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Search and Filters */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by action, user, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Severity:</span>
                  <select 
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-[#0F172A]">All Levels</option>
                    <option value="Low" className="bg-[#0F172A]">Low</option>
                    <option value="Medium" className="bg-[#0F172A]">Medium</option>
                    <option value="High" className="bg-[#0F172A]">High</option>
                  </select>
                </div>

                <button
                  onClick={() => alert("Exporting audit log trail (JSON/CSV).")}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shrink-0"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  Export Logs
                </button>
              </div>
            </div>

            {/* Audit Trail Table */}
            <div className="rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#1E293B]/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Event ID</th>
                      <th className="px-6 py-4">User Agent</th>
                      <th className="px-6 py-4">Action Executed</th>
                      <th className="px-6 py-4">Target Module</th>
                      <th className="px-6 py-4">IP Address</th>
                      <th className="px-6 py-4">Severity</th>
                      <th className="px-6 py-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-semibold">
                            {log.id}
                          </td>
                          <td className="px-6 py-4 font-medium text-white text-xs">
                            {log.user}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-300">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-400">
                            {log.target}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-400">
                            {log.ip}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${
                              log.severity === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              log.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-400">
                            {log.timestamp}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-10 text-slate-500">
                          No audit log entries match the search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

      </main>
    </div>
  );
};

export default OrgSettingsAuditLogs;