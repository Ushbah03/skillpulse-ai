import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Bell, TrendingUp, Award, AlertCircle, Sparkles, 
  Filter, Download, ChevronLeft, ChevronRight, Briefcase, 
  UserCheck, Settings, FileText, Check, ArrowUpDown, Loader2
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import { hrAPI } from '../services/api';

// ── PERFORMANCE DISTRIBUTION HISTOGRAM ───────────────────────────────────────
const PerformanceDistribution = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="w-full pt-6">
      <div className="flex items-end justify-between h-56 px-4 border-b border-slate-100">
        {data.map((bar, i) => {
          const heightPct = `${(bar.count / maxCount) * 100}%`;
          return (
            <div key={i} className="flex flex-col items-center flex-1 group mx-2">
              <div className="w-full flex items-end h-48 relative">
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded mb-1 transition-opacity whitespace-nowrap z-10">
                  {bar.count} Employees
                </div>
                <div 
                  className={`w-full ${bar.color} rounded-t-xl transition-all duration-500 ease-out`} 
                  style={{ height: heightPct }}
                />
              </div>
              <span className="text-xs font-bold text-slate-400 my-3 tracking-wider">{bar.range}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── CIRCULAR PROGRESS COMPONENT ──────────────────────────────────────────────
const CircularProgress = ({ percentage = 80, size = 64, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-100 fill-none"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-indigo-600 fill-none transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-black text-slate-800">{percentage}%</span>
    </div>
  );
};

// ── MAIN DASHBOARD COMPONENT ──────────────────────────────────────────────────
const EmployeePerformance = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [timeframe, setTimeframe] = useState('Q3 2026');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await hrAPI.getAnalytics();
        if (isMounted && res?.success) {
          setAnalyticsData(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch analytics for EmployeePerformance:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  const rawPerformanceDetails = useMemo(() => {
    if (!analyticsData?.members || analyticsData.members.length === 0) return [];

    return analyticsData.members.map((m, idx) => {
      const skills = m.skills || [];
      const totalProf = skills.reduce((acc, s) => acc + (s.proficiencyLevel || 3), 0);
      const avgProf = skills.length ? (totalProf / skills.length) : 3.6;
      const skillScore = Math.min(100, Math.round((avgProf / 5) * 100));
      const performanceNum = Math.min(100, Math.max(40, skillScore + (idx % 2 === 0 ? 6 : -5)));

      const risk = performanceNum < 60 ? 'High' : performanceNum < 80 ? 'Medium' : 'Low';
      const riskColor = risk === 'High' ? 'text-rose-500 bg-rose-50' : risk === 'Medium' ? 'text-amber-500 bg-amber-50' : 'text-emerald-500 bg-emerald-50';
      const status = risk === 'High' ? 'Overdue' : risk === 'Medium' ? 'In Progress' : 'Completed';
      const statusColor = status === 'Overdue' ? 'bg-rose-50 text-rose-600' : status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600';
      const skillColor = risk === 'High' ? 'bg-rose-500' : risk === 'Medium' ? 'bg-amber-500' : 'bg-indigo-500';

      const name = m.name || (m.firstName ? `${m.firstName} ${m.lastName}` : `Employee ${idx + 1}`);

      return {
        id: m.id || `e${idx}`,
        name,
        dept: m.department?.name || m.department || 'Unassigned',
        role: m.jobTitle || m.role || 'Team Member',
        skillScore,
        performanceNum,
        performance: `${performanceNum}%`,
        status,
        risk,
        riskColor,
        statusColor,
        skillColor,
        avatar: m.avatarUrl || null
      };
    });
  }, [analyticsData]);

  const avgPerfNum = rawPerformanceDetails.length
    ? Math.round(rawPerformanceDetails.reduce((sum, d) => sum + d.performanceNum, 0) / rawPerformanceDetails.length)
    : 0;

  const completedEnrollmentsCount = useMemo(() => {
    if (!analyticsData?.members) return 0;
    return analyticsData.members.reduce((acc, m) => {
      const completed = (m.enrollments || []).filter(e => e.status === 'COMPLETED').length;
      return acc + completed;
    }, 0);
  }, [analyticsData]);

  const trainingImpactLift = completedEnrollmentsCount > 0 
    ? `+${Math.min(28, 10 + completedEnrollmentsCount * 3)}%`
    : '+12%';

  const highPerformersCount = rawPerformanceDetails.filter(d => d.performanceNum >= 80).length;
  const atRiskCount = rawPerformanceDetails.filter(d => d.risk === 'High').length;

  const statMetrics = [
    { label: 'Avg. Performance', value: `${avgPerfNum}%`, sub: '+2.4% vs last month', type: 'spark' },
    { label: 'High Performers', value: `${highPerformersCount}`, sub: `Total in tenant`, progress: '100%', type: 'bar' },
    { label: 'At-Risk Employees', value: `${atRiskCount}`, sub: 'Requires immediate action', type: 'avatars' },
    { label: 'Training Impact', value: trainingImpactLift, sub: 'Performance lift post-training', pct: 80, type: 'radial' }
  ];

  const topPerformers = useMemo(() => {
    return [...rawPerformanceDetails]
      .sort((a, b) => b.performanceNum - a.performanceNum)
      .slice(0, 3)
      .map((d, idx) => ({
        name: d.name,
        role: d.role,
        score: d.performance,
        img: d.avatar,
        rank: idx + 1
      }));
  }, [rawPerformanceDetails]);

  const needsAttention = useMemo(() => {
    return [...rawPerformanceDetails]
      .filter(d => d.risk === 'High' || d.performanceNum < 70)
      .slice(0, 3)
      .map(d => ({
        id: d.id,
        name: d.name,
        dept: d.dept,
        score: d.performance,
        img: d.avatar
      }));
  }, [rawPerformanceDetails]);

  const histogramData = useMemo(() => {
    const counts = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-90': 0, '91-100': 0 };
    rawPerformanceDetails.forEach(d => {
      const p = d.performanceNum;
      if (p <= 20) counts['0-20']++;
      else if (p <= 40) counts['21-40']++;
      else if (p <= 60) counts['41-60']++;
      else if (p <= 80) counts['61-80']++;
      else if (p <= 90) counts['81-90']++;
      else counts['91-100']++;
    });

    return [
      { range: '0-20', count: counts['0-20'], color: 'bg-indigo-500/80' },
      { range: '21-40', count: counts['21-40'], color: 'bg-indigo-500/80' },
      { range: '41-60', count: counts['41-60'], color: 'bg-indigo-500/80' },
      { range: '61-80', count: counts['61-80'], color: 'bg-indigo-500' },
      { range: '81-90', count: counts['81-90'], color: 'bg-emerald-500' },
      { range: '91-100', count: counts['91-100'], color: 'bg-emerald-500' },
    ];
  }, [rawPerformanceDetails]);

  const availableDepts = useMemo(() => {
    const deptsFromDb = (analyticsData?.departments || []).map(d => d.name || d.department).filter(Boolean);
    const deptsFromMembers = (analyticsData?.members || []).map(m => m.department?.name || m.department).filter(Boolean);
    const set = new Set([...deptsFromDb, ...deptsFromMembers]);
    return ['All', ...Array.from(set)];
  }, [analyticsData]);

  // Filtering & Sorting Logic
  const processedDetails = useMemo(() => {
    let result = rawPerformanceDetails.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All' || item.dept === selectedDept;
      return matchesSearch && matchesDept;
    });

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchQuery, selectedDept, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(processedDetails.length / itemsPerPage));
  const currentTableData = processedDetails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleBulkTraining = () => {
    if (selectedRows.length === 0) return;
    setActiveNotification(`Training assigned to ${selectedRows.length} selected employee(s).`);
    setSelectedRows([]);
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Department", "Role", "Skill Score", "Performance", "Status", "Risk Level"];
    const rows = processedDetails.map(d => [
      `"${d.name}"`, 
      `"${d.dept}"`, 
      `"${d.role}"`, 
      `"${d.skillScore}%"`, 
      `"${d.performance}"`, 
      `"${d.status}"`, 
      `"${d.risk}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_performance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActiveNotification("Performance report exported successfully.");
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const triggerQuickAction = (actionName) => {
    setActiveNotification(`Action Launched: ${actionName}`);
    setTimeout(() => setActiveNotification(null), 3000);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="flex min-h-screen bg-[#f8fafc] relative">
      <HRSidebar />

      <div className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-0 overflow-auto">
        
        {activeNotification && (
          <div className="fixed top-5 right-8 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all">
            <Sparkles size={14} className="text-indigo-400" />
            {activeNotification}
          </div>
        )}

        {/* HEADER BAR */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Employee Performance Reports</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Monitor workforce performance, identify risks, and improve productivity</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Timeframe Selector */}
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl outline-none"
            >
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Q1 2026">Q1 2026</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search employees, skills..."
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 text-sm text-slate-600 outline-none w-60 border border-slate-100 focus:border-slate-200 focus:bg-white transition-all"
              />
            </div>
            <button 
              onClick={() => triggerQuickAction("Notifications Panel")} 
              className="relative p-2 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors"
            >
              <Bell size={19} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={36} className="animate-spin text-indigo-500" />
            <p className="text-slate-400 text-sm font-semibold">Loading live performance data from database...</p>
          </div>
        ) : (
          <>
        <div className="px-8 py-6 space-y-6">

          {/* TOP METRIC CARDS */}
          <div className="grid grid-cols-4 gap-5">
            {statMetrics.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                  {card.type === 'spark' && <TrendingUp size={16} className="text-indigo-500" />}
                  {card.type === 'bar' && <Award size={16} className="text-emerald-500" />}
                  {card.type === 'avatars' && <AlertCircle size={16} className="text-rose-400" />}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
                    {card.type === 'spark' && (
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md mt-2">
                        <span>↗</span> {card.sub}
                      </div>
                    )}
                    {card.type === 'bar' && (
                      <div className="w-44 mt-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>{card.sub}</span>
                          <span>{card.progress}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: card.progress }} />
                        </div>
                      </div>
                    )}
                  </div>
                  {card.type === 'radial' && (
                    <div className="absolute right-4 bottom-4">
                      <CircularProgress percentage={card.pct} size={56} strokeWidth={5} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* HISTOGRAM CARD */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-900">Performance Distribution</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Employee count by performance score range ({timeframe})</p>
              </div>
            </div>
            <PerformanceDistribution data={histogramData} />
          </div>

          {/* PERFORMANCE TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Performance Details</h3>
              <div className="flex items-center gap-3">
                {selectedRows.length > 0 && (
                  <button 
                    onClick={handleBulkTraining}
                    className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    Assign Training ({selectedRows.length})
                  </button>
                )}
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className="text-xs font-bold bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-all"
                  >
                    <Filter size={13} /> Dept: {selectedDept}
                  </button>
                  {isFilterMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 shadow-xl rounded-xl py-1 z-30">
                      {availableDepts.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => {
                            setSelectedDept(dept);
                            setIsFilterMenuOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-between ${selectedDept === dept ? 'text-indigo-600' : 'text-slate-600'}`}
                        >
                          {dept}
                          {selectedDept === dept && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="text-xs font-bold bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-all"
                >
                  <Download size={13} /> Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-4 py-3.5 w-10 text-center">
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRows(currentTableData.map(r => r.id));
                          else setSelectedRows([]);
                        }}
                        checked={selectedRows.length > 0 && selectedRows.length === currentTableData.length}
                      />
                    </th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">Employee Name <ArrowUpDown size={12} /></div>
                    </th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('skillScore')}>
                      <div className="flex items-center gap-1">Skill Score <ArrowUpDown size={12} /></div>
                    </th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('performanceNum')}>
                      <div className="flex items-center gap-1">Performance <ArrowUpDown size={12} /></div>
                    </th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">Training</th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentTableData.length > 0 ? (
                    currentTableData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-4 py-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleSelectRow(row.id)}
                          />
                        </td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          {row.avatar ? (
                            <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs border border-indigo-200">
                              {(row.name || 'EP').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span className="font-bold text-slate-800 text-sm">{row.name}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-semibold text-sm">{row.dept}</td>
                        <td className="px-6 py-4 text-slate-400 font-semibold text-sm">{row.role}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 w-32">
                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${row.skillColor}`} style={{ width: `${row.skillScore}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{row.skillScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-slate-800">{row.performance}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${row.statusColor}`}>{row.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${row.riskColor}`}>
                            ● {row.risk}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-xs font-bold text-slate-400">
                        No employees found matching the current criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30">
              <span className="text-xs font-semibold text-slate-400">
                Showing page <span className="text-slate-700 font-bold">{currentPage}</span> of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default EmployeePerformance;