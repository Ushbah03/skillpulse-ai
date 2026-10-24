import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Building2, ShieldCheck, Cpu, Zap, ArrowRight, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import dashboardImg from '../assets/images/intro-image.jpg';

const SkillPulseLanding = () => {
  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

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
    <div className="bg-[#E9EAF7] font-sans text-[#17233E] overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative min-h-screen">
      {/* Keyframe Animations */}
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-16px) rotate(1.5deg); } }
        @keyframes float-reverse { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(14px) rotate(-2deg); } }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(15px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(15px) rotate(-360deg); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1) translateY(-50%); } 50% { opacity: 0.6; transform: scale(1.15) translateY(-46%); } }
        @keyframes aurora { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -20px) scale(1.08); } }
        @keyframes shimmer-beam { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .animate-float-1 { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 10s ease-in-out infinite; }
        .animate-orbit { animation: orbit 12s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 7s ease-in-out infinite; }
        .animate-aurora { animation: aurora 14s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer-beam 3s infinite linear; }
      `}</style>

      {/* Global Ambient Glow Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1988A3]/10 blur-[150px] rounded-full animate-aurora" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#8A9CB7]/25 blur-[140px] rounded-full animate-float-1" />
        <div className="absolute bottom-1/4 left-10 w-[650px] h-[650px] bg-[#1B3154]/8 blur-[160px] rounded-full animate-float-2" />
        <div className="absolute inset-0 bg-[radial-gradient(#8A9CB7_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* 1. HERO SECTION WITH EXECUTIVE GRADIENT */}
      <section className="pt-4 sm:pt-6 pb-8 sm:pb-12 px-3 sm:px-6 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3xl md:rounded-[3.5rem] py-10 sm:py-16 md:py-22 px-4 sm:px-8 md:px-16 overflow-hidden shadow-2xl border border-white/20 text-white"
          style={{
            background: `linear-gradient(135deg, #17233E 0%, #1B3154 55%, #1988A3 100%)`
          }}
        >
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#1988A3]/25 blur-[120px] rounded-full pointer-events-none animate-float-1" />
          <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-[#11C6DE]/15 blur-[130px] rounded-full pointer-events-none animate-float-2" />
          <div className="absolute top-1/2 right-0 w-[650px] h-[650px] bg-[#17233E]/50 blur-[140px] rounded-full pointer-events-none z-0 animate-pulse-glow" />

          <div className="container mx-auto grid lg:grid-cols-2 items-center gap-10 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl text-left"
            >
              {/* Context-Aware Badge */}
              <motion.div 
                variants={intenseUp}
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full mb-4 sm:mb-6 backdrop-blur-md cursor-pointer transition-all shadow-[0_0_20px_rgba(25,136,163,0.3)]"
              >
                <span className="w-2 h-2 bg-[#11C6DE] rounded-full animate-ping"></span>
                <span className="text-[#E9EAF7] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">
                  {tenantId ? `${tenantId} Enterprise Workspace` : "SkillPulse-AI Multi-Tenant Platform"}
                </span>
              </motion.div>

              <motion.h1 
                variants={intenseUp}
                className="text-2.5xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white mb-4 sm:mb-5"
              >
                AI-Powered Skill <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#11C6DE] via-[#E9EAF7] to-white bg-clip-text text-transparent">
                  Intelligence for
                </span> <br className="hidden sm:inline" />
                Modern Teams
              </motion.h1>

              <motion.p 
                variants={intenseUp}
                className="text-[#E9EAF7]/85 text-xs sm:text-sm md:text-base leading-relaxed max-w-md mb-6 font-light"
              >
                Measure readiness. Close skill gaps. Accelerate workforce growth with enterprise tenant-isolated data insights.
              </motion.p>

              <motion.div variants={intenseUp} className="flex flex-row items-center justify-start gap-2.5 sm:gap-4 w-full">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="flex-1 sm:flex-initial">
                  <Link 
                    to="/signup" 
                    className="w-full sm:w-auto justify-center bg-white text-[#17233E] hover:bg-[#E9EAF7] px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-extrabold text-xs sm:text-base transition-all shadow-xl shadow-[#17233E]/30 inline-flex items-center gap-1.5 text-center"
                  >
                    Get Started <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1988A3]" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="flex-1 sm:flex-initial">
                  <Link 
                    to="/contact" 
                    className="w-full sm:w-auto text-center justify-center bg-white/10 hover:bg-white/20 border border-white/25 text-white px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-base transition-all backdrop-blur-md shadow-lg inline-block"
                  >
                    Request Demo
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Dashboard Preview with Live Floating Glass Micro-Widgets */}
            <motion.div 
              initial={{ opacity: 0, x: 80, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.3, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="relative group mt-8 lg:mt-0 animate-float-1"
            >
               <div className="absolute -inset-8 bg-gradient-to-r from-[#1988A3]/40 to-[#11C6DE]/30 blur-[90px] rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>
               <div className="relative bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2rem] p-3 sm:p-4 shadow-[0_25px_60px_-15px_rgba(23,35,62,0.5)] transition-all duration-700 group-hover:border-white/50 group-hover:scale-[1.01]">
                  <img 
                    src={dashboardImg} 
                    alt="SkillPulse Dashboard Preview" 
                    className="rounded-[1.2rem] w-full opacity-95 transition-transform duration-700 group-hover:scale-[1.01] shadow-inner" 
                  />

                  {/* Floating Micro-Widget 1: Live Skill Gap Accuracy */}
                  <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3 sm:-top-5 right-2 sm:-right-4 bg-white/95 border border-white backdrop-blur-xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-[#17233E]"
                  >
                    <div className="p-1.5 sm:p-2 rounded-xl bg-[#1988A3]/10 text-[#1988A3]">
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] sm:text-[10px] text-[#5A6D89] uppercase font-mono font-bold">Accuracy Model</div>
                      <div className="text-[11px] sm:text-xs font-extrabold text-[#1988A3]">98.4% Precision</div>
                    </div>
                  </motion.div>

                  {/* Floating Micro-Widget 2: Live Provisioned Tenants */}
                  <motion.div
                    animate={{ y: [6, -6, 6] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-3 sm:-bottom-5 left-2 sm:-left-4 bg-white/95 border border-white backdrop-blur-xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-[#17233E]"
                  >
                    <div className="p-2 rounded-xl bg-[#17233E]/10 text-[#17233E]">
                      <Building2 className="w-4 h-4 text-[#1988A3]" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-[#5A6D89] uppercase font-mono font-bold">PostgreSQL Multi-Tenant</div>
                      <div className="text-xs font-extrabold text-[#17233E]">Live Partition Active</div>
                    </div>
                  </motion.div>

               </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. FEATURES SECTION WITH FROSTED GLASS CARDS */}
      <section className="py-20 md:py-24 px-6 md:px-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#17233E] mb-4 tracking-tight">Unlock Your Workforce Potential</h2>
          <p className="text-[#5A6D89] text-base md:text-lg mb-14 font-normal">Actionable intelligence to align your team's capabilities with strategic goals.</p>
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
            { title: "AI Skill Gap Analysis", desc: "Automatically detect critical skill deficiencies across enterprise teams and predict future talent needs.", dot: "bg-[#1988A3]", tag: "GenAI Engine" },
            { title: "Workforce Readiness", desc: "Quantify your organization's preparedness with dynamic, real-time readiness scoring models.", dot: "bg-[#17233E]", tag: "Live Scoring" },
            { title: "Multi-Tenant Security", desc: "Enterprise-grade isolated data architecture supporting custom SSO and role-based access control.", dot: "bg-[#5A6D89]", tag: "Data Partition" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={intenseUp}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 rounded-[2rem] text-left bg-white/85 border border-white hover:border-[#1988A3]/40 transition-all duration-300 backdrop-blur-xl group cursor-pointer relative overflow-hidden shadow-[0_12px_35px_rgba(23,35,62,0.06)] hover:shadow-[0_20px_45px_rgba(25,136,163,0.12)]"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-6">
                <div className={`w-10 h-4 ${item.dot} opacity-80 rounded-full group-hover:scale-x-125 transition-transform duration-300`} />
                <span className="text-[10px] font-mono font-bold text-[#5A6D89] bg-[#E9EAF7] px-2.5 py-1 rounded-full border border-[#8A9CB7]/30">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-extrabold text-2xl mb-3 text-[#17233E] group-hover:text-[#1988A3] transition-colors duration-300">{item.title}</h3>
              <p className="text-[#5A6D89] text-sm leading-relaxed font-normal">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS STEPPER */}
      <section className="py-20 md:py-24 px-6 md:px-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 relative z-10"
        >
          <span className="px-3.5 py-1.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            SYSTEM WORKFLOW
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#17233E] mb-4 tracking-tight">How SkillPulse Works</h2>
          <p className="text-[#5A6D89] text-base md:text-lg font-normal">A streamlined process to continuously elevate your organizational capabilities.</p>
        </motion.div>
        
        <div className="container mx-auto relative z-10">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#17233E]/30 via-[#1B3154]/30 to-[#1988A3]/40 -translate-y-10"></div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative"
          >
            {[
              { num: "01", t: "Assess Skills", d: "Baseline evaluations using role-specific taxonomy frameworks." },
              { num: "02", t: "Analyze Gaps", d: "AI-driven mapping against benchmark organizational requirements." },
              { num: "03", t: "Recommend Learning", d: "Targeted courses, certifications, and adaptive career tasks." },
              { num: "04", t: "Improve Readiness", d: "Monitor growth and track live enterprise readiness indexes." }
            ].map((step, i) => (
              <motion.div key={i} variants={intenseUp} className="bg-white/85 border border-white hover:border-[#1988A3]/40 p-5 sm:p-7 rounded-2xl flex flex-col items-center text-center group relative overflow-hidden transition-all duration-300 shadow-[0_8px_25px_rgba(23,35,62,0.05)] hover:shadow-lg">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-11 h-11 sm:w-14 sm:h-14 bg-[#17233E] text-white rounded-full flex items-center justify-center text-sm sm:text-base font-extrabold mb-3.5 shadow-md shadow-[#17233E]/20 group-hover:bg-[#1988A3] transition-all duration-300"
                >
                  {step.num}
                </motion.div>
                <h4 className="font-extrabold text-sm sm:text-base text-[#17233E] mb-1.5 group-hover:text-[#1988A3] transition-colors duration-300">{step.t}</h4>
                <p className="text-[#5A6D89] text-xs font-normal leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. EMPOWERING EVERY ROLE */}
      <section className="py-20 md:py-24 px-6 md:px-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/20 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            ROLE DASHBOARDS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#17233E] mb-4 tracking-tight">Empowering Every Role</h2>
          <p className="text-[#5A6D89] text-base md:text-lg font-normal">Role-scoped dashboards tailored for individual and organizational success.</p>
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
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="p-8 bg-white/85 border border-white rounded-[2rem] shadow-[0_12px_35px_rgba(23,35,62,0.06)] hover:shadow-[0_20px_45px_rgba(25,136,163,0.12)] hover:border-[#1988A3]/40 transition-all duration-300 group flex flex-col justify-between backdrop-blur-xl text-left"
            >
              <div>
                <div className="w-12 h-12 bg-[#17233E]/10 border border-[#17233E]/20 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-[#1988A3] transition-colors duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#17233E] group-hover:bg-white transition-colors duration-300" />
                </div>
                <h3 className="font-extrabold text-2xl mb-3 text-[#17233E] group-hover:text-[#1988A3] transition-colors duration-300">{item.role}</h3>
                <p className="text-[#5A6D89] text-sm mb-6 leading-relaxed font-normal">Take control with dedicated role-based analytics and enterprise management tools.</p>
                <ul className="space-y-3 mb-8">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="text-[#17233E] text-sm flex items-center gap-2.5 font-medium">
                      <span className="w-1.5 h-1.5 bg-[#1988A3] rounded-full flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={item.path} className="text-[#1988A3] font-bold text-sm inline-flex items-center gap-1.5 hover:gap-2.5 hover:text-[#157289] transition-all">
                Access Workspace Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. INTELLIGENCE SECTION */}
      <section className="py-8 px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-[2.5rem] md:rounded-[3.5rem] py-16 md:py-20 px-8 md:px-16 overflow-hidden shadow-2xl border border-white/20 text-white"
          style={{
            background: `linear-gradient(135deg, #17233E 0%, #1B3154 50%, #1988A3 100%)`
          }}
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#11C6DE]/10 blur-[120px] pointer-events-none animate-pulse" />

          <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 text-left">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={intenseUp} className="text-3xl md:text-5xl font-extrabold mb-7 leading-tight tracking-tight text-white">
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
                    whileHover={{ scale: 1.05 }}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E9EAF7] text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-all shadow-sm"
                  >
                    <chip.icon className="w-3.5 h-3.5 text-[#11C6DE]" />
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
                  <motion.div key={i} variants={intenseUp} className="flex gap-4 group cursor-default">
                    <div className="w-5 h-5 rounded-full border-2 border-[#11C6DE] mt-1.5 flex-shrink-0 group-hover:bg-[#11C6DE] transition-all duration-300 shadow-[0_0_12px_rgba(17,198,222,0.4)]"></div>
                    <div>
                      <h4 className="font-extrabold text-lg md:text-xl mb-1 text-white group-hover:text-[#11C6DE] transition-colors duration-300">
                        {item.t}
                      </h4>
                      <p className="text-[#E9EAF7]/80 text-sm md:text-base leading-relaxed font-light">
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
               <div className="bg-white/10 backdrop-blur-xl border border-white/25 h-[320px] md:h-[380px] rounded-[2.5rem] shadow-2xl flex items-center justify-center overflow-hidden group hover:border-white/40 transition-all duration-500">
                  <div className="relative w-3/4 h-1/2 border-2 border-dashed border-[#11C6DE]/50 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:border-[#11C6DE] group-hover:scale-105">
                      <div className="absolute inset-0 bg-[#1988A3]/15 animate-pulse rounded-2xl"></div>
                      <div className="absolute w-4 h-4 border-t-2 border-l-2 border-[#11C6DE] top-2 left-2 animate-orbit" />
                      <span className="text-white font-mono text-xs uppercase tracking-[0.3em] relative z-10 transition-all font-bold">
                          Tenant_Neural_Engine
                      </span>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#1988A3]/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-20 md:py-24 px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mx-auto rounded-[3rem] py-16 sm:py-20 px-8 text-center text-white border border-white/20 shadow-2xl relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, #17233E 0%, #1B3154 50%, #1988A3 100%)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-out pointer-events-none animate-shimmer" />
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 relative z-10 tracking-tight">Transform Workforce Skills with AI</h2>
          <p className="text-[#E9EAF7]/85 text-base md:text-lg mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed relative z-10 font-light">
            Join leading enterprise teams building future-ready organizations with isolated, data-driven platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-5 relative z-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link to="/signup" className="bg-white text-[#17233E] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-extrabold text-sm sm:text-base hover:bg-[#E9EAF7] transition shadow-2xl inline-flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4 text-[#1988A3]" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link to="/contact" className="bg-white/10 border border-white/30 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-white/20 transition inline-block backdrop-blur-md">
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
