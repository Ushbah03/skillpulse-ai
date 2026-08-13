import React from 'react';
import { 
  Search, Target, Zap, Clock, TrendingUp, CheckCircle2, Lock 
} from 'lucide-react';

const LearningRecommendations = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen p-10 font-sans">
      
      {/* 1. Header Section - Scoped with Multi-Tenant Badge */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
              Acme Corp Workspace
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Learning Recommendations</h1>
          <p className="text-slate-500 text-base mt-1 font-medium">AI-powered personalized learning to improve your readiness</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl w-72 text-base focus:outline-none shadow-sm" 
            />
          </div>
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all text-sm">
            Learning Path
          </button>
        </div>
      </div>

      {/* 2. Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <LearningStat label="Recommended Courses" value="12" sub="Across 4 key skill areas" color="blue" />
        <LearningStat label="Skills Targeted" value="08" sub="Filling critical gap areas" color="indigo" />
        <LearningStat label="Readiness Boost" value="+22.4%" sub="Potential score increase" color="emerald" />
        <LearningStat label="Completion Prob." value="92%" sub="Based on past learning habits" color="orange" />
      </div>

      {/* 3. Top AI Recommendations */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-800">Top AI Recommendations</h3>
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest">Personalized</span>
          </div>
          <button className="text-blue-600 font-bold text-sm hover:underline">Explore All Courses</button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <CourseCard title="Advanced UI Systems & Tokenization" category="UI DESIGN" match="98% Match" duration="12h 40m" readiness="+8.5% Readiness" imgColor="bg-blue-600" />
          <CourseCard title="WCAG 2.2 Deep Dive for Product Teams" category="ACCESSIBILITY" match="94% Match" duration="8h 15m" readiness="+6.2% Readiness" imgColor="bg-slate-800" />
          <CourseCard title="Advanced Interaction & Motion in Figma" category="PROTOTYPING" match="85% Match" duration="15h 20m" readiness="+11.4% Readiness" imgColor="bg-rose-500" />
        </div>
      </div>

      {/* 4. Skill Gap Driven Recommendations */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600 p-3 rounded-xl shadow-md shadow-blue-200">
            <Target className="text-white w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Skill Gap Driven Recommendations</h3>
        </div>
        <div className="space-y-4">
          <GapRow title="Prototyping Interaction" tag="CRITICAL" gain="+12%" desc="Recommended: Advanced Motion Design Principles" />
          <GapRow title="Information Architecture" tag="MEDIUM" gain="+5%" desc="Recommended: Scalable Sitemap Structures for Enterprise" />
        </div>
      </div>

      {/* 5. Your Personalized Learning Journey */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
        <h3 className="text-xl font-bold text-slate-800 mb-10">Your Personalized Learning Journey</h3>
        <div className="relative flex justify-between">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100 -z-0"></div>
          <JourneyPhase phase="1" title="Foundation Skills" desc="UX Theory & Wireframing" status="COMPLETED" />
          <JourneyPhase phase="2" title="Intermediate Skills" desc="Design Systems & Figma Pro" status="IN PROGRESS" progress={65} />
          <JourneyPhase phase="3" title="Advanced Skills" desc="User Testing & Prototyping" status="LOCKED" />
          <JourneyPhase phase="4" title="Role Readiness" desc="Leadership & Team Design" status="LOCKED" />
        </div>
      </div>

      {/* 6. AI Career Growth Insights */}
      <div className="bg-[#EEF2FF] p-10 rounded-[2.5rem] border border-blue-50 flex items-center justify-between shadow-sm">
        <div className="max-w-2xl">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div> AI Career Growth Insights
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Based on current market trends and your internal benchmarks, completing the <span className="font-bold text-slate-900">"Enterprise Design Architect"</span> path will put you in the top 5% of candidates for <span className="font-bold text-slate-900">Senior Product Designer</span> roles.
          </p>
          <div className="flex gap-12">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommended Cert</p>
              <p className="text-slate-800 font-bold text-sm">Google UX Design Professional</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Completion</p>
              <p className="text-slate-800 font-bold text-sm">3 Months / 4 hrs weekly</p>
            </div>
          </div>
        </div>
        <div className="text-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="w-24 h-24 rounded-full border-[6px] border-blue-600 border-t-slate-100 flex items-center justify-center mb-2 mx-auto">
            <span className="text-2xl font-black text-slate-800">75%</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Potential</p>
        </div>
      </div>

    </div>
  );
};

// --- Helper Components ---

const LearningStat = ({ label, value, sub, color }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
      <p className="text-slate-500 text-xs font-medium">{sub}</p>
    </div>
  );
};

const CourseCard = ({ title, category, match, duration, readiness, imgColor }) => (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
    <div className={`${imgColor} h-40 relative flex items-center justify-center p-6 text-center`}>
      <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-white/20">{match}</span>
      <h4 className="text-white text-lg font-black uppercase italic leading-tight">{title}</h4>
    </div>
    <div className="p-6">
      <div className="flex gap-2 mb-3">
        <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">{category}</span>
        <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">High Impact</span>
      </div>
      <h4 className="text-base font-bold text-slate-800 mb-6 leading-tight h-10">{title}</h4>
      <div className="flex justify-between items-center text-slate-500 text-xs font-bold mb-6">
        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {duration}</div>
        <div className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> {readiness}</div>
      </div>
      <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-100">Enroll Now</button>
    </div>
  </div>
);

const GapRow = ({ title, tag, gain, desc }) => (
  <div className="flex justify-between items-center p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shadow-sm">
        <Zap className="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h5 className="font-bold text-slate-800 text-base">{title}</h5>
          <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">{tag}</span>
        </div>
        <p className="text-slate-500 text-xs">{desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Readiness Gain</p>
        <p className="text-emerald-500 font-black text-lg">{gain}</p>
      </div>
      <button className="border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all">Enroll Course</button>
    </div>
  </div>
);

const JourneyPhase = ({ phase, title, desc, status, progress }) => {
  const isCompleted = status === "COMPLETED";
  const isInProgress = status === "IN PROGRESS";
  return (
    <div className="relative z-10 w-1/4">
      <div className={`w-8 h-8 rounded-full mb-4 flex items-center justify-center border-4 border-white shadow-sm ${isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-blue-600' : 'bg-slate-100'}`}>
        {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : isInProgress ? <div className="w-2 h-2 bg-white rounded-full"></div> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Phase {phase}</p>
      <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
      <p className="text-slate-500 text-[11px] mb-3 leading-tight">{desc}</p>
      {isInProgress && (
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-600" style={{width: `${progress}%`}}></div>
          </div>
          <span className="text-[9px] font-bold text-slate-600">{progress}%</span>
        </div>
      )}
    </div>
  );
};

export default LearningRecommendations;