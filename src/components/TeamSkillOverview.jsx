import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import { 
  Search, 
  Bell, 
  SlidersHorizontal,
  ArrowRight,
  Layers
} from 'lucide-react';

const TeamSkillOverview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('skill-overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('Skill Level: All');
  const [selectedDept, setSelectedDept] = useState('Dept: Engineering');

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar - Fixed Positioned */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto space-y-8">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#0b1221] tracking-tight">Team Skill Overview</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Analyze skill distribution, proficiency levels, and capability across your entire team
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
            
            <button 
              aria-label="View notifications"
              className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 transition-all text-slate-600 cursor-pointer"
            >
              <Bell size={20} />
            </button>

            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
                TL
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          <OverviewStatCard 
            title="Total Skills Tracked" 
            value="42 Skills" 
            sub="Across 6 Categories" 
            color="blue" 
            isBadge={true} 
          />
          <OverviewStatCard 
            title="Average Team Skill Score" 
            value="84%" 
            sub="+2.4% Trend" 
            color="emerald" 
            isTrend={true} 
          />
          <OverviewStatCard 
            title="Advanced Skill Coverage" 
            value="68%" 
            sub="" 
            color="purple" 
            isProgress={true} 
          />
          <OverviewStatCard 
            title="Critical Skill Gap Count" 
            value="5 Skills" 
            sub="View Gaps" 
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
              options={['All Categories', 'Frontend', 'Backend', 'Cloud', 'Database']} 
            />
            <FilterSelect 
              value={selectedLevel} 
              onChange={setSelectedLevel} 
              options={['Skill Level: All', 'Beginner', 'Intermediate', 'Advanced']} 
            />
            <FilterSelect 
              value={selectedDept} 
              onChange={setSelectedDept} 
              options={['Dept: Engineering', 'Dept: Design', 'Dept: DevOps']} 
            />
          </div>
          <button className="bg-[#0b1221] hover:bg-[#151f33] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
            Apply Filters
          </button>
        </div>

        {/* Skill Proficiency Distribution Matrix */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Skill Proficiency Distribution Matrix</h3>
          
          <div className="overflow-x-auto border border-slate-100 rounded-2xl custom-scrollbar">
            <div className="min-w-[1000px] p-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                    <th className="py-4 px-6">Team Member</th>
                    <th className="py-4 px-4 text-center">React</th>
                    <th className="py-4 px-4 text-center">Node.js</th>
                    <th className="py-4 px-4 text-center">AWS Cloud</th>
                    <th className="py-4 px-4 text-center">Python</th>
                    <th className="py-4 px-4 text-center">TypeScript</th>
                    <th className="py-4 px-4 text-center">Docker</th>
                    <th className="py-4 px-4 text-center">SQL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-800">
                  <MatrixRow name="Ali Khan" initials="AK" skills={["92%", "78%", "35%", "65%", "88%", "20%", "72%"]} />
                  <MatrixRow name="Jessica Doe" initials="JD" skills={["75%", "90%", "82%", "60%", "40%", "30%", "85%"]} />
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-6 justify-center items-center mt-6 text-[11px] font-black uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block"></span>
              <span>Beginner (0-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span>
              <span>Intermediate (41-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#a855f7] inline-block"></span>
              <span>Advanced (81-100%)</span>
            </div>
          </div>
        </div>

        {/* Category Strength & Team Skill Coverage */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Skill Category Strength</h3>
            <div className="space-y-5">
              <CategoryProgress label="Frontend Development" percent="88%" color="bg-blue-500" />
              <CategoryProgress label="Backend Systems" percent="72%" color="bg-blue-500" />
              <CategoryProgress label="Cloud & Infrastructure" percent="45%" color="bg-amber-500" />
              <CategoryProgress label="Database Management" percent="82%" color="bg-blue-500" />
            </div>
          </div>

          <div className="col-span-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-between">
            <div className="w-full">
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Team Skill Coverage</h3>
            </div>
            
            <div className="relative w-48 h-48 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="#a855f7" strokeWidth="12" fill="transparent" strokeDasharray="251.2" strokeDashoffset="80" strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="251.2" strokeDashoffset="170" strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <p className="text-4xl font-black text-slate-900 leading-none">42</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">Total Skills</p>
              </div>
            </div>

            <div className="flex gap-6 text-[11px] font-bold text-slate-500 w-full justify-center border-t border-slate-50 pt-4">
              <div className="text-center"><p className="text-slate-900 font-black text-sm">68%</p><span className="text-xs font-medium text-slate-400">Advanced</span></div>
              <div className="text-center"><p className="text-slate-900 font-black text-sm">20%</p><span className="text-xs font-medium text-slate-400">Inter.</span></div>
              <div className="text-center"><p className="text-slate-900 font-black text-sm">12%</p><span className="text-xs font-medium text-slate-400">Beginner</span></div>
            </div>
          </div>
        </div>

        {/* Team Skill Ranking */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Team Skill Ranking</h3>
          <div className="max-h-[240px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
            <RankingRow rank={1} name="Ali Khan" imgInitials="AK" skill="React.js" score="92%" level="Advanced" />
            <RankingRow rank={2} name="Sarah Miller" imgInitials="SM" skill="Node.js" score="88%" level="Advanced" />
            <RankingRow rank={3} name="Jessica Doe" imgInitials="JD" skill="SQL" score="85%" level="Advanced" />
            <RankingRow rank={4} name="John Smith" imgInitials="JS" skill="Python" score="65%" level="Intermediate" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-8 items-stretch">
          {/* Team Skill Gap Preview */}
          <div className="col-span-5 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between h-[320px]">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Team Skill Gap Preview</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">5 critical skill gaps detected across backend and cloud technologies.</p>
              
              <div className="space-y-4">
                <GapItem label="Cloud Infrastructure (AWS/Azure)" severity="High" color="text-rose-500" barColor="bg-rose-500" width="85%" />
                <GapItem label="Container Security (Docker/K8s)" severity="Medium" color="text-amber-500" barColor="bg-amber-500" width="55%" />
              </div>
            </div>

            <button 
              onClick={() => navigate('/team-leader/gap-analysis')}
              className="w-full text-center py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-all shadow-sm cursor-pointer"
            >
              View Full Skill Gap Analysis
            </button>
          </div>

          {/* AI Skill Intelligence */}
          <div className="col-span-7 bg-[#0b0f19] p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between h-[320px]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Layers className="text-blue-400" size={22} />
                </div>
                <h4 className="text-xl font-bold tracking-tight">AI Skill Intelligence</h4>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-medium max-w-xl">
                Your team is strongest in <span className="text-blue-400 font-bold">frontend and UI technologies</span> but shows lower proficiency in <span className="text-amber-400 font-bold">backend and cloud infrastructure</span> skills. Training recommendations have been generated.
              </p>
            </div>

            <button 
              onClick={() => navigate('/team-leader/assign-learning')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/10 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Improve Skill Coverage</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

/* --- Helper Sub-components --- */

const OverviewStatCard = ({ title, value, sub, color, isBadge, isTrend, isProgress, isLink, onLinkClick }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
      <div>
        <p className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">{title}</p>
        <h4 className={`text-3xl font-black tracking-tight ${color === 'rose' ? 'text-rose-500' : 'text-slate-900'}`}>{value}</h4>
      </div>
      <div className="mt-4 flex items-center justify-between">
        {isBadge && <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">{sub}</span>}
        {isTrend && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">{sub}</span>}
        {isProgress && (
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '68%' }}></div>
          </div>
        )}
        {isLink && (
          <button 
            onClick={onLinkClick} 
            className="text-xs font-bold text-rose-500 flex items-center gap-1 hover:underline border-0 bg-transparent cursor-pointer p-0"
          >
            <span>{sub}</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const FilterSelect = ({ value, onChange, options }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="bg-slate-50 border border-slate-100 hover:bg-slate-100 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 focus:outline-none cursor-pointer transition-colors"
  >
    {options.map((option, idx) => (
      <option key={idx} value={option}>{option}</option>
    ))}
  </select>
);

const MatrixRow = ({ name, initials, skills }) => {
  const getCellBg = (val) => {
    const num = parseInt(val, 10);
    if (num <= 40) return 'bg-slate-100 text-slate-500';
    if (num <= 80) return 'bg-blue-500 text-white';
    return 'bg-[#a855f7] text-white';
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="py-4 px-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">
          {initials}
        </div>
        <span className="font-bold text-slate-900">{name}</span>
      </td>
      {skills.map((score, i) => (
        <td key={i} className="py-4 px-4 text-center">
          <span className={`inline-block text-[11px] font-black px-3 py-1 rounded-lg ${getCellBg(score)}`}>
            {score}
          </span>
        </td>
      ))}
    </tr>
  );
};

const CategoryProgress = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-900">{percent}</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: percent }}></div>
    </div>
  </div>
);

const RankingRow = ({ rank, name, imgInitials, skill, score, level }) => (
  <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all">
    <div className="flex items-center gap-4">
      <div className="w-6 text-center text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
        {rank}
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">
        {imgInitials}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 leading-tight">{name}</p>
      </div>
    </div>
    <div className="flex items-center gap-16 text-right">
      <div>
        <p className="text-xs text-slate-400 font-bold mb-0.5">Primary Skill</p>
        <p className="text-sm font-bold text-slate-700">{skill}</p>
      </div>
      <div>
        <p className="text-sm font-black text-blue-600">{score}</p>
      </div>
      <div className="w-24 text-center">
        <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
          {level}
        </span>
      </div>
    </div>
  </div>
);

const GapItem = ({ label, severity, color, barColor, width }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="text-slate-700">{label}</span>
      <span className={`text-[11px] font-black ${color}`}>{severity}</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${barColor} rounded-full`} style={{ width: width }}></div>
    </div>
  </div>
);

export default TeamSkillOverview;