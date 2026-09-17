import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight, 
  FileDown, 
  SlidersHorizontal,
  AlertTriangle,
  BrainCircuit,
  Building,
  ChevronLeft,
  X,
  Filter,
  Loader2
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { hrAPI } from '../services/api';

// ── Compliance Trend Line Chart (SVG) ─────────────────────────────────────────
const ComplianceTrendChart = () => {
  const months = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
  const values = [78, 80, 82, 87, 91, 94];
  const W = 460, H = 200, padL = 10, padR = 10, padT = 10, padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const minV = 70, maxV = 100;

  const xPos = (i) => padL + (i / (values.length - 1)) * chartW;
  const yPos = (v) => padT + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const linePath = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yPos(v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${xPos(values.length - 1).toFixed(1)} ${(padT + chartH).toFixed(1)} L ${xPos(0).toFixed(1)} ${(padT + chartH).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#compGrad)" />
      <motion.path 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        d={linePath} 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {months.map((m, i) => (
        <text key={m} x={xPos(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="600" fontFamily="sans-serif">{m}</text>
      ))}
    </svg>
  );
};

// ── Status Donut Chart ────────────────────────────────────────────────────────
const StatusDonut = ({ compliantPct = 94, expiringPct = 4, nonCompliantPct = 2, totalCount = 0 }) => {
  const totalPct = (compliantPct + expiringPct + nonCompliantPct) || 1;
  const segments = [
    { pct: (compliantPct / totalPct) * 100, color: '#10b981' }, // Compliant
    { pct: (expiringPct / totalPct) * 100, color: '#f59e0b' },  // Expiring Soon
    { pct: (nonCompliantPct / totalPct) * 100, color: '#ef4444' },  // Non-Compliant
  ];
  const r = 65, cx = 85, cy = 85, stroke = 16;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width="170" height="170" viewBox="0 0 170 170">
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
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="900" fill="#0f172a" fontFamily="sans-serif">{totalCount}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8" fontFamily="sans-serif">Total Records</text>
    </svg>
  );
};

// ── Timeline Dot Indicator ────────────────────────────────────────────────────
const TimelineDot = ({ color }) => (
  <div className="flex flex-col items-center" style={{ width: 14 }}>
    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ background: color }} />
    <div className="w-0.5 flex-1 mt-1 bg-slate-200" style={{ minHeight: 48 }} />
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const ComplianceManagement = () => {
  // Multi-Tenant Context & Interactive State
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentTenant = storedUser.tenant?.name || "Organization";
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [complianceState, setComplianceState] = useState(null);

  const itemsPerPage = 3;

  useEffect(() => {
    let isMounted = true;
    const fetchCompliance = async () => {
      setLoading(true);
      try {
        const res = await hrAPI.getCompliance();
        if (isMounted && res?.success) {
          setComplianceState(res);
        }
      } catch (err) {
        console.warn('Failed to fetch compliance status:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCompliance();
    return () => { isMounted = false; };
  }, []);

  // --- DERIVED FROM DB: certification timeline from compliance items ---
  const certTimeline = React.useMemo(() => {
    if (!complianceState?.data) return [];
    return complianceState.data.slice(0, 5).map((item) => {
      const isExpired  = item.status === 'EXPIRED' || item.status === 'NON_COMPLIANT';
      const isPending  = item.status === 'PENDING';
      const dotColor   = isExpired ? '#ef4444' : isPending ? '#f59e0b' : '#10b981';
      const statusText = isExpired ? 'Renew Certification' : isPending ? 'Expires soon' : 'Status: Valid';
      return {
        title:       item.certificationName || item.type || 'Certification',
        person:      item.user ? `${item.user.firstName} ${item.user.lastName}` : (item.userId || 'Employee'),
        dept:        item.user?.department?.name || item.department || 'General',
        date:        item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
        statusText,
        statusColor:  isExpired ? 'text-red-500' : isPending ? 'text-amber-500' : 'text-emerald-500',
        dotColor,
        bgColor:      isExpired ? 'bg-red-50/50'     : isPending ? 'bg-amber-50/50'  : 'bg-emerald-50/50',
        borderColor:  isExpired ? 'border-red-200'   : isPending ? 'border-amber-200': 'border-emerald-200',
        titleColor:   isExpired ? 'text-red-600'     : isPending ? 'text-amber-600'  : 'text-emerald-700',
      };
    });
  }, [complianceState]);

  // --- DERIVED FROM DB: employee compliance rows ---
  const employeeData = React.useMemo(() => {
    if (!complianceState?.data) return [];
    return complianceState.data.map((item, idx) => {
      const isExpired  = item.status === 'EXPIRED' || item.status === 'NON_COMPLIANT';
      const isPending  = item.status === 'PENDING';
      const statusLabel    = isExpired ? 'Non-Compliant' : isPending ? 'Expiring Soon' : 'Compliant';
      const statusStyle    = isExpired
        ? 'bg-red-50 text-red-600 border border-red-200'
        : isPending
        ? 'bg-amber-50 text-amber-600 border border-amber-200'
        : 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      const dotColor       = isExpired ? '#ef4444' : isPending ? '#f59e0b' : '#10b981';
      // Deterministic score calculation
      const score = isExpired ? 45 : isPending ? 72 : 98;
      const initials = item.user?.firstName ? `${item.user.firstName[0]}${item.user.lastName ? item.user.lastName[0] : ''}` : 'EM';
      
      return {
        id:          item.id || idx + 1,
        name:        item.user ? `${item.user.firstName} ${item.user.lastName}` : (item.userId || `Employee ${idx + 1}`),
        dept:        item.user?.department?.name || item.department || 'General',
        cert:        item.certificationName || item.type || 'Certification',
        status:      statusLabel,
        statusStyle,
        dotColor,
        expiry:      item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
        score,
        scoreColor:  isExpired ? 'text-red-500' : 'text-slate-800',
        initials,
      };
    });
  }, [complianceState]);

  // Unique departments for filter dropdown
  const uniqueDepartments = React.useMemo(() => {
    return Array.from(new Set(employeeData.map(e => e.dept).filter(Boolean)));
  }, [employeeData]);

  // --- COMPUTE STATISTICS DYNAMICALLY FROM DATABASE VALUES ---
  const totalRecords = complianceState?.data?.length || 0;
  const compliantCount = complianceState?.data ? complianceState.data.filter(r => r.status === 'COMPLIANT').length : 0;
  const expiringCount = complianceState?.data ? complianceState.data.filter(r => r.status === 'PENDING').length : 0;
  const nonCompliantCount = complianceState?.data ? complianceState.data.filter(r => r.status === 'EXPIRED' || r.status === 'NON_COMPLIANT').length : 0;

  const overallComplianceRate = complianceState?.summary?.overallCompliancePct ?? (totalRecords ? Math.round((compliantCount / totalRecords) * 100) : 100);
  const compliantPct = totalRecords ? Math.round((compliantCount / totalRecords) * 100) : 100;
  const expiringPct = totalRecords ? Math.round((expiringCount / totalRecords) * 100) : 0;
  const nonCompliantPct = totalRecords ? Math.round((nonCompliantCount / totalRecords) * 100) : 0;

  const triggerAction = (actionName) => {
    setToastMessage(`${actionName} action initiated for ${currentTenant}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCSV = () => {
    if (!employeeData.length) {
      setToastMessage("No compliance records available to export.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const headers = ["Employee Name", "Department", "Certification", "Status", "Expiry Date", "Compliance Score"];
    const rows = employeeData.map(e => [
      `"${e.name}"`,
      `"${e.dept}"`,
      `"${e.cert}"`,
      `"${e.status}"`,
      `"${e.expiry}"`,
      `"${e.score}%"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentTenant.replace(/\s+/g, '_')}_Compliance_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Compliance report downloaded for ${currentTenant}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredEmployees = React.useMemo(() => {
    let result = employeeData.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.cert.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (departmentFilter !== "ALL") {
      result = result.filter(e => e.dept === departmentFilter);
    }

    return result;
  }, [employeeData, searchQuery, departmentFilter]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentItems = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans">
      {/* Sidebar with Tenant Context */}
      <HRSidebar currentTenant={currentTenant} currentScreen="Compliance Management" />

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

        {/* ── LOADING STATE ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={36} className="animate-spin text-blue-500" />
            <p className="text-slate-400 text-sm font-semibold">Loading compliance data from database...</p>
          </div>
        ) : (
        <>

        {/* ── HEADER ── */}
        <header className="flex justify-between items-center bg-white p-4 -mt-2 -mx-4 rounded-2xl border border-slate-100 shadow-sm mb-4">
          <div>
            <h1 className="text-2xl font-black text-[#0b1221] tracking-tight flex items-center gap-3">
              Compliance Management
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 tracking-normal">
                <Building size={14} className="text-slate-400" />
                {currentTenant}
              </span>
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Certification tracking and workforce compliance monitoring</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search compliance, roles..." 
                className="w-80 pl-11 pr-4 py-2.5 bg-[#f3f4f6]/60 rounded-xl text-sm font-semibold text-slate-700 outline-none border border-transparent focus:border-blue-500/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all" 
              />
            </div>
            <button 
              onClick={() => triggerAction("Notifications View")}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 transition-colors"
            >
              <Bell size={18} className="text-slate-600" />
              {expiringCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" />}
            </button>
            <div 
              className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm cursor-pointer" 
              onClick={() => triggerAction("Profile View")}
            >
              {storedUser.firstName ? `${storedUser.firstName[0]}${storedUser.lastName ? storedUser.lastName[0] : ''}` : 'HR'}
            </div>
          </div>
        </header>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-4 gap-6">
          {/* Overall Compliance Rate */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Overall Compliance Rate</p>
              <p className="text-3xl font-black text-slate-900">{overallComplianceRate}%</p>
              <p className={`text-xs mt-2 font-bold ${overallComplianceRate >= 80 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {overallComplianceRate >= 80 ? '▲ Stable' : '▼ Action Required'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
          </div>

          {/* Expiring */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expiring (30 days)</p>
              <p className="text-3xl font-black text-slate-900">{expiringCount}</p>
              <p className="text-xs mt-2 text-amber-500 font-bold">Attention required</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-amber-500" />
            </div>
          </div>

          {/* Non-Compliant */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Non-Compliant</p>
              <p className="text-3xl font-black text-red-500">{nonCompliantCount}</p>
              <p className="text-xs mt-2 text-slate-400 font-semibold">Requires re-certification</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <XCircle size={18} className="text-red-500" />
            </div>
          </div>

          {/* Compliance Trend */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Compliance Trend</p>
              <p className="text-3xl font-black text-slate-900">+{overallComplianceRate}%</p>
              <p className="text-xs mt-2 text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-black">✓</span>
                Live DB calculated rate
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={18} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* ── STATUS DISTRIBUTION + TREND CHART ── */}
        <div className="grid grid-cols-2 gap-8">
          {/* Compliance Status Distribution */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Compliance Status Distribution</h3>
            <div className="flex items-center gap-8">
              <StatusDonut 
                compliantPct={compliantPct} 
                expiringPct={expiringPct} 
                nonCompliantPct={nonCompliantPct} 
                totalCount={totalRecords} 
              />
              <div className="space-y-4">
                <div className="flex items-start gap-3 cursor-pointer group" onClick={() => triggerAction("Filter Compliant")}>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Compliant</p>
                    <p className="text-xs text-slate-400 font-semibold">{compliantCount} Records ({compliantPct}%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 cursor-pointer group" onClick={() => triggerAction("Filter Expiring Soon")}>
                  <span className="w-3 h-3 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Expiring Soon</p>
                    <p className="text-xs text-slate-400 font-semibold">{expiringCount} Records ({expiringPct}%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 cursor-pointer group" onClick={() => triggerAction("Filter Non-Compliant")}>
                  <span className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-red-600 transition-colors">Non-Compliant</p>
                    <p className="text-xs text-slate-400 font-semibold">{nonCompliantCount} Records ({nonCompliantPct}%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Trend Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Compliance Trend (12 Months)</h3>
              <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-slate-100 text-slate-500 uppercase tracking-wider">Overall Rate</span>
            </div>
            <ComplianceTrendChart />
          </div>
        </div>

        {/* ── CERTIFICATION EXPIRY TIMELINE ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Certification Expiry Timeline</h3>
            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"/>Valid</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"/>Expiring</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"/>Expired</span>
            </div>
          </div>

          {certTimeline.length > 0 ? (
            <div className="space-y-0">
              {certTimeline.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <TimelineDot color={item.dotColor} />
                  <div className={`flex-1 mb-4 p-5 rounded-2xl border ${item.bgColor} ${item.borderColor}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm font-bold ${item.titleColor}`}>{item.title}</p>
                        <p className="text-xs font-semibold mt-1" style={{ color: item.dotColor }}>
                          {item.person} <span className="text-slate-400">• {item.dept}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg bg-white border ${item.borderColor} text-slate-600 shadow-xs`}>{item.date}</span>
                        <p className={`text-xs font-black mt-2 ${item.statusColor}`}>{item.statusText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-400 text-center py-4">No certification timeline items available.</p>
          )}
        </div>

        {/* ── EMPLOYEE CERTIFICATION COMPLIANCE TABLE ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Employee Certification Compliance</h3>
            <div className="flex items-center gap-3 relative">
              {/* Department Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)} 
                  className={`inline-flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-colors ${departmentFilter !== "ALL" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  <Filter size={14} /> {departmentFilter === "ALL" ? "Filter By Dept" : departmentFilter}
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

              {/* Export CSV/PDF Button */}
              <button 
                onClick={handleExportCSV} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <FileDown size={14} /> Export Report
              </button>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="py-4 px-8">Employee Name</th>
                <th className="py-4 px-8">Department</th>
                <th className="py-4 px-8">Certification</th>
                <th className="py-4 px-8">Status</th>
                <th className="py-4 px-8">Expiry Date</th>
                <th className="py-4 px-8 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length > 0 ? (
                currentItems.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors text-sm">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200">
                          {emp.initials}
                        </div>
                        <span className="font-bold text-slate-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8 font-semibold text-blue-600">{emp.dept}</td>
                    <td className="py-5 px-8 font-semibold text-slate-700">{emp.cert}</td>
                    <td className="py-5 px-8">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${emp.statusStyle}`}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: emp.dotColor }}/>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 font-semibold text-slate-500">{emp.expiry}</td>
                    <td className={`py-5 px-8 font-black text-right ${emp.scoreColor}`}>{emp.score}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-sm font-semibold">
                    No compliance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 🔄 PAGINATION FOOTER */}
          <div className="p-6 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-500 border-t border-slate-100">
            <div>
              Showing <span className="text-slate-900">{filteredEmployees.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</span> of <span className="text-slate-900">{filteredEmployees.length}</span> entries
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

        {/* ── AI COMPLIANCE RISK INSIGHT BANNER ── */}
        <div className="bg-[#0b1221] rounded-2xl p-8 text-white flex justify-between items-center shadow-2xl relative overflow-hidden group">
          <div className="flex gap-6 items-center relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <BrainCircuit size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-xl font-bold tracking-tight">AI Compliance Risk Insight</h4>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                  {overallComplianceRate >= 80 ? "Low Risk" : "Action Required"}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                {expiringCount > 0 || nonCompliantCount > 0 
                  ? `AI predicts compliance vulnerability across ${currentTenant} due to ${expiringCount + nonCompliantCount} pending/expired certification records. Early renewal notifications are recommended.`
                  : `All compliance certification records for ${currentTenant} are fully verified and up to date.`}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsRiskModalOpen(true)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 relative z-10 flex-shrink-0"
          >
            View Risk Details
          </button>
        </div>

        {/* ── BOTTOM ALERT CARDS ── */}
        <div className="grid grid-cols-2 gap-8">
          <div 
            onClick={() => triggerAction("Critical Expirations View")}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertTriangle className="text-red-500" size={22} />
              </div>
              <div>
                <p className="text-base font-black text-red-500">{nonCompliantCount} Critical Expirations</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Employees with expired core certifications</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div 
            onClick={() => triggerAction("Renewal Alerts View")}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bell size={22} className="text-amber-500" />
              </div>
              <div>
                <p className="text-base font-black text-amber-500">{expiringCount} Renewal Alerts</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Certifications expiring within 30 days</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        </>
        )}

      </main>

      {/* AI Risk Modal Portal Context */}
      <AnimatePresence>
        {isRiskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsRiskModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Compliance Risk Analysis</h2>
              <p className="text-slate-500 text-sm mb-6">
                AI evaluation of active compliance thresholds and renewal statuses in {currentTenant}.
              </p>
              <div className="space-y-3 mb-8">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Organization</span>
                  <span className="font-bold text-slate-900">{currentTenant}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Pending Expirations</span>
                  <span className="font-bold text-amber-600">{expiringCount + nonCompliantCount} Certifications</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Overall Rate</span>
                  <span className="font-bold text-emerald-600">{overallComplianceRate}%</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  triggerAction("Auto-Reminders Sent");
                  setIsRiskModalOpen(false);
                }}
                className="w-full py-3 bg-[#0b1221] hover:bg-[#16233d] text-white rounded-xl font-bold transition-colors"
              >
                Send Automated Renewal Reminders
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ComplianceManagement;