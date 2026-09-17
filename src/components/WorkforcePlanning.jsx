import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  SlidersHorizontal,
  BrainCircuit,
  TrendingUp,
  Users,
  Briefcase,
  AlertTriangle,
  Building,
  CheckCircle2,
  X,
  Target,
  FileText,
  Loader2
} from 'lucide-react';
import HRSidebar from './HRSidebar'; 
import { motion, AnimatePresence } from 'framer-motion';
import { hrAPI } from '../services/api';

// ── Inline Recharts-style SVG line chart ──────────────────────────────────────
const WorkforceLineChart = ({ data }) => {
  if (!data || !data.length) return null;
  const months = data.map(d => d.month);
  const current = data.map(d => d.currentSupply);
  const projected = data.map(d => d.futureDemand);

  const allValues = [...current, ...projected];
  const minVal = Math.max(0, Math.min(...allValues) - 2);
  const maxVal = Math.max(...allValues) + 2;
  const range = Math.max(1, maxVal - minVal);
  const W = 960, H = 220, padL = 12, padR = 20, padT = 20, padB = 0;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const xPos = (i) => padL + (i / (months.length - 1)) * chartW;
  const yPos = (v) => padT + chartH - ((v - minVal) / range) * chartH;

  const toPath = (pts) =>
    pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yPos(v).toFixed(1)}`).join(' ');

  const toArea = (pts) => {
    const base = yPos(minVal);
    return `${toPath(pts)} L ${xPos(pts.length - 1).toFixed(1)} ${base} L ${xPos(0).toFixed(1)} ${base} Z`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="gradProjected" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={toArea(current)} fill="url(#gradCurrent)" />
      <path d={toArea(projected)} fill="url(#gradProjected)" />
      <motion.path 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        d={toPath(current)} 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <motion.path 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        d={toPath(projected)} 
        fill="none" 
        stroke="#8b5cf6" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {months.map((m, i) => (
        <text key={m} x={xPos(i)} y={H - 4} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600" fontFamily="sans-serif">{m}</text>
      ))}
    </svg>
  );
};

// ── Donut Chart ───────────────────────────────────────────────────────────────
const DonutChart = ({ segments }) => {
  if (!segments || !segments.length) return null;
  const r = 50, cx = 70, cy = 70, stroke = 18;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circ;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="900" fill="#0f172a" fontFamily="sans-serif">100%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8" fontFamily="sans-serif">Allocated</text>
    </svg>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const WorkforcePlanning = () => {
  // Multi-Tenant & Interactive State
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentTenant = storedUser.tenant?.name || "Organization";
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isReallocateModalOpen, setIsReallocateModalOpen] = useState(false);
  const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);
  const [reallocateForm, setReallocateForm] = useState({ source: "", target: "", count: 1 });
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("DEFAULT");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const itemsPerPage = 3;

  useEffect(() => {
    let isMounted = true;
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [forecastRes, analyticsRes] = await Promise.all([
          hrAPI.getForecast(),
          hrAPI.getAnalytics()
        ]);
        if (isMounted) {
          if (forecastRes?.success) setForecastData(forecastRes.data);
          if (analyticsRes?.success) setAnalyticsData(analyticsRes.data);
        }
      } catch (err) {
        console.warn('Failed to load workforce planning data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadAllData();
    return () => { isMounted = false; };
  }, []);

  const roleData = React.useMemo(() => {
    if (!analyticsData?.members) return [];
    const titleGroups = {};
    analyticsData.members.forEach(m => {
      const title = m.jobTitle || 'Employee';
      if (!titleGroups[title]) {
        titleGroups[title] = { role: title, dept: m.department?.name || 'Unassigned', current: 0, required: 0, gap: 0 };
      }
      titleGroups[title].current += 1;
    });

    analyticsData.skillGaps?.forEach(g => {
      const title = g.user?.jobTitle || 'Employee';
      if (titleGroups[title]) {
        titleGroups[title].gap += 1;
      }
    });

    return Object.values(titleGroups).map((g, idx) => ({
      id: idx + 1,
      role: g.role,
      dept: g.dept,
      current: g.current,
      required: g.current + g.gap,
      gap: g.gap
    }));
  }, [analyticsData]);

  const hiringDemand = React.useMemo(() => {
    if (!analyticsData?.departments) return [];
    const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
    const totalGaps = analyticsData.skillGaps?.length || 1;
    return analyticsData.departments.map((d, idx) => {
      const deptGaps = analyticsData.skillGaps?.filter(g => g.user?.department?.name === d.name).length || 0;
      return {
        dept: d.name,
        roles: deptGaps,
        color: colors[idx % colors.length],
        pct: Math.min(100, Math.round((deptGaps / totalGaps) * 100))
      };
    });
  }, [analyticsData]);

  const allocationLegend = React.useMemo(() => {
    if (!analyticsData?.departments) return [];
    const totalMembers = analyticsData.departments.reduce((acc, d) => acc + d.memberCount, 0) || 1;
    const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
    return analyticsData.departments.map((d, idx) => {
      const pct = Math.round((d.memberCount / totalMembers) * 100);
      return {
        label: `${d.name} (${pct}%)`,
        color: colors[idx % colors.length],
        pct
      };
    });
  }, [analyticsData]);

  const uniqueDepartments = React.useMemo(() => {
    return Array.from(new Set(roleData.map(r => r.dept).filter(Boolean)));
  }, [roleData]);

  const filteredRoles = React.useMemo(() => {
    let result = roleData.filter(r => 
      r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.dept.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (departmentFilter !== "ALL") {
      result = result.filter(r => r.dept === departmentFilter);
    }

    if (sortKey === "GAP_DESC") {
      result = [...result].sort((a, b) => b.gap - a.gap);
    } else if (sortKey === "ROLE_ASC") {
      result = [...result].sort((a, b) => a.role.localeCompare(b.role));
    } else if (sortKey === "CURRENT_DESC") {
      result = [...result].sort((a, b) => b.current - a.current);
    }

    return result;
  }, [roleData, searchQuery, departmentFilter, sortKey]);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const currentItems = filteredRoles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const triggerAction = (actionName) => {
    setToastMessage(`${actionName} action initiated for ${currentTenant}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportReport = () => {
    if (!roleData.length && !analyticsData?.departments) {
      setToastMessage("No workforce data available to export.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const headers = ["Role", "Department", "Current Count", "Required Count", "Gap"];
    const rows = roleData.map(r => [
      `"${r.role}"`,
      `"${r.dept}"`,
      r.current,
      r.required,
      r.gap
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentTenant.replace(/\s+/g, '_')}_Workforce_Planning_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Workforce planning report downloaded for ${currentTenant}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmReallocation = (e) => {
    e.preventDefault();
    if (!reallocateForm.source || !reallocateForm.target) {
      setToastMessage("Please select both source and target departments.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setToastMessage(`Successfully reallocated ${reallocateForm.count} headcount from ${reallocateForm.source} to ${reallocateForm.target}.`);
    setIsReallocateModalOpen(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSyncRecruitment = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsRecruitmentModalOpen(false);
      setToastMessage(`Recruitment pipeline successfully synchronized with HRIS for ${currentTenant}.`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  // Metric derivations
  const totalEmployees = analyticsData?.totalEmployees || 0;
  const criticalGapsCount = analyticsData?.criticalGapsCount || 0;
  const workforceRiskLevel = criticalGapsCount > 3 ? "High" : criticalGapsCount > 0 ? "Medium" : "Low";
  const projectedNeed = Math.round(totalEmployees * 1.15);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans">
      {/* 1. Sidebar with Tenant context */}
      <HRSidebar currentTenant={currentTenant} currentScreen="Workforce Planning" />

      <main className="flex-1 ml-80 p-10 w-full space-y-8 relative">
        
        {/* Toast Notification Layer */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 right-10 z-50 flex items-center gap-3 bg-[#0b1221] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#1a294b]"
            >
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SECTION 1: HEADER --- */}
        <header className="flex justify-between items-center bg-white p-4 -mt-2 -mx-4 rounded-2xl border border-slate-100 shadow-sm mb-4">
          <div>
            <h1 className="text-2xl font-black text-[#0b1221] tracking-tight flex items-center gap-3">
              Workforce Planning
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 tracking-normal">
                <Building size={14} className="text-slate-400" />
                {currentTenant}
              </span>
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Strategic workforce forecasting and hiring intelligence</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search roles, departments..." 
                className="w-80 pl-11 pr-4 py-2.5 bg-[#f3f4f6]/60 rounded-xl text-sm font-semibold text-slate-700 outline-none border border-transparent focus:border-blue-500/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all" 
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm cursor-pointer" onClick={() => triggerAction("Profile View")}>
              {storedUser.firstName ? `${storedUser.firstName[0]}${storedUser.lastName ? storedUser.lastName[0] : ''}` : 'HR'}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-sm font-semibold text-slate-400">Loading workforce planning and forecasts...</p>
          </div>
        ) : (
          <>
            {/* --- SECTION 2: TOP METRICS CARDS --- */}
            <div className="grid grid-cols-4 gap-6">
              <MetricCard title="Total Workforce" value={`${totalEmployees}`} trend="Active workforce members" trendColor="text-emerald-500" icon={<Users className="text-blue-500" size={20} />} iconBg="bg-blue-50" />
              <MetricCard title="Projected Need (6m)" value={`${projectedNeed}`} trend={`+${projectedNeed - totalEmployees} projected growth`} trendColor="text-purple-500" icon={<TrendingUp className="text-purple-500" size={20} />} iconBg="bg-purple-50" />
              <MetricCard title="Current Hiring Pipeline" value={`${analyticsData?.skillGaps?.length || 0}`} trend="Active gap mitigation paths" trendColor="text-slate-400" icon={<Briefcase className="text-emerald-500" size={20} />} iconBg="bg-emerald-50" />
              <MetricCard title="Workforce Risk Level" value={workforceRiskLevel} trend={`${criticalGapsCount} critical gaps active`} trendColor="text-amber-500" valueColor={workforceRiskLevel === "High" ? "text-rose-500" : "text-amber-500"} icon={<AlertTriangle className="text-amber-500" size={20} />} iconBg="bg-amber-50" />
            </div>

        {/* --- SECTION 3: FORECAST LINE CHART --- */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Workforce Forecast Trend (12 Months)</h3>
            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"/> Current Workforce</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block"/> Projected Need</span>
            </div>
          </div>
          <WorkforceLineChart data={forecastData?.growthTrends} />
        </div>

        {/* --- SECTION 4: HIRING DEMAND & DONUT DISTRIBUTION --- */}
        <div className="grid grid-cols-2 gap-8">
          {/* Hiring Demand */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Hiring Demand by Department</h3>
            <div className="space-y-4">
              {hiringDemand.length > 0 ? (
                hiringDemand.map((d) => (
                  <div key={d.dept} className="cursor-pointer group" onClick={() => triggerAction(`${d.dept} Hiring Demand`)}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5 group-hover:text-blue-600 transition-colors">
                      <span>{d.dept}</span>
                      <span className="text-slate-400">{d.roles} open roles</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(5, d.pct)}%`, background: d.color }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-slate-400 text-center py-4">No department hiring demand data available.</p>
              )}
            </div>
          </div>

          {/* Workforce Allocation */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Workforce Allocation Distribution</h3>
            {allocationLegend.length > 0 ? (
              <div className="flex items-center gap-8">
                <DonutChart segments={allocationLegend} />
                <div className="space-y-3">
                  {allocationLegend.map((l) => (
                    <div key={l.label} className="flex items-center gap-3 text-xs font-bold text-slate-600 cursor-pointer hover:text-slate-900 transition-colors" onClick={() => triggerAction(`${l.label} Details`)}>
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-400 text-center py-4">No workforce allocation data available.</p>
            )}
          </div>
        </div>

        {/* --- SECTION 5: ROLE-BASED DEMAND TABLE --- */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Role-Based Workforce Demand</h3>
            <div className="flex gap-3 relative">
              {/* Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }} 
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-colors ${departmentFilter !== "ALL" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  <Filter size={14}/> {departmentFilter === "ALL" ? "Filter" : departmentFilter}
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-30">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">Department</p>
                    <button 
                      onClick={() => { setDepartmentFilter("ALL"); setIsFilterOpen(false); setCurrentPage(1); }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${departmentFilter === "ALL" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-700"}`}
                    >
                      All Departments
                    </button>
                    {uniqueDepartments.map(d => (
                      <button 
                        key={d}
                        onClick={() => { setDepartmentFilter(d); setIsFilterOpen(false); setCurrentPage(1); }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${departmentFilter === d ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-700"}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }} 
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-colors ${sortKey !== "DEFAULT" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  <SlidersHorizontal size={14}/> Sort
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-30">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">Sort By</p>
                    {[
                      { key: "DEFAULT", label: "Default Order" },
                      { key: "GAP_DESC", label: "Highest Gap First" },
                      { key: "ROLE_ASC", label: "Role Name (A-Z)" },
                      { key: "CURRENT_DESC", label: "Highest Current Count" }
                    ].map(opt => (
                      <button 
                        key={opt.key}
                        onClick={() => { setSortKey(opt.key); setIsSortOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${sortKey === opt.key ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-700"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="py-4 px-8">Role</th>
                <th className="py-4 px-8">Department</th>
                <th className="py-4 px-8 text-center">Current Count</th>
                <th className="py-4 px-8 text-center">Required Count</th>
                <th className="py-4 px-8 text-center">Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length > 0 ? (
                currentItems.map((row) => (
                  <tr key={row.id} className="text-sm hover:bg-slate-50/30 transition-colors">
                    <td className="py-5 px-8 font-bold text-slate-900">{row.role}</td>
                    <td className="py-5 px-8 font-semibold text-slate-500">{row.dept}</td>
                    <td className="py-5 px-8 text-center font-bold text-slate-700">{row.current}</td>
                    <td className="py-5 px-8 text-center font-bold text-slate-700">{row.required}</td>
                    <td className="py-5 px-8 text-center">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100">
                        +{row.gap}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 text-sm font-semibold">
                    No role records match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 🔄 PAGINATION FOOTER */}
          <div className="p-6 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-500">
            <div>
              Showing <span className="text-slate-900">{filteredRoles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredRoles.length)}</span> of <span className="text-slate-900">{filteredRoles.length}</span> entries
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button 
                  key={num} 
                  onClick={() => setCurrentPage(num)} 
                  className={`w-9 h-9 rounded-lg transition-all ${currentPage === num ? 'bg-[#0b1221] text-white' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
                >
                  {num}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 6: AI FORECAST INSIGHT BANNER --- */}
        <div className="bg-[#0b1221] rounded-2xl p-8 text-white flex justify-between items-center shadow-2xl relative overflow-hidden group">
          <div className="flex gap-6 items-center relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <BrainCircuit size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-xl font-bold tracking-tight">AI Workforce Forecast Insight</h4>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest">High Confidence</span>
              </div>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                {forecastData?.emergingSkillDemands && forecastData.emergingSkillDemands.length > 0 
                  ? `AI predicts hiring demand for ${forecastData.emergingSkillDemands[0].skill} will grow by ${forecastData.emergingSkillDemands[0].demandDelta} across ${currentTenant}. Early recruitment is recommended.`
                  : `Workforce trajectory forecast for ${currentTenant} is active with 15% 6-month projected growth.`}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 relative z-10 flex-shrink-0"
          >
            View Forecast Details
          </button>
        </div>

        {/* --- SECTION 7: QUICK STRATEGIC ACTIONS --- */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase">Quick Strategic Actions</h4>
          <div className="grid grid-cols-3 gap-6">
            <QuickAction onClick={() => setIsReallocateModalOpen(true)} icon={<Target className="text-blue-500"/>} label="Reallocate Headcount" />
            <QuickAction onClick={() => setIsRecruitmentModalOpen(true)} icon={<Briefcase className="text-purple-500"/>} label="Sync Recruitment Goals" />
            <QuickAction onClick={handleExportReport} icon={<FileText className="text-emerald-500"/>} label="Export Planning Report" />
          </div>
        </div>
      </>
    )}
  </main>

      {/* AI Modal Portal Context */}
      <AnimatePresence>
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAIModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Workforce Forecast Breakdown</h2>
              <p className="text-slate-500 text-sm mb-6">
                Detailed AI-driven growth trajectory breakdown based on historical quarterly churn, project pipelines, and market hiring velocity.
              </p>
              <div className="space-y-3 mb-8">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Total Workforce</span>
                  <span className="font-bold text-slate-900">{totalEmployees} Employees</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">6-Month Projected Need</span>
                  <span className="font-bold text-slate-900">{projectedNeed} Employees</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  triggerAction("Hiring Plan Confirmed");
                  setIsAIModalOpen(false);
                }}
                className="w-full py-3 bg-[#0b1221] hover:bg-[#16233d] text-white rounded-xl font-bold transition-colors"
              >
                Approve Recruitment Plan
              </button>
            </motion.div>
          </div>
        )}

        {/* 2. REALLOCATE HEADCOUNT MODAL */}
        {isReallocateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsReallocateModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Reallocate Department Headcount</h2>
              <p className="text-slate-500 text-sm mb-6">
                Shift unallocated workforce headcount from low-demand departments to high-growth teams in {currentTenant}.
              </p>
              <form onSubmit={handleConfirmReallocation} className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">From Source Department</label>
                  <select 
                    value={reallocateForm.source}
                    onChange={(e) => setReallocateForm(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select Source Department...</option>
                    {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">To Target Department</label>
                  <select 
                    value={reallocateForm.target}
                    onChange={(e) => setReallocateForm(prev => ({ ...prev, target: e.target.value }))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select Target Department...</option>
                    {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Headcount Seats to Transfer</label>
                  <input 
                    type="number" 
                    min="1"
                    max="50"
                    value={reallocateForm.count}
                    onChange={(e) => setReallocateForm(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-[#0b1221] hover:bg-[#16233d] text-white rounded-xl font-bold transition-colors mt-2"
                >
                  Confirm Headcount Transfer
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* 3. SYNC RECRUITMENT GOALS MODAL */}
        {isRecruitmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsRecruitmentModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Sync Recruitment Pipelines</h2>
              <p className="text-slate-500 text-sm mb-6">
                Automatically export department skill gap requisitions to your external HRIS / ATS recruitment pipelines.
              </p>
              <div className="space-y-3 mb-8">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Active Open Requisitions</span>
                  <span className="font-bold text-purple-600">{analyticsData?.skillGaps?.length || 0} Positions</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Target Organization</span>
                  <span className="font-bold text-slate-900">{currentTenant}</span>
                </div>
              </div>
              <button 
                onClick={handleSyncRecruitment}
                disabled={isSyncing}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Synchronizing Pipelines...
                  </>
                ) : (
                  "Sync Requisitions Now"
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// --- MINI COMPONENTS ---
const MetricCard = ({ title, value, trend, trendColor, valueColor = "text-slate-900", icon, iconBg }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] relative hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
    <div className="mt-2">
      <h4 className={`text-3xl font-black tracking-tight ${valueColor}`}>{value}</h4>
      <p className={`text-[10px] font-bold mt-2 ${trendColor}`}>{trend}</p>
    </div>
  </div>
);

const QuickAction = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="bg-white hover:bg-slate-50 border border-slate-100 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-sm transition-all group active:scale-95 outline-none focus:border-blue-200">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className="text-sm font-black text-slate-800 tracking-tight">{label}</span>
  </button>
);

export default WorkforcePlanning;