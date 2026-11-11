import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Check, Sparkles, ShieldCheck, Zap, ArrowLeft, Building2, HelpCircle } from 'lucide-react';
import VisitorBackdrop from './VisitorBackdrop';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedTier, setSelectedTier] = useState(1); // 0: Starter, 1: Pro, 2: Enterprise
  
  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  // 1. Plans Data matching exact seat limits (Starter: 30, Pro: 250, Enterprise: 1000)
  // Stair Progression: Starter (Step 1) -> Pro (Step 2) -> Enterprise (Step 3)
  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      shortTitle: "Starter",
      seatHighlight: "30 User Seats",
      stairClass: "md:mt-14 lg:mt-16", // Step 1 (Bottom step)
      stepNumber: "01",
      desc: "Essential skill assessment and taxonomy management for small teams.",
      subDesc: "Ideal for small teams & skill baselines",
      price: isYearly ? "500" : "600", 
      unit: "/month",
      badge: isYearly ? "Save 20%" : "Essential",
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
    },
    {
      id: "pro",
      name: "Pro Plan",
      shortTitle: "Pro Plan",
      seatHighlight: "250 User Seats",
      stairClass: "md:mt-7 lg:mt-8", // Step 2 (Middle step)
      stepNumber: "02",
      desc: "Comprehensive AI gap detection, team leadership, and HR analytics for growing companies.",
      subDesc: "Ideal for mid-sized squads & AI analytics",
      price: isYearly ? "1000" : "1200",
      unit: "/month",
      badge: "Most popular",
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
    },
    {
      id: "enterprise",
      name: "Enterprise",
      shortTitle: "Enterprise",
      seatHighlight: "1,000 User Seats",
      stairClass: "md:mt-0", // Step 3 (Top step)
      stepNumber: "03",
      desc: "Large-scale organization intelligence with 1,000 user seats and global integrations.",
      subDesc: "Ideal for large enterprises & global governance",
      price: isYearly ? "2000" : "2500",
      unit: "/month",
      badge: "Enterprise Scale",
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

  const handleSelectTier = (idx) => {
    setSelectedTier(idx);
    const element = document.getElementById(plans[idx].id);
    if (element && window.innerWidth < 768) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="bg-[#E9EAF7] bg-gradient-to-b from-[#E9EAF7] via-[#E2EEFA] to-[#DCEAF8] font-sans text-[#17233E] overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative min-h-screen">
      <VisitorBackdrop />

      {/* 1. TOP HEADER & INTERACTIVE TIER SEGMENT SELECTOR */}
      <section className="relative pt-8 sm:pt-14 pb-6 sm:pb-10 px-4 sm:px-6 overflow-hidden z-10">
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          
          {/* Top Bar with Back Link & Title */}
          <div className="flex items-center justify-between max-w-md mx-auto mb-5 sm:mb-7">
            <Link 
              to="/" 
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[#8A9CB7]/30 flex items-center justify-center text-[#17233E] hover:text-[#1988A3] transition-all shadow-xs cursor-pointer"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1988A3]">
              Pricings
            </span>
            <div className="w-9 h-9" /> {/* Spacer */}
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-3 tracking-tight leading-tight text-[#17233E]">
            Pricing on your terms
          </h1>
          <p className="text-[#5A6D89] text-xs sm:text-base max-w-md mx-auto font-normal leading-relaxed mb-6 sm:mb-8">
            Scale workforce skill intelligence, gap detection, and AI recommendations with complete multi-tenant governance.
          </p>

          {/* Interactive Tier Segment Pill Bar */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-white/80 border border-white/90 backdrop-blur-xl shadow-md mb-5 max-w-full overflow-x-auto">
            {plans.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectTier(idx)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 ${
                  selectedTier === idx
                    ? 'bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] text-white shadow-md shadow-[#17233E]/20'
                    : 'text-[#5A6D89] hover:text-[#17233E]'
                }`}
              >
                {p.shortTitle}
              </button>
            ))}
          </div>

          {/* Dynamic Billing Selector (Monthly vs Annual - Required for Tests) */}
          <div className="flex items-center justify-center gap-3">
            <div className="inline-flex items-center p-1.5 bg-white/70 border border-white/90 rounded-full backdrop-blur-xl shadow-md">
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 cursor-pointer ${
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
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
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

        </div>
      </section>

      {/* 2. STAIR-FORM TACTILE PRICING CARDS (Ascending Stair Formation: Step 1 -> Step 2 -> Step 3) */}
      <section className="py-6 sm:py-12 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="container mx-auto max-w-7xl">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
            {plans.map((plan, i) => {
              const isSelected = selectedTier === i;

              return (
                <div 
                  key={i}
                  id={plan.id}
                  onClick={() => setSelectedTier(i)}
                  className={`relative flex flex-col rounded-[2.2rem] p-5 sm:p-7 transition-all duration-300 cursor-pointer overflow-hidden ${plan.stairClass} ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#172744] via-[#101C31] to-[#0D1726] border-2 border-[#11C6DE] shadow-[0_25px_60px_rgba(25,136,163,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)] ring-2 ring-[#11C6DE]/40 scale-[1.02] text-white'
                      : 'bg-gradient-to-b from-[#142036]/90 via-[#0F182A]/90 to-[#0B1324]/90 border border-white/15 hover:border-[#11C6DE]/40 hover:bg-[#142036] shadow-xl text-white'
                  }`}
                >
                  {/* Card Specular Rim Highlight */}
                  <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                  {/* Top Ambient Glow for Selected Tier */}
                  {isSelected && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#11C6DE]/25 blur-3xl pointer-events-none rounded-full" />
                  )}

                  {/* 1. Upper Tier Header Pod with Watermark Glyph (Exact Reference Match) */}
                  <div className="relative mb-5 pb-5 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#11C6DE] bg-[#11C6DE]/15 px-1.5 py-0.5 rounded">
                          {plan.stepNumber}
                        </span>
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white/60">
                          Upgrade to {plan.name}
                        </h3>
                      </div>
                      <div className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-white via-white to-[#11C6DE] bg-clip-text text-transparent">
                        {plan.seatHighlight}
                      </div>
                    </div>

                    {/* Stylized Node Watermark in Upper Right */}
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#11C6DE]/45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  </div>

                  {/* 2. Main Price Display & Badge */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-baseline gap-1">
                        <AnimatePresence mode="wait">
                          <motion.span 
                            key={plan.price}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
                          >
                            ${plan.price}
                          </motion.span>
                        </AnimatePresence>
                        <span className="text-white/50 text-xs sm:text-sm font-medium">{plan.unit}</span>
                      </div>

                      {/* Pill Badge */}
                      {plan.badge && (
                        <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border shadow-xs ${
                          plan.featured
                            ? 'bg-[#11C6DE]/20 text-[#11C6DE] border-[#11C6DE]/50 shadow-[0_0_12px_rgba(17,198,222,0.3)]'
                            : 'bg-white/10 text-white/80 border-white/20'
                        }`}>
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-white/60 text-xs font-normal leading-relaxed">
                      {plan.subDesc}
                    </p>
                  </div>

                  {/* 3. Features List with Sparkle Diamonds (Exact Look from Reference Image) */}
                  <div className="space-y-3 mb-8 flex-grow pt-4 border-t border-white/10">
                    {plan.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-white/90">
                        <span className="text-[#11C6DE] text-sm shrink-0 leading-none mt-0.5 select-none font-bold">
                          ✦
                        </span>
                        <span className="leading-relaxed font-normal">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* 4. Action Button (Glowing Pill on Selected, Frosted Glass Pill on Other) */}
                  <Link 
                    to={plan.targetPath}
                    className={`w-full py-3.5 rounded-full font-bold text-xs sm:text-sm text-center transition-all duration-300 block tracking-wide cursor-pointer select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#1988A3] via-[#11C6DE] to-[#60EFFF] hover:from-[#157289] hover:via-[#0FB5CB] hover:to-[#4AE8FA] text-[#0B1528] font-black shadow-[0_0_25px_rgba(17,198,222,0.45)] hover:shadow-[0_0_35px_rgba(17,198,222,0.65)] transform hover:scale-[1.01]'
                        : 'bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#11C6DE]/40 text-white shadow-xs'
                    }`}
                  >
                    {plan.button}
                  </Link>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. FEATURE COMPARISON MATRIX (Integrated Glass Container) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 md:px-12 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] text-xs font-mono font-bold uppercase tracking-wider inline-block mb-3.5">
              DETAILED COMPARISON
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#17233E] mb-2 sm:mb-3">
              Workspace Feature Matrix
            </h2>
            <p className="text-[#5A6D89] text-xs sm:text-base max-w-xl mx-auto font-normal">
              Granular capability breakdown across all deployment tiers.
            </p>
          </div>
          
          <div className="overflow-x-auto rounded-3xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-xl -mx-2 sm:mx-0">
            <table className="w-full min-w-[580px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#8A9CB7]/30 bg-[#17233E] text-white">
                  <th className="py-4.5 px-6 font-bold text-sm">Capabilities</th>
                  <th className="py-4.5 px-6 font-bold text-white/70 text-sm">Starter</th>
                  <th className="py-4.5 px-6 font-bold text-[#11C6DE] text-sm">Pro Plan</th>
                  <th className="py-4.5 px-6 font-bold text-white text-sm">Enterprise</th>
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
                  <tr key={i} className="hover:bg-[#E9EAF7]/50 transition-colors">
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
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 relative z-10 mb-8 sm:mb-12">
        <div className="text-center mb-6 sm:mb-10">
          <span className="px-3 py-1 rounded-full bg-[#17233E]/10 border border-[#17233E]/20 text-[#17233E] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider inline-block mb-2.5 sm:mb-3.5">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#17233E] mb-2 sm:mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-[#5A6D89] text-xs sm:text-base max-w-xl mx-auto font-normal">
            Key details on multi-tenant billing, security, and scope boundary.
          </p>
        </div>
        
        <div className="container mx-auto max-w-3xl space-y-3.5">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`rounded-2xl transition-all duration-300 overflow-hidden bg-white/75 backdrop-blur-xl border ${
                openIndex === i ? 'border-[#1988A3]/60 shadow-md' : 'border-white/80 hover:border-[#8A9CB7]/50'
              }`}
            >
              <div 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="p-4 sm:p-5 flex justify-between items-center cursor-pointer select-none"
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
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="p-4 sm:p-5 pt-0 text-[#5A6D89] text-xs sm:text-sm leading-relaxed font-normal border-t border-[#8A9CB7]/15">
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
