import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Check, Sparkles, HelpCircle, ShieldCheck, Zap, ArrowRight, Building2, Send } from 'lucide-react';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  
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
      <section className="relative pt-16 sm:pt-20 pb-12 sm:pb-16 px-6 text-center overflow-hidden z-10">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1988A3]/10 border border-[#1988A3]/25 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#1988A3] animate-pulse" />
            <span className="text-[#1988A3] text-xs font-bold uppercase tracking-widest font-mono">
              FLEXIBLE MULTI-TENANT PRICING
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-[#17233E]">
            Predictable Plans for Every <br />
            <span className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] bg-clip-text text-transparent">
              Stage of Growth
            </span>
          </h1>

          <p className="text-[#5A6D89] text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Scale workforce skill intelligence, gap detection, and AI recommendations with complete multi-tenant governance.
          </p>

          {/* Clean Segmented Billing Selector */}
          <div className="inline-flex items-center p-1.5 bg-white/70 border border-white/90 rounded-full backdrop-blur-xl shadow-md">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                !isYearly 
                  ? 'bg-[#17233E] text-white shadow-md shadow-[#17233E]/20' 
                  : 'text-[#5A6D89] hover:text-[#17233E]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isYearly 
                  ? 'bg-[#17233E] text-white shadow-md shadow-[#17233E]/20' 
                  : 'text-[#5A6D89] hover:text-[#17233E]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-[#1988A3]/15 text-[#1988A3] border border-[#1988A3]/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. PRICING CARDS SECTION */}
      <section className="py-6 sm:py-10 px-3 sm:px-6 md:px-12 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative flex flex-col rounded-3xl p-6 sm:p-8 md:p-10 glass-panel transition-all duration-300 ${
                  plan.featured 
                    ? 'border-[#1988A3] shadow-[0_20px_50px_rgba(25,136,163,0.18)] ring-2 ring-[#1988A3]/25 bg-white/80' 
                    : 'hover:border-[#1988A3]/40'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1988A3] text-white text-[10px] font-mono font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-md z-10">
                    {plan.badge}
                  </span>
                )}
                
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#17233E] mb-2">{plan.name}</h3>
                <p className="text-[#5A6D89] text-xs leading-relaxed mb-6 min-h-[36px] font-normal">{plan.desc}</p>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-6">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={plan.price}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="text-4xl md:text-5xl font-black text-[#17233E] tracking-tight"
                    >
                      {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[#5A6D89] text-sm font-medium">{plan.unit}</span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8 flex-grow border-t border-[#8A9CB7]/20 pt-6">
                  <p className="text-[11px] font-mono font-bold text-[#1988A3] uppercase tracking-wider mb-2">INCLUDED FEATURES</p>
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#17233E]">
                      <div className="w-4 h-4 rounded-full bg-[#1988A3]/15 border border-[#1988A3]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#1988A3]" />
                      </div>
                      <span className="leading-normal font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Action Link Button */}
                <Link 
                  to={plan.targetPath}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm text-center transition-all duration-300 block shadow-md ${
                    plan.featured 
                      ? 'bg-[#1988A3] hover:bg-[#157289] text-white shadow-lg shadow-[#1988A3]/25 hover:shadow-[#1988A3]/40' 
                      : 'bg-[#17233E] hover:bg-[#1B3154] text-white shadow-[#17233E]/20'
                  }`}
                >
                  {plan.button}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURE COMPARISON MATRIX */}
      <section className="py-16 px-6 md:px-12 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              DETAILED COMPARISON
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#17233E] mb-3">Workspace Feature Matrix</h2>
            <p className="text-[#5A6D89] text-base max-w-xl mx-auto font-normal">Granular capability breakdown across all deployment tiers.</p>
          </div>
          
          <div className="overflow-x-auto rounded-3xl glass-panel shadow-xl -mx-2 sm:mx-0">
            <table className="w-full min-w-[580px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#8A9CB7]/30 bg-[#E9EAF7]/50">
                  <th className="py-4.5 px-6 font-bold text-[#17233E] text-sm">Capabilities</th>
                  <th className="py-4.5 px-6 font-bold text-[#5A6D89] text-sm">Starter</th>
                  <th className="py-4.5 px-6 font-bold text-[#1988A3] text-sm">Pro Plan</th>
                  <th className="py-4.5 px-6 font-bold text-[#17233E] text-sm">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#8A9CB7]/20">
                {[
                  { f: "User Role Access", s: "Employee & Admin", b: "Employee, Lead, HR & Admin", e: "Tenant Roles (Up to 1000 Seats)" },
                  { f: "AI Skill Analytics", s: "Self-Assessment Engine", b: "AI Gap Detection & Recs", e: "AI Gap Detection & Department Trends" },
                  { f: "Training & Growth", s: "Skill Profile", b: "Assign Learning & Career Paths", e: "LMS Webhooks & Succession" },
                  { f: "Governance & Audit", s: "Tenant Management", b: "Department Reports", e: "Audit Trail Logs & Access Policies" },
                  { f: "Integrations Hub", s: "-", b: "Standard API Access", e: "HRIS & LMS Webhooks" },
                  { f: "User Seat Limit", s: "30 Seats", b: "250 Seats", e: "1,000 Seats" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#E9EAF7]/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#17233E]">{row.f}</td>
                    <td className="py-4 px-6 text-[#5A6D89] font-mono">{row.s}</td>
                    <td className="py-4 px-6 text-[#1988A3] font-bold font-mono">{row.b}</td>
                    <td className="py-4 px-6 text-[#17233E] font-bold font-mono">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 px-6 md:px-12 relative z-10 mb-12">
        <div className="text-center mb-10">
          <span className="px-3.5 py-1.5 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#17233E] mb-3">Frequently Asked Questions</h2>
          <p className="text-[#5A6D89] text-base max-w-xl mx-auto font-normal">Key details on multi-tenant billing, security, and scope boundary.</p>
        </div>
        
        <div className="container mx-auto max-w-3xl space-y-3.5">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                openIndex === i ? 'glass-panel border-[#1988A3]/60 shadow-md' : 'glass-panel hover:border-[#8A9CB7]/50'
              }`}
            >
              <div 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="p-5 flex justify-between items-center cursor-pointer select-none"
              >
                <span className={`font-semibold text-sm ${openIndex === i ? 'text-[#1988A3]' : 'text-[#17233E]'}`}>{faq.q}</span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs transition-colors ${openIndex === i ? 'border-[#1988A3] bg-[#1988A3] text-white' : 'border-[#8A9CB7]/40 text-[#5A6D89]'}`}>
                  {openIndex === i ? '-' : '+'}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="p-5 pt-0 text-[#5A6D89] text-xs leading-relaxed font-normal border-t border-[#8A9CB7]/15">
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
