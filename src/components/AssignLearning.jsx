import React, { useState } from 'react';
import TeamLeaderSidebar from './TeamLeaderSidebar'; 
import { 
  Search, 
  Bell, 
  ChevronDown, 
  SlidersHorizontal,
  Plus,
  Play,
  Check,
  Zap,
  TrendingUp,
  FileText,
  X,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';

const AssignLearning = () => {
  const [activeTab, setActiveTab] = useState('assign-learning');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState(['Marcus Chen']);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeProgramToAssign, setActiveProgramToAssign] = useState(null);

  // Form State for Assignment Modal
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignmentNote, setAssignmentNote] = useState('');

  // Sample Team Data aligned with Gap Matrix
  const teamMembers = [
    { id: '1', name: 'Elena Foster', role: 'UX Designer', gap: 'GAP: HIGH', gapStyle: 'text-rose-600 bg-rose-50 border-rose-200', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
    { id: '2', name: 'Marcus Chen', role: 'Senior Dev', gap: 'GAP: MED', gapStyle: 'text-amber-600 bg-amber-50 border-amber-200', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
    { id: '3', name: 'Sarah Miller', role: 'Product Owner', gap: 'GAP: LOW', gapStyle: 'text-emerald-600 bg-emerald-50 border-emerald-200', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' }
  ];

  const toggleMemberSelection = (name) => {
    if (selectedMembers.includes(name)) {
      setSelectedMembers(selectedMembers.filter(m => m !== name));
    } else {
      setSelectedMembers([...selectedMembers, name]);
    }
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === teamMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(teamMembers.map(m => m.name));
    }
  };

  const openAssignModal = (program = null) => {
    setActiveProgramToAssign(program);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    // Logic for sending API payload to backend assignment endpoint
    setIsAssignModalOpen(false);
    setActiveProgramToAssign(null);
    setAssignmentNote('');
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar Component Integration */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Container Area */}
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto space-y-8">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#0b1221] tracking-tight">Assign Learning to Team</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Assign training programs based on skill gaps and development goals</p>
          </div>
          
          {/* Header Controls */}
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search training..." 
                className="w-full bg-white border border-slate-200/80 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <button className="flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <span>Frontend Team</span>
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            <button className="flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <SlidersHorizontal size={16} className="text-slate-500" />
              <span>Filters</span>
            </button>
            
            <button className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 transition-all text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="User profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* 1. Metrics Grid Row */}
        <div className="grid grid-cols-4 gap-6">
          <TopMetricCard title="Available Programs" value="142" extra="+12 new" color="bg-blue-50 text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
          </TopMetricCard>

          <TopMetricCard title="Assigned to Team" value="28" extra="active" color="bg-purple-50 text-purple-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-2.533-3.076l-1.408-.393A10.031 10.031 0 0018 12.5c0-.43-.075-.847-.213-1.233M12.433 19.43l-.433.076-.433-.076M11.5 12.5c0 .43-.075.847-.213 1.233L9.88 14.128a4.125 4.125 0 00-2.533 3.076 9.337 9.337 0 004.121.952c.9 0 1.772-.126 2.599-.363M12 6.75a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zm0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /></svg>
          </TopMetricCard>

          <TopMetricCard title="Training In Progress" value="15" extra="Needs attention" color="bg-amber-50 text-amber-600" extraColor="text-amber-600 font-bold">
            <Play size={18} fill="currentColor" />
          </TopMetricCard>

          <TopMetricCard title="Completion Rate" value="84%" extra="+5.2%" color="bg-emerald-50 text-emerald-600" extraColor="text-emerald-600 font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
          </TopMetricCard>
        </div>

        {/* 2. Content Split Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Available Training Programs Section */}
          <div className="col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Available Training Programs</h3>
              <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
            </div>

            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                    <th className="py-4 px-6">Training Name</th>
                    <th className="py-4 px-6">Skill Covered</th>
                    <th className="py-4 px-6">Difficulty</th>
                    <th className="py-4 px-6">Duration</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-800">
                  <TrainingRow 
                    name="Advanced React Patterns" 
                    domain="Frontend Development" 
                    skill="React.js" 
                    skillColor="bg-blue-50 text-blue-600 border-blue-100/50" 
                    diff="Advanced" 
                    diffColor="text-rose-500" 
                    duration="8h 30m" 
                    onAssign={() => openAssignModal({ name: "Advanced React Patterns", domain: "Frontend Development" })}
                  />
                  <TrainingRow 
                    name="System Design Fundamentals" 
                    domain="Architecture" 
                    skill="System Design" 
                    skillColor="bg-purple-50 text-purple-600 border-purple-100/50" 
                    diff="Intermediate" 
                    diffColor="text-amber-500" 
                    duration="12h 00m" 
                    onAssign={() => openAssignModal({ name: "System Design Fundamentals", domain: "Architecture" })}
                  />
                  <TrainingRow 
                    name="GraphQL API Integration" 
                    domain="Backend Development" 
                    skill="GraphQL" 
                    skillColor="bg-pink-50 text-pink-600 border-pink-100/50" 
                    diff="Beginner" 
                    diffColor="text-emerald-500" 
                    duration="4h 15m" 
                    onAssign={() => openAssignModal({ name: "GraphQL API Integration", domain: "Backend Development" })}
                  />
                  <TrainingRow 
                    name="Effective Technical Leadership" 
                    domain="Soft Skills" 
                    skill="Leadership" 
                    skillColor="bg-indigo-50 text-indigo-600 border-indigo-100/50" 
                    diff="Intermediate" 
                    diffColor="text-amber-500" 
                    duration="6h 45m" 
                    onAssign={() => openAssignModal({ name: "Effective Technical Leadership", domain: "Soft Skills" })}
                  />
                </tbody>
              </table>
            </div>

            {/* Sub-Section: Assigned Training Tracker */}
            <div className="pt-4 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Assigned Training Tracker</h3>
              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="py-4 px-6">Training Name</th>
                      <th className="py-4 px-6">Assigned To</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Progress</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-800">
                    <TrackerRow name="Kubernetes for Developers" user="Sarah K." img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" date="Oct 12, 2023" progress={75} status="In Progress" statusStyle="bg-blue-50 text-blue-600 border-blue-100/50" progressColor="bg-blue-500" />
                    <TrackerRow name="Clean Code Practices" user="James L." img="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" date="Oct 10, 2023" progress={100} status="Completed" statusStyle="bg-emerald-50 text-emerald-600 border-emerald-100/50" progressColor="bg-emerald-500" />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: Select Team Members, Recs, & Action Box */}
          <div className="col-span-4 space-y-6">
            
            {/* Box 1: Select Team Members */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Select Team Members</h3>
                <button 
                  onClick={handleSelectAll} 
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  {selectedMembers.length === teamMembers.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <MemberCheckRow 
                    key={member.id}
                    name={member.name} 
                    role={member.role} 
                    gap={member.gap} 
                    gapStyle={member.gapStyle}
                    img={member.img}
                    isSelected={selectedMembers.includes(member.name)}
                    onToggle={() => toggleMemberSelection(member.name)}
                  />
                ))}
              </div>

              <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-100 transition-all">
                View All Members
              </button>
            </div>

            {/* Box 2: AI Recommended Block */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-purple-600">
                <Zap size={18} fill="currentColor" />
                <h3 className="text-base font-black tracking-tight">AI Recommended</h3>
              </div>

              <div className="space-y-4">
                <RecommendationCard 
                  title="Cloud Architecture 101" 
                  level="HIGH IMPACT" 
                  levelStyle="text-purple-600 bg-purple-50" 
                  text="Recommended for Marcus Chen to bridge infrastructure gap." 
                  onAction={() => openAssignModal({ name: "Cloud Architecture 101", targetUser: "Marcus Chen" })}
                />
                <RecommendationCard 
                  title="Agile Transformation" 
                  level="MED IMPACT" 
                  levelStyle="text-amber-600 bg-amber-50" 
                  text="Recommended for Frontend Team for process alignment." 
                  buttonText="Assign to Team" 
                  onAction={() => openAssignModal({ name: "Agile Transformation", targetTeam: "Frontend Team" })}
                />
              </div>
            </div>

            {/* Box 3: Predicted Impact Card */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Predicted Impact</h3>
              
              <div className="space-y-4">
                <ImpactProgressBar label="Skill Growth" value="+18%" percent={78} color="bg-emerald-500" />
                <ImpactProgressBar label="Readiness Score" value="+12%" percent={55} color="bg-blue-500" />
                
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  Predictions based on similar team historical data.
                </p>
              </div>
            </div>

            {/* Box 4: Dark Actions Block */}
            <div className="bg-[#0b0f19] p-6 rounded-[2.5rem] text-white shadow-xl space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-1">Actions</h3>
              <button 
                onClick={() => openAssignModal()}
                disabled={selectedMembers.length === 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                Assign Selected ({selectedMembers.length})
              </button>
              <button 
                onClick={() => openAssignModal({ targetTeam: "Entire Team" })}
                className="w-full py-3.5 bg-[#131926] hover:bg-[#1a2233] text-slate-300 border border-slate-800 font-bold text-sm rounded-xl transition-all text-center"
              >
                Assign to Entire Team
              </button>
              <button className="w-full py-3.5 bg-[#131926] hover:bg-[#1a2233] text-slate-300 border border-slate-800 font-bold text-sm rounded-xl transition-all text-center">
                Generate Report
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* Assignment Modal Drawer */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Training Assignment</h3>
                <p className="text-xs text-slate-500">
                  {activeProgramToAssign ? activeProgramToAssign.name : 'Selected Modules'}
                </p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assigned Recipients</label>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((m, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1 rounded-full font-bold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Note for Assignees (Optional)</label>
                <textarea 
                  rows={3} 
                  value={assignmentNote} 
                  onChange={(e) => setAssignmentNote(e.target.value)} 
                  placeholder="Provide context or learning objectives..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAssignModalOpen(false)} 
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  Confirm & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Component Helpers --- */
const TopMetricCard = ({ title, value, extra, color, extraColor = "text-slate-400", children }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
      <p className={`text-xs font-semibold ${extraColor}`}>{extra}</p>
    </div>
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
      {children}
    </div>
  </div>
);

const TrainingRow = ({ name, domain, skill, skillColor, diff, diffColor, duration, onAssign }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="py-4 px-6">
      <div className="font-extrabold text-slate-900 leading-tight">{name}</div>
      <div className="text-xs text-slate-400 font-medium mt-0.5">{domain}</div>
    </td>
    <td className="py-4 px-6">
      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${skillColor}`}>
        {skill}
      </span>
    </td>
    <td className="py-4 px-6">
      <div className={`flex items-center gap-1.5 text-xs font-bold ${diffColor}`}>
        <span className="w-1.5 h-1.5 rounded-full fill-current bg-current"></span>
        {diff}
      </div>
    </td>
    <td className="py-4 px-6 text-slate-400 font-bold text-xs">{duration}</td>
    <td className="py-4 px-6 text-center">
      <button 
        onClick={onAssign}
        className="bg-[#0b1221] hover:bg-[#151f33] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
      >
        Assign
      </button>
    </td>
  </tr>
);

const TrackerRow = ({ name, user, img, date, progress, status, statusStyle, progressColor }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="py-4 px-6 text-slate-900 font-extrabold">{name}</td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-2.5">
        <img src={img} alt={user} className="w-6 h-6 rounded-full object-cover" />
        <span className="text-slate-700 text-xs font-bold">{user}</span>
      </div>
    </td>
    <td className="py-4 px-6 text-slate-400 font-medium text-xs">{date}</td>
    <td className="py-4 px-6 w-36">
      <div className="flex items-center gap-3">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${progressColor}`} style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs font-black text-slate-600">{progress}%</span>
      </div>
    </td>
    <td className="py-4 px-6">
      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusStyle}`}>
        {status}
      </span>
    </td>
  </tr>
);

const MemberCheckRow = ({ name, role, gap, gapStyle, img, isSelected, onToggle }) => (
  <div 
    onClick={onToggle}
    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
      isSelected ? 'bg-blue-50/40 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-200'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
      }`}>
        {isSelected && <Check size={12} strokeWidth={3} />}
      </div>
      <img src={img} alt={name} className="w-9 h-9 rounded-full object-cover" />
      <div>
        <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{name}</h4>
        <p className="text-xs text-slate-400 font-medium">{role}</p>
      </div>
    </div>
    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${gapStyle}`}>
      {gap}
    </span>
  </div>
);

const RecommendationCard = ({ title, level, levelStyle, text, buttonText = "Assign Training", onAction }) => (
  <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 flex flex-col gap-3">
    <div className="flex justify-between items-start">
      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{title}</h4>
      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${levelStyle}`}>
        {level}
      </span>
    </div>
    <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
    <button 
      onClick={onAction}
      className="w-full mt-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
    >
      {buttonText}
    </button>
  </div>
);

const ImpactProgressBar = ({ label, value, percent, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="text-slate-500">{label}</span>
      <span className={`${color.replace('bg-', 'text-')} font-extrabold`}>{value}</span>
    </div>
    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default AssignLearning;