import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Check, Sparkles, HelpCircle, ShieldCheck, Zap, ArrowRight, Building2, Send } from 'lucide-react';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  
  // Custom Enterprise Form State
  const [formData, setFormData] = useState({ email: '', companySize: '500-1000 employees', industry: 'Technology' });
  const [submitted, setSubmitted] = useState(false);

  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  // 1. Plans Data with exact seat limits (Starter: 30, Pro: 250, Enterprise: 1000)
  const plans = [
    {
      name: "Starter Plan",
      desc: "Essential skill assessment and taxonomy management for small teams.",
      price: isYearly ? "500" : "600", 
      unit: "/month",
      features: [
        "30 User Seats",
        "Employee Dashboard & Skill Profiles", 
        "Company Admin Control Center",
        "Skill Taxonomy Management", 
        "Skill Assessment Engine",
        "PostgreSQL Secure Data Workspace"
      ],
      button: "Select Starter Plan",
      targetPath: tenantId ? `${tenantBaseRoute}/upgrade?plan=starter` : `/signup?plan=starter`,
      featured: false,
      badge: null
    },
    {
      name: "Pro Plan",
      desc: "Comprehensive AI gap detection, team leadership, and HR analytics for growing companies.",
      price: isYearly ? "1000" : "1200",
      unit: "/month",
      features: [
        "Everything in Starter Plan", 
        "250 User Seats",
        "HR Manager Analytics Dashboard",
        "Team Leader Dashboard & Member Profiles",
        "AI Skill Gap Detection Engine", 
        "AI Course Recommendations & Career Paths",
        "Assign Learning Programs"
      ],
      button: "Select Pro Plan",
      targetPath: tenantId ? `${tenantBaseRoute}/upgrade?plan=pro` : `/signup?plan=pro`,
      featured: true,
      badge: "MOST POPULAR"
    },
    {
      name: "Enterprise",
      desc: "Large-scale organization intelligence with 1,000 user seats and global integrations.",
      price: isYearly ? "2000" : "2500",
      unit: "/month",
      features: [
        "Everything in Pro Plan", 
        "1,000 User Seats",
        "Tenant Role Governance (Admin, HR, Lead, Employee)",
        "Global Integrations Hub (HRIS & LMS Connectors)",
        "System Audit Trail Logs & Access Policies",
        "Dedicated Account Management & High Availability SLA"
      ],
      button: "Select Enterprise Plan",
      targetPath: tenantId ? `${tenantBaseRoute}/upgrade?plan=enterprise` : `/signup?plan=enterprise`,
      featured: false,
      badge: "ENTERPRISE SCALE"
    }
  ];

  // 2. FAQs
  const faqs = [
    {
      q: "Can I upgrade or downgrade my workspace plan later?",
      a: "Yes, workspace administrators can adjust their organization's plan directly from the tenant settings menu at any time."
    },
    {
      q: "How is my organization's data isolated?",
      a: "SkillPulse AI enforces logical multi-tenant isolation, ensuring your workforce metrics, assessments, and employee logs remain strictly accessible to authorized workspace users."
    },
    {
      q: "Do you offer custom SSO & SAML integrations?",
      a: "Yes, Business and Enterprise tier workspaces support SAML 2.0, Okta, Microsoft Entra ID, and custom OAuth identity providers."
    },
    {
      q: "Does SkillPulse AI include Payroll, ATS, or Attendance tracking?",
      a: "No. SkillPulse AI is specialized strictly for Workforce Skill Intelligence, AI Gap Detection, and Career Pathing. It integrates with existing HRIS/LMS platforms via APIs/webhooks."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0B1120] font-sans text-slate-100 overflow-x-hidden selection:bg-indigo-600 selection:text-white relative min-h-screen">
      {/* Keyframe Animations & Background Glow */}
      <style>{`
        @keyframes aurora { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -30px) scale(1.1); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-aurora { animation: aurora 14s ease-in-out infinite; }
        .animate-float { animation: float-slow 8s ease-in-out infinite; }
      `}</style>
      
      {/* Global Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 blur-[160px] rounded-full animate-aurora" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-purple-600/15 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-1/4 right-10 w-[650px] h-[650px] bg-indigo-900/20 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* 1. HERO HEADER */}
      <section className="relative text-white pt-24 pb-16 px-6 text-center overflow-hidden z-10">
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest font-mono">
              FLEXIBLE MULTI-TENANT PRICING
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight leading-tight"
          >
            Predictable Plans for Every <br />
            <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Stage of Growth
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            Scale workforce skill intelligence, gap detection, and AI recommendations with complete multi-tenant governance.
          </motion.p>

          {/* Clean Segmented Billing Selector */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center p-1.5 bg-[#0F172B]/90 border border-slate-800 rounded-full backdrop-blur-xl shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                !isYearly 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isYearly 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. PRICING CARDS SECTION */}
      <section className="py-8 sm:py-12 px-3 sm:px-6 md:px-12 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          >
            {plans.map((plan, i) => (
              <motion.div 
                key={i} 
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`relative flex flex-col bg-[#0F172B]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border transition-all duration-300 ${
                  plan.featured 
                    ? 'border-indigo-500/80 shadow-[0_0_50px_rgba(79,70,229,0.25)] ring-1 ring-indigo-500/50 bg-gradient-to-b from-indigo-950/40 via-[#0F172B] to-[#0F172B]' 
                    : 'border-slate-800/80 hover:border-slate-700 hover:shadow-xl'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-mono font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg z-10 border border-indigo-400/30">
                    {plan.badge}
                  </span>
                )}
                
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-8 min-h-[36px] font-light">{plan.desc}</p>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={plan.price}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="text-4xl md:text-5xl font-black text-white tracking-tight"
                    >
                      {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-slate-400 text-sm font-medium">{plan.unit}</span>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-10 flex-grow border-t border-slate-800/80 pt-6">
                  <p className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2">INCLUDED FEATURES</p>
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-indigo-400" />
                      </div>
                      <span className="leading-normal font-light">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Action Link Button */}
                <Link 
                  to={plan.targetPath}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm text-center transition-all duration-300 block shadow-md ${
                    plan.featured 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:scale-[1.02]' 
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {plan.button}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURE COMPARISON MATRIX */}
      <section className="py-20 px-6 md:px-12 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
              DETAILED COMPARISON
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Workspace Feature Matrix</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto font-light">Granular capability breakdown across all deployment tiers.</p>
          </div>
          
          <div className="overflow-x-auto rounded-3xl border border-slate-800/80 bg-[#0F172B]/80 backdrop-blur-xl shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/60">
                  <th className="py-5 px-6 font-bold text-slate-300 text-sm">Capabilities</th>
                  <th className="py-5 px-6 font-bold text-slate-400 text-sm">Starter</th>
                  <th className="py-5 px-6 font-bold text-indigo-400 text-sm">Pro Plan</th>
                  <th className="py-5 px-6 font-bold text-purple-400 text-sm">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800/50">
                {[
                  { f: "User Role Access", s: "Employee & Admin", b: "Employee, Lead, HR & Admin", e: "Tenant Roles (Up to 1000 Seats)" },
                  { f: "AI Skill Analytics", s: "Self-Assessment Engine", b: "AI Gap Detection & Recs", e: "AI Gap Detection & Department Trends" },
                  { f: "Training & Growth", s: "Skill Profile", b: "Assign Learning & Career Paths", e: "LMS Webhooks & Succession" },
                  { f: "Governance & Audit", s: "Tenant Management", b: "Department Reports", e: "Audit Trail Logs & Access Policies" },
                  { f: "Integrations Hub", s: "—", b: "Standard API Access", e: "HRIS & LMS Webhooks" },
                  { f: "User Seat Limit", s: "30 Seats", b: "250 Seats", e: "1,000 Seats" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-200">{row.f}</td>
                    <td className="py-4 px-6 text-slate-400 font-mono">{row.s}</td>
                    <td className="py-4 px-6 text-indigo-300 font-semibold font-mono">{row.b}</td>
                    <td className="py-4 px-6 text-purple-300 font-semibold font-mono">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>



      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 px-6 md:px-12 relative z-10">
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-light">Key details on multi-tenant billing, security, and scope boundary.</p>
        </div>
        
        <div className="container mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === i ? 'border-indigo-500/50 bg-[#0F172B]/90' : 'border-slate-800/80 bg-[#0F172B]/60 hover:border-slate-700'
              }`}
            >
              <div 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="p-6 flex justify-between items-center cursor-pointer select-none"
              >
                <span className={`font-semibold text-sm ${openIndex === i ? 'text-indigo-300' : 'text-slate-200'}`}>{faq.q}</span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs transition-colors ${openIndex === i ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-700 text-slate-400'}`}>
                  {openIndex === i ? '−' : '+'}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="p-6 pt-0 text-slate-400 text-xs leading-relaxed font-light border-t border-slate-800/50">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PricingPage;