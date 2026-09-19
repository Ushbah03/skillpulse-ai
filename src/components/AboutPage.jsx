import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { Sparkles, Target, Cpu, BrainCircuit, Users, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

import aboutImg from '../assets/images/about.png'; 
import intelligentImg from '../assets/images/image-sample.png';

const AboutPage = () => {
  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-[#0B1120] font-sans text-slate-100 overflow-x-hidden selection:bg-indigo-600 selection:text-white relative min-h-screen">
      {/* Keyframe Animations & Background Canvas */}
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-16px) rotate(2deg); } }
        @keyframes float-reverse { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(16px) rotate(-2deg); } }
        @keyframes aurora { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -30px) scale(1.1); } }
        .animate-float-1 { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 10s ease-in-out infinite; }
        .animate-aurora { animation: aurora 14s ease-in-out infinite; }
      `}</style>
      
      {/* Global Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 blur-[160px] rounded-full animate-aurora" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-purple-600/15 blur-[150px] rounded-full animate-float-1" />
        <div className="absolute bottom-1/4 right-10 w-[650px] h-[650px] bg-indigo-900/20 blur-[180px] rounded-full animate-float-2" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* 1. HERO HEADER */}
      <section className="relative text-white pt-24 pb-20 px-6 overflow-hidden z-10">
        <div className="container mx-auto max-w-6xl relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest font-mono">
                ABOUT SKILLPULSE AI
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-5 tracking-tight">
              Redefining Workforce <br /> 
              <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                Intelligence with AI
              </span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base mb-5 font-light leading-relaxed">
              SkillPulse AI bridges the gap between talent potential and organizational growth using real-time skill analytics and PostgreSQL-backed workforce telemetry.
            </p>
            <p className="text-slate-400 text-xs border-l-2 border-indigo-500 pl-4 py-1 font-mono italic">
              Our mission is empowering organizations with data-driven insights to build resilient, high-performing engineering and enterprise teams.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center relative group"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
             <motion.img 
               src={aboutImg} 
               alt="Intelligence Radar Visual" 
               className="relative z-10 w-full max-w-md animate-float-1 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" 
               whileHover={{ scale: 1.03, rotate: 1 }}
             />
          </motion.div>
        </div>
      </section>

      {/* 2. THE CHALLENGES WE SOLVE */}
      <section className="py-20 px-6 md:px-12 relative z-10">
        <div className="container mx-auto text-center mb-16 max-w-3xl">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
            WORKFORCE DISCONNECTS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">The Challenges Modern Organizations Face</h2>
          <p className="text-slate-400 text-base font-light">Traditional performance reviews are static and manual. SkillPulse AI makes talent management predictive and continuous.</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl"
        >
          {[
            { title: "Unidentified Skill Gaps", desc: "Organizations struggle to pinpoint exact technical skill deficiencies across departments." },
            { title: "Static Performance Logs", desc: "Legacy tools track historical attendance instead of active skill development and growth." },
            { title: "Generic Learning Paths", desc: "One-size-fits-all training courses fail to target individual employee skill gaps." },
            { title: "Opaque Career Pathways", desc: "Employees lack clear visibility into role benchmarks required for promotion." }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl border border-slate-800/80 bg-[#0F172B]/90 backdrop-blur-xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col group shadow-xl"
            >
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex items-center justify-center font-bold font-mono text-sm">
                0{i+1}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-300 transition-colors">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. OUR INTELLIGENT ARCHITECTURE */}
      <section className="py-20 px-6 md:px-12 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
              PLATFORM ARCHITECTURE
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Our Intelligent Approach</h2>
            <p className="text-slate-400 text-base mb-8 leading-relaxed font-light">
              SkillPulse AI connects live PostgreSQL databases with specialized AI inference engines to provide real-time skill intelligence across all enterprise levels.
            </p>
            
            <div className="space-y-4">
              {[
                { title: "Real-Time AI Skill Gap Detection", desc: "Analyzes verified employee skill profiles against department benchmarks." },
                { title: "Workforce Readiness Scoring", desc: "Computes overall readiness percentage and flags critical missing competencies." },
                { title: "Personalized Course Recommendations", desc: "Matches active skill gaps directly with indexed training courses." },
                { title: "5-Tier Role-Based Access Control", desc: "Seamless governance for Employees, Team Leads, HR Managers, Company Admins, and Superadmins." }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-4 p-4 bg-[#0F172B]/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 hover:border-indigo-500/30 transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-xs font-light">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Image Framing */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative pt-6"
          >
            <div className="relative z-10 bg-[#0F172B]/90 p-3 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
               <img 
                 src={intelligentImg} 
                 alt="SkillPulse AI Platform Overview" 
                 className="rounded-2xl w-full h-auto object-cover border border-slate-800"
               />
            </div>

            {/* Live Metrics Badge */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-6 -left-6 z-20 bg-indigo-600 border border-indigo-400/30 text-white p-6 rounded-2xl shadow-2xl select-none"
            >
               <div className="text-3xl font-black font-mono">100%</div>
               <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-200 mt-0.5">
                 PostgreSQL Telemetry Sync
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. IMPACT METRICS BAR */}
      <section className="py-20 border-t border-b border-slate-800/80 bg-[#0F172B]/50 relative z-10">
        <div className="container mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           {[
             { val: "5 Roles", label: "Multi-Tenant Governance" },
             { val: "100%", label: "Live Database Telemetry" },
             { val: "Real-Time", label: "Skill Gap Inference" },
             { val: "2.4s", label: "High-Performance Build" }
           ].map((stat, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -4 }}
               className="p-6 rounded-2xl bg-[#0F172B]/90 border border-slate-800/80"
             >
               <div className="text-3xl md:text-4xl font-extrabold text-indigo-400 mb-2 font-mono">
                 {stat.val}
               </div>
               <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="relative text-white py-24 px-6 text-center overflow-hidden z-10">
        <div className="container mx-auto max-w-3xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">Ready to Elevate Your Workforce Intelligence?</h2>
          <p className="text-slate-400 text-base mb-10 max-w-xl mx-auto font-light">
            Discover how SkillPulse AI transforms skills tracking, gap detection, and workforce readiness across your enterprise.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/features"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:scale-105"
            >
              Explore All Features
            </Link>
            <Link 
              to="/pricing"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
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