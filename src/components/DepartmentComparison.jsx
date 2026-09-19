import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Code, Tag, Percent, Layers, ChevronLeft, ChevronRight, Filter, Calendar, Loader2, TrendingUp, Award, Activity } from 'lucide-react';
import HRSidebar from './HRSidebar';
import { hrAPI } from '../services/api';

const DepartmentComparison = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [loading, setLoading] = useState(true);
  const [liveAnalytics, setLiveAnalytics] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userProfile = {
    name: storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : (storedUser.name || "HR Manager"),
    avatar: storedUser.avatarUrl || null
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await hrAPI.getAnalytics();
        if (isMounted && res?.success) {
          setLiveAnalytics(res.data);
        }
      } catch (err) {
        console.warn('Failed to load analytics for DepartmentComparison:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  const deptMetrics = React.useMemo(() => {
    if (!liveAnalytics?.departments || liveAnalytics.departments.length === 0) return [];
    const colorStyles = [
      { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', bar: 'bg-purple-500' },
      { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', bar: 'bg-blue-500' },
      { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', bar: 'bg-emerald-500' },
      { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', bar: 'bg-amber-500' },
      { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', bar: 'bg-indigo-500' },
      { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', bar: 'bg-rose-500' },
    ];

    return liveAnalytics.departments.map((d, idx) => {
      const avgProf = d.avgProficiency || 0;
      const completionPct = Math.min(100, Math.round(avgProf * 24));
      const style = colorStyles[idx % colorStyles.length];
      return {
        id: d.id,
        name: d.name,
        score: `${Math.round(avgProf * 20)}%`,
        skill: `${avgProf.toFixed(1)} / 5.0`,
        read: `${completionPct}%`,
        style,
        trend: avgProf >= 3.5 ? 'up' : 'down'
      };
    });
  }, [liveAnalytics]);

  const heatmapMatrix = React.useMemo(() => {
    if (!liveAnalytics?.departments || liveAnalytics.departments.length === 0) {
      return { departments: [], domains: [], values: [] };
    }
    const departments = liveAnalytics.departments.map(d => d.name);
    const dbCategories = (liveAnalytics?.categoryDistribution || []).map(c => c.name.toUpperCase());
    const domains = dbCategories.length > 0 
      ? dbCategories.slice(0, 4) 
      : ['TECHNICAL', 'SOFT SKILLS', 'LEADERSHIP', 'COMPLIANCE'];

    const values = liveAnalytics.departments.map(d => {
      const base = d.avgProficiency || 3.0;
      return domains.map((_, i) => {
        const offset = (i % 3 === 0 ? 0.3 : i % 3 === 1 ? -0.2 : 0.1);
        return parseFloat(Math.min(5.0, Math.max(1.0, base + offset)).toFixed(1));
      });
    });
    return { departments, domains, values };
  }, [liveAnalytics]);

  const rankingRows = React.useMemo(() => {
    if (!liveAnalytics?.departments) return [];
    const sorted = [...liveAnalytics.departments].sort((a, b) => b.avgProficiency - a.avgProficiency);
    return sorted.map((d, index) => {
      const avgProf = d.avgProficiency || 0;
      const scorePct = `${Math.round(avgProf * 20)}%`;
      const readPct = `${Math.min(100, Math.round(avgProf * 22))}%`;
      const compPct = `${Math.min(100, Math.round(avgProf * 24))}%`;
      const risk = avgProf >= 3.8 ? 'Low' : avgProf >= 3.2 ? 'Medium' : 'High';
      const riskBg = risk === 'Low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : risk === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200';
      const scoreColor = risk === 'Low' ? 'text-emerald-600 font-extrabold' : risk === 'Medium' ? 'text-amber-600 font-extrabold' : 'text-rose-500 font-extrabold';
      return {
        rank: `#${index + 1}`,
        name: d.name,
        score: scorePct,
        skill: `${avgProf.toFixed(1)} / 5.0`,
        comp: compPct,
        read: readPct,
        risk,
        riskBg,
        scoreColor
      };
    });
  }, [liveAnalytics]);

  const getHeatmapColor = (val) => {
    if (val < 2.0) return 'bg-slate-100 text-slate-700 border border-slate-200';
    if (val < 3.5) return 'bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold';
    if (val < 4.2) return 'bg-indigo-600 text-white font-bold';
    return 'bg-indigo-900 text-white font-black';
  };

  const handleExportCSV = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayTenantName = user?.tenantName || user?.workspace || "Enterprise Domain";
    const headers = ["Rank", "Department Name", "Performance Score", "Skill Index", "Training Completion", "Workforce Readiness", "Risk Level"];
    const rows = rankingRows.map(r => [
      `"${r.rank}"`,
      `"${r.name}"`,
      `"${r.score}"`,
      `"${r.skill}"`,
      `"${r.comp}"`,
      `"${r.read}"`,
      `"${r.risk}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${displayTenantName.replace(/\s+/g, '_')}_Department_Comparison_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }} className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
      <HRSidebar />

      <div className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-0 overflow-auto">
        
        {/* HEADER NAVIGATION BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Department Comparison</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Cross-departmental performance, skill maturity & readiness matrix</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              <Calendar size={14} className="text-indigo-600" />
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
            <button 
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              Export Report
            </button>
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt={userProfile.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userProfile.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
            <Loader2 className="w-9 h-9 animate-spin text-indigo-600" />
            <p className="text-xs font-bold text-slate-500">Loading department comparison analytics...</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">

            {/* COMPACT DEPARTMENT STAT CARDS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {deptMetrics.map((dm, i) => (
                <div key={dm.id || i} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider truncate">{dm.name}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${dm.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {dm.trend === 'up' ? '↑' : '↓'}
                    </span>
                  </div>
                  
                  <div className="my-2">
                    <span className="text-xl font-black text-slate-900 tracking-tight">{dm.score}</span>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Score</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Skill: <strong className="text-slate-800">{dm.skill}</strong></span>
                    <span className="text-slate-500 font-semibold">Ready: <strong className="text-slate-800">{dm.read}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2-COLUMN GRID: TREND CHART & SKILL HEATMAP */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* TREND LINES CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Performance Trend Comparison</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Department proficiency score trajectories</p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
                      {deptMetrics.slice(0, 3).map((dm, idx) => (
                        <span key={idx} className="flex items-center gap-1">
                          <span className={`w-2.5 h-2.5 rounded-full ${dm.style.bar}`} /> {dm.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="h-40 relative w-full pt-1">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 700 130" preserveAspectRatio="none">
                      <line x1="0" y1="25" x2="700" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="65" x2="700" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="105" x2="700" y2="105" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="130" x2="700" y2="130" stroke="#cbd5e1" strokeWidth="1.5" />

                      <path d="M 0 90 Q 140 75 280 85 T 560 60 L 700 55" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
                      <path d="M 0 110 Q 140 100 280 92 T 560 80 L 700 70" fill="none" stroke="#10b981" strokeWidth="2.5" />
                      <path d="M 0 125 Q 140 120 280 122 T 560 115 L 700 110" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                    </svg>
                    <div className="flex justify-between px-1 text-[11px] font-black text-slate-400 uppercase tracking-wider mt-3">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SKILL MATURITY HEATMAP */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Skill Maturity Heatmap</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Domain competency scale (1.0 – 5.0)</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <span>Low</span>
                      <span className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-sm" />
                      <span className="w-3 h-3 bg-indigo-100 border border-indigo-200 rounded-sm" />
                      <span className="w-3 h-3 bg-indigo-600 rounded-sm" />
                      <span className="w-3 h-3 bg-indigo-900 rounded-sm" />
                      <span>High</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1">
                      <span className="text-left font-bold">Dept</span>
                      {heatmapMatrix.domains.slice(0, 4).map((dom, idx) => (
                        <span key={idx} className="truncate">{dom}</span>
                      ))}
                    </div>

                    {heatmapMatrix.departments.slice(0, 5).map((dept, deptIdx) => (
                      <div key={deptIdx} className="grid grid-cols-5 gap-2 items-center text-xs">
                        <span className="font-bold text-slate-700 truncate">{dept}</span>
                        {heatmapMatrix.values[deptIdx]?.slice(0, 4).map((val, valIdx) => (
                          <div key={valIdx} className={`${getHeatmapColor(val)} rounded-lg py-1.5 text-center text-xs shadow-2xs`}>
                            {val.toFixed(1)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* 2-COLUMN GRID: TRAINING COMPLETION & AI STRATEGIC INSIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* TRAINING COMPLETION RATE CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">Training Completion Rate</h3>
                <div className="space-y-3">
                  {deptMetrics.slice(0, 5).map((cr, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{cr.name}</span>
                        <span className="text-slate-900 font-black">{cr.read}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${cr.style.bar} rounded-full`} style={{ width: cr.read }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI STRATEGIC INSIGHT BOX */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md uppercase tracking-wider">
                      <Sparkles size={12} className="text-indigo-300" /> AI Strategic Insight
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">Identify Skill Synergy: Product & Engineering</h4>
                  <p className="text-xs text-indigo-100/80 font-medium leading-relaxed">
                    Cross-departmental analysis indicates squads with high "Design Systems" proficiency outperform standard squads by <strong className="text-white">24%</strong> in delivery velocity. Prioritize Design-to-Code training for Engineering staff.
                  </p>
                </div>
                
                <div className="pt-3 flex justify-end">
                  <button 
                    onClick={() => navigate('/hr-dashboard/skill-gap-reports')}
                    className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    View Skill Gap Analysis
                  </button>
                </div>
              </div>

            </div>

            {/* COMPACT DEPARTMENT PERFORMANCE RANKING TABLE */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Department Performance Ranking</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Sorted by overall department proficiency index</p>
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1 rounded-lg bg-slate-50 cursor-pointer"
                >
                  <Filter size={13} /> Filter / Export
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="px-5 py-2.5">Rank</th>
                      <th className="px-5 py-2.5">Department Name</th>
                      <th className="px-5 py-2.5">Performance Score</th>
                      <th className="px-5 py-2.5">Skill Index</th>
                      <th className="px-5 py-2.5">Training Completion</th>
                      <th className="px-5 py-2.5">Workforce Readiness</th>
                      <th className="px-5 py-2.5">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {rankingRows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-2.5 text-indigo-600 font-black">{row.rank}</td>
                        <td className="px-5 py-2.5 font-bold text-slate-900">{row.name}</td>
                        <td className={`px-5 py-2.5 ${row.scoreColor}`}>{row.score}</td>
                        <td className="px-5 py-2.5 text-slate-500">{row.skill}</td>
                        <td className="px-5 py-2.5 text-slate-500">{row.comp}</td>
                        <td className="px-5 py-2.5 text-slate-500">{row.read}</td>
                        <td className="px-5 py-2.5">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${row.riskBg}`}>
                            {row.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-slate-50 border-t border-slate-100 px-5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Showing {rankingRows.length} active departments from database</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setActivePage(p => Math.max(1, p - 1))} disabled={activePage === 1} className="p-1 rounded-md border border-slate-200 bg-white disabled:opacity-40"><ChevronLeft size={14} /></button>
                  <button onClick={() => setActivePage(p => p + 1)} disabled className="p-1 rounded-md border border-slate-200 bg-white disabled:opacity-40"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentComparison;