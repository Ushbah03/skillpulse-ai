import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import HRSidebar from './HRSidebar'; 
import { motion, AnimatePresence } from 'framer-motion';

// ── Inline Recharts-style SVG line chart ──────────────────────────────────────
const WorkforceLineChart = () => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const current = [1284, 1295, 1305, 1316, 1325, 1333, 1340, 1347, 1353, 1358, 1364, 1370];
  const projected = [1284, 1298, 1316, 1338, 1362, 1383, 1400, 1412, 1422, 1430, 1436, 1440];

  const minVal = 1270;
  const maxVal = 1460;
  const range = maxVal - minVal;
  const W = 960, H = 220, padL = 12, padR = 20, padT = 20, padB = 0;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const xPos = (i) => padL + (i / (months.length - 1)) * chartW;
  const yPos = (v) => padT + chartH - ((v - minVal) / range) * chartH;

  const toPath = (data) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yPos(v).toFixed(1)}`).join(' ');

  const toArea = (data) => {
    const base = yPos(minVal);
    return `${toPath(data)} L ${xPos(data.length - 1).toFixed(1)} ${base} L ${xPos(0).toFixed(1)} ${base} Z`;
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
const DonutChart = () => {
  const segments = [
    { pct: 45, color: '#3b82f6' },
    { pct: 25, color: '#8b5cf6' },
    { pct: 15, color: '#f59e0b' },
    { pct: 10, color: '#10b981' },
    { pct: 5, color: '#ef4444' },
  ];
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
  const [currentTenant] = useState("Enterprise Corp");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const itemsPerPage = 3;

  const roleData = [
    { id: 1, role: 'Software Engineer', dept: 'Engineering', current: 120, required: 145, gap: 25 },
    { id: 2, role: 'Data Analyst', dept: 'Engineering', current: 42, required: 60, gap: 18 },
    { id: 3, role: 'Account Executive', dept: 'Sales', current: 65, required: 75, gap: 10 },
    { id: 4, role: 'Product Designer', dept: 'Engineering', current: 14, required: 18, gap: 4 },
    { id: 5, role: 'DevOps Specialist', dept: 'Operations', current: 12, required: 20, gap: 8 },
  ];

  const hiringDemand = [
    { dept: 'Engineering', roles: 42, color: '#3b82f6', pct: 90 },
    { dept: 'Sales', roles: 24, color: '#8b5cf6', pct: 51 },
    { dept: 'Customer Support', roles: 18, color: '#f59e0b', pct: 38 },
    { dept: 'Marketing', roles: 8, color: '#10b981', pct: 17 },
    { dept: 'HR', roles: 3, color: '#ef4444', pct: 7 },
  ];

  const allocationLegend = [
    { label: 'Engineering (45%)', color: '#3b82f6' },
    { label: 'Sales (25%)', color: '#8b5cf6' },
    { label: 'Support (15%)', color: '#f59e0b' },
    { label: 'Marketing (10%)', color: '#10b981' },
    { label: 'HR (5%)', color: '#ef4444' },
  ];

  const filteredRoles = roleData.filter(r => 
    r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const currentItems = filteredRoles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const triggerAction = (actionName) => {
    setToastMessage(`${actionName} action initiated for ${currentTenant}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans">
      {/* 1. Sidebar with Tenant context */}
      <HRSidebar currentTenant={currentTenant} currentScreen="Workforce Planning" />

      <main className="flex-1 ml-80 p-10 max-w-[1600px] mx-auto space-y-8 relative">
        
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles, departments..." 
                className="w-80 pl-11 pr-4 py-2.5 bg-[#f3f4f6]/60 rounded-xl text-sm font-semibold text-slate-700 outline-none border border-transparent focus:border-blue-500/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all" 
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer" onClick={() => triggerAction("Profile View")}>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" alt="profile" />
            </div>
          </div>
        </header>

        {/* --- SECTION 2: TOP METRICS CARDS --- */}
        <div className="grid grid-cols-4 gap-6">
          <MetricCard title="Total Workforce" value="1,284" trend="+4.2% vs last quarter" trendColor="text-emerald-500" icon={<Users className="text-blue-500" size={20} />} iconBg="bg-blue-50" />
          <MetricCard title="Projected Need (6m)" value="1,356" trend="+72 employees needed" trendColor="text-purple-500" icon={<TrendingUp className="text-purple-500" size={20} />} iconBg="bg-purple-50" />
          <MetricCard title="Current Hiring Pipeline" value="48" trend="Active candidates in process" trendColor="text-slate-400" icon={<Briefcase className="text-emerald-500" size={20} />} iconBg="bg-emerald-50" />
          <MetricCard title="Workforce Risk Level" value="Medium" trend="Critical skill gaps detected" trendColor="text-amber-500" valueColor="text-amber-500" icon={<AlertTriangle className="text-amber-500" size={20} />} iconBg="bg-amber-50" />
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
          <WorkforceLineChart />
        </div>

        {/* --- SECTION 4: HIRING DEMAND & DONUT DISTRIBUTION --- */}
        <div className="grid grid-cols-2 gap-8">
          {/* Hiring Demand */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Hiring Demand by Department</h3>
            <div className="space-y-4">
              {hiringDemand.map((d) => (
                <div key={d.dept} className="cursor-pointer group" onClick={() => triggerAction(`${d.dept} Hiring Demand`)}>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5 group-hover:text-blue-600 transition-colors">
                    <span>{d.dept}</span>
                    <span className="text-slate-400">{d.roles} open roles</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workforce Allocation */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Workforce Allocation Distribution</h3>
            <div className="flex items-center gap-8">
              <DonutChart />
              <div className="space-y-3">
                {allocationLegend.map((l) => (
                  <div key={l.label} className="flex items-center gap-3 text-xs font-bold text-slate-600 cursor-pointer hover:text-slate-900 transition-colors" onClick={() => triggerAction(`${l.label} Details`)}>
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 5: ROLE-BASED DEMAND TABLE --- */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Role-Based Workforce Demand</h3>
            <div className="flex gap-3">
              <button onClick={() => triggerAction("Filter Roles")} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"><Filter size={14}/> Filter</button>
              <button onClick={() => triggerAction("Sort Roles")} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"><SlidersHorizontal size={14}/> Sort</button>
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
                AI predicts Engineering workforce demand will increase by <span className="text-white font-bold">18%</span> within 6 months due to upcoming product expansion. Early recruitment for Senior Software Engineers and Data Analysts is recommended to prevent project delays.
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
            <QuickAction onClick={() => triggerAction("Reallocation Planning")} icon={<Target className="text-blue-500"/>} label="Reallocate Headcount" />
            <QuickAction onClick={() => triggerAction("Hiring Pipeline Sync")} icon={<Briefcase className="text-purple-500"/>} label="Sync Recruitment Goals" />
            <QuickAction onClick={() => triggerAction("Report Export")} icon={<FileText className="text-emerald-500"/>} label="Export Planning Report" />
          </div>
        </div>

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
                  <span className="font-semibold text-slate-600">Engineering Surge</span>
                  <span className="font-bold text-slate-900">+25 Senior Engineers</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Estimated Hiring Buffer</span>
                  <span className="font-bold text-slate-900">45 Days</span>
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