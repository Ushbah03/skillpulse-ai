import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamLeaderSidebar from './TeamLeaderSidebar';
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
      { main: 'bg-blue-500', shaded: 'bg-blue-100/70' },
      { main: 'bg-cyan-400', shaded: 'bg-cyan-100/70' },
      { main: 'bg-emerald-500', shaded: 'bg-emerald-100/70' },
      { main: 'bg-purple-500', shaded: 'bg-purple-100/70' },
      { main: 'bg-amber-500', shaded: 'bg-amber-100/70' },
      { main: 'bg-indigo-500', shaded: 'bg-indigo-100/70' },
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
      const colors = ['bg-blue-600', 'bg-amber-500', 'bg-emerald-500', 'bg-purple-600', 'bg-cyan-500'];
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

  // Dynamic performance trend points from live performance engine
  const trendPoints = React.useMemo(() => {
    if (perfData?.trendData && Array.isArray(perfData.trendData) && perfData.trendData.length > 0) {
      return perfData.trendData;
    }
    return [];
  }, [perfData]);

  const { pathD, pts } = React.useMemo(() => {
    if (!trendPoints.length) return { pathD: '', pts: [] };
    const n = trendPoints.length;
    const computedPts = trendPoints.map((pt, i) => {
      const x = n === 1 ? 50 : 8 + (i / (n - 1)) * 84;
      const score = Math.min(100, Math.max(0, pt.current || 0));
      const y = 44 - (score / 100) * 36;
      return { x, y, score, month: pt.month };
    });
    const d = computedPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return { pathD: d, pts: computedPts };
  }, [trendPoints]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar - Fixed Positioned */}
      <TeamLeaderSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0b1221] tracking-tight">Team Leader Dashboard</h1>
            <p className="text-slate-500 text-base font-medium mt-1">Monitor team readiness, performance, and skill intelligence</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <select 
                value={selectedTeam} 
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none cursor-pointer"
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
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none cursor-pointer"
              >
                <option value="This Quarter">This Quarter</option>
                <option value="Last Month">Last Month</option>
                <option value="This Year">This Year</option>
              </select>
            </div>

            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
                TL
              </div>
            </div>
          </div>
        </header>

        {loading && (
          <div className="flex items-center gap-2 mb-6 text-sm text-blue-600 font-semibold bg-blue-50/70 p-3 rounded-xl">
            <Loader2 className="animate-spin" size={16} />
            Updating dashboard metrics from server...
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard title="Team Readiness" value={stats.readiness} sub="vs last month" icon={<TrendingUp className="text-blue-500" />} color="blue" trend={stats.readinessTrend} />
          <StatCard title="Avg. Skill Level" value={stats.avgSkill} sub="vs last month" icon={<Star className="text-purple-500" />} color="purple" trend={stats.avgSkillTrend} />
          <StatCard title="Training Completion" value={stats.completion} sub="All assigned completed" icon={<Clock className="text-emerald-500" />} color="emerald" trend={stats.completionTrend} />
          <StatCard title="Skill Gap Risk" value={stats.risk} sub="Critical Skills" icon={<AlertTriangle className="text-amber-500" />} color="amber" trend={stats.riskTrend} isRisk={true} />
        </div>

        {/* Dashboard Main layout grid */}
        <div className="space-y-8">
          
          {/* Team Skill Strength Overview */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Team Skill Strength Overview</h3>
              <button 
                onClick={() => navigate('/team-leader/skill-overview')} 
                className="text-blue-600 font-bold text-base hover:underline border-0 bg-transparent cursor-pointer"
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
          <div className="grid grid-cols-2 gap-8">
            {/* Top Performing Members */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Top Performing Members</h3>
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
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Team Training Progress</h3>
                <button 
                  onClick={() => navigate('/team-leader/assign-learning')}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
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

          {/* Row 3: AI Insights Side-by-Side with Performance Trend */}
          <div className="grid grid-cols-12 gap-8 items-stretch mt-8">
            
            {/* AI Insights Panel */}
            <div className="col-span-12 lg:col-span-7 bg-[#0b0f19] p-7 rounded-[2rem] text-white relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <BrainCircuit className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold tracking-tight">AI Team Insights</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Automated Squad Synergy & Predictive Intelligence</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-200">Squad Synergy & Resilience</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {overviewData?.aiInsights?.synergyScore || (overviewData?.stats?.synergyScore || '100%')}
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                      {overviewData?.aiInsights?.aiRecommendation || (overviewData?.aiInsights?.spofSkills?.length > 0 
                        ? `Single Point of Failure risk detected in ${overviewData.aiInsights.spofSkills.slice(0, 2).join(', ')}. Cross-train team members to eliminate bottleneck risks.` 
                        : 'Squad capability baseline is well-balanced across active deliverables.')}
                    </p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-200">Predictive Velocity Uplift</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        +{perfData?.aiPredictive?.velocityIncreasePct || (filteredMembers.length > 0 ? 8 : 0)}% Lift
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                      {perfData?.aiPredictive?.velocityReason || (filteredMembers.length > 0 
                        ? `${filteredMembers.length} active team members evaluated. Completing targeted upskilling modules will accelerate sprint delivery.` 
                        : 'Add team members to receive AI predictive velocity projections.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Action Grid */}
              <div className="border-t border-white/5 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-1">Quick Team Actions</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <ActionBtn onClick={() => navigate('/team-leader/skill-overview')} icon={<Flag size={14} />} text="Skill Overview" />
                  <ActionBtn onClick={() => navigate('/team-leader/assign-learning')} icon={<BookOpenCheck size={14} />} text="Assign Training" />
                  <ActionBtn onClick={() => navigate('/team-leader/gap-analysis')} icon={<GanttChartSquare size={14} />} text="Analyze Gaps" />
                  <ActionBtn onClick={() => navigate('/team-leader/reports')} icon={<FileBarChart size={14} />} text="Generate Report" />
                </div>
              </div>
            </div>

            {/* Performance Trend Chart Line */}
            <div className="col-span-12 lg:col-span-5 bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[380px]">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Performance Trend</h3>
                <p className="text-sm text-slate-400 font-medium mb-6">Longitudinal evaluation timeline of team sprint delivery</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-end pb-2 relative">
                {trendPoints.length > 0 ? (
                  <>
                    <div className="h-44 relative w-full px-2">
                      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                        <path 
                          d={pathD} 
                          stroke="#0ea5e9" 
                          strokeWidth="2.5" 
                          fill="none" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        {pts.map((p, idx) => (
                          <circle key={idx} cx={p.x} cy={p.y} r="3" fill="#0ea5e9" className="transition-all" />
                        ))}
                      </svg>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-6 px-2 border-t border-slate-100 pt-3">
                      {trendPoints.map((tp, idx) => (
                        <span key={idx}>{tp.month || `M${idx + 1}`}</span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-44 flex items-center justify-center text-slate-400 text-xs font-semibold">
                    No timeline performance evaluations recorded yet.
                  </div>
                )}
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
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-xs font-bold mb-1">{title}</p>
          <h4 className={`text-4xl font-black tracking-tight ${isRisk ? 'text-amber-500' : 'text-slate-900'}`}>{value}</h4>
        </div>
        <div className={`w-10 h-10 rounded-xl ${bgMap[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${trend.includes('+') || trend.includes('5.2') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
          {trend}
        </span>
        <span className="text-xs font-medium text-slate-400">{sub}</span>
      </div>
      {title === "Team Readiness" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400"></div>}
    </div>
  );
};

const ChartBar = ({ label, h, shadedH, shadedColor, mainColor }) => (
  <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
    <div className="w-full rounded-xl overflow-hidden relative group cursor-pointer transition-all flex flex-col justify-end" style={{ height: h }}>
      <div className={`w-full rounded-t-xl ${shadedColor}`} style={{ height: shadedH }}></div>
      <div className={`w-full flex-1 ${mainColor}`}></div>
    </div>
    <span className="text-xs font-bold text-slate-400 tracking-tight mt-1">{label}</span>
  </div>
);

const TeamMemberRow = ({ initials, name, role, score, status, onClick }) => (
  <div onClick={onClick} className="flex justify-between items-center p-3.5 bg-slate-50/60 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center tracking-tight group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        {initials}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 leading-tight">{name}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{role}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-slate-800 leading-none">{score}</p>
      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{status}</p>
    </div>
  </div>
);

const ProgressBar = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="text-slate-700">{label}</span>
      <span className="text-slate-900">{percent}</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: percent }}></div>
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