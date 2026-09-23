import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Building2, ShieldCheck, Cpu, Zap, ArrowRight, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import dashboardImg from '../assets/images/intro-image.jpg';

const SkillPulseLanding = () => {
  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  const mainGradient = "bg-[linear-gradient(135deg,#0F172B_0%,#1E293B_50%,#312E81_100%)]";

  // Animation Variants
  const intenseUp = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.8 } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  return (
    <div className="bg-[#0B1120] font-sans text-slate-100 overflow-x-hidden selection:bg-indigo-600 selection:text-white relative min-h-screen">
      {/* Keyframe Animations */}
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
        @keyframes float-reverse { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(18px) rotate(-3deg); } }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(15px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(15px) rotate(-360deg); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.2; transform: scale(1) translateY(-50%); } 50% { opacity: 0.5; transform: scale(1.25) translateY(-45%); } }
        @keyframes aurora { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -30px) scale(1.1); } }
        @keyframes shimmer-beam { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .animate-float-1 { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 10s ease-in-out infinite; }
        .animate-orbit { animation: orbit 12s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 7s ease-in-out infinite; }
        .animate-aurora { animation: aurora 14s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer-beam 3s infinite linear; }
      `}</style>

      {/* Global Animated Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 blur-[160px] rounded-full animate-aurora" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-600/15 blur-[150px] rounded-full animate-float-1" />
        <div className="absolute bottom-1/4 left-10 w-[650px] h-[650px] bg-indigo-900/20 blur-[180px] rounded-full animate-float-2" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="pt-4 sm:pt-8 pb-8 sm:pb-12 px-3 sm:px-6 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3xl md:rounded-[4rem] py-10 sm:py-16 md:py-24 px-4 sm:px-8 md:px-16 overflow-hidden shadow-2xl border border-slate-800/80"
          style={{
            background: `radial-gradient(circle at 75% 50%, #2E3759 0%, #171E35 50%, #0F172B 100%)`
          }}
        >
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none animate-float-1" />
          <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-purple-500/20 blur-[130px] rounded-full pointer-events-none animate-float-2" />
          <div className="absolute top-1/2 right-0 w-[700px] h-[700px] bg-indigo-600/25 blur-[140px] rounded-full pointer-events-none z-0 animate-pulse-glow" />

          <div className="container mx-auto grid lg:grid-cols-2 items-center gap-10 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              {/* Context-Aware Badge */}
              <motion.div 
                variants={intenseUp}
                whileHover={{ scale: 1.05, borderColor: "rgba(129,140,248,0.4)" }}
                className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full mb-4 sm:mb-6 backdrop-blur-md cursor-pointer transition-all shadow-[0_0_15px_rgba(99,102,241,0.15)]"
              >
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
                <span className="text-indigo-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">
                  {tenantId ? `${tenantId} Enterprise Workspace` : "SkillPulse-AI Multi-Tenant Platform"}
                </span>
              </motion.div>

              <motion.h1 
                variants={intenseUp}
                className="text-2.5xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white mb-4 sm:mb-5"
              >
                AI-Powered Skill <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  Intelligence for
                </span> <br className="hidden sm:inline" />
                Modern Teams
              </motion.h1>

              <motion.p 
                variants={intenseUp}
                className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-md mb-6 opacity-90 font-light"
              >
                Measure readiness. Close skill gaps. Accelerate workforce growth with tenant-isolated data insights.
              </motion.p>

              <motion.div variants={intenseUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                  <Link 
                    to="/signup" 
                    className="w-full sm:w-auto justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 inline-flex items-center gap-2 text-center"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                  <Link 
                    to="/contact" 
                    className="w-full sm:w-auto text-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white px-7 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all backdrop-blur-sm shadow-lg inline-block"
                  >
                    Request Demo
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Dashboard Preview with Live Floating Interactive Micro-Widgets */}
            <motion.div 
              initial={{ opacity: 0, x: 80, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.4, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="relative group mt-10 lg:mt-0 animate-float-1"
            >
               <div className="absolute -inset-12 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-[100px] rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="relative bg-[#0F172A]/90 backdrop-blur-xl border border-indigo-500/30 rounded-[2rem] p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:border-indigo-400/60 group-hover:shadow-indigo-500/20 group-hover:scale-[1.02]">
                  <img 
                    src={dashboardImg} 
                    alt="SkillPulse Dashboard Preview" 
                    className="rounded-[1.2rem] w-full opacity-95 transition-transform duration-700 group-hover:scale-[1.01]" 
                  />

                  {/* Floating Micro-Widget 1: Live Skill Gap Accuracy */}
                  <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 sm:-top-6 right-2 sm:-right-6 bg-[#0F172A]/95 border border-emerald-500/30 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 sm:gap-3"
                  >
                    <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono font-bold">Accuracy Model</div>
                      <div className="text-[11px] sm:text-xs font-bold text-emerald-400">98.4% Precision</div>
                    </div>
                  </motion.div>

                  {/* Floating Micro-Widget 2: Live Provisioned Tenants */}
                  <motion.div
                    animate={{ y: [6, -6, 6] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-4 sm:-bottom-6 left-2 sm:-left-6 bg-[#0F172A]/95 border border-indigo-500/30 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 sm:gap-3"
                  >
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">PostgreSQL Multi-Tenant</div>
                      <div className="text-xs font-bold text-indigo-300">Live Partition Active</div>
                    </div>
                  </motion.div>

               </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. FEATURES SECTION WITH 3D TILT ANIMATION */}
      <section className="py-28 px-6 md:px-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">Unlock Your Workforce Potential</h2>
          <p className="text-slate-400 text-lg mb-16 font-light">Actionable intelligence to align your team's capabilities with strategic goals.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ perspective: 1200 }}
          className="container mx-auto grid md:grid-cols-3 gap-8 relative z-10"
        >
          {[
            { title: "AI Skill Gap Analysis", desc: "Automatically detect critical skill deficiencies across enterprise teams and predict future hiring needs.", dot: "bg-indigo-400", tag: "GenAI Engine" },
            { title: "Workforce Readiness", desc: "Quantify your organization's preparedness with dynamic, real-time readiness scoring models.", dot: "bg-purple-400", tag: "Live Scoring" },
            { title: "Multi-Tenant Security", desc: "Enterprise-grade isolated data architecture supporting custom SSO and role-based access.", dot: "bg-sky-400", tag: "Data Partition" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={intenseUp}
              whileHover={{ y: -14, scale: 1.03, rotateX: 3, rotateY: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 rounded-[2.5rem] text-left bg-[#0F172A]/90 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-500 backdrop-blur-xl group cursor-pointer relative overflow-hidden shadow-xl hover:shadow-indigo-500/15"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center justify-between mb-6">
                <div className={`w-10 h-5 ${item.dot} opacity-30 rounded-full group-hover:scale-x-125 transition-transform duration-500`} />
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-indigo-300 transition-colors duration-300">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS STEPPER WITH RIPPLE ANIMATIONS */}
      <section className="py-28 px-6 md:px-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 relative z-10"
        >
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
            SYSTEM WORKFLOW
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">How SkillPulse Works</h2>
          <p className="text-slate-400 text-lg font-light">A streamlined process to continuously elevate your organizational capabilities.</p>
        </motion.div>
        
        <div className="container mx-auto relative z-10">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-sky-500/40 -translate-y-12"></div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8 relative"
          >
            {[
              { num: "01", t: "Assess Skills", d: "Baseline evaluations using role-specific frameworks." },
              { num: "02", t: "Analyze Gaps", d: "AI-driven mapping against organizational requirements." },
              { num: "03", t: "Recommend Learning", d: "Targeted courses and personalized growth tasks." },
              { num: "04", t: "Improve Readiness", d: "Monitor growth and updated enterprise readiness scores." }
            ].map((step, i) => (
              <motion.div key={i} variants={intenseUp} className="flex flex-col items-center text-center group">
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 360, boxShadow: "0 0 35px rgba(99,102,241,0.6)" }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-[#0F172A] border-2 border-indigo-500 text-indigo-400 rounded-full flex items-center justify-center text-xl font-bold mb-6 z-10 shadow-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 cursor-pointer relative"
                >
                  {step.num}
                  <span className="absolute -inset-1 rounded-full border border-indigo-500/30 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                </motion.div>
                <h4 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">{step.t}</h4>
                <p className="text-slate-400 text-sm px-4 font-light leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. EMPOWERING EVERY ROLE (DYNAMIC DASHBOARD NAVIGATION) */}
      <section className="py-28 px-6 md:px-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
            ROLE DASHBOARDS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Empowering Every Role</h2>
          <p className="text-slate-400 text-lg font-light">Role-scoped dashboards tailored for individual and organizational success.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ perspective: 1200 }}
          className="container mx-auto grid md:grid-cols-3 gap-8"
        >
          {[
            { 
              role: "Employees", 
              path: `/dashboard`,
              points: ["Personalized learning feeds", "Transparent promotion criteria", "Skill endorsement tracking"] 
            },
            { 
              role: "Team Leaders", 
              path: `/team-leader`,
              points: ["Team readiness dashboards", "Project resourcing insights", "Performance trend analysis"] 
            },
            { 
              role: "HR & Admin Control", 
              path: `/hr-dashboard`,
              points: ["Org-wide skill matrices", "Multi-tenant access control", "L&D budget optimization"] 
            }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={intenseUp}
              whileHover={{ y: -14, scale: 1.02, rotateX: 3, rotateY: -2 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="p-8 bg-[#0F172A]/90 border border-slate-800/80 rounded-3xl shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/50 transition-all duration-500 group flex flex-col justify-between backdrop-blur-xl"
            >
              <div>
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-500 relative overflow-hidden">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-white group-hover:scale-[6] transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-indigo-300 transition-colors duration-300">{item.role}</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light">Take control with dedicated role-based analytics and management features.</p>
                <ul className="space-y-3 mb-8">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="text-slate-300 text-sm flex items-center gap-2 transform transition-transform duration-300 hover:translate-x-1">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full group-hover:bg-indigo-300 transition-colors" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={item.path} className="text-indigo-400 font-bold text-sm inline-flex items-center gap-1.5 hover:gap-2.5 hover:text-indigo-300 transition-all">
                Access Workspace Dashboard →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. INTELLIGENCE SECTION WITH INTERACTIVE STAT COUNTER BADGES */}
      <section className="py-8 px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
          className={`${mainGradient} relative w-full rounded-[2.5rem] md:rounded-[4rem] py-20 md:py-24 px-8 md:px-20 overflow-hidden shadow-2xl border border-slate-800/80`}
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse" />

          <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={intenseUp} className="text-3xl md:text-5xl font-bold mb-8 leading-tight tracking-tight text-white">
                Intelligence That Drives <br className="hidden lg:block"/> 
                Smarter Decisions
              </motion.h2>

              {/* Interactive Dynamic Stat Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { label: "42% Faster Upskilling", icon: Sparkles },
                  { label: "99.9% Platform SLA", icon: ShieldCheck },
                  { label: "500+ Skill Rubrics", icon: Activity }
                ].map((chip, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.06, borderColor: "rgba(165,180,252,0.4)" }}
                    className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-all shadow-sm"
                  >
                    <chip.icon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{chip.label}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-6">
                {[
                  {t: "Predict promotion readiness", d: "Identify talent poised for leadership before attrition occurs."},
                  {t: "Multi-tenant data governance", d: "Ensure strict compliance and data isolation per organization."},
                  {t: "Monitor skill evolution", d: "Track capability growth across departments in real-time."}
                ].map((item, i) => (
                  <motion.div key={i} variants={intenseUp} className="flex gap-5 group cursor-default">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-400 mt-1.5 flex-shrink-0 group-hover:bg-indigo-400 transition-all duration-500 shadow-[0_0_15px_rgba(129,140,248,0.5)] group-hover:scale-110"></div>
                    <div>
                      <h4 className="font-bold text-lg md:text-xl mb-1.5 text-white group-hover:text-indigo-300 transition-colors duration-300">
                        {item.t}
                      </h4>
                      <p className="text-indigo-100/70 text-sm md:text-base leading-relaxed font-light">
                        {item.d}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
               <div className="bg-[#0F172A]/90 backdrop-blur-md border border-slate-700/80 h-[350px] md:h-[400px] rounded-[2.5rem] md:rounded-[3.5rem] shadow-3xl flex items-center justify-center overflow-hidden group hover:border-indigo-500/40 transition-all duration-500">
                  <div className="relative w-3/4 h-1/2 border-2 border-dashed border-indigo-500/40 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:border-indigo-400 group-hover:scale-105">
                      <div className="absolute inset-0 bg-indigo-500/10 animate-pulse rounded-2xl"></div>
                      <div className="absolute w-4 h-4 border-t-2 border-l-2 border-indigo-400 top-2 left-2 animate-orbit" />
                      <span className="text-indigo-300 font-mono text-xs uppercase tracking-[0.4em] relative z-10 transition-all group-hover:text-white duration-500 font-semibold">
                          Tenant_Neural_Engine
                      </span>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/30 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-24 px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
          className={`${mainGradient} w-full max-w-6xl mx-auto rounded-[3rem] py-20 px-8 text-center text-white border border-slate-800/80 shadow-3xl relative overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-out pointer-events-none animate-shimmer" />
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 relative z-10 tracking-tight">Transform Workforce Skills with AI</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto opacity-80 leading-relaxed relative z-10 font-light">
            Join leading enterprise teams building future-ready organizations with isolated, data-driven platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Link to="/signup" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-extrabold text-base hover:bg-indigo-500 transition transform shadow-2xl shadow-indigo-600/40 inline-flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Link to="/contact" className="bg-white/5 border border-white/20 text-white px-10 py-4 rounded-full font-bold text-base hover:bg-white/10 transition transform inline-block backdrop-blur-sm">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default SkillPulseLanding;