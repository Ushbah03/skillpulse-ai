import React, { useState, useMemo } from 'react';
import { 
  Search, Bell, HelpCircle, Filter, Download, 
  TrendingUp, AlertTriangle, Users, Timer, MoreHorizontal,
  ChevronRight, Award, ShieldCheck, RefreshCw, UserCheck
} from 'lucide-react';
import HRSidebar from './HRSidebar';

// ── Mock Candidate Scores Mapping ──────────────────────────────────────────────
const CANDIDATE_PROFILES = {
  'Elena Rodriguez': {
    candidateScores: [0.88, 0.82, 0.78, 0.85, 0.72, 0.76],
    benchmarkScores: [0.82, 0.78, 0.74, 0.80, 0.68, 0.72],
    overallScore: 88,
    targetScore: 85,
    trajectory: [
      { num: null, label: 'VP Sales', sub: 'Current Role', active: true, done: true, current: false },
      { num: 2, label: 'Global Operations', sub: 'In Progress (60%)', active: true, done: false, current: true },
      { num: 3, label: 'SVP Strategy', sub: 'Future Rotation', active: false, done: false, current: false },
      { num: null, label: 'COO Target', sub: 'Ready Now', active: false, done: false, current: false },
    ]
  },
  'James Wilson': {
    candidateScores: [0.75, 0.80, 0.70, 0.72, 0.68, 0.65],
    benchmarkScores: [0.82, 0.78, 0.74, 0.80, 0.68, 0.72],
    overallScore: 78,
    targetScore: 85,
    trajectory: [
      { num: null, label: 'Operations Dir.', sub: 'Current Role', active: true, done: true, current: false },
      { num: 2, label: 'Financial Audit Rot.', sub: 'Scheduled Q1', active: false, done: false, current: true },
      { num: 3, label: 'VP Operations', sub: 'Pipeline Track', active: false, done: false, current: false },
      { num: null, label: 'COO Target', sub: '1-2 Years', active: false, done: false, current: false },
    ]
  },
  'David Park': {
    candidateScores: [0.82, 0.70, 0.80, 0.90, 0.95, 0.88],
    benchmarkScores: [0.80, 0.72, 0.75, 0.85, 0.90, 0.80],
    overallScore: 91,
    targetScore: 86,
    trajectory: [
      { num: null, label: 'VP Engineering', sub: 'Current Role', active: true, done: true, current: false },
      { num: 2, label: 'Enterprise Security', sub: 'Completed', active: true, done: true, current: false },
      { num: 3, label: 'Executive Board Rot.', sub: 'In Progress', active: true, done: false, current: true },
      { num: null, label: 'CTO Target', sub: 'Ready Now', active: false, done: false, current: false },
    ]
  },
  'Priya Singh': {
    candidateScores: [0.80, 0.75, 0.85, 0.82, 0.90, 0.84],
    benchmarkScores: [0.80, 0.72, 0.75, 0.85, 0.90, 0.80],
    overallScore: 88,
    targetScore: 86,
    trajectory: [
      { num: null, label: 'Head of AI & Data', sub: 'Current Role', active: true, done: true, current: false },
      { num: 2, label: 'Cloud Architecture', sub: 'In Progress (80%)', active: true, done: false, current: true },
      { num: 3, label: 'SVP Tech Product', sub: 'Future Track', active: false, done: false, current: false },
      { num: null, label: 'CTO Target', sub: 'Ready Now', active: false, done: false, current: false },
    ]
  }
};

