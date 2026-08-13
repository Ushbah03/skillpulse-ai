import React, { useState } from 'react';
import TeamLeaderSidebar from './TeamLeaderSidebar'; 
import { 
  Plus, 
  ChevronDown, 
  Info, 
  Users, 
  UserPlus, 
  Handshake, 
  Zap, 
  Check,
  BrainCircuit,
  Settings2,
  X,
  Loader2,
  Save,
  CheckCircle2
} from 'lucide-react';

const TeamFormation = () => {
  const [activeTab, setActiveTab] = useState('team-formation');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' or 'draft'

  // Input State
  const [projectName, setProjectName] = useState('E-Commerce Redesign');
  const [skills, setSkills] = useState(['React.js', 'Node.js', 'UI/UX Design', 'AWS']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [proficiency, setProficiency] = useState('Mid-Senior');
  const [complexity, setComplexity] = useState('High');

  // Candidate Data State
  const [candidates, setCandidates] = useState([
    { id: '1', name: 'Sarah Jenkins', role: 'Frontend Engineer', match: 95, comp: 98, ready: 92, selected: true, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', compStyle: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { id: '2', name: 'Liam Wilson', role: 'Backend Architect', match: 88, comp: 91, ready: 85, selected: true, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', compStyle: 'text-blue-600 bg-blue-50 border-blue-100' },
    { id: '3', name: 'Nina Gupta', role: 'UX/UI Designer', match: 82, comp: 84, ready: 90, selected: true, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', compStyle: 'text-purple-600 bg-purple-50 border-purple-100' },
    { id: '4', name: 'David Park', role: 'DevOps Lead', match: 79, comp: 88, ready: 80, selected: false, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', compStyle: 'text-amber-600 bg-amber-50 border-amber-100' }
  ]);

  // Dynamic calculations based on selection
  const selectedCandidates = candidates.filter(c => c.selected);
  const avgReadiness = selectedCandidates.length 
    ? Math.round(selectedCandidates.reduce((acc, c) => acc + c.ready, 0) / selectedCandidates.length) 
    : 0;

  const toggleCandidate = (id) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkillInput.trim())) {
        setSkills([...skills, newSkillInput.trim()]);
      }
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
  };

  const openConfirmation = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Constant Sidebar */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-12 max-w-[1600px] mx-auto space-y-10">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-black text-[#0b1221] tracking-tight">AI-Based Team Formation</h1>
            <p className="text-slate-500 text-base font-semibold mt-2">Create optimized teams using AI skill intelligence and compatibility analysis</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <Settings2 size={18} className="text-slate-400" />
              <span>{projectName}</span>
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            <button onClick={() => openConfirmation('create')} className="flex items-center gap-2 bg-[#0b1221] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all">
              <Plus size={18} />
              <span>Create New Team</span>
            </button>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
               <div className="text-right">
                  <p className="text-base font-black text-slate-900 leading-none">Alex Morgan</p>
                  <p className="text-sm font-bold text-slate-400 mt-1.5">Team Lead</p>
               </div>
               <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" alt="Profile" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </header>

        {/* 1. Top Performance Metrics Cards */}
        <div className="grid grid-cols-4 gap-6">
          <OverviewCard title="TOTAL AVAILABLE" value="124" icon={<Users className="text-slate-400" size={22}/>} />
          <OverviewCard title="AI RECOMMENDED" value={`${candidates.length} Members`} color="text-purple-600" icon={<UserPlus className="text-purple-400" size={22}/>} isAIPowered={true} />
          <OverviewCard title="AVG. COMPATIBILITY" value="High" subValue="82%" icon={<Handshake className="text-emerald-400" size={22}/>} showBadge={true} />
          <OverviewCard title="READINESS SCORE" value={`${avgReadiness}%`} icon={<Zap className="text-amber-400" size={22}/>} showProgress={true} progressVal={avgReadiness} />
        </div>

        {/* 2. Main Setup Grid (Requirements vs Recommended) */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left: Project Requirements Form */}
          <div className="col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <BrainCircuit size={24} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Project Requirements</h3>
              </div>

              <div className="space-y-5">
                 <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2.5">Project Name</label>
                    <input 
                      type="text" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., Next-Gen Mobile App" 
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" 
                    />
                 </div>

                 <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2.5">Required Skills</label>
                    <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl min-h-[140px] flex flex-col justify-between gap-3">
                       <div className="flex flex-wrap gap-2">
                         {skills.map((skill, idx) => (
                           <SkillTag key={idx} label={skill} onRemove={() => removeSkill(skill)} />
                         ))}
                       </div>
                       <input 
                         type="text" 
                         value={newSkillInput}
                         onChange={(e) => setNewSkillInput(e.target.value)}
                         onKeyDown={handleAddSkill}
                         placeholder="Type skill & press Enter..." 
                         className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none w-full border-t border-slate-200/60 pt-2"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2.5">Proficiency</label>
                       <select 
                         value={proficiency} 
                         onChange={(e) => setProficiency(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                       >
                          <option>Junior-Mid</option>
                          <option>Mid-Senior</option>
                          <option>Lead/Architect</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2.5">Complexity</label>
                       <select 
                         value={complexity} 
                         onChange={(e) => setComplexity(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                       >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                       </select>
                    </div>
                 </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-75"
            >
               {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
               <span>{isGenerating ? 'Analyzing Team Matches...' : 'Generate AI Team'}</span>
            </button>
          </div>

          {/* Right: AI Recommended Team Members List */}
          <div className="col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AI Recommended Team Members</h3>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                 <span>Sort by:</span>
                 <span className="text-blue-600 cursor-pointer hover:underline">Compatibility</span>
                 <ChevronDown size={14} />
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex text-xs font-black text-slate-400 uppercase tracking-widest px-6 pb-1">
                  <div className="w-1/3">Member</div>
                  <div className="w-1/5 text-center">Skill Match</div>
                  <div className="w-1/5 text-center">Comp. Score</div>
                  <div className="w-1/5 text-center">Readiness</div>
                  <div className="w-1/12 text-right">Select</div>
               </div>
               
               <div className="space-y-3.5">
                  {candidates.map((candidate) => (
                    <TeamMemberRow 
                      key={candidate.id}
                      name={candidate.name} 
                      role={candidate.role} 
                      match={`${candidate.match}% Match`} 
                      matchColor={candidate.match > 85 ? "text-blue-600" : "text-slate-500"} 
                      comp={`${candidate.comp}%`} 
                      compColor={candidate.compStyle} 
                      ready={`${candidate.ready}%`} 
                      img={candidate.img}
                      isSelected={candidate.selected}
                      onToggle={() => toggleCandidate(candidate.id)}
                    />
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Analysis Grid */}
        <div className="grid grid-cols-12 gap-8">
           
           {/* Team Balance Analysis Block */}
           <div className="col-span-4">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm h-full flex flex-col justify-between space-y-6">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-5">Team Balance Analysis</h3>
                    <div className="space-y-5">
                       <BalanceItem icon={<Check className="text-emerald-500" size={20} strokeWidth={3} />} label="Skill Coverage" text="94% of required skills are covered by the recommended team." />
                       <BalanceItem icon={<Check className="text-emerald-500" size={20} strokeWidth={3} />} label="Compatibility" text="Team members have high historical collaboration scores." />
                       <BalanceItem icon={<div className="w-3 h-3 bg-amber-500 rounded-full mt-1"></div>} label="Gap Identified" text="Infrastructure/DevOps proficiency is slightly below target." />
                    </div>
                 </div>
                 
                 <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                       <Zap size={14} className="text-blue-600" fill="currentColor" />
                       <span className="text-xs font-black text-blue-600 uppercase tracking-wider">AI Insight</span>
                    </div>
                    <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                       Consider adding a Senior DevOps specialist to increase readiness by <span className="text-blue-600 font-black">14%</span>.
                    </p>
                 </div>
              </div>
           </div>

           {/* Compatibility Matrix */}
           <div className="col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight">Compatibility Matrix</h3>
                 <Info size={18} className="text-slate-300" />
              </div>
              <div className="flex flex-col items-center gap-5 my-auto">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">HEATMAP VIEW</p>
                 <div className="grid grid-cols-4 gap-3 w-full max-w-[250px]">
                    {[...Array(16)].map((_, i) => (
                       <div key={i} className={`aspect-square rounded-xl transition-all hover:scale-105 ${i === 5 || i === 10 ? 'bg-blue-600' : i % 3 === 0 ? 'bg-blue-400' : 'bg-blue-100'}`}></div>
                    ))}
                 </div>
                 <div className="flex justify-between w-full max-w-[250px] text-xs font-black text-slate-400 uppercase pt-2">
                    <span>Low Comp.</span>
                    <span>Optimal</span>
                 </div>
              </div>
           </div>

           {/* Skill Coverage Visualization */}
           <div className="col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight">Skill Coverage Visualization</h3>
                 <Info size={18} className="text-slate-300" />
              </div>
              <div className="flex items-center justify-center min-h-[210px] relative my-auto">
                 <svg className="w-48 h-48 text-slate-200" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.75" />
                    <polygon points="50,18 78,50 50,82 22,50" fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" strokeWidth="2.5" />
                 </svg>
                 <div className="absolute top-2 left-6 flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-bold text-slate-700">React</span>
                 </div>
                 <div className="absolute bottom-2 right-6 flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-700">Node.js</span>
                 </div>
              </div>
           </div>
        </div>

        {/* 4. Proposed Team Preview */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
           <h3 className="text-xl font-bold text-slate-900 tracking-tight">Proposed Team Preview ({selectedCandidates.length})</h3>
           <div className="flex items-center gap-8">
              <div className="flex flex-wrap items-center gap-4 flex-1">
                 {selectedCandidates.map((member) => (
                   <ProposedMember key={member.id} name={member.name} role={member.role.split(' ')[0]} match={`${member.match}%`} img={member.img} />
                 ))}
                 <div className="w-14 h-14 rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-sm font-black text-slate-400 cursor-pointer hover:bg-slate-100 hover:border-slate-400 transition-all">
                    + Add
                 </div>
              </div>
           </div>
        </div>

        {/* 5. Sticky Action Prediction Footer */}
        <div className="bg-[#0b0f19] p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl">
           <div>
              <h3 className="text-2xl font-bold tracking-tight mb-1">Team Readiness Prediction</h3>
              <p className="text-slate-400 text-base font-semibold">
                Selected team is <span className="text-blue-400 font-black">{avgReadiness}% ready</span> for deployment.
              </p>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => openConfirmation('draft')} 
                className="px-8 py-4 bg-[#131926] hover:bg-[#1a2233] text-slate-300 border border-slate-800 font-bold text-sm rounded-2xl transition-all flex items-center gap-2"
              >
                 <Save size={16} />
                 <span>Save Team Draft</span>
              </button>
              <button 
                onClick={() => openConfirmation('create')} 
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                 <CheckCircle2 size={18} />
                 <span>Create Team</span>
              </button>
           </div>
        </div>

      </main>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {modalType === 'create' ? 'Confirm Team Deployment' : 'Save Team Draft'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {modalType === 'create' 
                ? `Are you sure you want to deploy ${selectedCandidates.length} members to the "${projectName}" project?` 
                : `This will save your active configuration and selected ${selectedCandidates.length} members as a draft.`
              }
            </p>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Helper Components --- */

const OverviewCard = ({ title, value, subValue, icon, color = "text-slate-900", isAIPowered, showBadge, showProgress, progressVal = 88 }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden">
    <div className="flex justify-between items-start">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      {icon}
    </div>
    <div className="mt-4">
      <div className="flex items-baseline gap-2">
         <h4 className={`text-4xl font-black tracking-tight ${color}`}>{value}</h4>
         {subValue && <span className="text-sm font-black text-slate-400">{subValue}</span>}
      </div>
      {isAIPowered && <div className="absolute top-3 right-3"><div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div></div>}
      {showBadge && <div className="absolute bottom-7 right-7 px-3 py-1.5 bg-emerald-50 rounded-xl flex items-center justify-center text-xs font-black text-emerald-600 border border-emerald-100 shadow-sm">82% Match</div>}
      {showProgress && (
        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progressVal}%` }}></div>
        </div>
      )}
    </div>
  </div>
);

const SkillTag = ({ label, onRemove }) => (
   <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm transition-all hover:border-slate-300">
      {label}
      <button onClick={onRemove} className="text-slate-400 hover:text-rose-500 font-extrabold text-sm ml-1">×</button>
   </div>
);

const TeamMemberRow = ({ name, role, match, matchColor, comp, compColor, ready, img, isSelected, onToggle }) => (
   <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all shadow-sm ${
     isSelected ? 'bg-blue-50/30 border-blue-200' : 'bg-slate-50/60 border-transparent hover:border-slate-200/80 hover:bg-white'
   }`}>
      <div className="flex items-center gap-4 w-1/3">
         <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
         <div>
            <p className="text-base font-black text-slate-900 leading-tight">{name}</p>
            <p className="text-sm font-bold text-slate-400 mt-1">{role}</p>
         </div>
      </div>
      <div className={`w-1/5 text-center text-sm font-black ${matchColor}`}>{match}</div>
      <div className="w-1/5 flex justify-center">
         <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black border ${compColor}`}>{comp}</span>
      </div>
      <div className="w-1/5 text-center text-base font-black text-slate-700">{ready}</div>
      <div className="w-1/12 flex justify-end">
         <button 
          onClick={onToggle}
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
            isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
          }`}
         >
            {isSelected && <Check size={14} strokeWidth={4} />}
         </button>
      </div>
   </div>
);

const BalanceItem = ({ icon, label, text }) => (
   <div className="flex gap-4 items-start">
      <div className="mt-0.5">{icon}</div>
      <div>
         <p className="text-base font-black text-slate-900 leading-none mb-1.5">{label}</p>
         <p className="text-sm font-semibold text-slate-500 leading-relaxed">{text}</p>
      </div>
   </div>
);

const ProposedMember = ({ name, role, match, img }) => (
   <div className="flex items-center gap-3 bg-slate-50/80 pr-5 py-2 rounded-full border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
      <img src={img} alt={name} className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm" />
      <div>
         <p className="text-sm font-black text-slate-900 leading-none">{name}</p>
         <p className="text-xs font-bold text-slate-400 mt-1">{role} • <span className="text-blue-600">{match}</span></p>
      </div>
   </div>
);

export default TeamFormation;