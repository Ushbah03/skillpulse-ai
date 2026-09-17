import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { 
  Search, Bell, PlayCircle, TrendingUp, Layers, Zap, Star, Target, Sparkles, ChevronRight, Loader2, X, CheckCircle2, AlertCircle, BookOpen
} from 'lucide-react';
import { employeeAPI } from '../services/api';

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
  const workspaceName = user.tenant?.name || storedUser.tenant?.name || 'Apex Tech Solutions Workspace';
  const userInitials = `${displayName.charAt(0) || 'E'}`;

  const skillsList = user.userSkills || user.skills || [];
  const totalSkillsCount = skillsList.length;
  const validatedSkillsCount = skillsList.filter(s => s.verified || s.isVerified).length;
  const activeGapsList = gaps;

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
    readinessPct = Math.max(30, Math.round(100 - (activeGapsList.length * 15)));
  }

  // Live Courses from DB
  const activeEnrollments = courses.filter(c => c.enrollmentStatus === 'IN_PROGRESS' || c.enrollmentStatus === 'ENROLLED');
  const allDisplayCourses = activeEnrollments.length > 0 ? activeEnrollments : courses;

  // Filtered lists based on real-time search query
  const searchLower = searchQuery.toLowerCase().trim();
  const filteredGaps = activeGapsList.filter(g => 
    !searchLower || (g.skill?.name || '').toLowerCase().includes(searchLower)
  );
  const filteredCourses = allDisplayCourses.filter(c => 
    !searchLower || c.title.toLowerCase().includes(searchLower) || (c.provider || '').toLowerCase().includes(searchLower)
  );
  const matchingSkills = skillsList.filter(s => 
    searchLower && (s.skill?.name || '').toLowerCase().includes(searchLower)
  );

  // Top Critical Gap for AI Card
  const topGap = activeGapsList[0] || null;
  const estimatedImpact = topGap ? `+${Math.round(((topGap.requiredLevel - topGap.currentLevel) / 5.0) * 100)}%` : '+100%';

  // Real DB System Notifications
  const dbNotifications = [
    ...(activeGapsList.map(g => ({
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
      <div className="p-8 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-indigo-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Loading Enterprise Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-10 font-sans">
      
      {/* 1. Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
              {workspaceName}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Employee Dashboard</h1>
          <p className="text-slate-500 text-base mt-1 font-medium">Monitor your live skills, gaps, and learning progress from PostgreSQL database</p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Functional Real-Time Search Input with Dropdown Overlay */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, gaps, courses..." 
              className="pl-11 pr-9 py-2.5 bg-white border border-slate-200 rounded-2xl w-80 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Instant Search Overlay */}
            {searchLower && (
              <div className="absolute top-12 left-0 right-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-3">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">Live Search Results</div>
                
                {filteredCourses.length > 0 && (
                  <div>
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider px-2 block mb-1">Courses</span>
                    {filteredCourses.slice(0, 3).map(c => (
                      <div 
                        key={c.id}
                        onClick={() => { navigate('/dashboard/courses'); setSearchQuery(''); }}
                        className="p-2 hover:bg-blue-50 rounded-xl cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-slate-800">{c.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}

                {matchingSkills.length > 0 && (
                  <div>
                    <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider px-2 block mb-1">User Skills</span>
                    {matchingSkills.slice(0, 3).map(s => (
                      <div 
                        key={s.id}
                        onClick={() => { navigate('/dashboard/profile'); setSearchQuery(''); }}
                        className="p-2 hover:bg-purple-50 rounded-xl cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-slate-800">{s.skill?.name} (Lvl {s.proficiencyLevel})</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}

                {filteredGaps.length > 0 && (
                  <div>
                    <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider px-2 block mb-1">Skill Gaps</span>
                    {filteredGaps.slice(0, 2).map(g => (
                      <div 
                        key={g.id}
                        onClick={() => { navigate('/dashboard/results'); setSearchQuery(''); }}
                        className="p-2 hover:bg-orange-50 rounded-xl cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-slate-800">{g.skill?.name} ({g.severity})</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}

                {filteredCourses.length === 0 && matchingSkills.length === 0 && filteredGaps.length === 0 && (
                  <p className="text-xs text-slate-400 p-2 text-center">No matching database items found.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Functional Notification Bell Button with Drawer */}
          <div ref={notifRef} className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-white border border-slate-200 rounded-full relative shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {dbNotifications.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notification Drawer Modal */}
            {showNotifications && (
              <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Database Notifications</h4>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {dbNotifications.length} Alerts
                  </span>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {dbNotifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => { navigate(n.path); setShowNotifications(false); }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-slate-100 transition-colors flex items-start gap-2.5"
                    >
                      {n.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      ) : n.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile Header Badge displaying Assigned System Role & Job Title */}
          <div className="flex items-center gap-4 ml-2 border-l-2 pl-6 border-slate-200">
            <div className="text-right leading-tight">
              <p className="text-sm font-extrabold text-slate-900">{displayName}</p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <span className="text-[9px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  ROLE: {systemRole.replace('_', ' ')}
                </span>
                {displayJobTitle && (
                  <span className="text-xs text-blue-600 font-bold tracking-tight">
                    • {displayJobTitle}
                  </span>
                )}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-black text-base">
              {userInitials}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Row - 100% Dynamic DB Data */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        <StatCard 
          title="Skill Readiness" 
          value={`${readinessPct}%`} 
          trend={`${validatedSkillsCount}/${totalSkillsCount} Verified`} 
          icon={TrendingUp} 
          iconColor="text-blue-600" 
          iconBg="bg-blue-50" 
        />
        <StatCard 
          title="Total Skills" 
          value={totalSkillsCount} 
          sub={`${validatedSkillsCount} Validated in DB`} 
          icon={Layers} 
          iconColor="text-slate-600" 
          iconBg="bg-slate-100" 
        />
        <StatCard 
          title="Active Gaps" 
          value={activeGapsList.length} 
          sub={activeGapsList.length > 0 ? "Action Needed" : "Optimal"} 
          highlight="orange" 
          icon={Zap} 
          iconColor="text-orange-600" 
          iconBg="bg-orange-50" 
        />
        <StatCard 
          title="Competency Index" 
          value={`${avgProf.toFixed(1)}/5`} 
          sub="Role Alignment" 
          highlight="emerald" 
          icon={Star} 
          iconColor="text-emerald-600" 
          iconBg="bg-emerald-50" 
        />
      </div>

      {/* 3. Matrix and Gap Summary Row */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-7 bg-blue-600 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-lg">Skill Proficiency Matrix</h3>
            </div>
            <button 
              onClick={() => navigate('/dashboard/profile')}
              className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest hover:bg-slate-100 transition-colors"
            >
              View Profile
            </button>
          </div>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 14, fontWeight: 700 }} />
                <Radar dataKey="A" stroke="#2563EB" strokeWidth={3} fill="#3B82F6" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-8 flex items-center gap-3">
            <Target className="w-5 h-5 text-slate-400" /> Skill Gap Summary
          </h3>
          <div className="space-y-6 flex-1">
            {filteredGaps.length > 0 ? (
              filteredGaps.map((g, idx) => {
                const current = g.currentLevel || 2.0;
                const target = g.requiredLevel || 4.5;
                const pct = Math.min(100, Math.round((current / target) * 100));
                const color = g.severity === 'CRITICAL' ? 'orange' : g.severity === 'HIGH' ? 'orange' : 'emerald';
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
              <div className="py-12 text-center text-slate-400 font-medium text-sm">
                {searchQuery ? 'No matching skill gaps found for query.' : 'No active skill gaps. Your skills meet current role requirements!'}
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/dashboard/results')}
            className="w-full mt-8 py-4 border-2 border-slate-100 rounded-2xl text-slate-600 text-sm font-black hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm"
          >
            View Gap Analysis <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Progress and Insights Row */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <PlayCircle className="w-5 h-5 text-blue-600" /> Live Courses & Learning Progress
            </h3>
            <button 
              onClick={() => navigate('/dashboard/learning')}
              className="text-blue-600 text-sm font-bold hover:underline"
            >
              View All Courses
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
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
              <div className="col-span-2 text-center py-6 text-slate-400 text-sm">
                {searchQuery ? 'No matching courses found for query.' : 'No active courses enrolled. Visit Learning Recommendations to enroll.'}
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Card - 100% Dynamic DB Data */}
        <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">AI Recommendation</span>
            </div>
            <h4 className="text-xl font-bold mb-3 leading-tight">
              {topGap ? `Target Skill: ${topGap.skill?.name}` : 'Skill Development Track'}
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              {topGap 
                ? `Focus on bridging your ${topGap.severity} priority gap in ${topGap.skill?.name} to reach target proficiency level ${topGap.requiredLevel}.`
                : `Your verified skill inventory meets current role requirements. Explore new catalog tracks.`}
            </p>
            
            <div className="flex gap-4 mb-10">
               <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Impact</p>
                  <p className="font-bold text-emerald-400 text-lg">{estimatedImpact}</p>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Status</p>
                  <p className="font-bold text-blue-400 text-lg">{topGap ? topGap.severity : 'Active'}</p>
               </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard/learning')}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all uppercase shadow-lg shadow-blue-900/30"
          >
            Enroll in AI Track
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ title, value, trend, sub, icon: Icon, iconBg, iconColor, highlight }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      {trend && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{trend}</span>}
    </div>
    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
    {sub && <p className={`text-xs font-bold ${highlight === 'orange' ? 'text-orange-500' : highlight === 'emerald' ? 'text-emerald-500' : 'text-slate-400'}`}>{sub}</p>}
  </div>
);

const GapItem = ({ title, status, color, progress, target, current }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <span className="font-bold text-slate-800">{title}</span>
      <span className={`text-xs font-black px-2 py-0.5 rounded-md ${color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>{status}</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color === 'orange' ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }}></div>
    </div>
    <div className="flex justify-between text-[10px] font-bold text-slate-400">
      <span>{current}</span>
      <span>{target}</span>
    </div>
  </div>
);

const CourseCard = ({ title, skill, time, progress, onClick }) => (
  <div onClick={onClick} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group">
    <div className="flex gap-4 items-center mb-3">
      <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 font-black text-xs flex items-center justify-center shrink-0">
        LMS
      </div>
      <div>
        <h5 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">{title}</h5>
        <p className="text-xs text-slate-400 font-medium">{skill} • {time}</p>
      </div>
    </div>
    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export default EmployeeDashboard;