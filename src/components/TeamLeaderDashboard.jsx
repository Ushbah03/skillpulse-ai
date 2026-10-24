import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { teamLeaderAPI } from '../services/api';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Star,
  BrainCircuit,
  Flag,
  BookOpenCheck,
  GanttChartSquare,
  FileBarChart,
  Loader2
} from 'lucide-react';

const TeamLeaderDashboard = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Quarter');
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [gapsData, setGapsData] = useState(null);
  const [perfData, setPerfData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [overviewRes, readinessRes, gapsRes, perfRes] = await Promise.allSettled([
          teamLeaderAPI.getOverview(),
          teamLeaderAPI.getReadiness(),
          teamLeaderAPI.getGaps(),
          teamLeaderAPI.getPerformance()
        ]);

        if (isMounted) {
          if (overviewRes.status === 'fulfilled' && overviewRes.value) {
            setOverviewData(overviewRes.value.data || overviewRes.value);
          }
          if (readinessRes.status === 'fulfilled' && readinessRes.value) {
            setReadinessData(readinessRes.value.data || readinessRes.value);
          }
          if (gapsRes.status === 'fulfilled' && gapsRes.value) {
            setGapsData(gapsRes.value);
          }
          if (perfRes.status === 'fulfilled' && perfRes.value) {
            setPerfData(perfRes.value.data || perfRes.value);
          }
        }
      } catch (err) {
        console.warn('Backend endpoint error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboardData();
    return () => { isMounted = false; };
  }, [selectedTimeframe]);

  // Extract teams from backend response
  const leaderTeams = React.useMemo(() => {
    return overviewData?.teams || [];
  }, [overviewData]);

  // Extract all members across teams
  const allLiveMembers = React.useMemo(() => {
    if (!overviewData || !Array.isArray(overviewData.members)) {
      if (Array.isArray(overviewData)) {
        const memberMap = new Map();
        overviewData.forEach(team => {
          if (team.members && Array.isArray(team.members)) {
            team.members.forEach(m => {
              if (!memberMap.has(m.id)) memberMap.set(m.id, m);
            });
          }
        });
        return Array.from(memberMap.values());
      }
      return [];
    }
    return overviewData.members;
  }, [overviewData]);

  // Filter members by selected team
  const filteredMembers = React.useMemo(() => {
    if (selectedTeam === 'ALL') return allLiveMembers;
    return allLiveMembers.filter(m => m.teamId === selectedTeam);
  }, [allLiveMembers, selectedTeam]);

  // Dynamic live calculations from actual DB
  const stats = React.useMemo(() => {
    const overallScore = readinessData?.overallScore !== undefined 
      ? readinessData.overallScore 
      : (overviewData?.stats?.avgReadiness ? parseInt(overviewData.stats.avgReadiness) : 0);
    
    const criticalGapsCount = gapsData?.count ?? gapsData?.gaps?.filter(g => g.severity === 'Critical' || g.severity === 'CRITICAL')?.length ?? 0;
    
    // Average skill rating calculation
    let totalProficiency = 0;
    let proficiencyCount = 0;
    filteredMembers.forEach(m => {
      if (m.skills && Array.isArray(m.skills)) {
        m.skills.forEach(s => {
          totalProficiency += (s.proficiencyLevel || 0);
          proficiencyCount++;
        });
      }
    });
    const avgRating = proficiencyCount > 0 
      ? ((totalProficiency / proficiencyCount) * 2).toFixed(1) 
      : '0.0';

    // Real Training completion rate from enrollments
    const allEnrollments = filteredMembers.flatMap(m => m.enrollments || []);
    const completedCount = allEnrollments.filter(e => e.status === 'COMPLETED' || e.progressPct >= 100).length;
    const completionPct = allEnrollments.length > 0 
      ? `${Math.round((completedCount / allEnrollments.length) * 100)}%` 
      : (readinessData?.complianceIndex || '0%');

    return {
      readiness: `${overallScore}%`,
      readinessTrend: '+0.0%',
      avgSkill: `${avgRating}/10`,
      avgSkillTrend: '+0.0',
      completion: completionPct,
      completionTrend: `${completedCount}/${allEnrollments.length || 0} Modules`,
      risk: criticalGapsCount > 3 ? 'High' : (criticalGapsCount > 0 ? 'Medium' : 'Low'),
      riskTrend: `${criticalGapsCount} Active Gaps`
    };
  }, [filteredMembers, readinessData, gapsData, overviewData]);

  // Dynamic skill strength bars from real skills
  const skillBars = React.useMemo(() => {
    if (!filteredMembers.length) return [];

    const skillMap = {};
    filteredMembers.forEach(m => {
      if (m.skills && Array.isArray(m.skills)) {
        m.skills.forEach(s => {
          const name = s.skill?.name || 'General';
          if (!skillMap[name]) skillMap[name] = { total: 0, count: 0 };
          skillMap[name].total += (s.proficiencyLevel || 0);
          skillMap[name].count += 1;
        });
      }
    });

    const colors = [
      { main: 'bg-gradient-to-t from-[#1988A3] to-[#11C6DE]', shaded: 'bg-[#11C6DE]/20' },
      { main: 'bg-gradient-to-t from-[#17233E] to-[#1B3154]', shaded: 'bg-[#1B3154]/20' },
      { main: 'bg-gradient-to-t from-[#157289] to-[#1988A3]', shaded: 'bg-[#1988A3]/20' },
      { main: 'bg-gradient-to-t from-[#5A6D89] to-[#8A9CB7]', shaded: 'bg-[#8A9CB7]/20' },
      { main: 'bg-gradient-to-t from-[#0EB3C9] to-[#11C6DE]', shaded: 'bg-[#11C6DE]/20' },
      { main: 'bg-gradient-to-t from-[#17233E] to-[#1988A3]', shaded: 'bg-[#1988A3]/20' },
    ];

    const entries = Object.entries(skillMap).slice(0, 6);
    return entries.map(([label, data], idx) => {
      const avg = data.count > 0 ? data.total / data.count : 0; // 1 to 5
      const pct = Math.min(100, Math.round((avg / 5) * 100));
      const col = colors[idx % colors.length];
      return {
        label,
        h: `${pct}%`,
        shadedH: `${Math.round(pct * 0.3)}%`,
        shadedColor: col.shaded,
        mainColor: col.main
      };
    });
  }, [filteredMembers]);

  // Dynamic top members from real DB members
  const members = React.useMemo(() => {
    if (!filteredMembers.length) return [];

    return filteredMembers.slice(0, 4).map(m => {
      const initials = `${m.firstName?.[0] || ''}${m.lastName?.[0] || ''}`.toUpperCase() || 'EM';
      const fullName = `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Team Member';
      
      const totalProf = (m.skills || []).reduce((acc, s) => acc + (s.proficiencyLevel || 0), 0);
      const maxPossible = (m.skills?.length || 1) * 5;
      const score = m.skills?.length > 0 ? Math.round((totalProf / maxPossible) * 100) : 0;
      const status = score >= 80 ? 'Proficient' : (score >= 50 ? 'Developing' : 'Needs Support');

      return {
        initials,
        name: fullName,
        role: m.jobTitle || 'Software Engineer',
        score: `${score}/100`,
        status
      };
    });
  }, [filteredMembers]);

  // Dynamic training progress from real skill gaps and courses
  const trainingProgress = React.useMemo(() => {
    const allEnrollments = filteredMembers.flatMap(m => m.enrollments || []);
    if (allEnrollments.length > 0) {
      const colors = ['bg-[#1988A3]', 'bg-[#11C6DE]', 'bg-[#1B3154]', 'bg-[#0EB3C9]', 'bg-[#5A6D89]'];
      return allEnrollments.slice(0, 4).map((e, idx) => {
        const title = e.course?.title || e.courseTitle || 'Technical Training Course';
        const pct = Math.min(100, Math.max(0, Math.round(e.progressPct ?? (e.status === 'COMPLETED' ? 100 : (e.status === 'IN_PROGRESS' ? 50 : 0)))));
        return {
          label: title,
          percent: `${pct}%`,
          color: colors[idx % colors.length]
        };
      });
    }

    if (gapsData?.gaps && gapsData.gaps.length > 0) {
      const gapsWithCourses = gapsData.gaps.filter(g => g.assignedCourse || g.training);
      if (gapsWithCourses.length > 0) {
        const colors = ['bg-blue-600', 'bg-amber-500', 'bg-emerald-500'];
        return gapsWithCourses.slice(0, 3).map((g, idx) => ({
          label: g.training || g.assignedCourse?.title || `${g.skill} Mastery Track`,
          percent: g.isAlreadyEnrolled ? '50%' : '0%',
          color: colors[idx % colors.length]
        }));
      }
    }

    return [];
  }, [filteredMembers, gapsData]);
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
      {/* Sidebar - Fixed Positioned */}
      <TeamLeaderSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full relative z-10 space-y-8">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#17233E] tracking-tight">Team Leader <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Dashboard</span></h1>
            <p className="text-[#8A9CB7] text-sm md:text-base font-medium mt-1">Monitor squad readiness, capability telemetry, and skill intelligence</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <select 
                value={selectedTeam} 
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-[#F0F5FB]/90 backdrop-blur-md border border-white/85 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#17233E] shadow-sm focus:outline-none focus:border-[#1988A3] cursor-pointer transition-colors"
              >
                <option value="ALL">All My Teams (Combined)</option>
                {leaderTeams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <select 
                value={selectedTimeframe} 
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-[#F0F5FB]/90 backdrop-blur-md border border-white/85 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#17233E] shadow-sm focus:outline-none focus:border-[#1988A3] cursor-pointer transition-colors"
              >
                <option value="This Quarter">This Quarter</option>
                <option value="Last Month">Last Month</option>
                <option value="This Year">This Year</option>
              </select>
            </div>

            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/60 bg-white/80 backdrop-blur-md shadow-sm flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#1988A3] flex items-center justify-center text-xs font-black text-white shadow-inner">
                TL
              </div>
            </div>
          </div>
        </header>

        {loading && (
          <div className="my-6">
            <SkillPulseLoader message="Synchronizing Team Intelligence Telemetry..." fullScreen={false} />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Team Readiness" value={stats.readiness} sub="vs last month" icon={<TrendingUp className="text-blue-500" />} color="blue" trend={stats.readinessTrend} />
          <StatCard title="Avg. Skill Level" value={stats.avgSkill} sub="vs last month" icon={<Star className="text-purple-500" />} color="purple" trend={stats.avgSkillTrend} />
          <StatCard title="Training Completion" value={stats.completion} sub="All assigned completed" icon={<Clock className="text-emerald-500" />} color="emerald" trend={stats.completionTrend} />
          <StatCard title="Skill Gap Risk" value={stats.risk} sub="Critical Skills" icon={<AlertTriangle className="text-amber-500" />} color="amber" trend={stats.riskTrend} isRisk={true} />
        </div>

        {/* Dashboard Main layout grid */}
        <div className="space-y-8">
          
          {/* Team Skill Strength Overview */}
          <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl md:text-2xl font-extrabold text-[#17233E] tracking-tight">Team Skill Strength Overview</h3>
              <button 
                onClick={() => navigate('/team-leader/skill-overview')} 
                className="text-[#1988A3] hover:text-[#11C6DE] font-bold text-sm hover:underline border-0 bg-transparent cursor-pointer transition-colors"
              >
                View Details
              </button>
            </div>
            
            <div className="flex items-end justify-between h-64 px-4 gap-6">
              {skillBars.length > 0 ? (
                skillBars.map((bar, idx) => (
                  <ChartBar key={idx} label={bar.label} h={bar.h} shadedH={bar.shadedH} shadedColor={bar.shadedColor} mainColor={bar.mainColor} />
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-sm">
                  No team skills recorded yet in database.
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Members & Progress blocks - 50/50 split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Members */}
            <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-extrabold text-[#17233E] tracking-tight">Top Performing Members</h3>
                <button 
                  onClick={() => navigate('/team-leader/member-profile')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  Manage All
                </button>
              </div>
              <div className="space-y-4">
                {members.length > 0 ? (
                  members.map((m, i) => (
                    <TeamMemberRow key={i} initials={m.initials} name={m.name} role={m.role} score={m.score} status={m.status} onClick={() => navigate(`/team-leader/member-profile?name=${encodeURIComponent(m.name)}`)} />
                  ))
                ) : (
                  <p className="text-xs text-slate-400 font-medium py-8 text-center">No team members found in database.</p>
                )}
              </div>
            </div>

            {/* Team Training Progress */}
            <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-extrabold text-[#17233E] tracking-tight">Team Training Progress</h3>
                <button 
                  onClick={() => navigate('/team-leader/assign-learning')}
                  className="text-xs font-bold text-[#1988A3] hover:text-[#11C6DE] hover:underline cursor-pointer transition-colors"
                >
                  Assign More
                </button>
              </div>
              <div className="space-y-5">
                {trainingProgress.length > 0 ? (
                  trainingProgress.map((tp, i) => (
                    <ProgressBar key={i} label={tp.label} percent={tp.percent} color={tp.color} />
                  ))
                ) : (
                  <p className="text-xs text-slate-400 font-medium py-8 text-center">No active training courses in progress.</p>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: AI Team Insights Module */}
          <div className="bg-gradient-to-br from-[#17233E]/95 via-[#1B3154]/95 to-[#121E33]/95 backdrop-blur-2xl p-6 md:p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl border border-white/15 mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <BrainCircuit className="text-indigo-400" size={22} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold tracking-tight">AI Team Insights</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Automated Squad Synergy & Predictive Workforce Intelligence</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-bold text-slate-200">Squad Synergy & Resilience</span>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                    Synergy: {overviewData?.aiInsights?.synergyScore || (overviewData?.stats?.synergyScore || '100%')}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {overviewData?.aiInsights?.aiRecommendation || (overviewData?.aiInsights?.spofSkills?.length > 0 
                    ? `Single Point of Failure risk detected in ${overviewData.aiInsights.spofSkills.slice(0, 2).join(', ')}. Cross-train team members to eliminate bottleneck risks.` 
                    : 'Squad capability baseline is well-balanced across active deliverables.')}
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-bold text-slate-200">Predictive Velocity Uplift</span>
                  <span className="text-xs font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 px-3 py-1 rounded-lg border border-sky-500/20">
                    +{perfData?.aiPredictive?.velocityIncreasePct || (filteredMembers.length > 0 ? 8 : 0)}% Lift
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {perfData?.aiPredictive?.velocityReason || (filteredMembers.length > 0 
                    ? `${filteredMembers.length} active team members evaluated. Completing targeted upskilling modules will accelerate sprint delivery.` 
                    : 'Add team members to receive AI predictive velocity projections.')}
                </p>
              </div>
            </div>

            {/* Quick Actions Action Grid */}
            <div className="border-t border-white/5 pt-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-1">Quick Team Actions</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ActionBtn onClick={() => navigate('/team-leader/skill-overview')} icon={<Flag size={14} />} text="Skill Overview" />
                <ActionBtn onClick={() => navigate('/team-leader/assign-learning')} icon={<BookOpenCheck size={14} />} text="Assign Training" />
                <ActionBtn onClick={() => navigate('/team-leader/gap-analysis')} icon={<GanttChartSquare size={14} />} text="Analyze Gaps" />
                <ActionBtn onClick={() => navigate('/team-leader/reports')} icon={<FileBarChart size={14} />} text="Generate Report" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

/* --- Sub-components --- */

const StatCard = ({ title, value, sub, icon, color, trend, isRisk=false }) => {
  const bgMap = {
    blue: 'bg-blue-50/60',
    purple: 'bg-purple-50/60',
    emerald: 'bg-emerald-50/60',
    amber: 'bg-amber-50/60',
  };
  
  return (
    <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[#8A9CB7] text-xs font-bold mb-1 uppercase tracking-wider">{title}</p>
          <h4 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isRisk ? 'text-amber-500' : 'text-[#17233E]'}`}>{value}</h4>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1988A3]/15 to-[#11C6DE]/15 border border-[#1988A3]/30 flex items-center justify-center text-[#1988A3]">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${trend.includes('+') || trend.includes('5.2') ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-white/80 text-[#8A9CB7] border border-white/80'}`}>
          {trend}
        </span>
        <span className="text-xs font-medium text-[#8A9CB7]">{sub}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] opacity-80" />
    </div>
  );
};

