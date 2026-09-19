import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheck, Cpu, Activity, Zap, ArrowRight, Layers, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

import hrPreview from '../assets/images/hr_dashboard_preview.png';
import adminPreview from '../assets/images/company_admin_preview.png';
import employeePreview from '../assets/images/employee_dashboard_preview.png';
import teamLeaderPreview from '../assets/images/team_leader_preview.png';

const FeaturePage = () => {
  const { tenantId } = useParams(); 

  const tenant = {
    name: "SkillPulse-AI",
    tier: "Enterprise",
    readinessScore: 82,
    enabledDashboards: ['Employee', 'Team Leader', 'HR Analytics', 'Admin Control Center']
  };

  const mainGradient = "bg-[linear-gradient(135deg,#0F172B_0%,#1E293B_50%,#312E81_100%)]";

  // Animation Variant definitions
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const card3DVariant = {
    hidden: { opacity: 0, y: 40, rotateX: 12 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      transition: { type: "spring", stiffness: 80, damping: 15 } 
    }
  };

  // Multi-Tenant Role-Based Dashboard Configuration
  const allDashboards = [
    { id: 'Employee', t: "Employee Dashboard", s: "Focus: Personal Growth", path: `/dashboard`, img: employeePreview, color: "from-indigo-500/20 to-purple-500/20" },
    { id: 'Team Leader', t: "Team Leader Dashboard", s: "Focus: Team Performance", path: `/team-leader`, img: teamLeaderPreview, color: "from-blue-500/20 to-indigo-500/20" },
    { id: 'HR Analytics', t: "HR Analytics Dashboard", s: "Focus: Org-wide Metrics", path: `/hr-dashboard`, img: hrPreview, color: "from-emerald-500/20 to-teal-500/20" },
    { id: 'Admin Control Center', t: "Admin Control Center", s: "Focus: Security & Settings", path: `/company-admin`, img: adminPreview, color: "from-amber-500/20 to-indigo-500/20" }
  ];

  const availableDashboards = allDashboards.filter(d => tenant.enabledDashboards.includes(d.id));

  return (
    <div className="bg-[#0B1120] font-sans text-slate-100 overflow-x-hidden selection:bg-indigo-600 selection:text-white relative min-h-screen">
      {/* Keyframe Animations */}
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
        @keyframes float-reverse { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(18px) rotate(-3deg); } }
        @keyframes aurora { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -30px) scale(1.1); } }
        @keyframes shimmer-beam { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .animate-float-1 { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 10s ease-in-out infinite; }
        .animate-aurora { animation: aurora 14s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer-beam 3s infinite linear; }
      `}</style>
      
      {/* Global Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 blur-[160px] rounded-full animate-aurora" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-purple-600/15 blur-[150px] rounded-full animate-float-1" />
        <div className="absolute bottom-1/4 right-10 w-[650px] h-[650px] bg-indigo-900/20 blur-[180px] rounded-full animate-float-2" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* 1. ELEGANT FULL-WIDTH HERO HEADER */}
      <section className="relative text-white pt-20 pb-20 px-6 text-center overflow-hidden z-10">
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
            <span className="text-indigo-300 text-[11px] font-bold uppercase tracking-widest font-mono">
              {tenant.name} Enterprise Capabilities
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight leading-tight text-white"
          >
            Powerful Features Built for <br />
            <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Workforce Intelligence
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10 opacity-90"
          >
            Explore the AI-driven tools that power skill growth, performance tracking, and career development across your entire enterprise organization.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/contact" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2">
                Request Live Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/pricing" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all backdrop-blur-sm shadow-md inline-block">
                View Pricing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. SKILL ASSESSMENT ENGINE */}
      <section className="py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative bg-[#0F172B]/90 rounded-[2.5rem] p-10 border border-slate-800/80 shadow-2xl backdrop-blur-xl group hover:border-indigo-500/40 transition-all"
          >
            <div className="absolute top-4 right-4 bg-indigo-600/90 text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase z-10 shadow-md">
              Prisma DB Synced
            </div>
            <div className="bg-[#1E293B]/70 rounded-2xl p-8 shadow-xl border border-slate-700/60 transition-all duration-500 group-hover:scale-[1.01]">
              <h4 className="text-xl font-bold mb-6 text-white border-b border-slate-700/80 pb-4 flex items-center justify-between">
                <span>Skill Assessment Engine</span>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </h4>
              <div className="space-y-6">
                {[
                  { label: "Communication & Collaboration", val: 95, color: "bg-indigo-500" },
                  { label: "Leadership & Management", val: 75, color: "bg-emerald-400" },
                  { label: "Product Architecture & AI", val: 90, color: "bg-purple-500" }
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-slate-300 font-mono">
                      <span>{s.label}</span><span>{s.val}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.val}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                        className={`${s.color} h-full rounded-full`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
              ASSESSMENT FRAMEWORK
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white leading-tight">Skill Assessment Engine</h2>
            <p className="text-slate-400 text-lg font-light mb-8 leading-relaxed">Empower your employees with structured, intuitive assessments designed to capture a true picture of their current capabilities.</p>
            <div className="space-y-5">
              {[
                { t: "Role-based assessments", d: "Content specifically tailored to over 500+ standard industry roles." },
                { t: "Real-time scoring", d: "Immediate feedback loops that provide granular proficiency levels." },
                { t: "Progress tracking", d: "Historical snapshots to visualize growth over quarterly cycles." }
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-slate-300 text-sm font-light leading-relaxed"><span className="font-bold text-white">{item.t}:</span> {item.d}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. AI SKILL GAP DETECTION */}
      <section className="py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
              PREDICTIVE ANALYSIS
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white">AI Skill Gap Detection</h2>
            <p className="text-slate-400 text-lg mb-10 font-light leading-relaxed">Our AI automatically compares employee performance and assessment data against target role requirements to identify and prioritize gaps.</p>
            <div className="grid grid-cols-2 gap-4">
              {['Gap Visualization', 'Priority Ranking', 'Risk Indicator', 'Department Insights'].map((f, idx) => (
                <motion.div 
                  key={f} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -5, borderColor: "rgba(129,140,248,0.5)" }}
                  className="p-5 bg-[#0F172B]/90 border border-slate-800/80 rounded-2xl shadow-xl hover:border-indigo-500/40 transition-all cursor-default backdrop-blur-md"
                >
                  <h4 className="font-bold text-white text-sm mb-1.5 flex items-center justify-between">
                    <span>{f}</span>
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  </h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">Detailed analysis & interactive data mapping.</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40, rotateY: -12 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, type: "spring", stiffness: 60 }}
            style={{ perspective: 1000 }}
            className="order-1 md:order-2 bg-[#0F172B]/90 rounded-[2.5rem] p-10 shadow-2xl border border-slate-800/80 flex flex-col items-center group hover:border-indigo-500/40 transition-all backdrop-blur-xl"
          >
            <h4 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <span>Skill Gap Vector Visualization</span>
            </h4>
            <div className="w-64 h-64 border border-slate-700/80 rounded-full flex items-center justify-center relative bg-slate-900/40">
              <div className="absolute inset-8 border border-slate-800 rounded-full"></div>
              <div className="absolute inset-16 border border-slate-800/60 rounded-full"></div>
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[80px] border-r-transparent border-b-[120px] border-b-indigo-500/40 transform -rotate-12 absolute group-hover:scale-105 transition-transform duration-500"
              ></motion.div>
              <div className="absolute -top-6 text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">Technical</div>
              <div className="absolute -right-10 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest">Soft Skills</div>
              <div className="absolute -left-10 text-[10px] font-mono font-bold text-sky-300 uppercase tracking-widest">Domain</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. WORKFORCE READINESS SCORE */}
      <section className="py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center bg-[#0F172B]/90 rounded-[2.5rem] py-16 border border-slate-800/80 shadow-2xl backdrop-blur-xl group hover:border-emerald-500/40 transition-all"
          >
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                <motion.circle 
                  initial={{ strokeDashoffset: 552.9 }}
                  whileInView={{ strokeDashoffset: 110 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552.9" className="text-emerald-400" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-extrabold text-white tracking-tighter"
                >
                  {tenant.readinessScore}
                </motion.span>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Score / 100</span>
              </div>
            </div>
            <p className="mt-8 font-mono font-bold text-emerald-400 uppercase tracking-widest text-xs flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Org Workforce Readiness</span>
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
              UNIFIED INDEX
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white">Workforce Readiness Score</h2>
            <p className="text-slate-400 text-lg mb-8 font-light leading-relaxed">A single, unified metric that quantifies how ready your team is for the challenges of tomorrow, powered by four key pillars:</p>
            <div className="space-y-3.5">
              {['Skill Proficiency', 'Learning Progress', 'Career Alignment', 'Project Suitability'].map((pillar, idx) => (
                <motion.div 
                  key={pillar} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="p-4 bg-[#0F172B]/90 rounded-2xl border border-slate-800/80 flex justify-between items-center group hover:border-indigo-500/40 transition-all backdrop-blur-md"
                >
                  <span className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{pillar}</span>
                  <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 font-bold">→</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. ROLE-BASED DASHBOARDS (DYNAMIC MULTI-TENANT ROUTING) */}
      <section className="py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
            ROLE GOVERNANCE
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Role-Based Dashboards</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">Specific interfaces tailored for every stakeholder in your organization.</p>
        </div>
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          style={{ perspective: 1200 }}
          className="container mx-auto max-w-7xl grid md:grid-cols-4 gap-6"
        >
          {availableDashboards.map((d, i) => (
            <motion.div 
              key={i} 
              variants={card3DVariant}
              whileHover={{ y: -10, rotateY: 3 }}
            >
              <Link to={d.path} className="block group cursor-pointer bg-[#0F172B]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800/80 hover:border-indigo-500/40 hover:shadow-2xl transition-all duration-300">
                <div className="aspect-video bg-slate-900/90 rounded-2xl mb-5 overflow-hidden border border-slate-800 group-hover:border-indigo-500/40 transition-all relative flex items-center justify-center">
                  {d.img ? (
                    <img 
                      src={d.img} 
                      alt={d.t} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${d.color} p-3 flex flex-col justify-between relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                      {/* Mini Window Frame header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/80" />
                          <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 font-semibold">{d.id} UI</span>
                      </div>
                      {/* Stylized UI Micro Layout */}
                      <div className="grid grid-cols-3 gap-1.5 my-auto">
                        <div className="h-6 rounded bg-indigo-500/30 border border-indigo-500/40 animate-pulse" />
                        <div className="h-6 rounded bg-purple-500/30 border border-purple-500/40" />
                        <div className="h-6 rounded bg-sky-500/30 border border-sky-500/40" />
                      </div>
                      <div className="w-full h-8 rounded bg-slate-800/70 border border-slate-700/50 p-1 flex items-center justify-around">
                        <div className="w-1/3 h-2 bg-indigo-400/50 rounded" />
                        <div className="w-1/4 h-2 bg-emerald-400/50 rounded" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors duration-300" />
                </div>
                <h4 className="font-bold text-white mb-1 pl-1 transition-colors group-hover:text-indigo-300 text-base">{d.t}</h4>
                <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest pl-1">{d.s}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. ENTERPRISE SECURITY */}
      <section className="py-20 px-6 md:px-20 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 60 }}
            className="w-full md:w-1/3 aspect-square bg-[#0F172B]/90 border border-slate-800/80 rounded-[3rem] shadow-2xl flex items-center justify-center relative overflow-hidden group backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
            <Lock className="w-24 h-24 text-indigo-400/50 group-hover:scale-110 group-hover:text-indigo-400 transition-all duration-500" />
          </motion.div>
          <div className="flex-1">
            <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
              COMPLIANCE & ISOLATION
            </span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold text-white mb-10"
            >
              Enterprise & Tenant Security
            </motion.h2>
            <div className="grid grid-cols-2 gap-8">
              {[
                { t: "Isolated Tenant Data", d: "Logical data isolation ensured across all organization accounts." },
                { t: "GDPR & SOC2 Compliant", d: "Strict data privacy standards across global deployments." },
                { t: "Custom SSO & SAML", d: "Tenant-specific identity integration (Okta, Azure AD, OAuth)." },
                { t: "256-bit Encryption", d: "Data fully encrypted in transit and isolated at rest." }
              ].map((s, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  key={i}
                  className="hover:translate-x-1 transition-transform"
                >
                  <h4 className="font-bold text-white mb-1.5 border-l-2 border-indigo-500 pl-3 text-sm">{s.t}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">{s.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-20 px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`${mainGradient} max-w-6xl mx-auto rounded-[3rem] py-20 text-center text-white border border-slate-800/80 shadow-3xl relative overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-out pointer-events-none animate-shimmer" />

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight relative z-10">Ready to Transform <br /> Workforce Skills?</h2>
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-full font-extrabold text-base transition-all shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Link to="/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 px-10 py-4 rounded-full font-bold text-base transition-all backdrop-blur-sm inline-block">
                Schedule Demo
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>  

    </div>
  );
};

export default FeaturePage;