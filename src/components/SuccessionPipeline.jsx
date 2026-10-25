import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Bell, HelpCircle, Filter, Download,
  TrendingUp, AlertTriangle, Users, Timer, MoreHorizontal,
  ChevronRight, Award, ShieldCheck, RefreshCw, UserCheck, Loader2
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { hrAPI } from '../services/api';



// ── Competency Radar Chart (SVG) ──────────────────────────────────────────────
const RadarChart = ({
  candidateScores = [0.85, 0.80, 0.85, 0.85, 0.80, 0.85],
  benchmarkScores = [0.85, 0.80, 0.85, 0.85, 0.80, 0.85],
  labels = ['Technical', 'Domain', 'Soft Skills', 'Leadership', 'Execution', 'Readiness']
}) => {
  const cx = 120, cy = 120, r = 85;
  const n = labels.length;

  const cScores = candidateScores;
  const bScores = benchmarkScores;

  const angleOf = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const pointAt = (score, i) => {
    const angle = angleOf(i);
    return {
      x: cx + score * r * Math.cos(angle),
      y: cy + score * r * Math.sin(angle),
    };
  };

  const labelAt = (i) => {
    const angle = angleOf(i);
    const offset = 1.25;
    return {
      x: cx + offset * r * Math.cos(angle),
      y: cy + offset * r * Math.sin(angle),
    };
  };

  const toPolygon = (scores) =>
    scores.map((s, i) => {
      const p = pointAt(s, i);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');

  const rings = [0.25, 0.5, 0.75, 1.0];
  const gridLines = Array.from({ length: n }, (_, i) => {
    const p = pointAt(1.0, i);
    return `M ${cx} ${cy} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  });

  return (
    <svg viewBox="0 0 240 250" className="w-full" style={{ height: 240 }}>
      {/* Grid rings */}
      {rings.map((ring, ri) => (
        <polygon
          key={ri}
          points={Array.from({ length: n }, (_, i) => {
            const p = pointAt(ring, i);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          }).join(' ')}
          fill={ri === rings.length - 1 ? 'none' : '#f8fafc'}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}
      {/* Grid lines */}
      {gridLines.map((d, i) => (
        <path key={i} d={d} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {/* Benchmark polygon */}
      <polygon
        points={toPolygon(bScores)}
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      {/* Candidate polygon */}
      <polygon
        points={toPolygon(cScores)}
        fill="rgba(79, 70, 229, 0.15)"
        stroke="#4f46e5"
        strokeWidth="2"
      />
      {/* Labels */}
      {labels.map((label, i) => {
        const pos = labelAt(i);
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8.5"
            fill="#475569"
            fontFamily="sans-serif"
            fontWeight="700"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// ── Reusable Progress Bar ─────────────────────────────────────────────────────
const ProgressBar = ({ pct, color }) => (
  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-20">
    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
  </div>
);

// ── Main Component: SuccessionPipeline ───────────────────────────────────────
const SuccessionPipeline = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayTenantName = user?.tenantName || user?.workspace || "Enterprise Domain";

  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [successionPoolData, setSuccessionPoolData] = useState([]);
  const [apiSkillGaps, setApiSkillGaps] = useState([]);
  const [incumbentData, setIncumbentData] = useState(null);
  const [apiAnalytics, setApiAnalytics] = useState(null);
  const [readinessFilter, setReadinessFilter] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchSuccession = async () => {
      setLoading(true);
      try {
        const res = await hrAPI.getSuccession();
        if (isMounted && res?.success) {
          setSuccessionPoolData(res.data || []);
          if (res.skillGaps) setApiSkillGaps(res.skillGaps);
          if (res.incumbent) setIncumbentData(res.incumbent);
          if (res.analytics) setApiAnalytics(res.analytics);
        }
      } catch (err) {
        console.warn('Failed to load succession pools:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSuccession();
    return () => { isMounted = false; };
  }, []);

  const READINESS_LABELS = {
    'READY_NOW':      { label: 'Ready Now',        color: '#10b981' },
    'WITHIN_1_YEAR':  { label: 'Ready in 1 Yr',    color: '#f59e0b' },
    'WITHIN_2_YEARS': { label: 'Ready in 2 Yrs',   color: '#3b82f6' },
    'LONG_TERM':      { label: 'Developing',       color: '#64748b' },
    'READY_1_2_YR':   { label: 'Ready in 1-2 yrs', color: '#f59e0b' },
    'READY_2_5_YR':   { label: 'Ready in 2-5 yrs', color: '#3b82f6' },
    'NOT_READY':      { label: 'Not Ready',        color: '#ef4444' },
  };

  const allCandidates = useMemo(() => {
    if (!successionPoolData || successionPoolData.length === 0) return [];
    return successionPoolData.map((pool, idx) => {
      const c = pool.candidate || pool;
      const name = c.firstName ? `${c.firstName} ${c.lastName}` : (c.name || `Candidate ${idx + 1}`);
      const readinessKey = pool.readiness || c.readiness || 'WITHIN_1_YEAR';
      const readinessObj = READINESS_LABELS[readinessKey] || { label: 'Evaluating', color: '#94a3b8' };
      const rawScore = pool.leadershipScore ?? pool.readinessScore ?? c.readinessPct ?? (readinessKey === 'READY_NOW' ? 90 : 75);
      const pct = Math.round(rawScore);

      const initials = (c.firstName ? `${c.firstName[0]}${c.lastName ? c.lastName[0] : ''}` : name.substring(0, 2)).toUpperCase();

      return {
        id:           pool.id || c.id || `${idx}`,
        candidateId:  c.id,
        name:         name,
        readinessKey: readinessKey,
        status:       readinessObj.label,
        statusColor:  readinessObj.color,
        pct:          pct,
        barColor:     readinessObj.color,
        avatar:       c.avatarUrl || null,
        initials:     initials,
        targetRole:   pool.targetRole || pool.positionTitle || 'Executive Leadership',
        department:   pool.department || c.department?.name || 'Operations',
        jobTitle:     c.jobTitle || 'Team Member',
        skills:       c.skills || [],
        skillGaps:    c.skillGaps || [],
        flightRisk:   pool.flightRisk || 'LOW',
        notes:        pool.notes || ''
      };
    });
  }, [successionPoolData]);

  useEffect(() => {
    if (allCandidates.length > 0 && (!selectedCandidate || !allCandidates.some(c => c.name === selectedCandidate))) {
      setSelectedCandidate(allCandidates[0].name);
    }
  }, [allCandidates, selectedCandidate]);

  const activeCandidateObj = useMemo(() => {
    return allCandidates.find(c => c.name === selectedCandidate) || allCandidates[0] || null;
  }, [allCandidates, selectedCandidate]);

  const activeProfile = useMemo(() => {
    if (!activeCandidateObj) {
      return {
        candidateScores: [0.80, 0.75, 0.80, 0.80, 0.75, 0.80],
        benchmarkScores: [0.85, 0.80, 0.85, 0.85, 0.80, 0.85],
        overallScore: 80,
        targetScore: 85,
        trajectory: []
      };
    }

    const candSkills = activeCandidateObj.skills || [];
    const candGaps = activeCandidateObj.skillGaps || [];

    // Technical skills calculation from real DB
    const techSkills = candSkills.filter(s => /tech|softw|code|prog|dev|eng|front|back|sql|api|react/i.test(s.skill?.category?.name || s.skill?.name || ''));
    const techScore = techSkills.length > 0
      ? (techSkills.reduce((acc, s) => acc + (s.proficiencyLevel || 0), 0) / (techSkills.length * 5.0))
      : (activeCandidateObj.pct / 100);

    // Domain knowledge calculation from real DB
    const domainSkills = candSkills.filter(s => /domain|busin|indus|comm|market|prod|oper/i.test(s.skill?.category?.name || s.skill?.name || ''));
    const domainScore = domainSkills.length > 0
      ? (domainSkills.reduce((acc, s) => acc + (s.proficiencyLevel || 0), 0) / (domainSkills.length * 5.0))
      : (activeCandidateObj.pct / 100);

    // Soft Skills calculation from real DB
    const softSkills = candSkills.filter(s => /soft|comm|crit|prob|solv|lead|adap/i.test(s.skill?.category?.name || s.skill?.name || ''));
    const softScore = softSkills.length > 0
      ? (softSkills.reduce((acc, s) => acc + (s.proficiencyLevel || 0), 0) / (softSkills.length * 5.0))
      : (activeCandidateObj.pct / 100);

    // Leadership score from real DB leadershipScore
    const leadershipScore = (activeCandidateObj.pct || 80) / 100;

    // Execution score penalized by verified critical gaps
    const criticalGapCount = candGaps.filter(g => g.severity === 'CRITICAL').length;
    const executionScore = Math.max(0.4, 1.0 - (criticalGapCount * 0.1) - (candGaps.length * 0.05));

    // Overall readiness score from real DB
    const readinessScore = (activeCandidateObj.pct || 80) / 100;

    const candidateScores = [
      parseFloat(Math.min(0.98, Math.max(0.4, techScore)).toFixed(2)),
      parseFloat(Math.min(0.98, Math.max(0.4, domainScore)).toFixed(2)),
      parseFloat(Math.min(0.98, Math.max(0.4, softScore)).toFixed(2)),
      parseFloat(Math.min(0.98, Math.max(0.4, leadershipScore)).toFixed(2)),
      parseFloat(Math.min(0.98, Math.max(0.4, executionScore)).toFixed(2)),
      parseFloat(Math.min(0.98, Math.max(0.4, readinessScore)).toFixed(2)),
    ];
    const benchmarkScores = [0.85, 0.80, 0.85, 0.85, 0.80, 0.85];

    const isReadyNow = activeCandidateObj.readinessKey === 'READY_NOW';

    const trajectory = [
      {
        num: null,
        label: `${activeCandidateObj.name} — Current Role`,
        sub: `${activeCandidateObj.jobTitle || 'Team Member'} (${activeCandidateObj.department})`,
        done: true,
        current: false
      },
      {
        num: 2,
        label: 'Verified Competency Profiling',
        sub: `${candSkills.length} Skills Profiled • ${activeCandidateObj.pct}% Score`,
        done: candSkills.length > 0 || isReadyNow,
        current: !isReadyNow && candSkills.length === 0
      },
      {
        num: 3,
        label: 'Executive Pipeline Track',
        sub: candGaps.length > 0 ? `${candGaps.length} Open Capability Gap(s)` : 'Benchmark Competencies Verified',
        done: isReadyNow,
        current: !isReadyNow
      },
      {
        num: null,
        label: activeCandidateObj.targetRole || 'Executive Leadership Goal',
        sub: activeCandidateObj.status || 'Ready for Assessment',
        done: false,
        current: isReadyNow
      }
    ];

    return {
      candidateScores,
      benchmarkScores,
      overallScore: activeCandidateObj.pct,
      targetScore: 85,
      trajectory
    };
  }, [activeCandidateObj]);

  // Dynamic bench tracks from database roles
  const techPool = useMemo(() => {
    return allCandidates.filter(c =>
      /tech|cto|eng|develop|softw|architect/i.test(c.targetRole) ||
      /develop|eng/i.test(c.department)
    );
  }, [allCandidates]);

  const opsPool = useMemo(() => {
    return allCandidates.filter(c =>
      !/tech|cto|eng|develop|softw|architect/i.test(c.targetRole) &&
      !/develop|eng/i.test(c.department)
    );
  }, [allCandidates]);

  // Skill gaps from real database records
  const skillGaps = useMemo(() => {
    if (!apiSkillGaps || apiSkillGaps.length === 0) return [];
    return apiSkillGaps.map(g => {
      const cur = g.currentLevel || 1.0;
      const req = g.requiredLevel || 5.0;
      const pct = Math.min(100, Math.round((cur / req) * 100));
      const isCritical = g.severity === 'CRITICAL';
      const isHigh = g.severity === 'HIGH';

      return {
        id: g.id,
        name: g.skill?.name || 'Skill Deficit',
        category: g.skill?.category?.name || 'Technical',
        candidateName: g.user ? `${g.user.firstName} ${g.user.lastName}` : 'Candidate',
        department: g.user?.department?.name || 'Department',
        level: isCritical ? 'Critical Deficit' : isHigh ? 'Moderate Deficit' : 'Developing',
        levelColor: isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#6366f1',
        barColor: isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#6366f1',
        barPct: pct,
        sub: `Level ${cur} → ${req} • ${g.user ? `${g.user.firstName} ${g.user.lastName}` : 'Candidate'}`
      };
    });
  }, [apiSkillGaps]);

  const matchesReadinessFilter = (c, filter) => {
    if (!filter || filter === 'ALL') return true;
    const rKey = c.readinessKey || '';
    if (rKey === filter) return true;
    if (filter === 'READY_NOW') return rKey === 'READY_NOW' || c.status === 'Ready Now';
    if (filter === 'WITHIN_1_YEAR') return rKey === 'WITHIN_1_YEAR' || rKey === 'READY_1_2_YR' || c.status.includes('1 Yr') || c.status.includes('1-2');
    if (filter === 'WITHIN_2_YEARS') return rKey === 'WITHIN_2_YEARS' || rKey === 'READY_2_5_YR' || c.status.includes('2 Yr') || c.status.includes('2-5');
    return true;
  };

  const filteredTechPool = useMemo(() =>
    techPool.filter(c =>
      (c.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) &&
      matchesReadinessFilter(c, readinessFilter)
    ), [searchQuery, readinessFilter, techPool]
  );

  const filteredOpsPool = useMemo(() =>
    opsPool.filter(c =>
      (c.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) &&
      matchesReadinessFilter(c, readinessFilter)
    ), [searchQuery, readinessFilter, opsPool]
  );

  // Exact database-backed metrics
  const avgReadinessPct = useMemo(() => {
    if (apiAnalytics?.avgReadinessPct != null) return apiAnalytics.avgReadinessPct;
    if (!allCandidates || allCandidates.length === 0) return 0;
    return Math.round(allCandidates.reduce((acc, c) => acc + (c.pct || 0), 0) / allCandidates.length);
  }, [apiAnalytics, allCandidates]);

  const criticalGapsCount = useMemo(() => {
    if (apiAnalytics?.criticalGapsCount != null) return apiAnalytics.criticalGapsCount;
    if (!skillGaps || skillGaps.length === 0) return 0;
    return skillGaps.filter(g => g.level === 'Critical Deficit').length;
  }, [apiAnalytics, skillGaps]);

  const readyNowCount = useMemo(() => {
    if (apiAnalytics?.readyNowCount != null) return apiAnalytics.readyNowCount;
    if (!allCandidates || allCandidates.length === 0) return 0;
    return allCandidates.filter(c => c.readinessKey === 'READY_NOW').length;
  }, [apiAnalytics, allCandidates]);

  const hipoCount = allCandidates.length;

  const avgTimeToReady = useMemo(() => {
    if (apiAnalytics?.avgTimeToReadyMonths != null) return apiAnalytics.avgTimeToReadyMonths;
    if (!allCandidates || allCandidates.length === 0) return 0;
    const monthsMap = { READY_NOW: 0, WITHIN_1_YEAR: 9, WITHIN_2_YEARS: 18, LONG_TERM: 36 };
    return Math.round(allCandidates.reduce((acc, c) => acc + (monthsMap[c.readinessKey] ?? 12), 0) / allCandidates.length);
  }, [apiAnalytics, allCandidates]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const headers = ["Candidate Name", "Target Role", "Readiness Status", "Readiness Score (%)"];
      const rows = allCandidates.map(c => [
        `"${c.name}"`,
        `"${c.targetRole}"`,
        `"${c.status}"`,
        `"${c.pct}%"`
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${displayTenantName.replace(/\s+/g, '_')}_Succession_Pipeline_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
  };

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
      {/* ── LEFT NAVIGATION SIDEBAR ── */}
      <HRSidebar />

      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 px-3.5 sm:px-6 md:px-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8">
        {/* ── HEADER / TOP NAV ── */}
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-400">
            <span>HR Manager</span>
            <span className="text-slate-300">›</span>
            <span>Talent Planning</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-900 font-bold">Succession & HiPo Pipeline</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial w-full sm:w-auto">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search talent pool..."
                className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white/85 text-xs text-[#17233E] outline-none border border-transparent focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors shrink-0">
              <HelpCircle size={18} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* ── MAIN CONTENT WORKSPACE ── */}
        {loading ? (
          <div className="my-8">
            <SkillPulseLoader message="Synchronizing Enterprise Workforce Telemetry..." fullScreen={false} />
          </div>
        ) : (
        <div className="px-0 sm:px-4 py-2 sm:py-6 space-y-6">

          {/* ── HEADER TITLE BLOCK ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Executive Leadership & Succession Pipeline</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                AI-assisted readiness tracking, critical role succession, and high-potential development.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                Tenant: <strong>{displayTenantName}</strong>
              </span>
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/85 rounded-xl text-xs font-bold text-[#17233E] bg-white/70 backdrop-blur-md hover:bg-[#E4EEF8] transition-all shadow-sm"
                >
                  <Filter size={14} /> Filter: {readinessFilter}
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white/90 backdrop-blur-xl border border-white/85 shadow-xl rounded-xl p-1 z-30">
                    {['ALL', 'READY_NOW', 'WITHIN_1_YEAR', 'WITHIN_2_YEARS'].map(rf => (
                      <button
                        key={rf}
                        onClick={() => { setReadinessFilter(rf); setIsFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${readinessFilter === rf ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {rf.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white shadow-lg shadow-[#1988A3]/25 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                Export Audit Report
              </button>
            </div>
          </div>

          {toastMessage && (
            <div className="bg-indigo-600 text-white px-4 py-3 rounded-xl text-xs font-bold flex justify-between items-center shadow-md">
              <span>{toastMessage}</span>
              <button onClick={() => setToastMessage('')} className="text-white hover:text-slate-200">✕</button>
            </div>
          )}

          {/* ── METRIC CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl p-3.5 sm:p-5 hover:border-[#1988A3]/40 transition-all duration-300">
              <div className="flex justify-between items-start">
                <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">Overall Readiness</p>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp size={16} className="text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">{avgReadinessPct}%</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{readyNowCount} of {hipoCount} Ready Now</span>
                <span className="text-xs text-slate-400 font-medium">pipeline benchmark</span>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${avgReadinessPct}%` }} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl p-3.5 sm:p-5 hover:border-[#1988A3]/40 transition-all duration-300">
              <div className="flex justify-between items-start">
                <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">Critical Skill Gaps</p>
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-rose-500" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">{criticalGapsCount}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">{criticalGapsCount} Critical Deficits</span>
                <span className="text-xs text-slate-400 font-medium">in active candidates</span>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, criticalGapsCount * 25)}%` }} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl p-3.5 sm:p-5 hover:border-[#1988A3]/40 transition-all duration-300">
              <div className="flex justify-between items-start">
                <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">HiPo Talent Pool</p>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Users size={16} className="text-indigo-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">{hipoCount}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">{allCandidates.filter(c => c.readinessKey === 'WITHIN_1_YEAR').length} Within 1 Yr</span>
                <span className="text-xs text-slate-400 font-medium">high-potential bench</span>
              </div>
              <div className="mt-3 flex -space-x-2">
                {allCandidates.slice(0, 4).map((cand, i) => (
                  cand.avatar ? (
                    <img key={i} src={cand.avatar} className="w-6 h-6 rounded-full border-2 border-white object-cover" alt={cand.name} />
                  ) : (
                    <div key={i} className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[9px] border-2 border-white">{cand.initials}</div>
                  )
                ))}
                {hipoCount > 4 && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-600">+{hipoCount - 4}</div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl p-3.5 sm:p-5 hover:border-[#1988A3]/40 transition-all duration-300">
              <div className="flex justify-between items-start">
                <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">Avg. Time to Ready</p>
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Timer size={16} className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">{avgTimeToReady} mo</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">Weighted average</span>
                <span className="text-xs text-slate-400 font-medium">readiness horizon</span>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.max(10, 100 - avgTimeToReady * 2)}%` }} />
              </div>
            </div>
          </div>

          {/* ── MIDDLE GRID: SUCCESSION POOLS + RADAR & SKILL GAPS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

            {/* LEFT 2 COLUMNS: DEPTH CHART */}
            <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-black text-slate-900">Succession Depth Chart</h3>
                  <p className="text-xs text-slate-400 font-medium">Mapped key leadership seats & readiness pools</p>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  {isExpanded ? 'Collapse View' : 'Expand All'}
                </button>
              </div>

              {/* CEO Incumbent Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-5 bg-slate-50/50">
                <div className="flex items-start p-5 border-l-4 border-[#1988A3] bg-white/70 backdrop-blur-md rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                        Key Executive Seat
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ACTIVE BENCHMARK
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">{incumbentData?.title || 'Chief Executive Officer (CEO)'}</h4>
                    <div className="flex items-center gap-3">
                      {incumbentData?.avatar ? (
                        <img src={incumbentData.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-slate-200" alt={incumbentData.name} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-sm border-2 border-slate-200">
                          {(incumbentData?.name || 'Apex Admin').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-extrabold text-slate-800">{incumbentData?.name || 'Apex Admin'}</p>
                        <p className="text-xs text-slate-400 font-medium">{incumbentData?.tenure || '1 Year in Position'} • Active Incumbent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Successor Pools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Tech & Engineering Bench Pool */}
                <div className="border border-white/80 rounded-2xl p-4 bg-white/60 hover:bg-[#E4EEF8]/80 backdrop-blur-md shadow-sm transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Technology & Engineering Bench</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      HEALTHY BENCH
                    </span>
                  </div>
                  <div className="space-y-3">
                    {filteredTechPool.length === 0 ? (
                      <p className="text-xs text-slate-400 py-2">No matching candidates in filter</p>
                    ) : filteredTechPool.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedCandidate(p.name)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${selectedCandidate === p.name ? 'bg-indigo-50/70 border border-indigo-200 shadow-sm' : 'hover:bg-slate-50'}`}
                      >
                        <div className="relative flex-shrink-0">
                          {p.avatar ? (
                            <img src={p.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt={p.name} />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs border border-slate-200 shadow-sm">
                              {p.initials}
                            </div>
                          )}
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: p.statusColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] font-semibold text-slate-500 truncate">{p.targetRole}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold px-1 rounded" style={{ color: p.statusColor, background: `${p.statusColor}15` }}>{p.status}</span>
                            {p.skills?.length > 0 && (
                              <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1 rounded">{p.skills.length} Skills</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <ProgressBar pct={p.pct} color={p.barColor} />
                          <span className="text-xs font-black text-slate-700 w-8 text-right">{p.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product, Commercial & Operations Bench */}
                <div className="border border-white/80 rounded-2xl p-4 bg-white/60 hover:bg-[#E4EEF8]/80 backdrop-blur-md shadow-sm transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Product & Operations Bench</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      ACTIVE PIPELINE
                    </span>
                  </div>
                  <div className="space-y-3">
                    {filteredOpsPool.length === 0 ? (
                      <p className="text-xs text-slate-400 py-2">No matching candidates in filter</p>
                    ) : filteredOpsPool.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedCandidate(p.name)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${selectedCandidate === p.name ? 'bg-indigo-50/70 border border-indigo-200 shadow-sm' : 'hover:bg-slate-50'}`}
                      >
                        <div className="relative flex-shrink-0">
                          {p.avatar ? (
                            <img src={p.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt={p.name} />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs border border-slate-200 shadow-sm">
                              {p.initials}
                            </div>
                          )}
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: p.statusColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] font-semibold text-slate-500 truncate">{p.targetRole}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold px-1 rounded" style={{ color: p.statusColor, background: `${p.statusColor}15` }}>{p.status}</span>
                            {p.skills?.length > 0 && (
                              <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1 rounded">{p.skills.length} Skills</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <ProgressBar pct={p.pct} color={p.barColor} />
                          <span className="text-xs font-black text-slate-700 w-8 text-right">{p.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: RADAR + TOP SKILL GAPS */}
            <div className="space-y-5">
              {/* Radar Chart Block */}
              <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-5">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-black text-slate-900">AI Competency Radar</h3>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Active: {selectedCandidate}
                  </span>
                </div>
                <RadarChart
                  candidateScores={activeProfile.candidateScores}
                  benchmarkScores={activeProfile.benchmarkScores}
                />
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"/> Candidate Readiness
                    </span>
                    <span className="font-black text-slate-900">{activeProfile.overallScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 inline-block"/> Target Benchmark
                    </span>
                    <span className="font-black text-slate-800">{activeProfile.targetScore}%</span>
                  </div>
                </div>
              </div>

              {/* Skill Gaps Block */}
              <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-black text-slate-900">Top Pipeline Skill Deficits</h3>
                  <span className="text-[10px] font-bold text-slate-400">{skillGaps.length} Verified Gaps</span>
                </div>
                <div className="space-y-3">
                  {skillGaps.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">No open capability gaps detected for candidates.</p>
                  ) : skillGaps.map((gap, i) => (
                    <div key={gap.id || i}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-bold text-slate-800 truncate max-w-[170px]" title={gap.name}>{gap.name}</p>
                        <span className="text-[10px] font-black" style={{ color: gap.levelColor }}>{gap.level}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full" style={{ width: `${gap.barPct}%`, background: gap.barColor }} />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{gap.sub}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setToastMessage('Enterprise training pathways initiated for active pipeline gaps.')}
                  className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Allocate Campaign Training
                </button>
              </div>
            </div>
          </div>

          {/* ── BOTTOM PANEL: INDIVIDUAL CAREER TRAJECTORY ── */}
          <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">Target Career Development Trajectory</h3>
                <p className="text-xs text-slate-400 font-medium">Milestone progression for selected candidate</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-extrabold text-slate-700 w-full sm:w-auto justify-between sm:justify-start">
                <span>Selected Candidate: <strong>{selectedCandidate}</strong></span>
              </div>
            </div>

            {/* Growth Stepper Timeline */}
            <div className="overflow-x-auto no-scrollbar pb-3">
            <div className="min-w-[600px] relative flex items-start justify-between px-6 py-2">
              <div className="absolute top-7 left-12 right-12 h-0.5 bg-slate-200 z-0" />
              <div className="absolute top-7 z-0" style={{ left: 'calc(12.5% + 12px)', width: '25%', height: '2px', background: '#10b981' }} />

              {activeProfile.trajectory.map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center" style={{ width: '25%' }}>
                  {step.done && !step.current ? (
                    <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white shadow-sm">
                      <ShieldCheck size={16} className="text-white" />
                    </div>
                  ) : step.current ? (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center border-4 border-white shadow-md ring-4 ring-indigo-50">
                      <span className="text-white text-xs font-black">{step.num}</span>
                    </div>
                  ) : step.num ? (
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white">
                      <span className="text-slate-500 text-xs font-black">{step.num}</span>
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center border-4 border-white" />
                  )}
                  <p className={`mt-3 text-xs font-black text-center ${step.current ? 'text-slate-900' : step.done ? 'text-slate-700' : 'text-slate-400'}`}>
                    {step.label}
                  </p>
                  <p className={`text-[10px] font-semibold text-center mt-0.5 ${step.current ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {step.sub}
                  </p>
                </div>
              ))}
            </div>
            </div>
          </div>

        </div>
        )}
      </main>
    </div>
  );
};

export default SuccessionPipeline;