import React from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  PieChart,
  Zap, 
  Award, 
  Target,
  Search,
  Sparkles
} from 'lucide-react';

const MyProgress = () => {
  const activeCourses = [
    {
      title: "Advanced Machine Learning Algorithms",
      instructor: "Dr. Sarah Jenkins",
      progress: 68,
      timeLeft: "2h 15m remaining",
      module: "Module 4: Neural Networks",
      icon: <Cpu className="text-indigo-600 w-6 h-6" />,
      status: "IN PROGRESS"
    },
    {
      title: "Data Visualization for Enterprise",
      instructor: "Marcus Chen",
      progress: 12,
      timeLeft: "8h 40m remaining",
      module: "Module 1: Introduction to PowerBI",
      icon: <PieChart className="text-emerald-600 w-6 h-6" />,
      status: "JUST STARTED"
    }
  ];

  const skillGains = [
    { name: "Python Programming", gain: "+25%" },
    { name: "Cloud Architecture (AWS)", gain: "+40%" },
    { name: "Agile Methodologies", gain: "+10%" }
  ];

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* Header Section */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
              Acme Corp Workspace
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Learning Progress</h1>
          <p className="text-base text-slate-500 font-medium mt-1">Track your skills and daily learning goals</p>
        </div>

        <div className="relative w-72">
          <input 
            type="text" 
            placeholder="Search progress..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        </div>
      </header>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Clock className="text-blue-600 w-6 h-6" />} label="Time Spent" value="42.5h" subtext="This Month" />
        <StatCard icon={<Zap className="text-amber-500 w-6 h-6" />} label="Learning Points" value="1,240" subtext="+12% vs last week" />
        <StatCard icon={<Target className="text-rose-500 w-6 h-6" />} label="Daily Streak" value="14 Days" subtext="Personal Best: 22" />
        <StatCard icon={<Award className="text-emerald-600 w-6 h-6" />} label="Badges Earned" value="08" subtext="Next: Data Guru" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Active Courses & Skill Analysis */}
        <div className="col-span-8 space-y-8">
          <h2 className="text-xl font-bold text-slate-800 px-1">Active Learning</h2>
          
          {activeCourses.map((course, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex gap-6 items-start flex-1 mr-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  {course.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-wider ${course.status === 'IN PROGRESS' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                      {course.status}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                      <Clock className="w-3.5 h-3.5" /> {course.timeLeft}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-xl mb-1">{course.title}</h3>
                  <p className="text-sm text-slate-500 mb-5 font-medium">Instructor: {course.instructor}</p>
                  
                  <div className="w-full bg-slate-100 h-2 rounded-full mb-3 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-700" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-tight">
                    <span className="text-slate-400">{course.module}</span>
                    <span className="text-blue-600">{course.progress}% Completed</span>
                  </div>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-7 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-md shadow-blue-100 shrink-0">
                {course.status === 'IN PROGRESS' ? 'Continue' : 'Resume'} <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}

          {/* Skill Improvement Analysis */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-8">Skill Improvement Analysis</h2>
            
            <div className="space-y-8">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                <span>Monthly Assessment</span>
                <div className="flex gap-6">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span> Before</span>
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> After</span>
                </div>
              </div>

              {skillGains.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-bold mb-3">
                    <span className="text-slate-700">{skill.name}</span>
                    <span className="text-emerald-600 font-black">{skill.gain} Improvement</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full relative overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity & AI Recs */}
        <div className="col-span-4 space-y-8">
          
          {/* Activity Timeline */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Recent Activity</h3>
            
            <div className="space-y-8 relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100"></div>
              
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 bg-white border-4 border-blue-600 rounded-full z-10"></div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Today, 10:30 AM</p>
                <h4 className="text-base font-bold text-slate-800">Module 3 Completed</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Advanced Machine Learning Algorithms</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 bg-white border-4 border-emerald-500 rounded-full z-10 flex items-center justify-center">
                   <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Yesterday</p>
                <h4 className="text-base font-bold text-slate-800">Earned Badge: Data Ninja</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Completed Data Ethics with 98% score.</p>
              </div>
            </div>
          </div>

          {/* AI Recommendation Card */}
          <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white relative overflow-hidden group cursor-pointer shadow-xl">
            <TrendingUp className="absolute right-[-20px] top-[-20px] text-white opacity-10 w-48 h-48 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="bg-blue-600/30 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  AI MATCH: 94%
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Deep Learning Fundamentals</h3>
              <p className="text-xs text-slate-400 mb-8 leading-relaxed">Elevate your AI architecture skills based on your recent ML progress.</p>
              
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-900/40">
                Start Learning
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* Helper Component for Top Stats */
const StatCard = ({ icon, label, value, subtext }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">{value}</h3>
      <p className="text-xs font-bold text-slate-400">{subtext}</p>
    </div>
  </div>
);

export default MyProgress;