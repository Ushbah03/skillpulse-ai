import React, { useState } from 'react';
import { 
  ArrowLeft, Link2, BookOpen, Activity, Award, RefreshCw, 
  Save, Check, Settings, Shield, Beaker, Zap, Download
} from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';

const LMSIntegrationDashboard = () => {
  // --- INTEGRATION STATES FOR LMS BACKEND MATRIX ---
  const [lmsProvider, setLmsProvider] = useState('Cornerstone OnDemand');
  const [syncFrequency, setSyncFrequency] = useState('Real-time (Webhooks)');
  const [isAutoSyncActive, setIsAutoSyncActive] = useState(true);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [secureSSLEnabled, setSecureSSLEnabled] = useState(true);

  // Top Metrics Ribbon Array (Derived from image_36f76f.png)
  const stats = [
    { label: 'LMS Provider', value: 'Cornerstone', subtext: 'OAuth 2.0 Authenticated', icon: Link2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Courses Synced', value: '142', subtext: 'Across 12 categories', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Sync Health', value: '99.2%', subtext: '8 failed completions', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Certifications', value: '843', subtext: 'Synced last hour', icon: Award, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' }
  ];

  // Training Data Sync Scope State Object
  const [syncScopes, setSyncScopes] = useState({
    coursesPrograms: true,
    skillCertifications: true,
    employeeTrainingHistory: true,
    completionStatus: true
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full" style={{ fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      
      {/* ── FIXED LEFT SIDEBAR NAVIGATION ── */}
      <SuperadminSidebar />

      {/* ── MAIN SCROLLABLE CONTENT WRAPPER ── */}
      <div className="flex-1 pl-72 flex flex-col min-h-screen overflow-hidden">
        
        {/* STICKY HEADER TOP CONTROLLER */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                LMS Integration
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Configure learning system integration and training synchronization</p>
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

        {/* ── CORE SETTINGS WORKSPACE ── */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          
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

          {/* SECTION 2: CONNECTION SETUP & LMS SCOPE CONTROL */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* LMS Connection Configuration Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:col-span-3 space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">LMS Connection Configuration</h3>
                <p className="text-[11px] text-slate-400 font-medium">Define API client authorization parameters for course provider sync</p>
              </div>
              <hr className="border-slate-100" />

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">LMS Provider</label>
                  <select 
                    value={lmsProvider} 
                    onChange={(e) => setLmsProvider(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                  >
                    <option>Cornerstone OnDemand</option>
                    <option>Moodle LMS</option>
                    <option>Docebo</option>
                    <option>Canvas</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">API Endpoint URL</label>
                  <input 
                    type="text" 
                    defaultValue="https://skillpulse.csod.com/services/api"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Client ID</label>
                    <input 
                      type="text" 
                      defaultValue="skillpulse_api_lms_920"
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

                {/* Secure SSL & Sandbox Checkboxes Bar */}
                <div className="pt-2 flex flex-wrap items-center gap-6 bg-slate-50/80 p-3.5 rounded-xl border border-dashed border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      id="secure_ssl_lms" 
                      checked={secureSSLEnabled}
                      onChange={(e) => setSecureSSLEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer" 
                    />
                    <label htmlFor="secure_ssl_lms" className="text-xs font-bold text-slate-700 cursor-pointer select-none">Secure SSL (Enabled)</label>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      id="sandbox_mode" 
                      checked={isSandboxMode}
                      onChange={(e) => setIsSandboxMode(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer" 
                    />
                    <label htmlFor="sandbox_mode" className="text-xs font-bold text-slate-700 cursor-pointer select-none flex items-center gap-1">
                      Sandbox Mode
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Training Data Synchronization Scopes Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:col-span-2 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">Training Data Synchronization</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Select target modules to sync across platforms</p>
                  </div>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                    <RefreshCw size={10} /> Sync Now
                  </button>
                </div>
                <hr className="border-slate-100" />

                {/* Scopes Checklist Checkboxes Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(syncScopes).map((key) => (
                    <label key={key} className="flex items-center gap-3 p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={syncScopes[key]}
                        onChange={(e) => setSyncScopes({ ...syncScopes, [key]: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className={`text-xs font-semibold capitalize ${syncScopes[key] ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ingestion Frequency Strategy Switcher */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide block">Sync Frequency</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 inline-block bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    {syncFrequency}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-tight">Auto Sync</span>
                    <span className="text-[10px] font-bold text-emerald-600">ACTIVE</span>
                  </div>
                  <button 
                    onClick={() => setIsAutoSyncActive(!isAutoSyncActive)} 
                    className={`w-9 h-5 rounded-full relative transition-colors ${isAutoSyncActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${isAutoSyncActive ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: COURSE SCHEMAS ATTRIBUTES TARGET MAPS */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <div>
                <h3 className="text-sm font-black text-slate-900">Course to Skill Mapping</h3>
                <p className="text-[11px] text-slate-400 font-medium">Link incoming curriculum tracks structure to structural system taxonomies</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-slate-800 shadow-md">
                <Zap size={12} /> Auto-map Taxonomy
              </button>
            </div>

            {/* Simulated Table Inner Content Box */}
            <div className="p-12 text-center text-slate-400 text-xs font-medium border-b border-slate-100 bg-white">
              <div className="max-w-md mx-auto space-y-2">
                <p className="text-slate-800 font-bold text-sm">No Custom Rules Configured</p>
                <p className="text-slate-400 leading-relaxed">
                  Incoming LMS parameters map cleanly to system fields defaults. Click "Auto-map Taxonomy" to run diagnostic validation hooks over course catalogs payloads.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default LMSIntegrationDashboard;