import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ChevronLeft, ChevronRight, Filter, Calendar, 
  Loader2, TrendingUp, TrendingDown, Users, Download
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import { hrAPI } from '../services/api';

const DepartmentComparison = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [loading, setLoading] = useState(true);
  const [liveAnalytics, setLiveAnalytics] = useState(null);

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const handleScroll = (dir) => {
    if (scrollContainerRef.current) {
      const offset = dir === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const colorStyles = [
    { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', bar: 'bg-indigo-500', stroke: '#6366f1' },
    { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', bar: 'bg-emerald-500', stroke: '#10b981' },
    { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', bar: 'bg-purple-500', stroke: '#8b5cf6' },
    { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', bar: 'bg-amber-500', stroke: '#f59e0b' },
    { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', bar: 'bg-blue-500', stroke: '#3b82f6' },
    { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', bar: 'bg-rose-500', stroke: '#f43f5e' },
  ];

  const deptMetrics = useMemo(() => {
    if (!liveAnalytics?.departments || liveAnalytics.departments.length === 0) return [];

    return liveAnalytics.departments.map((d, idx) => {
      const avgProf = d.avgProficiency || 0;
      const perfScore = d.performanceScore ?? (d.hasSkills ? Math.round((avgProf / 5.0) * 100) : 0);
      const readiness = d.readinessPct ?? (d.hasSkills ? Math.round((avgProf / 5.0) * 100) : 0);
      const trainingComp = d.trainingCompletion ?? 0;
      const style = colorStyles[idx % colorStyles.length];
      const hasSkills = Boolean(d.hasSkills && avgProf > 0);

      return {
        id: d.id,
        name: d.name,
        memberCount: d.memberCount || 0,
        score: `${perfScore}%`,
        perfScore,
        skill: hasSkills ? `${avgProf.toFixed(1)} / 5.0` : '0.0 / 5.0',
        avgProf,
        read: `${readiness}%`,
        readinessPct: readiness,
        trainingCompletion: trainingComp,
        totalEnrollments: d.totalEnrollments || 0,
        completedEnrollmentsCount: d.completedEnrollmentsCount || 0,
        hasSkills,
        style,
        trend: avgProf >= 3.5 ? 'up' : 'down',
        scores: d.scores || [],
        monthlyTrend: d.monthlyTrend || []
      };
    });
  }, [liveAnalytics]);

  const trendChartData = useMemo(() => {
    if (!liveAnalytics?.departments || liveAnalytics.departments.length === 0) {
      return { months: [], lines: [] };
    }

    let rawMonths = (liveAnalytics.gapTrend || []).map(g => g.month);
    if (!rawMonths || rawMonths.length === 0) {
      rawMonths = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    }

    let sliceCount = 6;
    if (selectedPeriod === '3M') sliceCount = 3;
    else if (selectedPeriod === 'YTD') sliceCount = Math.min(rawMonths.length, new Date().getMonth() + 1);

    const activeMonths = rawMonths.slice(-sliceCount);

    const activeDepts = deptMetrics.filter(d => d.hasSkills || d.monthlyTrend?.some(m => m.score > 0));
    const deptsToPlot = activeDepts.length > 0 ? activeDepts.slice(0, 3) : deptMetrics.slice(0, 3);

    const lines = deptsToPlot.map(dept => {
      const trendMap = {};
      (dept.monthlyTrend || []).forEach(m => { trendMap[m.month] = m.score; });
      const points = activeMonths.map(m => trendMap[m] ?? (dept.hasSkills ? dept.avgProf : 0.0));
      return {
        name: dept.name,
        color: dept.style.stroke,
        points,
        latestScore: points[points.length - 1] || 0
      };
    });

    return { months: activeMonths, lines };
  }, [deptMetrics, liveAnalytics, selectedPeriod]);

  const heatmapDomains = useMemo(() => {
    if (liveAnalytics?.heatmapColumns && liveAnalytics.heatmapColumns.length > 0) {
      return liveAnalytics.heatmapColumns.slice(0, 5);
    }
    return ['CLOUD & SYSTEMS', 'SOFTWARE ENG', 'PRODUCT & DESIGN', 'DATA & AI', 'PROBLEM SOLVING'];
  }, [liveAnalytics]);

  const rankingRows = useMemo(() => {
    if (!deptMetrics || deptMetrics.length === 0) return [];
    const sorted = [...deptMetrics].sort((a, b) => b.perfScore - a.perfScore);
    return sorted.map((d, index) => {
      let risk = 'Unassessed';
      let riskBg = 'bg-slate-100 text-slate-600 border border-slate-200';
      let scoreColor = 'text-slate-400 font-bold';

      if (d.hasSkills) {
        if (d.avgProf >= 4.0) {
          risk = 'Low';
          riskBg = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
          scoreColor = 'text-emerald-600 font-extrabold';
        } else if (d.avgProf >= 3.0) {
          risk = 'Medium';
          riskBg = 'bg-amber-50 text-amber-700 border border-amber-200';
          scoreColor = 'text-amber-600 font-extrabold';
        } else {
          risk = 'High';
          riskBg = 'bg-rose-50 text-rose-700 border border-rose-200';
          scoreColor = 'text-rose-500 font-extrabold';
        }
      }

      return {
        rank: `#${index + 1}`,
        name: d.name,
        score: `${d.perfScore}%`,
        skill: d.skill,
        comp: `${d.trainingCompletion}%`,
        read: `${d.readinessPct}%`,
        risk,
        riskBg,
        scoreColor
      };
    });
  }, [deptMetrics]);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(rankingRows.length / ITEMS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return rankingRows.slice(start, start + ITEMS_PER_PAGE);
  }, [rankingRows, activePage]);

  const getHeatmapColor = (val) => {
    if (val <= 0) return 'bg-slate-50 text-slate-400 border border-slate-100';
    if (val < 2.5) return 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold';
    if (val < 3.8) return 'bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold';
    if (val < 4.5) return 'bg-indigo-600 text-white font-bold';
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
              <Download size={13} />
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

            {/* SCROLLABLE HORIZONTAL DEPARTMENT CARDS (LOVABLE-STYLE) */}
            <div className="bg-transparent">
              <div className="flex items-center justify-between mb-2 px-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Department Overview</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {deptMetrics.length} Departments
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleScroll('left')} 
                    disabled={!canScrollLeft} 
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
                    title="Scroll left"
                  >
                    <ChevronLeft size={14} className="text-slate-600" />
                  </button>
                  <button 
                    onClick={() => handleScroll('right')} 
                    disabled={!canScrollRight} 
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
                    title="Scroll right"
                  >
                    <ChevronRight size={14} className="text-slate-600" />
                  </button>
                </div>
              </div>

              <div 
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex gap-3 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {deptMetrics.map((dm) => (
                  <div 
                    key={dm.id} 
                    className="min-w-[215px] max-w-[215px] shrink-0 bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider truncate max-w-[130px]" title={dm.name}>
                        {dm.name}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${dm.hasSkills ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {dm.hasSkills ? '↑ active' : '— unassessed'}
                      </span>
                    </div>
                    
                    <div className="my-2.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-slate-900 tracking-tight">{dm.score}</span>
                        <span className="text-[10px] font-bold text-slate-400">score</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                        {dm.memberCount} {dm.memberCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold">Skill: <strong className="text-slate-800">{dm.skill}</strong></span>
                      <span className="text-slate-500 font-semibold">Ready: <strong className="text-slate-800">{dm.read}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-COLUMN GRID: TREND CHART & SKILL HEATMAP */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* TREND LINES CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Performance Trend Comparison</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Department proficiency score trajectories ({selectedPeriod})</p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 flex-wrap">
                      {trendChartData.lines.map((line, idx) => (
                        <span key={idx} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} /> 
                          <span className="text-slate-700">{line.name}</span>
                          <span className="text-slate-400 text-[10px]">({line.latestScore.toFixed(1)})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="h-44 relative w-full pt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 700 140" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="25" y1="20" x2="675" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="25" y1="55" x2="675" y2="55" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="25" y1="90" x2="675" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="25" y1="125" x2="675" y2="125" stroke="#e2e8f0" strokeWidth="1.5" />

                      {/* Dynamic Trend Lines computed from DB monthly records */}
                      {trendChartData.lines.map((line, lineIdx) => {
                        const pts = line.points;
                        if (!pts || pts.length === 0) return null;
                        const w = 650;
                        const h = 105;
                        const pathD = pts.map((p, i) => {
                          const x = 25 + (i / Math.max(1, pts.length - 1)) * w;
                          const y = 125 - (Math.min(5.0, Math.max(0, p)) / 5.0) * h;
                          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                        }).join(' ');

                        return (
                          <g key={lineIdx}>
                            <path 
                              d={pathD} 
                              fill="none" 
                              stroke={line.color} 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                            />
                            {pts.map((p, i) => {
                              const x = 25 + (i / Math.max(1, pts.length - 1)) * w;
                              const y = 125 - (Math.min(5.0, Math.max(0, p)) / 5.0) * h;
                              return (
                                <circle 
                                  key={i} 
                                  cx={x} 
                                  cy={y} 
                                  r="4" 
                                  fill="#ffffff" 
                                  stroke={line.color} 
                                  strokeWidth="2.5"
                                >
                                  <title>{`${line.name}: ${p.toFixed(1)} / 5.0 (${trendChartData.months[i]})`}</title>
                                </circle>
                              );
                            })}
                          </g>
                        );
                      })}
                    </svg>

                    <div className="flex justify-between px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider mt-2">
                      {trendChartData.months.map((m, i) => (
                        <span key={i}>{m}</span>
                      ))}
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
                      <p className="text-[11px] text-slate-400 font-medium">Domain competency scale (1.0 – 5.0) from verified skills</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <span>Low</span>
                      <span className="w-3 h-3 bg-slate-50 border border-slate-200 rounded-sm" />
                      <span className="w-3 h-3 bg-indigo-100 border border-indigo-200 rounded-sm" />
                      <span className="w-3 h-3 bg-indigo-600 rounded-sm" />
                      <span className="w-3 h-3 bg-indigo-900 rounded-sm" />
                      <span>High</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1">
                      <span className="text-left font-bold truncate">Dept</span>
                      {heatmapDomains.map((dom, idx) => (
                        <span key={idx} className="truncate" title={dom}>{dom}</span>
                      ))}
                    </div>

                    {deptMetrics.slice(0, 5).map((dept, deptIdx) => (
                      <div key={deptIdx} className="grid grid-cols-6 gap-2 items-center text-xs">
                        <span className="font-bold text-slate-700 truncate" title={dept.name}>{dept.name}</span>
                        {heatmapDomains.map((_, valIdx) => {
                          const val = dept.scores?.[valIdx] || 0.0;
                          return (
                            <div 
                              key={valIdx} 
                              className={`${getHeatmapColor(val)} rounded-lg py-1.5 text-center text-xs shadow-2xs font-semibold`}
                            >
                              {val > 0 ? val.toFixed(1) : '—'}
                            </div>
                          );
                        })}
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
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Training Completion Rate</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Real-time enrollment progress across active departments</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Live Enrollments</span>
                </div>
                <div className="space-y-3.5">
                  {deptMetrics.slice(0, 5).map((cr, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-800">{cr.name}</span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            ({cr.totalEnrollments} {cr.totalEnrollments === 1 ? 'course' : 'courses'})
                          </span>
                        </div>
                        <span className="text-slate-900 font-black">{cr.trainingCompletion}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${cr.style.bar} rounded-full transition-all duration-500`} 
                          style={{ width: `${cr.trainingCompletion}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI STRATEGIC INSIGHT BOX */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md uppercase tracking-wider">
                      <Sparkles size={12} className="text-indigo-300" /> AI Strategic Insight
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">100% Real Dataset</span>
                  </div>
                  <h4 className="text-sm font-black text-white">
                    {liveAnalytics?.deptInsight?.title || "Cross-Departmental Skill Synergy & Readiness"}
                  </h4>
                  <p className="text-xs text-indigo-100/80 font-medium leading-relaxed">
                    {liveAnalytics?.deptInsight?.summary || liveAnalytics?.aiInsight || "Live capability profiling is active across all tenant departments. Real-time verified proficiency indices and courseware completions are continuously monitored."}
                  </p>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => navigate('/hr-dashboard/skill-gap-reports')}
                    className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    View Skill Gap Analysis
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

            </div>

            {/* COMPACT DEPARTMENT PERFORMANCE RANKING TABLE */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Department Performance Ranking</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Ranked by performance score, verified proficiency and training completion</p>
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all"
                >
                  <Filter size={13} /> Export CSV
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
                    {paginatedRows.map((row, i) => (
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
                <span>
                  Showing {Math.min(rankingRows.length, (activePage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(rankingRows.length, activePage * ITEMS_PER_PAGE)} of {rankingRows.length} active departments
                </span>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setActivePage(p => Math.max(1, p - 1))} 
                    disabled={activePage === 1} 
                    className="p-1 rounded-md border border-slate-200 bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs text-slate-600 font-bold px-1.5">{activePage} / {totalPages}</span>
                  <button 
                    onClick={() => setActivePage(p => Math.min(totalPages, p + 1))} 
                    disabled={activePage >= totalPages} 
                    className="p-1 rounded-md border border-slate-200 bg-white disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
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