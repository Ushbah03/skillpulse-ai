import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { 
  Search, Bell, PlayCircle, TrendingUp, Layers, Zap, Star, Target, Sparkles, ChevronRight, X, CheckCircle2, AlertCircle, BookOpen
} from 'lucide-react';
import { employeeAPI } from '../services/api';
import SkillPulseLoader from './SkillPulseLoader';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [profileRes, gapsRes, coursesRes] = await Promise.allSettled([
          employeeAPI.getProfile(),
          employeeAPI.getGaps(),
          employeeAPI.getLearningRecs()
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value?.success && profileRes.value?.data) {
          setProfile(profileRes.value.data);
        }
        if (gapsRes.status === 'fulfilled' && gapsRes.value?.success && gapsRes.value?.data) {
          setGaps(gapsRes.value.data);
        }
        if (coursesRes.status === 'fulfilled' && coursesRes.value?.success && coursesRes.value?.data) {
          setCourses(coursesRes.value.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const user = profile || storedUser;
  const displayName = user.firstName ? `${user.firstName} ${user.lastName}` : (storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : 'Employee User');
  const systemRole = user.role || storedUser.role || 'EMPLOYEE';
  const displayJobTitle = user.jobTitle || storedUser.jobTitle || 'Product Designer';
  const workspaceName = user.tenant?.name || storedUser.tenant?.name || 'Enterprise Workspace';
  const userInitials = `${displayName.charAt(0) || 'E'}`;

  const skillsList = Array.isArray(user.userSkills) ? user.userSkills : (Array.isArray(user.skills) ? user.skills : []);
  const totalSkillsCount = skillsList.length;
  const validatedSkillsCount = skillsList.filter(s => s.verified || s.isVerified).length;
  const activeGapsList = Array.isArray(gaps) ? gaps : (Array.isArray(gaps?.gaps) ? gaps.gaps : (Array.isArray(gaps?.data) ? gaps.data : []));

  // Calculate Real Radar Data from actual PostgreSQL skills
  const radarMap = {};
  skillsList.forEach(s => {
    const cat = s.skill?.category?.name || 'Technical';
    if (!radarMap[cat]) radarMap[cat] = { total: 0, count: 0 };
    radarMap[cat].total += (s.proficiencyLevel || 3.0);
    radarMap[cat].count += 1;
  });

  const radarData = Object.keys(radarMap).length > 0 
    ? Object.keys(radarMap).map(cat => ({
        subject: cat,
        A: Math.round((radarMap[cat].total / radarMap[cat].count) * 20)
      }))
    : [
        { subject: 'Technical', A: 0 },
        { subject: 'Domain', A: 0 },
        { subject: 'Soft Skills', A: 0 },
        { subject: 'Leadership', A: 0 }
      ];

  // Calculate Real Overall Skill Readiness (77% for 3.8/5 avg)
  const avgProf = skillsList.length > 0 
    ? (skillsList.reduce((acc, curr) => acc + (curr.proficiencyLevel || 0), 0) / skillsList.length)
    : 0;
  
  let readinessPct = 0;
  if (skillsList.length > 0) {
    readinessPct = Math.min(100, Math.round((avgProf / 5.0) * 100));
  } else if (activeGapsList.length > 0) {
    readinessPct = 72;
  } else {
    readinessPct = 0;
  }

  // Filter dynamic lists by Search Query safely
  const searchLower = searchQuery.toLowerCase().trim();
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeGaps = Array.isArray(activeGapsList) ? activeGapsList : [];
  const safeSkills = Array.isArray(skillsList) ? skillsList : [];

  const filteredCourses = safeCourses.filter(c => 
    !searchLower || c.title?.toLowerCase().includes(searchLower) || c.provider?.toLowerCase().includes(searchLower)
  );
  const filteredGaps = safeGaps.filter(g => 
    !searchLower || g.skill?.name?.toLowerCase().includes(searchLower) || g.severity?.toLowerCase().includes(searchLower)
  );
  const matchingSkills = safeSkills.filter(s => 
    !searchLower || s.skill?.name?.toLowerCase().includes(searchLower)
  );

  // Top Critical Gap for AI Card
  const topGap = safeGaps[0] || null;
  const estimatedImpact = topGap ? `+${Math.round(((topGap.requiredLevel - topGap.currentLevel) / 5.0) * 100)}%` : '+100%';

  // Real DB System Notifications
  const dbNotifications = [
    ...(safeGaps.map(g => ({
      id: `gap-${g.id}`,
      title: `Active Skill Gap: ${g.skill?.name}`,
      desc: `Required level ${g.requiredLevel} vs current ${g.currentLevel} (${g.severity || 'HIGH'} severity)`,
      type: 'warning',
      path: '/dashboard/results'
    }))),
    {
      id: 'skill-verified',
      title: `${validatedSkillsCount} Verified DB Skills`,
      desc: `PostgreSQL verified skills in your active enterprise profile.`,
      type: 'success',
      path: '/dashboard/profile'
    },
    {
      id: 'lms-catalog',
      title: `${courses.length} LMS Courses Available`,
      desc: `Explore updated courseware catalog in your workspace.`,
      type: 'info',
      path: '/dashboard/courses'
    }
  ];

  if (loading) {
    return (
      <div className="p-8 min-h-[70vh] flex items-center justify-center">
        <SkillPulseLoader message="Loading Employee Skill Intelligence..." fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="font-sans text-[#17233E] pb-12">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1988A3]/10 text-[#1988A3] px-3 py-1 rounded-full border border-[#1988A3]/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE] animate-ping" />
              {workspaceName}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#17233E] tracking-tight">Employee Dashboard</h1>
          <p className="text-[#5A6D89] text-sm mt-1 font-normal">Monitor your live skills, gaps, and learning progression in real-time</p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto justify-end">
          {/* Functional Real-Time Search Input with Dropdown Overlay */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-4 top-3 text-[#8A9CB7] w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, gaps, courses..." 
              className="pl-11 pr-9 py-2.5 bg-[#F0F5FB]/85 border border-[#8A9CB7]/30 rounded-2xl w-full md:w-72 text-sm font-medium text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:ring-2 focus:ring-[#1988A3]/25 focus:border-[#1988A3] shadow-sm transition-all" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#8A9CB7] hover:text-[#17233E]"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Instant Search Overlay */}
            {searchLower && (
              <div className="absolute top-12 left-0 right-0 z-50 glass-panel rounded-2xl shadow-xl p-3 space-y-3 border border-white/80">
                <div className="text-[10px] font-mono font-bold text-[#5A6D89] uppercase tracking-wider px-2">Live Search Results</div>
                
                {filteredCourses.length > 0 && (
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[#1988A3] uppercase tracking-wider px-2 block mb-1">Courses</span>
                    {filteredCourses.slice(0, 3).map(c => (
                      <div 
                        key={c.id}
                        onClick={() => { navigate('/dashboard/courses'); setSearchQuery(''); }}
                        className="p-2 hover:bg-[#E4EEF8]/60 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="text-xs font-bold text-[#17233E]">{c.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8A9CB7]" />
                      </div>
                    ))}
                  </div>
                )}

                {matchingSkills.length > 0 && (
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[#17233E] uppercase tracking-wider px-2 block mb-1">User Skills</span>
                    {matchingSkills.slice(0, 3).map(s => (
                      <div 
                        key={s.id}
                        onClick={() => { navigate('/dashboard/profile'); setSearchQuery(''); }}
                        className="p-2 hover:bg-[#E4EEF8]/60 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="text-xs font-bold text-[#17233E]">{s.skill?.name} (Lvl {s.proficiencyLevel})</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8A9CB7]" />
                      </div>
                    ))}
                  </div>
                )}

                {filteredGaps.length > 0 && (
                  <div>
                    <span className="text-[9px] font-mono font-bold text-amber-600 uppercase tracking-wider px-2 block mb-1">Skill Gaps</span>
                    {filteredGaps.slice(0, 2).map(g => (
                      <div 
                        key={g.id}
                        onClick={() => { navigate('/dashboard/results'); setSearchQuery(''); }}
                        className="p-2 hover:bg-[#E4EEF8]/60 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="text-xs font-bold text-[#17233E]">{g.skill?.name} ({g.severity})</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8A9CB7]" />
                      </div>
                    ))}
                  </div>
                )}

                {filteredCourses.length === 0 && matchingSkills.length === 0 && filteredGaps.length === 0 && (
                  <p className="text-xs text-[#5A6D89] p-2 text-center">No matching database items found.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Functional Notification Bell Button with Drawer */}
          <div ref={notifRef} className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 glass-pill rounded-full relative shadow-sm cursor-pointer hover:bg-white transition-all text-[#17233E]"
              aria-label="View notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {dbNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#1988A3] rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {/* Notification Drawer Modal */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 glass-panel rounded-2xl shadow-2xl p-4 z-50 border border-white/80 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#8A9CB7]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#17233E] font-mono">Notifications</h4>
                  <span className="text-[10px] font-mono font-bold text-[#1988A3] bg-[#1988A3]/10 px-2 py-0.5 rounded-full border border-[#1988A3]/20">
                    {dbNotifications.length} Alerts
                  </span>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {dbNotifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => { navigate(n.path); setShowNotifications(false); }}
                      className="p-2.5 rounded-xl bg-white/40 hover:bg-[#E4EEF8]/80 cursor-pointer border border-[#8A9CB7]/20 transition-all flex items-start gap-2.5"
                    >
                      {n.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : n.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#1988A3] shrink-0 mt-0.5" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-[#5A6D89] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-[#17233E]">{n.title}</p>
                        <p className="text-[10px] text-[#5A6D89] mt-0.5">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile Header Badge displaying Assigned System Role & Job Title */}
          <div className="flex items-center gap-3.5 border-l-2 pl-4 border-[#8A9CB7]/30">
            <div className="text-right leading-tight hidden sm:block">
              <p className="text-sm font-extrabold text-[#17233E]">{displayName}</p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-[9px] font-mono font-bold bg-[#17233E]/10 text-[#17233E] px-2 py-0.5 rounded-md uppercase tracking-wider">
                  ROLE: {systemRole.replace('_', ' ')}
                </span>
                {displayJobTitle && (
                  <span className="text-xs text-[#1988A3] font-bold tracking-tight">
                    • {displayJobTitle}
                  </span>
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#17233E] border border-white/60 shadow-md flex items-center justify-center text-white font-extrabold text-sm">
              {userInitials}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Row - Frosted Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Skill Readiness" 
          value={`${readinessPct}%`} 
          trend={`${validatedSkillsCount}/${totalSkillsCount} Verified`} 
          icon={TrendingUp} 
          iconColor="text-[#1988A3]" 
          iconBg="bg-[#1988A3]/10 border border-[#1988A3]/20" 
        />
        <StatCard 
          title="Total Skills" 
          value={totalSkillsCount} 
          sub={`${validatedSkillsCount} Validated in DB`} 
          icon={Layers} 
          iconColor="text-[#17233E]" 
          iconBg="bg-[#17233E]/10 border border-[#17233E]/20" 
        />
        <StatCard 
          title="Active Gaps" 
          value={activeGapsList.length} 
          sub={activeGapsList.length > 0 ? "Resolution Needed" : "Optimal"} 
          highlight="amber" 
          icon={Zap} 
          iconColor="text-amber-500" 
          iconBg="bg-amber-500/10 border border-amber-500/20" 
        />
        <StatCard 
          title="Competency Index" 
          value={`${avgProf.toFixed(1)}/5`} 
          sub="Role Alignment" 
          highlight="cyan" 
          icon={Star} 
          iconColor="text-[#11C6DE]" 
          iconBg="bg-[#1988A3]/10 border border-[#1988A3]/25" 
        />
      </div>

      {/* 3. Matrix and Gap Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-7 bg-[#1988A3] rounded-full"></div>
              <h3 className="font-extrabold text-[#17233E] text-lg">Skill Proficiency Matrix</h3>
            </div>
            <button 
              onClick={() => navigate('/dashboard/profile')}
              className="text-xs font-mono font-bold text-[#5A6D89] glass-pill px-4 py-2 rounded-xl hover:text-[#1988A3] transition-colors cursor-pointer"
            >
              View Profile
            </button>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#8A9CB7" strokeOpacity={0.25} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#17233E', fontSize: 13, fontWeight: 700 }} />
                <Radar dataKey="A" stroke="#1988A3" strokeWidth={3} fill="#11C6DE" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[#17233E] text-lg mb-6 flex items-center gap-2.5">
              <Target className="w-5 h-5 text-[#1988A3]" /> 
              <span>Skill Gap Summary</span>
            </h3>
            <div className="space-y-5">
              {filteredGaps.length > 0 ? (
                filteredGaps.slice(0, 3).map((g, idx) => {
                  const current = g.currentLevel || 2.0;
                  const target = g.requiredLevel || 4.5;
                  const pct = Math.min(100, Math.round((current / target) * 100));
                  const color = g.severity === 'CRITICAL' ? 'amber' : 'cyan';
                  return (
                    <GapItem 
                      key={g.id || idx}
                      title={g.skill?.name || 'Skill Gap'} 
                      status={g.severity || 'CRITICAL'} 
                      color={color} 
                      progress={pct} 
                      target={`${target} Target`} 
                      current={`${current} Current`} 
                    />
                  );
                })
              ) : (
                <div className="py-12 text-center text-[#5A6D89] font-medium text-sm">
                  {searchQuery ? 'No matching skill gaps found.' : 'No active skill gaps. Your skills meet current role requirements!'}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => navigate('/dashboard/results')}
            className="w-full mt-6 py-3.5 glass-pill rounded-2xl text-[#17233E] hover:text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>View Gap Analysis</span>
            <ChevronRight className="w-4 h-4 text-[#1988A3]" />
          </button>
        </div>
      </div>

      {/* 4. Progress and Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-[#17233E] uppercase tracking-wider font-mono flex items-center gap-2.5">
              <PlayCircle className="w-5 h-5 text-[#1988A3]" /> 
              <span>Live Courses & Learning Progress</span>
            </h3>
            <button 
              onClick={() => navigate('/dashboard/learning')}
              className="text-[#1988A3] text-xs font-bold hover:underline cursor-pointer"
            >
              View All Courses
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredCourses.length > 0 ? (
              filteredCourses.slice(0, 2).map((c, idx) => (
                <CourseCard 
                  key={c.id || idx}
                  title={c.title} 
                  skill={c.provider || 'Internal LMS'} 
                  time={`${c.durationHours || 10}h total`} 
                  progress={c.progressPct || 0} 
                  onClick={() => navigate('/dashboard/courses')}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-6 text-[#5A6D89] text-sm">
                {searchQuery ? 'No matching courses found.' : 'No active courses enrolled. Visit Learning Recommendations to enroll.'}
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Card - Executive Frosted Navy Glass */}
        <div className="bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#121E33] p-6 sm:p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col justify-between border border-white/20">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#11C6DE]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#11C6DE]">
                AI Recommendation
              </span>
            </div>
            <h4 className="text-xl font-extrabold mb-3 leading-tight tracking-tight text-white">
              {topGap ? `Target Skill: ${topGap.skill?.name}` : 'Skill Development Track'}
            </h4>
            <p className="text-[#8A9CB7] text-xs leading-relaxed mb-6">
              {topGap 
                ? `Focus on bridging your ${topGap.severity} priority gap in ${topGap.skill?.name} to reach target proficiency level ${topGap.requiredLevel}.`
                : `Your verified skill inventory meets current role requirements. Explore new catalog tracks.`}
            </p>
            
            <div className="flex gap-3 mb-6">
               <div className="bg-white/5 p-3.5 rounded-2xl flex-1 border border-white/10 text-center">
                  <p className="text-[10px] text-[#8A9CB7] uppercase font-mono font-bold mb-0.5">Impact</p>
                  <p className="font-extrabold text-[#11C6DE] text-lg">{estimatedImpact}</p>
               </div>
               <div className="bg-white/5 p-3.5 rounded-2xl flex-1 border border-white/10 text-center">
                  <p className="text-[10px] text-[#8A9CB7] uppercase font-mono font-bold mb-0.5">Priority</p>
                  <p className="font-extrabold text-white text-lg">{topGap ? topGap.severity : 'Active'}</p>
               </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/dashboard/learning')}
            className="w-full py-3.5 bg-[#1988A3] hover:bg-[#157289] text-white rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#1988A3]/30 cursor-pointer"
          >
            Enroll in AI Track
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components with Frosted Glass Styling ---

const StatCard = ({ title, value, trend, sub, icon: Icon, iconBg, iconColor, highlight }) => (
  <div className="glass-panel p-6 rounded-[2rem] hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {trend && (
        <span className="text-[11px] font-mono font-bold text-[#1988A3] bg-[#1988A3]/10 px-2.5 py-1 rounded-full border border-[#1988A3]/20">
          {trend}
        </span>
      )}
    </div>
    <p className="text-[#5A6D89] text-xs font-mono font-bold uppercase tracking-wider mb-1">{title}</p>
    <h3 className="text-3xl font-extrabold text-[#17233E] mb-1">{value}</h3>
    {sub && (
      <p className={`text-xs font-medium ${highlight === 'amber' ? 'text-amber-600' : 'text-[#5A6D89]'}`}>
        {sub}
      </p>
    )}
  </div>
);

const GapItem = ({ title, status, color, progress, target, current }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <span className="font-extrabold text-[#17233E] text-xs">{title}</span>
      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
        color === 'amber' 
          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
          : 'bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20'
      }`}>
        {status}
      </span>
    </div>
    <div className="h-2 w-full bg-[#E9EAF7] rounded-full overflow-hidden p-0.5 shadow-inner">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${
          color === 'amber' ? 'bg-amber-500' : 'bg-[#1988A3]'
        }`} 
        style={{ width: `${progress}%` }} 
      />
    </div>
    <div className="flex justify-between text-[10px] font-mono text-[#5A6D89]">
      <span>{current}</span>
      <span>{target}</span>
    </div>
  </div>
);

const CourseCard = ({ title, skill, time, progress, onClick }) => (
  <div 
    onClick={onClick} 
    className="bg-[#E4EEF8]/60 border border-white/85 hover:border-[#1988A3]/50 hover:bg-[#E4EEF8]/80 p-5 rounded-2xl transition-all cursor-pointer group"
  >
    <div className="flex gap-3.5 items-center mb-3">
      <div className="w-10 h-10 rounded-xl bg-[#1988A3]/10 text-[#1988A3] font-mono font-extrabold text-xs flex items-center justify-center shrink-0 border border-[#1988A3]/20">
        LMS
      </div>
      <div>
        <h5 className="font-bold text-[#17233E] text-xs sm:text-sm group-hover:text-[#1988A3] transition-colors line-clamp-1">
          {title}
        </h5>
        <p className="text-[11px] text-[#5A6D89] font-normal">{skill} • {time}</p>
      </div>
    </div>
    <div className="h-1.5 w-full bg-[#E9EAF7] rounded-full overflow-hidden">
      <div className="h-full bg-[#1988A3] rounded-full transition-all" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export default EmployeeDashboard;