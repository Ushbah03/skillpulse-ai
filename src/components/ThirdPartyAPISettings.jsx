import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Filter, Plus, MoreVertical, ShieldCheck, 
  AlertTriangle, DollarSign, Activity, Terminal, RefreshCw, 
  SlidersHorizontal, Lock, Check, Key
} from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';

const ThirdPartyAPISettings = () => {
  // --- STATE CONFIGURATIONS FOR THIRD PARTY API INTERFACE ---
  const [globalRateLimiting, setGlobalRateLimiting] = useState(true);
  const [maxRequestsPerMinute, setMaxRequestsPerMinute] = useState('1000');
  const [ipWhitelistingActive, setIpWhitelistingActive] = useState(false);
  const [allowedIPs, setAllowedIPs] = useState('192.168.1.1, 10.0.0.1');

  // Simulated Analytics Top Bar Dataset
  const stats = [
    { label: 'Connected APIs', value: '24', subtext: 'Total integrations', icon: SlidersHorizontal, color: 'text-blue-500', bg: 'bg-blue-50/60', badge: 'Total' },
    { label: 'Active APIs', value: '21', subtext: 'Operational systems', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50/60', badge: 'Operational' },
    { label: 'Failed Connections', value: '3', subtext: 'Require attention', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50/60', badge: 'Attention' },
    { label: 'Total Requests', value: '1.2M', subtext: 'Processed throughput', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50/60', badge: 'Today' }
  ];

  // Primary APIs Configuration Table Dataset
  const configuredAPIs = [
    { name: 'OpenAI GPT-4', provider: 'OpenAI', status: 'Active', endpoint: 'api.openai.com/v1', authType: 'Bearer Token', lastRequest: '2 mins ago', health: '98%', statusColor: 'bg-emerald-500', textStatus: 'text-emerald-600', bgStatus: 'bg-emerald-50' },
    { name: 'Google Analytics 4', provider: 'Google', status: 'Active', endpoint: 'analyticsdata.googleapis.com', authType: 'OAuth 2.0', lastRequest: '15 mins ago', health: '100%', statusColor: 'bg-emerald-500', textStatus: 'text-emerald-600', bgStatus: 'bg-emerald-50' },
    { name: 'Workday HRIS', provider: 'Workday', status: 'Error', endpoint: 'wd2-impl-services1.workday.com', authType: 'Basic Auth', lastRequest: '3 hours ago', health: '45%', statusColor: 'bg-rose-500', textStatus: 'text-rose-600', bgStatus: 'bg-rose-50' },
    { name: 'Slack Notifications', provider: 'Slack', status: 'Disabled', endpoint: 'hooks.slack.com', authType: 'Webhook', lastRequest: '2 days ago', health: '-', statusColor: 'bg-slate-400', textStatus: 'text-slate-500', bgStatus: 'bg-slate-100' }
  ];

  // Live Logging Feed Streams Array
  const errorLogs = [
    { apiName: 'Workday HRIS', message: 'Connection timed out', statusCode: '504', time: '10:42 AM', actionLabel: 'Retry', primaryAction: true },
    { apiName: 'SendGrid Email', message: 'Invalid API Key', statusCode: '401', time: '09:15 AM', actionLabel: 'Update Key', primaryAction: false }
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full" style={{ fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      
      {/* ── FIXED LEFT SIDEBAR NAVIGATION ── */}
      <SuperadminSidebar />

      {/* ── MAIN SCROLLABLE CONTENT WRAPPER ── */}
      <div className="flex-1 pl-0 lg:pl-64 pt-20 lg:pt-0 flex flex-col min-h-screen overflow-hidden">
        
        {/* STICKY APPLICATION TOP HEADER */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/90">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Third Party API Settings</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Configure and manage external API integrations endpoints credentials</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input 
                type="text" 
                placeholder="Search APIs..." 
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-400 w-64 transition-all"
              />
            </div>
            <button className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all text-slate-600 flex items-center gap-1 text-xs font-bold">
              <Filter size={14} /> Filter
            </button>
            <button className="px-4 py-2 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center gap-1.5">
              <Plus size={14} /> Add New API
            </button>
          </div>
        </header>

        {/* ── CORE SETTINGS & TELEMETRY HUB ── */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 w-full">
          
          {/* SECTION 1: SYSTEM HIGHLIGHT RIBBONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">{item.label}</span>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                        item.badge === 'Attention' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                      }`}>{item.badge}</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{item.value}</p>
                    <p className="text-xs text-slate-400 font-semibold">{item.subtext}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                    <Icon size={20} className={item.color} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION 2: ENDPOINTS DATAGRID STACKS */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <h3 className="text-sm font-black text-slate-900">Configured APIs</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-bold">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/60">
                    <th className="py-3.5 px-6">API Name</th>
                    <th className="py-3.5 px-6">Provider</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Endpoint URL</th>
                    <th className="py-3.5 px-6">Auth Type</th>
                    <th className="py-3.5 px-6">Last Request</th>
                    <th className="py-3.5 px-6">Health</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {configuredAPIs.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 text-xs">{row.name}</td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-semibold">{row.provider}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${row.bgStatus} ${row.textStatus}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.statusColor}`} />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px] text-slate-400">{row.endpoint}</td>
                      <td className="py-4 px-6 text-xs text-slate-600 font-bold">{row.authType}</td>
                      <td className="py-4 px-6 text-xs text-slate-400 font-medium">{row.lastRequest}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 max-w-[100px]">
                          <span className="text-xs font-black text-slate-800 w-8">{row.health}</span>
                          {row.health !== '-' && (
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${parseInt(row.health) > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                style={{ width: row.health }} 
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: CHARTS HISTOGRAMS & SCHEDULING DISPATCHERS */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Response Timeline Metric Graph Block */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-3 flex flex-col justify-between">
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">API Response Time Trend</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Latency metrics profile distribution over past runtime window</p>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Last 24 Hours</span>
              </div>
              
              {/* Histogram Bars Containers Grid */}
              <div className="h-32 flex items-end gap-1.5 pt-6 px-2 border-b border-slate-100">
                {[35, 45, 60, 30, 40, 55, 75, 45, 85, 65, 50, 70, 40, 60].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-blue-500/80 hover:bg-blue-600 transition-all rounded-t-sm" style={{ height: `${val}%` }} />
                ))}
              </div>
            </div>

            {/* Ingestion Distribution Volume Block */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">API Request Volume Distribution</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Throughput metrics allocated per provider service</p>
              </div>

              <div className="flex items-center justify-between gap-4 py-2">
                {/* Simulated Donut Vector Structure Wrapper */}
                <div className="w-24 h-24 rounded-full border-8 border-blue-500 flex items-center justify-center relative flex-shrink-0">
                  <div className="absolute inset-0 border-8 border-emerald-500 rounded-full clip-path-half rotate-45" />
                  <span className="text-[10px] font-black text-slate-400">TOTAL</span>
                </div>

                <div className="flex-1 space-y-1.5 text-xs font-bold text-slate-600">
                  <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> OpenAI</span><span className="text-slate-900">45%</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Google</span><span className="text-slate-900">25%</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Workday</span><span className="text-slate-900">20%</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Others</span><span className="text-slate-900">10%</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: GLOBAL RATE LIMITING & PROTECTION SUBSYSTEM */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Lock size={16} className="text-slate-500" /> API Security and Rate Limiting
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Control traffic volumes, access thresholds, and global firewalls network parameters</p>
            </div>
            <hr className="border-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Rate Limit Component Panel */}
              <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Enable Global Rate Limiting</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Restrict combined transaction loads to shield engine performance bounds</p>
                  </div>
                  <button 
                    onClick={() => setGlobalRateLimiting(!globalRateLimiting)}
                    className={`w-9 h-5 rounded-full relative transition-all ${globalRateLimiting ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${globalRateLimiting ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
                
                <div>
                  <label className="text-[11px] font-black text-slate-500 block mb-1.5">Max Requests Per Minute</label>
                  <input 
                    type="text" 
                    value={maxRequestsPerMinute}
                    onChange={(e) => setMaxRequestsPerMinute(e.target.value)}
                    disabled={!globalRateLimiting}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* IP Whitelisting Sub panel */}
              <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">IP Whitelisting Restriction</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Only permit ingress transaction handshakes from verified corporate network endpoints</p>
                  </div>
                  <button 
                    onClick={() => setIpWhitelistingActive(!ipWhitelistingActive)}
                    className={`w-9 h-5 rounded-full relative transition-all ${ipWhitelistingActive ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${ipWhitelistingActive ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
                
                <div>
                  <label className="text-[11px] font-black text-slate-500 block mb-1.5">Allowed IP Addresses (Comma separated)</label>
                  <input 
                    type="text" 
                    value={allowedIPs}
                    onChange={(e) => setAllowedIPs(e.target.value)}
                    disabled={!ipWhitelistingActive}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 5: AI INFUSED OPTIMIZATION ANALYTICS SUBGRID */}
          <div className="bg-blue-50/10 border border-blue-100 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-black text-blue-800 uppercase tracking-wider flex items-center gap-1">
              <Terminal size={14} /> AI API Optimization Insights
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between"><span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 border border-amber-100 px-1.5 rounded">Performance</span><span className="text-[10px] text-slate-400 font-bold">92% Confidence</span></div>
                <p className="text-xs font-black text-slate-800 mt-1">High latency detected in Workday HRIS sync.</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Recommended: Increase caching duration parameters window to 15 mins for global user profiles roster fetch endpoint loops.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between"><span className="text-[10px] font-black text-rose-600 uppercase bg-rose-50 border border-rose-100 px-1.5 rounded">Error Pattern</span><span className="text-[10px] text-slate-400 font-bold">88% Confidence</span></div>
                <p className="text-xs font-black text-slate-800 mt-1">Frequent 429 Errors on OpenAI.</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Recommended: Inject automated token bucket throttling algorithms with exponential backoff triggers on completion requests.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between"><span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 border border-emerald-200 px-1.5 rounded">Cost Savings</span><span className="text-[10px] text-slate-400 font-bold">95% Confidence</span></div>
                <p className="text-xs font-black text-slate-800 mt-1">Underutilized Endpoint: Analytics Report.</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Recommended: Restructure synchronization pooling intervals sequences from 5m down to 1h execution blocks to preserve utility credits balances.</p>
              </div>
            </div>
          </div>

          {/* SECTION 6: FAULT DISCOVERY RUNTIME LOGS TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Recent API Error Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/60">
                    <th className="py-3 px-6">API Name</th>
                    <th className="py-3 px-6">Error Message</th>
                    <th className="py-3 px-6">Status Code</th>
                    <th className="py-3 px-6">Time</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {errorLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800 text-xs">{log.apiName}</td>
                      <td className="py-4 px-6 font-mono text-xs font-bold text-rose-500">{log.message}</td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-500 font-semibold">{log.statusCode}</td>
                      <td className="py-4 px-6 text-xs text-slate-400 font-medium">{log.time}</td>
                      <td className="py-4 px-6 text-right">
                        <button className={`text-[11px] font-black transition-all ${
                          log.primaryAction 
                            ? 'text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-lg' 
                            : 'text-slate-600 hover:text-slate-900 hover:underline'
                        }`}>
                          {log.actionLabel}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ThirdPartyAPISettings;