const ChartBar = ({ label, h, shadedH, shadedColor, mainColor }) => (
  <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
    <div className="w-full rounded-xl overflow-hidden relative group cursor-pointer transition-all flex flex-col justify-end" style={{ height: h }}>
      <div className={`w-full rounded-t-xl ${shadedColor}`} style={{ height: shadedH }}></div>
      <div className={`w-full flex-1 ${mainColor}`}></div>
    </div>
    <span className="text-xs font-semibold text-[#8A9CB7] tracking-tight mt-1 text-center truncate max-w-full">{label}</span>
  </div>
);

const TeamMemberRow = ({ initials, name, role, score, status, onClick }) => (
  <div onClick={onClick} className="flex justify-between items-center p-3.5 bg-[#E4EEF8]/60 backdrop-blur-md rounded-2xl border border-white/85 hover:border-[#1988A3]/50 hover:bg-[#E4EEF8]/90 transition-all group cursor-pointer shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#17233E] to-[#1B3154] text-[#11C6DE] border border-white/20 font-bold text-xs flex items-center justify-center tracking-tight transition-colors shadow-sm">
        {initials}
      </div>
      <div>
        <p className="text-sm font-bold text-[#17233E] leading-tight group-hover:text-[#1988A3] transition-colors">{name}</p>
        <p className="text-xs text-[#8A9CB7] font-medium mt-0.5">{role}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-extrabold text-[#17233E] leading-none">{score}</p>
      <p className="text-[10px] font-extrabold text-[#1988A3] mt-1 uppercase tracking-wider">{status}</p>
    </div>
  </div>
);

const ProgressBar = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="text-[#17233E] font-semibold">{label}</span>
      <span className="text-[#1988A3] font-extrabold">{percent}</span>
    </div>
    <div className="h-2.5 w-full bg-[#DDEBF8] rounded-full overflow-hidden p-0.5 border border-white/80">
      <div className="h-full bg-gradient-to-r from-[#1988A3] to-[#11C6DE] rounded-full transition-all duration-500 shadow-sm" style={{ width: percent }} />
    </div>
  </div>
);

const ActionBtn = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] text-white font-semibold text-[10px] py-2 px-2.5 rounded-lg transition-all flex-1 whitespace-nowrap cursor-pointer"
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default TeamLeaderDashboard;