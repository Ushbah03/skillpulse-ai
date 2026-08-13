import React from 'react';

const CareerPaths = () => {
  return (
    <div className="p-4 md:p-8 bg-[#F8F9FE] min-h-screen font-sans text-slate-900">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100 mb-2 inline-block">
            Talent Mobility & Progression
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Career Path Suggestions</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            AI-recommended career progression based on your readiness and skills
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <IconFilter className="w-4 h-4 text-slate-600" /> 
            <span>Filter Level</span>
          </button>

          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Recs</span>
            <div className="w-9 h-5 bg-emerald-500 rounded-full relative cursor-pointer transition-colors">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden border-2 border-white shadow-sm ml-1 shrink-0">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden mb-10 shadow-xl shadow-indigo-100">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold mb-6 inline-block">
            Current Role: Senior Designer
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-[1.15]">
            You are <span className="text-blue-200">72%</span> ready for a Product Manager role.
          </h2>
          <p className="text-blue-100 text-sm md:text-lg leading-relaxed mb-8 opacity-90">
            Based on your recent leadership assessments and project management certifications, you have high potential for strategic product roles. We've mapped out a path to bridge your remaining gaps.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-7 py-3.5 bg-white text-blue-600 rounded-2xl font-black text-sm md:text-base shadow-lg hover:bg-blue-50 transition-all active:scale-95">
              Start Path Now
            </button>
            <button className="px-7 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm md:text-base hover:bg-white/20 transition-all">
              View Full Analysis
            </button>
          </div>
        </div>
        
        {/* Progress Circle in Hero */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 items-center justify-center">
          <div className="relative w-56 h-56">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/15" />
              <circle cx="120" cy="120" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray="628" strokeDashoffset="175" className="text-white" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black">72%</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mt-1">Readiness</span>
            </div>
          </div>
        </div>
      </section>

      {/* Career Roadmap Timeline */}
      <section className="mb-10">
        <h3 className="text-xl font-bold mb-6 px-1">Career Progression Roadmap</h3>
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm relative overflow-x-auto">
          <div className="relative min-w-[650px] px-8 py-4">
            {/* Connecting Bar */}
            <div className="absolute top-11 left-16 right-16 h-1 bg-slate-100 z-0"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <RoadmapStep label="Senior Designer" sub="CURRENT" status="active" />
              <RoadmapStep label="Lead Designer" sub="NEXT STEP" status="active" flag />
              <RoadmapStep label="Product Manager" sub="TARGET" status="pending" star />
              <RoadmapStep label="Head of Product" sub="ADVANCED" status="locked" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Recommended Paths & Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-6 px-1">Top Recommended Paths</h3>
            <div className="space-y-4">
              <RecommendationCard 
                title="Product Manager" 
                dept="Product & Innovation Department" 
                gaps="3 Missing Skills" 
                time="~ 4 Months" 
                readiness="72%" 
                subText="92% Prob. Promotion"
                aiPick
              />
              <RecommendationCard 
                title="Lead Product Designer" 
                dept="Design & Creative Department" 
                gaps="1 Missing Skill" 
                time="~ 1 Month" 
                readiness="89%" 
                subText="High Readiness"
              />
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Projected Readiness Progress</h4>
                <p className="text-slate-400 text-xs mt-0.5">Forecasted growth based on your current learning path</p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-blue-300 rounded-full bg-blue-50"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Forecast</span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between h-48 px-2 gap-2 md:gap-4">
              <Bar height="35%" label="Jan" />
              <Bar height="42%" label="Feb" />
              <Bar height="50%" label="Mar" />
              <Bar height="68%" label="Apr" />
              <Bar height="80%" label="NOW" active />
              <Bar height="85%" label="Jun" forecast />
              <Bar height="92%" label="Jul" forecast />
              <Bar height="98%" label="Aug" forecast />
            </div>
          </div>
        </div>

        {/* Right Column: Gap Analysis & Acceleration Plan */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Gap Analysis */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
            <h4 className="text-lg font-bold mb-6 text-slate-900">Gap Analysis: Product Manager</h4>
            <div className="space-y-5">
              <GapMetric label="Stakeholder Management" status="Critical" color="bg-rose-500" width="45%" />
              <GapMetric label="Data-Driven Decision Making" status="Gap" color="bg-amber-500" width="70%" />
              <GapMetric label="Market Research" status="Minor Gap" color="bg-emerald-500" width="90%" />
            </div>
          </div>

          {/* AI Acceleration Plan */}
          <div className="bg-[#1E0B4B] p-6 md:p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
            <h4 className="text-lg font-bold mb-6 relative z-10">AI Acceleration Plan</h4>
            
            <div className="space-y-3.5 mb-6">
              <PlanItem label="RECOMMENDED COURSE" value="Advanced Stakeholder Mastery" />
              <PlanItem label="CERTIFICATION" value="Certified Product Manager (CPM)" />
              
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/10 mt-4">
                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Readiness Increase</p>
                <h5 className="text-2xl md:text-3xl font-black text-emerald-400">+15% in 30 Days</h5>
              </div>
            </div>

            <button className="w-full py-3.5 bg-white text-[#1E0B4B] rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95">
              View Full Roadmap
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const RoadmapStep = ({ label, sub, status, flag, star }) => (
  <div className="flex flex-col items-center z-10">
    <div className={`w-14 h-14 rounded-full border-[5px] border-white shadow-md flex items-center justify-center transition-transform hover:scale-105 ${
      status === 'active' ? 'bg-blue-600 text-white' : 
      status === 'pending' ? 'bg-indigo-100 text-indigo-600' : 
      'bg-slate-100 text-slate-300'
    }`}>
      {status === 'active' && (flag ? <IconFlag className="w-5 h-5" /> : <IconUser className="w-5 h-5" />)}
      {status === 'pending' && <IconStarSmall className="w-5 h-5" />}
      {status === 'locked' && <div className="w-3.5 h-3.5 bg-slate-300 rounded-full"></div>}
    </div>
    <div className="mt-4 text-center">
      <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${status === 'active' ? 'text-blue-600' : 'text-slate-400'}`}>
        {sub}
      </span>
      <p className={`text-sm font-bold ${status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>{label}</p>
    </div>
  </div>
);

const RecommendationCard = ({ title, dept, gaps, time, readiness, subText, aiPick }) => (
  <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:shadow-md transition-all">
    <div className="flex gap-5 items-center">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
        <IconPath className="w-6 h-6" />
      </div>
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h4 className="text-lg md:text-xl font-bold text-slate-900">{title}</h4>
          {aiPick && (
            <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              AI PICK
            </span>
          )}
        </div>
        <p className="text-slate-400 text-xs md:text-sm font-medium mb-3">{dept}</p>
        <div className="flex gap-6">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">SKILL GAPS</p>
            <p className="text-xs md:text-sm font-bold text-slate-700">{gaps}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">TIME TO READY</p>
            <p className="text-xs md:text-sm font-bold text-slate-700">{time}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-end gap-2 border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
      <div className="text-left sm:text-right">
        <div className="flex items-baseline gap-1 sm:justify-end">
          <span className="text-2xl md:text-3xl font-black text-slate-900">{readiness}</span>
          <span className="text-xs font-bold text-slate-400 italic">Ready</span>
        </div>
        <p className={`text-[10px] font-black uppercase tracking-tight mt-0.5 ${subText.includes('92%') ? 'text-emerald-500' : 'text-blue-600'}`}>
          {subText}
        </p>
      </div>
      <button className="text-indigo-600 font-bold text-sm hover:underline">View Detail</button>
    </div>
  </div>
);

const GapMetric = ({ label, status, color, width }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-xs md:text-sm font-bold text-slate-700">{label}</span>
      <span className={`text-[10px] font-black uppercase ${status === 'Critical' ? 'text-rose-500' : status === 'Gap' ? 'text-amber-500' : 'text-emerald-500'}`}>
        {status}
      </span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width }}></div>
    </div>
  </div>
);

const PlanItem = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xs md:text-sm font-bold text-white leading-tight">{value}</p>
  </div>
);

const Bar = ({ height, label, active, forecast }) => (
  <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
    <div 
      className={`w-full rounded-xl transition-all duration-500 relative ${
        active ? 'bg-blue-600 shadow-md shadow-blue-200' : 
        forecast ? 'bg-blue-100 border-2 border-blue-300 border-dashed' : 
        'bg-blue-400'
      }`} 
      style={{ height }}
    >
      {active && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shadow-xs">
          NOW
        </div>
      )}
    </div>
    <span className={`text-[10px] font-black uppercase ${active ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
  </div>
);

/* --- SVG Icons --- */
const IconFilter = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
);
const IconUser = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const IconFlag = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12zm0 0v7"/></svg>
);
const IconStarSmall = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const IconPath = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22v-5M9 8V2"/><path d="m17 12 3-3-3-3"/><path d="M11 12h9"/><path d="m7 12-3 3 3 3"/><path d="M4 15h9"/></svg>
);

export default CareerPaths;