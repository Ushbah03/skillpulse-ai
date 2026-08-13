import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  
  // Custom Enterprise Form State
  const [formData, setFormData] = useState({ email: '', companySize: '500-1000 employees', industry: 'Technology' });
  const [submitted, setSubmitted] = useState(false);

  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  // 1. Fully Aligned Plans Data with 5-Tier RBAC, Dedicated AI Engines, & Subdomain Routing
  const plans = [
    {
      name: "Starter",
      desc: "Best for small organizations starting with workforce skill assessments.",
      price: isYearly ? "39" : "49", 
      unit: "/user/mo",
      features: [
        "Employee Self-Service Dashboard", 
        "Company Admin Onboarding Portal",
        "Skill Assessment & Inference Engine", 
        "Basic Gap Analysis Matrix",
        "Single Tenant Workspace (Subdomain)",
        "Up to 25 users",
        "Standard Email Support"
      ],
      button: "Start Free Trial",
      targetPath: tenantId ? `${tenantBaseRoute}/upgrade?plan=starter` : `/onboard?plan=starter`,
      featured: false
    },
    {
      name: "Business",
      desc: "Advanced multi-tenant AI analytics for growing organizations.",
      price: isYearly ? "79" : "99",
      unit: "/user/mo",
      features: [
        "Everything in Starter", 
        "HR Manager & Team Leader Dashboards",
        "Advanced AI Skill Gap Detection Engine", 
        "Learning & Career Recommendation Engine",
        "AI Team Formation & Optimization",
        "Custom Subdomain (org.skillpulse.ai)",
        "Up to 200 users",
        "Priority Support & Onboarding"
      ],
      button: "Get Started",
      targetPath: tenantId ? `${tenantBaseRoute}/upgrade?plan=business` : `/onboard?plan=business`,
      featured: true
    },
    {
      name: "Enterprise",
      desc: "Custom multi-tenant deployments with dedicated data isolation.",
      price: "Custom",
      unit: "",
      features: [
        "Everything in Business", 
        "Full 5-Tier Role Access Control (RBAC)",
        "Super Admin System Governance",
        "Isolated Data Architecture (Database Partition)",
        "Custom Domain & Identity Integrations",
        "SAML 2.0 / Okta / Entra ID (SSO)",
        "Unlimited Users, Dedicated Manager & SLA"
      ],
      button: "Contact Sales",
      targetPath: `/contact-sales`,
      featured: false
    }
  ];

  // 2. Updated FAQs including Out-of-Scope Boundary Clarification
  const faqs = [
    {
      q: "Can I upgrade my workspace tier later?",
      a: "Yes, workspace administrators can upgrade or downgrade their organization's plan directly from the tenant settings menu at any time."
    },
    {
      q: "How is my organization's data isolated?",
      a: "SkillPulse-AI enforces logical multi-tenant isolation, ensuring your workforce metrics, assessments, and employee logs remain accessible only to authorized workspace users."
    },
    {
      q: "Do you offer custom SSO integrations?",
      a: "Yes, Enterprise tier workspaces support SAML 2.0, Okta, Microsoft Entra ID, and custom OAuth identity providers."
    },
    {
      q: "Does SkillPulse-AI include Payroll, ATS, or Attendance tracking?",
      a: "No. SkillPulse-AI is specialized strictly for Workforce Skill Intelligence, AI Gap Detection, and Career Pathing. It integrates seamlessly with existing HRIS/LMS platforms via webhooks rather than replacing transactional payroll or recruitment systems."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      <style>{`
        @keyframes orbitDrift {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.15); }
        }
        @keyframes shimmerGlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-bg-glow { animation: orbitDrift 16s ease-in-out infinite; }
        .featured-card-shimmer::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%; animation: shimmerGlow 6s infinite linear;
          pointer-events: none; border-radius: 2.5rem; z-index: 1;
        }
      `}</style>
      
      {/* HERO SECTION */}
      <section className="relative bg-[#0F172B] text-white pt-24 pb-64 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-70 animate-pulse duration-10000"
          style={{
            background: `radial-gradient(circle at 50% 40%, #1e1b4b 0%, #0F172B 75%)`
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none animate-bg-glow" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Simple, Transparent <span className="text-indigo-300 drop-shadow-[0_0_40px_rgba(165,180,252,0.25)]">Pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed"
          >
            Flexible multi-tenant plans designed for growing teams and enterprise organizations.
          </motion.p>
        </div>
      </section>

      {/* PRICING CARDS SECTION */}
      <section className="relative z-20 -mt-32">
        <div className="bg-white rounded-t-[3.5rem] pt-16 pb-24 px-6 shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
          <div className="container mx-auto">
            
            {/* Toggle Switch */}
            <div className="flex justify-center items-center gap-6 mb-20">
              <span className={`text-sm font-semibold transition-all duration-300 ${!isYearly ? 'text-indigo-600 scale-105 font-bold' : 'text-slate-400'}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="w-16 h-9 bg-slate-900 border border-slate-800 rounded-full relative transition-all duration-300 transform active:scale-90 shadow-md"
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  className="absolute top-[3px] w-7 h-7 bg-indigo-500 rounded-full shadow-lg" 
                  style={isYearly ? { right: '4px' } : { left: '4px' }}
                />
              </button>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold transition-all duration-300 ${isYearly ? 'text-indigo-600 scale-105 font-bold' : 'text-slate-400'}`}>Yearly</span>
                <motion.span 
                  animate={isYearly ? { scale: [1, 1.15, 1], backgroundColor: "rgba(224,231,255,1)" } : { scale: 1 }}
                  className="bg-indigo-50 text-indigo-600 text-[11px] font-bold px-3 py-1 rounded-full border border-indigo-100 shadow-sm"
                >
                  Save 20%
                </motion.span>
              </div>
            </div>

            {/* Cards Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch"
            >
              {plans.map((plan, i) => (
                <motion.div 
                  key={i} 
                  variants={cardVariants}
                  whileHover={{ 
                    y: -12, 
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.08), 0 0 0 1px rgba(79,70,229,0.05)",
                    transition: { duration: 0.4, ease: "easeOut" } 
                  }}
                  className={`relative flex flex-col bg-slate-50/50 rounded-[2.5rem] p-10 border transition-all duration-500 ${plan.featured ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-2xl bg-white md:scale-105 z-10 featured-card-shimmer' : 'border-slate-100 hover:border-slate-300 hover:bg-white'}`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-5 py-1.5 rounded-full uppercase tracking-widest shadow-[0_4px_20px_rgba(79,70,229,0.4)] z-10">
                      Most Popular
                    </span>
                  )}
                  
                  <h3 className={`text-3xl font-bold mb-3 ${plan.featured ? 'text-indigo-600' : 'text-slate-900'}`}>{plan.name}</h3>
                  <p className="text-slate-500 text-sm mb-10 leading-relaxed min-h-[40px]">{plan.desc}</p>
                  
                  {/* Fixed Pricing Display Logic */}
                  <div className="flex items-baseline gap-1 mb-10 overflow-hidden h-14">
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={plan.price}
                        initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-5xl font-black tracking-tight text-slate-950"
                      >
                        {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-slate-400 font-medium">{plan.unit}</span>
                  </div>

                  {/* Feature Lists */}
                  <div className="space-y-4 mb-12 flex-grow">
                    {plan.features.map((f, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -5 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3 text-sm text-slate-700"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] shrink-0 shadow-sm ${plan.name === 'Enterprise' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}>
                          ✔
                        </div>
                        <span className="leading-tight font-medium opacity-90">{f}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Dynamic Router Action Link */}
                  <Link 
                    to={plan.targetPath}
                    className={`w-full py-4 rounded-2xl font-bold text-sm text-center transition-all duration-300 shadow-sm block ${plan.featured ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30' : plan.name === 'Enterprise' ? 'bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white' : 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                  >
                    {plan.button}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Compare Workspace Features</h2>
            <p className="text-slate-500 font-medium">Detailed breakdown of enterprise multi-tenant capabilities.</p>
          </motion.div>
          
          <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="py-6 px-8 font-bold text-slate-900">Features</th>
                  <th className="py-6 font-bold text-slate-400">Starter</th>
                  <th className="py-6 font-bold text-indigo-600">Business</th>
                  <th className="py-6 px-8 font-bold text-slate-400">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { f: "Data Isolation", s: "Shared Infrastructure", b: "Logical Partition", e: "Dedicated / Isolated" },
                  { f: "AI Gap Analysis", s: "Basic Inference", b: "Advanced AI Engine", e: "Custom Model Tuning" },
                  { f: "Role-Based Dashboards", s: "Employee & Admin", b: "HR Manager & Team Lead", e: "Full 5-Tier RBAC" },
                  { f: "SSO & SAML", s: "—", b: "OAuth 2.0", e: "SAML 2.0 / Custom SSO" },
                  { f: "Custom Domain", s: "—", b: "Subdomain Routing", e: "Custom Enterprise Domain" },
                  { f: "Dedicated Support", s: "Email", b: "Priority Email", e: "24/7 Dedicated SLA" }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-8 font-semibold text-slate-700">{row.f}</td>
                    <td className="py-6 text-slate-500">{row.s}</td>
                    <td className="py-6 text-slate-900 font-semibold">{row.b}</td>
                    <td className="py-6 px-8 text-slate-500">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CUSTOM ENTERPRISE QUOTE SECTION */}
      <section className="py-24 px-6 bg-slate-50 overflow-hidden">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 items-center gap-16">
          <div>
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Need a custom multi-tenant solution?</h2>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-light">
              We offer tailored deployments for large enterprises requiring custom identity integrations, dedicated tenant databases, and custom SLA agreements.
            </p>
            <ul className="space-y-4">
              {["Isolated private cloud option", "Full SOC2 and GDPR compliance documentation", "Volume discounts for 500+ employee licenses"].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-700 font-semibold text-sm">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">✓</div> {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-2xl font-bold mb-8 text-slate-900">Request Enterprise Workspace</h3>
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 font-bold">✓</div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Request Submitted!</h4>
                <p className="text-slate-500 text-sm">Our enterprise onboarding team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Work Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="jane@company.com" 
                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Company Size</label>
                    <select 
                      value={formData.companySize}
                      onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-700 font-medium"
                    >
                      <option>500-1000 employees</option>
                      <option>1000+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Industry</label>
                    <select 
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-700 font-medium"
                    >
                      <option>Technology</option>
                      <option>Finance & Banking</option>
                      <option>Healthcare</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 bg-[#0F172B] text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md tracking-wide"
                >
                  Submit Consultation Request
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500 font-medium">Answers regarding multi-tenant billing and enterprise deployment.</p>
        </div>
        
        <div className="container mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`rounded-2xl border overflow-hidden transition-all duration-300 ${openIndex === i ? 'border-indigo-200 bg-slate-50/20' : 'border-slate-100 bg-white'}`}>
              <div 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="p-6 flex justify-between items-center cursor-pointer select-none"
              >
                <span className={`font-bold ${openIndex === i ? 'text-indigo-600' : 'text-slate-800'}`}>{faq.q}</span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs ${openIndex === i ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 text-slate-500'}`}>
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
                    <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed">
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