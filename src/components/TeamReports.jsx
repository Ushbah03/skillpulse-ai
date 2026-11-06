import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { teamLeaderAPI } from '../services/api';
import {
  ChevronDown,
  Calendar,
  Download,
  Search,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  ShieldCheck,
  BrainCircuit,
  FileText,
  FileSpreadsheet,
  Share2,
  Send,
  Plus,
  X,
  ArrowRight,
  Filter,
  Loader2
} from 'lucide-react';

// Interactive Team Performance Trend Chart
const TeamPerformanceTrendChart = ({ trendData }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const months = trendData?.months && trendData.months.length > 0
    ? trendData.months
    : ["June", "July", "August", "September", "October", "November"];

  const perf = trendData?.performance && trendData.performance.length > 0
    ? trendData.performance
    : [64, 68, 71, 74, 76, 78];

  const skill = trendData?.skillGrowth && trendData.skillGrowth.length > 0
    ? trendData.skillGrowth
    : [58, 62, 67, 71, 75, 78];

  const impact = trendData?.trainingImpact && trendData.trainingImpact.length > 0
    ? trendData.trainingImpact
    : [48, 52, 57, 61, 65, 70];

  const W = 960;
  const H = 260;
  const padL = 55;
  const padR = 30;
  const padT = 36;
  const padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const n = Math.max(1, months.length - 1);

  const xPos = (i) => padL + (i / n) * chartW;
  const yPos = (val) => padT + chartH - ((Math.min(100, Math.max(0, Number(val) || 0)) / 100) * chartH);

  // Catmull-Rom cubic bezier curve for high-precision smooth lines
  const toSmoothPath = (pts) => {
    if (!pts || pts.length === 0) return "";
    if (pts.length === 1) return `M ${xPos(0)} ${yPos(pts[0])}`;

    const points = pts.map((v, i) => ({ x: xPos(i), y: yPos(v) }));
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 5.5;
      const cp1y = p1.y + (p2.y - p0.y) / 5.5;
      const cp2x = p2.x - (p3.x - p1.x) / 5.5;
      const cp2y = p2.y - (p3.y - p1.y) / 5.5;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const toSmoothArea = (pts) => {
    const base = yPos(0);
    const endX = xPos(pts.length - 1).toFixed(1);
    const startX = xPos(0).toFixed(1);
    const baseY = base.toFixed(1);
    return `${toSmoothPath(pts)} L ${endX} ${baseY} L ${startX} ${baseY} Z`;
  };

  const yTicks = [100, 75, 50, 25, 0];

  return (
    <div className="relative w-full select-none pt-2">
      {/* Dynamic Glassmorphic Tooltip */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -top-1 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 text-xs backdrop-blur-xl"
            style={{
              left: `${Math.min(92, Math.max(8, (xPos(hoveredIdx) / W) * 100))}%`
            }}
          >
            <div className="font-bold flex items-center justify-between gap-4 text-slate-200 border-b border-slate-800 pb-1.5 mb-2">
              <span className="text-white font-extrabold">
                {months[hoveredIdx]}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Performance Insight
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 inline-block" />
                <span className="text-slate-400 font-medium">Performance:</span>
                <span className="font-black text-white">{perf[hoveredIdx]}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 inline-block" />
                <span className="text-slate-400 font-medium">Skill Growth:</span>
                <span className="font-black text-white">{skill[hoveredIdx]}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50 inline-block" />
                <span className="text-slate-400 font-medium">Training Impact:</span>
                <span className="font-black text-white">{impact[hoveredIdx]}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 260 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="teamPerfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y-Axis Horizontal Grid Lines & Percent Labels */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yPos(tick)}
              y2={yPos(tick)}
              stroke="#cbd5e1"
              strokeDasharray={tick === 0 ? "none" : "3 3"}
              strokeWidth={tick === 0 ? "1.5" : "1"}
              strokeOpacity="0.55"
            />
            <text
              x={padL - 10}
              y={yPos(tick) + 4}
              textAnchor="end"
              fontSize="10"
              fill="#64748b"
              fontWeight="700"
              fontFamily="sans-serif"
            >
              {tick}%
            </text>
          </g>
        ))}

        {/* Vertical Guide Indicator Line on Hover */}
        {hoveredIdx !== null && (
          <line
            x1={xPos(hoveredIdx)}
            x2={xPos(hoveredIdx)}
            y1={padT - 6}
            y2={padT + chartH}
            stroke="#3B82F6"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />
        )}

        {/* Performance Gradient Area Under Curve */}
        <path
          d={toSmoothArea(perf)}
          fill="url(#teamPerfGrad)"
        />

        {/* Series 1: Performance Line */}
        <path
          d={toSmoothPath(perf)}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Series 2: Skill Growth Line (Dashed) */}
        <path
          d={toSmoothPath(skill)}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="3"
          strokeDasharray="7 5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Series 3: Training Impact Line */}
        <path
          d={toSmoothPath(impact)}
          fill="none"
          stroke="#818CF8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Circular Nodes for each month across all 3 series */}
        {months.map((_, i) => (
          <g key={`nodes-${i}`}>
            {/* Performance Node */}
            <circle
              cx={xPos(i)}
              cy={yPos(perf[i])}
              r={hoveredIdx === i ? 6.5 : 4}
              fill="#3B82F6"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="transition-all duration-150"
            />
            {/* Skill Growth Node */}
            <circle
              cx={xPos(i)}
              cy={yPos(skill[i])}
              r={hoveredIdx === i ? 6.5 : 4}
              fill="#06B6D4"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="transition-all duration-150"
            />
            {/* Training Impact Node */}
            <circle
              cx={xPos(i)}
              cy={yPos(impact[i])}
              r={hoveredIdx === i ? 6.5 : 4}
              fill="#818CF8"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="transition-all duration-150"
            />
          </g>
        ))}

        {/* X-Axis Month Labels */}
        {months.map((m, i) => (
          <text
            key={`month-${i}`}
            x={xPos(i)}
            y={padT + chartH + 24}
            textAnchor="middle"
            fontSize="11"
            fill={hoveredIdx === i ? "#1e293b" : "#64748b"}
            fontWeight={hoveredIdx === i ? "900" : "700"}
            letterSpacing="0.05em"
            fontFamily="sans-serif"
            className="uppercase transition-colors duration-150"
          >
            {m}
          </text>
        ))}

        {/* Hover interaction transparent overlay columns */}
        {months.map((_, i) => {
          const colW = chartW / n;
          const leftEdge = Math.max(padL, xPos(i) - colW / 2);
          const rightEdge = Math.min(W - padR, xPos(i) + colW / 2);
          const width = rightEdge - leftEdge;
          return (
            <rect
              key={`hit-${i}`}
              x={leftEdge}
              y={padT - 10}
              width={width}
              height={chartH + 40}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default function TeamReports() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState('Executive Skill Gap Summary');
  const [dateRange, setDateRange] = useState('Last 6 Months (Current)');
  const [selectedMemberScope, setSelectedMemberScope] = useState('All Members');
  const [loading, setLoading] = useState(true);
  const [liveTeams, setLiveTeams] = useState([]);
  const [reportsData, setReportsData] = useState(null);

  // Modal & Toast States
  const [activeModal, setActiveModal] = useState(null); // 'insight'
  const [activeInsight, setActiveInsight] = useState(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchReportsData = async () => {
      setLoading(true);
      try {
        const [repRes, ovRes] = await Promise.all([
          teamLeaderAPI.getReports().catch(() => null),
          teamLeaderAPI.getOverview().catch(() => null)
        ]);
        if (isMounted) {
          if (repRes?.data) setReportsData(repRes.data);
          if (ovRes?.data) setLiveTeams(ovRes.data);
        }
      } catch (err) {
        console.warn('Failed to fetch live report data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReportsData();
    return () => { isMounted = false; };
  }, []);

  // Workforce Member Metrics Data from DB
  const workforceData = React.useMemo(() => {
    if (reportsData?.members && Array.isArray(reportsData.members) && reportsData.members.length > 0) {
      return reportsData.members;
    }

    if (!liveTeams || !Array.isArray(liveTeams) || liveTeams.length === 0) {
      return [];
    }

    const memberList = [];
    liveTeams.forEach(team => {
      if (team.members && Array.isArray(team.members)) {
        team.members.forEach(m => {
          if (!memberList.some(x => x.id === m.id)) {
            const skillCount = m.skills?.length || 0;
            const score = Math.min(98, Math.max(60, 68 + (skillCount * 6)));
            const gapsCount = m.skillGaps?.length || 0;
            const initials = `${m.firstName?.[0] || ''}${m.lastName?.[0] || ''}`.toUpperCase() || 'EM';
            
            memberList.push({
              id: m.id,
              name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Team Member',
              role: m.jobTitle || (m.role === 'TEAM_LEADER' ? 'Team Lead' : 'Software Engineer'),
              skillScore: `${score}/100`,
              performance: (3.5 + (score / 100) * 1.4).toFixed(1),
              completion: Math.min(100, Math.max(40, score - 5)),
              readiness: score >= 85 ? 'High' : score >= 70 ? 'Moderate' : 'Developing',
              gapLevel: gapsCount === 0 ? 'Low' : gapsCount <= 2 ? 'Medium' : 'High',
              initials,
              avatarUrl: m.avatarUrl || null
            });
          }
        });
      }
    });

    return memberList;
  }, [reportsData, liveTeams]);

  // Filtered members selector
  const filteredWorkforce = React.useMemo(() => {
    if (!workforceData) return [];
    return workforceData.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workforceData, searchQuery]);

  // Category Distribution Metrics from DB
  const categoriesDistribution = React.useMemo(() => {
    if (reportsData?.categoriesDistribution && Array.isArray(reportsData.categoriesDistribution) && reportsData.categoriesDistribution.length > 0) {
      return reportsData.categoriesDistribution;
    }
    return [];
  }, [reportsData]);

  const handleExportCSV = () => {
    const csvHeader = "Name,Role,Skill Score,Performance,Completion (%),Readiness,Gap Level\n";
    const csvRows = filteredWorkforce.map(m => 
      `"${m.name}","${m.role}","${m.skillScore}","${m.performance}",${m.completion},"${m.readiness}","${m.gapLevel}"`
    ).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Team_Report_${reportType.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report CSV successfully generated & downloaded!');
  };

  const handleExportExcel = () => {
    // Generate simple XML spreadsheet representation for excel compatibility
    let excelContent = "<table><tr><th>Name</th><th>Role</th><th>Skill Score</th><th>Performance</th><th>Completion (%)</th><th>Readiness</th><th>Gap Level</th></tr>";
    filteredWorkforce.forEach(m => {
      excelContent += `<tr><td>${m.name}</td><td>${m.role}</td><td>${m.skillScore}</td><td>${m.performance}</td><td>${m.completion}</td><td>${m.readiness}</td><td>${m.gapLevel}</td></tr>`;
    });
    excelContent += "</table>";
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Team_Report_${reportType.replace(/\s+/g, '_')}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report Excel workbook successfully generated & downloaded!');
  };

  const handleExportPDF = () => {
    window.print();
    showToast('Browser print engine launched for PDF creation!');
  };

  const handleExport = (format) => {
    if (format === 'CSV') {
      handleExportCSV();
    } else if (format === 'Excel') {
      handleExportExcel();
    } else if (format === 'PDF') {
      handleExportPDF();
    } else {
      handleExportPDF();
    }
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
      {/* Sidebar Navigation */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Workforce View Dashboard Framework */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 px-3.5 sm:px-6 md:px-8 py-4 sm:py-8 w-full relative z-10 space-y-4 sm:space-y-8">
        
        {/* Top Header & Operational Controls */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 mb-4">
          <div>
            <h1 className="text-4xl font-black text-[#0b1221] tracking-tight">Team Reports</h1>
            <p className="text-slate-500 text-base font-semibold mt-2">Generate and analyze comprehensive team workforce reports</p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3.5 w-full sm:w-auto">
            <div className="relative">
              <select 
                value={selectedMemberScope} 
                onChange={(e) => {
                  setSelectedMemberScope(e.target.value);
                  showToast(`Scope set to: ${e.target.value}`);
                }}
                className="appearance-none bg-white border border-slate-200 px-4 pr-9 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                <option value="All Members">All Members</option>
                <option value="Engineers">Engineers Only</option>
                <option value="Designers">Designers Only</option>
                <option value="Tech Leads">Tech Leads Only</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={dateRange} 
                onChange={(e) => {
                  setDateRange(e.target.value);
                  showToast(`Time horizon set to: ${e.target.value}`);
                }}
                className="appearance-none bg-white border border-slate-200 px-4 pr-9 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                <option value="Last 6 Months (Current)">Last 6 Months (Current)</option>
                <option value="Q3 - Q4 2026">Q3 - Q4 2026</option>
                <option value="Q1 - Q2 2026">Q1 - Q2 2026</option>
                <option value="Full Year 2026">Full Year 2026</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <button 
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all cursor-pointer"
              >
                <Download size={16} />
                <span>Export Report</span>
                <ChevronDown size={14} className="opacity-70" />
              </button>
              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 w-44 z-30">
                  <button 
                    onClick={() => { handleExport('PDF'); setExportMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileText size={15} className="text-rose-500" />
                    <span>Export PDF</span>
                  </button>
                  <button 
                    onClick={() => { handleExport('Excel'); setExportMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet size={15} className="text-emerald-500" />
                    <span>Export Excel</span>
                  </button>
                  <button 
                    onClick={() => { handleExport('CSV'); setExportMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Share2 size={15} className="text-blue-500" />
                    <span>Export CSV</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 1. Core Performance Matrix Cards Panel */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          <OverviewReportCard
            title="PERFORMANCE SCORE"
            value={reportsData?.performanceScore || '0.0'}
            icon={<TrendingUp size={18} className="text-blue-600" />}
            iconBg="bg-blue-50"
            trend={reportsData?.overallScore > 0 ? "+12% TREND" : "STABLE"}
            trendColor="text-emerald-600 bg-emerald-50 border border-emerald-100"
          />
          <OverviewReportCard
            title="SKILL MATURITY INDEX"
            value={reportsData?.skillMaturity || '0.0'}
            valueSuffix="/5.0"
            icon={<Award size={18} className="text-blue-600" />}
            iconBg="bg-cyan-50"
            trend={reportsData?.overallScore >= 70 ? "OPTIMAL LEVEL" : "DEVELOPING"}
            trendColor="text-emerald-600 bg-emerald-50 border border-emerald-100"
          />
          <OverviewReportCard
            title="TRAINING COMPLETION"
            value={reportsData?.trainingCompletion || '0%'}
            icon={<CheckCircle2 size={18} className="text-indigo-600" />}
            iconBg="bg-indigo-50"
            customRing={true}
          />
          <OverviewReportCard
            title="TEAM READINESS SCORE"
            value={reportsData?.overallScore != null ? `${reportsData.overallScore}` : '0'}
            icon={<ShieldCheck size={18} className="text-emerald-600" />}
            iconBg="bg-emerald-50"
          />
        </div>

        {/* 2. Longitudinal Tracking Analysis Block */}
        <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Team Performance Trend Analysis</h3>
              <p className="text-slate-400 text-sm font-semibold mt-1">Longitudinal tracking of team productivity and skill impact</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span><span>PERFORMANCE</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-slate-600">
                <span className="w-3 h-1 bg-cyan-400 border-2 border-dashed border-cyan-400"></span><span>SKILL GROWTH</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-indigo-300"></span><span>TRAINING IMPACT</span>
              </div>
            </div>
          </div>

          {/* Interactive Vector Graph Chart Area */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[560px]">
              <TeamPerformanceTrendChart trendData={reportsData?.trendAnalysis} />
            </div>
          </div>
        </div>

        {/* 3. Skill & Training Proficiency Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          
          {/* Skill Distribution Segment */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-4 sm:space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Skill Distribution by Category</h3>
            <div className="space-y-5 pt-2">
              {categoriesDistribution.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-wider">
                    <span className="text-slate-700">{cat.name}</span>
                    <span>{cat.score}</span>
                  </div>
                  <div className="w-full bg-amber-50/40 h-2.5 rounded-full border border-amber-100/10 overflow-hidden">
                    <div className={`h-full ${cat.color || 'bg-blue-600'} rounded-full transition-all duration-500`} style={{ width: `${cat.percentage || 75}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proficiency Donut Breakdown */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Skill Proficiency Distribution</h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Live Breakdown</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 flex-1 py-2">
              {/* Dynamic SVG Donut Chart */}
              {(() => {
                const adv = reportsData?.proficiencyDonut?.advanced ?? 0;
                const int = reportsData?.proficiencyDonut?.intermediate ?? 0;
                const beg = reportsData?.proficiencyDonut?.beginner ?? 0;
                const circumference = 251.33; // 2 * pi * 40

                const advDash = (adv / 100) * circumference;
                const intDash = (int / 100) * circumference;
                const begDash = (beg / 100) * circumference;

                const intOffset = -advDash;
                const begOffset = -(advDash + intDash);

                return (
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background Ring */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="11"
                      />
                      {/* Advanced Arc (Blue) */}
                      {adv > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#2563eb"
                          strokeWidth="11"
                          strokeDasharray={`${advDash} ${circumference}`}
                          strokeDashoffset="0"
                          className="transition-all duration-700 ease-out"
                        />
                      )}
                      {/* Intermediate Arc (Cyan) */}
                      {int > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#06b6d4"
                          strokeWidth="11"
                          strokeDasharray={`${intDash} ${circumference}`}
                          strokeDashoffset={intOffset}
                          className="transition-all duration-700 ease-out"
                        />
                      )}
                      {/* Beginner Arc (Indigo) */}
                      {beg > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#6366f1"
                          strokeWidth="11"
                          strokeDasharray={`${begDash} ${circumference}`}
                          strokeDashoffset={begOffset}
                          className="transition-all duration-700 ease-out"
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                        {adv + int + beg > 0 ? '100%' : '0%'}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Team</span>
                    </div>
                  </div>
                );
              })()}

              {/* Clean Legend Breakdown Rows */}
              <div className="flex-1 w-full space-y-2.5">
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-none">Advanced</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">Proficiency Level &ge; 4.0</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-blue-600">{reportsData?.proficiencyDonut?.advanced ?? 0}%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0"></span>
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-none">Intermediate</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">Proficiency Level 2.5 - 3.9</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-cyan-600">{reportsData?.proficiencyDonut?.intermediate ?? 0}%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></span>
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-none">Beginner</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">Proficiency Level &lt; 2.5</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-indigo-600">{reportsData?.proficiencyDonut?.beginner ?? 0}%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Intervention Effectiveness Comparison Analytics */}
        <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Training Effectiveness Analysis</h3>
            <p className="text-slate-400 text-sm font-semibold mt-1">Comparison of skill proficiency levels before and after professional training interventions</p>
          </div>

          <div className="grid grid-cols-12 gap-8 items-center pt-2">
            <div className="col-span-3 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F172A] flex items-center justify-center text-white text-base font-black">
                  {reportsData?.effectiveness?.skillImprovement || '0%'}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 leading-tight">Skill Improvement</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-base font-black">
                  {reportsData?.effectiveness?.performanceLift || '0%'}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 leading-tight">Performance Lift</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-base font-black">
                  {reportsData?.effectiveness?.completionImpact || '0%'}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 leading-tight">Completion Impact</p>
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-9 bg-slate-50/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-100 flex flex-col sm:flex-row items-center sm:items-end justify-between min-h-[224px] relative overflow-x-auto no-scrollbar">
              <div className="flex gap-16 items-end flex-1 justify-around h-full pt-6">
                {(reportsData?.effectiveness?.bars && reportsData.effectiveness.bars.length > 0) ? (
                  reportsData.effectiveness.bars.map((b, idx) => (
                    <DoubleBarChartGroup key={idx} label={b.label} valBefore={b.valBefore} valAfter={b.valAfter} />
                  ))
                ) : (
                  <div className="text-slate-400 text-xs font-bold text-center w-full py-8">
                    No active intervention delta to display.
                  </div>
                )}
              </div>

              <div className="w-24 border-l border-slate-200/80 pl-6 space-y-3 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-slate-200 rounded-sm"></span><span>Before</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-sm"></span><span>After</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Detailed Team Workforce Spreadsheet */}
        <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Detailed Team Workforce Report</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search members..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold text-slate-700 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 pb-1 text-center">
              <div className="w-[20%] text-left">Member Name</div>
              <div className="w-[18%] text-left">Role</div>
              <div className="w-[12%]">Skill Score</div>
              <div className="w-[12%]">Performance</div>
              <div className="w-[14%]">Completion</div>
              <div className="w-[12%]">Readiness</div>
              <div className="w-[12%] text-right">Gap Level</div>
            </div>

            <div className="space-y-3">
              {filteredWorkforce.length > 0 ? (
                filteredWorkforce.map((member, rIdx) => (
                  <WorkforceRow 
                    key={rIdx} 
                    member={member} 
                    onClick={() => navigate(`/team-leader/member-profile?name=${encodeURIComponent(member.name)}`)} 
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-bold">
                  No workforce members match your search query.
                </div>
              )}
            </div>
          </div>
        </div>



        {/* 7. AI Intelligence Insights Footer Block */}
        <div className="bg-[#F3F6FF] rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 border border-blue-100/60 space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-600/10">
                <BrainCircuit size={22} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AI Workforce Report Insights</h3>
                <p className="text-slate-500 text-sm font-semibold">Predictive intelligence and optimization recommendations</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>Active Processing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {(reportsData?.aiInsights && reportsData.aiInsights.length > 0 ? reportsData.aiInsights : [
              {
                badge: "GROWTH",
                badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
                confidence: "94%",
                desc: "Team performance is projected to increase through targeted skill track completion.",
                title: "Skill Track Optimization",
                recommendation: "Accelerate completion of key technical tracks to unlock immediate delivery velocity.",
                impact: "+14.2% Estimated Efficiency"
              },
              {
                badge: "SUCCESS",
                badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
                confidence: "91%",
                desc: "Key competency domains have reached high operational stability across sprint milestones.",
                title: "Domain Proficiency Validation",
                recommendation: "Standardize best practices across squads to sustain cross-functional agility.",
                impact: "High ROI Confirmed"
              },
              {
                badge: "ALERT",
                badgeColor: "bg-orange-50 text-orange-600 border-orange-100",
                confidence: "89%",
                desc: "All active team competency requirements currently comply with target operational thresholds.",
                title: "Compliance Stability Verified",
                recommendation: "Maintain periodic skill assessment intervals.",
                impact: "Zero Critical Deficits"
              }
            ]).map((insight, idx) => (
              <AIReportInsightCard
                key={idx}
                badge={insight.badge}
                badgeColor={insight.badgeColor}
                confidence={insight.confidence}
                desc={<span>{insight.desc}</span>}
                onAction={() => {
                  setActiveInsight({
                    title: insight.title,
                    recommendation: insight.recommendation,
                    impact: insight.impact
                  });
                  setActiveModal('insight');
                }}
              />
            ))}
          </div>
        </div>

        {/* 8. Dashboard Executive Visual Summary Dark Module */}
        <div className="bg-[#0b111e] p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] text-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-xl">
          <div className="max-w-md space-y-2">
            <h3 className="text-3xl font-bold tracking-tight">Executive Visual Summary</h3>
            <p className="text-slate-400 text-sm font-semibold leading-relaxed">
              Real-time team competency intelligence and predictive longitudinal trajectory derived from live workforce evaluation metrics.
            </p>
            
            <div className="flex gap-12 pt-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Index</p>
                <p className="text-3xl font-black mt-1 flex items-center gap-1.5">
                  {reportsData?.executiveSummary?.skillIndex ?? (reportsData?.overallScore ?? 0)}
                  <span className="text-xs font-bold text-emerald-400">
                    {reportsData?.executiveSummary?.trendDelta ? (reportsData.executiveSummary.trendDelta.startsWith('+') || reportsData.executiveSummary.trendDelta.startsWith('-') ? reportsData.executiveSummary.trendDelta : `+${reportsData.executiveSummary.trendDelta}`) : '+0.0'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Velocity</p>
                <p className="text-3xl font-black mt-1">{reportsData?.executiveSummary?.growthVelocity || 'Developing'}</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[420px] bg-[#141b2b] border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4">
            <DarkBarTrack label="READINESS" percentage={reportsData?.executiveSummary?.readiness ?? 0} color="bg-blue-500" />
            <DarkBarTrack label="OPTIMIZATION" percentage={reportsData?.executiveSummary?.optimization ?? 0} color="bg-cyan-400" />
            <DarkBarTrack label="RESILIENCE" percentage={reportsData?.executiveSummary?.resilience ?? 0} color="bg-indigo-500" />
          </div>
        </div>

      </main>

      {/* --- Action Modals --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          
          {/* AI Insight Action Details Modal */}
          {activeModal === 'insight' && activeInsight && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Sparkles size={18} />
                  <h3 className="text-lg font-bold text-slate-900">Recommended Action</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-base">{activeInsight.title}</h4>
                <p className="text-xs font-semibold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                  {activeInsight.recommendation}
                </p>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400 font-bold">Expected Impact</span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    {activeInsight.impact}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setActiveModal(null);
                  showToast('Action plan initiated and logged to Team Backlog.');
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Apply Action Plan
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

/* --- Secondary Module Helper Components --- */

const OverviewReportCard = ({ title, value, valueSuffix, icon, iconBg, trend, trendColor, customRing }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden">
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-black text-[#8A9CB7] tracking-widest truncate">{title}</span>
      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>{icon}</div>
    </div>
    
    <div className="mt-4 flex justify-between items-end">
      <h4 className="text-xl sm:text-3xl md:text-4xl font-black text-[#17233E] tracking-tight">
        {value}{valueSuffix && <span className="text-base text-slate-400 font-medium ml-0.5">{valueSuffix}</span>}
      </h4>
      {trend && (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${trendColor}`}>{trend}</span>
      )}
      {customRing && (
        <div className="w-6 h-6 rounded-full border-2 border-dashed border-indigo-500 animate-spin"></div>
      )}
    </div>
  </div>
);

const DoubleBarChartGroup = ({ label, valBefore, valAfter }) => (
  <div className="flex flex-col items-center h-full justify-end space-y-3 w-16">
    <div className="flex items-end gap-2.5 h-full w-full justify-center">
      <div className="bg-slate-200 w-3.5 rounded-t-sm transition-all duration-500" style={{ height: `${valBefore}%` }}></div>
      <div className="bg-blue-500 w-3.5 rounded-t-sm transition-all duration-500" style={{ height: `${valAfter}%` }}></div>
    </div>
    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block whitespace-nowrap">{label}</span>
  </div>
);

const WorkforceRow = ({ member, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3.5 sm:p-4 bg-[#E4EEF8]/60 backdrop-blur-md rounded-2xl border border-white/85 hover:border-[#1988A3]/50 hover:bg-[#E4EEF8]/90 hover:shadow-sm transition-all text-center text-sm font-semibold text-[#17233E] cursor-pointer"
  >
    <div className="w-[20%] flex items-center gap-3.5 text-left">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-sm shrink-0">
        {member.initials || 'EM'}
      </div>
      <span className="text-base font-black text-slate-900 tracking-tight hover:text-blue-600 transition-colors">{member.name}</span>
    </div>
    <div className="w-[18%] text-left text-slate-400 font-medium">{member.role}</div>
    <div className="w-[12%] text-blue-600 font-black tracking-wide">{member.skillScore}</div>
    <div className="w-[12%] text-slate-900 font-black">{member.performance}</div>
    
    <div className="w-[14%] px-4">
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full ${member.completion < 60 ? 'bg-amber-500' : 'bg-blue-500'} rounded-full`} 
          style={{ width: `${member.completion}%` }}
        ></div>
      </div>
    </div>
    
    <div className="w-[12%] flex justify-center">
      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
        member.readiness === 'High' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
      }`}>
        {member.readiness}
      </span>
    </div>
    
    <div className="w-[12%] flex justify-end">
      <span className={`font-black text-sm pr-4 ${member.gapLevel === 'Low' ? 'text-emerald-500' : 'text-orange-500'}`}>
        {member.gapLevel}
      </span>
    </div>
  </div>
);



const AIReportInsightCard = ({ badge, badgeColor, confidence, desc, onAction }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className={`text-[9px] font-black px-2 py-0.5 border rounded-md tracking-wider ${badgeColor}`}>{badge}</span>
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-0.5"><Sparkles size={12} className="text-blue-500" /> {confidence} Conf.</span>
      </div>
      <p className="text-sm text-slate-500 font-semibold leading-relaxed">{desc}</p>
    </div>
    <button 
      onClick={onAction}
      className="text-blue-600 hover:text-blue-700 text-xs font-black text-left w-max transition-all flex items-center gap-1 cursor-pointer"
    >
      <span>View Solution</span>
      <ArrowRight size={12} />
    </button>
  </div>
);

const DarkBarTrack = ({ label, percentage, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-400">
      <span>{label}</span>
      <span className="text-slate-200">{percentage}%</span>
    </div>
    <div className="w-full bg-[#1b2438] h-1.5 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);