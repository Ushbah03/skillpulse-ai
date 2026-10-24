import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar 
} from 'recharts';
import { 
  Search, Plus, CheckCircle, Clock, Target, Layout, Code, Filter, Download, MoreHorizontal, Sparkles, ArrowRight, X, Loader2, Trash2, Edit3, UploadCloud, RefreshCw
} from 'lucide-react';
import { employeeAPI } from '../services/api';
import SkillPulseLoader from './SkillPulseLoader';

const MySkillProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Live AI Career Advice State
  const [liveAiAdvice, setLiveAiAdvice] = useState(null);
  const [fetchingAdvice, setFetchingAdvice] = useState(false);
  
  // Add/Edit Skill Modal State
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [savingSkill, setSavingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({ id: '', name: '', category: 'Technical', level: 3 });

  // AI Skill Extractor Modal State
  const [showAiExtractor, setShowAiExtractor] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [extractingAi, setExtractingAi] = useState(false);
  const [aiExtractSuccessMsg, setAiExtractSuccessMsg] = useState('');
  const [aiExtractErrorMsg, setAiExtractErrorMsg] = useState('');

  // Action dropdown state
  const [activeMenuId, setActiveMenuId] = useState(null);

  const fetchLiveAiAdvice = async () => {
    setFetchingAdvice(true);
    try {
      const res = await employeeAPI.getAiCareerAdvice();
      if (res?.success && res?.data) {
        setLiveAiAdvice(res.data);
      }
    } catch (err) {
      console.warn('Live AI Advice fetch error:', err);
    } finally {
      setFetchingAdvice(false);
    }
  };

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
      fetchLiveAiAdvice();
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
        await loadData();
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

  // --- CV File Upload Handler ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      if (typeof content === 'string') {
        const cleanText = content.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        setAiInputText(cleanText || `Extracted resume text from ${file.name}`);
      } else if (content instanceof ArrayBuffer) {
        const bytes = new Uint8Array(content);
        let extractedStr = '';
        for (let i = 0; i < bytes.length; i++) {
          const charCode = bytes[i];
          if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
            extractedStr += String.fromCharCode(charCode);
          } else {
            extractedStr += ' ';
          }
        }
        const cleanText = extractedStr.replace(/\s+/g, ' ').trim();
        setAiInputText(cleanText.substring(0, 4000) || `Extracted resume content from ${file.name}`);
      }
    };

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
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

  if (loading) {
    return <SkillPulseLoader message="Calibrating Neural Skill Profile..." />;
  }

  return (
    <div className="bg-transparent min-h-screen p-6 md:p-10 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#1988A3]/10 text-[#1988A3] px-2.5 py-1 rounded-lg border border-[#1988A3]/25">
              {user.tenant?.name || 'Enterprise Corp Workspace'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#17233E] tracking-tight">
            {user.firstName ? `${user.firstName} ${user.lastName}'s Profile` : 'My Skill Profile'}
          </h1>
          <p className="text-[#5A6D89] text-sm md:text-base mt-1 font-medium">
            {user.jobTitle ? `${user.jobTitle} • ` : ''}View and manage your professional skill telemetry and readiness
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-[#8A9CB7] w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..." 
              className="pl-11 pr-4 py-2.5 bg-[#F0F5FB]/85 backdrop-blur-md border border-[#8A9CB7]/30 rounded-2xl w-60 md:w-72 text-sm text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:border-[#1988A3] shadow-sm transition-all" 
            />
          </div>
          <button 
            onClick={() => {
              setEditingSkill(null);
              setSkillForm({ id: '', name: '', category: 'Technical', level: 3 });
              setShowAddSkill(true);
            }}
            className="flex items-center gap-2 bg-[#17233E] text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#1988A3] transition-all shadow-lg shadow-[#17233E]/20"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
          <button 
            onClick={() => setShowAiExtractor(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-[#1988A3]/25"
          >
            <Sparkles className="w-4 h-4 text-[#11C6DE] animate-pulse" /> AI Skill Extractor
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <ProfileStat icon={Layout} label="Total Skills" value={totalSkills} color="cyan" />
        <ProfileStat icon={CheckCircle} label="Validated Skills" value={validatedSkills} color="emerald" />
        <ProfileStat icon={Clock} label="Active Gaps" value={rawGaps.length} color="amber" />
        <ProfileStat icon={Target} label="Role Alignment" value={`${alignmentPct}%`} color="navy" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Dynamic Category Radar Chart */}
        <div className="col-span-1 glass-panel p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-[#17233E]">Proficiency by Category</h3>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20">
              Live Vectors
            </span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#8A9CB7" strokeOpacity={0.25} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#5A6D89', fontSize: 11, fontWeight: 700 }} />
                <Radar dataKey="A" stroke="#1988A3" strokeWidth={2.5} fill="#11C6DE" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Readiness Contribution */}
        <div className="col-span-1 lg:col-span-2 glass-panel p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-[#17233E]">Readiness Contribution Breakdown</h3>
            <span className="text-xs font-bold text-[#5A6D89]">Top 3 Core Competencies</span>
          </div>
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
                    isHigh={isHigh}
                  />
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-[#5A6D89] font-medium text-sm">
              No skill data available yet. Click "Add Skill" to build your readiness profile.
            </div>
          )}
        </div>
      </div>

      {/* Skills Inventory Table */}
      <div className="glass-panel rounded-[2.5rem] overflow-hidden mb-10">
        <div className="p-6 md:p-8 border-b border-[#8A9CB7]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-black text-[#17233E]">My Skills Inventory</h3>
            <p className="text-xs text-[#5A6D89] font-medium mt-0.5">Verified competency telemetry in enterprise catalog</p>
          </div>
          <div className="flex gap-3 relative">
            <button 
              onClick={() => setShowFilterPanel(p => !p)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F0F5FB]/85 border border-[#8A9CB7]/30 rounded-xl text-xs font-bold text-[#17233E] hover:bg-[#1988A3]/10 transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-[#1988A3]" /> Filter
              {filterCategory !== 'All' && <span className="bg-[#1988A3] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">{filterCategory}</span>}
            </button>
            {showFilterPanel && (
              <div className="absolute top-12 left-0 z-30 bg-[#F5F9FD]/95 backdrop-blur-xl border border-[#8A9CB7]/30 rounded-2xl shadow-xl p-4 min-w-[180px]">
                <p className="text-[10px] font-black text-[#5A6D89] uppercase tracking-widest mb-3">Filter by Category</p>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFilterCategory(cat); setShowFilterPanel(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      filterCategory === cat ? 'bg-[#1988A3]/15 text-[#1988A3]' : 'text-[#5A6D89] hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#F0F5FB]/85 border border-[#8A9CB7]/30 rounded-xl text-xs font-bold text-[#17233E] hover:bg-[#1988A3]/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#1988A3]" /> Export CSV
            </button>
          </div>
        </div>

        {filteredSkills.length > 0 ? (
          <div className="max-h-[440px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-[#8A9CB7]/30 scrollbar-track-transparent">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#17233E]/5 border-b border-[#8A9CB7]/20 text-[#5A6D89] text-[10px] font-black uppercase tracking-widest sticky top-0 z-20 backdrop-blur-md">
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
              <tbody className="divide-y divide-[#8A9CB7]/15">
                {filteredSkills.map((us, idx) => {
                  const skillName = us.skill?.name || 'Unnamed Skill';
                  const catName = us.skill?.category?.name || 'Technical';
                  const prof = us.proficiencyLevel || 3.0;
                  const levelLabel = prof >= 4.5 ? 'Expert' : prof >= 3.5 ? 'Advanced' : prof >= 2.5 ? 'Intermediate' : 'Beginner';
                  const statusLabel = us.verified ? 'Validated' : 'Pending';

                  return (
                    <tr key={us.id || idx} className="hover:bg-[#E4EEF8]/60 transition-colors text-sm relative">
                      <td className="px-8 py-5 flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${prof >= 4.0 ? 'bg-[#1988A3]' : prof >= 2.5 ? 'bg-[#11C6DE]' : 'bg-amber-400'}`}></div>
                        <span className="font-bold text-[#17233E]">{skillName}</span>
                      </td>
                      <td className="px-8 py-5 text-[#5A6D89] font-medium text-xs">{catName}</td>
                      <td className="px-8 py-5">
                        <span className="bg-[#17233E]/5 text-[#17233E] px-3 py-1 rounded-lg font-bold text-[11px]">{levelLabel} ({prof})</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${
                          statusLabel === 'Validated' ? 'bg-[#1988A3]/15 text-[#1988A3] border border-[#1988A3]/30' : 'bg-[#8A9CB7]/15 text-[#5A6D89]'
                        }`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-black text-[#17233E]">{Math.round(prof * 20)}%</td>
                      <td className="px-8 py-5 text-[#8A9CB7] font-medium text-xs">{us.lastAssessedAt ? new Date(us.lastAssessedAt).toLocaleDateString() : 'Active'}</td>
                      <td className="px-8 py-5 text-right relative">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === us.id ? null : us.id)}
                            className="p-2 hover:bg-[#1988A3]/10 rounded-lg text-[#8A9CB7] hover:text-[#17233E] transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {/* Action Menu Dropdown */}
                          {activeMenuId === us.id && (
                            <div className="absolute right-0 top-10 z-40 bg-[#F5F9FD]/95 backdrop-blur-xl border border-[#8A9CB7]/30 rounded-xl shadow-xl p-2 w-36 text-left">
                              <button
                                onClick={() => handleOpenEdit(us)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#17233E] hover:bg-[#1988A3]/10 rounded-lg"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#1988A3]" /> Edit Level
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
          </div>
        ) : (
          <div className="py-16 text-center text-[#5A6D89] font-medium">
            No skills found. Click "Add Skill" above to build your profile inventory.
          </div>
        )}
      </div>

      {/* Skill Gap & Dynamic AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Skill Gap Identification */}
        <div className="glass-panel p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-[#17233E]">Skill Gap Identification</h3>
            <span className="text-xs font-bold text-[#5A6D89]">{rawGaps.length} Gaps Detected</span>
          </div>
          {rawGaps.length > 0 ? (
            <div className="space-y-4">
              {rawGaps.map((g, idx) => (
                <GapItem 
                  key={g.id || idx}
                  title={g.skill?.name || 'Skill Gap'} 
                  desc={`Target: ${g.requiredLevel || 4.5} | Current: ${g.currentLevel || 2.0} (${g.severity || 'HIGH'} Priority)`} 
                  action={g.assignedCourse ? "Start Course" : "Browse Courses"} 
                  isCritical={g.severity === 'CRITICAL'} 
                  onAction={() => handleEnrollGapCourse(g)}
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-[#5A6D89] text-sm font-medium">
              🎉 No active skill gaps identified. Excellent alignment!
            </div>
          )}
        </div>

        {/* Dynamic AI Career Advisor Card */}
        <div className="bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#121E33] p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1988A3]/15 blur-[90px] rounded-full -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 bg-[#1988A3]/20 text-[#11C6DE] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#1988A3]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#11C6DE] animate-pulse" /> AI Career Advisor
              </div>
              <button
                onClick={fetchLiveAiAdvice}
                disabled={fetchingAdvice}
                className="text-xs font-bold text-[#8A9CB7] hover:text-white flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all border border-white/10"
                title="Re-run live Groq / Gemini AI inference"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${fetchingAdvice ? 'animate-spin' : ''}`} />
                {fetchingAdvice ? 'Analyzing...' : 'Refresh Guidance'}
              </button>
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-white mb-3 leading-tight">
              {liveAiAdvice?.title || aiAdvisorTitle}
            </h2>
            
            <p className="text-[#8A9CB7] text-sm mb-8 leading-relaxed font-medium">
              {liveAiAdvice?.text || aiAdvisorText}
            </p>

            <div className="flex gap-8 mb-8 border-t border-white/10 pt-6">
              <div>
                <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest mb-1">Role Alignment</p>
                <p className="text-[#11C6DE] font-black text-lg">{liveAiAdvice?.roleAlignmentIndex || alignmentPct}% Index</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest mb-1">Target Trajectory</p>
                <p className="text-white font-black text-lg">{liveAiAdvice?.careerGoal || (user.jobTitle ? `Senior ${user.jobTitle}` : 'Lead Specialist')}</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard/career')}
              className="w-full bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#1988A3]/25"
            >
              View AI Career Roadmap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17233E]/50 backdrop-blur-md p-4">
          <div className="bg-[#F5F9FD]/95 backdrop-blur-2xl border border-white/80 rounded-[2rem] shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-[#17233E]">
                {editingSkill ? 'Edit Skill Level' : 'Add New Skill'}
              </h2>
              <button onClick={() => setShowAddSkill(false)} className="text-[#8A9CB7] hover:text-[#17233E] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSkill} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-[#5A6D89] uppercase tracking-widest block mb-2">Skill Name *</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingSkill)}
                  value={skillForm.name}
                  onChange={e => setSkillForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. TypeScript, Figma, Docker..."
                  className={`w-full bg-white border border-[#8A9CB7]/30 rounded-xl px-4 py-3 text-sm text-[#17233E] focus:outline-none focus:border-[#1988A3] ${editingSkill ? 'bg-slate-100 text-[#5A6D89] cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-[#5A6D89] uppercase tracking-widest block mb-2">Category</label>
                <select
                  value={skillForm.category}
                  disabled={Boolean(editingSkill)}
                  onChange={e => setSkillForm(p => ({ ...p, category: e.target.value }))}
                  className={`w-full bg-white border border-[#8A9CB7]/30 rounded-xl px-4 py-3 text-sm text-[#17233E] focus:outline-none focus:border-[#1988A3] ${editingSkill ? 'bg-slate-100 text-[#5A6D89] cursor-not-allowed' : ''}`}
                >
                  {['Technical', 'Design', 'DevOps', 'Data & AI', 'Leadership', 'Soft Skills'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-[#5A6D89] uppercase tracking-widest block mb-2">
                  Proficiency Level — {skillForm.level >= 4.5 ? 'Expert' : skillForm.level >= 3.5 ? 'Advanced' : skillForm.level >= 2.5 ? 'Intermediate' : 'Beginner'} ({skillForm.level})
                </label>
                <input
                  type="range" min={1} max={5} step={0.5}
                  value={skillForm.level}
                  onChange={e => setSkillForm(p => ({ ...p, level: parseFloat(e.target.value) }))}
                  className="w-full accent-[#1988A3]"
                />
                <div className="flex justify-between text-[10px] text-[#8A9CB7] font-bold mt-1">
                  <span>Beginner (1.0)</span><span>Intermediate (3.0)</span><span>Expert (5.0)</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkill(false)}
                  className="flex-1 border border-[#8A9CB7]/30 text-[#5A6D89] py-3 rounded-xl font-bold text-xs hover:bg-[#1988A3]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSkill}
                  className="flex-1 bg-[#17233E] hover:bg-[#1988A3] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {savingSkill && <Loader2 className="w-4 h-4 animate-spin" />}
                  {savingSkill ? 'Saving...' : (editingSkill ? 'Update Skill' : 'Save Skill')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI SKILL EXTRACTOR MODAL */}
      {showAiExtractor && (
        <div className="fixed inset-0 z-50 bg-[#17233E]/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#F5F9FD]/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-white/80 relative">
            <button
              onClick={() => { setShowAiExtractor(false); setAiExtractErrorMsg(''); setAiExtractSuccessMsg(''); }}
              className="absolute top-6 right-6 text-[#8A9CB7] hover:text-[#17233E] p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#1988A3]/15 border border-[#1988A3]/25 flex items-center justify-center text-[#1988A3]">
                <Sparkles className="w-5 h-5 text-[#1988A3]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#17233E]">AI Resume & Project Skill Extractor</h3>
                <p className="text-xs text-[#5A6D89] font-medium">Powered by Groq LPU / Gemini LLM Talent Engine</p>
              </div>
            </div>

            <p className="text-[#5A6D89] text-xs md:text-sm mb-6 leading-relaxed">
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

            <form onSubmit={handleAiExtractSkills} className="space-y-5">
              {/* CV / Resume File Upload Box */}
              <div className="p-4 border-2 border-dashed border-[#1988A3]/30 hover:border-[#1988A3] bg-[#1988A3]/5 rounded-2xl text-center transition-colors">
                <input
                  type="file"
                  id="cv-file-upload-input"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="cv-file-upload-input" className="cursor-pointer flex flex-col items-center gap-2 py-1">
                  <div className="w-10 h-10 rounded-2xl bg-[#17233E] text-white flex items-center justify-center shadow-md shadow-[#17233E]/20">
                    <UploadCloud className="w-5 h-5 text-[#11C6DE]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#17233E]">
                      {selectedFileName ? `📄 Loaded: ${selectedFileName}` : 'Click here to Upload CV / Resume File (.pdf, .docx, .txt)'}
                    </p>
                    <p className="text-xs text-[#5A6D89] mt-0.5 font-medium">
                      {selectedFileName ? 'Text automatically extracted below! Click Extract & Add Skills.' : 'Upload your CV file to auto-fill text below or paste manually.'}
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black uppercase text-[#5A6D89] tracking-wider">Or Paste Resume / Experience Text</label>
                  <button
                    type="button"
                    onClick={() => setAiInputText("Senior Fullstack Software Engineer with 3+ years experience. Expert in React.js, Node.js REST APIs, PostgreSQL database architecture, Docker containerization, Tailwind CSS UI design, TypeScript, and Agile Team Leadership.")}
                    className="text-[11px] font-bold text-[#1988A3] hover:underline"
                  >
                    Insert Sample Resume
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  required
                  placeholder="Paste your resume work experience, tech stack, or project description here..."
                  className="w-full bg-white border border-[#8A9CB7]/30 rounded-2xl p-4 text-sm font-medium text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:border-[#1988A3]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiExtractor(false)}
                  className="px-6 py-2.5 rounded-2xl text-xs font-bold text-[#5A6D89] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={extractingAi}
                  className="px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] text-white hover:brightness-110 shadow-lg shadow-[#1988A3]/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {extractingAi ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> AI Analyzing Text...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#11C6DE]" /> Extract & Add Skills
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
    cyan: 'text-[#1988A3] bg-[#1988A3]/10 border border-[#1988A3]/20',
    emerald: 'text-emerald-600 bg-emerald-500/10 border border-emerald-500/20',
    amber: 'text-amber-600 bg-amber-500/10 border border-amber-500/20',
    navy: 'text-[#17233E] bg-[#17233E]/10 border border-[#17233E]/20'
  };
  return (
    <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[#5A6D89] text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl md:text-3xl font-black text-[#17233E]">{value}</h3>
      </div>
    </div>
  );
};

const ContributionItem = ({ icon: Icon, title, impact, progress, isHigh }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-[#8A9CB7]" />
        <span className="font-bold text-[#17233E] text-sm md:text-base">{title}</span>
      </div>
      <span className={`text-xs md:text-sm font-black ${isHigh ? 'text-[#1988A3]' : 'text-amber-500'}`}>{impact}</span>
    </div>
    <div className="h-2 w-full bg-[#17233E]/10 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ${isHigh ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE]' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`} 
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const GapItem = ({ title, desc, action, isCritical, onAction }) => {
  return (
    <div className={`p-4 md:p-5 rounded-2xl border flex justify-between items-center ${
      isCritical 
        ? 'bg-rose-50/50 border-rose-200/60 text-rose-600' 
        : 'bg-amber-50/50 border-amber-200/60 text-amber-700'
    }`}>
      <div>
        <h4 className="font-bold text-[#17233E] text-sm md:text-base">{title}</h4>
        <p className="text-xs font-medium text-[#5A6D89] mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={onAction}
        className={`text-xs font-black uppercase tracking-widest hover:underline ${
          isCritical ? 'text-rose-600' : 'text-[#1988A3]'
        }`}
      >
        {action}
      </button>
    </div>
  );
};

export default MySkillProfile;
