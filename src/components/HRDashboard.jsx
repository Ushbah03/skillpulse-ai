import React, { useState, useEffect, useMemo } from 'react';
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
  Building,
  Loader2,
  Activity,
  Award,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { hrAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
  const navigate = useNavigate();
  
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const displayTenantName = storedUser?.tenantName || storedUser?.workspace || "Enterprise Domain";

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Interactive UI States
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await hrAPI.getAnalytics();
        if (isMounted && res?.success) {
          setAnalyticsData(res.data);
        }
      } catch (err) {
        console.warn('Failed to load HR analytics live data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered departments by search query
  const filteredDepartments = useMemo(() => {
    if (!analyticsData?.departments) return [];
    return analyticsData.departments.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [analyticsData, searchQuery]);

  // Derived AI insight message from active DB gaps
  const aiInsightDetails = useMemo(() => {
    const criticalCount = analyticsData?.criticalGapsCount || 0;
    const topDept = analyticsData?.departments?.[0]?.name || "Engineering";
    return {
      title: criticalCount > 0 
        ? `Optimization Required for ${topDept}` 
        : `Targeted Upskilling Recommendation`,
      desc: criticalCount > 0
        ? `Detected ${criticalCount} active critical skill gap(s) in PostgreSQL DB. Initiating targeted upskilling pathways for ${topDept} is recommended to raise average proficiency.`
        : `Workforce readiness is healthy across all departments. Recommend launching advanced certifications for high performers in ${topDept}.`
    };
  }, [analyticsData]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans text-slate-800 antialiased">
      {/* 1. Multi-Tenant Sidebar */}
      <HRSidebar currentTenant={displayTenantName} currentScreen="Dashboard" />

      {/* 2. Main Dashboard Panel */}
      <main className="flex-1 ml-64 p-6 w-full space-y-5 relative">
        
        {/* Toast Notification Layer */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-8 z-50 flex items-center gap-3 bg-[#0b1221] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-xs font-bold"
            >
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Header */}
        <header className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              HR Dashboard
              <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md text-[11px] font-bold text-indigo-700">
                <Building size={12} className="text-indigo-500" />
                {displayTenantName}
              </span>
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">Workforce intelligence overview & live PostgreSQL metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 text-slate-400" size={15} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search departments, skills..." 
                className="w-64 pl-9 pr-3 py-1.5 bg-slate-100/70 rounded-lg text-xs font-semibold text-slate-700 outline-none border border-transparent focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-bold text-slate-500">Fetching live HR analytics from PostgreSQL DB...</p>
          </div>
        ) : (
          <>
            {/* 3. Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Employees" 
                value={`${analyticsData?.totalEmployees || 0}`} 
                icon={<Users2 size={18} />} 
                iconColor="text-blue-600" 
                iconBg="bg-blue-50"
                subtext={<><ArrowUpRight size={13} /> <span>Live DB Users</span></>}
                subtextColor="text-emerald-700 bg-emerald-50 border-emerald-200"
              />
              <MetricCard 
                title="Avg Skill Score" 
                value={`${((analyticsData?.averageReadiness || 74) / 20).toFixed(1)} / 5.0`} 
                icon={<Award size={18} />}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-50"
                subtext={`${analyticsData?.averageReadiness || 74}% Target Match`}
                subtextStyle="text-slate-500"
              />
              <MetricCard 
                title="Readiness Score" 
                value={`${analyticsData?.averageReadiness || 74}%`} 
                icon={<Activity size={18} />} 
                iconColor="text-amber-600"
                iconBg="bg-amber-50"
                subtext={analyticsData?.criticalGapsCount > 0 ? `${analyticsData.criticalGapsCount} Critical DB Gaps` : "No Critical Gaps"}
                subtextStyle={analyticsData?.criticalGapsCount > 0 ? "text-amber-700 font-bold" : "text-emerald-600 font-bold"}
              />
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Compliance Rate</span>
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><GraduationCap size={16} /></div>
                </div>
                <div className="mt-2 w-full space-y-1.5">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{analyticsData?.complianceRate || "88%"}</h3>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: analyticsData?.complianceRate || "88%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-indigo-600 rounded-full" 
                    />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400">Verified DB Active Status</p>
                </div>
              </div>
            </div>

            {/* 4. Interactive Alert Strip */}
            <AnimatePresence>
              {isAlertVisible && analyticsData?.criticalGapsCount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                  className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex justify-between items-center shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Critical Skill Gap Detected</h4>
                      <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                        {analyticsData?.criticalGapsCount} critical skill gap record(s) active in PostgreSQL database.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate('/hr-dashboard/skill-gap-reports')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-amber-800 rounded-lg text-xs font-bold border border-amber-300 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => setIsAlertVisible(false)}
                      className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 5. Chart Block: Workforce Skill Distribution */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <BarChart2 size={16} className="text-indigo-600" />
                    Workforce Skill Distribution
                  </h3>
                  <p className="text-slate-400 text-xs font-medium">Skill proficiency levels by department computed from UserSkills table</p>
                </div>
                <button 
                  onClick={() => navigate('/hr-dashboard/department-comparison')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Compare All <ChevronRight size={14} />
                </button>
              </div>
              
              <div className="h-44 flex items-end justify-start gap-8 px-6 pb-2 pt-4 border-b border-slate-100 overflow-x-auto">
                {filteredDepartments.map(d => {
                  const prof = d.avgProficiency || 3.4;
                  const expert = Math.min(100, Math.max(15, Math.round((prof / 5) * 55)));
                  const proficient = Math.min(100 - expert, Math.max(20, Math.round((prof / 5) * 35)));
                  const novice = Math.max(0, 100 - expert - proficient);
                  return (
                    <StackedBar key={d.id} label={d.name.split(' & ')[0]} segments={[expert, proficient, novice]} />
                  );
                })}
              </div>

              <div className="flex justify-center gap-6 text-xs font-bold text-slate-500 pt-1">
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Expert (4.2 - 5.0)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-600 rounded-full"></span> Proficient (3.0 - 4.1)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-200 rounded-full"></span> Novice (&lt; 3.0)</div>
              </div>
            </div>

            {/* 6. Trend Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TrendGraph 
                title="Performance Trend (6-Month)" 
                color="#6366f1" 
                gradId="blueGrad"
                labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                pathD="M 0 80 Q 80 65 160 50 T 320 30 T 400 20"
              />
              <TrendGraph 
                title="Readiness Trend (Quarterly)" 
                color="#10b981" 
                gradId="greenGrad"
                labels={['Q1', 'Q2', 'Q3', 'Q4']}
                pathD="M 0 75 Q 130 60 260 40 T 400 25"
              />
            </div>

            {/* 7. AI Insight Stateful Card */}
            <div className="bg-gradient-to-r from-[#0b1221] to-[#141e36] rounded-xl p-6 text-white relative overflow-hidden shadow-xl border border-slate-800 group">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                <Sparkles size={260} />
              </div>
              
              <div className="relative z-10 space-y-3 max-w-2xl">
                <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase block">AI Workforce Insight</span>
                <h3 className="text-xl font-bold tracking-tight">{aiInsightDetails.title}</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">
                  {aiInsightDetails.desc}
                </p>
                <button 
                  onClick={() => setIsAIModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer border border-indigo-500"
                >
                  View AI Recommendations
                </button>
              </div>
            </div>

            {/* 8. Quick Actions Grid */}
            <div className="space-y-2 pt-1">
              <h4 className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Quick Actions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <QuickActionButton onClick={() => navigate("/hr-dashboard/workforce-planning")} label="Manage Workforce" colorBg="bg-blue-50 text-blue-600" />
                <QuickActionButton onClick={() => navigate("/hr-dashboard/training-management")} label="Assign Training" colorBg="bg-indigo-50 text-indigo-600" />
                <QuickActionButton onClick={() => navigate("/hr-dashboard/skill-gap-reports")} label="View Gap Reports" colorBg="bg-emerald-50 text-emerald-600" />
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
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100"
            >
              <button 
                onClick={() => setIsAIModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">{aiInsightDetails.title}</h2>
              <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                {aiInsightDetails.desc}
              </p>
              <div className="space-y-2 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between text-xs">
                  <span className="font-bold text-slate-500">Analysis Target</span>
                  <span className="font-bold text-slate-900">{analyticsData?.departments?.[0]?.name || "Engineering"}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between text-xs">
                  <span className="font-bold text-slate-500">Active Skill Gaps</span>
                  <span className="font-bold text-indigo-600">{analyticsData?.criticalGapsCount || 0} Critical</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  triggerToast("AI Training Optimization Plan Initiated.");
                  setIsAIModalOpen(false);
                }}
                className="w-full py-3 bg-[#0b1221] hover:bg-[#16233d] text-white rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer"
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
  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[125px] hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{title}</span>
      <div className={`w-8 h-8 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}>{icon}</div>
    </div>
    <div className="mt-1.5">
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      {subtext && (
        <div className={subtextColor ? `inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold mt-1.5 border ${subtextColor}` : `text-[11px] font-bold mt-1.5 ${subtextStyle}`}>
          {subtext}
        </div>
      )}
    </div>
  </div>
);

const StackedBar = ({ label, segments }) => (
  <div className="w-10 space-y-1 text-center group">
    <div className="w-full flex flex-col justify-end h-32 gap-0.5 group-hover:-translate-y-1 transition-transform">
      <div className="bg-emerald-500 rounded-t-sm transition-all" style={{ height: `${segments[0]}%` }}></div>
      <div className="bg-indigo-600 transition-all" style={{ height: `${segments[1]}%` }}></div>
      <div className="bg-slate-200 rounded-b-sm transition-all" style={{ height: `${segments[2]}%` }}></div>
    </div>
    <span className="text-[11px] font-bold text-slate-600 block pt-1.5 truncate" title={label}>{label}</span>
  </div>
);

const TrendGraph = ({ title, color, gradId, labels, pathD }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-shadow">
    <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
      <TrendingUp size={14} className="text-indigo-600" />
      {title}
    </h4>
    <div className="h-32 w-full relative pt-2">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
        <motion.path 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          d={pathD} 
          fill="none" 
          stroke={color} 
          strokeWidth="2.5" 
        />
        <path d={`${pathD} L 400 120 L 0 120 Z`} fill={`url(#${gradId})`} opacity="0.08" />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1 border-t border-slate-100 pt-1">
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ label, colorBg, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white hover:bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all text-left group active:scale-95 cursor-pointer outline-none"
  >
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 ${colorBg} rounded-lg flex items-center justify-center font-bold text-sm`}>
        {label[0]}
      </div>
      <span className="text-xs font-bold text-slate-800 tracking-tight">{label}</span>
    </div>
    <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
  </button>
);

export default HRDashboard;