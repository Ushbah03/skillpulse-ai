import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import SkillPulseLoader from './SkillPulseLoader'; 
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, ArrowUpRight, Download, Search, 
  SlidersHorizontal, Calendar, X, CheckCircle2, Loader2, Sparkles, BookOpen, Printer
} from 'lucide-react';
import { teamLeaderAPI } from '../services/api';

export default function PerformanceMonitor() {
  const [activeTab, setActiveTab] = useState('performance');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'plan', 'report', 'gaps'
  const [selectedMemberForPlan, setSelectedMemberForPlan] = useState(null);
  const [selectedCourseIdForPlan, setSelectedCourseIdForPlan] = useState('');
  const [planTargetDate, setPlanTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [assigningPlan, setAssigningPlan] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Live Performance State from DB
  const [members, setMembers] = useState([]);
  const [summary, setSummary] = useState({
    overallTeamScorePct: '0%',
    overallTier: 'Evaluating',
    avgMemberPerf: '0.0',
    highPerformersCount: 0,
    riskAlertsCount: 0,
    performanceDelta: '+0.0%'
  });
  const [distributionData, setDistributionData] = useState([]);
  const [breakdownData, setBreakdownData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [atRiskMembers, setAtRiskMembers] = useState([]);
  const [aiIntelligence, setAiIntelligence] = useState({
    velocityIncrease: '0%',
    confidenceScore: '0%',
    velocityReason: '',
    prescriptiveRecommendation: ''
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [teamSkillGaps, setTeamSkillGaps] = useState([]);

  // Fetch live performance data on mount
  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const res = await teamLeaderAPI.getPerformance();
      if (res?.success && res.data) {
        const d = res.data;
        if (d.summary) setSummary(d.summary);
        if (d.members) setMembers(d.members);
        if (d.distribution) setDistributionData(d.distribution);
        if (d.breakdown) setBreakdownData(d.breakdown);
        if (d.trendData) setTrendData(d.trendData);
        if (d.atRiskMembers) setAtRiskMembers(d.atRiskMembers);
        if (d.aiIntelligence) setAiIntelligence(d.aiIntelligence);
        if (d.availableCourses) {
          setAvailableCourses(d.availableCourses);
          if (d.availableCourses.length > 0 && !selectedCourseIdForPlan) {
            setSelectedCourseIdForPlan(d.availableCourses[0].id);
          }
        }
        if (d.teamSkillGaps) setTeamSkillGaps(d.teamSkillGaps);
      }
    } catch (err) {
      console.warn('Failed to fetch team performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const leaderName = storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : 'Team Lead';
  const leaderInitials = `${storedUser.firstName?.[0] || 'T'}${storedUser.lastName?.[0] || 'L'}`.toUpperCase();

  const [metricFilter, setMetricFilter] = useState('All Metrics');

  // Filter members dynamically by search query and metric category
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (metricFilter === 'High Performers') return member.rating === 'Excellent';
    if (metricFilter === 'Good Standing') return member.rating === 'Good';
    if (metricFilter === 'At Risk Only') return member.rating === 'At Risk';

    return true;
  });

  // Filter trend chart data dynamically based on selected timeframe
  const filteredTrendData = React.useMemo(() => {
    if (trendData.length === 0) return [];
    if (timeRange === 'Last 30 Days') {
      return trendData.slice(-2); // Last 2 periods
    }
    if (timeRange === 'Last Quarter (Q2)') {
      return trendData.slice(-3); // Last 3 periods
    }
    return trendData; // Year to Date (full period)
  }, [timeRange, trendData]);

  const handleOpenPlan = (member) => {
    setSelectedMemberForPlan(member);
    const defaultCourse = member?.matchedCourse?.id || (availableCourses.length > 0 ? availableCourses[0].id : '');
    setSelectedCourseIdForPlan(defaultCourse);
    setActiveModal('plan');
  };

  const handleAssignPlanSubmit = async () => {
    if (!selectedMemberForPlan || !selectedCourseIdForPlan) return;
    try {
      setAssigningPlan(true);
      await teamLeaderAPI.assignTraining({
        userId: selectedMemberForPlan.id,
        courseId: selectedCourseIdForPlan,
        dueDate: planTargetDate,
        priority: 'High',
        note: `Performance Improvement Plan: Focus on closing active proficiency gaps.`
      });
      const courseObj = availableCourses.find(c => c.id === selectedCourseIdForPlan);
      setToastMessage(`Training "${courseObj?.title || 'Program'}" assigned to ${selectedMemberForPlan.name}!`);
      setTimeout(() => setToastMessage(''), 4000);
      setActiveModal(null);
      loadPerformanceData();
    } catch (err) {
      console.warn('Assign training error:', err);
      setActiveModal(null);
    } finally {
      setAssigningPlan(false);
    }
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      setActiveModal('report');
    }, 800);
  };

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
      {/* 1. Constant Sidebar */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* 2. Main Content Area - Fluid Full Width */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full relative z-10 space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center justify-between font-bold text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="hover:opacity-80 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/60 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#0b1221] tracking-tight">Team Performance Monitoring</h1>
            <p className="text-base text-slate-500 font-semibold mt-2">Track team performance, productivity trends, and improvement insights</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe Selector */}
            <div className="relative">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-[#F0F5FB]/90 backdrop-blur-md border border-white/85 text-[#17233E] pl-10 pr-8 py-3 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last Quarter (Q2)">Last Quarter (Q2)</option>
                <option value="Year to Date">Year to Date</option>
              </select>
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>

            {/* Metrics Filter Selector */}
            <div className="relative">
              <select 
                value={metricFilter} 
                onChange={(e) => setMetricFilter(e.target.value)}
                className="appearance-none bg-[#F0F5FB]/90 backdrop-blur-md border border-white/85 text-[#17233E] pl-10 pr-8 py-3 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                <option value="All Metrics">All Metrics</option>
                <option value="High Performers">High Performers (Excellent)</option>
                <option value="Good Standing">Good Standing</option>
                <option value="At Risk Only">At Risk Only</option>
              </select>
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
            
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
               <div className="text-right">
                  <p className="text-base font-black text-slate-900 leading-none">{leaderName}</p>
                  <p className="text-sm font-bold text-slate-400 mt-1.5">Team Lead</p>
               </div>
               <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-black text-sm">
                  {storedUser.avatarUrl && !storedUser.avatarUrl.includes('unsplash.com') ? (
                    <img src={storedUser.avatarUrl} alt={leaderName} className="w-full h-full object-cover" />
                  ) : (
                    leaderInitials
                  )}
               </div>
            </div>
          </div>
        </header>

        {/* 3. Performance Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl p-6 md:p-7 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex justify-between items-center min-h-[160px] relative overflow-hidden">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Overall Team Score</p>
              <h3 className="text-2xl font-black text-slate-900 mt-3 tracking-tight">{summary.overallTier || 'Capability Score'}</h3>
            </div>
            <div className="w-16 h-16 rounded-full border-[5px] border-indigo-600 flex items-center justify-center text-base font-black text-indigo-600 shadow-inner">
              {summary.overallTeamScorePct}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl p-6 md:p-7 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between min-h-[160px]">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Avg Member Perf.</p>
            <div className="mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-900 tracking-tight">{summary.avgMemberPerf}</span>
                <span className="text-base font-black text-slate-400">/ 10</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold mt-2">
                <TrendingUp className="w-4 h-4" />
                <span>{summary.performanceDelta || '+2.5%'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl p-6 md:p-7 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between min-h-[160px]">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">High Performers</p>
            <div className="mt-2">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{summary.highPerformersCount}</h3>
              <span className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black px-3 py-1 rounded-xl mt-3">
                Top Performers
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl p-6 md:p-7 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col justify-between min-h-[160px]">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Risk Alerts</p>
            <div className="mt-2">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{summary.riskAlertsCount}</h3>
              <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black px-3 py-1 rounded-xl mt-3 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> Action Required
              </span>
            </div>
          </div>
        </div>

        {/* 4. Main Analytics Layout Grid */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column: Charts and Table */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Performance Trend Chart */}
            <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Team Performance Trend</h3>
                  <p className="text-sm text-slate-400 font-semibold mt-0.5">Performance score development ({timeRange})</p>
                </div>
                <div className="flex items-center gap-5 text-xs font-black uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-slate-700">Current Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                    <span className="text-slate-400">Benchmark</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredTrendData} margin={{ left: -15, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} fontWeight="bold" tickLine={false} />
                    <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={12} fontWeight="bold" tickLine={false} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="#3b82f6" 
                      strokeWidth={4} 
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="#cbd5e1" 
                      strokeWidth={2} 
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Individual Performance Table Analysis */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Individual Performance Analysis</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search members..." 
                      className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-52 focus:bg-white transition-all"
                    />
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700">
                    <span>Export CSV</span> 
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-black tracking-widest text-slate-400 uppercase">
                      <th className="py-4 px-8">Member Name</th>
                      <th className="py-4 px-4 text-center">Perf. Score</th>
                      <th className="py-4 px-4 text-center">Trend</th>
                      <th className="py-4 px-4 text-center">Readiness</th>
                      <th className="py-4 px-4 text-center">Rating</th>
                      <th className="py-4 px-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/40 transition-all">
                          <td className="py-5 px-8 flex items-center gap-4">
                            {member.avatar && !member.avatar.includes('unsplash.com') ? (
                              <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                                {member.initials || member.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-black text-slate-900 text-base leading-tight">{member.name}</p>
                              <p className="text-xs font-bold text-slate-400 mt-1">{member.role}</p>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-center font-black text-slate-800 text-base">{member.score} <span className="text-xs text-slate-400 font-bold">/ 10</span></td>
                          <td className="py-5 px-4 text-center">
                            <span className={`text-sm font-black ${member.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {member.trend}
                            </span>
                          </td>
                          <td className="py-5 px-4 text-center font-black text-slate-700">{member.readiness}</td>
                          <td className="py-5 px-4 text-center">
                            <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-black border tracking-wide
                              ${member.rating === 'Excellent' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : ''}
                              ${member.rating === 'Good' ? 'bg-blue-50 border-blue-100 text-blue-700' : ''}
                              ${member.rating === 'At Risk' ? 'bg-amber-50 border-amber-100 text-amber-700' : ''}
                            `}>
                              {member.rating}
                            </span>
                          </td>
                          <td className="py-5 px-8 text-right">
                            <button 
                              onClick={() => handleOpenPlan(member)} 
                              className="text-xs font-black text-blue-600 hover:underline uppercase tracking-wider cursor-pointer"
                            >
                              Manage Plan
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400 font-semibold">
                          No team members found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub Charts Row */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* Performance Distribution */}
              <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 p-6 md:p-8">
                <h4 className="text-base font-black text-slate-400 uppercase tracking-widest mb-6">Performance Distribution</h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} barSize={36}>
                      <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} />
                      <Bar dataKey="count" fill="#e2e8f0" radius={[6, 6, 0, 0]}>
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index >= 3 ? '#6366f1' : '#cbd5e1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col justify-between">
                <h4 className="text-base font-black text-slate-400 uppercase tracking-widest mb-2">Category Breakdown</h4>
                <div className="flex items-center justify-around h-full">
                  <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={breakdownData} innerRadius={38} outerRadius={52} paddingAngle={4} dataKey="value">
                          {breakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-900">{members.length}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-0.5">Total</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm font-semibold">
                    {breakdownData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-500 min-w-[60px] font-bold">{item.name}</span>
                        <span className="font-black text-slate-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Risk & AI Sidebars */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* Performance Risks Breakdown Block */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-xs font-black tracking-widest uppercase text-rose-600 mb-5">Performance Risks ({atRiskMembers.length})</h3>
              
              {atRiskMembers.length > 0 ? (
                <div className="space-y-4">
                  {atRiskMembers.map((atRisk) => (
                    <div key={atRisk.id} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {atRisk.avatar && !atRisk.avatar.includes('unsplash.com') ? (
                            <img src={atRisk.avatar} alt={atRisk.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                              {atRisk.initials || atRisk.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="text-base font-black text-slate-900 leading-tight">{atRisk.name}</h4>
                            <p className="text-xs text-rose-600 font-extrabold mt-0.5">Score: {atRisk.score}</p>
                          </div>
                        </div>
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          At Risk
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-semibold mt-4 leading-relaxed">
                        {atRisk.reason}
                      </p>
                      <button 
                        onClick={() => handleOpenPlan(atRisk)}
                        className="w-full mt-5 bg-white border border-rose-200 text-rose-600 text-xs font-black py-3 px-4 rounded-xl shadow-sm hover:bg-rose-50 transition-all uppercase tracking-wider cursor-pointer"
                      >
                        Improvement Plan
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs font-bold text-emerald-600 bg-emerald-50 rounded-2xl border border-emerald-100">
                  ✓ No performance risk alerts detected in your team!
                </div>
              )}
            </div>

            {/* AI Performance Intelligence Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-5 text-indigo-600">
                <Sparkles size={20} />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">AI Performance Intelligence</h3>
              </div>
              
              <div className="space-y-5">
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Velocity Forecast</h4>
                  <p className="text-sm text-slate-600 font-semibold mt-1.5 leading-relaxed">
                    {aiIntelligence.velocityReason || `Predicting velocity expansion based on verified skill acquisition and training progression.`}
                  </p>
                  <p className="text-[11px] text-indigo-500 font-bold mt-2">
                    Confidence Score: {aiIntelligence.confidenceScore || '88%'}
                  </p>
                </div>

                <div className="border-l-4 border-slate-300 pl-4 py-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Prescriptive Intervention</h4>
                  <p className="text-sm text-slate-600 font-semibold mt-1.5 leading-relaxed">
                    {aiIntelligence.prescriptiveRecommendation || `All team capability baselines currently stabilized.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Dark Panel */}
            <div className="bg-[#0b1221] rounded-[2.5rem] p-8 shadow-2xl text-white">
              <h3 className="text-xl font-bold tracking-tight mb-5">Quick Actions</h3>
              <div className="space-y-3.5">
                <button 
                  onClick={() => setActiveModal('gaps')}
                  className="w-full bg-[#172033] text-slate-200 text-xs font-black py-4 px-5 rounded-xl hover:bg-[#202b44] transition-colors text-left flex items-center justify-between uppercase tracking-wider cursor-pointer"
                >
                  <span>Analyze Skill Gaps ({teamSkillGaps.length})</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
                <button 
                  onClick={() => handleOpenPlan(atRiskMembers[0] || members[0])}
                  disabled={members.length === 0}
                  className="w-full bg-[#172033] disabled:opacity-50 text-slate-200 text-xs font-black py-4 px-5 rounded-xl hover:bg-[#202b44] transition-colors text-left flex items-center justify-between uppercase tracking-wider cursor-pointer"
                >
                  <span>Assign Training ({atRiskMembers.length} Risks)</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport || members.length === 0}
                  className="w-full bg-blue-600 text-white text-xs font-black py-4 px-5 rounded-xl hover:bg-blue-700 transition-all text-center shadow-lg shadow-blue-600/20 uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-700"
                >
                  {isGeneratingReport ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>{isGeneratingReport ? 'Compiling Report...' : 'Generate Performance Report'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* --- Action Modals --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          
          {/* 1. Improvement Plan Modal */}
          {activeModal === 'plan' && (
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-blue-600" size={20} />
                  <h3 className="text-lg font-bold text-slate-900">Performance Improvement Plan</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              {selectedMemberForPlan && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                      {selectedMemberForPlan.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{selectedMemberForPlan.name}</p>
                      <p className="text-xs text-slate-500">{selectedMemberForPlan.role} • Current Rating: <span className="font-bold text-rose-600">{selectedMemberForPlan.rating}</span></p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Assign Targeted Course</label>
                    <select 
                      value={selectedCourseIdForPlan} 
                      onChange={(e) => setSelectedCourseIdForPlan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableCourses.length === 0 ? (
                        <option value="">No courses available</option>
                      ) : (
                        availableCourses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} ({c.level || 'Intermediate'})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Milestone Target Date</label>
                    <input 
                      type="date" 
                      value={planTargetDate} 
                      onChange={(e) => setPlanTargetDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setActiveModal(null)} className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button 
                  onClick={handleAssignPlanSubmit} 
                  disabled={assigningPlan || !selectedCourseIdForPlan}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  {assigningPlan ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>{assigningPlan ? 'Assigning...' : 'Assign Plan'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Report Generated Modal */}
          {activeModal === 'report' && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6 text-center border border-slate-100">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Performance Report Ready</h3>
                <p className="text-xs text-slate-500 font-semibold mt-2">
                  The capability audit for <span className="text-slate-900 font-bold">{timeRange}</span> has been compiled with live database performance indices.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2 border border-slate-100 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Reporting Range:</span>
                  <span className="font-bold text-slate-800">{timeRange}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Overall Team Score:</span>
                  <span className="font-bold text-indigo-600">{summary.overallTeamScorePct}% ({summary.overallTier})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Monitored Personnel:</span>
                  <span className="font-bold text-slate-800">{members.length} Members</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Identified Risk Alerts:</span>
                  <span className={`font-bold ${atRiskMembers.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {atRiskMembers.length} Requiring Action
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => { window.print(); }} 
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          )}

          {/* 3. Skill Gap Analysis Modal */}
          {activeModal === 'gaps' && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-indigo-600" size={18} />
                  <h3 className="text-lg font-bold text-slate-900">AI Skill Gap Analysis</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              {teamSkillGaps.length === 0 ? (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <p className="text-xs font-bold text-emerald-800">Zero Critical Skill Gaps Detected</p>
                  <p className="text-[11px] text-emerald-600 mt-1">All monitored team competencies currently fulfill benchmark requirements.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {teamSkillGaps.map((g, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-slate-900">{g.skillName || g.name}</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {g.description || `${g.deficit || 15}% gap identified against organizational benchmark.`}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider whitespace-nowrap ${
                        g.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {g.severity || 'Moderate'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
                Close
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}