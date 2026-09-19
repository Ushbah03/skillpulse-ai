import React, { useState } from 'react';
import { 
  ArrowLeft, Link2, Calendar, Database, AlertCircle, CheckCircle, 
  RefreshCw, Save, ChevronRight, Check, Settings, Download, 
  ShieldAlert, Zap, Search
} from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar'; // Sidebar Integrated Here

const HRISIntegrationDashboard = () => {
  // --- INTEGRATION STATES FOR BACKEND ROUTING ---
  const [provider, setProvider] = useState('Workday');
  const [syncFrequency, setSyncFrequency] = useState('Real-time');
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [duplicateHandling, setDuplicateHandling] = useState('overwrite');
  const [conflictPolicy, setConflictPolicy] = useState('hris');
  
  // Simulated Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Metric Ribbon Mock Data
  const stats = [
    { label: 'Status', value: 'Connected', subtext: 'Provider: Workday', icon: Link2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Last Sync', value: '12:05 PM', subtext: 'Successfully synced', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Records', value: '2,482', subtext: '+12 since yesterday', icon: Database, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
    { label: 'Errors', value: '0', subtext: 'No issues detected', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' }
  ];

  // Dynamic Checkboxes Mapping State Object
  const [syncSettings, setSyncSettings] = useState({
    employeeData: true,
    jobRoles: true,
    employmentStatus: true,
    departmentData: true,
    reportingHierarchy: true,
    payrollInfo: false
  });

  // Database Field Custom Mapping Rows Dataset
  const fieldMappings = [
    { hrisField: 'Employee_ID', skillpulseField: 'User ID', status: 'Valid', type: 'success' },
    { hrisField: 'Department_Name', skillpulseField: 'Department', status: 'Valid', type: 'success' },
    { hrisField: 'Job_Title_Legacy', skillpulseField: 'Functional Title', status: 'Mismatch Warning', type: 'warning' }
  ];

  // HRIS Complete History Log Array
  const syncHistory = [
    { id: '#SYNC-92812', date: 'May 12, 2024 · 12:05 PM', processed: '2,482', failed: '0', status: 'COMPLETED', type: 'success' },
    { id: '#SYNC-92754', date: 'May 12, 2024 · 11:00 AM', processed: '2,470', failed: '12', status: 'ERRORS FOUND', type: 'danger' }
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full" style={{ fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      
      {/* ── FIXED LEFT SIDEBAR NAVIGATION ── */}
      <SuperadminSidebar />

      {/* ── MAIN SCROLLABLE CONTENT WRAPPER ── */}
      {/* pl-64 ensures content clears the sidebar nicely */}
      <div className="flex-1 pl-0 lg:pl-64 pt-20 lg:pt-0 flex flex-col min-h-screen overflow-hidden">
        
        {/* sticky top bar inside dashboard container */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500Nav">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                HRIS Integration
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Configure and manage HR data synchronization pipelines</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-all">
              Test Connection
            </button>
            <button className="px-4 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md flex items-center gap-1.5">
              <Save size={14} /> Save Configuration
            </button>
          </div>
        </header>

        {/* ── CORE SETTINGS MAIN WORKSPACE ── */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 w-full">
          
          {/* SECTION 1: TOP METRICS MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={`bg-white border ${item.border} rounded-2xl p-5 shadow-sm flex items-center justify-between`}>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{item.label}</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{item.value}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1.5">{item.subtext}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <Icon size={20} className={item.color} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION 2: ENDPOINT SETUP & SYNC TARGET RANGE */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Connection Config Details */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:col-span-3 space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Connection Configuration</h3>
                <p className="text-[11px] text-slate-400 font-medium">Define communication endpoints and credentials</p>
              </div>
              <hr className="border-slate-100" />

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">HRIS Provider</label>
                  <select 
                    value={provider} 
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                  >
                    <option>Workday</option>
                    <option>BambooHR</option>
                    <option>SAP SuccessFactors</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">API Endpoint URL</label>
                  <input 
                    type="text" 
                    defaultValue="https://wd5-impl-services1.workday.com/ccx/service/v1"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Client ID</label>
                    <input 
                      type="text" 
                      defaultValue="skillpulse_h_8293"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Client Secret</label>
                    <input 
                      type="password" 
                      defaultValue="••••••••••••••••••••••••"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between bg-slate-50/80 p-3.5 rounded-xl border border-dashed border-slate-200">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="secure_ssl_p" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                    <label htmlFor="secure_ssl_p" className="text-xs font-bold text-slate-700 cursor-pointer">Enable Secure Connection (SSL)</label>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">TLS 1.3 Recommended</span>
                </div>
              </div>
            </div>

            {/* Sync Settings Engine */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:col-span-2 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">Data Synchronization Settings</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Select sync scope items</p>
                  </div>
                  <button className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100">
                    <RefreshCw size={10} className="animate-spin-slow" /> Manual Sync Now
                  </button>
                </div>
                <hr className="border-slate-100" />

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {Object.keys(syncSettings).map((key) => (
                    <label key={key} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={syncSettings[key]}
                        onChange={(e) => setSyncSettings({ ...syncSettings, [key]: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded mt-0.5"
                      />
                      <span className={`text-xs font-semibold capitalize ${syncSettings[key] ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Sync Frequency</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">Auto Sync</span>
                    <button onClick={() => setIsAutoSyncEnabled(!isAutoSyncEnabled)} className={`w-8 h-4.5 rounded-full relative transition-colors ${isAutoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${isAutoSyncEnabled ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
                <div className="flex bg-white border border-slate-200 p-1 rounded-lg">
                  {['Real-time', 'Hourly', 'Daily'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setSyncFrequency(freq)}
                      className={`flex-1 text-center py-1.5 text-xs font-black rounded-md transition-all ${
                        syncFrequency === freq ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: DATABASE FIELD CUSTOM SCHEMA MAPS */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <div>
                <h3 className="text-sm font-black text-slate-900">HRIS to SkillPulse Field Mapping</h3>
                <p className="text-[11px] text-slate-400 font-medium">Map custom HR attributes to system specific nodes</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-slate-800 shadow-md">
                <Zap size={12} /> Auto-detect Fields
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/60">
                    <th className="py-3 px-6">HRIS Field (Source)</th>
                    <th className="py-3 px-6">SkillPulse Field (Target)</th>
                    <th className="py-3 px-6">Validation</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fieldMappings.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-600">{row.hrisField}</td>
                      <td className="py-4 px-6">
                        <div className="max-w-[240px]">
                          <input 
                            type="text" 
                            defaultValue={row.skillpulseField}
                            className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                          row.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {row.type === 'success' ? <Check size={10} /> : <AlertCircle size={10} />} {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                          <Settings size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 4: CONFLICT POLICIES & STRATEGIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Duplicate Record Handling</h4>
                <p className="text-[11px] text-slate-400 font-medium">Define flow logic rules for duplicate keys</p>
              </div>
              <div className="space-y-2.5">
                <label onClick={() => setDuplicateHandling('overwrite')} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${duplicateHandling === 'overwrite' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'}`}>
                  <input type="radio" checked={duplicateHandling === 'overwrite'} readOnly className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Overwrite Existing</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Always use HRIS as the default source of truth</p>
                  </div>
                </label>
                <label onClick={() => setDuplicateHandling('skip')} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${duplicateHandling === 'skip' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'}`}>
                  <input type="radio" checked={duplicateHandling === 'skip'} readOnly className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Skip & Flag</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Do not sync; push alert record to error logging queues</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Conflict Resolution Policy</h4>
                <p className="text-[11px] text-slate-400 font-medium">Prioritize records if field schema values differ</p>
              </div>
              <div className="space-y-2.5">
                <label onClick={() => setConflictPolicy('hris')} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${conflictPolicy === 'hris' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'}`}>
                  <input type="radio" checked={conflictPolicy === 'hris'} readOnly className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Prioritize HRIS</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">External provider dataset properties are strictly preferred</p>
                  </div>
                </label>
                <label onClick={() => setConflictPolicy('skillpulse')} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${conflictPolicy === 'skillpulse' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'}`}>
                  <input type="radio" checked={conflictPolicy === 'skillpulse'} readOnly className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Prioritize SkillPulse-AI</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Retain active internal user data configurations overrides</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 5: REAL TIME HISTORY SYNC LOG */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <h3 className="text-sm font-black text-slate-900">HRIS Sync History</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1">
                <Download size={13} /> Export Report
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/60">
                    <th className="py-3 px-6">Sync ID</th>
                    <th className="py-3 px-6">Sync Date</th>
                    <th className="py-3 px-6">Processed</th>
                    <th className="py-3 px-6">Failed</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {syncHistory.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-blue-600">{log.id}</td>
                      <td className="py-4 px-6 text-xs font-semibold text-slate-600">{log.date}</td>
                      <td className="py-4 px-6 text-xs font-bold text-slate-800">{log.processed}</td>
                      <td className="py-4 px-6 text-xs font-bold text-slate-800">
                        <span className={log.failed !== '0' ? 'text-rose-500 font-black' : 'text-slate-500'}>{log.failed}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                          log.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                        }`}>{log.status}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-slate-700 p-1">
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 6: DIAGNOSTICS & TELEMETRY SUBPANELS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-rose-50/30 border border-rose-100 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-rose-800">
                  <ShieldAlert size={18} />
                  <h3 className="text-sm font-black tracking-tight">Sync Error Management</h3>
                </div>
                <button className="text-[11px] font-black text-rose-600 bg-white hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 shadow-sm">
                  Retry Failed Records
                </button>
              </div>

              <div className="bg-white border border-rose-100 p-4 rounded-xl flex items-start gap-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs border border-rose-100 flex-shrink-0">
                  12
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-slate-800">Missing Mandatory Field: Reporting_Manager_ID</p>
                    <button className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5"><Download size={10} /> CSV Report</button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Found in recent sync payload data stream reference <span className="font-mono text-slate-600 font-bold">#SYNC-92754</span>. Missing links break organizational hierarchy mapping nodes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-purple-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="space-y-3.5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-black text-purple-700 tracking-wider uppercase block">AI Data Insights</span>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">Data Quality: 94/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-purple-600 rounded-full" />
                </div>
                <div className="text-xs space-y-2 text-slate-500 leading-relaxed">
                  <p>• Detected <span className="text-purple-700 font-black">3 duplicate</span> employee objects inside database fields variants mapping stacks.</p>
                  <p>• Ingestion structure reporting gap found for <span className="text-purple-700 font-black">8 global users</span> inside Marketing department branches.</p>
                </div>
              </div>
              <button className="w-full text-center py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-md mt-5">
                View Recommended Fixes
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default HRISIntegrationDashboard;