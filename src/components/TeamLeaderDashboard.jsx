import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Bell,
  Star,
  BrainCircuit,
  Flag,
  BookOpenCheck,
  GanttChartSquare,
  FileBarChart
} from 'lucide-react';

const TeamLeaderDashboard = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState('Engineering Team A');
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Quarter');

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar - Fixed Positioned */}
      <TeamLeaderSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0b1221] tracking-tight">Team Leader Dashboard</h1>
            <p className="text-slate-500 text-base font-medium mt-1">Monitor team readiness, performance, and skill intelligence</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <select 
                value={selectedTeam} 
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none cursor-pointer"
              >
                <option value="Engineering Team A">Engineering Team A</option>
                <option value="Frontend Squad">Frontend Squad</option>
                <option value="Backend Core">Backend Core</option>
              </select>

              <select 
                value={selectedTimeframe} 
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none cursor-pointer"
              >
                <option value="This Quarter">This Quarter</option>
                <option value="Last Month">Last Month</option>
                <option value="This Year">This Year</option>
              </select>
            </div>

            <button 
              aria-label="View notifications"
              className="relative p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Bell size={22} className="text-slate-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
                TL
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard title="Team Readiness" value="84%" sub="vs last month" icon={<TrendingUp className="text-blue-500" />} color="blue" trend="+5.2%" />
          <StatCard title="Avg. Skill Level" value="7.8/10" sub="vs last month" icon={<Star className="text-purple-500" />} color="purple" trend="+0.4" />
          <StatCard title="Training Completion" value="92%" sub="All assigned completed" icon={<Clock className="text-emerald-500" />} color="emerald" trend="0%" />
          <StatCard title="Skill Gap Risk" value="Medium" sub="Critical Skills" icon={<AlertTriangle className="text-amber-500" />} color="amber" trend="+2 New Gaps" isRisk={true} />
        </div>

        {/* Dashboard Main layout grid */}
        <div className="space-y-8">
          
          {/* Team Skill Strength Overview */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Team Skill Strength Overview</h3>
              <button 
                onClick={() => navigate('/team-leader/skill-overview')} 
                className="text-blue-600 font-bold text-base hover:underline border-0 bg-transparent cursor-pointer"
              >
                View Details
              </button>
            </div>
            
            <div className="flex items-end justify-between h-64 px-4 gap-6">
              <ChartBar label="React" h="75%" shadedH="25%" shadedColor="bg-blue-100/70" mainColor="bg-blue-500" />
              <ChartBar label="Node.js" h="85%" shadedH="20%" shadedColor="bg-cyan-100/70" mainColor="bg-cyan-400" />
              <ChartBar label="Python" h="45%" shadedH="15%" shadedColor="bg-amber-100/70" mainColor="bg-amber-500" />
              <ChartBar label="DevOps" h="95%" shadedH="30%" shadedColor="bg-emerald-100/70" mainColor="bg-emerald-500" />
              <ChartBar label="AWS" h="65%" shadedH="25%" shadedColor="bg-blue-100/70" mainColor="bg-blue-600" />
              <ChartBar label="Design" h="78%" shadedH="20%" shadedColor="bg-sky-100/70" mainColor="bg-sky-400" />
            </div>
          </div>

          {/* Row 2: Members & Progress blocks - 50/50 split layout */}
          <div className="grid grid-cols-2 gap-8">
            {/* Top Performing Members */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Top Performing Members</h3>
                <button 
                  onClick={() => navigate('/team-leader/member-profile')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Manage All
                </button>
              </div>
              <div className="space-y-4">
                <TeamMemberRow initials="ZS" name="Zainab Sheikh" role="Senior Frontend Dev" score="92/100" status="Consistent" />
                <TeamMemberRow initials="AA" name="Arsalan Ahmed" role="Backend Architect" score="74/100" status="Rising" />
                <TeamMemberRow initials="HA" name="Hamza Ali" role="Product Designer" score="45/100" status="Stable" />
              </div>
            </div>

            {/* Team Training Progress */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Team Training Progress</h3>
                <button 
                  onClick={() => navigate('/team-leader/assign-learning')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Assign More
                </button>
              </div>
              <div className="space-y-5">
                <ProgressBar label="Advanced React Patterns" percent="85%" color="bg-blue-600" />
                <ProgressBar label="Cloud Infrastructure Security" percent="42%" color="bg-amber-500" />
                <ProgressBar label="Agile Leadership 101" percent="100%" color="bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Row 3: AI Insights Side-by-Side with Performance Trend */}
          <div className="grid grid-cols-12 gap-8 items-stretch mt-8">
            
            {/* AI Insights Panel */}
            <div className="col-span-7 bg-[#0b0f19] p-7 rounded-[2rem] text-white relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <BrainCircuit className="text-indigo-400" size={20} />
                  </div>
                  <h4 className="text-xl font-bold tracking-tight">AI Team Insights</h4>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-200">Critical Skill Gap Detected</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">High</span>
                    </div>
                    <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                      Python proficiency in the backend team has dropped by 12% due to recent attrition. Recommend targeted training assignment.
                    </p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-200">Upskilling Opportunity</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">Opportunity</span>
                    </div>
                    <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                      3 Frontend developers are showing high aptitude for UX Design. Cross-training could improve design-to-code velocity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Action Grid */}
              <div className="border-t border-white/5 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-1">Quick Team Actions</p>
                <div className="grid grid-cols-4 gap-2">
                  <ActionBtn onClick={() => navigate('/team-leader/skill-overview')} icon={<Flag size={14} />} text="View Skill Overview" />
                  <ActionBtn onClick={() => navigate('/team-leader/assign-learning')} icon={<BookOpenCheck size={14} />} text="Assign Training" />
                  <ActionBtn onClick={() => navigate('/team-leader/gap-analysis')} icon={<GanttChartSquare size={14} />} text="Analyze Gaps" />
                  <ActionBtn onClick={() => navigate('/team-leader/reports')} icon={<FileBarChart size={14} />} text="Generate Report" />
                </div>
              </div>
            </div>

            {/* Performance Trend Chart Line */}
            <div className="col-span-5 bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[380px]">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Performance Trend</h3>
                <p className="text-sm text-slate-400 font-medium mb-6">Visual timeline representation of current sprint dynamics</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-end pb-2 relative">
                <div className="h-44 relative w-full px-2">
                  <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path d="M5,42 Q25,45 50,30 T95,10" stroke="#0ea5e9" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="5" cy="42" r="3" fill="#0ea5e9" />
                    <circle cx="50" cy="30" r="3" fill="#0ea5e9" />
                    <circle cx="95" cy="10" r="3" fill="#0ea5e9" />
                  </svg>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-6 px-2 border-t border-slate-100 pt-3">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

/* --- Sub-components --- */

const StatCard = ({ title, value, sub, icon, color, trend, isRisk=false }) => {
  const bgMap = {
    blue: 'bg-blue-50/60',
    purple: 'bg-purple-50/60',
    emerald: 'bg-emerald-50/60',
    amber: 'bg-amber-50/60',
  };
  
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-xs font-bold mb-1">{title}</p>
          <h4 className={`text-4xl font-black tracking-tight ${isRisk ? 'text-amber-500' : 'text-slate-900'}`}>{value}</h4>
        </div>
        <div className={`w-10 h-10 rounded-xl ${bgMap[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${trend.includes('+') || trend.includes('5.2') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
          {trend}
        </span>
        <span className="text-xs font-medium text-slate-400">{sub}</span>
      </div>
      {title === "Team Readiness" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400"></div>}
    </div>
  );
};

const ChartBar = ({ label, h, shadedH, shadedColor, mainColor }) => (
  <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
    <div className="w-full rounded-xl overflow-hidden relative group cursor-pointer transition-all flex flex-col justify-end" style={{ height: h }}>
      <div className={`w-full rounded-t-xl ${shadedColor}`} style={{ height: shadedH }}></div>
      <div className={`w-full flex-1 ${mainColor}`}></div>
    </div>
    <span className="text-xs font-bold text-slate-400 tracking-tight mt-1">{label}</span>
  </div>
);

const TeamMemberRow = ({ initials, name, role, score, status }) => (
  <div className="flex justify-between items-center p-3.5 bg-slate-50/60 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center tracking-tight group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        {initials}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 leading-tight">{name}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{role}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-slate-800 leading-none">{score}</p>
      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{status}</p>
    </div>
  </div>
);

const ProgressBar = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="text-slate-700">{label}</span>
      <span className="text-slate-900">{percent}</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: percent }}></div>
    </div>
  </div>
);

const ActionBtn = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] text-white font-semibold text-[10px] py-2 px-2.5 rounded-lg transition-all flex-1 whitespace-nowrap cursor-pointer"
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default TeamLeaderDashboard;