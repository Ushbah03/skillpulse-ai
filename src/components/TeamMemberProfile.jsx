import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TeamLeaderSidebar from './TeamLeaderSidebar'; 
import { teamLeaderAPI } from '../services/api';
import { 
  Bell, 
  ChevronDown, 
  ArrowUpRight, 
  CheckCircle2, 
  Layers,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';

const TeamMemberProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('member-profile');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveMembers, setLiveMembers] = useState([]);
  const [selectedMemberObj, setSelectedMemberObj] = useState(null);
  const [memberDetail, setMemberDetail] = useState(null);
  const [memberMetrics, setMemberMetrics] = useState(null);

  // 1. Fetch team members list
  useEffect(() => {
    let isMounted = true;
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await teamLeaderAPI.getMembers();
        if (isMounted && res) {
          const membersList = res.data?.members || (Array.isArray(res.data) ? res.data : []);
          setLiveMembers(membersList);
          
          const nameParam = searchParams.get('name');
          const idParam = searchParams.get('id');

          if (idParam) {
            const matched = membersList.find(m => m.id === idParam);
            if (matched) setSelectedMemberObj(matched);
            else if (membersList.length > 0) setSelectedMemberObj(membersList[0]);
          } else if (nameParam) {
            const matched = membersList.find(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(nameParam.toLowerCase()));
            if (matched) setSelectedMemberObj(matched);
            else if (membersList.length > 0) setSelectedMemberObj(membersList[0]);
          } else if (membersList.length > 0) {
            setSelectedMemberObj(membersList[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load team members:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMembers();
    return () => { isMounted = false; };
  }, [searchParams]);

  // 2. Fetch selected member detail from backend
  useEffect(() => {
    let isMounted = true;
    if (!selectedMemberObj?.id) return;

    async function loadDetail() {
      try {
        const res = await teamLeaderAPI.getMemberProfile(selectedMemberObj.id);
        if (isMounted && res?.success && res.data) {
          setMemberDetail(res.data.member);
          setMemberMetrics(res.data.metrics);
        }
      } catch (err) {
        console.warn('Error fetching member profile detail:', err);
      }
    }
    loadDetail();
    return () => { isMounted = false; };
  }, [selectedMemberObj?.id]);

  const activeMember = memberDetail || selectedMemberObj;
  const selectedName = activeMember 
    ? `${activeMember.firstName} ${activeMember.lastName}`.trim() 
    : 'No Team Member Selected';
  const selectedRole = activeMember?.jobTitle || activeMember?.role || 'Team Member';
  const memberSkills = activeMember?.skills || [];
  const memberGaps = activeMember?.skillGaps || [];
  const memberEnrollments = activeMember?.enrollments || [];

  // Calculate dynamic readiness & proficiency
  let totalProf = 0;
  memberSkills.forEach(s => {
    totalProf += (s.proficiencyLevel || 1.0);
  });
  const avgProfPct = memberSkills.length > 0 ? Math.round((totalProf / (memberSkills.length * 5)) * 100) : 0;
  const readinessPct = memberMetrics?.readiness || `${avgProfPct}%`;
  const perfRating = memberMetrics?.performanceRating || (avgProfPct ? `${(avgProfPct / 20).toFixed(1)}/5.0` : "0.0/5.0");
  const overallScore = memberMetrics?.overallScore || `${avgProfPct}%`;
  const completionRate = memberMetrics?.completionRate || "0%";

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const leaderName = storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : 'Team Leader';

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar Integration */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 w-full space-y-8">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#0b1221] tracking-tight">Team Member Profile</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">View complete skill, performance, and readiness intelligence</p>
          </div>
          
          {/* Right Controls Dropdown & User */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
              >
                <span>{selectedName}</span>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {isMemberDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 max-h-60 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-20">
                  {liveMembers.length > 0 ? (
                    liveMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => {
                          setSelectedMemberObj(member);
                          setIsMemberDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                      >
                        <span>{member.firstName} {member.lastName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{member.jobTitle || member.role}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-xs text-slate-400">No team members available</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{leaderName}</p>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Team Leader</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-slate-200 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
                TL
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-blue-600 mr-3" size={24} />
            <span className="text-sm font-bold text-slate-600">Loading team member profile...</span>
          </div>
        ) : !activeMember ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <AlertCircle className="text-slate-400" size={40} />
            <p className="text-slate-600 font-bold">No team members assigned to your team yet.</p>
          </div>
        ) : (
          <>
            {/* 1. Main Profile Banner Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  <img 
                    src={activeMember?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
                    alt={selectedName} 
                    className="w-full h-full rounded-full object-cover border-4 border-slate-50 shadow-inner" 
                  />
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-[#0b1221]">{selectedName}</h2>
                  </div>
                  <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">{selectedRole}</p>
                  
                  <div className="flex gap-2 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 px-3 py-1 rounded-md border border-amber-100/50">
                      {activeMember?.department?.name || 'Engineering'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-3 py-1 rounded-md">Verified</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1 rounded-md border border-blue-100/50">Active</span>
                  </div>
                </div>
              </div>

              {/* Right Metrics Grid */}
              <div className="flex gap-16 pr-8">
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Readiness</p>
                  <p className="text-3xl font-black text-blue-600">{readinessPct}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Performance</p>
                  <p className="text-3xl font-black text-emerald-600">{perfRating}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Skills</p>
                  <p className="text-3xl font-black text-purple-600 tracking-tight">{memberSkills.length}</p>
                </div>
              </div>
            </div>

            {/* 2. Key Metrics 4-Column Row */}
            <div className="grid grid-cols-4 gap-6">
              <MetricCard title="Overall Skill Score" value={overallScore}>
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-blue-600" strokeWidth="3" strokeDasharray={`${parseInt(overallScore) || 80}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute text-[11px] font-black text-blue-600">
                    {parseInt(overallScore) >= 85 ? 'A+' : parseInt(overallScore) >= 70 ? 'B+' : 'C'}
                  </div>
                </div>
              </MetricCard>

              <MetricCard title="Performance Rating" value={perfRating}>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                  <ArrowUpRight size={14} /> Live
                </span>
              </MetricCard>

              <MetricCard title="Completion Rate" value={completionRate}>
                <CheckCircle2 className="text-emerald-500" size={24} />
              </MetricCard>

              <MetricCard title="Skill Gaps" value={String(memberGaps.length).padStart(2, '0')}>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                  memberGaps.length === 0 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                    : 'bg-amber-50 text-amber-600 border-amber-100/50'
                }`}>
                  {memberGaps.length === 0 ? 'No Risk' : 'Gap Action Required'}
                </span>
              </MetricCard>
            </div>

            {/* 3. Member Skill Matrix Table */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Member Skill Matrix</h3>
              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="py-4 px-6">Skill Name</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Proficiency</th>
                      <th className="py-4 px-6 text-center">Score</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-800">
                    {memberSkills.length > 0 ? (
                      memberSkills.map((s) => {
                        const prof = s.proficiencyLevel || 3.0;
                        const levelStr = prof >= 4.0 ? 'Expert' : prof >= 3.0 ? 'Advanced' : 'Intermediate';
                        const colorStr = prof >= 4.0 
                          ? 'text-emerald-600 bg-emerald-50 border-emerald-100/50'
                          : prof >= 3.0
                          ? 'text-blue-600 bg-blue-50 border-blue-100/50'
                          : 'text-amber-600 bg-amber-50 border-amber-100/50';
                        const numScore = Math.round(prof * 20);

                        return (
                          <SkillMatrixRow 
                            key={s.id || s.skill?.name || Math.random()}
                            name={s.skill?.name || 'Skill'} 
                            category={s.skill?.category?.name || 'Engineering'} 
                            level={levelStr} 
                            levelColor={colorStr} 
                            score={numScore} 
                          />
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400 text-sm font-medium">
                          No skills recorded for this member yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Charts Twin Grid (Radar + Growth) */}
            <div className="grid grid-cols-12 gap-8">
              {/* Skill Proficiency Radar */}
              <div className="col-span-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Skill Proficiency Radar</h3>
                <div className="flex items-center justify-center p-4 relative min-h-[260px]">
                  <svg className="w-64 h-64 text-slate-200" viewBox="0 0 100 100">
                    <polygon points="50,10 88,38 73,82 27,82 12,38" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <polygon points="50,22 80,44 68,76 32,76 20,44" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <polygon points="50,34 72,50 63,70 37,70 28,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <polygon points="50,46 64,56 58,64 42,64 36,56" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="50" y1="50" x2="88" y2="38" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="50" y1="50" x2="73" y2="82" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="50" y1="50" x2="27" y2="82" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="50" y1="50" x2="12" y2="38" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
                    <polygon points="50,15 82,40 65,72 35,76 22,42" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="1.5" />
                  </svg>
                  <span className="absolute top-0 text-[10px] font-black text-slate-400">
                    {memberSkills[0]?.skill?.name?.toUpperCase() || 'CORE SKILLS'}
                  </span>
                  <span className="absolute right-2 top-1/3 text-[10px] font-black text-slate-400">
                    {memberSkills[1]?.skill?.name?.toUpperCase() || 'ARCHITECTURE'}
                  </span>
                  <span className="absolute right-12 bottom-2 text-[10px] font-black text-slate-400">
                    {memberSkills[2]?.skill?.name?.toUpperCase() || 'FRAMEWORKS'}
                  </span>
                  <span className="absolute left-16 bottom-2 text-[10px] font-black text-slate-400">
                    {memberSkills[3]?.skill?.name?.toUpperCase() || 'UI/UX'}
                  </span>
                  <span className="absolute left-2 top-1/3 text-[10px] font-black text-slate-400">
                    {memberSkills[4]?.skill?.name?.toUpperCase() || 'DEVOPS'}
                  </span>
                </div>
              </div>

              {/* Skill Growth Trend */}
              <div className="col-span-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Skill Growth Trend</h3>
                <div className="relative flex flex-col justify-end h-full min-h-[260px] pb-2">
                  <div className="w-full h-44 relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                      <path d="M 0,85 Q 100,75 200,65 T 400,25 L 500,10" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 0,85 Q 100,75 200,65 T 400,25 L 500,10 L 500,100 L 0,100 Z" fill="url(#gradient-grow)" fillOpacity="0.05" />
                      <defs>
                        <linearGradient id="gradient-grow" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <circle cx="100" cy="80" r="4" fill="#06b6d4" />
                      <circle cx="300" cy="50" r="4" fill="#3b82f6" />
                      <circle cx="460" cy="20" r="4" fill="#3b82f6" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 px-1 border-t border-slate-50 pt-4 mt-2">
                    <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Training History Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Training History</h3>
              <div className="space-y-4">
                {memberEnrollments.length > 0 ? (
                  memberEnrollments.map((en) => (
                    <TrainingHistoryRow 
                      key={en.id || Math.random()}
                      title={en.course?.title || 'Assigned Training Course'} 
                      date={`Enrolled: ${new Date(en.createdAt).toLocaleDateString()}`} 
                      score={`${Math.round(en.progressPct || 0)}%`} 
                      badge={`STATUS: ${en.status}`} 
                      color="bg-blue-50" 
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs font-bold bg-slate-50/50 rounded-2xl">
                    No active or completed training history recorded for this member.
                  </div>
                )}
              </div>
            </div>

            {/* 6. Skill Gaps Identified */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Skill Gaps Identified</h3>
              {memberGaps.length > 0 ? (
                memberGaps.map((gap) => (
                  <div key={gap.id} className="p-6 bg-amber-50/40 rounded-2xl border border-amber-100/70 flex justify-between items-center mb-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Missing Skill: {gap.skill?.name || 'Technical Gap'}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Severity: <span className="font-bold text-amber-700">{gap.severity}</span> — Current Level: {gap.currentLevel || 1.0} / Target: {gap.targetLevel || 4.0}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/team-leader/assign-learning?userId=${activeMember.id}&skillId=${gap.skillId}`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Assign Now
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-emerald-50/40 rounded-2xl border border-emerald-100/70 text-center text-xs font-bold text-emerald-700">
                  No critical skill gaps identified for {selectedName}.
                </div>
              )}
            </div>

            {/* 7. AI Development Insights */}
            <div className="bg-[#0b0f19] p-8 rounded-[2.5rem] text-white shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Layers className="text-blue-400" size={22} />
                </div>
                <h4 className="text-xl font-bold tracking-tight">AI Development Insights</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <InsightBox 
                  title="Growth Path" 
                  text={`${selectedName.split(' ')[0]} currently demonstrates strong proficiency across ${memberSkills.length} core technical capabilities. Recommend assigned advanced track training.`} 
                  score={`${Math.min(98, Math.max(70, avgProfPct + 10))}%`} 
                />
                <InsightBox 
                  title="Retention & Engagement" 
                  text={`High performance stability detected for ${selectedName.split(' ')[0]}. Recommend continuous skill upgrades and quarterly feedback check-ins.`} 
                  score="90%" 
                />
              </div>
            </div>

            {/* 8. Bottom Fast Actions Block */}
            <div className="flex gap-4 items-center justify-between pt-2">
              <button 
                onClick={() => navigate(`/team-leader/assign-learning?userId=${activeMember.id}`)}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md text-center cursor-pointer"
              >
                Assign Training
              </button>
              <button 
                onClick={() => navigate('/team-leader/performance')}
                className="flex-1 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-all shadow-sm text-center cursor-pointer"
              >
                View Performance
              </button>
              <button 
                onClick={() => navigate('/team-leader/gap-analysis')}
                className="flex-1 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-all shadow-sm text-center cursor-pointer"
              >
                Skill Gap Report
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 py-3.5 bg-[#0b1221] hover:bg-[#151f33] text-white font-bold text-sm rounded-xl transition-all shadow-md text-center cursor-pointer"
              >
                Print Profile
              </button>
            </div>
          </>
        )}

      </main>
    </div>
  );
};

/* --- Component Helpers --- */
const MetricCard = ({ title, value, children }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
    </div>
    {children}
  </div>
);

const SkillMatrixRow = ({ name, category, level, levelColor, score }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="py-4 px-6 text-slate-900 font-extrabold">{name}</td>
    <td className="py-4 px-6 text-slate-400 font-medium">{category}</td>
    <td className="py-4 px-6">
      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${levelColor}`}>
        {level}
      </span>
    </td>
    <td className="py-4 px-6 text-center text-slate-900 font-black">{score}</td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-1.5 text-emerald-500">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
        <span className="text-xs font-bold">Ready</span>
      </div>
    </td>
  </tr>
);

const TrainingHistoryRow = ({ title, date, score, badge, color }) => (
  <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-inner`}>
        <Award className="text-slate-400" size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 leading-tight">{title}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-emerald-600">{score}</p>
      <p className="text-[9px] font-black text-slate-400 tracking-wider uppercase mt-0.5">{badge}</p>
    </div>
  </div>
);

const InsightBox = ({ title, text, score }) => (
  <div className="p-6 bg-[#131926] rounded-2xl border border-slate-800/40 flex flex-col justify-between space-y-4">
    <div>
      <h5 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2">{title}</h5>
      <p className="text-sm text-slate-300 leading-relaxed font-medium">{text}</p>
    </div>
    <div className="text-[11px] font-bold text-slate-500">
      Confidence Score: <span className="text-slate-300 font-extrabold">{score}</span>
    </div>
  </div>
);

export default TeamMemberProfile;