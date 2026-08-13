import React, { useState } from 'react';
import { Sparkles, Code, Tag, Percent, Layers, ChevronLeft, ChevronRight, Filter, Calendar } from 'lucide-react';
import HRSidebar from './HRSidebar';

// DEFAULT MULTI-TENANT MOCK DATA
const DEFAULT_DEPT_METRICS = [
  { id: 'eng', name: 'ENGINEERING', score: '88.4%', skill: '78.5', read: '92%', icon: <Code style={{ width: '16px', height: '16px' }} />, iconBg: 'bg-purple-50 text-purple-600', color: 'bg-purple-500', barColor: 'bg-purple-600', trend: 'up' },
  { id: 'sls', name: 'SALES', score: '76.2%', skill: '64.5', read: '68%', icon: <Tag style={{ width: '16px', height: '16px' }} />, iconBg: 'bg-cyan-50 text-cyan-600', color: 'bg-cyan-500', barColor: 'bg-cyan-500', trend: 'down' },
  { id: 'mkt', name: 'MARKETING', score: '82.1%', skill: '81.0', read: '85%', icon: <Percent style={{ width: '16px', height: '16px' }} />, iconBg: 'bg-emerald-50 text-emerald-600', color: 'bg-emerald-500', barColor: 'bg-emerald-500', trend: 'up' },
  { id: 'prd', name: 'PRODUCT', score: '91.5%', skill: '88.2', read: '96%', icon: <Layers style={{ width: '16px', height: '16px' }} />, iconBg: 'bg-amber-50 text-amber-600', color: 'bg-amber-500', barColor: 'bg-amber-500', trend: 'up' },
];

const DEFAULT_HEATMAP = {
  departments: ['Engineering', 'Sales', 'Marketing', 'Product', 'Human Resources'],
  domains: ['TECHNICAL', 'SOFT SKILLS', 'LEADERSHIP', 'COMPLIANCE', 'STRATEGY'],
  values: [
    [4.8, 4.2, 3.5, 2.1, 4.1],
    [1.8, 1.2, 3.2, 4.4, 4.9],
    [3.1, 4.7, 4.0, 2.4, 3.6],
    [4.2, 3.8, 4.1, 3.0, 4.5],
    [0.9, 3.3, 4.6, 3.1, 1.9],
  ]
};

const DEFAULT_RANKINGS = [
  { rank: '#1', name: 'Product', score: '91.5%', skill: '88.2', comp: '88%', read: '96%', risk: 'Low', riskBg: 'bg-emerald-50 text-emerald-700', scoreColor: 'text-emerald-600' },
  { rank: '#2', name: 'Engineering', score: '88.4%', skill: '78.5', comp: '94%', read: '92%', risk: 'Low', riskBg: 'bg-emerald-50 text-emerald-700', scoreColor: 'text-emerald-600' },
  { rank: '#3', name: 'Marketing', score: '82.1%', skill: '81.0', comp: '82%', read: '85%', risk: 'Medium', riskBg: 'bg-amber-50 text-amber-700', scoreColor: 'text-emerald-600' },
  { rank: '#4', name: 'Sales', score: '76.2%', skill: '64.5', comp: '64%', read: '68%', risk: 'High', riskBg: 'bg-rose-50 text-rose-700', scoreColor: 'text-rose-500' }
];

const DEFAULT_IMPROVEMENT_DATA = [
  { label: 'ENG', h: '62%' },
  { label: 'PRD', h: '68%' },
  { label: 'MKT', h: '78%' },
  { label: 'SLS', h: '40%' },
  { label: 'HR',  h: '30%' },
  { label: 'OPS', h: '55%' }
];

