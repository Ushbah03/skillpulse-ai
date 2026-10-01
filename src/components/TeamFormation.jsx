import React, { useState, useEffect } from 'react';
import TeamLeaderSidebar from './TeamLeaderSidebar'; 
import { 
  BrainCircuit,
  Check,
  X,
  Loader2,
  Sparkles,
  Save,
  CheckCircle2,
  Zap,
  TrendingUp,
  ShieldCheck,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { aiAPI, teamLeaderAPI } from '../services/api';

const defaultSkills = ['React.js', 'PostgreSQL', 'TypeScript', 'Node.js'];

const TeamFormation = () => {
  const [activeTab, setActiveTab] = useState('team-formation');
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Input State
  const [projectName, setProjectName] = useState('Full-Stack Web & API Squad');
  const [skills, setSkills] = useState(defaultSkills);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [proficiency, setProficiency] = useState('Mid-Senior');
  const [complexity, setComplexity] = useState('High');

  // Live Squad Candidate State
  const [candidates, setCandidates] = useState([]);
  const [aiReport, setAiReport] = useState(null);

  const mapSquadCandidates = (recommendedSquad) => {
    return recommendedSquad.map((cand, i) => {
      const activeProjectsCount = cand.activeProjectsCount || 0;
      const isFullCapacity = cand.isFullCapacity || activeProjectsCount >= 2;
      const capacityPct = cand.capacityPct ?? (activeProjectsCount >= 2 ? 100 : activeProjectsCount === 1 ? 50 : 0);
      const capacityLabel = cand.capacityLabel || (isFullCapacity ? '100% Capacity (Full)' : activeProjectsCount === 1 ? '50% Capacity' : '0% Available');
      const matchVal = Math.round(cand.matchScore || 0);

      return {
        id: cand.userId || `cand-${i}`,
        name: cand.name,
        role: cand.jobTitle || 'Engineer',
        match: matchVal,
        comp: matchVal,
        ready: matchVal,
        selected: !isFullCapacity && matchVal > 0, // auto-select available members with >0% match
        img: cand.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
        skillsRecorded: cand.skillsRecorded || [],
        matchedSkills: cand.matchedSkills || [],
        missingSkills: cand.missingSkills || [],
        activeProjectsCount,
        capacityPct,
        isFullCapacity,
        capacityLabel
      };
    });
  };

  // Load initial AI squad match on mount
  const runInitialMatch = async (currentSkills) => {
    try {
      setLoading(true);
      const res = await aiAPI.matchSquad(currentSkills, 6);
      if (res?.success && res.recommendedSquad) {
        setCandidates(mapSquadCandidates(res.recommendedSquad));
        setAiReport(res);
      }
    } catch (err) {
      console.warn('Error loading initial match squad:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runInitialMatch(skills);
  }, []);

  const selectedCandidates = candidates.filter(c => c.selected);
  const avgReadiness = selectedCandidates.length 
    ? Math.round(selectedCandidates.reduce((acc, c) => acc + c.ready, 0) / selectedCandidates.length) 
    : 0;

  const avgMatch = selectedCandidates.length
    ? Math.round(selectedCandidates.reduce((acc, c) => acc + c.match, 0) / selectedCandidates.length)
    : 0;

  const toggleCandidate = (id) => {
    const cand = candidates.find(c => c.id === id);
    if (!cand) return;

    if (!cand.selected && cand.isFullCapacity) {
      setErrorMessage(`Employee allocation limit reached (100% capacity) for ${cand.name}. Cannot assign to a 3rd project.`);
      setTimeout(() => setErrorMessage(''), 6000);
      return;
    }

    setCandidates(candidates.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkillInput.trim())) {
        const updated = [...skills, newSkillInput.trim()];
        setSkills(updated);
      }
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage('');
    try {
      const res = await aiAPI.matchSquad(skills, 6);
      if (res?.success && res.recommendedSquad) {
        setCandidates(mapSquadCandidates(res.recommendedSquad));
        setAiReport(res);
      }
    } catch (err) {
      console.warn('AI squad error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSquad = async () => {
    setErrorMessage('');
    if (!projectName.trim()) {
      setErrorMessage('Please enter a project name.');
      return;
    }
    if (selectedCandidates.length === 0) {
      setErrorMessage('Please select at least one squad member.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await teamLeaderAPI.createProjectSquad({
        title: projectName,
        description: `Project formed with complexity ${complexity} and target skills: ${skills.join(', ')}`,
        teamSizeTarget: selectedCandidates.length,
        requiredSkills: skills,
        selectedMembers: selectedCandidates.map(c => ({
          userId: c.id,
          name: c.name,
          role: c.role,
          matchScore: c.match,
          avatarUrl: c.img
        }))
      });

      if (res?.success) {
        setToastMessage(`Project Squad "${projectName}" formed & saved successfully!`);
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      console.error('Failed to save project squad:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Failed to save project squad.';
      setErrorMessage(serverMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const leaderName = storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : 'Team Leader';

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Constant Sidebar */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Form & Squad Studio Area - Fluid Full Width Container */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full space-y-8">
        
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

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="bg-red-600 text-white px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-between font-bold text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage('')} className="hover:opacity-80 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Top Header */}
        <header className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1">
                <BrainCircuit className="w-3 h-3" /> AI Optimization Engine
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#0b1221] tracking-tight">Project Squad Formation</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Assemble high-performance cross-functional project teams matched against live skill taxonomies
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isGenerating ? 'Running Matchmaker...' : 'Generate AI Squad'}</span>
            </button>

            <button 
              onClick={handleSaveSquad}
              disabled={isSaving || selectedCandidates.length === 0}
              className="bg-[#0b1221] hover:bg-[#151f33] text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:bg-slate-300"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>Save Squad</span>
            </button>
          </div>
        </header>

        {/* 12-Column Balanced Grid Layout */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: Requirements & Candidates Grid */}
          <div className="col-span-8 space-y-8">
            
            {/* Project Parameters Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Project Requirements & Target Skills</h3>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Project Name</label>
                  <input 
                    type="text" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Required Experience</label>
                  <select 
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option>Mid-Senior</option>
                    <option>Senior-Lead</option>
                    <option>All Levels</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Project Complexity</label>
                  <select 
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option>High</option>
                    <option>Critical</option>
                    <option>Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Target Skills (Press Enter to Add)</label>
                <div className="flex flex-wrap gap-2 items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  {skills.map(s => (
                    <span key={s} className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2">
                      {s}
                      <X size={14} className="cursor-pointer hover:text-red-200" onClick={() => removeSkill(s)} />
                    </span>
                  ))}
                  <input 
                    type="text"
                    placeholder="Type skill & enter..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none px-2 py-1 flex-1 min-w-[150px]"
                  />
                </div>
              </div>
            </div>

            {/* AI Skill Deficiency & Hiring Prompt Alert Banner */}
            {aiReport?.hasDeficiency && (
              <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500 text-white rounded-2xl shrink-0 mt-0.5 shadow-md">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                        AI Skill Deficit Warning
                      </span>
                      <span className="text-xs font-extrabold text-amber-900">
                        Target Skill Coverage: {aiReport.skillCoveragePct || 0}%
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-amber-950 leading-tight">
                      Team Missing Verified Skills in [{aiReport.missingInTeam.join(', ')}]
                    </h4>
                    <p className="text-xs md:text-sm font-medium text-amber-900/90 leading-relaxed">
                      {aiReport.aiHiringRecommendation}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button 
                        onClick={() => navigate('/team-leader/assign-learning')}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" /> Assign LMS Training
                      </button>
                      <button 
                        onClick={() => navigate('/team-leader/requests')}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" /> Initiate Hire Requisition
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Matched Squad Results */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Recommended Project Squad</h3>
                  <p className="text-xs text-slate-500 font-medium">Ranked strictly by verified database skill proficiencies and project readiness</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Average Readiness:</span>
                  <span className="text-base font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
                    {avgReadiness}%
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-blue-600 mr-3" size={24} />
                  <span className="text-sm font-bold text-slate-600">Matching candidates against skills...</span>
                </div>
              ) : candidates.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {candidates.map((c) => (
                    <div 
                      key={c.id} 
                      className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                        c.selected 
                          ? 'border-blue-600 bg-blue-50/20 shadow-sm' 
                          : c.isFullCapacity
                            ? 'border-red-200 bg-red-50/10 opacity-75'
                            : 'border-slate-100 bg-white opacity-70'
                      }`}
                      onClick={() => toggleCandidate(c.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <img src={c.img} alt={c.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{c.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">{c.role}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          c.selected ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 bg-white'
                        }`}>
                          {c.selected && <Check size={14} />}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Skill Match</p>
                          <p className="text-sm font-bold text-blue-600">{c.match}%</p>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Competency</p>
                          <p className="text-sm font-bold text-purple-600">{c.comp}%</p>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Readiness</p>
                          <p className="text-sm font-bold text-emerald-600">{c.ready}%</p>
                        </div>
                      </div>

                      {/* Matched Skills Badges */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {c.matchedSkills && c.matchedSkills.length > 0 ? (
                          c.matchedSkills.map((ms, idx) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              ✓ {ms}
                            </span>
                          ))
                        ) : (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            0 Target Skills Matched
                          </span>
                        )}
                      </div>

                      {/* Option B Capacity Badge Pill */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                          c.isFullCapacity 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : c.activeProjectsCount === 1 
                              ? 'bg-amber-50 text-amber-800 border-amber-200' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            c.isFullCapacity ? 'bg-red-500' : c.activeProjectsCount === 1 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}></span>
                          {c.capacityLabel} ({c.activeProjectsCount}/2 Active)
                        </span>

                        {c.isFullCapacity && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            Max Limit
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm font-bold bg-slate-50 rounded-3xl border border-slate-100">
                  No matching candidates found in the database.
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: Squad Analytics & Fast Actions Panel */}
          <div className="col-span-4 space-y-6">
            
            {/* Box 1: Squad Synergy & Fit Analytics */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-blue-600">
                <ShieldCheck size={20} />
                <h3 className="text-base font-black text-slate-900 tracking-tight">Squad Synergy Metrics</h3>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-500">Overall Match Score</span>
                  <span className="text-base font-black text-blue-600">{avgMatch}%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-500">Average Readiness</span>
                  <span className="text-base font-black text-emerald-600">{avgReadiness}%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-500">Selected Members</span>
                  <span className="text-base font-black text-purple-600">{selectedCandidates.length} / {candidates.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Target Skills Covered</span>
                  <span className="text-base font-black text-indigo-600">{skills.length} Skills</span>
                </div>
              </div>
            </div>

            {/* Box 2: AI Composition Insights */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-purple-600">
                <Zap size={18} fill="currentColor" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">AI Composition Insight</h3>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-purple-50/50 p-4 rounded-2xl border border-purple-100/70">
                The current candidate selection provides <strong className="text-purple-700">{avgMatch}% skill coverage</strong> for <strong className="text-purple-700">{skills.join(', ')}</strong> with balanced experience levels across the squad.
              </p>
            </div>

            {/* Box 3: Dark Action Controls */}
            <div className="bg-[#0b0f19] p-6 rounded-[2.5rem] text-white shadow-xl space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-1">Squad Actions</h3>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>Re-Run AI Matchmaker</span>
              </button>
              <button 
                onClick={handleSaveSquad}
                disabled={isSaving || selectedCandidates.length === 0}
                className="w-full py-3.5 bg-[#131926] hover:bg-[#1a2233] text-slate-300 border border-slate-800 font-bold text-sm rounded-xl transition-all text-center cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Formed Squad</span>
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default TeamFormation;