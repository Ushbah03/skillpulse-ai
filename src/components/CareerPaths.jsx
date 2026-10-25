import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import { Sparkles, Navigation } from 'lucide-react';
import SkillPulseLoader from './SkillPulseLoader';

const CareerPaths = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPathId, setSelectedPathId] = useState('path-1');

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const workspaceName = storedUser.tenant?.name || 'Enterprise Corp Workspace';

  useEffect(() => {
    async function fetchCareerData() {
      try {
        setLoading(true);
        const res = await employeeAPI.getCareerPaths();
        if (res?.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Error loading DB career paths:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCareerData();
  }, []);

  if (loading) {
    return <SkillPulseLoader message="Calculating Career Pathway Trajectories..." />;
  }

  const profile = data?.userProfile || {};
  const currentTitle = profile.jobTitle || storedUser.jobTitle || 'Software Specialist';
  const targetReadiness = data?.targetReadiness ?? 25;
  const recommendedPaths = data?.recommendedPaths || [];
  const monthlyProgress = data?.monthlyProgress || [];
  const gaps = data?.gaps || [];

  const activeSelectedPath = recommendedPaths.find(p => p.id === selectedPathId) || recommendedPaths[0] || {};
  const heroTargetRole = activeSelectedPath.title || data?.primaryTargetRole || 'Lead Development Architect';
  const heroReadiness = activeSelectedPath.readiness || `${targetReadiness}%`;
  const roadmapSteps = activeSelectedPath.roadmap || data?.roadmap || [];

  const acceleration = {
    recommendedCourse: activeSelectedPath.targetCourseTitle || data?.accelerationPlan?.recommendedCourse || 'Enterprise Skill Mastery Course',
    targetCertification: activeSelectedPath.targetCertTitle || data?.accelerationPlan?.targetCertification || 'Enterprise Certified Professional',
    estimatedIncrease: data?.accelerationPlan?.estimatedIncrease || '+25% upon Course Completion',
    targetCourseId: activeSelectedPath.targetCourseId || data?.accelerationPlan?.targetCourseId
  };

  return (
    <div className="bg-transparent min-h-screen p-0 pb-12 font-sans text-[#17233E]">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#1988A3]/10 text-[#1988A3] px-2.5 py-1 rounded-md border border-[#1988A3]/25 mb-2 inline-block">
            {workspaceName}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#17233E]">Career Path Suggestions</h1>
          <p className="text-xs sm:text-sm md:text-base text-[#5A6D89] font-medium mt-1">
            Career progression pathways calculated live from your verified skill inventory & department benchmarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#17233E] border-2 border-white shadow-md flex items-center justify-center text-white font-black text-sm shrink-0">
            {storedUser.firstName?.charAt(0) || 'E'}{storedUser.lastName?.charAt(0) || 'Z'}
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative w-full bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-12 text-white overflow-hidden mb-6 sm:mb-10 shadow-2xl border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold mb-4 sm:mb-6 inline-block text-[#11C6DE]">
            Current Role: {currentTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight">
            You are <span className="text-[#11C6DE]">{heroReadiness}</span> ready for a {heroTargetRole} role.
          </h2>
          <p className="text-[#8A9CB7] text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 font-medium">
            {gaps.length > 0 
              ? `Based on your verified skills in ${profile.department || 'Development'}, your current readiness is ${heroReadiness}. Bridging your ${gaps.length} remaining skill gaps through active courseware will unlock 100% readiness for this position.`
              : `Your verified skill inventory meets 100% of benchmark criteria for advanced ${heroTargetRole} tracks. You are eligible for immediate career promotion review.`
            }
          </p>

          {activeSelectedPath.aiRationale && (
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 sm:p-4 mb-6 sm:mb-8 text-xs text-[#8A9CB7] font-medium">
              <span className="font-bold text-white uppercase tracking-wider block mb-1">AI Recommendation Rationale:</span>
              {activeSelectedPath.aiRationale}
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/dashboard/learning', { state: { courseId: acceleration.targetCourseId } })}
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] rounded-xl sm:rounded-2xl font-black text-xs md:text-sm uppercase tracking-wider shadow-lg shadow-[#1988A3]/25 transition-all flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Start Path Now
            </button>
          </div>
        </div>
        
        {/* Progress Circle in Hero */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 items-center justify-center">
          <div className="relative w-56 h-56">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/10" />
              <circle cx="120" cy="120" r="100" stroke="#11C6DE" strokeWidth="16" fill="transparent" strokeDasharray="628" strokeDashoffset={628 - (628 * (parseInt(heroReadiness) / 100))} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{heroReadiness}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#11C6DE] mt-1">Readiness</span>
            </div>
          </div>
        </div>
      </section>

      {/* Career Roadmap Timeline */}
      <section className="mb-6 sm:mb-10">
        <h3 className="text-lg sm:text-xl font-black text-[#17233E] mb-4 sm:mb-6 px-1">Career Progression Roadmap</h3>
        <div className="glass-panel p-4 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2.5rem] relative overflow-x-auto no-scrollbar">
          <div className="relative min-w-[650px] px-4 sm:px-8 py-3 sm:py-4">
            {/* Connecting Bar */}
            <div className="absolute top-11 left-16 right-16 h-1 bg-[#17233E]/10 z-0"></div>
            
            <div className="flex justify-between items-start relative z-10">
              {roadmapSteps.map((s, idx) => (
                <RoadmapStep 
                  key={idx}
                  label={s.label} 
                  sub={s.sub} 
                  status={s.status} 
                  flag={s.flag}
                  star={s.star}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Recommended Paths & Chart */}
        <div className="col-span-1 lg:col-span-8 space-y-6 sm:space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6 px-1">
              <h3 className="text-lg sm:text-xl font-black text-[#17233E]">Top Recommended Paths</h3>
              <span className="text-xs font-semibold text-[#5A6D89]">Click path to view active alignment</span>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {recommendedPaths.map((path) => (
                <RecommendationCard 
                  key={path.id}
                  title={path.title} 
                  dept={path.dept} 
                  gaps={path.gapsText} 
                  time={path.timeToReady} 
                  readiness={path.readiness} 
                  subText={path.subText}
                  aiPick={path.isPrimary}
                  isSelected={selectedPathId === path.id}
                  onSelect={() => setSelectedPathId(path.id)}
                />
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h4 className="text-base sm:text-lg font-black text-[#17233E]">Projected Readiness Progress</h4>
                <p className="text-[#5A6D89] text-xs mt-0.5 font-medium">Forecasted growth based on your active learning path</p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#1988A3] rounded-full"></span>
                  <span className="text-[10px] font-bold text-[#5A6D89] uppercase tracking-wider">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-[#1988A3]/40 rounded-full bg-[#1988A3]/10"></span>
                  <span className="text-[10px] font-bold text-[#5A6D89] uppercase tracking-wider">Forecast</span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between h-48 px-1 sm:px-2 gap-1.5 sm:gap-2 md:gap-4">
              {monthlyProgress.map((bar, i) => (
                <Bar 
                  key={i}
                  height={bar.heightPct} 
                  label={bar.month} 
                  active={bar.active} 
                  forecast={bar.forecast}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Gap Analysis & Acceleration Plan */}
        <div className="col-span-1 lg:col-span-4 space-y-6 sm:space-y-8">
          
          {/* Gap Analysis */}
          <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h4 className="text-base sm:text-lg font-black text-[#17233E]">Active Gap Alignment</h4>
              <span className="text-xs font-bold text-[#5A6D89] bg-[#17233E]/5 px-2.5 py-0.5 rounded-full">
                {gaps.length} Gaps
              </span>
            </div>
            
            {gaps.length > 0 ? (
              <div className="space-y-5">
                {gaps.map((g) => {
                  const current = g.currentLevel || 1.0;
                  const required = g.requiredLevel || 4.5;
                  const progressPct = g.progressPct || 0;
                  const effectiveLevel = current + ((required - current) * (progressPct / 100));
                  const pct = `${Math.min(100, Math.round((effectiveLevel / required) * 100))}%`;
                  return (
                    <GapMetric 
                      key={g.id} 
                      label={g.skill?.name || 'Skill Gap'} 
                      status={g.severity || 'HIGH'} 
                      color={g.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'} 
                      width={pct} 
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-white/70 rounded-2xl p-4 border border-[#8A9CB7]/20">
                <p className="text-xs font-bold text-emerald-600">✓ 100% Skills Aligned</p>
                <p className="text-[11px] text-[#5A6D89] mt-1">No active skill gaps found in your skill profile.</p>
              </div>
            )}
          </div>

          {/* AI Acceleration Plan */}
          <div className="bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#121E33] p-6 md:p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1988A3]/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Sparkles className="w-5 h-5 text-[#11C6DE]" />
              <h4 className="text-lg font-black">Target Acceleration Plan</h4>
            </div>
            
            <div className="space-y-3.5 mb-6">
              <PlanItem label="RECOMMENDED COURSE" value={acceleration.recommendedCourse} />
              <PlanItem label="TARGET CERTIFICATION" value={acceleration.targetCertification} />
              
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/10 mt-4">
                <p className="text-[#8A9CB7] text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Readiness Increase</p>
                <h5 className="text-2xl md:text-3xl font-black text-[#11C6DE]">{acceleration.estimatedIncrease}</h5>
              </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard/learning', { state: { courseId: acceleration.targetCourseId } })}
              className="w-full py-3.5 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1988A3]/25"
            >
              Start Acceleration
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const RoadmapStep = ({ label, sub, status, flag }) => (
  <div className="flex flex-col items-center z-10">
    <div className={`w-14 h-14 rounded-full border-[5px] border-white shadow-md flex items-center justify-center transition-transform hover:scale-105 ${
      status === 'active' ? 'bg-[#1988A3] text-white' : 
      status === 'pending' ? 'bg-[#1988A3]/15 text-[#1988A3]' : 
      'bg-slate-100 text-slate-300'
    }`}>
      {status === 'active' && (flag ? <IconFlag className="w-5 h-5" /> : <IconUser className="w-5 h-5" />)}
      {status === 'pending' && <IconStarSmall className="w-5 h-5" />}
      {status === 'locked' && <div className="w-3.5 h-3.5 bg-slate-300 rounded-full"></div>}
    </div>
    <div className="mt-4 text-center">
      <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${status === 'active' ? 'text-[#1988A3]' : 'text-[#8A9CB7]'}`}>
        {sub}
      </span>
      <p className={`text-sm font-bold ${status === 'locked' ? 'text-[#8A9CB7]' : 'text-[#17233E]'}`}>{label}</p>
    </div>
  </div>
);

const RecommendationCard = ({ title, dept, gaps, time, readiness, subText, aiPick, isSelected, onSelect }) => (
  <div 
    onClick={onSelect}
    className={`glass-panel p-6 md:p-8 rounded-[2rem] border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group ${
      isSelected ? 'border-[#1988A3] shadow-lg ring-2 ring-[#1988A3]/20' : 'hover:border-[#1988A3]/40'
    }`}
  >
    <div className="flex gap-5 items-center">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
        isSelected ? 'bg-[#17233E] text-white' : 'bg-white text-[#8A9CB7] group-hover:bg-[#1988A3]/10 group-hover:text-[#1988A3]'
      }`}>
        <IconPath className="w-6 h-6" />
      </div>
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h4 className="text-lg md:text-xl font-bold text-[#17233E]">{title}</h4>
          {aiPick && (
            <span className="bg-[#1988A3]/15 text-[#1988A3] border border-[#1988A3]/30 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              PRIMARY
            </span>
          )}
        </div>
        <p className="text-[#5A6D89] text-xs md:text-sm font-medium mb-3">{dept}</p>
        <div className="flex gap-6">
          <div>
            <p className="text-[9px] font-black text-[#8A9CB7] uppercase tracking-widest mb-0.5">SKILL GAPS</p>
            <p className="text-xs md:text-sm font-bold text-[#17233E]">{gaps}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-[#8A9CB7] uppercase tracking-widest mb-0.5">TIME TO READY</p>
            <p className="text-xs md:text-sm font-bold text-[#17233E]">{time}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-end gap-2 border-t sm:border-t-0 border-[#8A9CB7]/20 pt-4 sm:pt-0">
      <div className="text-left sm:text-right">
        <div className="flex items-baseline gap-1 sm:justify-end">
          <span className="text-2xl md:text-3xl font-black text-[#17233E]">{readiness}</span>
          <span className="text-xs font-bold text-[#8A9CB7] italic">Ready</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-tight mt-0.5 text-emerald-600">
          {subText}
        </p>
      </div>
    </div>
  </div>
);

const GapMetric = ({ label, status, color, width }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-xs md:text-sm font-bold text-[#17233E]">{label}</span>
      <span className={`text-[10px] font-black uppercase ${status === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`}>
        {status}
      </span>
    </div>
    <div className="h-2 w-full bg-[#17233E]/10 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width }}></div>
    </div>
  </div>
);

const PlanItem = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <p className="text-[9px] font-black text-[#8A9CB7] uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xs md:text-sm font-bold text-white leading-tight">{value}</p>
  </div>
);

const Bar = ({ height, label, active, forecast }) => (
  <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
    <div 
      className={`w-full rounded-xl transition-all duration-500 relative ${
        active ? 'bg-[#1988A3] shadow-md shadow-[#1988A3]/30' : 
        forecast ? 'bg-[#1988A3]/20 border-2 border-[#1988A3]/40 border-dashed' : 
        'bg-[#17233E]/30'
      }`} 
      style={{ height }}
    >
      {active && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-black text-[#17233E] bg-[#11C6DE] px-1.5 py-0.5 rounded shadow-xs">
          NOW
        </div>
      )}
    </div>
    <span className={`text-[10px] font-black uppercase ${active ? 'text-[#1988A3]' : 'text-[#8A9CB7]'}`}>{label}</span>
  </div>
);

/* --- SVG Icons --- */
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
