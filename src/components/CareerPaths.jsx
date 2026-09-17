import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import { Loader2, Sparkles, Navigation } from 'lucide-react';

const CareerPaths = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPathId, setSelectedPathId] = useState('path-1');

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const workspaceName = storedUser.tenant?.name || 'Apex Tech Solutions Workspace';

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
    return (
      <div className="p-8 bg-[#F8F9FE] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-indigo-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Loading Career Pathway Intelligence...</span>
        </div>
      </div>
    );
  }

  const profile = data?.userProfile || {};
  const currentTitle = profile.jobTitle || storedUser.jobTitle || 'Software Specialist';
  const targetReadiness = data?.targetReadiness ?? 75;
  const roadmapSteps = data?.roadmap || [];
  const recommendedPaths = data?.recommendedPaths || [];
  const monthlyProgress = data?.monthlyProgress || [];
  const gaps = data?.gaps || [];
  const acceleration = data?.accelerationPlan || {};

  const activeSelectedPath = recommendedPaths.find(p => p.id === selectedPathId) || recommendedPaths[0] || {};
  const heroTargetRole = activeSelectedPath.title || data?.primaryTargetRole || 'Lead Architect';
  const heroReadiness = activeSelectedPath.readiness || `${targetReadiness}%`;

  return (
    <div className="p-4 md:p-8 bg-[#F8F9FE] min-h-screen font-sans text-slate-900">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100 mb-2 inline-block">
            {workspaceName}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Career Path Suggestions</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Career progression pathways calculated live from your verified skill inventory & department benchmarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm shrink-0">
            {storedUser.firstName?.charAt(0) || 'E'}{storedUser.lastName?.charAt(0) || 'Z'}
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden mb-10 shadow-xl shadow-indigo-100">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold mb-6 inline-block">
            Current Role: {currentTitle}
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-[1.15]">
            You are <span className="text-blue-200">{heroReadiness}</span> ready for a {heroTargetRole} role.
          </h2>
          <p className="text-blue-100 text-sm md:text-lg leading-relaxed mb-8 opacity-90">
            {gaps.length > 0 
              ? `Based on your verified skills in ${profile.department || 'Engineering'}, you have high potential for ${heroTargetRole} tracks. Bridging your ${gaps.length} remaining skill gaps will unlock this position.`
              : `Your verified skill inventory meets 100% of benchmark criteria for advanced ${heroTargetRole} tracks. You are eligible for immediate career promotion review.`
            }
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/dashboard/learning')}
              className="px-7 py-3.5 bg-white text-blue-600 rounded-2xl font-black text-sm md:text-base shadow-lg hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2"
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
              <circle cx="120" cy="120" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/15" />
              <circle cx="120" cy="120" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray="628" strokeDashoffset={628 - (628 * (parseInt(heroReadiness) / 100))} className="text-white" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black">{heroReadiness}</span>
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
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Recommended Paths & Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6 px-1">
              <h3 className="text-xl font-bold">Top Recommended Paths</h3>
              <span className="text-xs font-semibold text-slate-400">Click path to view active alignment</span>
            </div>
            
            <div className="space-y-4">
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
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Projected Readiness Progress</h4>
                <p className="text-slate-400 text-xs mt-0.5">Forecasted growth based on your active learning path</p>
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
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Gap Analysis */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold text-slate-900">Active Gap Alignment</h4>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {gaps.length} Gaps
              </span>
            </div>
            
            {gaps.length > 0 ? (
              <div className="space-y-5">
                {gaps.map((g) => {
                  const current = g.currentLevel || 1.0;
                  const required = g.requiredLevel || 4.5;
                  const pct = `${Math.min(100, Math.round((current / required) * 100))}%`;
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
              <div className="text-center py-6 bg-slate-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-emerald-600">✓ 100% Skills Aligned</p>
                <p className="text-[11px] text-slate-400 mt-1">No active skill gaps found in your DB profile.</p>
              </div>
            )}
          </div>

          {/* AI Acceleration Plan */}
          <div className="bg-[#1E0B4B] p-6 md:p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Sparkles className="w-5 h-5 text-purple-300" />
              <h4 className="text-lg font-bold">Target Acceleration Plan</h4>
            </div>
            
            <div className="space-y-3.5 mb-6">
              <PlanItem label="RECOMMENDED COURSE" value={acceleration.recommendedCourse || 'Advanced Skill Acceleration'} />
              <PlanItem label="TARGET CERTIFICATION" value={acceleration.targetCertification || 'Enterprise Certified Professional'} />
              
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/10 mt-4">
                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Readiness Increase</p>
                <h5 className="text-2xl md:text-3xl font-black text-emerald-400">{acceleration.estimatedIncrease || '+15% in 30 Days'}</h5>
              </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard/learning')}
              className="w-full py-3.5 bg-white text-[#1E0B4B] rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95"
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

const RecommendationCard = ({ title, dept, gaps, time, readiness, subText, aiPick, isSelected, onSelect }) => (
  <div 
    onClick={onSelect}
    className={`bg-white p-6 md:p-8 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group ${
      isSelected ? 'border-2 border-indigo-600 shadow-md ring-2 ring-indigo-100' : 'border-slate-100 hover:border-slate-300 shadow-sm'
    }`}
  >
    <div className="flex gap-5 items-center">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
      }`}>
        <IconPath className="w-6 h-6" />
      </div>
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h4 className="text-lg md:text-xl font-bold text-slate-900">{title}</h4>
          {aiPick && (
            <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              PRIMARY
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
        <p className="text-[10px] font-black uppercase tracking-tight mt-0.5 text-emerald-500">
          {subText}
        </p>
      </div>
    </div>
  </div>
);

const GapMetric = ({ label, status, color, width }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-xs md:text-sm font-bold text-slate-700">{label}</span>
      <span className={`text-[10px] font-black uppercase ${status === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`}>
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