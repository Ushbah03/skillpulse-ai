import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sparkles, Target, Cpu, BrainCircuit, Users, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

import aboutImg from '../assets/images/about.png'; 
import intelligentImg from '../assets/images/image-sample.png';

const AboutPage = () => {
  const { tenantId } = useParams();

  return (
    <div className="bg-[#E9EAF7] font-sans text-[#17233E] overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative min-h-screen">
      {/* Ambient Gradient Depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#1988A3]/18 blur-[160px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#8A9CB7]/35 blur-[160px] rounded-full" />
        <div className="absolute top-2/3 left-10 w-[650px] h-[650px] bg-[#1988A3]/15 blur-[170px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-[#1B3154]/12 blur-[170px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(90,109,137,0.15)_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
      </div>

      {/* 1. HERO HEADER */}
      <section className="relative pt-16 sm:pt-20 pb-16 px-6 overflow-hidden z-10">
        <div className="container mx-auto max-w-6xl relative z-10 grid md:grid-cols-2 gap-12 items-center text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1988A3]/10 border border-[#1988A3]/25 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#1988A3] animate-pulse" />
              <span className="text-[#1988A3] text-xs font-bold uppercase tracking-widest font-mono">
                ABOUT SKILLPULSE AI
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5 tracking-tight text-[#17233E]">
              Redefining Workforce <br /> 
              <span className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] bg-clip-text text-transparent">
                Intelligence with AI
              </span>
            </h1>
            <p className="text-[#5A6D89] text-base mb-5 font-normal leading-relaxed">
              SkillPulse AI bridges the gap between talent potential and organizational growth using real-time skill analytics and PostgreSQL-backed workforce telemetry.
            </p>
            <p className="text-[#17233E] text-xs border-l-2 border-[#1988A3] pl-4 py-1 font-mono font-medium">
              Our mission is empowering organizations with data-driven insights to build resilient, high-performing engineering and enterprise teams.
            </p>
          </div>
          
          <div className="flex justify-center relative group">
             <div className="absolute -inset-4 bg-[#1988A3]/25 rounded-[2.5rem] blur-2xl opacity-60 pointer-events-none" />
             <div className="relative z-10 bg-gradient-to-br from-[#17233E]/95 via-[#1B3154]/90 to-[#121E33]/95 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-4 sm:p-5 shadow-[0_25px_60px_-15px_rgba(23,35,62,0.35)] overflow-hidden">
               <img 
                 src={aboutImg} 
                 alt="Intelligence Radar Visual" 
                 className="relative z-10 w-full max-w-md rounded-2xl object-cover shadow-inner" 
               />
             </div>
          </div>
        </div>
      </section>

      {/* 2. THE CHALLENGES WE SOLVE */}
      <section className="py-16 md:py-20 px-6 md:px-12 relative z-10">
        <div className="container mx-auto text-center mb-14 max-w-3xl">
          <span className="px-3.5 py-1.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            WORKFORCE DISCONNECTS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#17233E] mb-3 tracking-tight">The Challenges Modern Organizations Face</h2>
          <p className="text-[#5A6D89] text-base font-normal">Traditional performance reviews are static and manual. SkillPulse AI makes talent management predictive and continuous.</p>
        </div>

        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl text-left">
          {[
            { title: "Unidentified Skill Gaps", desc: "Organizations struggle to pinpoint exact technical skill deficiencies across departments." },
            { title: "Static Performance Logs", desc: "Legacy tools track historical attendance instead of active skill development and growth." },
            { title: "Generic Learning Paths", desc: "One-size-fits-all training courses fail to target individual employee skill gaps." },
            { title: "Opaque Career Pathways", desc: "Employees lack clear visibility into role benchmarks required for promotion." }
          ].map((item, i) => (
            <div 
              key={i} 
              className="p-7 rounded-3xl glass-panel hover:border-[#1988A3]/40 transition-all duration-300 flex flex-col group shadow-md"
            >
              <div className="w-11 h-11 bg-[#17233E] text-white rounded-2xl mb-5 group-hover:bg-[#1988A3] transition-colors flex items-center justify-center font-bold font-mono text-sm shadow-md shadow-[#17233E]/20">
                0{i+1}
              </div>
              <h3 className="text-lg font-extrabold mb-2 text-[#17233E] group-hover:text-[#1988A3] transition-colors">{item.title}</h3>
              <p className="text-[#5A6D89] text-xs leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. OUR INTELLIGENT ARCHITECTURE */}
      <section className="py-16 md:py-20 px-6 md:px-12 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-14 items-center text-left">
          <div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              PLATFORM ARCHITECTURE
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#17233E] mb-5 tracking-tight">Our Intelligent Approach</h2>
            <p className="text-[#5A6D89] text-base mb-8 leading-relaxed font-normal">
              SkillPulse AI connects live PostgreSQL databases with specialized AI inference engines to provide real-time skill intelligence across all enterprise levels.
            </p>
            
            <div className="space-y-3.5">
              {[
                { title: "Real-Time AI Skill Gap Detection", desc: "Analyzes verified employee skill profiles against department benchmarks." },
                { title: "Workforce Readiness Scoring", desc: "Computes overall readiness percentage and flags critical missing competencies." },
                { title: "Personalized Course Recommendations", desc: "Matches active skill gaps directly with indexed training courses." },
                { title: "5-Tier Role-Based Access Control", desc: "Seamless governance for Employees, Team Leads, HR Managers, Company Admins, and Superadmins." }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3.5 p-4 glass-panel rounded-2xl"
                >
                  <div className="w-5 h-5 rounded-full bg-[#1988A3]/15 border border-[#1988A3]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1988A3]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#17233E] text-sm mb-0.5">{item.title}</h4>
                    <p className="text-[#5A6D89] text-xs font-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image Framing */}
          <div className="relative pt-4">
            <div className="relative z-10 glass-panel p-3 rounded-3xl overflow-hidden shadow-2xl">
               <img 
                 src={intelligentImg} 
                 alt="SkillPulse AI Platform Overview" 
                 className="rounded-2xl w-full h-auto object-cover"
               />
            </div>

            {/* Live Metrics Badge */}
            <div className="absolute -bottom-5 -left-5 z-20 bg-[#17233E] text-white p-5 rounded-2xl shadow-xl select-none border border-white/20">
               <div className="text-3xl font-black font-mono text-[#1988A3]">100%</div>
               <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A9CB7] mt-0.5">
                 PostgreSQL Telemetry Sync
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IMPACT METRICS BAR */}
      <section className="py-16 border-t border-b border-[#8A9CB7]/30 bg-white/40 backdrop-blur-md relative z-10">
        <div className="container mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
           {[
             { val: "5 Roles", label: "Multi-Tenant Governance" },
             { val: "100%", label: "Live Database Telemetry" },
             { val: "Real-Time", label: "Skill Gap Inference" },
             { val: "2.4s", label: "High-Performance Build" }
           ].map((stat, i) => (
             <div 
               key={i} 
               className="p-6 rounded-2xl glass-panel shadow-sm"
             >
               <div className="text-3xl md:text-4xl font-black text-[#17233E] mb-1 font-mono">
                 {stat.val}
               </div>
               <div className="text-[10px] font-mono font-bold text-[#5A6D89] uppercase tracking-widest">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="relative text-white py-20 px-6 text-center overflow-hidden z-10 mb-8">
        <div className="container mx-auto max-w-4xl relative z-10 rounded-[2.5rem] py-16 px-8 glass-hero-dark shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">Ready to Elevate Your Workforce Intelligence?</h2>
          <p className="text-[#E9EAF7]/85 text-base mb-8 max-w-xl mx-auto font-light">
            Discover how SkillPulse AI transforms skills tracking, gap detection, and workforce readiness across your enterprise.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/features"
              className="bg-white text-[#17233E] px-8 py-3.5 rounded-full font-extrabold text-sm transition-all shadow-xl hover:bg-[#E9EAF7]"
            >
              Explore All Features
            </Link>
            <Link 
              to="/pricing"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3.5 rounded-full font-bold text-sm transition-all"
            >
              View Pricing Tiers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
