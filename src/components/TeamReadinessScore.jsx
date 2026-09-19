import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import { teamLeaderAPI } from '../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Search, Bell, SlidersHorizontal, ArrowUpRight, ShieldAlert, Calendar, ChevronRight,
  X, CheckCircle2, Loader2, Sparkles, AlertTriangle, Layers, UserCheck
} from 'lucide-react';

export default function TeamReadinessScore() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('readiness'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('General Team Deployment');
  const [requiredLevel, setRequiredLevel] = useState('Advanced');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveReadiness, setLiveReadiness] = useState(null);
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'requirements', 'training', 'risk'
  const [selectedMember, setSelectedMember] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [assigningTrack, setAssigningTrack] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await teamLeaderAPI.getReadiness();
        if (isMounted && res?.success && res.data) {
          setLiveReadiness(res.data);
          if (res.data.projects && res.data.projects.length > 0) {
            setSelectedProject(res.data.projects[0].title);
          }
        }
      } catch (err) {
        console.warn('Error loading live readiness data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const dynamicMemberList = liveReadiness?.members || [];
  const capabilityRadarData = liveReadiness?.radarData || [];
  const timelineTrendData = liveReadiness?.trendData || [];
  const criticalGapsList = liveReadiness?.criticalGaps || [];
  const projectList = liveReadiness?.projects || [];

  const overallScoreVal = liveReadiness?.overallScore ?? 0;
  const qualifiedCount = liveReadiness?.qualifiedCount ?? 0;
  const totalMembersCount = liveReadiness?.totalMembers ?? 0;
  const totalValidatedSkills = liveReadiness?.totalValidatedSkills ?? 0;
  const criticalGapsCount = liveReadiness?.criticalRiskAreas ?? 0;

  // Filter members dynamically
  const filteredMembers = dynamicMemberList.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      setToastMessage('Readiness indices successfully updated for selected context.');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1000);
  };

  const handleOpenTrainingModal = (member) => {
    setSelectedMember(member);
    setActiveModal('training');
  };

  const handleAssignTrackSubmit = async () => {
    if (!selectedMember) return;
    try {
      setAssigningTrack(true);
      await teamLeaderAPI.assignTraining({
        userId: selectedMember.id,
        courseId: 'readiness-track-course'
      });
      setToastMessage(`Targeted training module assigned to ${selectedMember.name}`);
      setTimeout(() => setToastMessage(''), 4000);
      setActiveModal(null);
    } catch (err) {
      console.warn('Error assigning readiness track training:', err);
      setActiveModal(null);
    } finally {
      setAssigningTrack(false);
    }
  };

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const leaderName = storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : 'Team Lead';
  const leaderInitials = `${storedUser.firstName?.[0] || 'T'}${storedUser.lastName?.[0] || 'L'}`.toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      
      {/* Sidebar Component */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Pane - Fluid Full Width */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full space-y-8">
        
        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 text-xs font-bold animate-bounce">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Row */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#0b1221] tracking-tight">Project Readiness Score</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Evaluate team eligibility and target tracking indices for upcoming project deployments</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search metrics or members..." 
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            <button className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 transition-all text-slate-600">
              <Bell size={20} />
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none">{leaderName}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Team Leader</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                {storedUser.avatarUrl ? (
                  <img src={storedUser.avatarUrl} alt={leaderName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
                    {leaderInitials}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Card Grids */}
        <div className="grid grid-cols-4 gap-6">
          
          {/* Index Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center relative overflow-hidden">
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Overall Readiness Index</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">Production Fit</h4>
            </div>
            <div className="w-16 h-16 rounded-full border-[5px] border-emerald-500 flex items-center justify-center text-base font-black text-emerald-600 shadow-inner">
              {overallScoreVal}%
            </div>
          </div>

          {/* Validation Bar Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Target Skills Validated</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">{totalValidatedSkills} Skills</h4>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${overallScoreVal}%` }}></div>
            </div>
          </div>

          {/* Qualified Members Metric */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Qualified Members</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">{qualifiedCount} / {totalMembersCount} Members</h4>
            </div>
            <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-3 self-start">
              {totalMembersCount > 0 ? ((qualifiedCount / totalMembersCount) * 100).toFixed(0) : '0'}% Match Rate
            </p>
          </div>

          {/* Critical Gaps Item */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Critical Capability Gaps</p>
              <h4 className="text-3xl font-black text-rose-500 tracking-tight">{criticalGapsCount} Gaps Left</h4>
            </div>
            <button 
              onClick={() => setActiveModal('requirements')}
              className="text-xs font-bold text-rose-500 flex items-center gap-1 hover:underline mt-3 text-left"
            >
              <span>View Requirements</span>
              <ChevronRight size={14} />
            </button>
          </div>

        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold px-2">
              <SlidersHorizontal size={16} />
              <span>Target Context:</span>
            </div>
            
            {/* Project Select */}
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-50 border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-colors focus:outline-none"
            >
              {projectList.length > 0 ? (
                projectList.map(p => (
                  <option key={p.id} value={p.title}>Project: {p.title}</option>
                ))
              ) : (
                <option value="General Team Deployment">Project: General Team Deployment</option>
              )}
            </select>

            {/* Level Select */}
            <select 
              value={requiredLevel}
              onChange={(e) => setRequiredLevel(e.target.value)}
              className="bg-slate-50 border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-colors focus:outline-none"
            >
              <option>Required Level: Advanced</option>
              <option>Required Level: Intermediate</option>
              <option>Required Level: Expert / Lead</option>
            </select>
          </div>

          <button 
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="bg-[#0b1221] hover:bg-[#151f33] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            {isRecalculating && <Loader2 size={16} className="animate-spin" />}
            <span>{isRecalculating ? 'Recalculating...' : 'Recalculate Score'}</span>
          </button>
        </div>

        {/* Chart Matrices Layout */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Vector Map Chart */}
          <div className="col-span-5 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Capability Vector Mapping</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Required vs Current core competency vectors</p>
            </div>
            
            <div className="w-full h-64 flex items-center justify-center mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={capabilityRadarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} fontWeight="bold" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
                  <Radar name="Readiness" dataKey="A" stroke="#6366f1" fill="#818cf8" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Timeline Line Chart */}
          <div className="col-span-7 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Readiness Index Velocity</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Aggregated target index trajectory across 6 months</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-black text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Calendar size={14} className="text-slate-400" /> 6-Month Trend
              </span>
            </div>

            <div className="w-full h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineTrendData} margin={{ left: -15, right: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} fontWeight="bold" tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={12} fontWeight="bold" tickLine={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#a855f7" 
                    strokeWidth={4} 
                    dot={{ fill: '#a855f7', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Table + Sidebar Breakdown */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Individual Member Readiness Table */}
          <div className="col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Individual Member Readiness Breakdown</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Target project compliance analysis mapping per engineer</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-black tracking-widest text-slate-400 uppercase">
                    <th className="py-4 px-6">Team Member</th>
                    <th className="py-4 px-4 text-center">Readiness Index</th>
                    <th className="py-4 px-4 text-center">Verified Target Skills</th>
                    <th className="py-4 px-4 text-center">Open Gap Items</th>
                    <th className="py-4 px-6 text-right">Status State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <tr 
                        key={member.id} 
                        className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                        onClick={(e) => {
                          // Prevent modal triggers from triggering row navigation
                          if (e.target.tagName !== 'BUTTON') {
                            navigate(`/team-leader/member-profile?name=${encodeURIComponent(member.name)}`);
                          }
                        }}
                      >
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-600 shadow-sm">
                            {member.initials}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm leading-tight hover:text-blue-600 transition-colors">{member.name}</p>
                            <p className="text-[11px] font-bold text-slate-400 mt-0.5">{member.role}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-black text-slate-800 text-sm">{member.score}</td>
                        <td className="py-4 px-4 text-center font-bold text-slate-600">{member.verifiedSkills} / {member.totalSkills || 5} Skills</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`text-xs font-black ${member.gaps > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                            {member.gaps} Gaps
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTrainingModal(member);
                            }}
                            className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-80 transition-opacity
                            ${member.status === 'Ready' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}
                          `}>
                            {member.status}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 font-semibold text-xs">
                        No team members match "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Action Side Intelligence panel */}
          <div className="col-span-4 flex flex-col justify-between h-full space-y-6">
            
            {/* Real-time Validation Risks */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-rose-500 mb-4">
                <ShieldAlert size={20} />
                <h4 className="text-sm font-black uppercase tracking-wider">Critical Readiness Risks</h4>
              </div>
              {criticalGapsList.length > 0 ? (
                <>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Project deployment is affected by <span className="text-rose-500 font-bold">{criticalGapsList[0].skillName}</span> constraints. {criticalGapsList.length} critical skill gap(s) identified.
                  </p>
                  <div 
                    onClick={() => setActiveModal('risk')}
                    className="mt-4 p-3 bg-rose-50 hover:bg-rose-100/80 cursor-pointer transition-colors rounded-xl border border-rose-100/60 text-xs font-bold text-rose-800 flex justify-between items-center"
                  >
                    <span className="truncate mr-2">{criticalGapsList[0].skillName} ({criticalGapsList[0].memberName})</span>
                    <span className="text-rose-600 font-black shrink-0">{criticalGapsList[0].severity || 'High Risk'}</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    All current team capabilities match active production requirement thresholds cleanly.
                  </p>
                  <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-800 flex justify-between items-center">
                    <span>Zero Readiness Blockers</span>
                    <span className="text-emerald-600 font-black">Optimal</span>
                  </div>
                </>
              )}
            </div>

            {/* AI Action Panel */}
            <div className="bg-[#0b0f19] rounded-[2rem] p-6 text-white shadow-xl flex flex-col justify-between flex-1 min-h-[190px]">
              <div>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 font-black px-2.5 py-1 rounded-lg uppercase tracking-wide inline-block mb-3">
                  AI Skill Recommendation
                </span>
                {criticalGapsList.length > 0 ? (
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Enrolling <span className="text-blue-400 font-bold">{criticalGapsList[0].memberName}</span> in target skills training will remove critical dependencies and push readiness score higher.
                  </p>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Team is in optimal state. Enrolling engineers in advanced upskilling tracks maintains high technical readiness.
                  </p>
                )}
              </div>

              <button 
                onClick={() => {
                  const targetMember = (criticalGapsList.length > 0 
                    ? dynamicMemberList.find(m => m.id === criticalGapsList[0].memberId) 
                    : null) || dynamicMemberList.find(m => m.status !== 'Ready') || dynamicMemberList[0];
                  if (targetMember) handleOpenTrainingModal(targetMember);
                }}
                className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
              >
                <span>Launch Targeted Training</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* --- Action Modals --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          
          {/* 1. Requirements Modal */}
          {activeModal === 'requirements' && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="text-indigo-600" size={18} />
                  <h3 className="text-lg font-bold text-slate-900">Project Capability Requirements</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {criticalGapsList.length > 0 ? (
                  criticalGapsList.map((gap, idx) => (
                    <div key={gap.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-700">{gap.skillName}</p>
                        <p className="text-[10px] text-slate-400">{gap.memberName} ({gap.memberRole})</p>
                      </div>
                      <span className="text-xs font-black text-rose-500">{gap.severity || 'Gap'}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl text-center">
                    All project capability requirements are currently satisfied.
                  </div>
                )}
              </div>

              <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl">
                Close
              </button>
            </div>
          )}

          {/* 2. Targeted Training Modal */}
          {activeModal === 'training' && selectedMember && (
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-blue-600" size={20} />
                  <h3 className="text-lg font-bold text-slate-900">Launch Targeted Readiness Track</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                    {selectedMember.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{selectedMember.name}</p>
                    <p className="text-xs text-slate-500">{selectedMember.role} • Score: <span className="font-bold text-slate-800">{selectedMember.score}</span></p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Recommended Gap Resolution Modules</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 p-3 border border-slate-200 rounded-xl bg-slate-50/50 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                      <span>{selectedMember.name} Target Readiness Training Track</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setActiveModal(null)} className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button 
                  onClick={handleAssignTrackSubmit} 
                  disabled={assigningTrack}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {assigningTrack ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>{assigningTrack ? 'Assigning Track...' : 'Assign & Launch Track'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. Critical Risk Detail Modal */}
          {activeModal === 'risk' && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold text-slate-900">Critical Capability Risk Breakdown</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {criticalGapsList.length > 0 
                  ? `${criticalGapsList.length} member gap(s) currently gate overall project deployment readiness. Launch targeted training to upgrade skill proficiency.`
                  : 'No active capability risks detected for current team members.'
                }
              </p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
                  Dismiss
                </button>
                <button 
                  onClick={() => {
                    setActiveModal(null);
                    const targetMember = (criticalGapsList.length > 0 
                      ? dynamicMemberList.find(m => m.id === criticalGapsList[0].memberId) 
                      : null) || dynamicMemberList.find(m => m.status !== 'Ready') || dynamicMemberList[0];
                    if (targetMember) handleOpenTrainingModal(targetMember);
                  }} 
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Resolve Risk Now
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}