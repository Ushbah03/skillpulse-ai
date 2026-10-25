import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Building2, ShieldCheck, Cpu, Zap, ArrowRight, Activity, Sparkles, CheckCircle2, BrainCircuit } from 'lucide-react';
import dashboardImg from '../assets/images/intro-image.jpg';

const SkillPulseLanding = () => {
  const { tenantId } = useParams();

  const intenseUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  return (
    <div className="bg-[#E9EAF7] font-sans text-[#17233E] overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative min-h-screen">
      {/* Ambient Gradient Depth - Vibrant glowing mesh lights behind frosted glass */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[550px] h-[550px] bg-[#1988A3]/28 blur-[90px] rounded-full" />
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[#11C6DE]/22 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 -left-20 w-[600px] h-[600px] bg-[#1B3154]/18 blur-[100px] rounded-full" />
        <div className="absolute top-3/4 right-1/4 w-[550px] h-[550px] bg-[#8A9CB7]/40 blur-[90px] rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-[#1988A3]/22 blur-[90px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.12)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      {/* 1. HERO SECTION WITH EXECUTIVE FROSTED CONTAINER */}
      <section className="pt-4 sm:pt-8 pb-12 sm:pb-16 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto rounded-3xl md:rounded-[3.5rem] py-10 sm:py-16 md:py-20 px-5 sm:px-10 md:px-16 overflow-hidden glass-hero-dark text-white relative">
          <div className="grid lg:grid-cols-2 items-center gap-12 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl text-left"
            >
              {/* Context-Aware Badge */}
              <motion.div 
                variants={intenseUp}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-md shadow-sm"
              >
                <span className="w-2 h-2 bg-[#11C6DE] rounded-full animate-ping"></span>
                <span className="text-[#E9EAF7] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">
                  {tenantId ? `${tenantId} Enterprise Workspace` : "SkillPulse-AI Multi-Tenant Platform"}
                </span>
              </motion.div>

              <motion.h1 
                variants={intenseUp}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white mb-5"
              >
                AI-Powered Skill <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#11C6DE] via-[#E9EAF7] to-white bg-clip-text text-transparent">
                  Intelligence for
                </span> <br className="hidden sm:inline" />
                Modern Teams
              </motion.h1>

              <motion.p 
                variants={intenseUp}
                className="text-[#E9EAF7]/85 text-sm sm:text-base leading-relaxed max-w-lg mb-8 font-light"
              >
                Measure readiness. Close skill gaps. Accelerate workforce growth with enterprise tenant-isolated data insights.
              </motion.p>

              <motion.div variants={intenseUp} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 sm:gap-4 w-full">
                <Link 
                  to="/signup" 
                  className="bg-white text-[#17233E] hover:bg-[#E9EAF7] px-7 sm:px-9 py-3.5 rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-[#17233E]/30 inline-flex items-center justify-center gap-2 text-center"
                >
                  Get Started <ArrowRight className="w-4 h-4 text-[#1988A3]" />
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-6 sm:px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all backdrop-blur-md shadow-md inline-flex items-center justify-center text-center"
                >
                  Request Demo
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Dashboard Preview with Live Floating Glass Micro-Widgets */}
            <div className="relative group mt-6 lg:mt-0">
               <div className="absolute -inset-6 bg-[#1988A3]/30 blur-[80px] rounded-full opacity-60"></div>
               <div className="relative bg-white/10 backdrop-blur-2xl border border-white/25 rounded-[2rem] p-3 sm:p-4 shadow-[0_25px_60px_-15px_rgba(23,35,62,0.6)]">
                  <img 
                    src={dashboardImg} 
                    alt="SkillPulse Dashboard Preview" 
                    className="rounded-[1.2rem] w-full opacity-95 shadow-inner" 
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

                  {/* Mobile Docked Micro-Widgets (Clean row below preview, no overlapping) */}
                  <div className="sm:hidden grid grid-cols-2 gap-2 mt-3 text-left">
                    <div className="bg-white/95 border border-white px-2.5 py-2 rounded-xl shadow-md flex items-center gap-2 text-[#17233E]">
                      <div className="p-1 rounded-lg bg-[#1988A3]/10 text-[#1988A3] shrink-0">
                        <Zap className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[8px] text-[#5A6D89] uppercase font-mono font-bold truncate">Accuracy</div>
                        <div className="text-[10px] font-extrabold text-[#1988A3]">98.4% Precision</div>
                      </div>
                    </div>
                    <div className="bg-white/95 border border-white px-2.5 py-2 rounded-xl shadow-md flex items-center gap-2 text-[#17233E]">
                      <div className="p-1 rounded-lg bg-[#17233E]/10 text-[#17233E] shrink-0">
                        <Building2 className="w-3 h-3 text-[#1988A3]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[8px] text-[#5A6D89] uppercase font-mono font-bold truncate">PostgreSQL</div>
                        <div className="text-[10px] font-extrabold text-[#17233E]">Live Synced</div>
                      </div>
                    </div>
                  </div>

               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION WITH FROSTED GLASS CARDS */}
      <section className="py-16 md:py-24 px-5 sm:px-6 md:px-16 text-center relative z-10">
        <div className="max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#17233E] mb-3 sm:mb-4 tracking-tight">Unlock Your Workforce Potential</h2>
          <p className="text-[#5A6D89] text-sm sm:text-base md:text-lg font-normal">Actionable intelligence to align your team's capabilities with strategic goals.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
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
              className="p-6 sm:p-8 rounded-3xl glass-panel transition-all duration-300 group cursor-pointer relative overflow-hidden hover:border-[#1988A3]/50 shadow-md"
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${item.color} shadow-xs group-hover:scale-105 transition-transform`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#5A6D89] bg-[#E9EAF7] px-3 py-1 rounded-full border border-[#8A9CB7]/30 shadow-2xs">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-extrabold text-xl sm:text-2xl mb-2.5 text-[#17233E] group-hover:text-[#1988A3] transition-colors">{item.title}</h3>
              <p className="text-[#5A6D89] text-xs sm:text-sm leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS STEPPER */}
      <section className="py-20 md:py-24 px-6 md:px-16 relative z-10">
        <div className="text-center mb-14">
          <span className="px-3.5 py-1.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            SYSTEM WORKFLOW
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#17233E] mb-4 tracking-tight">How SkillPulse Works</h2>
          <p className="text-[#5A6D89] text-base md:text-lg font-normal">A streamlined process to continuously elevate your organizational capabilities.</p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {[
              { num: "01", t: "Assess Skills", d: "Baseline evaluations using role-specific taxonomy frameworks." },
              { num: "02", t: "Analyze Gaps", d: "AI-driven mapping against benchmark organizational requirements." },
              { num: "03", t: "Recommend Learning", d: "Targeted courses, certifications, and adaptive career tasks." },
              { num: "04", t: "Improve Readiness", d: "Monitor growth and track live enterprise readiness indexes." }
            ].map((step, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center group transition-all duration-300">
                <div className="w-12 h-12 bg-[#17233E] text-white rounded-full flex items-center justify-center text-base font-extrabold mb-4 shadow-md group-hover:bg-[#1988A3] transition-all">
                  {step.num}
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-[#17233E] mb-1.5 group-hover:text-[#1988A3] transition-colors">{step.t}</h4>
                <p className="text-[#5A6D89] text-xs font-normal leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EMPOWERING EVERY ROLE */}
      <section className="py-20 md:py-24 px-6 md:px-16 relative z-10">
        <div className="text-center mb-14">
          <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            ROLE DASHBOARDS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#17233E] mb-4 tracking-tight">Empowering Every Role</h2>
          <p className="text-[#5A6D89] text-base md:text-lg font-normal">Role-scoped dashboards tailored for individual and organizational success.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-left">
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
              className="p-8 glass-panel rounded-[2rem] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-[#17233E]/10 border border-[#17233E]/20 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-[#1988A3] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#17233E] group-hover:bg-white" />
                </div>
                <h3 className="font-extrabold text-2xl mb-3 text-[#17233E] group-hover:text-[#1988A3] transition-colors">{item.role}</h3>
                <p className="text-[#5A6D89] text-sm mb-6 leading-relaxed font-normal">Take control with dedicated role-based analytics and enterprise management tools.</p>
                <ul className="space-y-3 mb-8">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="text-[#17233E] text-sm flex items-center gap-2.5 font-medium">
                      <span className="w-1.5 h-1.5 bg-[#1988A3] rounded-full flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={item.path} className="text-[#1988A3] hover:text-[#157289] font-bold text-sm inline-flex items-center gap-1.5 transition-all">
                Access Workspace Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTELLIGENCE SECTION */}
      <section className="py-12 px-4 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto rounded-[2rem] sm:rounded-[3rem] py-12 sm:py-16 md:py-20 px-5 sm:px-10 md:px-16 glass-hero-dark text-white text-left relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white">
                Intelligence That Drives <br className="hidden lg:block"/> 
                Smarter Decisions
              </h2>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { label: "42% Faster Upskilling", icon: Sparkles },
                  { label: "99.9% Platform SLA", icon: ShieldCheck },
                  { label: "500+ Skill Rubrics", icon: Activity }
                ].map((chip, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E9EAF7] text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md"
                  >
                    <chip.icon className="w-3.5 h-3.5 text-[#11C6DE]" />
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-5">
                {[
                  {t: "Predict promotion readiness", d: "Identify talent poised for leadership before attrition occurs."},
                  {t: "Multi-tenant data governance", d: "Ensure strict compliance and data isolation per organization."},
                  {t: "Monitor skill evolution", d: "Track capability growth across departments in real-time."}
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-default">
                    <div className="w-4 h-4 rounded-full border-2 border-[#11C6DE] mt-1.5 flex-shrink-0 group-hover:bg-[#11C6DE] transition-colors"></div>
                    <div>
                      <h4 className="font-extrabold text-lg mb-1 text-white group-hover:text-[#11C6DE] transition-colors">
                        {item.t}
                      </h4>
                      <p className="text-[#E9EAF7]/80 text-sm leading-relaxed font-light">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               <div className="bg-white/10 backdrop-blur-xl border border-white/20 h-[320px] md:h-[360px] rounded-[2.5rem] shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="relative w-3/4 h-1/2 border-2 border-dashed border-[#11C6DE]/50 rounded-2xl flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#1988A3]/15 rounded-2xl"></div>
                      <span className="text-white font-mono text-xs uppercase tracking-[0.3em] relative z-10 font-bold">
                          Tenant_Neural_Engine
                      </span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-20 px-4 md:px-10 relative z-10 mb-8">
        <div className="max-w-5xl mx-auto rounded-[2rem] sm:rounded-[3rem] py-12 sm:py-16 px-5 sm:px-8 text-center glass-hero-dark text-white relative overflow-hidden">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">Transform Workforce Skills with AI</h2>
          <p className="text-[#E9EAF7]/85 text-base md:text-lg mb-10 max-w-2xl mx-auto font-light">
            Join leading enterprise teams building future-ready organizations with isolated, data-driven platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/signup" className="bg-white text-[#17233E] hover:bg-[#E9EAF7] px-9 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all shadow-xl inline-flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4 text-[#1988A3]" />
            </Link>
            <Link to="/contact" className="bg-white/10 border border-white/25 text-white hover:bg-white/20 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all inline-block backdrop-blur-md">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillPulseLanding;
