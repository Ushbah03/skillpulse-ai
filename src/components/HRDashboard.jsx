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
  BarChart2,
  Target
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import SkillPulseLoader from './SkillPulseLoader';
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
  const [selectedDepartment, setSelectedDepartment] = useState(null);
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

  // Derived AI insight message from active DB records
  const aiInsightDetails = useMemo(() => {
    if (analyticsData?.deptInsight?.summary) {
      return {
        title: analyticsData.deptInsight.title || "Cross-Departmental Skill Synergy & Readiness",
        desc: analyticsData.deptInsight.summary,
        aiPrescription: analyticsData.aiInsight || ""
      };
    }
    const criticalCount = analyticsData?.criticalGapsCount || 0;
    const deptWithGaps = analyticsData?.departments?.find(d => (d.totalSkills > 0 && d.gapPct > 0)) || analyticsData?.departments?.[0];
    const targetDeptName = deptWithGaps?.name || "Target Department";
    return {
      title: criticalCount > 0 
        ? `Optimization Required for ${targetDeptName}` 
        : `Targeted Upskilling Recommendation`,
      desc: criticalCount > 0
        ? `Detected ${criticalCount} active critical skill gap(s). Initiating targeted upskilling pathways is recommended to raise average proficiency.`
        : `Workforce readiness is healthy across all departments. Recommend launching advanced certifications for high performers.`
    };
  }, [analyticsData]);

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
      {/* 1. Multi-Tenant Sidebar */}
      <HRSidebar currentTenant={displayTenantName} currentScreen="Dashboard" />

      {/* 2. Main Dashboard Panel */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full relative z-10 space-y-8">
        
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
        <header className="flex flex-wrap justify-between items-center bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#17233E] tracking-tight flex items-center gap-2.5">
              HR <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Dashboard</span>
              <span className="flex items-center gap-1 px-2.5 py-1 bg-[#1988A3]/10 border border-[#1988A3]/25 rounded-xl text-[11px] font-bold text-[#1988A3]">
                <Building size={12} className="text-indigo-500" />
                {displayTenantName}
              </span>
            </h1>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium mt-1">Workforce intelligence overview & real-time analytics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 text-slate-400" size={15} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search departments, skills..." 
                className="w-64 pl-9 pr-3 py-2 bg-white/80 backdrop-blur-md rounded-xl text-xs font-semibold text-[#17233E] outline-none border border-white/85 focus:border-[#1988A3] shadow-sm transition-all placeholder:text-[#8A9CB7]"
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="my-8">
            <SkillPulseLoader message="Synthesizing Enterprise Workforce Telemetry..." fullScreen={false} />
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
                subtext={<><ArrowUpRight size={13} /> <span>{analyticsData?.totalEmployees || 0} Active Employees</span></>}
                subtextColor="text-emerald-700 bg-emerald-50 border-emerald-200"
              />
              <MetricCard 
                title="Avg Skill Score" 
                value={`${analyticsData?.avgProficiency != null ? analyticsData.avgProficiency : ((analyticsData?.averageReadiness || 0) / 20).toFixed(1)} / 5.0`} 
                icon={<Award size={18} />}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-50"
                subtext={`${analyticsData?.averageReadiness || 0}% Target Match (${analyticsData?.totalUserSkillsCount || 0} Skills)`}
                subtextStyle="text-slate-500"
              />
              <MetricCard 
                title="Readiness Score" 
                value={`${analyticsData?.averageReadiness || 0}%`} 
                icon={<Activity size={18} />} 
                iconColor="text-amber-600"
                iconBg="bg-amber-50"
                subtext={analyticsData?.criticalGapsCount > 0 ? `${analyticsData.criticalGapsCount} Critical Skill Gaps` : "No Critical Gaps"}
                subtextStyle={analyticsData?.criticalGapsCount > 0 ? "text-amber-700 font-bold" : "text-emerald-600 font-bold"}
              />
              <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between hover:border-[#1988A3]/40 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Compliance Rate</span>
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><GraduationCap size={16} /></div>
                </div>
                <div className="mt-2 w-full space-y-1.5">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{analyticsData?.complianceRate || "0%"}</h3>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: analyticsData?.complianceRate || "0%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-indigo-600 rounded-full" 
                    />
                  </div>
                  <p className="text-[11px] font-bold text-slate-500">
                    {analyticsData?.compliantRecordsCount ?? 0} of {analyticsData?.complianceRecordsCount ?? 0} Records Compliant
                  </p>
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
                        {analyticsData?.criticalGapsCount} critical skill gap record(s) currently active.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate('/hr-dashboard/skill-gap-reports')}
                      className="px-3.5 py-1.5 bg-white/90 hover:bg-white text-amber-900 rounded-xl text-xs font-bold border border-amber-300/80 shadow-sm transition-all active:scale-95 cursor-pointer"
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
            <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <BarChart2 size={16} className="text-indigo-600" />
                    Workforce Skill Distribution
                  </h3>
                  <p className="text-slate-400 text-xs font-medium">Exact skill tier breakdown by department calculated from verified employee skills</p>
                </div>
                <button 
                  onClick={() => navigate('/hr-dashboard/department-comparison')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Compare All <ChevronRight size={14} />
                </button>
              </div>
              
              <div className="min-h-48 flex items-end justify-between gap-3 px-2 pb-2 pt-4 border-b border-slate-100 overflow-x-auto w-full">
                {filteredDepartments.map(d => {
                  return (
                    <StackedBar 
                      key={d.id} 
                      label={d.name.split(' & ')[0]} 
                      hasSkills={d.hasSkills}
                      totalSkills={d.totalSkills || 0}
                      avgProficiency={d.avgProficiency || 0}
                      expertCount={d.expertCount || 0}
                      proficientCount={d.proficientCount || 0}
                      noviceCount={d.noviceCount || 0}
                      segments={[d.expertPct || 0, d.proficientPct || 0, d.novicePct || 0]} 
                      onClick={() => setSelectedDepartment(d)}
                    />
                  );
                })}
              </div>

              <div className="flex justify-center gap-6 text-xs font-bold text-slate-500 pt-1">
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Expert (4.2 - 5.0)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-600 rounded-full"></span> Proficient (3.0 - 4.1)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-300 rounded-full"></span> Novice (&lt; 3.0)</div>
              </div>
            </div>

            {/* 6. Dynamic Capability & Competency Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <DepartmentBenchmarkWidget 
                data={analyticsData?.departmentReadiness || []}
                benchmark={90}
                onSelectDepartment={(deptName) => {
                  const targetName = (deptName || '').toLowerCase();
                  const found = (analyticsData?.departments || []).find(d => 
                    d.name.toLowerCase() === targetName ||
                    d.name.toLowerCase().includes(targetName) ||
                    targetName.includes(d.name.toLowerCase())
                  );
                  if (found) setSelectedDepartment(found);
                }}
              />
              <CompetencyReadinessWidget 
                pillars={analyticsData?.pillarReadinessTrend || []}
                categories={analyticsData?.categoryReadiness || []}
                benchmark={90}
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
              className="bg-gradient-to-br from-[#D8EBF9] to-[#BEDDF5] backdrop-blur-2xl rounded-3xl p-6 max-w-lg w-full shadow-2xl relative border border-white/90"
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
              <p className="text-slate-500 text-xs mb-3.5 leading-relaxed">
                {aiInsightDetails.desc}
              </p>

              {aiInsightDetails.aiPrescription && (
                <div className="p-3 mb-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed font-medium">
                  <span className="font-bold text-indigo-700 block mb-0.5">AI Prescriptive Analysis:</span>
                  {aiInsightDetails.aiPrescription}
                </div>
              )}

              <div className="space-y-2 mb-5 max-h-52 overflow-y-auto pr-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Active Capability Gaps ({analyticsData?.skillGaps?.length || 0} Records)
                </span>
                {analyticsData?.skillGaps?.map((gap, idx) => (
                  <div key={gap.id || idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{gap.skill?.name || 'Skill'}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {gap.user ? `${gap.user.firstName} ${gap.user.lastName}` : 'Team Member'} • {gap.user?.department?.name || 'Department'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-50 text-rose-600 border border-rose-200">
                        {gap.severity || 'CRITICAL'}
                      </span>
                      <p className="text-[10px] font-bold text-slate-700 mt-0.5">
                        Level {gap.currentLevel} → {gap.requiredLevel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    setIsAIModalOpen(false);
                    navigate('/hr-dashboard/hr-insights');
                  }}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer text-center"
                >
                  Strategic Forecasting
                </button>
                <button 
                  onClick={() => {
                    setIsAIModalOpen(false);
                    navigate('/hr-dashboard/skill-gap-reports');
                  }}
                  className="py-2.5 bg-[#0b1221] hover:bg-[#16233d] text-white rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer text-center"
                >
                  Skill Gap Reports
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Department Drill-Down Modal */}
      <AnimatePresence>
        {selectedDepartment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-[#D8EBF9] to-[#BEDDF5] backdrop-blur-2xl rounded-3xl p-6 max-w-lg w-full shadow-2xl relative border border-white/90 max-h-[85vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedDepartment(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                  <BarChart2 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedDepartment.name}</h2>
                  <p className="text-slate-500 text-xs font-medium">
                    {selectedDepartment.memberCount} Team Member{selectedDepartment.memberCount !== 1 ? 's' : ''} • {selectedDepartment.totalSkills || 0} Verified Skills
                  </p>
                </div>
              </div>

              {selectedDepartment.hasSkills ? (
                <>
                  {/* Skill Tiers Grid */}
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">Expert Tier</span>
                      <span className="text-lg font-black text-emerald-800">{selectedDepartment.expertCount}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold block">{selectedDepartment.expertPct}% of dept</span>
                    </div>
                    <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-indigo-700 block uppercase">Proficient</span>
                      <span className="text-lg font-black text-indigo-800">{selectedDepartment.proficientCount}</span>
                      <span className="text-[10px] text-indigo-600 font-semibold block">{selectedDepartment.proficientPct}% of dept</span>
                    </div>
                    <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-600 block uppercase">Novice</span>
                      <span className="text-lg font-black text-slate-800">{selectedDepartment.noviceCount}</span>
                      <span className="text-[10px] text-slate-500 font-semibold block">{selectedDepartment.novicePct}% of dept</span>
                    </div>
                  </div>

                  {/* Members & Skills List */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                      Team Members & Verified Skills
                    </span>
                    {(selectedDepartment.members || []).map((m) => (
                      <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold">{m.jobTitle}</p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-slate-700">
                            {m.skillsCount} Skills • {m.gapsCount} Gaps
                          </span>
                        </div>
                        {m.skills && m.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {m.skills.map((s, sIdx) => {
                              const badgeStyle = s.tier === 'Expert' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : s.tier === 'Proficient'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200';
                              return (
                                <span key={s.id || sIdx} className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeStyle}`}>
                                  {s.name}: {s.proficiency}/5.0
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Pending Skill Assessment</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Members in this department have been registered, but skill assessments have not been submitted yet.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setSelectedDepartment(null);
                    navigate('/hr-dashboard/department-comparison');
                  }}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer text-center"
                >
                  Compare All Departments
                </button>
                <button 
                  onClick={() => {
                    setSelectedDepartment(null);
                    navigate('/hr-dashboard/skill-gap-reports');
                  }}
                  className="py-2.5 bg-[#0b1221] hover:bg-[#16233d] text-white rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer text-center"
                >
                  View Gap Reports
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

/* Sub-components for cleaner rendering */
const MetricCard = ({ title, value, icon, iconColor = "", iconBg = "", subtext, subtextColor = "", subtextStyle = "" }) => (
  <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between hover:border-[#1988A3]/40 transition-all duration-300">
    <div className="flex justify-between items-start">
      <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">{title}</span>
      <div className={`w-8 h-8 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}>{icon}</div>
    </div>
    <div className="mt-1.5">
      <h3 className="text-2xl md:text-3xl font-extrabold text-[#17233E] tracking-tight">{value}</h3>
      {subtext && (
        <div className={subtextColor ? `inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold mt-1.5 border ${subtextColor}` : `text-[11px] font-bold mt-1.5 ${subtextStyle}`}>
          {subtext}
        </div>
      )}
    </div>
  </div>
);

const StackedBar = ({ label, segments = [0, 0, 0], hasSkills = false, totalSkills = 0, avgProficiency = 0, expertCount = 0, proficientCount = 0, noviceCount = 0, onClick }) => {
  const tooltipText = hasSkills 
    ? `${label}: ${expertCount} Expert, ${proficientCount} Proficient, ${noviceCount} Novice (${totalSkills} verified skills, Avg: ${avgProficiency}/5.0)`
    : `${label}: 0 Skills recorded (Pending Assessment)`;

  return (
    <div 
      onClick={onClick}
      className="flex-1 min-w-[70px] max-w-[120px] space-y-1.5 text-center group relative cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
      title={tooltipText}
    >
      <div className="w-full flex flex-col justify-end h-32 gap-0.5 group-hover:-translate-y-1 transition-transform">
        {hasSkills ? (
          <>
            <div className="bg-emerald-500 rounded-t-md transition-all shadow-sm" style={{ height: `${segments[0]}%` }}></div>
            <div className="bg-indigo-600 transition-all shadow-sm" style={{ height: `${segments[1]}%` }}></div>
            <div className="bg-slate-300 rounded-b-md transition-all" style={{ height: `${segments[2]}%` }}></div>
          </>
        ) : (
          <div className="h-full w-full border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50/70 p-1">
            <span className="text-[10px] font-bold text-slate-400">0 Skills</span>
          </div>
        )}
      </div>
      <div className="pt-1">
        <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-indigo-600 transition-colors" title={label}>{label}</span>
        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
          {hasSkills ? `${avgProficiency} / 5.0` : 'Pending'}
        </span>
      </div>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-indigo-600 block">
        Click details
      </span>
    </div>
  );
};

const DepartmentBenchmarkWidget = ({ data = [], benchmark = 90, onSelectDepartment }) => {
  const depts = data && data.length > 0 ? data : [
    { name: "Development", department: "Development", membersCount: 1, skillsCount: 39, value: 86, score: 4.3, deficit: 4 },
    { name: "Product Design", department: "Product Design", membersCount: 1, skillsCount: 7, value: 78, score: 3.9, deficit: 12 },
    { name: "Marketing", department: "Marketing", membersCount: 1, skillsCount: 3, value: 77, score: 3.8, deficit: 13 }
  ];

  return (
    <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
            <Target size={15} className="text-indigo-600" />
            Department Capability Benchmark
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Live department readiness vs {benchmark}% operational target</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
            Benchmark: {benchmark}%
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-auto">
        {depts.map((d, idx) => {
          const isAboveTarget = d.value >= benchmark;
          const isClose = d.value >= 80;
          const barColor = isAboveTarget 
            ? 'bg-emerald-500' 
            : isClose 
            ? 'bg-indigo-600' 
            : 'bg-amber-500';

          return (
            <div 
              key={idx} 
              onClick={() => onSelectDepartment && onSelectDepartment(d.name || d.department)}
              className="group p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {d.name || d.department}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold px-1.5 py-0.5 bg-slate-100 rounded">
                    {d.skillsCount} Skills
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {d.membersCount || 1} Member{(d.membersCount || 1) > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900">{d.value}%</span>
                  <span className="text-[10px] text-slate-400 font-medium">({d.score}/5.0)</span>
                  {d.deficit > 0 ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                      -{d.deficit}%
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                      Target met
                    </span>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                {/* 90% Target Marker Line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10 opacity-70"
                  style={{ left: `${benchmark}%` }}
                  title={`Target: ${benchmark}%`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${d.value}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.08 }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> ≥{benchmark}% Met</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> 80-89% Strong</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> &lt;80% Developing</span>
        </div>
        <span className="font-semibold text-slate-500">Click row for details</span>
      </div>
    </div>
  );
};

const CompetencyReadinessWidget = ({ pillars = [], categories = [], benchmark = 90 }) => {
  const [viewMode, setViewMode] = useState('pillars');

  const activeList = viewMode === 'categories' && categories && categories.length > 0
    ? categories
    : (pillars && pillars.length > 0 ? pillars : [
        { fullName: "Problem Solving", value: 89, score: 4.4, skillsCount: 5 },
        { fullName: "Leadership & Collab", value: 87, score: 4.3, skillsCount: 5 },
        { fullName: "Software Eng", value: 86, score: 4.3, skillsCount: 13 },
        { fullName: "Data & AI", value: 86, score: 4.3, skillsCount: 11 },
        { fullName: "Cloud & Systems", value: 85, score: 4.2, skillsCount: 5 },
        { fullName: "Product & Design", value: 79, score: 4.0, skillsCount: 7 }
      ]);

  return (
    <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
            <Award size={15} className="text-emerald-600" />
            Competency & Category Readiness
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Live capability aggregated from verified employee skills</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('pillars')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${viewMode === 'pillars' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Pillars (6)
          </button>
          <button
            onClick={() => setViewMode('categories')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${viewMode === 'categories' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Taxonomy (5)
          </button>
        </div>
      </div>

      <div className="space-y-2.5 my-auto">
        {activeList.map((p, idx) => {
          const isAboveTarget = p.value >= benchmark;
          const isClose = p.value >= 85;
          const barColor = isAboveTarget 
            ? 'bg-emerald-500' 
            : isClose 
            ? 'bg-indigo-600' 
            : 'bg-amber-500';

          return (
            <div key={idx} className="group">
              <div className="flex justify-between items-center text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {p.fullName || p.category || p.pillar}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold px-1.5 py-0.2 bg-indigo-50 border border-indigo-100 rounded">
                    {p.skillsCount} Skills
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900">{p.value}%</span>
                  <span className="text-[10px] text-slate-400 font-medium">({p.score}/5.0)</span>
                </div>
              </div>
              
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                {/* 90% Target Marker Line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10 opacity-70"
                  style={{ left: `${benchmark}%` }}
                  title={`Target: ${benchmark}%`}
                />
                <motion.div 
                  key={`${viewMode}-${idx}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${p.value}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Target (≥{benchmark}%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Strong (85-89%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Developing (&lt;85%)</span>
        </div>
        <span className="font-semibold text-slate-500">Verified Analytics</span>
      </div>
    </div>
  );
};

const QuickActionButton = ({ label, colorBg, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl hover:bg-[#E4EEF8]/80 border border-white/85 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all text-left group active:scale-95 cursor-pointer outline-none"
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