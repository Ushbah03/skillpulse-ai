import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion'; 

import aboutImg from '../assets/images/about.png'; 
import intelligentImg from '../assets/images/image-sample.png';

const AboutPage = () => {
  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  // Stagger configurations to synchronize clean entryway streams
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const cardHoverStyle = {
    y: -8,
    scale: 1.01,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Dynamic ambient pulse routines */}
      <style>{`
        @keyframes floatSlow { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-15px) scale(1.04); } }
        @keyframes subtlePulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-subtle-pulse { animation: subtlePulse 5s ease-in-out infinite; }
      `}</style>
      
      {/* SECTION 1: HERO */}
      <section className="relative bg-[#0F172B] text-white pt-32 pb-64 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ background: `radial-gradient(circle at 50% 50%, #2E3759 0%, #171E35 45%, #0F172B 100%)` }}
        />
        <div className="absolute top-1/4 right-10 w-[450px] h-[450px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none animate-subtle-pulse" />
        
        <div className="container mx-auto max-w-6xl relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-tight">
              Redefining Workforce <br /> 
              <span className="text-indigo-400 drop-shadow-[0_0_30px_rgba(129,140,248,0.2)]">Intelligence with AI</span>
            </h1>
            <p className="text-slate-400 text-lg mb-6 max-w-md font-light leading-relaxed">
              SkillPulse-AI bridges the gap between talent potential and organizational growth using intelligent skill analytics.
            </p>
            <p className="text-slate-500 text-sm max-w-md italic tracking-wide">
              Our mission is to empower organizations with data-driven insights to build resilient, high-performing teams.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center relative group"
            style={{ perspective: 1000 }}
          >
             <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-3xl absolute opacity-50 pointer-events-none" />
             <motion.img 
               src={aboutImg} 
               alt="Intelligence Graph" 
               className="relative z-10 w-full animate-float-slow filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing" 
               whileHover={{ scale: 1.03, rotateZ: 1 }}
             />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: THE CHALLENGE */}
      <section className="relative z-20 -mt-32 bg-white rounded-t-[3.5rem] pt-24 pb-20 px-6 shadow-[0_-15px_40px_rgba(0,0,0,0.03)]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="container mx-auto text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">The Challenge Modern Organizations Face</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">Traditional performance management is reactive. SkillPulse-AI makes it predictive.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl"
        >
          {[
            { title: "Unidentified Skill Gaps", desc: "Most companies lack real-time understanding of where their capabilities end." },
            { title: "Static Performance Metrics", desc: "Legacy systems track history, not potential. They lack predictive intelligence." },
            { title: "Generic Learning Paths", desc: "L&D initiatives often follow a one-size-fits-all approach that fails." },
            { title: "Opaque Career Growth", desc: "Employees feel stuck because they don't know the path to promotion." }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={fadeInUp}
              whileHover={cardHoverStyle}
              className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-colors cursor-default flex flex-col group"
            >
              <div className="w-12 h-12 bg-indigo-100/70 text-indigo-600 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex items-center justify-center font-bold shadow-sm">
                0{i+1}
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800 group-hover:text-indigo-950 transition-colors">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 3: INTELLIGENT APPROACH */}
      <section className="py-24 px-6 bg-slate-50 overflow-hidden">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-[#0F172B] tracking-tight">Our Intelligent Approach</h2>
            <p className="text-slate-600 mb-10 leading-relaxed max-w-lg font-medium opacity-90">
              SkillPulse-AI integrates deep learning with human resources psychology to create a dynamic, adaptive intelligence layer for your workforce.
            </p>
            
            <div className="space-y-4">
              {[
                { text: "AI Skill Gap Detection Engine", color: "bg-indigo-500" },
                { text: "Workforce Readiness Scoring Engine", color: "bg-blue-500" },
                { text: "Learning Recommendation Engine", color: "bg-purple-500" },
                { text: "Career Path Prediction Model", color: "bg-sky-500" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,1)" }}
                  className="flex items-center gap-4 p-5 bg-white/60 backdrop-blur-sm rounded-[1.5rem] border border-slate-100 shadow-sm transition-all"
                >
                  <div className={`w-3 h-3 ${item.color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                  <span className="font-bold text-slate-800 text-sm tracking-wide">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Tilted Image Container */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 6 }}
            whileInView={{ opacity: 1, x: 0, rotate: 2 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            style={{ perspective: 1200 }}
            className="relative pt-10"
          >
            <motion.div 
              whileHover={{ rotate: 0, scale: 1.02, z: 20 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 bg-white p-3 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.08)] border border-slate-100 cursor-pointer"
            >
               <img 
                 src={intelligentImg} 
                 alt="SkillPulse Platform UI" 
                 className="rounded-[2rem] w-full h-auto object-cover"
               />
            </motion.div>

            {/* Floating Accuracy Badge */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, delay: 0.5 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              whileHover={{ scale: 1.08, rotate: -4 }}
              className="absolute -bottom-4 -left-8 z-20 bg-[#564df0] text-white p-8 rounded-[2rem] shadow-2xl transform -rotate-2 cursor-default select-none"
            >
               <div className="text-4xl font-black tracking-tighter">98%</div>
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90 mt-1 whitespace-nowrap">
                 Accuracy Rate
               </div>
            </motion.div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-200/30 blur-[100px] rounded-full z-0 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: STATS BAR */}
      <section className="py-20 border-t border-slate-100 bg-white">
        <div className="container mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           {[
             { val: "42%", label: "Skill Improvement" },
             { val: "95%", label: "Assessment Completion" },
             { val: "3x", label: "Learning Engagement" },
             { val: "89%", label: "Promotion Accuracy" }
           ].map((stat, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.85 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
               whileHover={{ y: -6, backgroundColor: "rgb(248,250,252)" }}
               className="p-8 rounded-3xl bg-slate-50 transition-colors duration-300 border border-transparent hover:border-slate-100"
             >
               <motion.div 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                 className="text-4xl font-black text-indigo-600 mb-2 tracking-tight"
               >
                 {stat.val}
               </motion.div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* SECTION 5: FOOTER CTA */}
      <section className="relative bg-[#0F172B] text-white py-24 px-6 text-center overflow-hidden group">
        <div className="absolute inset-0 opacity-20 transition-transform duration-1000 group-hover:scale-105" style={{ background: `radial-gradient(circle at 50% 50%, #4F46E5 0%, transparent 70%)` }} />
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight leading-tight">Join the Skill Intelligence Revolution</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to={tenantId ? `${tenantBaseRoute}/upgrade` : "/onboard"}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/contact-sales"
              className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-10 py-4 rounded-2xl font-bold transition-all active:scale-95"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;