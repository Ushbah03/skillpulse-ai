import React, { useState } from 'react';
import { 
  Search, Bell, HelpCircle, Download, Calendar, 
  RefreshCw, BookOpen, Sparkles, X, CheckCircle 
} from 'lucide-react';
import HRSidebar from './HRSidebar';

// ── Dept Skill Deficiency Bar Chart (SVG) ────────────────────────────────────
const DeficiencyChart = () => {
  const bars = [
    { label: 'Eng',   pct: 62, color: '#4f8ef7' },
    { label: 'Sales', pct: 88, color: '#ef4444' },
    { label: 'Prod',  pct: 52, color: '#f59e0b' },
    { label: 'Mktg',  pct: 70, color: '#4f8ef7' },
    { label: 'HR',    pct: 45, color: '#4f8ef7' },
  ];
  const W = 340, H = 180, padB = 28, padT = 10, barW = 44, gap = 20;
  const totalW = bars.length * (barW + gap) - gap;
  const startX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H + padB}`} className="w-full" style={{ height: 190 }}>
      {bars.map((b, i) => {
        const barH = (b.pct / 100) * H;
        const x = startX + i * (barW + gap);
        const y = padT + H - barH;
        return (
          <g key={i}>
            {/* Background ghost bar */}
            <rect x={x} y={padT} width={barW} height={H} rx="6" fill="#f1f5f9" />
            {/* Colored actual bar */}
            <rect x={x} y={y} width={barW} height={barH} rx="6" fill={b.color} opacity="0.85" />
            {/* Label */}
            <text 
              x={x + barW / 2} 
              y={padT + H + 18} 
              textAnchor="middle" 
              fontSize="12" 
              fill="#94a3b8" 
              fontFamily="sans-serif" 
              fontWeight="600"
            >
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Score color logic ─────────────────────────────────────────────────────────
const scoreStyle = (score) => {
  if (score < 2.0) return { bg: '#ef4444', text: 'white' };   // Critical Gap - red
  if (score < 3.5) return { bg: '#f59e0b', text: 'white' };   // Moderate - amber
  return { bg: '#22c55e', text: 'white' };                    // Proficient - green
};

// ── Custom Styled Toast Notification Component ─────────────────────────────
const ToastNotification = ({ toast, onClose }) => {
  if (!toast.visible) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-slate-200 shadow-xl rounded-2xl px-5 py-4 min-w-[320px] max-w-md animate-in slide-in-from-bottom-4 duration-200">
      <div className={`p-2 rounded-xl flex-shrink-0 ${isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
        {isSuccess ? <CheckCircle size={20} /> : <Sparkles size={20} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-slate-900">{toast.title}</p>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{toast.message}</p>
      </div>
      <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
        <X size={15} />
      </button>
    </div>
  );
};

