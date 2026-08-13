import React, { useState } from 'react';
import { 
  Users2, 
  GraduationCap, 
  AlertTriangle,
  Search,
  Bell,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2,
  Building
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import { motion, AnimatePresence } from 'framer-motion';

const HRDashboard = () => {
  // Multi-tenant & Global State
  const [currentTenant] = useState("Enterprise Corp");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive UI States
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper for demo actions
  const triggerAction = (actionName) => {
    setToastMessage(`${actionName} action initiated for ${currentTenant}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans">
      {/* 1. Multi-Tenant Sidebar */}
      <HRSidebar currentTenant={currentTenant} />

      {/* 2. Main Dashboard Panel */}
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

        {/* Global Header */}
        <header className="flex justify-between items-center bg-white p-4 -mt-2 -mx-4 rounded-2xl border border-slate-100 shadow-sm mb-4">
          <div>
            <h1 className="text-2xl font-black text-[#0b1221] tracking-tight flex items-center gap-3">
              HR Dashboard
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 tracking-normal">
                <Building size={14} className="text-slate-400" />
                {currentTenant}
              </span>
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Workforce intelligence overview & tracking</p>
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
            
            <button 
              onClick={() => triggerAction("Notifications view")}
              className="p-3 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200/60 relative transition-all active:scale-95"
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50"></span>
            </button>
          </div>
        </header>

        {/* 3. Core Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <MetricCard 
            title="Total Employees" 
            value="248" 
            icon={<Users2 size={18} />} 
            iconColor="text-blue-600" 
            iconBg="bg-blue-50"
            subtext={<><ArrowUpRight size={14} /> <span>+12 Active</span></>}
            subtextColor="text-emerald-600 bg-emerald-50 border-emerald-100"
          />
          <MetricCard 
            title="Avg Skill Score" 
            value="82%" 
            icon={<div className="w-7 h-7 rounded-full border-2 border-emerald-500" />} 
            subtext="Top 15% in Industry"
            subtextStyle="text-slate-400"
          />
          <MetricCard 
            title="Readiness Score" 
            value="79" 
            icon={<div className="w-7 h-7 rounded-full border-2 border-amber-500" />} 
            subtext="Needs attention in Backend"
            subtextStyle="text-amber-600"
          />
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400">Training Completion</span>
              <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><GraduationCap size={18} /></div>
            </div>
            <div className="mt-2 w-full space-y-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">64%</h3>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-blue-600 rounded-full" 
                />
              </div>
              <p className="text-[11px] font-bold text-slate-400 pt-0.5">12 programs pending</p>
            </div>
          </div>
        </div>

        {/* 4. Interactive Alert Strip */}
        <AnimatePresence>
          {isAlertVisible && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
              className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 flex justify-between items-center shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Critical Skill Gap Detected</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">AI detected critical skill gaps in backend and cloud skills across 17 employees.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => triggerAction("Skill Gap Details")}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-amber-700 rounded-xl text-xs font-black border border-amber-200 shadow-sm transition-all active:scale-95"
                >
                  View Details
                </button>
                <button 
                  onClick={() => setIsAlertVisible(false)}
                  className="p-2 text-amber-500 hover:bg-amber-100/50 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Chart Block (Preserved Layout, enhanced structure) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900">Workforce Skill Distribution</h3>
              <p className="text-slate-400 text-xs font-semibold">Skill proficiency levels by department</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2">•••</button>
          </div>
          
          <div className="h-56 flex items-end justify-between px-10 pb-4 pt-6 border-b border-slate-100">
            <StackedBar label="Dev" segments={[40, 35, 25]} />
            <StackedBar label="Design" segments={[20, 60, 20]} />
            <StackedBar label="Sales" segments={[15, 35, 50]} />
            <StackedBar label="Mktg" segments={[30, 40, 30]} />
            <StackedBar label="Ops" segments={[55, 25, 20]} />
            <StackedBar label="Admin" segments={[10, 20, 70]} />
          </div>

          <div className="flex justify-center gap-6 text-xs font-bold text-slate-500 pt-1">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-400 rounded-full"></span> Expert</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Proficient</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-200 rounded-full"></span> Novice</div>
          </div>
        </div>

        {/* 6. Trend Graphs */}
        <div className="grid grid-cols-2 gap-6">
          <TrendGraph 
            title="Performance Trend" 
            color="#3b82f6" 
            gradId="blueGrad"
            labels={['Jan', 'Mar', 'May', 'Jul', 'Sep']}
            pathD="M 0 100 Q 100 80 200 40 T 400 20"
          />
          <TrendGraph 
            title="Readiness Trend" 
            color="#10b981" 
            gradId="greenGrad"
            labels={['Q1', 'Q2', 'Q3', 'Q4']}
            pathD="M 0 70 Q 100 75 200 50 T 400 30"
          />
        </div>

        {/* 7. AI Insight Stateful Card */}
        <div className="bg-gradient-to-r from-[#0d1527] to-[#16223f] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl border border-slate-900 group">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 group-hover:rotate-12 transition-transform duration-700">
            <Sparkles size={300} />
          </div>
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase block">AI Workforce Insight</span>
            <h3 className="text-2xl font-black tracking-tight">Suggested Training Optimization</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Based on project velocity and error rates in the last sprint, introducing a <b className="text-slate-200">"Advanced Typescript Patterns"</b> workshop could improve engineering output by estimated 14%. 8 Senior Engineers would benefit immediately.
            </p>
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="px-5 py-2.5 bg-white text-[#0f172a] hover:bg-slate-100 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95"
            >
              View AI Insights
            </button>
          </div>
        </div>

        {/* 8. Quick Actions */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase">Quick Actions</h4>
          <div className="grid grid-cols-3 gap-6">
            <QuickActionButton onClick={() => triggerAction("Employee Manager")} label="Manage Employees" colorBg="bg-blue-50 text-blue-600" />
            <QuickActionButton onClick={() => triggerAction("Training Portal")} label="Assign Training" colorBg="bg-indigo-50 text-indigo-600" />
            <QuickActionButton onClick={() => triggerAction("Report Generator")} label="View Reports" colorBg="bg-emerald-50 text-emerald-600" />
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
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">AI Implementation Plan</h2>
              <p className="text-slate-500 text-sm mb-6">
                Executing the "Advanced Typescript Patterns" workshop will directly impact sprint velocity.
              </p>
              <div className="space-y-3 mb-8">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Target Audience</span>
                  <span className="font-bold text-slate-900">8 Senior Engineers</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Estimated Duration</span>
                  <span className="font-bold text-slate-900">4 Hours</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  triggerAction("AI Training Plan Enrolled");
                  setIsAIModalOpen(false);
                }}
                className="w-full py-3 bg-[#0b1221] hover:bg-[#16233d] text-white rounded-xl font-bold transition-colors"
              >
                Approve & Execute Workflow
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

/* Sub-components for cleaner rendering */
const MetricCard = ({ title, value, icon, iconColor = "", iconBg = "", subtext, subtextColor = "", subtextStyle = "" }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <span className="text-xs font-bold text-slate-400">{title}</span>
      {typeof icon === 'object' && !icon.props ? icon : (
        <div className={`w-9 h-9 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center`}>{icon}</div>
      )}
    </div>
    <div className="mt-2">
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      {subtext && (
        <div className={subtextColor ? `inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold mt-2 border ${subtextColor}` : `text-xs font-bold mt-2 ${subtextStyle}`}>
          {subtext}
        </div>
      )}
    </div>
  </div>
);

const StackedBar = ({ label, segments }) => (
  <div className="w-12 space-y-1 text-center group">
    <div className="w-full flex flex-col justify-end h-36 gap-0.5 group-hover:-translate-y-1 transition-transform">
      <div className="bg-emerald-400 rounded-t-sm transition-all" style={{ height: `${segments[0]}%` }}></div>
      <div className="bg-blue-500 transition-all" style={{ height: `${segments[1]}%` }}></div>
      <div className="bg-slate-200 rounded-b-sm transition-all" style={{ height: `${segments[2]}%` }}></div>
    </div>
    <span className="text-xs font-bold text-slate-400 block pt-2">{label}</span>
  </div>
);

const TrendGraph = ({ title, color, gradId, labels, pathD }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
    <h4 className="text-sm font-black text-slate-900">{title}</h4>
    <div className="h-40 w-full relative pt-4">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
        <motion.path 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={pathD} 
          fill="none" 
          stroke={color} 
          strokeWidth="2.5" 
        />
        <path d={`${pathD} L 400 120 L 0 120 Z`} fill={`url(#${gradId})`} opacity="0.06" />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 border-t border-slate-50 pt-1">
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ label, colorBg, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white hover:bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all text-left group active:scale-95 outline-none focus:border-blue-200"
  >
    <div className="flex items-center gap-4">
      <div className={`w-11 h-11 ${colorBg} rounded-xl flex items-center justify-center font-bold text-lg`}>
        {label[0]}
      </div>
      <span className="text-sm font-black text-slate-800 tracking-tight">{label}</span>
    </div>
    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
  </button>
);

export default HRDashboard;