import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

// Optional: Import your custom Tenant Context/Hook if available
// import { useTenant } from '../context/TenantContext';

const FeaturePage = () => {
  // Extract tenant ID or slug from route params for multi-tenant routing
  const { tenantId } = useParams(); 
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  // Mock Tenant State (Replace with your actual multi-tenant auth/tenant hook)
  const tenant = {
    name: "SkillPulse-AI",
    tier: "Enterprise",
    readinessScore: 82,
    enabledDashboards: ['Employee', 'Team Leader', 'HR Analytics', 'Admin Control Center']
  };

  const darkGradient = "bg-[linear-gradient(135deg,#0F172B_0%,#1E293B_50%,#312E81_100%)]";

  // Animation Variant definitions
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] } }
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
    { id: 'Employee', t: "Employee Dashboard", s: "Focus: Personal Growth", path: `${tenantBaseRoute}/dashboard/employee` },
    { id: 'Team Leader', t: "Team Leader Dashboard", s: "Focus: Team Performance", path: `${tenantBaseRoute}/dashboard/team` },
    { id: 'HR Analytics', t: "HR Analytics Dashboard", s: "Focus: Org-wide Metrics", path: `${tenantBaseRoute}/dashboard/hr` },
    { id: 'Admin Control Center', t: "Admin Control Center", s: "Focus: Security & Settings", path: `${tenantBaseRoute}/dashboard/admin` }
  ];

  // Filter dashboards based on tenant capabilities/feature flags
  const availableDashboards = allDashboards.filter(d => tenant.enabledDashboards.includes(d.id));

  return (
    <div className="bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Global CSS Inject for background atmosphere loops */}
      <style>{`
        @keyframes liquidDrift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -30px) scale(1.1); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-liquid { animation: liquidDrift 16s ease-in-out infinite; }
        .animate-spin-slow { animation: spinSlow 25s linear infinite; }
      `}</style>
      
      {/* 1. CORE CAPABILITIES HERO */}
      <section className="pt-6 pb-2 px-[4px] bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-[2.5rem] md:rounded-[4rem] py-16 md:py-20 px-6 md:px-16 overflow-hidden shadow-2xl"
          style={{
            background: `radial-gradient(circle at 70% 50%, #2E3759 0%, #171E35 45%, #0F172B 100%)`
          }}
        >
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none z-0 animate-liquid" />

          <div className="container mx-auto max-w-7xl relative z-10 text-left">
            {/* Dynamic Tenant Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
              <span className="text-slate-300 text-[12px] font-bold uppercase tracking-widest">
                {tenant.name} Multi-Tenant Capabilities
              </span>
            </div>
            
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] tracking-tight text-white mb-6">
                Powerful Features <br /> 
                Built for <br />
                <span className="text-indigo-400 inline-block drop-shadow-[0_0_20px_rgba(129,140,248,0.2)]">Workforce Intelligence</span>
              </h1>
              
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mb-8 opacity-90 font-light">
                Explore the AI-driven tools that power skill growth, performance tracking, and career development across your entire enterprise organization.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to={`${tenantBaseRoute}/demo`} className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-lg active:scale-95 transform hover:-translate-y-0.5 shadow-indigo-600/20 inline-block">
                  Request Live Demo
                </Link>
                
                <Link to={`${tenantBaseRoute}/pricing`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all backdrop-blur-sm active:scale-95 transform hover:-translate-y-0.5 inline-block">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. SKILL ASSESSMENT ENGINE */}
      <section className="py-28 px-6 md:px-20 bg-white">
        <div className="container mx-auto grid md:grid-cols-2 items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 shadow-inner group"
          >
            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[12px] font-bold px-3 py-1 rounded-full uppercase z-10 shadow-md">New Module</div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02]">
              <h4 className="text-xl font-bold mb-6 text-slate-800 border-b pb-4">Skill Assessment</h4>
              <div className="space-y-6">
                {[
                  { label: "Communication", val: 95, color: "bg-indigo-500" },
                  { label: "Leadership", val: 75, color: "bg-emerald-400" },
                  { label: "Product Management", val: 90, color: "bg-indigo-500" }
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-slate-500">
                      <span>{s.label}</span><span>{s.val}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
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
            <h2 className="text-4xl font-extrabold mb-8 text-slate-900 leading-tight">Skill Assessment Engine</h2>
            <p className="text-slate-500 font-semibold mb-10 leading-relaxed">Empower your employees with structured, intuitive assessments designed to capture a true picture of their current capabilities.</p>
            <div className="space-y-6">
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
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p className="text-slate-600"><span className="font-bold text-slate-900">{item.t}:</span> {item.d}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. AI SKILL GAP DETECTION */}
      <section className="py-28 px-6 md:px-20 bg-slate-50">
        <div className="container mx-auto grid md:grid-cols-2 items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-4xl font-extrabold mb-8 text-slate-900">AI Skill Gap Detection</h2>
            <p className="text-slate-500 text-lg mb-12">Our AI automatically compares employee performance and assessment data against target role requirements to identify and prioritize gaps.</p>
            <div className="grid grid-cols-2 gap-4">
              {['Gap Visualization', 'Priority Ranking', 'Risk Indicator', 'Department Insights'].map((f, idx) => (
                <motion.div 
                  key={f} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -5, borderColor: "rgb(129,140,248)", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
                  className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-all cursor-default"
                >
                  <h4 className="font-bold text-slate-900 text-sm mb-2">{f}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Detailed analysis and interactive data mapping.</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, type: "spring", stiffness: 60 }}
            style={{ perspective: 1000 }}
            className="order-1 md:order-2 bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-100 flex flex-col items-center group hover:shadow-2xl transition-shadow"
          >
            <h4 className="text-lg font-bold mb-8 text-slate-800">Skill Gap Visualization</h4>
            <div className="w-64 h-64 border-[1px] border-slate-200 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-8 border-[1px] border-slate-100 rounded-full"></div>
              <div className="absolute inset-16 border-[1px] border-slate-50 rounded-full"></div>
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[80px] border-r-transparent border-b-[120px] border-b-indigo-500/30 transform -rotate-12 absolute group-hover:scale-105 transition-transform duration-500"
              ></motion.div>
              <div className="absolute -top-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technical</div>
              <div className="absolute -right-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Soft Skills</div>
              <div className="absolute -left-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Domain</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. WORKFORCE READINESS SCORE */}
      <section className="py-32 px-6 md:px-20 bg-white">
        <div className="container mx-auto grid md:grid-cols-2 items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] py-20 border border-slate-100 group"
          >
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                <motion.circle 
                  initial={{ strokeDashoffset: 552.9 }}
                  whileInView={{ strokeDashoffset: 110 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552.9" className="text-emerald-500" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl font-black text-slate-800 tracking-tighter"
                >
                  {tenant.readinessScore}
                </motion.span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
              </div>
            </div>
            <p className="mt-8 font-bold text-slate-500 uppercase tracking-widest text-sm group-hover:text-slate-800 transition-colors">Org Workforce Readiness</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-extrabold mb-8">Workforce Readiness Score</h2>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed">A single, unified metric that quantifies how ready your team is for the challenges of tomorrow, powered by four key pillars:</p>
            <div className="space-y-4">
              {['Skill Proficiency', 'Learning Progress', 'Career Alignment', 'Project Suitability'].map((pillar, idx) => (
                <motion.div 
                  key={pillar} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all"
                >
                  <span className="font-bold text-slate-700 transition-colors group-hover:text-slate-900">{pillar}</span>
                  <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">→</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. ROLE-BASED DASHBOARDS (DYNAMIC MULTI-TENANT ROUTING) */}
      <section className="py-32 px-6 md:px-20 bg-slate-50">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Role-Based Dashboards</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Specific interfaces tailored for every stakeholder in your organization.</p>
        </div>
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          style={{ perspective: 1200 }}
          className="grid md:grid-cols-4 gap-8"
        >
          {availableDashboards.map((d, i) => (
            <motion.div 
              key={i} 
              variants={card3DVariant}
              whileHover={{ y: -10, z: 20, rotateY: 3 }}
            >
              <Link to={d.path} className="block group cursor-pointer bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="aspect-video bg-slate-200 rounded-2xl mb-6 overflow-hidden border border-slate-300 flex items-center justify-center group-hover:border-indigo-400 transition-all relative">
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors duration-300" />
                  <svg className="w-12 h-12 text-slate-400 group-hover:scale-110 group-hover:text-indigo-500 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <h4 className="font-bold text-slate-900 mb-1 pl-1 transition-colors group-hover:text-indigo-600">{d.t}</h4>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest pl-1">{d.s}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. ENTERPRISE SECURITY (UPDATED WITH MULTI-TENANT HIGHLIGHTS) */}
      <section className="py-32 px-6 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 60 }}
            className="w-full md:w-1/3 aspect-square bg-[#0F172B] rounded-[3rem] shadow-3xl flex items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
            <div className="absolute inset-[-50%] bg-gradient-to-tr from-indigo-500/0 via-white/5 to-indigo-500/0 transform rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            <svg className="w-32 h-32 text-indigo-500/40 group-hover:scale-110 group-hover:text-indigo-400 transition-all duration-500 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          </motion.div>
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-extrabold text-slate-900 mb-12"
            >
              Enterprise & Tenant Security
            </motion.h2>
            <div className="grid grid-cols-2 gap-12">
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
                  <h4 className="font-bold text-slate-900 mb-2 border-l-2 border-transparent hover:border-indigo-500 pl-2 transition-all">{s.t}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-32 px-6 md:px-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`${darkGradient} rounded-[3rem] py-24 text-center text-white border border-white/10 shadow-3xl relative overflow-hidden`}
        >
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

          <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight relative z-10">Ready to Transform <br /> Workforce Skills?</h2>
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <Link to={`${tenantBaseRoute}/register`} className="bg-indigo-600 hover:bg-indigo-500 px-12 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-98 hover:shadow-xl hover:shadow-indigo-600/20 inline-block">
              Start Free Trial
            </Link>
            <Link to={`${tenantBaseRoute}/demo`} className="bg-white/10 hover:bg-white/20 border border-white/20 px-12 py-4 rounded-2xl font-bold text-lg transition-all active:scale-98 inline-block">
              Schedule Demo
            </Link>
          </div>
        </motion.div>
      </section>  

    </div>
  );
};

export default FeaturePage;