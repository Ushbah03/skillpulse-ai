import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, Download, FileText, CheckCircle2,
  XCircle, Clock, AlertCircle, Sparkles, X, Check, Calendar, Briefcase
} from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';

// ── CUSTOM TOGGLE ────────────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// ── TRENDS BAR CHART ─────────────────────────────────────────────────────────
const RequestTrendsChart = () => {
  const bars = [40, 52, 45, 80, 30, 50, 62, 40, 85, 60];
  return (
    <div className="flex items-end justify-between h-24 pt-4 px-2">
      {bars.map((height, i) => (
        <div key={i} className="flex flex-col items-center flex-1 group px-1">
          <div 
            className={`w-full rounded-md transition-all duration-300 ${i === 3 || i === 8 ? 'bg-blue-500' : 'bg-blue-100'}`}
            style={{ height: `${height}%` }}
          />
        </div>
      ))}
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TrainingRequests = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState('REQ-8492');

  const requests = [
    {
      id: 'REQ-8492',
      date: 'Oct 24, 2023',
      employee: {
        name: 'Sarah Jenkins',
        role: 'Senior UI Designer',
        dept: 'Product Design',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        empId: '#339281'
      },
      course: 'Advanced Figma Systems Architecture',
      type: 'Certification',
      provider: 'Design+ Training Inc.',
      timeline: 'Nov 15 - Nov 18, 2023',
      justification: "Transitioning our core UI library to use Figma's new variable and advanced component properties. This training will speed up implementation by 30%.",
      priority: 'High',
      status: 'Pending',
      cost: '$1,250.00',
      deptBudget: 'Sufficient ($14.2k rem.)'
    },
    {
      id: 'REQ-8491',
      date: 'Oct 23, 2023',
      employee: {
        name: 'Marcus Thorne',
        role: 'Cloud Architect',
        dept: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        empId: '#339282'
      },
      course: 'AWS Cloud Architect',
      type: 'Technical',
      provider: 'Amazon Web Services',
      timeline: 'Dec 01 - Dec 05, 2023',
      justification: 'Scaling multi-region orchestration layouts securely.',
      priority: 'Medium',
      status: 'Approved',
      cost: '$2,400.00',
      deptBudget: 'Sufficient ($22.1k rem.)'
    },
    {
      id: 'REQ-8488',
      date: 'Oct 21, 2023',
      employee: {
        name: 'Elena Rodriguez',
        role: 'Marketing Lead',
        dept: 'Marketing',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        empId: '#339285'
      },
      course: 'SEO Masterclass',
      type: 'Workshop',
      provider: 'SearchMetrics Academy',
      timeline: 'Nov 10 - Nov 12, 2023',
      justification: 'Optimizing regional discovery strategies for inbound conversions.',
      priority: 'Low',
      status: 'Rejected',
      cost: '$850.00',
      deptBudget: 'Limited ($1.2k rem.)'
    }
  ];

  const currentDetails = requests.find(r => r.id === selectedRequest) || requests[0];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full" style={{ fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <SuperadminSidebar />

      <div className="flex-1 pl-72 flex flex-col min-h-screen overflow-hidden">
        
        {/* ── TOP UTILITY CONTEXT HEADER ── */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Training Requests</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Manage and approve workforce training requests</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors bg-slate-50/50"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all">
              <Download size={14} /> Export
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden ml-2 border border-slate-200">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="User Profile" className="object-cover w-full h-full" />
            </div>
          </div>
        </header>

        {/* ── METRICS DASHBOARD SECTION ── */}
        <main className="flex-1 overflow-y-auto p-8 flex gap-6 w-full">
          
          {/* LEFT CONTENT AREA */}
          <div className="flex-1 space-y-6 min-w-0">
            
            {/* 4-COLUMN TOP GRID STATS */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center absolute right-5 top-5">
                  <FileText size={16} className="text-blue-500" />
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Requests</p>
                <p className="text-3xl font-black text-slate-900 mt-2">1,284</p>
                <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
                  <span>↑ +12.5%</span> <span className="text-slate-400 font-medium">vs last month</span>
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center absolute right-5 top-5">
                  <Clock size={16} className="text-amber-500" />
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Approval</p>
                <p className="text-3xl font-black text-slate-900 mt-2">64</p>
                <p className="text-xs text-amber-500 font-bold mt-2 flex items-center gap-1">
                  <AlertCircle size={12} /> <span>12 Critical</span> <span className="text-slate-400 font-medium">require action</span>
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center absolute right-5 top-5">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Approved</p>
                <p className="text-3xl font-black text-slate-900 mt-2">942</p>
                <p className="text-xs text-emerald-600 font-bold mt-2">
                  $1.2M <span className="text-slate-400 font-medium">budget allocated</span>
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center absolute right-5 top-5">
                  <XCircle size={16} className="text-rose-500" />
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rejected</p>
                <p className="text-3xl font-black text-slate-900 mt-2">278</p>
                <p className="text-xs text-rose-500 font-bold mt-2">
                  85% <span className="text-slate-400 font-medium">budget constraints</span>
                </p>
              </div>
            </div>

            {/* REQUEST TRENDS ANALYTICS */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-black text-slate-900 tracking-tight">Training Request Trends</h2>
                <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-bold text-slate-600">
                  <button className="px-3 py-1.5 bg-white rounded-md shadow-sm text-slate-900">Weekly</button>
                  <button className="px-3 py-1.5 hover:text-slate-900">Monthly</button>
                </div>
              </div>
              <RequestTrendsChart />
              <div className="flex justify-between text-[11px] font-bold text-slate-400 px-2 mt-2">
                <span>NOV 1</span>
                <span>NOV 15</span>
                <span>NOV 30</span>
              </div>
            </div>

            {/* FILTER FILTER STRIP CONTROL ARCHITECTURE */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center bg-slate-50 rounded-xl p-1 gap-1">
                {['all', 'pending', 'approved', 'rejected'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-xs font-black capitalize transition-all ${
                      activeTab === tab 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab === 'all' ? 'All Requests' : tab}
                    {tab === 'pending' && <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded-md">64</span>}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-6 border-l border-slate-100 pl-6">
                <button className="text-xs font-black text-slate-500 hover:text-slate-700 flex items-center gap-1.5">
                  High Priority <span className="w-2 h-2 rounded-full bg-rose-500" />
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-500">Only Critical</span>
                  <Toggle enabled={onlyCritical} onChange={setOnlyCritical} />
                </div>
              </div>
            </div>

            {/* WORKFORCE REQUESTS DATA CONTAINER TABLE */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900">All Training Requests</h3>
                <button className="text-xs font-black text-blue-600 hover:text-blue-800 transition-colors">View All</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/70">
                      <th className="py-3 px-6">Request</th>
                      <th className="py-3 px-6">Employee</th>
                      <th className="py-3 px-6">Skill / Course</th>
                      <th className="py-3 px-6">Priority</th>
                      <th className="py-3 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map((req) => (
                      <tr 
                        key={req.id} 
                        onClick={() => setSelectedRequest(req.id)}
                        className={`cursor-pointer hover:bg-slate-50/80 transition-colors ${selectedRequest === req.id ? 'bg-blue-50/40' : ''}`}
                      >
                        <td className="py-4 px-6">
                          <p className="text-xs font-black text-slate-900">{req.id}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{req.date}</p>
                        </td>
                        <td className="py-4 px-6 flex items-center gap-3">
                          <img src={req.employee.avatar} alt={req.employee.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-black text-slate-800">{req.employee.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{req.employee.dept}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-xs font-black text-slate-800">{req.course}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-0.5">
                            <span className="w-1 h-1 bg-slate-300 rounded-full" /> {req.type}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            req.priority === 'High' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                            req.priority === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                            'bg-slate-50 border-slate-100 text-slate-600'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              req.priority === 'High' ? 'bg-rose-500' :
                              req.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            {req.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                            req.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200/60' :
                            req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── EMPHASIZED RIGHT ACTION INSPECTOR SIDEBAR ── */}
          <div className="w-[410px] flex flex-col bg-white border-2 border-slate-200/90 rounded-2xl shadow-xl overflow-hidden h-fit sticky top-24 transform transition-all duration-300 hover:shadow-2xl">
            
            {/* Header Title Meta Row */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Request Details</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {currentDetails.id} • <span className="text-amber-500 font-extrabold">{currentDetails.status} Approval</span>
                </p>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Profile Matrix Panel Layer */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-white">
              <img src={currentDetails.employee.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shadow-md" />
              <div>
                <h4 className="text-[16px] font-black text-slate-950 tracking-tight">{currentDetails.employee.name}</h4>
                <p className="text-[13px] text-slate-500 font-bold mt-0.5 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-slate-400" /> {currentDetails.employee.role} • {currentDetails.employee.dept}
                </p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Emp ID: {currentDetails.employee.empId}</p>
              </div>
            </div>

            {/* Structured Training Meta Details */}
            <div className="p-6 space-y-5 border-b border-slate-100 bg-white">
              <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase block mb-1">Training Specifications</span>
              
              <div className="space-y-1">
                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Course / Certification</p>
                <p className="text-slate-900 font-black text-[16px] leading-snug">{currentDetails.course}</p>
              </div>

              <div className="grid grid-cols-2 gap-5 pt-1">
                <div className="space-y-1">
                  <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Provider</p>
                  <p className="text-slate-800 font-black text-[14px]">{currentDetails.provider}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" /> Timeline
                  </p>
                  <p className="text-slate-800 font-black text-[14px]">{currentDetails.timeline}</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Business Justification</p>
                <p className="text-slate-700 font-medium text-[14px] leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4 mt-2 shadow-inner">
                  {currentDetails.justification}
                </p>
              </div>
            </div>

            {/* AI Core Insights Skill Validation Row */}
            <div className="p-6 bg-slate-50/60 border-b border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">AI Skill Validation</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-black border border-blue-100 shadow-sm">
                  <Sparkles size={12} /> AI Insights
                </span>
              </div>
              
              <div className="bg-white border border-slate-200/80 rounded-xl p-4.5 flex justify-between items-center shadow-md">
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Estimated Cost</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{currentDetails.cost}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Dept. Budget</p>
                  <p className="text-[13px] font-black text-emerald-600 mt-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block border border-emerald-100">
                    {currentDetails.deptBudget}
                  </p>
                </div>
              </div>
            </div>

            {/* Decision Submission Footer Actions */}
            <div className="p-6 bg-white space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-black text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  <XCircle size={16} /> Reject
                </button>
                <button className="py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-[14px] flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 active:scale-[0.98]">
                  <Check size={16} /> Approve
                </button>
              </div>
              <button className="w-full text-center py-2 text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                Assign to HR Manager
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainingRequests;