import React from 'react';
import { 
  Search, Filter, Download, Bell, TrendingUp, 
  Award, Users, Rocket, CheckCircle, ArrowRight 
} from 'lucide-react';

const AssessmentResults = () => {
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Results</h1>
          <p className="text-slate-500 text-base mt-1 font-medium">Review your performance and validated skill levels</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search results..." 
              className="pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl w-72 text-base focus:outline-none shadow-sm" 
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm text-sm">
            <Download className="w-4 h-4" /> Download Report
          </button>
          <div className="relative bg-white p-3 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        <ResultStat label="Assessment Score" value="88%" trend="+12% vs last attempt" icon={<TrendingUp className="w-5 h-5" />} color="blue" />
        <ResultStat label="Proficiency Level" value="Advanced" trend="Validated on Oct 24, 2023" icon={<Award className="w-5 h-5" />} color="emerald" />
        <ResultStat label="Percentile Ranking" value="Top 15%" trend="Higher than 85% of peers" icon={<Users className="w-5 h-5" />} color="violet" />
        <ResultStat label="Readiness Impact" value="+8.5%" trend="Total Score: 72%" icon={<Rocket className="w-5 h-5" />} color="orange" />
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        {/* Score Distribution */}
        <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-xl font-bold text-slate-800">Score Distribution</h3>
            <button className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest hover:bg-slate-100">All Sections</button>
          </div>
          <div className="h-56 flex items-end justify-around px-4">
             {['UX Research', 'UI Design', 'Prototyping', 'Design Sys', 'Accessibility'].map((item, i) => (
               <div key={i} className="flex flex-col items-center gap-4">
                 <div className="w-14 bg-blue-500/10 rounded-t-xl relative group transition-all" style={{height: `${[85, 94, 60, 88, 90][i]}%`}}>
                    <div className="absolute inset-0 bg-blue-600 rounded-t-xl scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500"></div>
                 </div>
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{item}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Skill Validation Status */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-left">Skill Validation Status</h3>
          <div className="relative w-36 h-36 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
              <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={402} strokeDashoffset={402 - (402 * 0.92)} className="text-emerald-500" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800">92%</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Confidence</span>
            </div>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 mb-6 border border-emerald-100">
            <CheckCircle className="w-4 h-4" /> Advanced Skill Validated
          </div>
          <div className="space-y-3 text-left border-t border-slate-50 pt-6">
             <StatusRow label="Validation Date" value="Oct 24, 2023" />
             <StatusRow label="Role Readiness Impact" value="+12 Points" color="text-emerald-500" />
             <StatusRow label="Next Re-validation" value="Oct 24, 2024" />
          </div>
        </div>
      </div>

      {/* AI Improvement Suggestions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-8 rounded-[2.5rem] flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Rocket className="text-white w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-slate-800 text-xl">AI Improvement Suggestions</h4>
              <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">AI Generated</span>
            </div>
            <p className="text-slate-500 text-base">Based on your weak spots in <span className="font-bold text-slate-700">Prototyping Interaction</span>, we recommend a targeted course.</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Gain</p>
            <p className="text-emerald-500 font-black text-xl">+15% Readiness</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md flex items-center gap-2">
            View Recommended Course <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

// --- Helper Components ---
const ResultStat = ({ label, value, trend, icon, color }) => {
  const themes = {
    blue: 'text-blue-600 bg-blue-50/50',
    emerald: 'text-emerald-600 bg-emerald-50/50',
    violet: 'text-violet-600 bg-violet-50/50',
    orange: 'text-orange-600 bg-orange-50/50'
  };
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        <div className={`${themes[color]} p-2.5 rounded-2xl`}>{icon}</div>
      </div>
      <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">{value}</h3>
      <p className="text-slate-500 text-sm font-medium">{trend}</p>
    </div>
  );
};

const StatusRow = ({ label, value, color = "text-slate-700" }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-slate-500 text-sm font-medium">{label}</span>
    <span className={`text-sm font-bold ${color}`}>{value}</span>
  </div>
);

export default AssessmentResults;