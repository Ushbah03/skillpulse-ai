import React, { useState } from 'react';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Search, Bell, SlidersHorizontal, ArrowUpRight, ShieldAlert, Calendar, ChevronRight,
  X, CheckCircle2, Loader2, Sparkles, AlertTriangle, Layers, UserCheck
} from 'lucide-react';

// --- Datasets ---
const timelineTrendData = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 70 },
  { month: 'Mar', score: 74 },
  { month: 'Apr', score: 72 },
  { month: 'May', score: 79 },
  { month: 'Jun', score: 85 },
];

const capabilityRadarData = [
  { subject: 'Architecture', A: 85 },
  { subject: 'Backend', A: 70 },
  { subject: 'Cloud Native', A: 55 },
  { subject: 'DevOps', A: 60 },
  { subject: 'Frontend', A: 90 },
  { subject: 'Security', A: 45 },
];

const initialIndividualReadiness = [
  {
    id: 1,
    name: "Ali Khan",
    role: "Senior Full Stack",
    score: "92%",
    status: "Ready",
    verifiedSkills: 5,
    gaps: 0,
    initials: "AK"
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "Cloud Specialist",
    score: "78%",
    status: "Ready",
    verifiedSkills: 4,
    gaps: 1,
    initials: "SM"
  },
  {
    id: 3,
    name: "Jessica Doe",
    role: "Backend Engineer",
    score: "55%",
    status: "Needs Training",
    verifiedSkills: 2,
    gaps: 3,
    initials: "JD"
  },
  {
    id: 4,
    name: "John Smith",
    role: "Frontend Dev",
    score: "88%",
    status: "Ready",
    verifiedSkills: 6,
    gaps: 0,
    initials: "JS"
  }
];

export default function TeamReadinessScore() {
  const [activeTab, setActiveTab] = useState('readiness'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('FinTech API Upgrade');
  const [requiredLevel, setRequiredLevel] = useState('Advanced');
  const [isRecalculating, setIsRecalculating] = useState(false);
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'requirements', 'training', 'risk'
  const [selectedMember, setSelectedMember] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Filter members dynamically
  const filteredMembers = initialIndividualReadiness.filter(member => 
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

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      
      {/* Sidebar Component */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Pane */}
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto space-y-8">
        
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

            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
                TL
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
              79%
            </div>
          </div>

          {/* Validation Bar Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Target Skills Validated</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">24 / 32 Skills</h4>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          {/* Qualified Members Metric */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Qualified Members</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">5 / 6 Members</h4>
            </div>
            <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-3 self-start">
              83.3% Match Rate
            </p>
          </div>

          {/* Critical Gaps Item */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Critical Capability Gaps</p>
              <h4 className="text-3xl font-black text-rose-500 tracking-tight">4 Gaps Left</h4>
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
              <option>Project: FinTech API Upgrade</option>
              <option>Project: Cloud Migration Phase 2</option>
              <option>Project: Microservices Refactor</option>
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
                      <tr key={member.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-600 shadow-sm">
                            {member.initials}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm leading-tight">{member.name}</p>
                            <p className="text-[11px] font-bold text-slate-400 mt-0.5">{member.role}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-black text-slate-800 text-sm">{member.score}</td>
                        <td className="py-4 px-4 text-center font-bold text-slate-600">{member.verifiedSkills} / 8 Skills</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`text-xs font-black ${member.gaps > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                            {member.gaps} Gaps
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => handleOpenTrainingModal(member)}
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
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Project deployment deployment is gated by <span className="text-rose-500 font-bold">Cloud Native & Security</span> constraints. 2 members lack specific configuration authority clearances.
              </p>
              <div 
                onClick={() => setActiveModal('risk')}
                className="mt-4 p-3 bg-rose-50 hover:bg-rose-100/80 cursor-pointer transition-colors rounded-xl border border-rose-100/60 text-xs font-bold text-rose-800 flex justify-between items-center"
              >
                <span>AWS Security Policy Gaps Found</span>
                <span className="text-rose-600 font-black">High Risk</span>
              </div>
            </div>

            {/* AI Action Panel */}
            <div className="bg-[#0b0f19] rounded-[2rem] p-6 text-white shadow-xl flex flex-col justify-between flex-1 min-h-[190px]">
              <div>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 font-black px-2.5 py-1 rounded-lg uppercase tracking-wide inline-block mb-3">
                  AI Skill Recommendation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Enrolling Jessica Doe in <span className="text-blue-400 font-bold">Advanced Cloud & Security Stacks</span> will remove 3 dependencies, pushing team readiness past the deployment threshold.
                </p>
              </div>

              <button 
                onClick={() => handleOpenTrainingModal(initialIndividualReadiness[2])}
                className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-1.5 uppercase tracking-wider"
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
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">AWS Security Configuration</span>
                  <span className="text-xs font-black text-rose-500">2 Gaps</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Kubernetes Pod Orchestration</span>
                  <span className="text-xs font-black text-amber-500">1 Gap</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">OAuth2.0 Enterprise SSO</span>
                  <span className="text-xs font-black text-amber-500">1 Gap</span>
                </div>
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
                      <span>Advanced Cloud & Security Stacks</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 p-3 border border-slate-200 rounded-xl bg-slate-50/50 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                      <span>Enterprise OAuth & Authorization Standards</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setActiveModal(null)} className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setActiveModal(null);
                    setToastMessage(`Targeted training module assigned to ${selectedMember.name}`);
                    setTimeout(() => setToastMessage(''), 3000);
                  }} 
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Assign & Launch Track
                </button>
              </div>
            </div>
          )}

          {/* 3. Critical Risk Detail Modal */}
          {activeModal === 'risk' && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold text-slate-900">AWS Security Policy Clearance</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                2 members currently lack formal AWS Security clearance needed for production cluster deployments. Assign training or request override access from Department Manager.
              </p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
                  Dismiss
                </button>
                <button 
                  onClick={() => {
                    setActiveModal(null);
                    handleOpenTrainingModal(initialIndividualReadiness[2]);
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