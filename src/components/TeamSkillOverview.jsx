import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import { 
  Search, 
  SlidersHorizontal,
  Sparkles,
  Loader2
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
      <div className="flex min-h-screen bg-[#F8F9FE]">
        <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-72 p-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-blue-600">
            <Loader2 className="w-10 h-10 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Querying Neon Cloud Database...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 w-full space-y-8">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#0b1221] tracking-tight">Team Skill Overview</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
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
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{leaderName}</p>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Engineering Lead</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-slate-200 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
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

        {/* Filters Panel */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
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
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> AI Squad Matchmaker
          </button>
        </div>

        {/* Skill Proficiency Distribution Matrix */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Live Squad Skill Matrix</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time skill proficiencies queried directly from Neon Cloud Database</p>
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
    blue: 'border-l-blue-600',
    emerald: 'border-l-emerald-500',
    purple: 'border-l-purple-500',
    rose: 'border-l-rose-500'
  };

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-100 border-l-4 ${colorMap[color]} shadow-sm`}>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 mb-2">{value}</h3>
      {sub && (
        <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
          {sub}
        </span>
      )}
      {isLink && (
        <button 
          onClick={onLinkClick} 
          className="text-xs font-bold text-rose-600 hover:underline block mt-2"
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
    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

const MatrixRow = ({ name, role, initials, skills, onClick }) => (
  <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={onClick}>
    <td className="py-4 px-6 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
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