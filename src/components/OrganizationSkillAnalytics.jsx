import React, { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  SlidersHorizontal,
  BrainCircuit,
  Map,
  FileText,
  Target,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';
import HRSidebar from './HRSidebar'; 
import { motion, AnimatePresence } from 'framer-motion';

const OrganizationSkillAnalytics = () => {
  // Multi-tenant & Global State
  const [currentTenant] = useState("Enterprise Corp");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive UI States
  const [currentPage, setCurrentPage] = useState(1);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const itemsPerPage = 3;

  // Mock Data for Table
  const employeeGaps = [
    { id: 1, name: 'Marcus Thorne', dept: 'Engineering', skill: 'System Design', score: '2 / 5', severity: 'CRITICAL', rec: 'Advanced System Arch. Workshop' },
    { id: 2, name: 'Elena Rodriguez', dept: 'Product', skill: 'Data Analytics', score: '3 / 4', severity: 'MODERATE', rec: 'Python for Data Science Path' },
    { id: 3, name: 'Samir Gupta', dept: 'Operations', skill: 'Cloud Security', score: '4 / 5', severity: 'LOW', rec: 'AWS Security Specialization' },
    { id: 4, name: 'John Doe', dept: 'Engineering', skill: 'React Patterns', score: '1 / 5', severity: 'CRITICAL', rec: 'React Performance Course' },
    { id: 5, name: 'Jane Smith', dept: 'Marketing', skill: 'SEO', score: '2 / 4', severity: 'LOW', rec: 'Advanced Google Analytics' },
  ];

  // Heatmap Data Logic
  const heatmapSkills = ['React', 'Node.js', 'AWS', 'Python', 'UX Design', 'SQL', 'Docker'];
  const heatmapEmployees = [
    { name: 'Alex Rivera', gaps: [1, 2, 0, 1, 0, 1, 2] }, // 0: Green, 1: Orange, 2: Red
    { name: 'Jordan Smith', gaps: [2, 1, 2, 0, 1, 0, 1] },
    { name: 'Casey Chen', gaps: [1, 0, 1, 2, 0, 2, 0] },
    { name: 'Taylor Swift', gaps: [0, 2, 0, 1, 2, 1, 0] },
  ];

  // Filtered & Paginated Data
  const filteredEmployees = employeeGaps.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentItems = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const triggerAction = (actionName) => {
    setToastMessage(`${actionName} action initiated for ${currentTenant}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans">
      {/* 1. Sidebar with Tenant prop */}
      <HRSidebar currentTenant={currentTenant} currentScreen="Skill Analytics" />

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
              Skill Gap Analysis
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 tracking-normal">
                <Building size={14} className="text-slate-400" />
                {currentTenant}
              </span>
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Analyze workforce skill deficiencies and identify training priorities</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employees, skills..." 
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
          <MetricCard title="Employees with Skill Gaps" value="54" />
          <MetricCard title="Critical Skill Gaps" value="17" trend="+3 vs last month" trendColor="text-rose-500" badge="Critical" badgeBg="bg-rose-500" />
          <MetricCard title="Moderate Skill Gaps" value="26" trend="-5 vs last month" trendColor="text-emerald-500" badge="Moderate" badgeBg="bg-amber-500" />
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workforce Match Score</p>
              <h4 className="text-3xl font-black text-slate-900 mt-2">76%</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-1">Enterprise standard: 85%</p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <motion.path 
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: "76, 100" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-emerald-500" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="none" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: HEATMAP --- */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Workforce Skill Gap Heatmap</h3>
            <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#10b981]"></span> No Gap</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#f59e0b]"></span> Moderate</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#ef4444]"></span> Critical</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
              <div className="text-left">Employee</div>
              {heatmapSkills.map(s => <div key={s}>{s}</div>)}
            </div>
            {heatmapEmployees.map((emp, i) => (
              <div key={i} className="grid grid-cols-8 gap-4 items-center">
                <div className="text-sm font-bold text-slate-700">{emp.name}</div>
                {emp.gaps.map((g, j) => (
                  <div 
                    key={j} 
                    className={`h-8 rounded-lg ${g === 0 ? 'bg-[#10b981]' : g === 1 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'} opacity-80 hover:opacity-100 transition-all cursor-pointer hover:scale-105`}
                    onClick={() => triggerAction(`${emp.name}'s ${heatmapSkills[j]} details`)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 4: CATEGORY & DISTRIBUTION --- */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Skill Gap by Category</h3>
            <div className="space-y-6">
              <CategoryRow onClick={() => triggerAction("Backend Category View")} label="Backend Development" value="24 gaps" />
              <CategoryRow onClick={() => triggerAction("Cloud Category View")} label="Cloud Infrastructure" value="18 gaps" />
              <CategoryRow onClick={() => triggerAction("AI Category View")} label="AI / Machine Learning" value="15 gaps" />
              <CategoryRow onClick={() => triggerAction("UX Category View")} label="UX/UI Design" value="8 gaps" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Gap Severity Distribution</h3>
            <div className="flex items-center justify-between">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="60 100" />
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-60" />
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-85" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-900">124</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Total Skills</span>
                </div>
              </div>
              <div className="space-y-4 flex-1 ml-12">
                <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">No Gap</span> <span className="text-sm font-black text-[#10b981]">60%</span></div>
                <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Moderate</span> <span className="text-sm font-black text-[#f59e0b]">25%</span></div>
                <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Critical</span> <span className="text-sm font-black text-[#ef4444]">15%</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 5: EMPLOYEE GAPS TABLE --- */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Employee Skill Gap Details</h3>
            <div className="flex gap-3">
              <button onClick={() => triggerAction("Filter Menu")} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"><Filter size={14}/> Filter</button>
              <button onClick={() => triggerAction("Sort Options")} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"><SlidersHorizontal size={14}/> Sort</button>
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="py-4 px-8">Employee Name</th>
                <th className="py-4 px-8">Department</th>
                <th className="py-4 px-8">Skill Name</th>
                <th className="py-4 px-8 text-center">Current / Req</th>
                <th className="py-4 px-8 text-center">Severity</th>
                <th className="py-4 px-8">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length > 0 ? (
                currentItems.map((emp) => (
                  <tr key={emp.id} className="text-sm hover:bg-slate-50/30 transition-colors">
                    <td className="py-5 px-8 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-bold text-slate-900">{emp.name}</span>
                    </td>
                    <td className="py-5 px-8 text-slate-500 font-semibold">{emp.dept}</td>
                    <td className="py-5 px-8 text-slate-900 font-bold">{emp.skill}</td>
                    <td className="py-5 px-8 text-center font-black text-slate-600">{emp.score}</td>
                    <td className="py-5 px-8 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black border ${
                        emp.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        emp.severity === 'MODERATE' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>{emp.severity}</span>
                    </td>
                    <td className="py-5 px-8 text-slate-400 font-medium italic">{emp.rec}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-sm font-semibold">
                    No employee records match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* 🔄 PAGINATION FOOTER */}
          <div className="p-6 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-500">
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

        {/* --- SECTION 6: AI INSIGHT --- */}
        <div className="bg-[#0b1221] rounded-2xl p-8 text-white flex justify-between items-center shadow-2xl relative overflow-hidden group">
          <div className="flex gap-6 items-center relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold tracking-tight">AI Skill Gap Insight</h4>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">Backend, Cloud, and AI skills show highest gap levels across workforce. Training recommended for backend and cloud skill improvement to meet upcoming Q3 project requirements.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 relative z-10"
          >
            Assign Training
          </button>
        </div>

        {/* --- SECTION 7: TREND CHART --- */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Skill Gap Trend Over Time</h3>
            <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase">
              <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-blue-500"></span> Gap Count</div>
              <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-slate-200"></span> Target</div>
            </div>
          </div>
          
          <div className="h-48 w-full relative pt-4">
             <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 100" preserveAspectRatio="none">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d="M 0 80 Q 200 70 400 60 T 800 40 L 1000 35" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                />
                <path d="M 0 80 Q 200 85 400 82 T 800 80 L 1000 78" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" />
             </svg>
             <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-4 border-t border-slate-50 pt-2 uppercase tracking-widest">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
             </div>
          </div>
        </div>

        {/* --- SECTION 8: QUICK ACTIONS --- */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase">Quick Strategic Actions</h4>
          <div className="grid grid-cols-3 gap-6">
            <QuickAction onClick={() => triggerAction("Assign Training Workflow")} icon={<Target className="text-blue-500"/>} label="Assign Training" />
            <QuickAction onClick={() => triggerAction("Career Path Matrix")} icon={<Map className="text-indigo-500"/>} label="Career Planning" />
            <QuickAction onClick={() => triggerAction("Report Exporter")} icon={<FileText className="text-emerald-500"/>} label="Generate Report" />
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
              <h2 className="text-2xl font-black text-slate-900 mb-2">Assign Recommended Training</h2>
              <p className="text-slate-500 text-sm mb-6">
                Automatically assign targeted learning paths to employees with identified skill deficiencies in Backend, Cloud, and AI.
              </p>
              <div className="space-y-3 mb-8">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Impacted Employees</span>
                  <span className="font-bold text-slate-900">17 Critical Employees</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Target Completion</span>
                  <span className="font-bold text-slate-900">Q3 End</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  triggerAction("Automated Training Assigned");
                  setIsAIModalOpen(false);
                }}
                className="w-full py-3 bg-[#0b1221] hover:bg-[#16233d] text-white rounded-xl font-bold transition-colors"
              >
                Confirm & Dispatch Courses
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// --- MINI COMPONENTS ---
const MetricCard = ({ title, value, trend, trendColor, badge, badgeBg }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] relative hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      {badge && <span className={`text-[8px] font-black px-2 py-0.5 rounded text-white ${badgeBg}`}>{badge}</span>}
    </div>
    <div className="mt-4">
      <h4 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h4>
      {trend && <p className={`text-[10px] font-bold mt-2 ${trendColor}`}>{trend}</p>}
    </div>
  </div>
);

const CategoryRow = ({ label, value, onClick }) => (
  <div onClick={onClick} className="flex justify-between items-center group cursor-pointer">
    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{label}</span>
    <span className="text-xs font-black text-slate-400 border-b border-dashed border-slate-200 pb-1 group-hover:border-blue-300">{value}</span>
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

export default OrganizationSkillAnalytics;