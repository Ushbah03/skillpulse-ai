import React from 'react';
import { 
  Search, History, Layout, 
  Filter, ArrowUpDown, Sparkles
} from 'lucide-react';

const SkillAssessment = () => {
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill Assessment</h1>
          <p className="text-slate-500 text-base mt-1 font-medium">Validate your skills through structured assessments</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search assessments..." 
              className="pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl w-72 text-base focus:outline-none shadow-sm" 
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <History className="w-5 h-5" /> History
          </button>
          <img src="https://i.pravatar.cc/150?u=jason" alt="profile" className="w-12 h-12 rounded-full border-2 border-white shadow-md ml-2" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        <AssessmentStat label="Available Assessments" value="12" sub="4 NEW THIS WEEK" color="blue" />
        <AssessmentStat label="Completed Assessments" value="28" sub="PASS RATE: 92%" color="emerald" />
        <AssessmentStat label="Pending Assessments" value="03" sub="DUE BY FRIDAY" color="orange" />
        <AssessmentStat label="Validated Skills Count" value="15" sub="TOP 10% IN ORG" color="violet" />
      </div>

      {/* Available Skill Assessments Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Available Skill Assessments</h3>
          <div className="flex gap-3">
            <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">Assessment Name</th>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4">Type</th>
              <th className="px-8 py-4">Duration</th>
              <th className="px-8 py-4">Difficulty</th>
              <th className="px-8 py-4">Attempts</th>
              <th className="px-8 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AssessmentRow 
              name="React Advanced Hooks" skill="React.js" cat="Frontend" type="AI-BASED" 
              dur="45 Min" diff="INTERMEDIATE" diffColor="text-orange-500" attempts="2 / 3" 
            />
            <AssessmentRow 
              name="Node.js Design Patterns" skill="Node.js" cat="Backend" type="PRACTICAL" 
              dur="90 Min" diff="ADVANCED" diffColor="text-violet-500" attempts="0 / 1" 
            />
          </tbody>
        </table>
      </div>

      {/* AI Recommended Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-xl font-bold text-slate-800">AI Recommended Assessments</h3>
          <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-md flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-blue-200" /> AI Insights
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <RecommendedCard 
            title="AWS Cloud Architect" 
            desc="Critical skill gap detected for your current role trajectory." 
            impact="+12%" 
            tag="HIGH IMPORTANCE" 
          />
          <RecommendedCard 
            title="Cybersecurity Fundamentals" 
            desc="Required for the Lead Engineer path you selected." 
            impact="+8%" 
            tag="PATH RELEVANT" 
          />
        </div>
      </div>

      {/* Bottom Row: Scheduled & Guidelines */}
      <div className="grid grid-cols-5 gap-8">
        {/* Scheduled Assessments */}
        <div className="col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Scheduled Assessments</h3>
          <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl flex justify-between items-center">
            <div className="flex gap-5 items-center">
              <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm text-center min-w-[70px]">
                <p className="text-[10px] font-black text-slate-400 uppercase">Oct</p>
                <p className="text-2xl font-black text-slate-800 tracking-tighter">14</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">System Design Interview</h4>
                <p className="text-slate-500 text-sm font-medium">10:30 AM • 120 Min</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Starts In</p>
              <div className="flex gap-2">
                <TimeUnit value="2d" />
                <TimeUnit value="04h" />
                <TimeUnit value="15m" />
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Guidelines */}
        <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Assessment Guidelines</h3>
          <ul className="space-y-4 mb-8">
            <GuidelineItem text="Ensure a stable internet connection before starting." />
            <GuidelineItem text="Practical assessments require camera & screen sharing." />
            <GuidelineItem text="Retakes are only available after 30 days of initial attempt." />
          </ul>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <p className="text-amber-700 text-xs font-bold leading-relaxed text-center">
              Closing the browser tab during a live assessment will result in immediate disqualification.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

// --- Sub Components ---

const AssessmentStat = ({ label, value, sub, color }) => {
  const themes = {
    blue: 'text-blue-600 bg-blue-50/50',
    emerald: 'text-emerald-600 bg-emerald-50/50',
    orange: 'text-orange-600 bg-orange-50/50',
    violet: 'text-violet-600 bg-violet-50/50'
  };
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <p className="text-slate-400 text-xs font-bold mb-4">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{value}</h3>
      <span className={`${themes[color]} px-3 py-1 rounded-lg text-[10px] font-black tracking-widest`}>
        {sub}
      </span>
    </div>
  );
};

const AssessmentRow = ({ name, skill, cat, type, dur, diff, diffColor, attempts }) => (
  <tr className="hover:bg-slate-50/50 transition-all cursor-pointer">
    <td className="px-8 py-6">
      <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
      <p className="text-slate-400 text-[11px] font-medium mt-1">Skill: {skill}</p>
    </td>
    <td className="px-8 py-6 text-slate-500 font-medium text-sm">{cat}</td>
    <td className="px-8 py-6">
      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md font-black text-[9px] tracking-wider uppercase border border-blue-100">
        {type}
      </span>
    </td>
    <td className="px-8 py-6 text-slate-500 font-bold text-sm">{dur}</td>
    <td className={`px-8 py-6 font-black text-[10px] flex items-center gap-1.5 ${diffColor}`}>
      ★ {diff}
    </td>
    <td className="px-8 py-6 text-slate-500 font-bold text-sm">{attempts}</td>
    <td className="px-8 py-6">
      <button className="bg-[#0F172A] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-sm">
        Start Assessment
      </button>
    </td>
  </tr>
);

const RecommendedCard = ({ title, desc, impact, tag }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-start group hover:border-blue-200 transition-all">
    <div className="max-w-[70%]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Layout className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Readiness Impact</p>
          <p className="text-emerald-500 font-black text-lg">{impact}</p>
        </div>
      </div>
      <h4 className="text-xl font-bold text-slate-800 mb-2">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">{desc}</p>
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg tracking-widest">{tag}</span>
        <button className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
          Start Now <ArrowUpDown className="w-3 h-3 rotate-90" />
        </button>
      </div>
    </div>
    <div className="w-20 h-20 bg-blue-50/30 rounded-full blur-2xl group-hover:bg-blue-100 transition-all"></div>
  </div>
);

const TimeUnit = ({ value }) => (
  <div className="bg-white px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 shadow-sm">
    {value}
  </div>
);

const GuidelineItem = ({ text }) => (
  <li className="flex items-start gap-3">
    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mt-1.5"></div>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{text}</p>
  </li>
);

export default SkillAssessment;