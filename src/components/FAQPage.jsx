import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Mail, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQPage = () => {
  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState('What is SkillPulse AI?');

  const categories = [
    "All", "General", "Platform Features", "AI & Analytics", 
    "Security & RBAC", "Pricing & Seats", "Integrations"
  ];

  const faqs = [
    // General
    {
      category: "General",
      question: "What is SkillPulse AI?",
      answer: "SkillPulse AI is an enterprise workforce intelligence platform designed to map employee skills, detect technical proficiency gaps, and deliver data-backed career and learning recommendations."
    },
    {
      category: "General",
      question: "How does SkillPulse AI benefit modern organizations?",
      answer: "It replaces static performance reviews with live skill matrix analytics, automated gap detection, and data-backed team formation for project leads and HR managers."
    },
    // Platform Features
    {
      category: "Platform Features",
      question: "What roles are supported in the 5-Tier RBAC system?",
      answer: "SkillPulse AI supports 5 distinct role tiers: Employee (self-service), Team Leader (team skill strength), HR Manager (org-wide analytics), Company Admin (settings & taxonomy), and Super Admin (system telemetry)."
    },
    {
      category: "Platform Features",
      question: "Can Team Leaders track team skill strength?",
      answer: "Yes, Team Leaders have a dedicated workspace with team readiness scores, skill strength distribution charts, top performing member profiles, and training progress tracking."
    },
    // AI & Analytics
    {
      category: "AI & Analytics",
      question: "How does the AI Engine detect skill gaps?",
      answer: "The AI engine compares employee skill self-assessments and verified proficiency ratings directly against required target role benchmarks stored in the PostgreSQL database."
    },
    {
      category: "AI & Analytics",
      question: "Does the platform recommend targeted learning courses?",
      answer: "Yes, the AI analyzes individual skill gaps and recommends catalog courses and learning paths to elevate proficiency levels."
    },
    // Security & RBAC
    {
      category: "Security & RBAC",
      question: "How is multi-tenant organization data isolated?",
      answer: "SkillPulse AI enforces logical multi-tenant database isolation, ensuring each company's skill inventories, user metrics, and audit logs remain strictly isolated."
    },
    {
      category: "Security & RBAC",
      question: "Are system actions logged for audit compliance?",
      answer: "Yes, Super Admin and Company Admin dashboards include audit trail event streams tracking login attempts, user provisioning, and role changes."
    },
    // Pricing & Seats
    {
      category: "Pricing & Seats",
      question: "What seat limits apply to each subscription plan?",
      answer: "The Starter Plan supports 30 user seats ($600/mo), the Pro Plan supports 250 user seats ($1,200/mo), and the Enterprise Tier supports 1,000 user seats ($2,500/mo)."
    },
    {
      category: "Pricing & Seats",
      question: "Can an organization upgrade its plan tier?",
      answer: "Yes, company administrators can upgrade their workspace subscription plan directly from the admin settings portal at any time."
    },
    // Integrations
    {
      category: "Integrations",
      question: "Which integrations are available in the Integrations Hub?",
      answer: "The Integrations Hub provides API connectors for PostgreSQL Data Hub, HRIS systems (Workday, BambooHR), LMS platforms (Coursera, Udemy), and custom webhooks."
    }
  ];

  // Dynamic filter logic
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeTab === 'All' || faq.category === activeTab;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1] } }
  };

  return (
    <div className="bg-[#0B1120] font-sans text-slate-100 overflow-x-hidden selection:bg-indigo-600 selection:text-white relative min-h-screen">
      {/* Keyframe Animations & Background Canvas */}
      <style>{`
        @keyframes aurora { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -30px) scale(1.1); } }
        .animate-aurora { animation: aurora 14s ease-in-out infinite; }
      `}</style>
      
      {/* Global Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 blur-[160px] rounded-full animate-aurora" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-purple-600/15 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-10 w-[650px] h-[650px] bg-indigo-900/20 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* 1. HERO HEADER */}
      <section className="relative text-white pt-24 pb-20 px-6 text-center overflow-hidden z-10">
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest font-mono">
              KNOWLEDGE BASE & FAQ
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight leading-tight"
          >
            Frequently Asked <br />
            <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed mb-12"
          >
            Clear answers about SkillPulse AI architecture, 5-tier role governance, subscription plans, and security.
          </motion.p>

          {/* Search Input */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative max-w-2xl mx-auto group"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. RBAC, seats, AI gap detection)..." 
              className="w-full pl-14 pr-6 py-4 bg-[#0F172B]/90 rounded-2xl border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm backdrop-blur-xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORY TABS & ACCORDION LIST */}
      <section className="py-12 px-6 md:px-12 relative z-10">
        <div className="container mx-auto max-w-5xl">
          
          {/* Categories Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveTab(cat);
                  setOpenQuestion('');
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeTab === cat 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                    : "bg-[#0F172B]/80 text-slate-400 hover:text-white border border-slate-800/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openQuestion === faq.question;
                return (
                  <motion.div 
                    key={faq.question}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? "border-indigo-500/50 bg-[#0F172B]/90 shadow-xl" 
                        : "border-slate-800/80 bg-[#0F172B]/60 hover:border-slate-700"
                    }`}
                  >
                    <button 
                      type="button"
                      onClick={() => setOpenQuestion(isOpen ? '' : faq.question)}
                      className="w-full flex items-center justify-between p-6 text-left cursor-pointer select-none"
                    >
                      <span className={`text-base font-semibold pr-4 transition-colors ${isOpen ? 'text-indigo-300' : 'text-slate-200'}`}>
                        {faq.question}
                      </span>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${isOpen ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-700 text-slate-400'}`}>
                        {isOpen ? '−' : '+'}
                      </div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-6 pb-6 pt-0 text-slate-400 text-xs leading-relaxed font-light border-t border-slate-800/50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs font-mono">
                No matching questions found. Try adjusting your search query or selecting another category.
              </div>
            )}
          </div>

          {/* Support Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-[#0F172B]/90 border border-slate-800 rounded-3xl p-8 md:p-10 max-w-2xl mx-auto backdrop-blur-xl shadow-2xl"
          >
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Have a specific question?</h3>
            <p className="text-slate-400 text-xs font-light mb-6">Reach out to our team for detailed information on platform features or enterprise deployments.</p>
            <Link 
              to="/contact"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 inline-block cursor-pointer"
            >
              Contact Support
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 3. BOTTOM CTA */}
      <section className="py-20 px-6 text-center relative z-10">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to Explore SkillPulse AI?</h2>
          <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto font-light">
            Discover multi-tenant workforce intelligence, skill gap inference, and 5-tier role governance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/features"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:scale-105"
            >
              Explore Features
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

export default FAQPage;