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
        ? `Detected ${criticalCount} active critical skill gap(s) in PostgreSQL DB. Initiating targeted upskilling pathways is recommended to raise average proficiency.`
        : `Workforce readiness is healthy across all departments. Recommend launching advanced certifications for high performers.`
    };
  }, [analyticsData]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans text-slate-800 antialiased">
      {/* 1. Multi-Tenant Sidebar */}
      <HRSidebar currentTenant={displayTenantName} currentScreen="Dashboard" />

      {/* 2. Main Dashboard Panel */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-6 p-4 md:p-6 w-full space-y-5 relative">
        
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
                subtext={<><ArrowUpRight size={13} /> <span>{analyticsData?.totalEmployees || 0} Live DB Users</span></>}
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
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
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
                  <p className="text-slate-400 text-xs font-medium">Exact skill tier breakdown by department calculated from verified UserSkills in PostgreSQL</p>
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
              <DynamicTrendGraph 
                title="Assessment Milestone Progression" 
                color="#6366f1" 
                gradId="blueGrad"
                data={analyticsData?.assessmentMilestoneTrend || []}
                xKey="milestone"
                yKey="value"
                unit="%"
                sublabel="Chronological capability evaluation timeline"
                benchmark={90}
                minV={65}
                maxV={100}
              />
              <CompetencyPillarsWidget 
                data={analyticsData?.pillarReadinessTrend || []}
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
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative border border-slate-100"
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
                  Active Capability Gaps ({analyticsData?.skillGaps?.length || 0} Records in DB)
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
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative border border-slate-100 max-h-[85vh] flex flex-col"
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
                    Members in this department have been registered in the database, but skill assessments have not been submitted yet.
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

const DynamicTrendGraph = ({ title, color, gradId, data = [], xKey = "milestone", yKey = "value", unit = "%", sublabel = "", benchmark = 90, minV = 65, maxV = 100 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const points = data && data.length > 0 ? data : [
    { [xKey]: "Sep 03", [yKey]: 77, title: "Diagnostic Baseline" },
    { [xKey]: "Sep 19", [yKey]: 78, title: "Core Soft Skills" },
    { [xKey]: "Sep 25", [yKey]: 80, title: "Mid-Cycle Audit" },
    { [xKey]: "Sep 27", [yKey]: 85, title: "Development Cohort" },
    { [xKey]: "Sep 30", [yKey]: 84, title: "Marketing & Design" },
    { [xKey]: "Oct Baseline", [yKey]: 84, title: "Verified Benchmark" }
  ];

  const labels = points.map(p => p[xKey] || "");
  const values = points.map(p => typeof p[yKey] === 'number' ? p[yKey] : 0);

  const W = 460, H = 140, padL = 36, padR = 24, padT = 20, padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const getX = (i) => padL + (values.length > 1 ? (i / (values.length - 1)) * chartW : chartW / 2);
  const getY = (v) => padT + chartH - ((Math.min(maxV, Math.max(minV, v)) - minV) / (maxV - minV)) * chartH;

  // Generate smooth cubic bezier curve
  let pathD = "";
  if (values.length > 0) {
    pathD = `M ${getX(0).toFixed(1)} ${getY(values[0]).toFixed(1)}`;
    for (let i = 0; i < values.length - 1; i++) {
      const x0 = getX(i);
      const y0 = getY(values[i]);
      const x1 = getX(i + 1);
      const y1 = getY(values[i + 1]);
      const cpx = (x0 + x1) / 2;
      pathD += ` C ${cpx.toFixed(1)} ${y0.toFixed(1)}, ${cpx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
  } else {
    pathD = `M ${padL} ${padT + chartH} L ${padL + chartW} ${padT + chartH}`;
  }

  const areaD = `${pathD} L ${getX(values.length - 1).toFixed(1)} ${(padT + chartH).toFixed(1)} L ${getX(0).toFixed(1)} ${(padT + chartH).toFixed(1)} Z`;
  const latestValue = values[values.length - 1] ?? 0;
  const benchmarkY = getY(benchmark);

  const gridLevels = [100, 90, 80, 70];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2 hover:shadow-md transition-shadow relative flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
            <TrendingUp size={15} className="text-indigo-600" />
            {title}
          </h4>
          {sublabel && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sublabel}</p>}
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-500">
            Latest: <span className="font-black text-slate-900">{latestValue}{unit}</span>
          </span>
          <span className="text-[9px] font-bold text-emerald-600 block">Target: {benchmark}%</span>
        </div>
      </div>

      <div className="h-44 w-full relative pt-1">
        <svg 
          className="w-full h-full overflow-visible" 
          viewBox={`0 0 ${W} ${H}`} 
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Reference Gridlines & Y-Axis Labels */}
          {gridLevels.map(lvl => {
            const yPos = getY(lvl);
            return (
              <g key={lvl} opacity="0.45">
                <line 
                  x1={padL} 
                  y1={yPos} 
                  x2={padL + chartW} 
                  y2={yPos} 
                  stroke="#cbd5e1" 
                  strokeDasharray="3 3" 
                  strokeWidth="1" 
                />
                <text 
                  x={padL - 6} 
                  y={yPos + 3} 
                  textAnchor="end" 
                  fontSize="8" 
                  fontWeight="bold" 
                  fill="#94a3b8"
                >
                  {lvl}%
                </text>
              </g>
            );
          })}

          {/* Target Benchmark Dashed Guideline */}
          {benchmark && (
            <g opacity="0.85">
              <line 
                x1={padL} 
                y1={benchmarkY} 
                x2={padL + chartW} 
                y2={benchmarkY} 
                stroke="#10b981" 
                strokeDasharray="4 4" 
                strokeWidth="1.2" 
              />
              <text 
                x={padL + chartW - 2} 
                y={benchmarkY - 3} 
                textAnchor="end" 
                fontSize="8" 
                fontWeight="black" 
                fill="#10b981"
              >
                TARGET {benchmark}%
              </text>
            </g>
          )}

          {/* Area Gradient Fill */}
          <path d={areaD} fill={`url(#${gradId})`} />

          {/* Smooth Spline Path */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            d={pathD} 
            fill="none" 
            stroke={color} 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Guide Line */}
          {hoveredIdx !== null && (
            <line 
              x1={getX(hoveredIdx)} 
              y1={padT} 
              x2={getX(hoveredIdx)} 
              y2={padT + chartH} 
              stroke={color} 
              strokeWidth="1.5" 
              strokeDasharray="2 2" 
              opacity="0.7"
            />
          )}

          {/* Interactive Data Point Dots */}
          {values.map((v, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g 
                key={i} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
              >
                <circle 
                  cx={getX(i)} 
                  cy={getY(v)} 
                  r={isHovered ? 6 : 4} 
                  fill="#ffffff" 
                  stroke={color} 
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Card */}
        {hoveredIdx !== null && (
          <div 
            className="absolute z-20 pointer-events-none bg-[#0b1221] text-white px-3 py-2 rounded-lg shadow-xl border border-slate-800 text-[10px] transform -translate-x-1/2 -translate-y-full transition-all duration-150"
            style={{ 
              left: `${(getX(hoveredIdx) / W) * 100}%`, 
              top: `${Math.max(10, (getY(values[hoveredIdx]) / H) * 100 - 10)}%` 
            }}
          >
            <p className="font-black text-slate-200">
              {points[hoveredIdx]?.title || points[hoveredIdx]?.fullName || labels[hoveredIdx]}
            </p>
            <p className="font-bold text-emerald-400 mt-0.5">
              Score: <span className="font-black text-white">{values[hoveredIdx]}%</span> ({((values[hoveredIdx] / 100) * 5.0).toFixed(1)} / 5.0)
            </p>
            {points[hoveredIdx]?.skillsCount > 0 && (
              <p className="text-[9px] text-slate-400 mt-0.5">
                {points[hoveredIdx].skillsCount} Verified Skills in DB
              </p>
            )}
          </div>
        )}

        {/* X-Axis Category Labels */}
        <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1 border-t border-slate-100 pt-1.5 px-3">
          {labels.map((l, i) => (
            <span 
              key={i} 
              className={`truncate max-w-[65px] text-center cursor-pointer transition-colors ${hoveredIdx === i ? 'text-indigo-600 font-black' : ''}`}
              title={`${l}: ${values[i]}${unit}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const CompetencyPillarsWidget = ({ data = [], benchmark = 90 }) => {
  const pillarsList = data && data.length > 0 ? data : [
    { fullName: "Problem Solving", value: 89, score: 4.4, skillsCount: 5 },
    { fullName: "Leadership & Collab", value: 87, score: 4.3, skillsCount: 5 },
    { fullName: "Software Engineering", value: 86, score: 4.3, skillsCount: 13 },
    { fullName: "Data & AI Analytics", value: 86, score: 4.3, skillsCount: 11 },
    { fullName: "Cloud & Systems", value: 85, score: 4.2, skillsCount: 5 },
    { fullName: "Product & Design", value: 79, score: 4.0, skillsCount: 7 }
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
            <Award size={15} className="text-emerald-600" />
            Competency Pillar Readiness
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Live verified capability across 6 organizational pillars</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
            Target: {benchmark}%
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-auto">
        {pillarsList.map((p, idx) => {
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
                    {p.fullName || p.pillar}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold px-1.5 py-0.2 bg-slate-100 rounded">
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
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Target Met (≥90%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Strong (85-89%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Developing (&lt;85%)</span>
        </div>
        <span className="font-semibold text-slate-500">PostgreSQL Verified</span>
      </div>
    </div>
  );
};

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