// ── Competency Radar Chart (SVG) ──────────────────────────────────────────────
const RadarChart = ({ candidateScores, benchmarkScores }) => {
  const cx = 120, cy = 120, r = 85;
  const labels = ['Strategic', 'Financial', 'Operational', 'Leadership', 'Tech', 'Innovation'];
  const n = labels.length;

  const defaultCandidate = [0.88, 0.82, 0.78, 0.85, 0.72, 0.76];
  const defaultBenchmark = [0.82, 0.78, 0.74, 0.80, 0.68, 0.72];

  const cScores = candidateScores || defaultCandidate;
  const bScores = benchmarkScores || defaultBenchmark;

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
    const offset = 1.22;
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
            fontSize="9"
            fill="#64748b"
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
const SuccessionPipeline = ({ tenantName = "Internal Corporate Domain" }) => {
  const [selectedCandidate, setSelectedCandidate] = useState('Elena Rodriguez');
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Executive Pools Schema
  const cooPool = [
    { id: 'emp-101', name: 'Elena Rodriguez', status: 'Ready Now', statusColor: '#10b981', pct: 94, barColor: '#10b981', avatar: 'https://i.pravatar.cc/36?img=47' },
    { id: 'emp-102', name: 'James Wilson', status: 'Ready in 1-2 yrs', statusColor: '#f59e0b', pct: 78, barColor: '#f59e0b', avatar: 'https://i.pravatar.cc/36?img=53' },
  ];

  const ctoPool = [
    { id: 'emp-201', name: 'David Park', status: 'Ready Now', statusColor: '#10b981', pct: 91, barColor: '#10b981', avatar: 'https://i.pravatar.cc/36?img=12' },
    { id: 'emp-202', name: 'Priya Singh', status: 'Ready Now', statusColor: '#10b981', pct: 88, barColor: '#10b981', avatar: 'https://i.pravatar.cc/49' },
  ];

  const skillGaps = [
    { name: 'Digital Transformation', level: 'Critical Gap', levelColor: '#ef4444', barColor: '#ef4444', barPct: 35, sub: '4 candidates below target threshold' },
    { name: 'Crisis Management', level: 'Moderate Gap', levelColor: '#f59e0b', barColor: '#f59e0b', barPct: 58, sub: 'Needs rotational development' },
    { name: 'Global Operations', level: 'On Track', levelColor: '#3b82f6', barColor: '#3b82f6', barPct: 80, sub: 'Meets benchmark metrics' },
  ];

  // Search Filtering logic
  const filteredCooPool = useMemo(() => 
    cooPool.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]
  );

  const filteredCtoPool = useMemo(() => 
    ctoPool.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]
  );

  const activeProfile = CANDIDATE_PROFILES[selectedCandidate] || CANDIDATE_PROFILES['Elena Rodriguez'];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Succession Audit Report for ${tenantName} exported successfully.`);
    }, 1200);
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }} className="flex min-h-screen bg-[#f8fafc]">
      {/* ── LEFT NAVIGATION SIDEBAR ── */}
      <HRSidebar />

      <div className="flex-1 ml-64 overflow-auto">
        {/* ── HEADER / TOP NAV ── */}
        <header className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
            <span>HR Manager</span>
            <span className="text-slate-300">›</span>
            <span>Talent Planning</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-900 font-bold">Succession & HiPo Pipeline</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search talent pool..."
                className="pl-9 pr-4 py-2 rounded-full bg-slate-100 text-sm text-slate-700 outline-none w-56 border border-transparent focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <HelpCircle size={18} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* ── MAIN CONTENT WORKSPACE ── */}
        <div className="px-8 py-6 space-y-6">

          {/* ── HEADER TITLE BLOCK ── */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Leadership & Succession Pipeline</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                AI-assisted readiness tracking, critical role succession, and high-potential development.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                Tenant: <strong>{tenantName}</strong>
              </span>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={14} /> Filter Pool
              </button>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                Export Audit Report
              </button>
            </div>
          </div>

          {/* ── METRIC CARDS ── */}
          <div className="grid grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Readiness</p>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp size={16} className="text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">78%</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">+4.2%</span>
                <span className="text-xs text-slate-400 font-medium">vs last quarter</span>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Critical Skill Gaps</p>
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-rose-500" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">3</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">-1 Gap</span>
                <span className="text-xs text-slate-400 font-medium">resolved this month</span>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">HiPo Talent Pool</p>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Users size={16} className="text-indigo-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">42</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">12 Senior Bench</span>
              </div>
              <div className="mt-3 flex -space-x-2">
                {['?img=12', '?img=47', '?img=53', '?img=68'].map((q, i) => (
                  <img key={i} src={`https://i.pravatar.cc/24${q}`} className="w-6 h-6 rounded-full border-2 border-white object-cover" alt="Talent Avatar" />
                ))}
                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-600">+38</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg. Time to Ready</p>
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Timer size={16} className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">14 mo</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">-2 months</span>
                <span className="text-xs text-slate-400 font-medium">accelerated path</span>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>

          {/* ── MIDDLE GRID: SUCCESSION POOLS + RADAR & SKILL GAPS ── */}
          <div className="grid grid-cols-3 gap-5">

            {/* LEFT 2 COLUMNS: DEPTH CHART */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-black text-slate-900">Succession Depth Chart</h3>
                  <p className="text-xs text-slate-400 font-medium">Mapped key leadership seats & readiness pools</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors">
                  Expand All
                </button>
              </div>

              {/* CEO Incumbent Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-5 bg-slate-50/50">
                <div className="flex items-start p-5 border-l-4 border-indigo-600 bg-white">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                        Key Executive Seat
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                        LOW ATTRITION RISK
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">Chief Executive Officer (CEO)</h4>
                    <div className="flex items-center gap-3">
                      <img src="https://i.pravatar.cc/40?img=53" className="w-10 h-10 rounded-full object-cover border-2 border-slate-200" alt="Robert Chen" />
                      <div>
                        <p className="text-sm font-extrabold text-slate-800">Robert Chen</p>
                        <p className="text-xs text-slate-400 font-medium">3 Years in Position • Planned Transition: Q4 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Successor Pools Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* COO Pool */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-wider">COO Bench Pool</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100">
                      MODERATE RISK
                    </span>
                  </div>
                  <div className="space-y-3">
                    {filteredCooPool.length === 0 ? (
                      <p className="text-xs text-slate-400 py-2">No matching candidates</p>
                    ) : filteredCooPool.map((p) => (
                      <div 
                        key={p.id} 
                        onClick={() => setSelectedCandidate(p.name)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${selectedCandidate === p.name ? 'bg-indigo-50/70 border border-indigo-200 shadow-sm' : 'hover:bg-slate-50'}`}
                      >
                        <div className="relative">
                          <img src={p.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt={p.name} />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: p.statusColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] font-bold" style={{ color: p.statusColor }}>{p.status}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <ProgressBar pct={p.pct} color={p.barColor} />
                          <span className="text-xs font-black text-slate-700 w-7 text-right">{p.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTO Pool */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-wider">CTO Bench Pool</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                      HEALTHY BENCH
                    </span>
                  </div>
                  <div className="space-y-3">
                    {filteredCtoPool.length === 0 ? (
                      <p className="text-xs text-slate-400 py-2">No matching candidates</p>
                    ) : filteredCtoPool.map((p) => (
                      <div 
                        key={p.id}
                        onClick={() => setSelectedCandidate(p.name)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${selectedCandidate === p.name ? 'bg-indigo-50/70 border border-indigo-200 shadow-sm' : 'hover:bg-slate-50'}`}
                      >
                        <div className="relative">
                          <img src={p.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt={p.name} />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: p.statusColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] font-bold" style={{ color: p.statusColor }}>{p.status}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <ProgressBar pct={p.pct} color={p.barColor} />
                          <span className="text-xs font-black text-slate-700 w-7 text-right">{p.pct}%</span>
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
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
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
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"/> Candidate Rating
                    </span>
                    <span className="font-black text-slate-900">{activeProfile.overallScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 inline-block"/> Target Benchmark
                    </span>
                    <span className="font-black text-slate-800">{activeProfile.targetScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Skill Gaps Block */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-black text-slate-900">Top Pipeline Skill Deficits</h3>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Detailed Audit</button>
                </div>
                <div className="space-y-3">
                  {skillGaps.map((gap, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-bold text-slate-800">{gap.name}</p>
                        <span className="text-[10px] font-black" style={{ color: gap.levelColor }}>{gap.level}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full" style={{ width: `${gap.barPct}%`, background: gap.barColor }} />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">{gap.sub}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => alert('Redirecting to Enterprise Training Campaign Creator...')}
                  className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Allocate Campaign Training
                </button>
              </div>
            </div>
          </div>

          {/* ── BOTTOM PANEL: INDIVIDUAL CAREER TRAJECTORY ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-black text-slate-900">Target Career Development Trajectory</h3>
                <p className="text-xs text-slate-400 font-medium">Milestone progression for selected candidate</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-extrabold text-slate-700">
                <span>Selected Candidate: <strong>{selectedCandidate}</strong></span>
              </div>
            </div>

            {/* Growth Stepper Timeline */}
            <div className="relative flex items-start justify-between px-6 py-2">
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
    </div>
  );
};

export default SuccessionPipeline;