const DepartmentComparison = ({ 
  tenantId = "tenant-001",
  userProfile = { name: "HR Manager", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
  deptMetrics = DEFAULT_DEPT_METRICS, 
  heatmapMatrix = DEFAULT_HEATMAP, 
  rankingRows = DEFAULT_RANKINGS,
  improvementData = DEFAULT_IMPROVEMENT_DATA,
  isLoading = false
}) => {
  const [activePage, setActivePage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('6M');

  const getHeatmapColor = (val) => {
    if (val < 2.0) return 'bg-indigo-100 text-indigo-900';
    if (val < 3.5) return 'bg-indigo-300 text-indigo-950';
    if (val < 4.5) return 'bg-indigo-500 text-white';
    return 'bg-indigo-900 text-indigo-50';
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="flex min-h-screen bg-[#f8fafc] antialiased">
      <HRSidebar />

      <div className="flex-1 ml-64 overflow-auto">
        
        {/* HEADER NAVIGATION BAR */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <h1 style={{ fontSize: '20px' }} className="font-black text-slate-900 tracking-tight">Department Comparison</h1>
            <p style={{ fontSize: '14px' }} className="text-slate-500 font-medium mt-1">Compare workforce performance, skill maturity, and training effectiveness across departments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600">
              <Calendar size={16} />
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent outline-none cursor-pointer"
              >
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="YTD">Year to Date</option>
              </select>
            </div>
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt={userProfile.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">
                {userProfile.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">

          {/* DEPARTMENT STAT CARDS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {deptMetrics.map((dm, i) => (
              <div key={dm.id || i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '13px' }} className="font-black tracking-wider text-slate-400 uppercase">{dm.name}</span>
                  <div className={`w-8 h-8 rounded-lg ${dm.iconBg || 'bg-indigo-50 text-indigo-600'} flex items-center justify-center shadow-sm`}>
                    {dm.icon || <Layers style={{ width: '16px', height: '16px' }} />}
                  </div>
                </div>
                <div className="mt-4">
                  <p style={{ fontSize: '28px' }} className="font-black text-slate-800 tracking-tight leading-none">{dm.score}</p>
                  <p style={{ fontSize: '14px' }} className="font-semibold text-slate-400 mt-1.5">Performance Score</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 mt-4 pt-3">
                  <div>
                    <span style={{ fontSize: '13px' }} className="text-slate-400 block font-semibold">Skill Index</span>
                    <span style={{ fontSize: '16px' }} className="font-bold text-slate-800 mt-1 inline-flex items-center gap-1">
                      {dm.skill} <span style={{ fontSize: '15px' }} className={dm.trend === 'up' ? 'text-emerald-500 font-black' : 'text-rose-500 font-black'}>{dm.trend === 'up' ? '↑' : '↓'}</span>
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px' }} className="text-slate-400 block font-semibold">Readiness</span>
                    <span style={{ fontSize: '16px' }} className="font-bold text-slate-800 mt-1 block">{dm.read}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TREND LINES AREA CARD */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 style={{ fontSize: '16px' }} className="font-black text-slate-900 uppercase tracking-wider">Performance Trend Comparison</h3>
                <p style={{ fontSize: '14px' }} className="text-slate-400 font-medium mt-0.5">Aggregated performance scores by department over time</p>
              </div>
              <div style={{ fontSize: '14px' }} className="flex items-center gap-4 font-bold text-slate-600">
                {deptMetrics.slice(0, 3).map((dm, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${dm.color || 'bg-indigo-500'}`} /> {dm.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-48 relative w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 150" preserveAspectRatio="none">
                <line x1="0" y1="30" x2="700" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="75" x2="700" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="120" x2="700" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="150" x2="700" y2="150" stroke="#cbd5e1" strokeWidth="1.5" />

                <path d="M 0 100 Q 140 85 280 95 T 560 70 L 700 65" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                <path d="M 0 120 Q 140 110 280 102 T 560 90 L 700 80" fill="none" stroke="#10b981" strokeWidth="2.5" />
                <path d="M 0 145 Q 140 138 280 142 T 560 132 L 700 128" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
              </svg>
              <div style={{ fontSize: '13px' }} className="flex justify-between px-1 font-black text-slate-400 uppercase tracking-wider mt-4">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>
          </div>

          {/* SKILL MATURITY MATRIX HEATMAP */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 style={{ fontSize: '16px' }} className="font-black text-slate-900 uppercase tracking-wider">Skill Maturity Heatmap</h3>
                <p style={{ fontSize: '14px' }} className="text-slate-400 font-medium mt-0.5">Department proficiency levels across core skill domains (1.0 – 5.0 Scale)</p>
              </div>
              <div style={{ fontSize: '13px' }} className="flex items-center gap-2 font-bold text-slate-500">
                <span>Low Maturity</span>
                <span className="w-4 h-4 bg-indigo-100 rounded" />
                <span className="w-4 h-4 bg-indigo-300 rounded" />
                <span className="w-4 h-4 bg-indigo-500 rounded" />
                <span className="w-4 h-4 bg-indigo-900 rounded" />
                <span>High Maturity</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {heatmapMatrix.departments.map((dept, deptIdx) => (
                <div key={deptIdx} className="flex items-center">
                  <div style={{ fontSize: '14px' }} className="w-44 font-black text-slate-700">{dept}</div>
                  <div className="flex-1 grid grid-cols-5 gap-3">
                    {heatmapMatrix.values[deptIdx]?.map((val, valIdx) => (
                      <div key={valIdx} style={{ fontSize: '14px' }} className={`${getHeatmapColor(val)} rounded-xl py-3 text-center font-black shadow-sm transition-transform hover:scale-[1.02] cursor-help`}>
                        {val.toFixed(1)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center mt-3 pt-2">
                <div className="w-44" />
                <div style={{ fontSize: '13px' }} className="flex-1 grid grid-cols-5 gap-3 text-center font-black text-slate-400 tracking-wider">
                  {heatmapMatrix.domains.map((dom, idx) => <span key={idx}>{dom}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* TWO LOWER COLUMNS BLOCK */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h3 style={{ fontSize: '16px' }} className="font-black text-slate-900 uppercase tracking-wider mb-5">Training Completion Rate</h3>
              <div className="space-y-5">
                {deptMetrics.map((cr, i) => (
                  <div key={i} className="space-y-2">
                    <div style={{ fontSize: '14px' }} className="flex justify-between font-bold">
                      <span className="text-slate-700">{cr.name}</span>
                      <span className="text-slate-800 font-black">{cr.read}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${cr.barColor || 'bg-indigo-600'} rounded-full`} style={{ width: cr.read }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 style={{ fontSize: '16px' }} className="font-black text-slate-900 uppercase tracking-wider">Skill Improvement After Training</h3>
                <p style={{ fontSize: '14px' }} className="text-slate-400 font-medium mt-0.5 mb-4">Percentage increase in core proficiency post-workshop</p>
                
                <div className="flex items-end justify-between h-32 px-4 pt-2">
                  {improvementData.map((bar, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 mx-2 group">
                      <div className="w-full h-24 flex items-end justify-center">
                        <div className="w-10 bg-emerald-400/90 rounded-t-lg transition-all duration-500 group-hover:bg-emerald-500 shadow-sm" style={{ height: bar.h }} />
                      </div>
                      <span style={{ fontSize: '12px' }} className="font-black text-slate-500 mt-2.5 transform -rotate-45 origin-top-left whitespace-nowrap">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE DATA TABLE SYSTEM */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 style={{ fontSize: '16px' }} className="font-black text-slate-900 uppercase tracking-wider">Department Performance Ranking</h3>
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg bg-white">
                <Filter size={14} /> Filter
              </button>
            </div>
            
            <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead className="sticky top-0 bg-slate-50 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                  <tr style={{ fontSize: '13px' }} className="font-black text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Department Name</th>
                    <th className="px-6 py-4">Performance Score</th>
                    <th className="px-6 py-4">Skill Index</th>
                    <th className="px-6 py-4">Training Completion</th>
                    <th className="px-6 py-4">Workforce Readiness</th>
                    <th className="px-6 py-4">Risk Level</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '14px' }} className="divide-y divide-slate-100 font-bold text-slate-700 bg-white">
                  {rankingRows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td style={{ fontSize: '15px' }} className="px-6 py-4 text-indigo-600 font-black">{row.rank}</td>
                      <td className="px-6 py-4">
                        <span className="text-slate-800 font-black">{row.name}</span>
                      </td>
                      <td style={{ fontSize: '15px' }} className={`px-6 py-4 font-black ${row.scoreColor}`}>{row.score}</td>
                      <td className="px-6 py-4 text-slate-500">{row.skill}</td>
                      <td className="px-6 py-4 text-slate-500">{row.comp}</td>
                      <td className="px-6 py-4 text-slate-500">{row.read}</td>
                      <td className="px-6 py-4">
                        <span style={{ fontSize: '12px' }} className={`font-black px-3 py-1 rounded-md ${row.riskBg} shadow-sm`}>{row.risk}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
              <span style={{ fontSize: '14px' }} className="font-semibold text-slate-400">Viewing metric cluster {activePage} of 1</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setActivePage(p => Math.max(1, p - 1))} disabled={activePage === 1} className="p-2 border border-slate-200 text-slate-400 rounded-lg bg-white disabled:opacity-40 shadow-sm"><ChevronLeft size={16} /></button>
                <button onClick={() => setActivePage(p => p + 1)} disabled className="p-2 border border-slate-200 text-slate-400 rounded-lg bg-white disabled:opacity-40 shadow-sm"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          {/* AI STRATEGIC INSIGHT BOX */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-indigo-200">
                <Sparkles size={24} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '12px' }} className="font-black px-2 py-0.5 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-md uppercase tracking-wider">AI Strategic Insight</span>
                </div>
                <h4 style={{ fontSize: '15px' }} className="font-black text-slate-800">Identify Skill Synergy: Product & Engineering</h4>
                <p style={{ fontSize: '14px' }} className="font-semibold text-slate-500 leading-relaxed max-w-4xl">
                  Analysis of recent cross-departmental projects indicates that teams with high "Design Systems" proficiency in Engineering outperform standard squads by <span className="text-slate-800 font-bold">24%</span> in delivery speed. We recommend prioritizing Design-to-Code training for the remaining 40% of Engineering staff.
                </p>
              </div>
            </div>
            <button style={{ fontSize: '14px' }} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all flex-shrink-0 shadow-md shadow-indigo-100 ml-4">
              View Skill Gap Analysis
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DepartmentComparison;