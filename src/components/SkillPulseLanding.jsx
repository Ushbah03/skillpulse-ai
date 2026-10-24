import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Building2, ShieldCheck, Cpu, Zap, ArrowRight, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
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
    <div className="bg-[#0E1626] font-sans text-white overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative min-h-screen">
      {/* Seamless Ambient Glass Depth - Unified for Entire Page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/4 w-[700px] h-[700px] bg-[#1988A3]/12 blur-[170px] rounded-full" />
        <div className="absolute top-1/3 right-5 w-[600px] h-[600px] bg-[#1B3154]/30 blur-[180px] rounded-full" />
        <div className="absolute top-2/3 left-10 w-[700px] h-[700px] bg-[#1988A3]/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] right-1/4 w-[650px] h-[650px] bg-[#17233E]/40 blur-[190px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(138,156,183,0.12)_1px,transparent_1px)] [background-size:36px_36px] opacity-40" />
      </div>

      {/* 1. HERO SECTION WITH FROSTED GLASS CONTAINER */}
      <section className="pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto rounded-3xl md:rounded-[3.5rem] py-12 sm:py-16 md:py-20 px-6 sm:px-10 md:px-16 overflow-hidden glass-container relative">
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
                className="inline-flex items-center gap-2 bg-[#1988A3]/15 border border-[#1988A3]/30 px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-md"
              >
                <span className="w-2 h-2 bg-[#11C6DE] rounded-full animate-ping"></span>
                <span className="text-[#11C6DE] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">
                  {tenantId ? `${tenantId} Enterprise Workspace` : "SkillPulse-AI Multi-Tenant Platform"}
                </span>
              </motion.div>

              <motion.h1 
                variants={intenseUp}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white mb-5"
              >
                AI-Powered Skill <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#11C6DE] via-[#1988A3] to-[#E9EAF7] bg-clip-text text-transparent">
                  Intelligence for
                </span> <br className="hidden sm:inline" />
                Modern Teams
              </motion.h1>

              <motion.p 
                variants={intenseUp}
                className="text-[#8A9CB7] text-sm sm:text-base leading-relaxed max-w-lg mb-8 font-normal"
              >
                Measure readiness. Close skill gaps. Accelerate workforce growth with enterprise tenant-isolated data insights.
              </motion.p>

              <motion.div variants={intenseUp} className="flex flex-row items-center justify-start gap-3 sm:gap-4 w-full">
                <Link 
                  to="/signup" 
                  className="bg-[#1988A3] hover:bg-[#157289] text-white px-7 sm:px-9 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#1988A3]/30 hover:shadow-[#1988A3]/50 inline-flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-white/5 hover:bg-white/10 border border-white/15 text-[#E9EAF7] px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all backdrop-blur-md shadow-md inline-block"
                >
                  Request Demo
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Dashboard Preview with Live Floating Glass Micro-Widgets */}
            <div className="relative group mt-6 lg:mt-0">
               <div className="absolute -inset-6 bg-[#1988A3]/25 blur-[70px] rounded-full opacity-60"></div>
               <div className="relative bg-[#1B3154]/40 backdrop-blur-2xl border border-white/15 rounded-[2rem] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <img 
                    src={dashboardImg} 
                    alt="SkillPulse Dashboard Preview" 
                    className="rounded-[1.2rem] w-full opacity-95 shadow-inner" 
                  />

                  {/* Floating Micro-Widget 1: Live Skill Gap Accuracy */}
                  <div className="absolute -top-3 sm:-top-5 right-2 sm:-right-4 bg-[#0E1626]/90 border border-white/15 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 text-white">
                    <div className="p-1.5 rounded-xl bg-[#1988A3]/20 text-[#11C6DE]">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] text-[#8A9CB7] uppercase font-mono font-bold">Accuracy Model</div>
                      <div className="text-[11px] font-extrabold text-[#11C6DE]">98.4% Precision</div>
                    </div>
                  </div>

                  {/* Floating Micro-Widget 2: Live Provisioned Tenants */}
                  <div className="absolute -bottom-3 sm:-bottom-5 left-2 sm:-left-4 bg-[#0E1626]/90 border border-white/15 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 text-white">
                    <div className="p-1.5 rounded-xl bg-[#1988A3]/20 text-[#1988A3]">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] text-[#8A9CB7] uppercase font-mono font-bold">PostgreSQL Multi-Tenant</div>
                      <div className="text-[11px] font-extrabold text-[#E9EAF7]">Live Partition Active</div>
                    </div>
                  </div>

               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION WITH FROSTED GLASS CARDS */}
      <section className="py-20 md:py-24 px-6 md:px-16 text-center relative z-10">
        <div className="max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/15 border border-[#1988A3]/30 text-[#11C6DE] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-4">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Unlock Your Workforce Potential</h2>
          <p className="text-[#8A9CB7] text-base md:text-lg font-normal">Actionable intelligence to align your team's capabilities with strategic goals.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-left">
          {[
            { title: "AI Skill Gap Analysis", desc: "Automatically detect critical skill deficiencies across enterprise teams and predict future talent needs.", dot: "bg-[#1988A3]", tag: "GenAI Engine" },
            { title: "Workforce Readiness", desc: "Quantify your organization's preparedness with dynamic, real-time readiness scoring models.", dot: "bg-[#11C6DE]", tag: "Live Scoring" },
            { title: "Multi-Tenant Security", desc: "Enterprise-grade isolated data architecture supporting custom SSO and role-based access control.", dot: "bg-[#8A9CB7]", tag: "Data Partition" }
          ].map((item, i) => (
            <div 
              key={i} 
              className="p-8 rounded-[2rem] glass-container hover:border-[#1988A3]/50 transition-all duration-300 group cursor-pointer relative overflow-hidden shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-8 h-3.5 ${item.dot} rounded-full opacity-80`} />
                <span className="text-[10px] font-mono font-bold text-[#11C6DE] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-extrabold text-xl mb-3 text-white group-hover:text-[#11C6DE] transition-colors">{item.title}</h3>
              <p className="text-[#8A9CB7] text-sm leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS STEPPER */}
      <section className="py-20 md:py-24 px-6 md:px-16 relative z-10">
        <div className="text-center mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#8A9CB7] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-4">
            SYSTEM WORKFLOW
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">How SkillPulse Works</h2>
          <p className="text-[#8A9CB7] text-base md:text-lg font-normal">A streamlined process to continuously elevate your organizational capabilities.</p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { num: "01", t: "Assess Skills", d: "Baseline evaluations using role-specific taxonomy frameworks." },
              { num: "02", t: "Analyze Gaps", d: "AI-driven mapping against benchmark organizational requirements." },
              { num: "03", t: "Recommend Learning", d: "Targeted courses, certifications, and adaptive career tasks." },
              { num: "04", t: "Improve Readiness", d: "Monitor growth and track live enterprise readiness indexes." }
            ].map((step, i) => (
              <div key={i} className="glass-container p-6 rounded-2xl flex flex-col items-center text-center group hover:border-[#1988A3]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-[#1988A3]/20 border border-[#1988A3]/40 text-[#11C6DE] rounded-full flex items-center justify-center text-base font-extrabold mb-4 shadow-md group-hover:bg-[#1988A3] group-hover:text-white transition-all">
                  {step.num}
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-white mb-2 group-hover:text-[#11C6DE] transition-colors">{step.t}</h4>
                <p className="text-[#8A9CB7] text-xs font-normal leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EMPOWERING EVERY ROLE */}
      <section className="py-20 md:py-24 px-6 md:px-16 relative z-10">
        <div className="text-center mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/15 border border-[#1988A3]/30 text-[#11C6DE] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-4">
            ROLE DASHBOARDS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Empowering Every Role</h2>
          <p className="text-[#8A9CB7] text-base md:text-lg font-normal">Role-scoped dashboards tailored for individual and organizational success.</p>
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
              className="p-8 glass-container rounded-[2rem] hover:border-[#1988A3]/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-[#1988A3]/15 border border-[#1988A3]/30 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-[#1988A3] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#11C6DE] group-hover:bg-white" />
                </div>
                <h3 className="font-extrabold text-2xl mb-3 text-white group-hover:text-[#11C6DE] transition-colors">{item.role}</h3>
                <p className="text-[#8A9CB7] text-sm mb-6 leading-relaxed font-normal">Take control with dedicated role-based analytics and enterprise management tools.</p>
                <ul className="space-y-3 mb-8">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="text-[#E9EAF7] text-sm flex items-center gap-2.5 font-medium">
                      <span className="w-1.5 h-1.5 bg-[#1988A3] rounded-full flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={item.path} className="text-[#1988A3] group-hover:text-[#11C6DE] font-bold text-sm inline-flex items-center gap-1.5 transition-all">
                Access Workspace Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTELLIGENCE SECTION */}
      <section className="py-12 px-4 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto rounded-[3rem] py-16 md:py-20 px-8 md:px-16 glass-container text-left relative overflow-hidden">
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
                    className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#E9EAF7] text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md"
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
                    <div className="w-4 h-4 rounded-full border-2 border-[#1988A3] mt-1.5 flex-shrink-0 group-hover:bg-[#1988A3] transition-colors"></div>
                    <div>
                      <h4 className="font-extrabold text-lg mb-1 text-white group-hover:text-[#11C6DE] transition-colors">
                        {item.t}
                      </h4>
                      <p className="text-[#8A9CB7] text-sm leading-relaxed font-normal">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               <div className="bg-[#1B3154]/40 backdrop-blur-xl border border-white/15 h-[320px] md:h-[360px] rounded-[2.5rem] shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="relative w-3/4 h-1/2 border-2 border-dashed border-[#1988A3]/40 rounded-2xl flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#1988A3]/10 rounded-2xl"></div>
                      <span className="text-[#11C6DE] font-mono text-xs uppercase tracking-[0.3em] relative z-10 font-bold">
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
        <div className="max-w-5xl mx-auto rounded-[3rem] py-16 px-8 text-center glass-container relative overflow-hidden">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">Transform Workforce Skills with AI</h2>
          <p className="text-[#8A9CB7] text-base md:text-lg mb-10 max-w-2xl mx-auto font-normal">
            Join leading enterprise teams building future-ready organizations with isolated, data-driven platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/signup" className="bg-[#1988A3] hover:bg-[#157289] text-white px-9 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all shadow-xl shadow-[#1988A3]/30 inline-flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="bg-white/5 border border-white/15 text-[#E9EAF7] hover:bg-white/10 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all inline-block backdrop-blur-md">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillPulseLanding;
