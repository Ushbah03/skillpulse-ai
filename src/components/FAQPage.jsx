import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQPage = () => {
  const { tenantId } = useParams();
  const tenantBaseRoute = tenantId ? `/${tenantId}` : '';

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState('What is SkillPulse-AI?');

  const categories = [
    "All", "General", "Platform Features", "AI & Analytics", 
    "Security & Privacy", "Pricing", "Integrations", "Support"
  ];

  const faqs = [
    // General
    {
      category: "General",
      question: "What is SkillPulse-AI?",
      answer: "SkillPulse-AI is an enterprise AI workforce intelligence platform designed to map employee skills, detect proficiency gaps, and deliver automated development recommendations."
    },
    {
      category: "General",
      question: "How does SkillPulse-AI benefit modern enterprises?",
      answer: "By replacing subjective performance reviews with data-backed skill matrix analytics, real-time readiness scoring, and automated upskilling workflows."
    },
    // Platform Features
    {
      category: "Platform Features",
      question: "Can Team Leaders track real-time team performance?",
      answer: "Yes, managers and team leads receive a dedicated workspace with live skill velocity heatmaps, team readiness scores, and project allocation metrics."
    },
    {
      category: "Platform Features",
      question: "How are skill assessments conducted on the platform?",
      answer: "SkillPulse-AI offers adaptive technical quizzes, code evaluations, scenario-based problem solving, and peer review inputs to continuously update employee skill profiles."
    },
    // AI & Analytics
    {
      category: "AI & Analytics",
      question: "How does the AI Engine detect skill gaps?",
      answer: "Our machine learning engine continuously benchmarks internal employee proficiency data against industry standards and upcoming project role requirements."
    },
    {
      category: "AI & Analytics",
      question: "Does the AI generate personalized learning paths?",
      answer: "Yes, the AI analyzes each individual's gap analysis and automatically recommends customized courses, internal mentoring, and hands-on practice modules."
    },
    // Security & Privacy
    {
      category: "Security & Privacy",
      question: "How is employee skill data isolated across tenants?",
      answer: "SkillPulse-AI uses complete multi-tenant database isolation, AES-256 encryption at rest, and strict Role-Based Access Controls (RBAC) to keep corporate analytics private."
    },
    {
      category: "Security & Privacy",
      question: "Is SkillPulse-AI GDPR and SOC 2 compliant?",
      answer: "Yes, the platform complies with GDPR data privacy directives and adheres to SOC 2 Type II trust principles for cloud security."
    },
    // Pricing
    {
      category: "Pricing",
      question: "Can we modify seat counts or upgrade tiers dynamically?",
      answer: "Yes, tenant administrators can add user seats, change subscription plans, or unlock enterprise modules directly from the Company Admin Workspace."
    },
    {
      category: "Pricing",
      question: "Is there a free trial or pilot program for enterprise teams?",
      answer: "We offer a 14-day full-access pilot program for enterprise organizations to evaluate the assessment engine with custom department cohorts."
    },
    // Integrations
    {
      category: "Integrations",
      question: "Which HRIS and LMS platforms does SkillPulse-AI integrate with?",
      answer: "SkillPulse-AI natively connects with Workday, BambooHR, SAP SuccessFactors, Jira, GitHub, Coursera, Udemy for Business, and custom REST API endpoints."
    },
    {
      category: "Integrations",
      question: "Can we export skill analytics to our BI tools?",
      answer: "Yes, enterprise subscriptions include automated reporting pipelines to export raw and aggregate analytics into PowerBI, Tableau, or Snowflake."
    },
    // Support
    {
      category: "Support",
      question: "What support channels are included with enterprise accounts?",
      answer: "Enterprise plans include a dedicated Customer Success Manager, 24/7 priority email and chat support, SLA guarantees, and custom onboarding assistance."
    },
    {
      category: "Support",
      question: "How do we request custom assessment frameworks for niche skills?",
      answer: "You can submit custom skill taxonomy requests directly through the Admin Support Portal, or build custom rubric templates within your tenant workspace."
    }
  ];

  // Dynamic filter logic for category tabs and search input
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
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-600 selection:text-white">
      <style>{`
        @keyframes orbitDrift {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -25px) scale(1.08); }
        }
        .animate-orbit-glow { animation: orbitDrift 14s ease-in-out infinite; }
      `}</style>
      
      {/* SECTION 1: HERO HEADER */}
      <section className="relative bg-[#0F172B] text-white pt-32 pb-64 px-6 text-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ background: `radial-gradient(circle at 50% 50%, #2E3759 0%, #171E35 45%, #0F172B 100%)` }}
        />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-orbit-glow" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 container mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Frequently Asked <span className="text-indigo-400 drop-shadow-[0_0_25px_rgba(129,140,248,0.25)]">Questions</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light opacity-90">
            Everything you need to know about SkillPulse-AI, our AI engine, integrations, and enterprise security.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2: CONTENT AREA */}
      <section className="relative z-20 -mt-32 px-6 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-5xl bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-slate-50"
        >
          
          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-12 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for questions..." 
              className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all text-slate-700 shadow-inner"
            />
          </div>

          {/* Categories Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveTab(cat);
                  setOpenQuestion('');
                }}
                className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform active:scale-95 ${
                  activeTab === cat 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {activeTab === cat && (
                  <motion.span 
                    layoutId="activeTabGlow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-indigo-600 rounded-full -z-10 shadow-[0_10px_25px_rgba(79,70,229,0.25)]"
                  />
                )}
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
                    className={`border border-slate-100 rounded-[2rem] overflow-hidden transition-all duration-300 ${
                      isOpen ? "bg-slate-50/40 shadow-md border-indigo-100/50" : "hover:border-slate-200"
                    }`}
                  >
                    <button 
                      onClick={() => setOpenQuestion(isOpen ? '' : faq.question)}
                      className="w-full flex items-center justify-between p-8 text-left hover:bg-slate-50/30 transition-colors group"
                    >
                      <span className={`text-lg font-bold text-slate-800 transition-colors group-hover:text-indigo-950 ${isOpen ? 'text-indigo-600' : ''}`}>
                        {faq.question}
                      </span>
                      <motion.div 
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}
                      >
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </motion.div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-8 pb-8 text-slate-500 leading-relaxed text-base antialiased">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 font-medium">
                No matching questions found. Try refining your search query or switching categories.
              </div>
            )}
          </div>
        </motion.div>

        {/* Support CTA Box */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="container mx-auto max-w-3xl mt-20 text-center bg-white border border-slate-100 rounded-[3rem] p-12 shadow-xl shadow-slate-100/50 group hover:shadow-2xl hover:border-slate-200 transition-all duration-500"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
            className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300"
          >
            <Mail className="w-10 h-10" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Still Have Questions?</h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto text-sm leading-relaxed font-medium">
            Our expert team is ready to assist you with any technical questions, enterprise needs, or custom integration requests.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/support"
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-indigo-600/30 transition-all shadow-lg shadow-indigo-200 active:scale-95 transform hover:-translate-y-0.5 inline-block"
            >
              Contact Support
            </Link>
            <Link 
              to="/demo"
              className="bg-white border border-slate-200 text-slate-800 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 transform hover:-translate-y-0.5 inline-block"
            >
              Request Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: BOTTOM HERO */}
      <section className="py-32 px-6 md:px-20 bg-white">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="container mx-auto max-w-7xl relative rounded-[3rem] py-24 text-center text-white overflow-hidden shadow-3xl border border-white/10 group"
          style={{
            background: `linear-gradient(135deg, #0F172B 0%, #1E293B 50%, #312E81 100%)`
          }}
        >
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none transition-transform duration-1000 group-hover:scale-110"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.4) 0%, transparent 70%)`
            }}
          />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none animate-orbit-glow" />

          <div className="relative z-10 px-6">
            <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tight leading-tight">
              Ready to Transform <br /> Workforce Skills?
            </h2>
            <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg opacity-90 font-light">
              Don't wait to close the skill gap. Join leading organizations using SkillPulse-AI today.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to={tenantId ? `${tenantBaseRoute}/upgrade` : "/onboard"}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-500/30 inline-block"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/demo"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 backdrop-blur-sm inline-block"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default FAQPage;