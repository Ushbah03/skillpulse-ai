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
import SkillPulseLoader from './SkillPulseLoader'; 
import { motion, AnimatePresence } from 'framer-motion';
import { hrAPI } from '../services/api';

// ── Value-Based Interactive Workforce Line Chart ──────────────────────────────
const WorkforceLineChart = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || !Array.isArray(data) || data.length === 0) return null;
  const months = data.map(d => d.month || '');
  const current = data.map(d => Number(d.currentSupply ?? d.current ?? 0));
  const projected = data.map(d => Number(d.futureDemand ?? d.predicted ?? d.projected ?? 0));

  const allValues = [...current, ...projected].filter(v => typeof v === 'number' && !isNaN(v));
  if (allValues.length === 0) return null;

  // Clear Y-scale starting at 0
  const maxObserved = Math.max(...allValues, 10);
  const yMax = Math.ceil((maxObserved + 2) / 4) * 4;
  const yTicks = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax];

  const W = 960, H = 250, padL = 48, padR = 30, padT = 30, padB = 35;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const n = Math.max(1, months.length - 1);
  const xPos = (i) => padL + (i / n) * chartW;
  const yPos = (v) => {
    const val = Number(v);
    if (isNaN(val)) return padT + chartH;
    return padT + chartH - ((val / yMax) * chartH);
  };

  const toPath = (pts) =>
    pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yPos(v).toFixed(1)}`).join(' ');

  const toArea = (pts) => {
    const base = yPos(0);
    const endX = xPos(pts.length - 1).toFixed(1);
    const startX = xPos(0).toFixed(1);
    const baseY = base.toFixed(1);
    return `${toPath(pts)} L ${endX} ${baseY} L ${startX} ${baseY} Z`;
  };

  const currentMonthIdx = 5; // Month at index 5 is the current month
  const activeHover = hoveredIdx !== null ? hoveredIdx : currentMonthIdx;

  return (
    <div className="relative w-full select-none">
      {/* Dynamic Hover Tooltip / Live Milestone Indicator */}
      {activeHover !== null && (
        <div 
          className="absolute z-20 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -top-4 bg-slate-900/95 text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md"
          style={{ left: `${(xPos(activeHover) / W) * 100}%` }}
        >
          <div className="font-bold flex items-center justify-between gap-3 text-slate-200 border-b border-slate-800 pb-1 mb-1.5">
            <span>{months[activeHover]} {activeHover === currentMonthIdx ? '(Current)' : activeHover > currentMonthIdx ? '(Forecast)' : '(Actual)'}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{data[activeHover]?.isForecast ? 'AI Model' : 'Historical'}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <span className="text-slate-300">Supply:</span>
              <span className="font-black text-white">{current[activeHover]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              <span className="text-slate-300">Demand:</span>
              <span className="font-black text-white">{projected[activeHover]}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300 font-bold">
              <span>Gap:</span>
              <span>+{Math.max(0, projected[activeHover] - current[activeHover])}</span>
            </div>
          </div>
        </div>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 250 }} preserveAspectRatio="none">
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

        {/* Y-Axis Grid Lines & Numerical Labels */}
        {yTicks.map(tick => (
          <g key={tick}>
            <line 
              x1={padL} 
              x2={W - padR} 
              y1={yPos(tick)} 
              y2={yPos(tick)} 
              stroke="#f1f5f9" 
              strokeDasharray={tick === 0 ? "none" : "4 4"} 
              strokeWidth="1.2" 
            />
            <text 
              x={padL - 10} 
              y={yPos(tick) + 3} 
              textAnchor="end" 
              fontSize="10" 
              fill="#94a3b8" 
              fontWeight="700" 
              fontFamily="sans-serif"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* 'NOW' Current Month Vertical Marker */}
        <line 
          x1={xPos(currentMonthIdx)} 
          x2={xPos(currentMonthIdx)} 
          y1={padT} 
          y2={padT + chartH} 
          stroke="#64748b" 
          strokeDasharray="3 3" 
          strokeWidth="1.5" 
          strokeOpacity="0.4" 
        />
        <text 
          x={xPos(currentMonthIdx)} 
          y={padT - 10} 
          textAnchor="middle" 
          fontSize="9" 
          fill="#64748b" 
          fontWeight="800" 
          letterSpacing="0.05em"
        >
          TODAY
        </text>

        {/* Areas under curve */}
        <path d={toArea(current)} fill="url(#gradCurrent)" />
        <path d={toArea(projected)} fill="url(#gradProjected)" />

        {/* Historical + Forecast Lines */}
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

        {/* Interactive Point Markers (Circles) & Hover Triggers */}
        {months.map((m, i) => {
          const isHovered = hoveredIdx === i || (hoveredIdx === null && i === currentMonthIdx);
          const colW = chartW / n;
          return (
            <g key={m}>
              {/* Invisible wide hover bar for easy cursor interaction */}
              <rect
                x={xPos(i) - colW / 2}
                y={padT}
                width={colW}
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />

              {/* Current Supply Marker */}
              <circle 
                cx={xPos(i)} 
                cy={yPos(current[i])} 
                r={isHovered ? 6 : 4} 
                fill="#3b82f6" 
                stroke="#ffffff" 
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="transition-all duration-150"
              />

              {/* Projected Demand Marker */}
              <circle 
                cx={xPos(i)} 
                cy={yPos(projected[i])} 
                r={isHovered ? 6 : 4} 
                fill="#8b5cf6" 
                stroke="#ffffff" 
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="transition-all duration-150"
              />

              {/* Month X-Axis Label */}
              <text 
                x={xPos(i)} 
                y={H - 10} 
                textAnchor="middle" 
                fontSize="11" 
                fill={isHovered ? "#1e293b" : "#94a3b8"} 
                fontWeight={isHovered ? "800" : "600"} 
                fontFamily="sans-serif"
              >
                {m}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
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
  const [isApproving, setIsApproving] = useState(false);
  const [modalTab, setModalTab] = useState('internalTalent');
  const [mobilizingId, setMobilizingId] = useState(null);
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
    
    const resolveRoleName = (member) => {
      if (member.jobTitle && member.jobTitle.trim() && member.jobTitle.toUpperCase() !== 'EMPLOYEE') {
        return member.jobTitle;
      }
      const deptName = member.department?.name || 'General';
      if (member.role === 'COMPANY_ADMIN') return 'Executive Administrator';
      if (member.role === 'HR_MANAGER') return 'HR Specialist / Manager';
      if (member.role === 'TEAM_LEADER') return `${deptName} Team Lead`;
      
      // Standardize Employee title based on Department domain
      if (deptName === 'Engineering') return 'Software Engineer';
      if (deptName === 'Development') return 'Full Stack Developer';
      if (deptName === 'Product Design') return 'Product Designer';
      if (deptName === 'Marketing') return 'Marketing Specialist';
      if (deptName === 'Operations') return 'Operations Associate';
      if (deptName === 'Human Resources') return 'Talent Associate';
      return `${deptName} Specialist`;
    };

    const roleGroups = {};
    analyticsData.members.forEach(m => {
      const roleName = resolveRoleName(m);
      const deptName = m.department?.name || 'Unassigned';
      const key = `${roleName}::${deptName}`;
      
      if (!roleGroups[key]) {
        roleGroups[key] = {
          role: roleName,
          dept: deptName,
          current: 0,
          gap: 0,
          userIds: new Set()
        };
      }
      roleGroups[key].current += 1;
      roleGroups[key].userIds.add(m.id);
    });

    // Map skill gaps by user to the exact role and department
    analyticsData.skillGaps?.forEach(g => {
      const user = g.user;
      if (!user) return;
      const matchingGroup = Object.values(roleGroups).find(group => 
        group.userIds.has(g.userId) || group.dept === user.department?.name
      );
      if (matchingGroup) {
        matchingGroup.gap += 1;
      }
    });

    return Object.values(roleGroups).map((g, idx) => ({
      id: idx + 1,
      role: g.role,
      dept: g.dept,
      current: g.current,
      required: g.current + g.gap,
      gap: g.gap
    })).sort((a, b) => (b.gap - a.gap) || (b.current - a.current));
  }, [analyticsData]);

  const hiringDemand = React.useMemo(() => {
    if (!analyticsData?.departments) return [];
    const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#ec4899'];
    const totalGaps = analyticsData.skillGaps?.length || 1;
    return analyticsData.departments.map((d, idx) => {
      const deptGaps = analyticsData.skillGaps?.filter(g => g.user?.department?.name === d.name).length || 0;
      return {
        dept: d.name,
        roles: deptGaps,
        color: colors[idx % colors.length],
        pct: Math.min(100, Math.round((deptGaps / totalGaps) * 100))
      };
    }).sort((a, b) => b.roles - a.roles);
  }, [analyticsData]);

  const allocationLegend = React.useMemo(() => {
    if (!analyticsData?.departments) return [];
    const activeDepts = analyticsData.departments.filter(d => (d.memberCount || 0) > 0);
    const totalMembers = activeDepts.reduce((acc, d) => acc + d.memberCount, 0) || 1;
    const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#84cc16'];
    return activeDepts.map((d, idx) => {
      const pct = Math.round((d.memberCount / totalMembers) * 100);
      return {
        label: `${d.name} (${d.memberCount} emp - ${pct}%)`,
        color: colors[idx % colors.length],
        pct,
        count: d.memberCount
      };
    }).sort((a, b) => b.count - a.count);
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

  const handleConfirmReallocation = async (e) => {
    e.preventDefault();
    if (!reallocateForm.source || !reallocateForm.target) {
      setToastMessage("Please select both source and target departments.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (reallocateForm.source === reallocateForm.target) {
      setToastMessage("Source and target departments cannot be the same.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    try {
      const res = await hrAPI.reallocateHeadcount({
        sourceDepartment: reallocateForm.source,
        targetDepartment: reallocateForm.target,
        count: parseInt(reallocateForm.count, 10) || 1,
        note: reallocateForm.note
      });
      if (res?.data?.success) {
        setToastMessage(res.data.message || `Successfully reallocated headcount from ${reallocateForm.source} to ${reallocateForm.target}.`);
        setIsReallocateModalOpen(false);
        loadAllData();
      } else {
        setToastMessage(res?.data?.error || "Reallocation failed.");
      }
    } catch (err) {
      setToastMessage(err?.response?.data?.error || err.message || "Failed to reallocate headcount.");
    } finally {
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleSyncRecruitment = async () => {
    setIsSyncing(true);
    try {
      const res = await hrAPI.syncRecruitment();
      if (res?.data?.success) {
        setToastMessage(res.data.message || `Recruitment pipeline successfully synchronized with HRIS.`);
        setIsRecruitmentModalOpen(false);
      } else {
        setToastMessage(res?.data?.error || "Sync failed.");
      }
    } catch (err) {
      setToastMessage(err?.response?.data?.error || err.message || "Failed to sync recruitment.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleApproveHiringPlan = async () => {
    setIsApproving(true);
    try {
      const res = await hrAPI.approveHiringPlan({
        projectedNeed,
        targetFiscalYear: "2026-2027",
        approvedByTenant: currentTenant
      });

      const isSuccess = res?.success === true || res?.data?.success === true || (res && !res.error && !res.message?.includes('failed'));
      if (isSuccess) {
        const approvedPlanData = res?.plan || res?.data?.plan || {
          status: "APPROVED",
          targetHeadcount: projectedNeed,
          fiscalYear: "2026-2027",
          approvedAt: new Date().toISOString()
        };

        setToastMessage(res?.message || res?.data?.message || "Strategic workforce recruitment plan approved and locked.");
        
        // Update local state immediately so modal & banner transform live
        setForecastData(prev => ({
          ...prev,
          isPlanApproved: true,
          approvedPlan: approvedPlanData
        }));

        // Background refetch for full DB synchronization
        try {
          const forecastRes = await hrAPI.getForecast();
          if (forecastRes?.success && forecastRes?.data) {
            setForecastData(forecastRes.data);
          } else if (forecastRes?.data) {
            setForecastData(forecastRes.data);
          }
        } catch (e) {
          console.warn("Forecast refetch background sync:", e);
        }
      } else {
        setToastMessage(res?.message || res?.error || res?.data?.error || "Approval failed.");
      }
    } catch (err) {
      setToastMessage(err?.message || "Failed to approve hiring plan.");
    } finally {
      setIsApproving(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleMobilizeInternalCandidate = async (rec) => {
    setMobilizingId(rec.id);
    try {
      const res = await hrAPI.assignTraining({
        userId: rec.recommendedCandidate.id,
        courseId: rec.courseId,
        skillId: rec.skillId
      });
      const isSuccess = res?.success === true || res?.data?.success === true || (res && !res.error);
      if (isSuccess) {
        setToastMessage(`Internal upskilling track dispatched to ${rec.recommendedCandidate.name}.`);
        setForecastData(prev => ({
          ...prev,
          internalTalentRecommendations: (prev.internalTalentRecommendations || []).map(r => 
            r.id === rec.id ? { ...r, isAlreadyEnrolled: true } : r
          )
        }));
        // Reload analytics in background to reflect updated enrollments
        hrAPI.getAnalytics().then(aRes => {
          if (aRes?.data) setAnalyticsData(aRes.data);
        }).catch(() => {});
      } else {
        setToastMessage(res?.message || "Failed to assign upskilling track.");
      }
    } catch (err) {
      setToastMessage(err?.message || "Failed to dispatch upskilling.");
    } finally {
      setMobilizingId(null);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Metric derivations
  const totalEmployees = analyticsData?.totalEmployees || 0;
  const criticalGapsCount = analyticsData?.criticalGapsCount || 0;
  const workforceRiskLevel = criticalGapsCount > 3 ? "High" : criticalGapsCount > 0 ? "Medium" : "Low";
  const projectedNeed = forecastData?.projectedNeed ?? (totalEmployees + (analyticsData?.skillGaps?.length || 0));

  return (
    <div className="flex min-h-screen bg-[#E9EAF7] font-sans text-[#17233E] relative overflow-x-hidden selection:bg-[#1988A3] selection:text-white">
      {/* Ambient Gradient Depth - Glowing mesh orbs behind frosted glass panels */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-[#1988A3]/20 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#11C6DE]/16 blur-[140px] rounded-full" />
        <div className="absolute top-2/3 left-10 w-[600px] h-[600px] bg-[#1B3154]/16 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-[#8A9CB7]/28 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.10)_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
      </div>
      {/* 1. Sidebar with Tenant context */}
      <HRSidebar currentTenant={currentTenant} currentScreen="Workforce Planning" />

      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full relative z-10 space-y-8">
        
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
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-wrap justify-between items-center gap-4 mb-4">
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
          <div className="my-8">
            <SkillPulseLoader message="Analyzing Organization Skill Matrices..." fullScreen={false} />
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
        <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Workforce Forecast Trend (12 Months)</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Holt's linear trend trajectory derived from live DB headcount & active skill deficit backlog</p>
            </div>
            <div className="flex items-center gap-5 text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"/> Current Workforce ({totalEmployees})
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"/> Projected Need ({projectedNeed})
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                Live Data Connected
              </span>
            </div>
          </div>
          <WorkforceLineChart data={forecastData?.growthTrends} />
        </div>

        {/* --- SECTION 4: HIRING DEMAND & DONUT DISTRIBUTION --- */}
        <div className="grid grid-cols-2 gap-8">
          {/* Hiring Demand */}
          <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-8 space-y-6">
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
          <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-8 space-y-6">
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
        <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 overflow-hidden">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/85 p-2 z-30">
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
                  <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/85 p-2 z-30">
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
                className="px-3 py-2 bg-white/70 border border-white/80 rounded-xl hover:bg-[#E4EEF8] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xs text-[#17233E]"
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
                className="px-3 py-2 bg-white/70 border border-white/80 rounded-xl hover:bg-[#E4EEF8] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xs text-[#17233E]"
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
                {forecastData?.isPlanApproved ? (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={12} /> Plan Approved (FY 2026-27)
                  </span>
                ) : (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest">
                    High Confidence
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                {forecastData?.aiInsight || (forecastData?.emergingSkillDemands && forecastData.emergingSkillDemands.length > 0 
                  ? `AI predicts hiring demand for ${forecastData.emergingSkillDemands[0].skill} will grow across ${currentTenant}. Early recruitment is recommended.`
                  : `Workforce trajectory forecast for ${currentTenant} is active with real competency deficit modeling.`)}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white shadow-lg shadow-[#1988A3]/25 font-black text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 relative z-10 flex-shrink-0"
          >
            {forecastData?.isPlanApproved ? "View Approved Plan" : "View Forecast Details"}
          </button>
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
              className="bg-gradient-to-br from-[#D8EBF9] to-[#BEDDF5] backdrop-blur-2xl rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-white/90"
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
              <h2 className="text-2xl font-black text-slate-900 mb-1">Workforce Talent & Forecast Intelligence</h2>
              <p className="text-slate-500 text-xs mb-5">
                AI-driven workforce capacity, internal talent mobility recommendations, and headcount targets.
              </p>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 mb-6 gap-3">
                <button
                  onClick={() => setModalTab('internalTalent')}
                  className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${modalTab === 'internalTalent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <Users size={15} />
                  Internal Talent Sourcing
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    {forecastData?.internalTalentRecommendations?.length || 0} Matches
                  </span>
                </button>
                <button
                  onClick={() => setModalTab('plan')}
                  className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${modalTab === 'plan' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <Target size={15} />
                  Headcount Targets & Approval
                  {forecastData?.isPlanApproved && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Approved
                    </span>
                  )}
                </button>
              </div>

              {modalTab === 'internalTalent' ? (
                <div>
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed mb-4">
                    <strong>AI Talent Mobility:</strong> Matched existing employees with high adjacent skill readiness for the open requisitions. Upskilling existing staff fulfills demand faster without external recruiting overhead.
                  </div>

                  <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1 mb-6">
                    {(forecastData?.internalTalentRecommendations || []).length > 0 ? (
                      forecastData.internalTalentRecommendations.map(rec => (
                        <div key={rec.id} className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-2xl flex justify-between items-center gap-3 hover:bg-white hover:border-blue-200 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
                              {rec.recommendedCandidate.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-black text-slate-900">{rec.recommendedCandidate.name}</h4>
                                <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                                  {rec.matchScore} Match
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {rec.department} &bull; {rec.targetRole}
                              </p>
                              <p className="text-[11px] font-bold text-blue-600 mt-0.5">
                                <span className="text-slate-400 font-normal">Fulfills Gap:</span> {rec.skillName}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {rec.isAlreadyEnrolled ? (
                              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs border border-emerald-200 flex items-center gap-1.5">
                                <CheckCircle2 size={13} className="text-emerald-600" />
                                Track Assigned
                              </span>
                            ) : (
                              <button
                                onClick={() => handleMobilizeInternalCandidate(rec)}
                                disabled={mobilizingId === rec.id}
                                className="px-3.5 py-1.5 bg-[#0b1221] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                              >
                                {mobilizingId === rec.id ? (
                                  <>
                                    <Loader2 size={12} className="animate-spin" />
                                    Assigning...
                                  </>
                                ) : (
                                  "Mobilize & Upskill"
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">All competency deficits are currently supported by active training tracks.</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-medium">Want to formalize fiscal hiring numbers?</span>
                    <button
                      onClick={() => setModalTab('plan')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      View Headcount Plan &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {forecastData?.isPlanApproved && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-6 flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-black text-emerald-900 uppercase tracking-wider">Recruitment Plan Formally Approved</h5>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          Target headcount of {forecastData.approvedPlan?.targetHeadcount || projectedNeed} personnel locked for Fiscal Year {forecastData.approvedPlan?.fiscalYear || "2026-2027"}.
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1.5">
                          Logged in Audit Trail &bull; Status: Active & Locked
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-8">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                      <span className="font-semibold text-slate-600">Current Workforce</span>
                      <span className="font-bold text-slate-900">{totalEmployees} Employees</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                      <span className="font-semibold text-slate-600">Active Skill Deficits</span>
                      <span className="font-bold text-purple-600">{analyticsData?.skillGaps?.length || 0} Open Roles</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                      <span className="font-semibold text-slate-600">6-Month Projected Need</span>
                      <span className="font-bold text-slate-900">{projectedNeed} Personnel</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                      <span className="font-semibold text-slate-600">Approval & Audit Status</span>
                      <span className={`font-bold ${forecastData?.isPlanApproved ? "text-emerald-600 flex items-center gap-1" : "text-amber-600"}`}>
                        {forecastData?.isPlanApproved ? <><CheckCircle2 size={14} className="text-emerald-600"/> Approved & Locked</> : "Pending Formal Approval"}
                      </span>
                    </div>
                  </div>

                  {forecastData?.isPlanApproved ? (
                    <button 
                      onClick={() => setIsAIModalOpen(false)}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      Recruitment Plan Approved (Close)
                    </button>
                  ) : (
                    <button 
                      onClick={handleApproveHiringPlan}
                      disabled={isApproving}
                      className="w-full py-3.5 bg-[#0b1221] hover:bg-[#16233d] disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Approving & Locking Target...
                        </>
                      ) : (
                        "Approve Recruitment Plan"
                      )}
                    </button>
                  )}
                </div>
              )}
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
              className="bg-gradient-to-br from-[#D8EBF9] to-[#BEDDF5] backdrop-blur-2xl rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-white/90"
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
              className="bg-gradient-to-br from-[#D8EBF9] to-[#BEDDF5] backdrop-blur-2xl rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-white/90"
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
  <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-6 flex flex-col justify-between min-h-[140px] relative hover:border-[#1988A3]/40 transition-all duration-300">
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
  <button onClick={onClick} className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl hover:bg-[#E4EEF8]/80 border border-white/85 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-xl shadow-[#1B3154]/6 transition-all group active:scale-95 outline-none hover:border-[#1988A3]/50 cursor-pointer">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className="text-sm font-black text-slate-800 tracking-tight">{label}</span>
  </button>
);

export default WorkforcePlanning;