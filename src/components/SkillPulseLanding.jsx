import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import dashboardImg from '../assets/images/intro-image.jpg';

const SkillPulseLanding = () => {
  // Extract tenant slug or workspace ID from route parameters if present
  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  const mainGradient = "bg-[linear-gradient(135deg,#0F172B_0%,#1E293B_50%,#312E81_100%)]";

  // Animation Variants
  const intenseUp = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
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
    <div className="bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-25px) rotate(3deg); } }
        @keyframes float-reverse { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(20px) rotate(-4deg); } }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(15px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(15px) rotate(-360deg); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.15; transform: scale(1) translateY(-50%); } 50% { opacity: 0.3; transform: scale(1.15) translateY(-45%); } }
        .animate-float-1 { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 10s ease-in-out infinite; }
        .animate-orbit { animation: orbit 12s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 7s ease-in-out infinite; }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="pt-6 pb-2 px-[4px] bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-[2.5rem] md:rounded-[4rem] py-16 md:py-24 px-6 md:px-16 overflow-hidden shadow-2xl"
          style={{
            background: `radial-gradient(circle at 75% 50%, #2E3759 0%, #171E35 50%, #0F172B 100%)`
          }}
        >
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-float-1" />
          <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none animate-float-2" />
          <div className="absolute top-1/2 right-0 w-[700px] h-[700px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none z-0 animate-pulse-glow" />

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
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-6 backdrop-blur-md cursor-pointer transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]"
              >
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                <span className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                  {tenantId ? `${tenantId} Enterprise Workspace` : "SkillPulse-AI Multi-Tenant Platform"}
                </span>
              </motion.div>

              <motion.h1 
                variants={intenseUp}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-6"
              >
                AI-Powered Skill <br />
                Intelligence for <br />
                Modern Teams
              </motion.h1>

              <motion.p 
                variants={intenseUp}
                className="text-slate-400 text-base md:text-lg leading-relaxed max-w-md mb-8 opacity-90"
              >
                Measure readiness. Close skill gaps. Accelerate workforce growth with tenant-isolated data insights.
              </motion.p>

              <motion.div variants={intenseUp} className="flex flex-wrap gap-4">
                <Link 
                  to={`${tenantBaseRoute}/register`} 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:-translate-y-1 active:scale-95 transform duration-300 inline-block"
                >
                  Get Started
                </Link>
                <Link 
                  to={`${tenantBaseRoute}/demo`} 
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all backdrop-blur-sm hover:-translate-y-1 active:scale-95 transform duration-300 shadow-lg inline-block"
                >
                  Request Demo
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, x: 80, y: 20, rotate: 2 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              transition={{ duration: 1.4, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="relative group hidden lg:block animate-float-1"
            >
               <div className="absolute -inset-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-[100px] rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="relative bg-[#1A1F2E]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-700 group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/10 group-hover:scale-[1.02]">
                  <img 
                    src={dashboardImg} 
                    alt="SkillPulse Dashboard Preview" 
                    className="rounded-[1.2rem] w-full opacity-95 transition-transform duration-700 group-hover:scale-[1.01]" 
                  />
               </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="py-28 px-6 md:px-20 text-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">Unlock Your Workforce Potential</h2>
          <p className="text-slate-500 text-lg mb-20 max-w-2xl mx-auto font-semibold">Actionable intelligence to align your team's capabilities with strategic goals.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container mx-auto grid md:grid-cols-3 gap-10 font-semibold relative z-10"
        >
          {[
            { title: "AI Skill Gap Analysis", desc: "Automatically detect critical skill deficiencies across enterprise teams and predict future hiring needs.", dot: "bg-indigo-400" },
            { title: "Workforce Readiness", desc: "Quantify your organization's preparedness with dynamic, real-time readiness scoring models.", dot: "bg-purple-400" },
            { title: "Multi-Tenant Security", desc: "Enterprise-grade isolated data architecture supporting custom SSO and role-based access.", dot: "bg-blue-400" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={intenseUp}
              whileHover={{ y: -15, scale: 1.03, boxShadow: "0 35px 60px -15px rgba(99,102,241,0.12)" }}
              className="p-10 border border-slate-100 rounded-[2.5rem] text-left hover:border-indigo-200 transition-all duration-500 bg-white group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`w-12 h-6 ${item.dot} opacity-20 rounded-full mb-8 relative group-hover:scale-x-125 transition-transform duration-500`} />
              <h3 className="font-bold text-3xl mb-4 text-slate-800 group-hover:text-indigo-900 transition-colors duration-300">{item.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed font-normal">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-28 bg-slate-50 px-6 md:px-20 overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 relative z-10"
        >
          <h2 className="text-5xl font-extrabold text-slate-900 mb-4">How SkillPulse Works</h2>
          <p className="text-slate-500 text-lg font-semibold">A streamlined process to continuously elevate your organizational capabilities.</p>
        </motion.div>
        
        <div className="container mx-auto relative z-10">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 -translate-y-12 opacity-70"></div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8 relative font-semibold"
          >
            {[
              { num: "01", t: "Assess Skills", d: "Baseline evaluations using role-specific frameworks." },
              { num: "02", t: "Analyze Gaps", d: "AI-driven mapping against organizational requirements." },
              { num: "03", t: "Recommend Learning", d: "Targeted courses and personalized growth tasks." },
              { num: "04", t: "Improve Readiness", d: "Monitor growth and updated enterprise readiness scores." }
            ].map((step, i) => (
              <motion.div key={i} variants={intenseUp} className="flex flex-col items-center text-center group">
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 360, boxShadow: "0 0 25px rgba(99,102,241,0.4)" }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-white border-2 border-indigo-500 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mb-6 z-10 shadow-lg group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 cursor-pointer"
                >
                  {step.num}
                </motion.div>
                <h4 className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors duration-300">{step.t}</h4>
                <p className="text-slate-500 text-sm px-4 font-normal">{step.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. EMPOWERING EVERY ROLE (DYNAMIC DASHBOARD NAVIGATION) */}
      <section className="py-28 px-6 md:px-20 bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-extrabold text-slate-900 mb-4">Empowering Every Role</h2>
          <p className="text-slate-500 text-lg font-semibold">Role-scoped dashboards tailored for individual and organizational success.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container mx-auto grid md:grid-cols-3 gap-8"
        >
          {[
            { 
              role: "Employees", 
              path: `${tenantBaseRoute}/dashboard/employee`,
              points: ["Personalized learning feeds", "Transparent promotion criteria", "Skill endorsement tracking"] 
            },
            { 
              role: "Team Leaders", 
              path: `${tenantBaseRoute}/dashboard/team`,
              points: ["Team readiness dashboards", "Project resourcing insights", "Performance trend analysis"] 
            },
            { 
              role: "HR & Admin Control", 
              path: `${tenantBaseRoute}/dashboard/admin`,
              points: ["Org-wide skill matrices", "Multi-tenant access control", "L&D budget optimization"] 
            }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={intenseUp}
              whileHover={{ y: -12, scale: 1.02 }}
              className="p-10 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-slate-100 rounded-xl mb-6 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-500 relative overflow-hidden">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:bg-white group-hover:scale-[6] transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">{item.role}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed font-normal">Take control with dedicated role-based analytics and management features.</p>
                <ul className="space-y-3 mb-8">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="text-slate-600 text-sm flex items-center gap-2 transform transition-transform duration-300 hover:translate-x-2">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full group-hover:bg-indigo-600 transition-colors" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={item.path} className="text-indigo-600 font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                Access Workspace Dashboard →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. INTELLIGENCE SECTION */}
      <section className="py-2 px-[4px] bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
          className={`${mainGradient} relative w-full rounded-[2.5rem] md:rounded-[4rem] py-20 md:py-24 px-8 md:px-20 overflow-hidden shadow-2xl border border-white/10`}
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse" />

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
                      <p className="text-indigo-100/60 text-sm md:text-base leading-relaxed">
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
               <div className="bg-white/5 backdrop-blur-md border border-white/10 h-[350px] md:h-[400px] rounded-[2.5rem] md:rounded-[3.5rem] shadow-3xl flex items-center justify-center overflow-hidden group hover:border-white/20 transition-all duration-500">
                  <div className="relative w-3/4 h-1/2 border-2 border-dashed border-indigo-500/30 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:border-indigo-400 group-hover:scale-105">
                      <div className="absolute inset-0 bg-indigo-500/5 animate-pulse rounded-2xl"></div>
                      <div className="absolute w-4 h-4 border-t-2 border-l-2 border-indigo-400 top-2 left-2 animate-orbit" />
                      <span className="text-indigo-300 font-mono text-xs uppercase tracking-[0.4em] relative z-10 transition-all group-hover:text-white duration-500">
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
      <section className="py-32 px-6 md:px-20 overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
          className={`${mainGradient} w-full max-w-6xl mx-auto rounded-[3rem] py-24 px-10 text-center text-white border border-white/10 shadow-3xl relative overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-out pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 relative z-10 tracking-tight">Transform Workforce Skills with AI</h2>
          <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto opacity-80 leading-relaxed relative z-10 font-normal">
            Join leading enterprise teams building future-ready organizations with isolated, data-driven platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <Link to={`${tenantBaseRoute}/register`} className="bg-white text-indigo-900 px-12 py-4 rounded-full font-extrabold text-lg hover:bg-indigo-50 transition transform hover:scale-110 shadow-2xl active:scale-95 duration-300 inline-block">
              Start Free Trial
            </Link>
            <Link to={`${tenantBaseRoute}/contact`} className="bg-transparent border border-white/30 px-12 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition transform hover:scale-110 active:scale-95 duration-300 inline-block">
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default SkillPulseLanding;