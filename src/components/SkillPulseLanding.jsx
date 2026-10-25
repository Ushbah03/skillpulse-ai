import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Building2, ShieldCheck, Cpu, Zap, ArrowRight, Activity, Sparkles, CheckCircle2, BrainCircuit, Lock } from 'lucide-react';
import dashboardImg from '../assets/images/intro-image.jpg';

const SkillPulseLanding = () => {
  const { tenantId } = useParams();

  const intenseUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-[#E9EAF7] font-sans text-[#17233E] overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative min-h-screen">
      {/* Ambient Gradient Depth - Vibrant glowing mesh lights behind frosted glass */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#1988A3]/22 blur-[80px] sm:blur-[90px] rounded-full" />
        <div className="absolute top-1/4 -right-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#11C6DE]/18 blur-[80px] sm:blur-[100px] rounded-full" />
        <div className="absolute top-1/2 -left-20 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-[#1B3154]/15 blur-[80px] sm:blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#8A9CB7]/30 blur-[80px] sm:blur-[90px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.10)_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:28px_28px] opacity-35" />
      </div>

      {/* 1. HERO SECTION WITH EXECUTIVE FROSTED CONTAINER */}
      <section className="pt-2 sm:pt-6 pb-6 sm:pb-14 px-3 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl md:rounded-[3rem] py-6 sm:py-12 md:py-18 px-3.5 sm:px-8 md:px-14 overflow-hidden glass-hero-dark text-white relative">
          <div className="grid lg:grid-cols-2 items-center gap-6 sm:gap-10 md:gap-12 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl text-left"
            >
              {/* Context-Aware Badge */}
              <motion.div 
                variants={intenseUp}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full mb-3 sm:mb-5 backdrop-blur-md shadow-sm"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#11C6DE] rounded-full animate-ping"></span>
                <span className="text-[#E9EAF7] text-[9px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">
                  {tenantId ? `${tenantId} Enterprise Workspace` : "SkillPulse-AI Multi-Tenant Platform"}
                </span>
              </motion.div>

              <motion.h1 
                variants={intenseUp}
                className="text-xl sm:text-3xl md:text-5xl font-extrabold leading-[1.2] tracking-tight text-white mb-2 sm:mb-4"
              >
                AI-Powered Skill <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#11C6DE] via-[#E9EAF7] to-white bg-clip-text text-transparent">
                  Intelligence for
                </span> <br className="hidden sm:inline" />
                Modern Teams
              </motion.h1>

              <motion.p 
                variants={intenseUp}
                className="text-[#E9EAF7]/80 text-[11px] sm:text-base leading-relaxed max-w-lg mb-4 sm:mb-7 font-light"
              >
                Measure readiness. Close skill gaps. Accelerate workforce growth with enterprise tenant-isolated data insights.
              </motion.p>

              <motion.div variants={intenseUp} className="flex flex-row items-center justify-start gap-2 sm:gap-3.5 w-full">
                <Link 
                  to="/signup" 
                  className="bg-white text-[#17233E] hover:bg-[#E9EAF7] px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#17233E]/30 inline-flex items-center justify-center gap-1.5 text-center shrink-0 cursor-pointer"
                >
                  Get Started <ArrowRight className="w-3.5 h-3.5 text-[#1988A3]" />
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-3.5 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm transition-all backdrop-blur-md inline-flex items-center justify-center text-center shrink-0 cursor-pointer"
                >
                  Request Demo
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Dashboard Preview with Live Floating Glass Micro-Widgets */}
            <div className="relative group mt-2 lg:mt-0">
               <div className="absolute -inset-3 sm:-inset-6 bg-[#1988A3]/25 blur-[50px] sm:blur-[80px] rounded-full opacity-60 pointer-events-none"></div>
               <div className="relative bg-white/10 backdrop-blur-2xl border border-white/25 rounded-xl sm:rounded-[2rem] p-1.5 sm:p-3.5 shadow-xl sm:shadow-[0_25px_60px_-15px_rgba(23,35,62,0.6)]">
                  <img 
                    src={dashboardImg} 
                    alt="SkillPulse Dashboard Preview" 
                    className="rounded-lg sm:rounded-[1.2rem] w-full opacity-95 shadow-inner" 
                  />

                  {/* Desktop Floating Micro-Widgets (Hidden on Mobile) */}
                  <div className="hidden sm:flex absolute -top-3 sm:-top-5 right-2 sm:-right-4 bg-white/95 border border-white backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl items-center gap-2.5 text-[#17233E]">
                    <div className="p-1.5 rounded-xl bg-[#1988A3]/10 text-[#1988A3]">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] text-[#5A6D89] uppercase font-mono font-bold">Accuracy Model</div>
                      <div className="text-[11px] font-extrabold text-[#1988A3]">98.4% Precision</div>
                    </div>
                  </div>

                  <div className="hidden sm:flex absolute -bottom-3 sm:-bottom-5 left-2 sm:-left-4 bg-white/95 border border-white backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl items-center gap-2.5 text-[#17233E]">
                    <div className="p-1.5 rounded-xl bg-[#17233E]/10 text-[#17233E]">
                      <Building2 className="w-3.5 h-3.5 text-[#1988A3]" />
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] text-[#5A6D89] uppercase font-mono font-bold">PostgreSQL Multi-Tenant</div>
                      <div className="text-[11px] font-extrabold text-[#17233E]">Live Partition Active</div>
                    </div>
                  </div>

                  {/* Compact Mobile Mini-Status Bar (Sleek, Not Oversized) */}
                  <div className="sm:hidden flex items-center justify-between gap-2 mt-2 px-1">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/15 text-[9px] font-medium text-white">
                      <Zap className="w-2.5 h-2.5 text-[#11C6DE]" />
                      <span>98.4% Model Precision</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/15 text-[9px] font-medium text-white">
                      <Building2 className="w-2.5 h-2.5 text-[#11C6DE]" />
                      <span>RLS Partition Active</span>
                    </div>
                  </div>

               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION WITH FROSTED GLASS CARDS */}
      <section className="py-6 sm:py-14 md:py-20 px-3.5 sm:px-6 md:px-14 text-center relative z-10">
        <div className="max-w-3xl mx-auto mb-5 sm:mb-10">
          <span className="px-2.5 py-0.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-[9px] sm:text-xs font-mono font-bold uppercase tracking-wider inline-block mb-1.5 sm:mb-3">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-[#17233E] mb-1.5 sm:mb-3 tracking-tight">Unlock Your Workforce Potential</h2>
          <p className="text-[#5A6D89] text-[11px] sm:text-base font-normal">Actionable intelligence to align your team's capabilities with strategic goals.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8 text-left">
          {[
            { 
              title: "AI Skill Gap Analysis", 
              desc: "Automatically detect critical skill deficiencies across enterprise teams and predict future talent needs.", 
              icon: BrainCircuit,
              color: "text-[#1988A3] bg-[#1988A3]/10 border-[#1988A3]/25",
              tag: "GenAI Engine" 
            },
            { 
              title: "Workforce Readiness", 
              desc: "Quantify your organization's preparedness with dynamic, real-time readiness scoring models.", 
              icon: Activity,
              color: "text-[#11C6DE] bg-[#11C6DE]/10 border-[#11C6DE]/25",
              tag: "Live Scoring" 
            },
            { 
              title: "Multi-Tenant Security", 
              desc: "Enterprise-grade isolated data architecture supporting custom SSO and role-based access control.", 
              icon: ShieldCheck,
              color: "text-[#17233E] bg-[#17233E]/10 border-[#17233E]/25",
              tag: "Data Partition" 
            }
          ].map((item, i) => (
            <div 
              key={i} 
              className="p-3.5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl glass-panel transition-all duration-300 group cursor-pointer relative overflow-hidden hover:border-[#1988A3]/50 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl border flex items-center justify-center ${item.color} shadow-xs group-hover:scale-105 transition-transform`}>
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[8px] sm:text-[10px] font-mono font-bold text-[#5A6D89] bg-[#E9EAF7] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#8A9CB7]/30 shadow-2xs">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-bold sm:font-extrabold text-sm sm:text-lg md:text-xl mb-1 sm:mb-1.5 text-[#17233E] group-hover:text-[#1988A3] transition-colors">{item.title}</h3>
              <p className="text-[#5A6D89] text-[11px] sm:text-xs leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS STEPPER (Sleek 2x2 on Mobile, 4 Columns on Desktop) */}
      <section className="py-6 sm:py-14 md:py-20 px-3.5 sm:px-6 md:px-14 relative z-10">
        <div className="text-center mb-5 sm:mb-10">
          <span className="px-2.5 py-0.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-[9px] sm:text-xs font-mono font-bold uppercase tracking-wider inline-block mb-1.5 sm:mb-3">
            SYSTEM WORKFLOW
          </span>
          <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-[#17233E] mb-1.5 sm:mb-3 tracking-tight">How SkillPulse Works</h2>
          <p className="text-[#5A6D89] text-[11px] sm:text-base font-normal">A streamlined process to continuously elevate your organizational capabilities.</p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5">
            {[
              { num: "01", t: "Assess Skills", d: "Baseline role-specific evaluations." },
              { num: "02", t: "Analyze Gaps", d: "AI mapping to benchmarks." },
              { num: "03", t: "Recommend Learning", d: "Targeted course programs." },
              { num: "04", t: "Improve Readiness", d: "Live telemetry index tracking." }
            ].map((step, i) => (
              <div key={i} className="glass-panel p-3 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col items-center text-center group transition-all duration-300">
                <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#17233E] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-extrabold mb-2 sm:mb-3 shadow-sm group-hover:bg-[#1988A3] transition-all">
                  {step.num}
                </div>
                <h4 className="font-bold sm:font-extrabold text-xs sm:text-sm text-[#17233E] mb-0.5 sm:mb-1 group-hover:text-[#1988A3] transition-colors">{step.t}</h4>
                <p className="text-[#5A6D89] text-[10px] sm:text-xs font-normal leading-tight sm:leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EMPOWERING EVERY ROLE */}
      <section className="py-6 sm:py-14 md:py-20 px-3.5 sm:px-6 md:px-14 relative z-10">
        <div className="text-center mb-5 sm:mb-10">
          <span className="px-2.5 py-0.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-[9px] sm:text-xs font-mono font-bold uppercase tracking-wider inline-block mb-1.5 sm:mb-3">
            ROLE DASHBOARDS
          </span>
          <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-[#17233E] mb-1.5 sm:mb-3 tracking-tight">Empowering Every Role</h2>
          <p className="text-[#5A6D89] text-[11px] sm:text-base font-normal">Role-scoped dashboards tailored for individual and organizational success.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8 text-left">
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
            <div 
              key={i} 
              className="p-4 sm:p-6 md:p-7 glass-panel rounded-xl sm:rounded-2xl md:rounded-[2rem] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#17233E]/10 border border-[#17233E]/20 rounded-lg sm:rounded-xl mb-3 sm:mb-5 flex items-center justify-center group-hover:bg-[#1988A3] transition-colors">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#17233E] group-hover:bg-white" />
                </div>
                <h3 className="font-bold sm:font-extrabold text-base sm:text-xl mb-1 sm:mb-2 text-[#17233E] group-hover:text-[#1988A3] transition-colors">{item.role}</h3>
                <p className="text-[#5A6D89] text-[11px] sm:text-xs mb-3 sm:mb-5 leading-relaxed font-normal">Dedicated role-based analytics and workforce management tools.</p>
                <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="text-[#17233E] text-[11px] sm:text-xs flex items-center gap-1.5 font-medium">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#1988A3] rounded-full flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={item.path} className="text-[#1988A3] hover:text-[#157289] font-bold text-[11px] sm:text-xs inline-flex items-center gap-1 transition-all">
                Access Workspace <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTELLIGENCE SECTION WITH HIGH-TECH TELEMETRY CARD */}
      <section className="py-6 sm:py-12 px-3 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl md:rounded-[3rem] py-6 sm:py-12 md:py-16 px-3.5 sm:px-8 md:px-14 glass-hero-dark text-white text-left relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 md:gap-12 items-center relative z-10">
            <div>
              <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold mb-3 sm:mb-5 leading-tight tracking-tight text-white">
                Intelligence That Drives <br className="hidden lg:block"/> 
                Smarter Decisions
              </h2>

              <div className="flex flex-wrap gap-1.5 sm:gap-2.5 mb-4 sm:mb-6">
                {[
                  { label: "42% Faster Upskilling", icon: Sparkles },
                  { label: "99.9% Platform SLA", icon: ShieldCheck },
                  { label: "500+ Skill Rubrics", icon: Activity }
                ].map((chip, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#E9EAF7] text-[9px] sm:text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-md"
                  >
                    <chip.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#11C6DE]" />
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  {t: "Predict promotion readiness", d: "Identify talent poised for leadership before attrition occurs."},
                  {t: "Multi-tenant data governance", d: "Ensure strict compliance and data isolation per organization."},
                  {t: "Monitor skill evolution", d: "Track capability growth across departments in real-time."}
                ].map((item, i) => (
                  <div key={i} className="flex gap-2.5 sm:gap-3 group cursor-default">
                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-[#11C6DE] mt-1 flex-shrink-0 group-hover:bg-[#11C6DE] transition-colors"></div>
                    <div>
                      <h4 className="font-bold sm:font-extrabold text-xs sm:text-base mb-0.5 text-white group-hover:text-[#11C6DE] transition-colors">
                        {item.t}
                      </h4>
                      <p className="text-[#E9EAF7]/75 text-[11px] sm:text-xs leading-relaxed font-light">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Tech Telemetry Card */}
            <div className="relative mt-2 lg:mt-0">
               <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-xl text-left">
                  <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#11C6DE]" />
                      <span className="text-xs font-bold text-white tracking-wide">Neural Telemetry Engine</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#11C6DE] bg-[#1988A3]/20 border border-[#11C6DE]/30 px-2 py-0.5 rounded-full">
                      Live Synced
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#E9EAF7] mb-1">
                        <span>Model Precision Rate</span>
                        <span className="font-mono text-[#11C6DE] font-bold">98.4%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] h-full rounded-full w-[98.4%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#E9EAF7] mb-1">
                        <span>Workforce Readiness Index</span>
                        <span className="font-mono text-emerald-400 font-bold">84% Optimal</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[84%]" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#E9EAF7]/70">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-[#11C6DE]" /> RLS Row-Level Security
                      </span>
                      <span className="text-[#11C6DE] font-bold">PostgreSQL v16</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-6 sm:py-14 md:py-18 px-3 sm:px-6 md:px-10 relative z-10 mb-4 sm:mb-8">
        <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl md:rounded-[3rem] py-6 sm:py-12 md:py-14 px-3.5 sm:px-8 text-center glass-hero-dark text-white relative overflow-hidden">
          <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold mb-2 sm:mb-3 tracking-tight text-white">Transform Workforce Skills with AI</h2>
          <p className="text-[#E9EAF7]/80 text-[11px] sm:text-base mb-4 sm:mb-7 max-w-xl mx-auto font-light">
            Join leading enterprise teams building future-ready organizations with isolated, data-driven platforms.
          </p>
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3.5 relative z-10 mx-auto">
            <Link to="/signup" className="bg-white text-[#17233E] hover:bg-[#E9EAF7] px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer">
              Start Free Trial <ArrowRight className="w-3.5 h-3.5 text-[#1988A3]" />
            </Link>
            <Link to="/contact" className="bg-white/10 border border-white/25 text-white hover:bg-white/20 px-3.5 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm transition-all inline-flex items-center justify-center backdrop-blur-md cursor-pointer">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillPulseLanding;
