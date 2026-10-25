import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { 
  ShieldCheck, Cpu, Activity, Zap, ArrowRight, Layers, Lock, Sparkles, 
  CheckCircle2, Play, RefreshCw, BarChart2, Radio, Compass, Orbit
} from 'lucide-react';
import SkillPulseLoader from './SkillPulseLoader';

import hrPreview from '../assets/images/hr_dashboard_preview.png';
import adminPreview from '../assets/images/company_admin_preview.png';
import employeePreview from '../assets/images/employee_dashboard_preview.png';
import teamLeaderPreview from '../assets/images/team_leader_preview.png';

const FeaturePage = () => {
  const { tenantId } = useParams(); 
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [activeCategory, setActiveCategory] = useState('engineering');
  const [hoveredNode, setHoveredNode] = useState(null);

  const tenant = {
    name: "SkillPulse-AI",
    tier: "Enterprise",
    readinessScore: 82,
    enabledDashboards: ['Employee', 'Team Leader', 'HR Analytics', 'Admin Control Center']
  };

  const allDashboards = [
    { id: 'Employee', t: "Employee Dashboard", s: "Focus: Personal Growth", path: `/dashboard`, img: employeePreview },
    { id: 'Team Leader', t: "Team Leader Dashboard", s: "Focus: Team Performance", path: `/team-leader`, img: teamLeaderPreview },
    { id: 'HR Analytics', t: "HR Analytics Dashboard", s: "Focus: Org-wide Metrics", path: `/hr-dashboard`, img: hrPreview },
    { id: 'Admin Control Center', t: "Admin Control Center", s: "Focus: Security & Settings", path: `/company-admin`, img: adminPreview }
  ];

  const availableDashboards = allDashboards.filter(d => tenant.enabledDashboards.includes(d.id));

  // Category datasets for interactive assessment simulator
  const assessmentData = {
    engineering: [
      { label: "Cloud & Distributed Systems", val: 94, tag: "GenAI Optimized", color: "from-[#1988A3] to-[#11C6DE]" },
      { label: "Neural Model Fine-Tuning", val: 88, tag: "LLM Pipeline", color: "from-[#17233E] to-[#1988A3]" },
      { label: "DevOps & Zero-Trust Security", val: 91, tag: "SOC2 Aligned", color: "from-[#5A6D89] to-[#8A9CB7]" }
    ],
    leadership: [
      { label: "Sprint Resourcing & Velocity", val: 92, tag: "Agile Model", color: "from-[#1988A3] to-[#11C6DE]" },
      { label: "Engineering Mentorship & Growth", val: 86, tag: "Talent Index", color: "from-[#17233E] to-[#1988A3]" },
      { label: "Cross-Functional Alignment", val: 89, tag: "Org Synergy", color: "from-[#5A6D89] to-[#8A9CB7]" }
    ],
    data: [
      { label: "PostgreSQL Multi-Tenant Sharding", val: 96, tag: "RLS Synced", color: "from-[#1988A3] to-[#11C6DE]" },
      { label: "Vector Embeddings & Semantic Search", val: 90, tag: "pgvector", color: "from-[#17233E] to-[#1988A3]" },
      { label: "Real-time Telemetry Ingestion", val: 85, tag: "Kafka / Redis", color: "from-[#5A6D89] to-[#8A9CB7]" }
    ]
  };

  const radarNodes = [
    { id: 1, name: "GenAI & LLM", score: "96%", x: 140, y: 35, category: "Core AI" },
    { id: 2, name: "Cloud Architecture", score: "91%", x: 225, y: 95, category: "Systems" },
    { id: 3, name: "Team Leadership", score: "84%", x: 205, y: 195, category: "People" },
    { id: 4, name: "CI/CD & DevOps", score: "89%", x: 80, y: 205, category: "Ops" },
    { id: 5, name: "Data Engineering", score: "93%", x: 50, y: 105, category: "Data" }
  ];

  const handleSimulateCalibration = () => {
    setIsLoadingDemo(true);
    setTimeout(() => {
      setIsLoadingDemo(false);
    }, 2600);
  };

  return (
    <div className="bg-[#E9EAF7] font-sans text-[#17233E] overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative min-h-screen">
      
      {/* Live Loading Animation Modal */}
      <AnimatePresence>
        {isLoadingDemo && (
          <SkillPulseLoader 
            message="Calibrating Neural Skill Taxonomy..." 
            fullScreen={true} 
          />
        )}
      </AnimatePresence>

      {/* Ambient Gradient Depth with Pulsing Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#1988A3]/22 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-[#11C6DE]/18 blur-[150px] rounded-full" />
        <div className="absolute top-2/3 -left-20 w-[650px] h-[650px] bg-[#1B3154]/18 blur-[160px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-[#8A9CB7]/30 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.12)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      {/* 1. HERO HEADER WITH MOTION GRAPHIC PILLS */}
      <section className="relative pt-16 sm:pt-20 pb-16 px-6 text-center overflow-hidden z-10">
        
        {/* Floating Ambient Micro-Pills */}
        <div className="hidden lg:block absolute left-8 top-28 animate-float-slow pointer-events-none">
          <div className="glass-pill px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs font-mono font-bold text-[#17233E]">
            <span className="w-2 h-2 rounded-full bg-[#11C6DE] animate-ping" />
            <span>AI Taxonomy v4.2 Live</span>
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-36 animate-float-reverse pointer-events-none">
          <div className="glass-pill px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs font-mono font-bold text-[#17233E]">
            <Radio className="w-3.5 h-3.5 text-[#1988A3] animate-pulse" />
            <span>Telemetry: 98.4% Precision</span>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1988A3]/10 border border-[#1988A3]/25 px-3 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 bg-[#1988A3] rounded-full animate-ping"></span>
            <span className="text-[#1988A3] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">
              {tenant.name} Enterprise Capabilities
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-5 tracking-tight leading-tight text-[#17233E]">
            Powerful Features Built for <br />
            <span className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] bg-clip-text text-transparent">
              Workforce Intelligence
            </span>
          </h1>

          <p className="text-[#5A6D89] text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-6 sm:mb-8">
            Explore the AI-driven tools that power skill growth, predictive gap resolution, and enterprise workforce readiness across your entire organization.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Link 
              to="/contact" 
              className="bg-[#1988A3] hover:bg-[#157289] text-white px-7 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all shadow-lg shadow-[#1988A3]/30 hover:shadow-[#1988A3]/50 inline-flex items-center justify-center gap-2 group text-center"
            >
              Request Live Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Interactive Loading Animation Simulator Trigger */}
            <button
              onClick={handleSimulateCalibration}
              className="glass-panel px-6 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base text-[#17233E] hover:border-[#1988A3]/60 transition-all inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer text-center"
              title="Click to see the high-tech SkillPulse AI Loading Animation"
            >
              <RefreshCw className="w-4 h-4 text-[#1988A3] animate-spin" style={{ animationDuration: '3s' }} />
              Simulate AI Calibration
            </button>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SKILL ASSESSMENT ENGINE */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-14">
          
          {/* Assessment Motion Graphic Card */}
          <div className="relative glass-panel rounded-[2.5rem] p-6 sm:p-10 text-left overflow-hidden">
            
            {/* Shimmer light effect across the card */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-sweep" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233E] text-white text-[10px] font-mono font-bold uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE] animate-ping" />
                Prisma Engine Synced
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#1988A3]">
                Live Adaptive Scoring
              </span>
            </div>

            {/* Interactive Category Selector Tabs */}
            <div className="flex gap-1.5 sm:gap-2 p-1.5 bg-[#E9EAF7] rounded-2xl mb-5 sm:mb-6 border border-[#8A9CB7]/30">
              {[
                { id: 'engineering', label: 'Engineering' },
                { id: 'leadership', label: 'Leadership' },
                { id: 'data', label: 'Data & Cloud' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-[#17233E] text-white shadow-md'
                      : 'text-[#5A6D89] hover:text-[#17233E]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Animated Dynamic Progress Bars with Particle Tips */}
            <div className="bg-white/60 rounded-2xl p-4 sm:p-6 border border-white/80 shadow-inner space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-[#8A9CB7]/20 pb-3">
                <h4 className="font-extrabold text-[#17233E] text-sm sm:text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1988A3]" />
                  <span>Real-Time Capability Matrix</span>
                </h4>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-[#5A6D89]">
                  Quarterly Snapshot
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-5"
                >
                  {assessmentData[activeCategory].map((s, i) => (
                    <div key={i} className="group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold mb-1.5 font-mono">
                        <span className="text-[#17233E] text-xs font-bold leading-tight">{s.label}</span>
                        <div className="flex items-center justify-between sm:justify-end gap-2">
                          <span className="text-[10px] text-[#5A6D89] font-normal lowercase bg-white/70 px-2 py-0.5 rounded-md border border-[#8A9CB7]/30">
                            {s.tag}
                          </span>
                          <span className="text-[#1988A3] font-bold text-xs">{s.val}%</span>
                        </div>
                      </div>

                      {/* Animated Glowing Progress Bar */}
                      <div className="w-full h-2.5 sm:h-3 bg-[#E9EAF7] rounded-full overflow-hidden p-0.5 shadow-inner relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${s.val}%` }}
                          transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                          className={`h-full bg-gradient-to-r ${s.color} rounded-full relative shadow-sm`}
                        >
                          {/* Pulsing leading light tip */}
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full opacity-80 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Engine Content */}
          <div className="text-left">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              ASSESSMENT FRAMEWORK
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 text-[#17233E] leading-tight">
              Skill Assessment Engine
            </h2>
            <p className="text-[#5A6D89] text-base md:text-lg font-normal mb-8 leading-relaxed">
              Empower employees with structured, intuitive evaluations capturing actionable skill proficiencies mapped to benchmark industry standards.
            </p>
            <div className="space-y-4">
              {[
                { t: "Role-based assessments", d: "Content specifically tailored to over 500+ standard enterprise roles." },
                { t: "Real-time scoring", d: "Instant feedback loops that deliver granular capability metrics." },
                { t: "Predictive tracking", d: "Historical velocity snapshots tracking organizational evolution." }
              ].map((item, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#1988A3]/15 border border-[#1988A3]/30 text-[#1988A3] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-[#5A6D89] text-sm leading-relaxed">
                    <span className="font-bold text-[#17233E]">{item.t}:</span> {item.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI SKILL GAP DETECTION WITH ROTATING RADAR SWEEP MOTION GRAPHIC */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-14">
          
          <div className="order-2 md:order-1 text-left">
            <span className="px-3.5 py-1.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              PREDICTIVE ANALYSIS
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 text-[#17233E]">
              AI Skill Gap Detection
            </h2>
            <p className="text-[#5A6D89] text-base md:text-lg mb-8 font-normal leading-relaxed">
              Our neural engine cross-evaluates talent profiles against organizational objectives to detect, isolate, and forecast skill deficiencies before they impact delivery.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { title: 'Gap Visualization', desc: 'Interactive vector mapping & proficiency clustering.' },
                { title: 'Priority Ranking', desc: 'Urgency-weighted skill queues for L&D budgets.' },
                { title: 'Risk Indicator', desc: 'Predictive bottleneck signals for sprint roadmaps.' },
                { title: 'Department Insights', desc: 'Cross-functional benchmarks across isolated teams.' }
              ].map((f, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="p-4 sm:p-5 glass-panel rounded-2xl hover:border-[#1988A3]/50 transition-all cursor-pointer group"
                >
                  <h4 className="font-bold text-[#17233E] text-sm mb-1 flex items-center justify-between">
                    <span>{f.title}</span>
                    <Zap className="w-3.5 h-3.5 text-[#1988A3] group-hover:scale-125 transition-transform" />
                  </h4>
                  <p className="text-xs text-[#5A6D89] font-normal leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* MOTION GRAPHIC: Rotating Radar & Neural Skill Vector */}
          <div className="order-1 md:order-2 glass-panel rounded-[2.5rem] p-6 sm:p-10 flex flex-col items-center relative overflow-hidden">
            
            {/* Header info */}
            <div className="w-full flex items-center justify-between mb-4">
              <h4 className="text-base font-extrabold text-[#17233E] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#1988A3]" />
                <span>Neural Skill Vector Radar</span>
              </h4>
              <span className="text-[10px] font-mono font-bold text-[#1988A3] bg-[#1988A3]/10 px-2.5 py-1 rounded-full border border-[#1988A3]/20">
                Live Sweep
              </span>
            </div>

            {/* Radar Visual Display Container */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-[#8A9CB7]/30 flex items-center justify-center bg-white/40 shadow-inner overflow-hidden my-4">
              
              {/* Concentric Radar Distance Rings */}
              <div className="absolute inset-8 rounded-full border border-[#8A9CB7]/25" />
              <div className="absolute inset-16 rounded-full border border-[#8A9CB7]/20" />
              <div className="absolute inset-24 rounded-full border border-[#8A9CB7]/15" />
              
              {/* Crosshair Coordinate Lines */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-[#8A9CB7]/25" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-[#8A9CB7]/25" />

              {/* ROTATING RADAR SWEEPER BEAM */}
              <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none bg-[conic-gradient(from_0deg_at_50%_50%,rgba(25,136,163,0)_0deg,rgba(25,136,163,0)_280deg,rgba(17,198,222,0.40)_360deg)]" />

              {/* Pulsing Neural Skill Polygon */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 280">
                <motion.polygon
                  animate={{
                    points: [
                      "140,55 210,100 190,195 90,205 65,115",
                      "140,48 215,95 195,200 85,200 60,110",
                      "140,55 210,100 190,195 90,205 65,115"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  fill="rgba(25, 136, 163, 0.25)"
                  stroke="#11C6DE"
                  strokeWidth="2.5"
                  className="filter drop-shadow-[0_0_8px_rgba(17,198,222,0.6)]"
                />
              </svg>

              {/* Interactive Radar Blips / Data Nodes */}
              {radarNodes.map((node) => (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node z-20"
                >
                  <div className="relative">
                    <span className="absolute -inset-1 rounded-full bg-[#11C6DE] opacity-75 animate-ping" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1988A3] border-2 border-white shadow-[0_0_10px_#11C6DE] group-hover/node:scale-125 transition-transform" />
                  </div>
                </div>
              ))}

              {/* Node Tooltip Display */}
              <div className="absolute bottom-2 inset-x-4 pointer-events-none text-center">
                <span className="text-[10px] font-mono font-bold text-[#17233E] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/80 shadow-sm">
                  {hoveredNode ? `${hoveredNode.name}: ${hoveredNode.score}` : "Hover nodes for skill telemetry"}
                </span>
              </div>
            </div>

            {/* Floating Orbiting Status Pill */}
            <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-[#5A6D89] mt-2 px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1988A3]" /> Vector Gap: -8% (Optimal)
              </span>
              <span className="text-[#1988A3]">
                Row-Level Partitioned
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFORCE READINESS SCORE WITH LIVE EQUALIZER TELEMETRY */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-14">
          
          {/* Circular Score Meter Card */}
          <div className="flex flex-col items-center justify-center glass-panel rounded-[2.5rem] py-14 px-8 text-center relative overflow-hidden group">
            
            {/* Ambient Backlight Aura */}
            <div className="absolute w-48 h-48 bg-[#1988A3]/20 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(25,136,163,0.3)]" viewBox="0 0 176 176">
                <circle 
                  cx="88" 
                  cy="88" 
                  r="74" 
                  stroke="currentColor" 
                  strokeWidth="14" 
                  fill="transparent" 
                  className="text-[#8A9CB7]/25" 
                />
                <circle 
                  cx="88" 
                  cy="88" 
                  r="74" 
                  stroke="currentColor" 
                  strokeWidth="14" 
                  fill="transparent" 
                  strokeDasharray="465" 
                  strokeDashoffset={465 * (1 - (tenant.readinessScore / 100))} 
                  strokeLinecap="round"
                  className="text-[#1988A3] transition-all duration-1000 ease-out" 
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
                <span className="text-5xl font-black text-[#17233E] tracking-tight leading-none mb-1">
                  {tenant.readinessScore}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#5A6D89] uppercase tracking-wider">
                  SCORE / 100
                </span>
              </div>
            </div>

            {/* Live Equalizer Waveform & Telemetry Status */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex items-center gap-1 h-5">
                <div className="w-1 bg-[#1988A3] rounded-full equalizer-bar-1" />
                <div className="w-1 bg-[#11C6DE] rounded-full equalizer-bar-2" />
                <div className="w-1 bg-[#17233E] rounded-full equalizer-bar-3" />
                <div className="w-1 bg-[#1988A3] rounded-full equalizer-bar-4" />
              </div>
              <p className="font-mono font-bold text-[#1988A3] uppercase tracking-widest text-xs">
                Live Enterprise Readiness
              </p>
            </div>
          </div>
          
          {/* Pillars List */}
          <div className="text-left">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              UNIFIED INDEX
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 text-[#17233E]">
              Workforce Readiness Score
            </h2>
            <p className="text-[#5A6D89] text-base md:text-lg mb-8 font-normal leading-relaxed">
              A single, unified metric that quantifies how ready your team is for upcoming business goals, powered by four key pillars:
            </p>
            <div className="space-y-3">
              {['Skill Proficiency', 'Learning Progress', 'Career Alignment', 'Project Suitability'].map((pillar, idx) => (
                <motion.div 
                  key={pillar}
                  whileHover={{ x: 4 }}
                  className="p-4 glass-panel rounded-2xl flex justify-between items-center transition-all"
                >
                  <span className="font-bold text-[#17233E] text-sm">{pillar}</span>
                  <span className="text-[#1988A3] font-bold text-xs uppercase font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1988A3] animate-pulse" /> Synced
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ROLE-BASED DASHBOARDS */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl text-center mb-12">
          <span className="px-3.5 py-1.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            ROLE GOVERNANCE
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#17233E] mb-3">
            Role-Based Dashboards
          </h2>
          <p className="text-[#5A6D89] text-base md:text-lg max-w-2xl mx-auto font-normal">
            Specific interfaces tailored for every stakeholder in your organization.
          </p>
        </div>
        <div className="container mx-auto max-w-7xl grid md:grid-cols-4 gap-6">
          {availableDashboards.map((d, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <Link 
                to={d.path} 
                className="block group cursor-pointer glass-panel p-5 rounded-3xl hover:border-[#1988A3]/50 transition-all duration-300 text-left"
              >
                <div className="aspect-video bg-[#E9EAF7]/80 rounded-2xl mb-4 overflow-hidden border border-[#8A9CB7]/20 group-hover:border-[#1988A3]/40 transition-all relative flex items-center justify-center">
                  {d.img ? (
                    <img 
                      src={d.img} 
                      alt={d.t} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="p-3 text-center">
                      <span className="text-xs font-mono font-bold text-[#17233E]">{d.id} UI</span>
                    </div>
                  )}
                </div>
                <h4 className="font-extrabold text-[#17233E] mb-1 pl-1 transition-colors group-hover:text-[#1988A3] text-base">
                  {d.t}
                </h4>
                <p className="text-[10px] font-mono font-bold text-[#5A6D89] uppercase tracking-widest pl-1">
                  {d.s}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. ENTERPRISE SECURITY */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14 text-left">
          <div className="w-full md:w-1/3 aspect-square glass-panel rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#1988A3]/10 blur-2xl group-hover:bg-[#1988A3]/20 transition-all" />
            <Lock className="w-24 h-24 text-[#1988A3] group-hover:scale-110 transition-transform duration-300 relative z-10" />
          </div>
          <div className="flex-1">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              COMPLIANCE & ISOLATION
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#17233E] mb-8">
              Enterprise & Tenant Security
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { t: "Isolated Tenant Data", d: "Logical row-level security across all organization accounts." },
                { t: "GDPR & SOC2 Compliant", d: "Strict data privacy standards across global deployments." },
                { t: "Custom SSO & SAML", d: "Tenant-specific identity integration (Okta, Azure AD, OAuth)." },
                { t: "256-bit Encryption", d: "Data fully encrypted in transit and isolated at rest." }
              ].map((s, i) => (
                <div key={i}>
                  <h4 className="font-bold text-[#17233E] mb-1 border-l-2 border-[#1988A3] pl-3 text-sm">{s.t}</h4>
                  <p className="text-[#5A6D89] text-xs leading-relaxed font-normal">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL EXECUTIVE CTA */}
      <section className="py-16 px-4 md:px-8 relative z-10 mb-8">
        <div className="max-w-5xl mx-auto rounded-[3rem] py-16 px-8 text-center glass-hero-dark text-white relative overflow-hidden">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight relative z-10">
            Ready to Transform <br /> Workforce Skills?
          </h2>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link 
              to="/signup" 
              className="bg-white text-[#17233E] hover:bg-[#E9EAF7] px-9 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all shadow-xl inline-flex items-center gap-2 group"
            >
              Start Free Trial <ArrowRight className="w-4 h-4 text-[#1988A3] group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/contact" 
              className="bg-white/10 border border-white/25 text-white hover:bg-white/20 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all inline-block backdrop-blur-md"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturePage;