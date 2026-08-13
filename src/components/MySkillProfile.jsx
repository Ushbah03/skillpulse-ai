import React from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar 
} from 'recharts';
import { 
  Search, Plus, CheckCircle, Clock, Target, Layout, Code, Mic2, Filter, Download, MoreHorizontal, Sparkles, ArrowRight 
} from 'lucide-react';

const radarData = [
  { subject: 'Technical', A: 90 },
  { subject: 'Domain', A: 70 },
  { subject: 'Soft Skills', A: 80 },
  { subject: 'Leadership', A: 65 },
];

const MySkillProfile = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen p-10 font-sans">
      
      {/* Header Section - Scoped with Multi-Tenant Badge */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
              Acme Corp Workspace
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Skill Profile</h1>
          <p className="text-slate-500 text-base mt-1 font-medium">View and manage your professional skills and readiness</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search skills..." 
              className="pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl w-72 text-base focus:outline-none shadow-sm" 
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
            <Plus className="w-5 h-5" /> Add Skill
          </button>
          <img src="https://i.pravatar.cc/150?u=alex" alt="profile" className="w-12 h-12 rounded-full border-2 border-white shadow-md ml-2" />
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        <ProfileStat icon={Layout} label="Total Skills" value="32" color="blue" />
        <ProfileStat icon={CheckCircle} label="Validated Skills" value="24" color="emerald" />
        <ProfileStat icon={Clock} label="Expiring Soon" value="3" color="orange" />
        <ProfileStat icon={Target} label="Role Alignment" value="84%" color="violet" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-8 mb-10">
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

        <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Readiness Contribution</h3>
          <div className="space-y-8">
            <ContributionItem icon={Code} title="React & Frontend Architecture" impact="+18%" progress={85} color="emerald" />
            <ContributionItem icon={Layout} title="UI/UX Design Systems" impact="+12%" progress={70} color="emerald" />
            <ContributionItem icon={Mic2} title="Public Speaking" impact="+2%" progress={30} color="orange" />
          </div>
        </div>
      </div>

      {/* Skills Inventory Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">My Skills Inventory</h3>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">Skill Name</th>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4">Proficiency</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Readiness %</th>
              <th className="px-8 py-4">Last Updated</th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <TableRow name="React.js Architecture" cat="Technical" level="Advanced" status="Validated" read="18%" date="Oct 12, 2023" dotColor="bg-blue-500" />
            <TableRow name="UI/UX Design Systems" cat="Soft Skills" level="Expert" status="Pending" read="12%" date="Nov 04, 2023" dotColor="bg-violet-500" />
            <TableRow name="Python Data Analysis" cat="Technical" level="Intermediate" status="Expired" read="5%" date="Dec 20, 2022" dotColor="bg-orange-500" />
          </tbody>
        </table>
      </div>

      {/* Skill Gap & AI Recommendations */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        
        {/* Skill Gap Identification */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Skill Gap Identification</h3>
          <div className="space-y-4">
            <GapItem 
              title="Cloud Infrastructure (AWS)" 
              desc="Missing - Critical for Senior Role" 
              action="Add Skill" 
              color="red" 
            />
            <GapItem 
              title="Strategic Roadmapping" 
              desc="Partially Developed - Need Intermediate level" 
              action="Update" 
              color="yellow" 
            />
          </div>
        </div>

        {/* AI Recommendations Card */}
        <div className="bg-[#0F172A] p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/30">
              <Sparkles className="w-3 h-3" /> AI Recommendations
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
              Bridge the gap with <br /> 
              <span className="text-blue-400">"Cloud Native Design"</span>
            </h2>
            
            <p className="text-slate-400 text-base mb-8 leading-relaxed">
              Completing this course will fulfill 60% of your missing cloud infrastructure requirements for the Lead Architect path.
            </p>

            <div className="flex gap-10 mb-10">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Impact</p>
                <p className="text-emerald-400 font-bold text-lg">+14% Readiness</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time to Complete</p>
                <p className="text-white font-bold text-lg">12 Hours</p>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20">
              Start Learning Path <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

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

const GapItem = ({ title, desc, action, color }) => {
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
      <button className={`text-xs font-black uppercase tracking-widest hover:underline ${color === 'red' ? 'text-red-600' : 'text-amber-600'}`}>
        {action}
      </button>
    </div>
  );
};

const TableRow = ({ name, cat, level, status, read, date, dotColor }) => (
  <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer text-sm">
    <td className="px-8 py-5 flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
      <span className="font-bold text-slate-800">{name}</span>
    </td>
    <td className="px-8 py-5 text-slate-500 font-medium">{cat}</td>
    <td className="px-8 py-5">
      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold text-[11px]">{level}</span>
    </td>
    <td className="px-8 py-5">
      <span className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${
        status === 'Validated' ? 'bg-emerald-50 text-emerald-600' : 
        status === 'Pending' ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-600'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-8 py-5 font-black text-slate-800">{read}</td>
    <td className="px-8 py-5 text-slate-400 font-medium">{date}</td>
    <td className="px-8 py-5 text-right">
      <button className="p-2 hover:bg-white rounded-lg text-slate-300 hover:text-slate-600 transition-all">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </td>
  </tr>
);

export default MySkillProfile;