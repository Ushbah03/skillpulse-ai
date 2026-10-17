import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  X,
  Loader2
} from 'lucide-react';
import HRSidebar from './HRSidebar'; 
import { motion, AnimatePresence } from 'framer-motion';
import { hrAPI } from '../services/api';

const OrganizationSkillAnalytics = () => {
  const navigate = useNavigate();
  // Multi-tenant & Global State
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentTenant = storedUser.tenant?.name || "Organization";
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Interactive UI States
  const [currentPage, setCurrentPage] = useState(1);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const itemsPerPage = 5;

  const loadAnalytics = async () => {
    try {
      const res = await hrAPI.getAnalytics();
      if (res?.success) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.warn('Failed to load analytics for OrganizationSkillAnalytics:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      setLoading(true);
      await loadAnalytics();
      if (isMounted) setLoading(false);
    };
    fetchInitial();
    return () => { isMounted = false; };
  }, []);

  // Derive employee gaps from backend skillGaps data
  const employeeGaps = useMemo(() => {
    if (!analyticsData?.skillGaps) return [];
    return analyticsData.skillGaps.map(g => ({
      id: g.id,
      name: `${g.user?.firstName || 'Employee'} ${g.user?.lastName || ''}`.trim(),
      dept: g.user?.department ? g.user.department.name : 'Unassigned',
      skill: g.skill?.name || 'General Skill',
      score: `${g.currentLevel || 1} / ${g.requiredLevel || 3}`,
      severity: g.severity || 'MODERATE',
      isAssigned: Boolean(g.assignedCourseId),
      assignedCourseTitle: g.courseTitle || g.assignedCourse?.title || null,
      rec: g.courseTitle || g.assignedCourse?.title || (g.severity === 'CRITICAL' ? `${g.skill?.name || 'Technical'} Remedial Track` : `${g.skill?.name || 'Skill'} Fundamentals Module`)
    }));
  }, [analyticsData]);

  // Track assigned vs unassigned gaps
  const unassignedGaps = useMemo(() => {
    return (analyticsData?.skillGaps || []).filter(g => !g.assignedCourseId && g.courseId);
  }, [analyticsData]);

  const assignedGaps = useMemo(() => {
    return (analyticsData?.skillGaps || []).filter(g => Boolean(g.assignedCourseId));
  }, [analyticsData]);

  // Heatmap Data Logic derived strictly from live DB
  const { heatmapSkills, heatmapEmployees } = useMemo(() => {
    if (!analyticsData?.members) return { heatmapSkills: [], heatmapEmployees: [] };
    const gapSkillNames = (analyticsData.skillGaps || []).map(g => g.skill?.name).filter(Boolean);
    const memberSkillNames = analyticsData.members.flatMap(m => (m.skills || []).map(s => s.skill?.name).filter(Boolean));
    const skills = Array.from(new Set([...gapSkillNames, ...memberSkillNames])).slice(0, 7);

    const emps = analyticsData.members.slice(0, 6).map(m => {
      const gaps = skills.map(skName => {
        const gap = analyticsData.skillGaps?.find(g => g.userId === m.id && g.skill?.name === skName);
        if (!gap) return 0; // No gap
        return gap.severity === 'CRITICAL' ? 2 : 1; // 1: Moderate/High, 2: Critical
      });
      return {
        name: `${m.firstName} ${m.lastName}`,
        gaps
      };
    });
    return { heatmapSkills: skills, heatmapEmployees: emps };
  }, [analyticsData]);


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

  const handleDispatchTraining = async () => {
    try {
      setIsDispatching(true);
      if (unassignedGaps.length === 0) {
        setToastMessage(`All identified skill gaps already have active training tracks assigned.`);
        setIsAIModalOpen(false);
        return;
      }

      let assignedCount = 0;
      for (const gap of unassignedGaps) {
        if (gap.userId && gap.courseId) {
          await hrAPI.assignTraining({
            userId: gap.userId,
            courseId: gap.courseId,
            skillId: gap.skillId
          }).catch(() => {});
          assignedCount++;
        }
      }

      setToastMessage(`Dispatched targeted training tracks to ${assignedCount} employee${assignedCount > 1 ? 's' : ''}.`);
      setIsAIModalOpen(false);
      await loadAnalytics();
    } catch (err) {
      console.warn('Error dispatching training:', err);
      setIsAIModalOpen(false);
    } finally {
      setIsDispatching(false);
    }
  };

  // Derive counts & Severity Distribution dynamically from DB
  const totalEmployeesCount = analyticsData?.members?.length || analyticsData?.totalEmployees || 0;
  const totalEmployeesWithGaps = analyticsData?.skillGaps ? new Set(analyticsData.skillGaps.map(g => g.userId)).size : 0;
  const criticalGaps = analyticsData?.criticalGapsCount || 0;
  const totalGapsCount = analyticsData?.skillGaps?.length || 0;
  const moderateGaps = Math.max(0, totalGapsCount - criticalGaps);
  const workforceMatchScore = analyticsData?.averageReadiness !== undefined ? analyticsData.averageReadiness : 0;
  const totalSkillCount = analyticsData?.categoryDistribution?.reduce((acc, c) => acc + c.skillCount, 0) || 0;

  const criticalGapPct = totalGapsCount ? Math.round((criticalGaps / totalGapsCount) * 100) : 0;
  const moderateGapPct = totalGapsCount ? Math.round((moderateGaps / totalGapsCount) * 100) : 0;
  const noGapPct = Math.max(0, 100 - criticalGapPct - moderateGapPct);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans">
      {/* 1. Sidebar with Tenant prop */}
      <HRSidebar currentTenant={currentTenant} currentScreen="Skill Analytics" />

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

        {/* --- SECTION 1: HEADER --- */}
        <header className="flex justify-between items-center bg-white p-4 -mt-2 -mx-4 rounded-2xl border border-slate-100 shadow-sm mb-4">
          <div>
            <h1 className="text-2xl font-black text-[#0b1221] tracking-tight flex items-center gap-3">
              Organization Skill Analytics
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 tracking-normal">
                <Building size={14} className="text-slate-400" />
                {currentTenant}
              </span>
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Live organization-wide skill gap reports & heatmap</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search gaps, employees..." 
                className="w-80 pl-11 pr-4 py-2.5 bg-[#f3f4f6]/60 rounded-xl text-sm font-semibold text-slate-700 outline-none border border-transparent focus:border-blue-500/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all" 
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm cursor-pointer" onClick={() => triggerAction("Profile View")}>
              {storedUser.firstName ? `${storedUser.firstName[0]}${storedUser.lastName ? storedUser.lastName[0] : ''}` : 'HR'}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-sm font-semibold text-slate-400">Loading skill analytics details...</p>
          </div>
        ) : (
          <>
            {/* --- SECTION 2: TOP METRICS CARDS --- */}
            <div className="grid grid-cols-4 gap-6">
              <MetricCard 
                title="Employees with Skill Gaps" 
                value={`${totalEmployeesWithGaps}`} 
                trend={`${totalEmployeesWithGaps} of ${totalEmployeesCount} total employees`}
                trendColor="text-slate-400"
              />
              <MetricCard 
                title="Critical Skill Gaps" 
                value={`${criticalGaps}`} 
                trend="High priority upskilling" 
                trendColor="text-rose-500" 
                badge="Critical" 
                badgeBg="bg-rose-500" 
              />
              <MetricCard 
                title="Moderate Skill Gaps" 
                value={`${moderateGaps}`} 
                trend="Standard learning modules" 
                trendColor="text-amber-600" 
                badge="Moderate" 
                badgeBg="bg-amber-500" 
              />
              
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workforce Match Score</p>
                  <h4 className="text-3xl font-black text-slate-900 mt-2">{workforceMatchScore}%</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">Enterprise standard: 85%</p>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <motion.path 
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${workforceMatchScore}, 100` }}
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
            {heatmapSkills.length > 0 && (
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
                    {heatmapSkills.map(s => <div key={s} className="truncate">{s}</div>)}
                  </div>
                  {heatmapEmployees.map((emp, i) => (
                    <div key={i} className="grid grid-cols-8 gap-4 items-center">
                      <div className="text-sm font-bold text-slate-700 truncate">{emp.name}</div>
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
            )}

            {/* --- SECTION 4: CATEGORY & DISTRIBUTION --- */}
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Skill Gap by Category</h3>
                <div className="space-y-6">
                  {analyticsData?.categoryDistribution?.slice(0, 4).map(cat => (
                    <CategoryRow 
                      key={cat.name} 
                      onClick={() => triggerAction(`${cat.name} Category View`)} 
                      label={cat.name} 
                      value={`${cat.totalProficiencyEntries} entries`} 
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Gap Severity Distribution</h3>
                <div className="flex items-center justify-between">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray={`${noGapPct} 100`} />
                      <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${moderateGapPct} 100`} strokeDashoffset={`-${noGapPct}`} />
                      <circle cx="18" cy="18" r="16" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray={`${criticalGapPct} 100`} strokeDashoffset={`-${noGapPct + moderateGapPct}`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-900">{totalSkillCount}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Total Skills</span>
                    </div>
                  </div>
                  <div className="space-y-4 flex-1 ml-12">
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">No Gap</span> <span className="text-sm font-black text-[#10b981]">{noGapPct}%</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Moderate</span> <span className="text-sm font-black text-[#f59e0b]">{moderateGapPct}%</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Critical</span> <span className="text-sm font-black text-[#ef4444]">{criticalGapPct}%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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
                    <td className="py-5 px-8">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-semibold">{emp.rec}</span>
                        {emp.isAssigned ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                            <CheckCircle2 size={12} /> Training Enrolled & In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-0.5">
                            • Pending Intervention
                          </span>
                        )}
                      </div>
                    </td>
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
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                {analyticsData?.aiInsight || (analyticsData?.categoryDistribution && analyticsData.categoryDistribution.length > 0 
                  ? `${analyticsData.categoryDistribution.slice(0, 3).map(c => c.name).join(', ')} categories show primary gap concentrations across ${currentTenant}. Targeted upskilling is recommended.`
                  : `Skill analytics for ${currentTenant} are loaded live from database.`)}
              </p>
            </div>
          </div>
          {unassignedGaps.length === 0 && assignedGaps.length > 0 ? (
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="px-6 py-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-black text-sm rounded-xl transition-all flex items-center gap-2 active:scale-95 relative z-10"
            >
              <CheckCircle2 size={16} />
              Training Active ({assignedGaps.length})
            </button>
          ) : (
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 relative z-10"
            >
              Assign Training
            </button>
          )}
        </div>



        {/* --- SECTION 8: QUICK ACTIONS --- */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase">Quick Strategic Actions</h4>
          <div className="grid grid-cols-3 gap-6">
            <QuickAction onClick={() => navigate('/hr-dashboard/training-management')} icon={<Target className="text-blue-500"/>} label="Assign Training" />
            <QuickAction onClick={() => navigate('/hr-dashboard/career-planning')} icon={<Map className="text-indigo-500"/>} label="Career Planning" />
            <QuickAction onClick={() => navigate('/hr-dashboard/skill-gap-reports')} icon={<FileText className="text-emerald-500"/>} label="Generate Report" />
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
              className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl relative"
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
                Automatically assign targeted learning paths to employees with identified skill deficiencies in {currentTenant}.
              </p>
              <div className="space-y-3 mb-6">
                {unassignedGaps.length === 0 ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between text-sm">
                    <span className="font-semibold text-emerald-800">Training Status</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> {assignedGaps.length} Active Tracks Enrolled
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                    <span className="font-semibold text-slate-600">Pending Interventions</span>
                    <span className="font-bold text-slate-900">{unassignedGaps.length} Employees</span>
                  </div>
                )}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Target Completion</span>
                  <span className="font-bold text-slate-900">Next Evaluation Cycle (30 Days)</span>
                </div>
              </div>

              {/* Detailed Breakdown of Assignments */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  <span>Assigned Personnel & Courseware</span>
                  <span className="text-slate-700 font-extrabold">{assignedGaps.length} Enrolled</span>
                </div>
                <div className="max-h-52 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                  {assignedGaps.map((gap) => (
                    <div 
                      key={gap.id} 
                      className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs hover:border-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-[10px] border border-blue-100">
                          {`${gap.user?.firstName?.[0] || 'E'}${gap.user?.lastName?.[0] || 'M'}`}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{gap.user?.firstName} {gap.user?.lastName}</p>
                          <p className="text-slate-500 text-[11px]">Skill Gap: <span className="font-semibold text-slate-700">{gap.skill?.name}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600 max-w-[210px] truncate" title={gap.courseTitle || gap.assignedCourse?.title}>
                          {gap.courseTitle || gap.assignedCourse?.title || 'Targeted Module'}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                          <CheckCircle2 size={11} /> Active Enrolled
                        </span>
                      </div>
                    </div>
                  ))}
                  {unassignedGaps.map((gap) => (
                    <div 
                      key={gap.id} 
                      className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-[10px]">
                          {`${gap.user?.firstName?.[0] || 'E'}${gap.user?.lastName?.[0] || 'M'}`}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{gap.user?.firstName} {gap.user?.lastName}</p>
                          <p className="text-slate-500 text-[11px]">Skill Gap: <span className="font-semibold text-slate-700">{gap.skill?.name}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-700 max-w-[210px] truncate">
                          {gap.courseTitle || 'Recommended Track'}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-0.5">
                          • Pending Dispatch
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {unassignedGaps.length === 0 ? (
                <button 
                  disabled
                  className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default"
                >
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>All Training Tracks Dispatched</span>
                </button>
              ) : (
                <button 
                  onClick={handleDispatchTraining}
                  disabled={isDispatching}
                  className="w-full py-3 bg-[#0b1221] hover:bg-[#16233d] disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isDispatching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Dispatching Recommendations...</span>
                    </>
                  ) : (
                    <span>Confirm & Dispatch Courses ({unassignedGaps.length})</span>
                  )}
                </button>
              )}
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