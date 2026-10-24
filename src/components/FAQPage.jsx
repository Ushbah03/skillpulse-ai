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

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeTab === 'All' || faq.category === activeTab;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#0E1626] font-sans text-white overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative min-h-screen">
      {/* Ambient Glass Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#1988A3]/12 blur-[170px] rounded-full" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#1B3154]/25 blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 right-10 w-[650px] h-[650px] bg-[#17233E]/35 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(138,156,183,0.12)_1px,transparent_1px)] [background-size:36px_36px] opacity-40" />
      </div>

      {/* 1. HERO HEADER */}
      <section className="relative pt-16 sm:pt-20 pb-16 px-6 text-center overflow-hidden z-10">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1988A3]/15 border border-[#1988A3]/30 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <HelpCircle className="w-4 h-4 text-[#11C6DE] animate-pulse" />
            <span className="text-[#11C6DE] text-xs font-bold uppercase tracking-widest font-mono">
              KNOWLEDGE BASE & FAQ
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-white">
            Frequently Asked <br />
            <span className="bg-gradient-to-r from-[#11C6DE] via-[#1988A3] to-[#E9EAF7] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>

          <p className="text-[#8A9CB7] text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed mb-10">
            Clear answers about SkillPulse AI architecture, 5-tier role governance, subscription plans, and security.
          </p>

          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8A9CB7] w-5 h-5 group-focus-within:text-[#11C6DE] transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. RBAC, seats, AI gap detection)..." 
              className="w-full pl-14 pr-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-[#8A9CB7] focus:outline-none focus:border-[#1988A3] focus:ring-1 focus:ring-[#1988A3]/40 transition-all text-sm backdrop-blur-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS & ACCORDION LIST */}
      <section className="py-8 px-6 md:px-12 relative z-10">
        <div className="container mx-auto max-w-5xl">
          
          {/* Categories Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
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
                    ? "bg-[#1988A3] text-white shadow-lg shadow-[#1988A3]/30" 
                    : "bg-white/5 text-[#8A9CB7] hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3.5 max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openQuestion === faq.question;
                return (
                  <div 
                    key={faq.question}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? "border-[#1988A3]/60 bg-[#17233E]/70 shadow-lg" 
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <button 
                      type="button"
                      onClick={() => setOpenQuestion(isOpen ? '' : faq.question)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer select-none"
                    >
                      <span className={`text-sm sm:text-base font-semibold pr-4 transition-colors ${isOpen ? 'text-[#11C6DE]' : 'text-white'}`}>
                        {faq.question}
                      </span>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${isOpen ? 'border-[#1988A3] bg-[#1988A3] text-white' : 'border-white/20 text-[#8A9CB7]'}`}>
                        {isOpen ? '-' : '+'}
                      </div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-5 pb-5 pt-0 text-[#8A9CB7] text-xs leading-relaxed font-normal border-t border-white/5">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-[#8A9CB7] text-xs font-mono">
                No matching questions found. Try adjusting your search query or selecting another category.
              </div>
            )}
          </div>

          {/* Support Box */}
          <div className="mt-14 text-center glass-container rounded-3xl p-8 max-w-xl mx-auto shadow-2xl">
            <div className="w-12 h-12 bg-[#1988A3]/20 border border-[#1988A3]/40 text-[#11C6DE] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Have a specific question?</h3>
            <p className="text-[#8A9CB7] text-xs font-normal mb-6">Reach out to our team for detailed information on platform features or enterprise deployments.</p>
            <Link 
              to="/contact"
              className="bg-[#1988A3] hover:bg-[#157289] text-white px-7 py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-[#1988A3]/30 inline-block cursor-pointer"
            >
              Contact Support
            </Link>
          </div>

        </div>
      </section>

      {/* 3. BOTTOM CTA */}
      <section className="py-16 px-6 text-center relative z-10 mb-8">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Ready to Explore SkillPulse AI?</h2>
          <p className="text-[#8A9CB7] text-base mb-8 max-w-lg mx-auto font-normal">
            Discover multi-tenant workforce intelligence, skill gap inference, and 5-tier role governance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/features"
              className="bg-[#1988A3] hover:bg-[#157289] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#1988A3]/30"
            >
              Explore Features
            </Link>
            <Link 
              to="/pricing"
              className="bg-white/10 hover:bg-white/15 text-white border border-white/15 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm"
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