// ── Custom Styled Modal Component ──────────────────────────────────────────
const ActionModal = ({ isOpen, title, description, confirmText, onConfirm, onClose, icon: Icon, isDanger }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isDanger ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {Icon ? <Icon size={22} /> : <BookOpen size={22} />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{title}</h3>
              <p className="text-xs text-slate-400 font-semibold">Action Confirmation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
              isDanger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const SkillGapReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedQuarter] = useState('Q3 2026');

  // UI Feedback States
  const [toast, setToast] = useState({ visible: false, title: '', message: '', type: 'info' });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', description: '', confirmText: '', onConfirm: null, icon: null });

  const showToast = (title, message, type = 'info') => {
    setToast({ visible: true, title, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const closeModal = () => setModalConfig({ isOpen: false });

  const heatmapSkills = ['CLOUD ARCH', 'DATA ANALYTICS', 'PRODUCT MGMT', 'AI LITERACY', 'UI/UX DESIGN', 'CYBERSEC'];

  const heatmapData = [
    { dept: 'Engineering', scores: [4.8, 3.2, 4.1, 1.5, 3.5, 4.6] },
    { dept: 'Marketing',   scores: [1.2, 4.5, 3.8, 2.9, 4.2, 2.1] },
    { dept: 'Product',     scores: [2.8, 4.1, 4.9, 3.1, 4.0, 3.3] },
    { dept: 'Sales',       scores: [0.8, 4.3, 3.2, 4.1, 1.2, 2.5] },
    { dept: 'HR & Ops',    scores: [1.1, 3.0, 2.8, 4.2, 2.4, 4.5] },
  ];

  const missingSkills = [
    { name: 'Generative AI Implementation',  gap: 72, color: '#ef4444', gapColor: '#ef4444' },
    { name: 'Strategic Cloud Governance',    gap: 58, color: '#f59e0b', gapColor: '#f59e0b' },
    { name: 'Advanced Predictive Analytics', gap: 42, color: '#f59e0b', gapColor: '#f59e0b' },
    { name: 'Security Operations (DevSecOps)',gap: 15, color: '#22c55e', gapColor: '#22c55e' },
  ];

  const employees = [
    { name: 'Marcus Thorne', dept: 'Engineering', role: 'Senior Dev Ops',    gap: 'Security Governance', gapStyle: 'bg-red-100 text-red-600',    icon: null,       avatar: 'https://i.pravatar.cc/40?img=68' },
    { name: 'Elena Vance',   dept: 'Product Mgmt', role: 'Lead Product Mgr', gap: 'AI Integration',      gapStyle: 'bg-amber-100 text-amber-700', icon: '🟡',       avatar: 'https://i.pravatar.cc/40?img=47' },
    { name: 'Julian Park',   dept: 'Marketing',    role: 'Growth Lead',      gap: 'Predictive Modeling', gapStyle: 'bg-red-100 text-red-600',    icon: '🔺',       avatar: 'https://i.pravatar.cc/40?img=53' },
    { name: 'Aisha Karim',   dept: 'HR & Ops',     role: 'HR Business Partner', gap: 'Cloud Fundamentals', gapStyle: 'bg-red-100 text-red-600', icon: null,        avatar: 'https://i.pravatar.cc/40?img=44' },
    { name: 'Ryan Torres',   dept: 'Sales',        role: 'Account Executive', gap: 'Data Literacy',      gapStyle: 'bg-amber-100 text-amber-700', icon: '🟡',       avatar: 'https://i.pravatar.cc/40?img=12' },
    { name: 'Sophia Lee',    dept: 'Engineering',  role: 'Backend Engineer',  gap: 'AI/ML Pipelines',    gapStyle: 'bg-red-100 text-red-600',    icon: '🔺',       avatar: 'https://i.pravatar.cc/40?img=49' },
  ];

  const filteredHeatmap = heatmapData.filter(item => 
    item.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.gap.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('Export Completed', 'Enterprise Skill Gap & Competency PDF audit generated successfully.', 'success');
    }, 1200);
  };

  const handleAssignTraining = (employeeName, skillGap) => {
    setModalConfig({
      isOpen: true,
      title: 'Assign Targeted Training',
      description: `Assign targeted curriculum for "${skillGap}" to ${employeeName}? This will enroll them into the LMS pathway and notify their direct manager.`,
      confirmText: 'Assign Training',
      icon: BookOpen,
      onConfirm: () => {
        closeModal();
        showToast('Training Assigned', `Targeted learning module assigned to ${employeeName}.`, 'success');
      }
    });
  };

  const handleLaunchCampaign = () => {
    setModalConfig({
      isOpen: true,
      title: 'Launch Enterprise Skill Campaign',
      description: 'Initiate enterprise-wide upskilling campaign across all flagged critical deficits? Training allocations will be dispatched to affected teams.',
      confirmText: 'Launch Campaign',
      icon: Sparkles,
      onConfirm: () => {
        closeModal();
        showToast('Campaign Active', 'Enterprise training campaign launched successfully.', 'info');
      }
    });
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }} className="flex min-h-screen bg-[#f8fafc]">
      <HRSidebar />

      <div className="flex-1 ml-64 overflow-auto">
        {/* ── TOP NAV / HEADER ── */}
        <header className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
            <span>HR Manager</span>
            <span className="text-slate-300">›</span>
            <span>Talent Planning</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-900 font-bold">Skill Gap Reports</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search departments or skills..."
                className="pl-9 pr-4 py-2 rounded-full bg-slate-100 text-sm text-slate-700 outline-none w-64 border border-transparent focus:border-indigo-500 focus:bg-white transition-all"
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

        <div className="px-8 py-6 space-y-6">
          {/* ── PAGE TITLE ROW ── */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Skill Gap Analysis</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Comprehensive heatmap of organizational competency and skill deficiencies across key business units.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                Tenant: Internal Corporate Domain
              </span>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm">
                <Calendar size={14} className="text-slate-500" /> {selectedQuarter}
              </button>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                Download PDF Audit
              </button>
            </div>
          </div>

          {/* ── COMPETENCY HEATMAP ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 flex justify-between items-start border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Competency Heatmap</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Showing baseline proficiency score vs organizational target requirement (1.0 - 5.0 scale)</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-rose-500 inline-block"/> Critical Gap (&lt; 2.0)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-amber-500 inline-block"/> Moderate (2.0 - 3.4)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-500 inline-block"/> Proficient (3.5+)</span>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 340 }}>
              <table className="w-full text-left min-w-[700px]">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur z-10 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider w-40">Department</th>
                    {heatmapSkills.map((skill) => (
                      <th key={skill} className="px-3 py-3 text-xs font-black text-slate-500 uppercase tracking-wider text-center">{skill}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHeatmap.length > 0 ? (
                    filteredHeatmap.map((row) => (
                      <tr key={row.dept} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 text-sm font-black text-slate-800">{row.dept}</td>
                        {row.scores.map((score, si) => {
                          const s = scoreStyle(score);
                          return (
                            <td key={si} className="px-3 py-4 text-center">
                              <span
                                className="inline-flex items-center justify-center w-12 h-9 rounded-xl text-xs font-extrabold shadow-sm"
                                style={{ background: s.bg, color: s.text }}
                              >
                                {score.toFixed(1)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={heatmapSkills.length + 1} className="text-center py-8 text-xs font-bold text-slate-400">
                        No departments found matching "{searchQuery}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── DEFICIENCY INDEX + HIGH PRIORITY MISSING SKILLS ── */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-black text-slate-900">Dept Skill Deficiency Index</h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Calculated Avg Risk
                </span>
              </div>
              <DeficiencyChart />
              <p className="text-xs text-slate-400 font-medium text-center mt-2">
                Higher percentage bars indicate a severe average gap across mandatory skill targets.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-black text-slate-900">High-Priority Missing Skills</h3>
                <button 
                  onClick={handleLaunchCampaign}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                >
                  <Sparkles size={13} /> Launch Campaign
                </button>
              </div>
              <div className="space-y-4">
                {missingSkills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-xs font-black text-slate-800">{skill.name}</p>
                      <span className="text-xs font-black" style={{ color: skill.gapColor }}>{skill.gap}% Skill Deficit</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.gap}%`, background: skill.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CRITICAL SKILL GAPS BY EMPLOYEE ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Critical Skill Gaps by Individual Employee</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">High-impact skill deficiencies flagged for targeted development</p>
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Reset Filter
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur z-10 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Current Role</th>
                    <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Identified Deficit</th>
                    <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp, i) => (
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-black text-slate-800">{emp.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{emp.dept}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-xs font-semibold text-slate-700">{emp.role}</td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full ${emp.gapStyle}`}>
                            {emp.icon && <span className="text-[10px]">{emp.icon}</span>}
                            {emp.gap}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button 
                            onClick={() => handleAssignTraining(emp.name, emp.gap)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                          >
                            <BookOpen size={13} className="text-indigo-600" />
                            Assign Training
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-xs font-bold text-slate-400">
                        No employees match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── CUSTOM DIALOGS & NOTIFICATIONS ── */}
      <ToastNotification toast={toast} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
      <ActionModal {...modalConfig} onClose={closeModal} />
    </div>
  );
};

export default SkillGapReports;