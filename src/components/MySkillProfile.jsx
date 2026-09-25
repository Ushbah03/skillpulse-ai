import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar 
} from 'recharts';
import { 
  Search, Plus, CheckCircle, Clock, Target, Layout, Code, Mic2, Filter, Download, MoreHorizontal, Sparkles, ArrowRight, X, ChevronDown, Loader2, Trash2, Edit3
} from 'lucide-react';
import { employeeAPI } from '../services/api';

const MySkillProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Add/Edit Skill Modal State
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [savingSkill, setSavingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({ id: '', name: '', category: 'Technical', level: 3 });

  // AI Skill Extractor Modal State
  const [showAiExtractor, setShowAiExtractor] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [extractingAi, setExtractingAi] = useState(false);
  const [aiExtractSuccessMsg, setAiExtractSuccessMsg] = useState('');
  const [aiExtractErrorMsg, setAiExtractErrorMsg] = useState('');

  // Action dropdown state
  const [activeMenuId, setActiveMenuId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, gapsRes] = await Promise.allSettled([
        employeeAPI.getProfile(),
        employeeAPI.getGaps()
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.success && profileRes.value?.data) {
        setProfile(profileRes.value.data);
      }
      if (gapsRes.status === 'fulfilled' && gapsRes.value?.success && gapsRes.value?.data) {
        setGaps(gapsRes.value.data);
      }
    } catch (err) {
      console.warn('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const user = profile || storedUser;
  const rawSkills = profile?.skills || [];
  const rawGaps = gaps || [];

  const totalSkills = rawSkills.length;
  const validatedSkills = rawSkills.filter(s => s.verified).length;

  // Compute Categories for Filter
  const categories = ['All', ...Array.from(new Set(rawSkills.map(s => s.skill?.category?.name || 'Technical')))];

  // Compute Dynamic Radar Data from REAL skills
  const radarMap = {};
  rawSkills.forEach(s => {
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
        { subject: 'Technical', A: 70 },
        { subject: 'Domain', A: 60 },
        { subject: 'Soft Skills', A: 80 },
        { subject: 'Leadership', A: 50 }
      ];

  // Calculate Overall Role Alignment
  const avgProficiency = rawSkills.length > 0 
    ? (rawSkills.reduce((acc, curr) => acc + (curr.proficiencyLevel || 0), 0) / rawSkills.length)
    : 0;
  const alignmentPct = rawSkills.length > 0 ? Math.min(100, Math.round((avgProficiency / 5.0) * 100)) : 0;

  // Filter skills list
  const filteredSkills = rawSkills.filter(s => {
    const matchesSearch = (s.skill?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || (s.skill?.category?.name || 'Technical') === filterCategory;
    return matchesSearch && matchesCat;
  });

  // Top Critical Gap for AI Recommendation Banner
  const topCriticalGap = rawGaps.find(g => g.severity === 'CRITICAL') || rawGaps[0] || null;

  // Compute Dynamic AI Career Advisor Insight based on real DB skills portfolio
  const techSkills = rawSkills.filter(s => (s.skill?.category?.name || '').toLowerCase().includes('tech') || (s.skill?.category?.name || '').toLowerCase().includes('design'));
  const softSkills = rawSkills.filter(s => (s.skill?.category?.name || '').toLowerCase().includes('soft') || (s.skill?.category?.name || '').toLowerCase().includes('lead'));
  
  const avgTech = techSkills.length > 0 ? (techSkills.reduce((a, b) => a + (b.proficiencyLevel || 0), 0) / techSkills.length) : 3.0;
  const avgSoft = softSkills.length > 0 ? (softSkills.reduce((a, b) => a + (b.proficiencyLevel || 0), 0) / softSkills.length) : 3.0;

  let aiAdvisorTitle = "Career Velocity & Promotion Insight";
  let aiAdvisorText = "Your verified skill inventory shows balanced competency. Continue building high-impact technical & leadership capabilities to unlock senior promotion tracks.";

  if (avgTech >= 3.8 && avgSoft < 3.5) {
    aiAdvisorTitle = "High Technical Mastery • Soft Skills Opportunity";
    aiAdvisorText = `Your technical proficiency is strong (${Math.round(avgTech * 20)}%). Elevating Workplace Communication & Problem Solving will accelerate your eligibility for Senior Lead roles.`;
  } else if (avgSoft >= 3.8 && avgTech < 3.5) {
    aiAdvisorTitle = "Strong Leadership Profile • Technical Growth Needed";
    aiAdvisorText = `Your leadership & collaboration capabilities are key assets (${Math.round(avgSoft * 20)}%). Strengthening core technical skills will maximize your overall role alignment index.`;
  } else if (rawGaps.length > 0) {
    aiAdvisorTitle = `Focus Track: ${topCriticalGap?.skill?.name || 'Skill Alignment'}`;
    aiAdvisorText = `Bridging your ${topCriticalGap?.severity || 'HIGH'} priority gap in ${topCriticalGap?.skill?.name || 'core areas'} will increase your promotion readiness index by +${Math.round(((topCriticalGap?.requiredLevel - topCriticalGap?.currentLevel) / 5.0) * 100) || 25}%.`;
  }

  // --- Export to CSV ---
  const handleExport = () => {
    const headers = ['Skill Name', 'Category', 'Proficiency', 'Status', 'Readiness %', 'Last Updated'];
    const rows = rawSkills.map(s => {
      const prof = s.proficiencyLevel || 3.0;
      const levelLabel = prof >= 4.5 ? 'Expert' : prof >= 3.5 ? 'Advanced' : prof >= 2.5 ? 'Intermediate' : 'Beginner';
      return [
        `"${s.skill?.name || 'N/A'}"`,
        `"${s.skill?.category?.name || 'Technical'}"`,
        `"${levelLabel} (${prof})"`,
        s.verified ? 'Validated' : 'Pending',
        `${Math.round(prof * 20)}%`,
        s.lastAssessedAt ? new Date(s.lastAssessedAt).toLocaleDateString() : 'Active'
      ];
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_skills_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Add or Update Skill in Backend ---
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    setSavingSkill(true);

    try {
      const payload = {
        skillId: skillForm.id || undefined,
        skillName: skillForm.name,
        categoryName: skillForm.category,
        proficiencyLevel: skillForm.level
      };

      const res = await employeeAPI.addSelfSkill(payload);
      if (res?.success) {
        setShowAddSkill(false);
        setEditingSkill(null);
        setSkillForm({ id: '', name: '', category: 'Technical', level: 3 });
        await loadData(); // Reload live DB profile
      }
    } catch (err) {
      console.error('Failed to save skill:', err);
    } finally {
      setSavingSkill(false);
    }
  };

  // --- Delete Skill from Backend ---
  const handleDeleteSkill = async (userSkillId) => {
    if (!window.confirm('Are you sure you want to remove this skill from your profile?')) return;
    try {
      const res = await employeeAPI.deleteSkill(userSkillId);
      if (res?.success) {
        setActiveMenuId(null);
        await loadData();
      }
    } catch (err) {
      console.error('Failed to delete skill:', err);
    }
  };

  // --- Handle Edit Skill Click ---
  const handleOpenEdit = (us) => {
    setEditingSkill(us);
    setSkillForm({
      id: us.skillId || us.skill?.id || '',
      name: us.skill?.name || '',
      category: us.skill?.category?.name || 'Technical',
      level: us.proficiencyLevel || 3
    });
    setActiveMenuId(null);
    setShowAddSkill(true);
  };

  // --- AI Skill Extraction Handler ---
  const handleAiExtractSkills = async (e) => {
    e.preventDefault();
    if (!aiInputText || aiInputText.trim().length < 10) {
      setAiExtractErrorMsg('Please paste at least 10 characters of resume or project text.');
      return;
    }

    setAiExtractErrorMsg('');
    setAiExtractSuccessMsg('');
    setExtractingAi(true);

    try {
      const res = await employeeAPI.aiExtractSkills(aiInputText);
      setExtractingAi(false);
      if (res?.success) {
        setAiExtractSuccessMsg(res.message || 'Skills successfully extracted and added to your profile!');
        setAiInputText('');
        await loadData();
        setTimeout(() => {
          setShowAiExtractor(false);
          setAiExtractSuccessMsg('');
        }, 2000);
      } else {
        setAiExtractErrorMsg(res?.message || 'Failed to extract skills via AI.');
      }
    } catch (err) {
      setExtractingAi(false);
      setAiExtractErrorMsg(err.message || 'AI extraction failed. Please try again.');
    }
  };

  // --- Enroll in Course for Gap ---
  const handleEnrollGapCourse = async (gap) => {
    if (gap.assignedCourseId) {
      try {
        await employeeAPI.enrollCourse(gap.assignedCourseId);
        navigate('/dashboard/learning');
      } catch (err) {
        navigate('/dashboard/learning');
      }
    } else {
      navigate('/dashboard/learning');
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-10 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
              {user.tenant?.name || 'Enterprise Corp Workspace'}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {user.firstName ? `${user.firstName} ${user.lastName}'s Profile` : 'My Skill Profile'}
          </h1>
          <p className="text-slate-500 text-base mt-1 font-medium">
            {user.jobTitle ? `${user.jobTitle} • ` : ''}View and manage your professional skills and readiness
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..." 
              className="pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl w-72 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-sm" 
            />
          </div>
          <button 
            onClick={() => {
              setEditingSkill(null);
              setSkillForm({ id: '', name: '', category: 'Technical', level: 3 });
              setShowAddSkill(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus className="w-5 h-5" /> Add Skill
          </button>
          <button 
            onClick={() => setShowAiExtractor(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-sm uppercase tracking-wider hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-900/20"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" /> AI Skill Extractor
          </button>
          <img 
            src={user.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"} 
            alt="profile" 
            className="w-12 h-12 rounded-full border-2 border-white shadow-md ml-2 object-cover" 
          />
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        <ProfileStat icon={Layout} label="Total Skills" value={totalSkills} color="blue" />
        <ProfileStat icon={CheckCircle} label="Validated Skills" value={validatedSkills} color="emerald" />
        <ProfileStat icon={Clock} label="Active Gaps" value={rawGaps.length} color="orange" />
        <ProfileStat icon={Target} label="Role Alignment" value={`${alignmentPct}%`} color="violet" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        {/* Dynamic Category Radar Chart */}
        <div className="col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Proficiency by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 13, fontWeight: 700 }} />
                <Radar dataKey="A" stroke="#8B5CF6" strokeWidth={3} fill="#A78BFA" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Readiness Contribution */}
        <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Readiness Contribution</h3>
          {rawSkills.length > 0 ? (
            <div className="space-y-6">
              {rawSkills.slice(0, 3).map((s, idx) => {
                const prof = s.proficiencyLevel || 3.0;
                const pct = Math.round((prof / 5.0) * 100);
                const isHigh = prof >= 3.5;
                return (
                  <ContributionItem 
                    key={s.id || idx}
                    icon={Code} 
                    title={s.skill?.name || 'Skill'} 
                    impact={`${isHigh ? '+' : ''}${Math.round(prof * 5)}% (${s.skill?.category?.name || 'Core'})`} 
                    progress={pct} 
                    color={isHigh ? 'emerald' : 'orange'} 
                  />
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 font-medium text-sm">
              No skill data available yet. Click "Add Skill" to build your readiness profile.
            </div>
          )}
        </div>
      </div>

      {/* Skills Inventory Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">My Skills Inventory</h3>
          <div className="flex gap-3 relative">
            <button 
              onClick={() => setShowFilterPanel(p => !p)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" /> Filter
              {filterCategory !== 'All' && <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">{filterCategory}</span>}
            </button>
            {showFilterPanel && (
              <div className="absolute top-12 left-0 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 min-w-[180px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Filter by Category</p>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFilterCategory(cat); setShowFilterPanel(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                      filterCategory === cat ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {filteredSkills.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Skill Name</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Proficiency</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Readiness %</th>
                <th className="px-8 py-4">Last Updated</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSkills.map((us, idx) => {
                const skillName = us.skill?.name || 'Unnamed Skill';
                const catName = us.skill?.category?.name || 'Technical';
                const prof = us.proficiencyLevel || 3.0;
                const levelLabel = prof >= 4.5 ? 'Expert' : prof >= 3.5 ? 'Advanced' : prof >= 2.5 ? 'Intermediate' : 'Beginner';
                const statusLabel = us.verified ? 'Validated' : 'Pending';

                return (
                  <tr key={us.id || idx} className="hover:bg-slate-50/50 transition-colors text-sm relative">
                    <td className="px-8 py-5 flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${prof >= 4.0 ? 'bg-blue-500' : prof >= 2.5 ? 'bg-violet-500' : 'bg-orange-500'}`}></div>
                      <span className="font-bold text-slate-800">{skillName}</span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-medium">{catName}</td>
                    <td className="px-8 py-5">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold text-[11px]">{levelLabel} ({prof})</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${
                        statusLabel === 'Validated' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-800">{Math.round(prof * 20)}%</td>
                    <td className="px-8 py-5 text-slate-400 font-medium">{us.lastAssessedAt ? new Date(us.lastAssessedAt).toLocaleDateString() : 'Active'}</td>
                    <td className="px-8 py-5 text-right relative">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === us.id ? null : us.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {/* Action Menu Dropdown */}
                        {activeMenuId === us.id && (
                          <div className="absolute right-0 top-10 z-40 bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-36 text-left">
                            <button
                              onClick={() => handleOpenEdit(us)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Edit Level
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(us.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center text-slate-400 font-medium">
            No skills found. Click "Add Skill" above to build your profile inventory.
          </div>
        )}
      </div>

      {/* Skill Gap & Dynamic AI Recommendations */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        
        {/* Skill Gap Identification */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Skill Gap Identification</h3>
          {rawGaps.length > 0 ? (
            <div className="space-y-4">
              {rawGaps.map((g, idx) => (
                <GapItem 
                  key={g.id || idx}
                  title={g.skill?.name || 'Skill Gap'} 
                  desc={`Target: ${g.requiredLevel || 4.5} | Current: ${g.currentLevel || 2.0} (${g.severity || 'HIGH'} Priority)`} 
                  action={g.assignedCourse ? "Start Course" : "Browse Courses"} 
                  color={g.severity === 'CRITICAL' ? 'red' : 'yellow'} 
                  onAction={() => handleEnrollGapCourse(g)}
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400 text-sm font-medium">
              🎉 No active skill gaps identified. Excellent job!
            </div>
          )}
        </div>

        {/* Dynamic AI Career Advisor Card */}
        <div className="bg-[#0F172A] p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-purple-500/30">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" /> AI Career Advisor
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
              {aiAdvisorTitle}
            </h2>
            
            <p className="text-slate-300 text-sm mb-8 leading-relaxed font-medium">
              {aiAdvisorText}
            </p>

            <div className="flex gap-10 mb-8 border-t border-white/10 pt-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Role Alignment</p>
                <p className="text-emerald-400 font-bold text-lg">{alignmentPct}% Index</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Career Goal</p>
                <p className="text-purple-300 font-bold text-lg">{user.jobTitle ? `Senior ${user.jobTitle}` : 'Lead Specialist'}</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard/career')}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/30"
            >
              View AI Career Roadmap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">
                {editingSkill ? 'Edit Skill Level' : 'Add New Skill'}
              </h2>
              <button onClick={() => setShowAddSkill(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSkill} className="space-y-5">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Skill Name *</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingSkill)}
                  value={skillForm.name}
                  onChange={e => setSkillForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. TypeScript, Figma, Docker..."
                  className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${editingSkill ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Category</label>
                <select
                  value={skillForm.category}
                  disabled={Boolean(editingSkill)}
                  onChange={e => setSkillForm(p => ({ ...p, category: e.target.value }))}
                  className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${editingSkill ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                >
                  {['Technical', 'Design', 'DevOps', 'Data & AI', 'Leadership', 'Soft Skills'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">
                  Proficiency Level — {skillForm.level >= 4.5 ? 'Expert' : skillForm.level >= 3.5 ? 'Advanced' : skillForm.level >= 2.5 ? 'Intermediate' : 'Beginner'} ({skillForm.level})
                </label>
                <input
                  type="range" min={1} max={5} step={0.5}
                  value={skillForm.level}
                  onChange={e => setSkillForm(p => ({ ...p, level: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>Beginner (1.0)</span><span>Intermediate (3.0)</span><span>Expert (5.0)</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkill(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSkill}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {savingSkill && <Loader2 className="w-4 h-4 animate-spin" />}
                  {savingSkill ? 'Saving...' : (editingSkill ? 'Update Skill' : 'Save Skill')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- AI SKILL EXTRACTOR MODAL --- */}
      {showAiExtractor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => { setShowAiExtractor(false); setAiExtractErrorMsg(''); setAiExtractSuccessMsg(''); }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">AI Resume & Project Skill Extractor</h3>
                <p className="text-xs text-slate-500 font-medium">Powered by Groq LPU / Gemini LLM Talent Engine</p>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Paste your Resume, CV summary, LinkedIn experience, or recent project description below. SkillPulse AI will automatically analyze your text, identify all technical & soft skills, rate proficiency levels, and update your database inventory!
            </p>

            {aiExtractErrorMsg && (
              <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                <X className="w-4 h-4 shrink-0" /> {aiExtractErrorMsg}
              </div>
            )}

            {aiExtractSuccessMsg && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" /> {aiExtractSuccessMsg}
              </div>
            )}

            <form onSubmit={handleAiExtractSkills} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Paste Resume / Project Experience Text</label>
                  <button
                    type="button"
                    onClick={() => setAiInputText("Senior Fullstack Software Engineer with 3+ years experience. Expert in React.js, Node.js REST APIs, PostgreSQL database architecture, Docker containerization, Tailwind CSS UI design, TypeScript, and Agile Team Leadership.")}
                    className="text-[11px] font-bold text-purple-600 hover:underline"
                  >
                    Insert Sample Resume
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  required
                  placeholder="Paste your resume work experience, tech stack, or project description here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiExtractor(false)}
                  className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={extractingAi}
                  className="px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-900/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {extractingAi ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> AI Analyzing Text...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Extract & Add Skills
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Sub Components ---

const ProfileStat = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    orange: 'text-orange-600 bg-orange-50',
    violet: 'text-violet-600 bg-violet-50'
  };
  return (
    <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
      </div>
    </div>
  );
};

const ContributionItem = ({ icon: Icon, title, impact, progress, color }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-400" />
        <span className="font-bold text-slate-700 text-base">{title}</span>
      </div>
      <span className={`text-sm font-black ${color === 'emerald' ? 'text-emerald-500' : 'text-orange-500'}`}>{impact}</span>
    </div>
    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 ${color === 'emerald' ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const GapItem = ({ title, desc, action, color, onAction }) => {
  const styles = {
    red: 'bg-red-50/50 border-red-100 text-red-600',
    yellow: 'bg-amber-50/50 border-amber-100 text-amber-600'
  };
  return (
    <div className={`p-5 rounded-2xl border ${styles[color]} flex justify-between items-center`}>
      <div>
        <h4 className="font-bold text-slate-800 text-base">{title}</h4>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={onAction}
        className={`text-xs font-black uppercase tracking-widest hover:underline ${color === 'red' ? 'text-red-600' : 'text-amber-600'}`}
      >
        {action}
      </button>
    </div>
  );
};

export default MySkillProfile;