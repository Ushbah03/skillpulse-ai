import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheck, Cpu, Activity, Zap, ArrowRight, Layers, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

import hrPreview from '../assets/images/hr_dashboard_preview.png';
import adminPreview from '../assets/images/company_admin_preview.png';
import employeePreview from '../assets/images/employee_dashboard_preview.png';
import teamLeaderPreview from '../assets/images/team_leader_preview.png';

const FeaturePage = () => {
  const { tenantId } = useParams(); 

  const tenant = {
    name: "SkillPulse-AI",
    tier: "Enterprise",
    readinessScore: 82,
    enabledDashboards: ['Employee', 'Team Leader', 'HR Analytics', 'Admin Control Center']
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  // Multi-Tenant Role-Based Dashboard Configuration
  const allDashboards = [
    { id: 'Employee', t: "Employee Dashboard", s: "Focus: Personal Growth", path: `/dashboard`, img: employeePreview, color: "from-[#1988A3]/20 to-[#17233E]/20" },
    { id: 'Team Leader', t: "Team Leader Dashboard", s: "Focus: Team Performance", path: `/team-leader`, img: teamLeaderPreview, color: "from-[#17233E]/20 to-[#1B3154]/20" },
    { id: 'HR Analytics', t: "HR Analytics Dashboard", s: "Focus: Org-wide Metrics", path: `/hr-dashboard`, img: hrPreview, color: "from-[#1988A3]/20 to-[#11C6DE]/20" },
    { id: 'Admin Control Center', t: "Admin Control Center", s: "Focus: Security & Settings", path: `/company-admin`, img: adminPreview, color: "from-[#1B3154]/20 to-[#8A9CB7]/20" }
  ];

  const availableDashboards = allDashboards.filter(d => tenant.enabledDashboards.includes(d.id));

  return (
    <div className="bg-[#E9EAF7] font-sans text-[#17233E] overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative min-h-screen">
      {/* Global Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#1988A3]/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#8A9CB7]/25 blur-[140px] rounded-full" />
        <div className="absolute bottom-1/4 right-10 w-[650px] h-[650px] bg-[#1B3154]/8 blur-[160px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#8A9CB7_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* 1. HERO HEADER */}
      <section className="relative pt-16 sm:pt-20 pb-16 px-6 text-center overflow-hidden z-10">
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-[#1988A3]/10 border border-[#1988A3]/25 px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 bg-[#1988A3] rounded-full animate-ping"></span>
            <span className="text-[#1988A3] text-[11px] font-bold uppercase tracking-widest font-mono">
              {tenant.name} Enterprise Capabilities
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-[#17233E]"
          >
            Powerful Features Built for <br />
            <span className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] bg-clip-text text-transparent">
              Workforce Intelligence
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-[#5A6D89] text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-8"
          >
            Explore the AI-driven tools that power skill growth, performance tracking, and career development across your entire enterprise organization.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/contact" className="bg-[#1988A3] hover:bg-[#157289] text-white px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#1988A3]/25 inline-flex items-center gap-2">
                Request Live Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/pricing" className="bg-white/80 hover:bg-white border border-[#8A9CB7]/40 text-[#17233E] px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all shadow-sm inline-block">
                View Pricing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. SKILL ASSESSMENT ENGINE */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-14">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative bg-white/85 rounded-[2.5rem] p-8 sm:p-10 border border-white shadow-[0_12px_35px_rgba(23,35,62,0.06)] backdrop-blur-xl group hover:border-[#1988A3]/40 transition-all text-left"
          >
            <div className="absolute top-4 right-4 bg-[#17233E] text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase z-10 shadow-sm">
              Prisma DB Synced
            </div>
            <div className="bg-[#E9EAF7]/60 rounded-2xl p-6 sm:p-8 border border-[#8A9CB7]/30 transition-all duration-300">
              <h4 className="text-xl font-extrabold mb-6 text-[#17233E] border-b border-[#8A9CB7]/30 pb-4 flex items-center justify-between">
                <span>Skill Assessment Engine</span>
                <Sparkles className="w-5 h-5 text-[#1988A3]" />
              </h4>
              <div className="space-y-5">
                {[
                  { label: "Communication & Collaboration", val: 95, color: "bg-[#1988A3]" },
                  { label: "Leadership & Management", val: 75, color: "bg-[#17233E]" },
                  { label: "Product Architecture & AI", val: 90, color: "bg-[#5A6D89]" }
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-[#17233E] font-mono">
                      <span>{s.label}</span><span>{s.val}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${s.val}%` }} />
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
            className="text-left"
          >
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              ASSESSMENT FRAMEWORK
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 text-[#17233E] leading-tight">Skill Assessment Engine</h2>
            <p className="text-[#5A6D89] text-base md:text-lg font-normal mb-8 leading-relaxed">Empower your employees with structured, intuitive assessments designed to capture a true picture of their current capabilities.</p>
            <div className="space-y-4">
              {[
                { t: "Role-based assessments", d: "Content specifically tailored to over 500+ standard industry roles." },
                { t: "Real-time scoring", d: "Immediate feedback loops that provide granular proficiency levels." },
                { t: "Progress tracking", d: "Historical snapshots to visualize growth over quarterly cycles." }
              ].map((item, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#1988A3]/15 border border-[#1988A3]/30 text-[#1988A3] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-[#5A6D89] text-sm leading-relaxed"><span className="font-bold text-[#17233E]">{item.t}:</span> {item.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. AI SKILL GAP DETECTION */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-14">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 text-left"
          >
            <span className="px-3.5 py-1.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              PREDICTIVE ANALYSIS
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 text-[#17233E]">AI Skill Gap Detection</h2>
            <p className="text-[#5A6D89] text-base md:text-lg mb-8 font-normal leading-relaxed">Our AI automatically compares employee performance and assessment data against target role requirements to identify and prioritize gaps.</p>
            <div className="grid grid-cols-2 gap-4">
              {['Gap Visualization', 'Priority Ranking', 'Risk Indicator', 'Department Insights'].map((f) => (
                <div 
                  key={f} 
                  className="p-5 bg-white/85 border border-white rounded-2xl shadow-[0_8px_25px_rgba(23,35,62,0.05)] hover:border-[#1988A3]/40 transition-all cursor-default"
                >
                  <h4 className="font-bold text-[#17233E] text-sm mb-1 flex items-center justify-between">
                    <span>{f}</span>
                    <Zap className="w-3.5 h-3.5 text-[#1988A3]" />
                  </h4>
                  <p className="text-xs text-[#5A6D89] font-normal leading-relaxed">Detailed analysis & interactive data mapping.</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2 bg-white/85 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_12px_35px_rgba(23,35,62,0.06)] border border-white flex flex-col items-center backdrop-blur-xl"
          >
            <h4 className="text-lg font-extrabold mb-8 text-[#17233E] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#1988A3]" />
              <span>Skill Gap Vector Visualization</span>
            </h4>
            <div className="w-64 h-64 border border-[#8A9CB7]/40 rounded-full flex items-center justify-center relative bg-[#E9EAF7]/50">
              <div className="absolute inset-8 border border-[#8A9CB7]/30 rounded-full"></div>
              <div className="absolute inset-16 border border-[#8A9CB7]/20 rounded-full"></div>
              <div className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[80px] border-r-transparent border-b-[120px] border-b-[#1988A3]/40 transform -rotate-12 absolute"></div>
              <div className="absolute -top-6 text-[10px] font-mono font-bold text-[#17233E] uppercase tracking-widest">Technical</div>
              <div className="absolute -right-10 text-[10px] font-mono font-bold text-[#1988A3] uppercase tracking-widest">Soft Skills</div>
              <div className="absolute -left-10 text-[10px] font-mono font-bold text-[#5A6D89] uppercase tracking-widest">Domain</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. WORKFORCE READINESS SCORE */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-14">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center bg-white/85 rounded-[2.5rem] py-14 border border-white shadow-[0_12px_35px_rgba(23,35,62,0.06)] backdrop-blur-xl"
          >
            <div className="relative w-44 h-44">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[#E9EAF7]" />
                <circle 
                  cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="502.6" strokeDashoffset="90" className="text-[#1988A3]" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-[#17233E] tracking-tight">
                  {tenant.readinessScore}
                </span>
                <span className="text-xs font-mono font-bold text-[#5A6D89] uppercase tracking-widest mt-1">Score / 100</span>
              </div>
            </div>
            <p className="mt-6 font-mono font-bold text-[#1988A3] uppercase tracking-widest text-xs flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Org Workforce Readiness</span>
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              UNIFIED INDEX
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 text-[#17233E]">Workforce Readiness Score</h2>
            <p className="text-[#5A6D89] text-base md:text-lg mb-8 font-normal leading-relaxed">A single, unified metric that quantifies how ready your team is for upcoming business goals, powered by four key pillars:</p>
            <div className="space-y-3">
              {['Skill Proficiency', 'Learning Progress', 'Career Alignment', 'Project Suitability'].map((pillar) => (
                <div 
                  key={pillar} 
                  className="p-4 bg-white/85 rounded-2xl border border-white flex justify-between items-center shadow-sm"
                >
                  <span className="font-bold text-[#17233E] text-sm">{pillar}</span>
                  <span className="text-[#1988A3] font-bold text-xs uppercase font-mono">Synced</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. ROLE-BASED DASHBOARDS */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl text-center mb-12">
          <span className="px-3.5 py-1.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            ROLE GOVERNANCE
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#17233E] mb-3">Role-Based Dashboards</h2>
          <p className="text-[#5A6D89] text-base md:text-lg max-w-2xl mx-auto font-normal">Specific interfaces tailored for every stakeholder in your organization.</p>
        </div>
        <div className="container mx-auto max-w-7xl grid md:grid-cols-4 gap-6">
          {availableDashboards.map((d, i) => (
            <div key={i}>
              <Link to={d.path} className="block group cursor-pointer bg-white/90 backdrop-blur-xl p-5 rounded-3xl border border-white hover:border-[#1988A3]/40 shadow-[0_10px_30px_rgba(23,35,62,0.06)] hover:shadow-xl transition-all duration-300 text-left">
                <div className="aspect-video bg-[#E9EAF7] rounded-2xl mb-4 overflow-hidden border border-[#8A9CB7]/30 group-hover:border-[#1988A3]/40 transition-all relative flex items-center justify-center">
                  {d.img ? (
                    <img 
                      src={d.img} 
                      alt={d.t} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="p-3 text-center">
                      <span className="text-xs font-mono font-bold text-[#17233E]">{d.id} UI</span>
                    </div>
                  )}
                </div>
                <h4 className="font-extrabold text-[#17233E] mb-1 pl-1 transition-colors group-hover:text-[#1988A3] text-base">{d.t}</h4>
                <p className="text-[10px] font-mono font-bold text-[#5A6D89] uppercase tracking-widest pl-1">{d.s}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ENTERPRISE SECURITY */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14 text-left">
          <div className="w-full md:w-1/3 aspect-square bg-[#17233E] border border-white/20 rounded-[2.5rem] shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <Lock className="w-24 h-24 text-[#1988A3] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex-1">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              COMPLIANCE & ISOLATION
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#17233E] mb-8">
              Enterprise & Tenant Security
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { t: "Isolated Tenant Data", d: "Logical data isolation ensured across all organization accounts." },
                { t: "GDPR & SOC2 Compliant", d: "Strict data privacy standards across global deployments." },
                { t: "Custom SSO & SAML", d: "Tenant-specific identity integration (Okta, Azure AD, OAuth)." },
                { t: "256-bit Encryption", d: "Data fully encrypted in transit and isolated at rest." }
              ].map((s, i) => (
                <div key={i}>
                  <h4 className="font-bold text-[#17233E] mb-1 border-l-2 border-[#1988A3] pl-3 text-sm">{s.t}</h4>
                  <p className="text-[#5A6D89] text-xs leading-relaxed font-normal">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-16 px-4 md:px-8 relative z-10 mb-8">
        <div 
          className="max-w-5xl mx-auto rounded-[3rem] py-16 px-8 text-center text-white border border-white/20 shadow-2xl relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, #17233E 0%, #1B3154 50%, #1988A3 100%)`
          }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight relative z-10">Ready to Transform <br /> Workforce Skills?</h2>
          <div className="flex flex-wrap justify-center gap-5 relative z-10">
            <Link to="/signup" className="bg-white text-[#17233E] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-extrabold text-sm sm:text-base hover:bg-[#E9EAF7] transition shadow-2xl inline-flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4 text-[#1988A3]" />
            </Link>
            <Link to="/contact" className="bg-white/10 border border-white/30 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-white/20 transition inline-block backdrop-blur-md">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturePage;
