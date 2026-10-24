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

  const allDashboards = [
    { id: 'Employee', t: "Employee Dashboard", s: "Focus: Personal Growth", path: `/dashboard`, img: employeePreview },
    { id: 'Team Leader', t: "Team Leader Dashboard", s: "Focus: Team Performance", path: `/team-leader`, img: teamLeaderPreview },
    { id: 'HR Analytics', t: "HR Analytics Dashboard", s: "Focus: Org-wide Metrics", path: `/hr-dashboard`, img: hrPreview },
    { id: 'Admin Control Center', t: "Admin Control Center", s: "Focus: Security & Settings", path: `/company-admin`, img: adminPreview }
  ];

  const availableDashboards = allDashboards.filter(d => tenant.enabledDashboards.includes(d.id));

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
      <section className="relative pt-16 sm:pt-20 pb-16 px-6 text-center overflow-hidden z-10">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1988A3]/10 border border-[#1988A3]/25 px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <span className="w-2 h-2 bg-[#1988A3] rounded-full animate-ping"></span>
            <span className="text-[#1988A3] text-[11px] font-bold uppercase tracking-widest font-mono">
              {tenant.name} Enterprise Capabilities
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-[#17233E]">
            Powerful Features Built for <br />
            <span className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] bg-clip-text text-transparent">
              Workforce Intelligence
            </span>
          </h1>

          <p className="text-[#5A6D89] text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Explore the AI-driven tools that power skill growth, performance tracking, and career development across your entire enterprise organization.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-[#1988A3] hover:bg-[#157289] text-white px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#1988A3]/25 inline-flex items-center gap-2">
              Request Live Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/pricing" className="bg-white/70 hover:bg-white border border-white/90 text-[#17233E] px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all shadow-sm inline-block">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SKILL ASSESSMENT ENGINE */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-14">
          <div className="relative glass-panel rounded-[2.5rem] p-8 sm:p-10 text-left">
            <div className="absolute top-4 right-4 bg-[#17233E] text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase z-10 shadow-sm">
              Prisma DB Synced
            </div>
            <div className="bg-[#E9EAF7]/50 rounded-2xl p-6 sm:p-8 border border-white/80">
              <h4 className="text-xl font-extrabold mb-6 text-[#17233E] border-b border-[#8A9CB7]/20 pb-4 flex items-center justify-between">
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
                    <div className="w-full h-2.5 bg-white/80 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-left">
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
          </div>
        </div>
      </section>

      {/* 3. AI SKILL GAP DETECTION */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-14">
          <div className="order-2 md:order-1 text-left">
            <span className="px-3.5 py-1.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              PREDICTIVE ANALYSIS
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 text-[#17233E]">AI Skill Gap Detection</h2>
            <p className="text-[#5A6D89] text-base md:text-lg mb-8 font-normal leading-relaxed">Our AI automatically compares employee performance and assessment data against target role requirements to identify and prioritize gaps.</p>
            <div className="grid grid-cols-2 gap-4">
              {['Gap Visualization', 'Priority Ranking', 'Risk Indicator', 'Department Insights'].map((f) => (
                <div 
                  key={f} 
                  className="p-5 glass-panel rounded-2xl hover:border-[#1988A3]/40 transition-all cursor-default"
                >
                  <h4 className="font-bold text-[#17233E] text-sm mb-1 flex items-center justify-between">
                    <span>{f}</span>
                    <Zap className="w-3.5 h-3.5 text-[#1988A3]" />
                  </h4>
                  <p className="text-xs text-[#5A6D89] font-normal leading-relaxed">Detailed analysis & interactive data mapping.</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2 glass-panel rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center">
            <h4 className="text-lg font-extrabold mb-8 text-[#17233E] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#1988A3]" />
              <span>Skill Gap Vector Visualization</span>
            </h4>
            <div className="w-64 h-64 border border-[#8A9CB7]/30 rounded-full flex items-center justify-center relative bg-white/40">
              <div className="absolute inset-8 border border-[#8A9CB7]/25 rounded-full"></div>
              <div className="absolute inset-16 border border-[#8A9CB7]/15 rounded-full"></div>
              <div className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[80px] border-r-transparent border-b-[120px] border-b-[#1988A3]/40 transform -rotate-12 absolute"></div>
              <div className="absolute -top-6 text-[10px] font-mono font-bold text-[#17233E] uppercase tracking-widest">Technical</div>
              <div className="absolute -right-10 text-[10px] font-mono font-bold text-[#1988A3] uppercase tracking-widest">Soft Skills</div>
              <div className="absolute -left-10 text-[10px] font-mono font-bold text-[#5A6D89] uppercase tracking-widest">Domain</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFORCE READINESS SCORE */}
      <section className="py-16 md:py-20 px-6 md:px-20 relative z-10">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-14">
          <div className="flex flex-col items-center justify-center glass-panel rounded-[2.5rem] py-14 px-8 text-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 176 176">
                <circle 
                  cx="88" 
                  cy="88" 
                  r="74" 
                  stroke="currentColor" 
                  strokeWidth="14" 
                  fill="transparent" 
                  className="text-[#8A9CB7]/25" 
                />
                <circle 
                  cx="88" 
                  cy="88" 
                  r="74" 
                  stroke="currentColor" 
                  strokeWidth="14" 
                  fill="transparent" 
                  strokeDasharray="465" 
                  strokeDashoffset={465 * (1 - (tenant.readinessScore / 100))} 
                  strokeLinecap="round"
                  className="text-[#1988A3] transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
                <span className="text-5xl font-black text-[#17233E] tracking-tight leading-none mb-1">
                  {tenant.readinessScore}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#5A6D89] uppercase tracking-wider">
                  SCORE / 100
                </span>
              </div>
            </div>
            <p className="mt-6 font-mono font-bold text-[#1988A3] uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Org Workforce Readiness</span>
            </p>
          </div>
          
          <div className="text-left">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              UNIFIED INDEX
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 text-[#17233E]">Workforce Readiness Score</h2>
            <p className="text-[#5A6D89] text-base md:text-lg mb-8 font-normal leading-relaxed">A single, unified metric that quantifies how ready your team is for upcoming business goals, powered by four key pillars:</p>
            <div className="space-y-3">
              {['Skill Proficiency', 'Learning Progress', 'Career Alignment', 'Project Suitability'].map((pillar) => (
                <div 
                  key={pillar} 
                  className="p-4 glass-panel rounded-2xl flex justify-between items-center"
                >
                  <span className="font-bold text-[#17233E] text-sm">{pillar}</span>
                  <span className="text-[#1988A3] font-bold text-xs uppercase font-mono">Synced</span>
                </div>
              ))}
            </div>
          </div>
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
              <Link to={d.path} className="block group cursor-pointer glass-panel p-5 rounded-3xl hover:border-[#1988A3]/40 transition-all duration-300 text-left">
                <div className="aspect-video bg-[#E9EAF7]/80 rounded-2xl mb-4 overflow-hidden border border-[#8A9CB7]/20 group-hover:border-[#1988A3]/40 transition-all relative flex items-center justify-center">
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
          <div className="w-full md:w-1/3 aspect-square glass-panel rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group">
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
        <div className="max-w-5xl mx-auto rounded-[3rem] py-16 px-8 text-center glass-hero-dark text-white relative overflow-hidden">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight relative z-10">Ready to Transform <br /> Workforce Skills?</h2>
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

export default FeaturePage;
