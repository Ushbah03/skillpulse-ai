import React, { useState } from 'react';
import { 
  Layers, 
  TrendingUp, 
  Download, 
  ChevronDown, 
  Sparkles, 
  Users, 
  Briefcase, 
  Shield, 
  FileText,
  Search,
  CheckCircle2,
  X,
  Building,
  BrainCircuit,
  ArrowUpRight
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_FORECAST_METRICS = [
  { id: 'm1', title: 'Readiness Forecast', val: '84%', trend: '+4.2%', badge: '3-6 Mos', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', note: 'AI Prediction Confidence', noteVal: 'High (92%)', barColor: 'bg-emerald-400' },
  { id: 'm2', title: 'Predicted Skill Gap', val: 'Medium', trend: 'Trending Better', trendColor: 'text-amber-400', badge: 'Attention', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30', note: 'Engineering & Data Science require 12-mo re-alignment.' },
  { id: 'm3', title: 'Attrition Risk Forecast', val: '14.8%', trend: '+2.1%', trendColor: 'text-rose-400', badge: 'Critical', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30', note: 'Spike expected in Q3 within middle management compensation tiers.' },
  { id: 'm4', title: 'Training Impact ROI', val: '+18%', trend: 'Readiness Inc.', trendColor: 'text-indigo-400', badge: 'High ROI', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', note: 'Based on active pathways & current participation rates.' }
];

const MOCK_GAP_DATA = [
  { month: 'Jan', current: 40, predicted: 65 },
  { month: 'Feb', current: 48, predicted: 75 },
  { month: 'Mar', current: 55, predicted: 88 },
  { month: 'Apr', current: 58, predicted: 90 },
  { month: 'May', current: 62, predicted: 95 },
  { month: 'Jun', current: 68, predicted: 92 }
];

const MOCK_ATTRITION_RISKS = [
  { id: 'a1', dept: 'Engineering', count: '24 employees at risk', pct: '18%', tag: 'High Risk', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { id: 'a2', dept: 'Sales & Revenue', count: '18 employees at risk', pct: '14%', tag: 'Medium Risk', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'a3', dept: 'Customer Support', count: '12 employees at risk', pct: '11%', tag: 'Medium Risk', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
];

const MOCK_RECOMMENDATIONS = [
  { id: 'rec-1', status: 'Critical Priority', match: '96% Match', statusColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30', title: 'Upskill Engineering Team', desc: 'Significant gap in Cloud Architecture skills predicted within 6 months. Initiate immediate learning path.', action: 'Create Training Plan' },
  { id: 'rec-2', status: 'High Priority', match: '88% Match', statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30', title: 'Leadership Succession', desc: 'Director of Product is at high flight risk. Prepare internal successor pipelines.', action: 'Start Succession Planning' },
  { id: 'rec-3', status: 'Medium Priority', match: '82% Match', statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', title: 'Increase Sales Training', desc: 'Enterprise expansion requires advanced negotiation skills. Current proficiency is below target.', action: 'Assign Learning Programs' },
  { id: 'rec-4', status: 'Strategic', match: '79% Match', statusColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', title: 'Hire AI Specialists', desc: 'Internal upskilling will not meet Q4 targets for generative AI deployment. External hiring needed.', action: 'Generate Forecast Report' }
];

const HRInsightsForecasting = ({
  currentTenant = "Enterprise Corp",
  forecastMetrics = MOCK_FORECAST_METRICS,
  gapForecastData = MOCK_GAP_DATA,
  attritionRisks = MOCK_ATTRITION_RISKS,
  strategicRecommendations = MOCK_RECOMMENDATIONS
}) => {
  // State Management
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Next 12 Months');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [activeModalAction, setActiveModalAction] = useState(null);

  // Trigger feedback toasts
  const triggerAction = (actionName) => {
    setToastMessage(`${actionName} initiated for ${currentTenant}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamically Filter Recommendations & Attrition Risks
  const filteredRecs = strategicRecommendations.filter(rec =>
    rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAttrition = attritionRisks.filter(risk =>
    risk.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    selectedDept === 'All Departments' || risk.dept.toLowerCase().includes(selectedDept.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FE] font-sans antialiased">
      {/* HRSidebar Navigation */}
      <HRSidebar currentTenant={currentTenant} currentScreen="HR Insights & Forecasting" />

      <main className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto space-y-8 relative">
        
        {/* TOAST NOTIFICATION LAYER */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-8 right-10 z-50 flex items-center gap-3 bg-[#0b1221] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800"
            >
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-sm font-bold tracking-tight">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- HEADER --- */}
        <header className="flex flex-wrap justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0b1221] tracking-tight flex items-center gap-3">
              HR Insights & Forecasting
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 tracking-normal">
                <Building size={14} className="text-slate-400" />
                {currentTenant}
              </span>
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">
              AI-powered workforce intelligence, predictive analytics, and skill readiness forecasting
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forecasts, skills..." 
                className="w-64 pl-11 pr-4 py-2.5 bg-[#f3f4f6]/60 rounded-xl text-xs font-semibold text-slate-700 outline-none border border-transparent focus:border-indigo-500/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] transition-all" 
              />
            </div>

            {/* Functional Department Selector */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-slate-700">
              <Layers size={15} className="text-slate-400 mr-2" />
              <select 
                value={selectedDept} 
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent outline-none cursor-pointer pr-4 appearance-none"
              >
                <option value="All Departments">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales & Revenue">Sales & Revenue</option>
                <option value="Customer Support">Customer Support</option>
              </select>
              <ChevronDown size={14} className="text-slate-400 pointer-events-none absolute right-2" />
            </div>

            {/* Functional Timeframe Selector */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-slate-700">
              <TrendingUp size={15} className="text-slate-400 mr-2" />
              <select 
                value={selectedTimeframe} 
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-transparent outline-none cursor-pointer pr-4 appearance-none"
              >
                <option value="Next 3 Months">Next 3 Months</option>
                <option value="Next 6 Months">Next 6 Months</option>
                <option value="Next 12 Months">Next 12 Months</option>
              </select>
              <ChevronDown size={14} className="text-slate-400 pointer-events-none absolute right-2" />
            </div>

            <button 
              onClick={() => triggerAction("Report Export")}
              className="text-xs font-black bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2 shadow-sm active:scale-95"
            >
              <Download size={15} /> Export Insight Report
            </button>
          </div>
        </header>

        {/* --- SECTION 1: TOP FORECAST METRIC CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {forecastMetrics.map((card) => (
            <div key={card.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{card.title}</span>
                  {card.badge && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mt-3">
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{card.val}</p>
                  <span className={`text-xs font-black ${card.trendColor || 'text-emerald-500'}`}>{card.trend}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-50">
                {card.barColor ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">{card.note}</span>
                      <span className="text-slate-700 font-bold">{card.noteVal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${card.barColor} rounded-full`} 
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11.5px] text-slate-400 font-medium leading-relaxed">{card.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- SECTION 2: DUAL-BAR SKILL GAP FORECAST CHART --- */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Future Skill Gap Forecast</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Current capabilities vs. predicted requirements over {selectedTimeframe.toLowerCase()}</p>
            </div>
            <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-indigo-300" /> Current Capability</span>
              <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-indigo-600" /> Predicted Requirement</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between border-b border-slate-100 pb-2 px-6">
            {gapForecastData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 group max-w-[120px]">
                <div className="w-full flex items-end justify-center gap-2 h-48">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.current}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="w-5 bg-indigo-300 rounded-t-md shadow-sm transition-colors group-hover:bg-indigo-400" 
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.predicted}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 + 0.1 }}
                    className="w-5 bg-indigo-600 rounded-t-md shadow-sm transition-colors group-hover:bg-indigo-700" 
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 mt-3">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 3: ATTRITION & AI STRATEGIC RECOMMENDATIONS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ATTRITION RISKS PANEL */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
            <div>
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">High Attrition Risk</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">Live Forecast</span>
              </div>
              <div className="divide-y divide-slate-50">
                {filteredAttrition.length > 0 ? (
                  filteredAttrition.map((risk) => (
                    <div key={risk.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => triggerAction(`${risk.dept} Attrition Details`)}>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800">{risk.dept}</h4>
                        <p className="text-xs text-slate-400 font-semibold">{risk.count}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-sm font-black text-slate-900 block">{risk.pct}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-black border uppercase tracking-wider ${risk.color}`}>
                          {risk.tag}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs font-semibold text-slate-400">No matching attrition records found.</div>
                )}
              </div>
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
              <button 
                onClick={() => triggerAction("Detailed Risk Analysis View")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-1 w-full"
              >
                View Detailed Risk Analysis <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* AI STRATEGIC RECOMMENDATIONS CARD PANEL */}
          <div className="lg:col-span-8 bg-[#0b1221] rounded-2xl p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none rounded-full" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-100">AI Strategic Recommendations</h3>
                <p className="text-xs text-slate-400 font-semibold">Automated interventions derived from predictive workforce models</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {filteredRecs.length > 0 ? (
                filteredRecs.map((rec) => (
                  <div key={rec.id} className="bg-[#121c33] border border-slate-800/80 hover:border-indigo-500/40 rounded-xl p-5 flex flex-col justify-between transition-all group">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[9px] px-2 py-0.5 rounded border font-black uppercase tracking-wider ${rec.statusColor}`}>
                          {rec.status}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{rec.match}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-indigo-300 transition-colors">{rec.title}</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">{rec.desc}</p>
                    </div>
                    <button 
                      onClick={() => setActiveModalAction(rec)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors pt-2 border-t border-slate-800/50"
                    >
                      {rec.action} <ArrowUpRight size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-xs font-semibold text-slate-400 py-8">No matching recommendations found for "{searchQuery}".</div>
              )}
            </div>
          </div>

        </div>

        {/* --- SECTION 4: WORKFORCE CAPACITY AREA CHART --- */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Workforce Capacity Forecast</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Projected staffing capacity vs. business growth trajectory</p>
            </div>
            <div className="flex items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-indigo-500" /> Projected Capacity</span>
              <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-slate-300" /> Required Capacity</span>
            </div>
          </div>
          
          <div className="h-40 relative w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="capacityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 40 Q 200 35 400 55 T 800 60 L 800 100 L 0 100 Z" fill="url(#capacityGrad)" />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                d="M 0 40 Q 200 35 400 55 T 800 60" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3" 
              />
              <path d="M 0 55 Q 200 60 400 68 T 800 85" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
            </svg>
            <div className="flex justify-between text-xs font-bold text-slate-400 mt-2 border-t border-slate-50 pt-3">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span><span>Q1 Next Yr</span>
            </div>
          </div>
        </div>

        {/* --- SECTION 5: STRATEGIC ACTION BUTTONS GRID --- */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase">Strategic Workforce Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
              onClick={() => triggerAction("Create Training Plan")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-6 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 border border-indigo-500"
            >
              <Users size={24} className="text-indigo-100" /> 
              <span className="text-sm tracking-tight font-black">Create Training Plan</span>
            </button>
            
            <button 
              onClick={() => triggerAction("Assign Learning Programs")}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold py-5 px-6 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm transition-all active:scale-95"
            >
              <Briefcase size={24} className="text-slate-400" /> 
              <span className="text-sm tracking-tight font-black">Assign Learning Programs</span>
            </button>
            
            <button 
              onClick={() => triggerAction("Start Succession Planning")}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold py-5 px-6 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm transition-all active:scale-95"
            >
              <Shield size={24} className="text-slate-400" /> 
              <span className="text-sm tracking-tight font-black">Start Succession Planning</span>
            </button>
            
            <button 
              onClick={() => triggerAction("Generate Forecast Report")}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold py-5 px-6 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm transition-all active:scale-95"
            >
              <FileText size={24} className="text-slate-400" /> 
              <span className="text-sm tracking-tight font-black">Generate Forecast Report</span>
            </button>
          </div>
        </div>

      </main>

      {/* MODAL DIALOG PORTAL CONTEXT */}
      <AnimatePresence>
        {activeModalAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveModalAction(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">{activeModalAction.title}</h2>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                {activeModalAction.desc}
              </p>
              <div className="space-y-3 mb-8">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-xs">
                  <span className="font-bold text-slate-500">AI Confidence Match</span>
                  <span className="font-black text-indigo-600">{activeModalAction.match}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-xs">
                  <span className="font-bold text-slate-500">Priority Tier</span>
                  <span className="font-black text-slate-900">{activeModalAction.status}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  triggerAction(activeModalAction.action);
                  setActiveModalAction(null);
                }}
                className="w-full py-3.5 bg-[#0b1221] hover:bg-[#16233d] text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-slate-900/10"
              >
                Confirm & Initiate Workflow
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HRInsightsForecasting;