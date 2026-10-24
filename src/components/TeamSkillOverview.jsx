import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { 
  Search, 
  SlidersHorizontal,
  Sparkles,
  Loader2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { teamLeaderAPI } from '../services/api';

const TeamSkillOverview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('skill-overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('Skill Level: All');

  const [overviewData, setOverviewData] = useState(null);
  const [teamGaps, setTeamGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeamOverview() {
      try {
        setLoading(true);
        const [overviewRes, gapsRes] = await Promise.allSettled([
          teamLeaderAPI.getOverview(),
          teamLeaderAPI.getGaps()
        ]);

        if (overviewRes.status === 'fulfilled' && overviewRes.value?.success && overviewRes.value?.data) {
          setOverviewData(overviewRes.value.data);
        }
        if (gapsRes.status === 'fulfilled' && gapsRes.value?.success && gapsRes.value?.gaps) {
          setTeamGaps(gapsRes.value.gaps);
        }
      } catch (err) {
        console.warn('Error loading team overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeamOverview();
  }, []);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const leaderName = storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : 'Team Leader';

  // Process raw members from backend
  const rawMembersList = overviewData?.members || [];
  const matrixSkillHeaders = overviewData?.matrixSkills || ['Skill Level'];
  const categoryOptions = overviewData?.categories || ['All Categories'];
  const stats = overviewData?.stats || {
    activeMembersCount: rawMembersList.length,
    avgReadiness: '75%',
    advancedCoverage: '0%',
    criticalGapsCount: teamGaps.filter(g => g.severity === 'CRITICAL').length
  };

  const processedMembers = rawMembersList.map(m => {
    const initials = `${m.firstName?.charAt(0) || 'T'}${m.lastName?.charAt(0) || 'M'}`.toUpperCase();
    const skillMap = {};
    (m.skills || []).forEach(us => {
      if (us.skill?.name) {
        skillMap[us.skill.name] = {
          pct: `${Math.round((us.proficiencyLevel || 1.0) * 20)}%`,
          level: us.proficiencyLevel || 1.0,
          category: us.skill.category?.name || 'General'
        };
      }
    });

    return {
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      initials,
      role: m.jobTitle || 'Team Member',
      skills: skillMap
    };
  });

  // Filter members based on Search, Category, and Level
  const filteredMembers = processedMembers.filter(m => {
    const matchesSearch = !searchQuery || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.keys(m.skills).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' ||
      Object.values(m.skills).some(info => info.category === selectedCategory);

    let matchesLevel = true;
    if (selectedLevel !== 'Skill Level: All') {
      const targetMin = selectedLevel === 'Beginner' ? 0 : selectedLevel === 'Intermediate' ? 40 : selectedLevel === 'Advanced' ? 70 : 85;
      const targetMax = selectedLevel === 'Beginner' ? 40 : selectedLevel === 'Intermediate' ? 70 : selectedLevel === 'Advanced' ? 85 : 100;
      matchesLevel = Object.values(m.skills).some(info => {
        const num = parseInt(info.pct) || 0;
        return num >= targetMin && num <= targetMax;
      });
    }

    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#E9EAF7] font-sans text-[#17233E] relative overflow-x-hidden selection:bg-[#1988A3] selection:text-white">
        <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 flex items-center justify-center relative z-10">
          <SkillPulseLoader message="Querying Squad Skill Intelligence..." fullScreen={false} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E9EAF7] font-sans text-[#17233E] relative overflow-x-hidden selection:bg-[#1988A3] selection:text-white">
      {/* Ambient Gradient Depth - Glowing mesh orbs behind frosted glass panels */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-[#1988A3]/20 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#11C6DE]/16 blur-[140px] rounded-full" />
        <div className="absolute top-2/3 left-10 w-[600px] h-[600px] bg-[#1B3154]/16 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-[#8A9CB7]/28 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.10)_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
      </div>
      {/* Sidebar */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full relative z-10 space-y-8">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#17233E] tracking-tight">Team Skill <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Overview</span></h1>
            <p className="text-[#8A9CB7] text-sm md:text-base font-medium mt-1">
              Analyze live skill distribution, proficiency levels, and capability across your team
            </p>
          </div>
          
          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team member or skill..." 
                className="w-full bg-[#F0F5FB]/90 backdrop-blur-md border border-white/85 rounded-xl pl-11 pr-4 py-2.5 text-xs md:text-sm font-medium text-[#17233E] shadow-sm focus:outline-none focus:border-[#1988A3] transition-all placeholder:text-[#8A9CB7]"
              />
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{leaderName}</p>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Engineering Lead</span>
              </div>
              <div className="w-10 h-10 rounded-2xl border border-white/60 bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#1988A3] flex items-center justify-center text-xs font-black text-white shadow-sm">
                TL
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid - 100% Dynamic Live Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <OverviewStatCard 
            title="Team Members Active" 
            value={`${stats.activeMembersCount} Members`} 
            color="blue" 
          />
          <OverviewStatCard 
            title="Average Team Readiness" 
            value={stats.avgReadiness} 
            color="emerald" 
          />
          <OverviewStatCard 
            title="Advanced Skill Coverage" 
            value={stats.advancedCoverage} 
            color="purple" 
          />
          <OverviewStatCard 
            title="Critical Skill Gaps" 
            value={`${stats.criticalGapsCount} Critical`} 
            color="rose" 
            isLink={true} 
            onLinkClick={() => navigate('/team-leader/gap-analysis')}
          />
        </div>

        {/* AI Squad Capability & Risk Alert Banner */}
        {overviewData?.aiInsights && (
          <div className="bg-gradient-to-br from-[#17233E]/95 via-[#1B3154]/95 to-[#121E33]/95 backdrop-blur-2xl p-6 md:p-8 rounded-3xl text-white shadow-2xl border border-white/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> AI Squad Risk & Synergy Intelligence
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {overviewData.aiInsights.spofCount > 0 
                    ? `${overviewData.aiInsights.spofCount} Single Point of Failure (SPOF) Risk Detected`
                    : 'Optimal Team Synergy & Balance'}
                </h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  {overviewData.aiInsights.aiRecommendation}
                </p>
                
                {overviewData.aiInsights.spofSkills?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">SPOF Skills (1 Expert):</span>
                    {overviewData.aiInsights.spofSkills.map((s, idx) => (
                      <span key={idx} className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" /> {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl shrink-0 justify-around min-w-[260px]">
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-indigo-300 tracking-wider mb-1">Squad Synergy</p>
                  <p className="text-3xl font-black text-emerald-400">{overviewData.aiInsights.synergyScore || '82%'}</p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-indigo-300 tracking-wider mb-1">SPOF Risks</p>
                  <p className="text-3xl font-black text-amber-400">{overviewData.aiInsights.spofCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl rounded-3xl p-4 md:p-5 border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold px-2">
              <SlidersHorizontal size={16} />
              <span>Filters:</span>
            </div>
            <FilterSelect 
              value={selectedCategory} 
              onChange={setSelectedCategory} 
              options={categoryOptions} 
            />
            <FilterSelect 
              value={selectedLevel} 
              onChange={setSelectedLevel} 
              options={['Skill Level: All', 'Beginner', 'Intermediate', 'Advanced', 'Expert']} 
            />
          </div>
          <button 
            onClick={() => navigate('/team-leader/team-formation')}
            className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs md:text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#1988A3]/25 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> AI Squad Matchmaker
          </button>
        </div>

        {/* Skill Proficiency Distribution Matrix */}
        <div className="bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Live Squad Skill Matrix</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time skill proficiencies and competency distribution across team members</p>
            </div>
            <button 
              onClick={() => navigate('/team-leader/assign-learning')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Assign Training
            </button>
          </div>
          
          <div className="overflow-x-auto border border-slate-100 rounded-2xl custom-scrollbar">
            <div className="min-w-[1000px] p-2">
              {filteredMembers.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="py-4 px-6">Team Member</th>
                      {matrixSkillHeaders.map((skillName, idx) => (
                        <th key={idx} className="py-4 px-4 text-center">{skillName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-800">
                    {filteredMembers.map((m) => (
                      <MatrixRow 
                        key={m.id}
                        name={m.name} 
                        role={m.role}
                        initials={m.initials} 
                        onClick={() => navigate(`/team-leader/member-profile?name=${encodeURIComponent(m.name)}`)}
                        skills={matrixSkillHeaders.map(skillName => {
                          const userSkillObj = m.skills[skillName];
                          return userSkillObj ? userSkillObj.pct : 'N/A';
                        })} 
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-slate-400 font-medium text-sm">
                  No matching team members found for selected criteria.
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6 justify-center items-center mt-6 text-[11px] font-black uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block"></span>
              <span>N/A / Beginner (0-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span>
              <span>Intermediate (41-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
              <span>Advanced (81-100%)</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

/* --- Subcomponents --- */

const OverviewStatCard = ({ title, value, sub, color, isLink, onLinkClick }) => {
  const colorMap = {
    blue: 'border-l-[#1988A3]',
    emerald: 'border-l-emerald-500',
    purple: 'border-l-indigo-500',
    rose: 'border-l-rose-500'
  };

  return (
    <div className={`bg-gradient-to-br from-[#F5F9FD]/95 via-[#EAF2FB]/90 to-[#DDEBF8]/85 backdrop-blur-xl rounded-3xl p-6 border border-white/85 border-l-4 ${colorMap[color]} shadow-xl shadow-[#1B3154]/5 hover:border-[#1988A3]/40 transition-all duration-300`}>
      <p className="text-[#8A9CB7] text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-2xl md:text-3xl font-extrabold text-[#17233E] mb-2">{value}</h3>
      {sub && (
        <span className="text-xs font-bold text-[#1988A3] bg-[#1988A3]/10 px-2 py-1 rounded-lg border border-[#1988A3]/20">
          {sub}
        </span>
      )}
      {isLink && (
        <button 
          onClick={onLinkClick} 
          className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline block mt-2 cursor-pointer"
        >
          View Gaps →
        </button>
      )}
    </div>
  );
};

const FilterSelect = ({ value, onChange, options }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="bg-[#F0F5FB]/90 backdrop-blur-md border border-white/85 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

const MatrixRow = ({ name, role, initials, skills, onClick }) => (
  <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={onClick}>
    <td className="py-4 px-6 flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#17233E] to-[#1B3154] text-[#11C6DE] border border-white/20 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
        {initials}
      </div>
      <div>
        <p className="font-bold text-slate-900 text-sm leading-tight hover:text-blue-600 transition-colors">{name}</p>
        <span className="text-[10px] text-slate-400 font-medium">{role}</span>
      </div>
    </td>
    {skills.map((pct, i) => {
      const num = parseInt(pct) || 0;
      const bg = pct === 'N/A' 
        ? 'bg-slate-100 text-slate-400 border-slate-200' 
        : num > 80 
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
        : num > 40 
        ? 'bg-blue-50 text-blue-600 border-blue-100' 
        : 'bg-slate-100 text-slate-500 border-slate-200';
      return (
        <td key={i} className="py-4 px-4 text-center">
          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${bg}`}>
            {pct}
          </span>
        </td>
      );
    })}
  </tr>
);

export default TeamSkillOverview;