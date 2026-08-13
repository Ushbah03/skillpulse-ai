import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { 
  Search, Bell, PlayCircle, TrendingUp, Layers, Zap, Star, Target, Sparkles, ChevronRight 
} from 'lucide-react';

const radarData = [
  { subject: 'Technical', A: 80 },
  { subject: 'Leadership', A: 60 },
  { subject: 'Communication', A: 90 },
  { subject: 'Analytics', A: 70 },
];

const EmployeeDashboard = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen p-10 font-sans">
      
      {/* 1. Header Section - Multi-Tenant Scoped */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
              Acme Corp Workspace
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Employee Dashboard</h1>
          <p className="text-slate-500 text-base mt-1 font-medium">Monitor your skills and learning progress</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search skills, courses..." 
              className="pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl w-72 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all" 
            />
          </div>
          
          <div className="p-3 bg-white border border-slate-200 rounded-full relative shadow-sm cursor-pointer hover:bg-slate-50">
            <Bell className="w-6 h-6 text-slate-600" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          
          <div className="flex items-center gap-4 ml-2 border-l-2 pl-6 border-slate-200">
            <div className="text-right leading-tight">
              <p className="text-base font-bold text-slate-900">Alex Morgan</p>
              <span className="text-xs text-blue-600 font-black uppercase tracking-[0.1em] mt-1 inline-block">Senior Designer</span>
            </div>
            <img src="https://i.pravatar.cc/150?u=alex" alt="profile" className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
          </div>
        </div>
      </div>

      {/* 2. Top Stats Row - Refactored Metrics */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        <StatCard title="Skill Readiness" value="78%" trend="+12% month" icon={TrendingUp} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Total Skills" value="24" sub="18 Validated" icon={Layers} iconColor="text-slate-600" iconBg="bg-slate-100" />
        <StatCard title="Active Programs" value="3" sub="1 Due week" highlight="orange" icon={Zap} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Competency Index" value="4.2/5" sub="Top 15% in Role" highlight="emerald" icon={Star} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
      </div>

      {/* 3. Matrix and Gap Summary Row */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-7 bg-blue-600 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-lg">Skill Proficiency Matrix</h3>
            </div>
            <button className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest hover:bg-slate-100">All Stats</button>
          </div>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 14, fontWeight: 700 }} />
                <Radar dataKey="A" stroke="#2563EB" strokeWidth={3} fill="#3B82F6" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-10 flex items-center gap-3">
            <Target className="w-5 h-5 text-slate-400" /> Skill Gap Summary
          </h3>
          <div className="space-y-10 flex-1">
            <GapItem title="Data Visualization" status="Critical" color="orange" progress={40} target="Advanced" current="Beginner" />
            <GapItem title="Strategic Planning" status="Moderate" color="blue" progress={65} target="Expert" current="Intermediate" />
            <GapItem title="Team Management" status="Ready" color="emerald" progress={90} target="Advanced" current="Advanced" />
          </div>
          <button className="w-full mt-10 py-4 border-2 border-slate-100 rounded-2xl text-slate-600 text-sm font-black hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm">
            View Analysis <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Progress and Insights Row */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <PlayCircle className="w-5 h-5 text-blue-600" /> Current Learning Progress
            </h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <CourseCard title="Advanced Data Analytics" skill="Visualization" time="3h left" progress={65} img="https://images.unsplash.com/photo-1551288049-bbbda546697a?w=300" />
            <CourseCard title="Strategic Leadership 101" skill="Planning" time="1h left" progress={82} img="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300" />
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">AI Recommendation</span>
            </div>
            <h4 className="text-xl font-bold mb-3 leading-tight">Senior Data Analyst Cert</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">Based on your recent progress, this path boosts readiness by <span className="text-white font-bold">15%</span>.</p>
            
            <div className="flex gap-4 mb-10">
               <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Impact</p>
                  <p className="font-bold text-emerald-400 text-lg">+15%</p>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Match</p>
                  <p className="font-bold text-blue-400 text-lg">92%</p>
               </div>
            </div>
          </div>
          <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all uppercase shadow-lg shadow-blue-900/30">Get Started</button>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ title, value, trend, sub, icon: Icon, iconBg, iconColor, highlight }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className={`${iconBg} w-12 h-12 rounded-2xl flex items-center justify-center mb-5`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">{title}</p>
    <h3 className="text-3xl font-black text-slate-900">{value}</h3>
    {trend && <p className="text-emerald-600 text-sm font-bold mt-2"> {trend}</p>}
    {sub && (
      <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-xs font-bold ${highlight === 'orange' ? 'bg-orange-50 text-orange-600' : highlight === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
        {sub}
      </div>
    )}
  </div>
);

const GapItem = ({ title, status, color, progress, target, current }) => {
  const colorClass = { orange: 'bg-orange-500', blue: 'bg-blue-600', emerald: 'bg-emerald-500' }[color];
  const badgeClass = { orange: 'text-orange-600 bg-orange-50', blue: 'text-blue-600 bg-blue-50', emerald: 'text-emerald-600 bg-emerald-50' }[color];
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-slate-800 text-base">{title}</span>
        <span className={`text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-widest ${badgeClass}`}>{status}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full">
        <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between mt-3 text-[12px] text-slate-400 font-bold">
        <span>Current: <b className="text-slate-700">{current}</b></span>
        <span>Target: <b className="text-slate-700">{target}</b></span>
      </div>
    </div>
  );
};

const CourseCard = ({ title, skill, time, progress, img }) => (
  <div className="p-5 border border-slate-100 rounded-3xl flex gap-5 items-center bg-white shadow-sm hover:border-blue-200 group transition-all">
    <div className="relative shrink-0 overflow-hidden rounded-2xl shadow-sm">
      <img src={img} alt="course" className="w-16 h-16 object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/40">
        <PlayCircle className="text-white w-7 h-7" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-slate-800 text-sm truncate mb-1 group-hover:text-blue-600">{title}</h4>
      <div className="h-1.5 w-full bg-slate-100 rounded-full mb-2">
        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-tighter">
        <span>{skill}</span>
        <span>{time}</span>
      </div>
    </div>
  </div>
);

export default EmployeeDashboard;