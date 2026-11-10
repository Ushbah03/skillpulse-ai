import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  ChevronDown 
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTelemetryPill, setActiveTelemetryPill] = useState('normal');
  const [openMobileSections, setOpenMobileSections] = useState({});

  const toggleMobileSection = (idx) => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }, 600);
  };

  const navColumns = [
    {
      title: 'Product',
      links: [
        { label: 'Overview', path: '/features' },
        { label: 'Skill Matrix', path: '/features' },
        { label: 'Readiness Index', path: '/features' },
        { label: 'Team Formation', path: '/features' },
        { label: 'YouTube LMS', path: '/features' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'Careers', path: '/about', badge: 'Hiring' },
        { label: 'Contact', path: '/contact' },
        { label: 'Partners', path: '/contact' },
        { label: 'Press Kit', path: '/about' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', path: '/faq' },
        { label: 'API & Webhooks', path: '/faq' },
        { label: 'Changelog', path: '/features', badge: 'v2.5' },
        { label: 'Security & RLS', path: '/features' },
        { label: 'Status & Logs', path: '/faq' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/faq?tab=Privacy%20%26%20Terms' },
        { label: 'Terms of Service', path: '/faq?tab=Privacy%20%26%20Terms' },
        { label: 'Cookies & Consent', path: '/faq?tab=Privacy%20%26%20Terms' },
        { label: 'SOC 2 Type II', path: '/faq?tab=Privacy%20%26%20Terms' },
      ],
    },
  ];

  return (
    <footer className="relative w-full py-8 sm:py-14 md:py-20 px-3 sm:px-6 lg:px-10 overflow-hidden font-sans select-none bg-gradient-to-b from-transparent via-[#D8EBF9]/30 to-[#BEDDF5]/50">
      
      {/* 1. Ambient Background Glowing Mesh Orbs & Light Refraction Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-12 left-1/4 w-[320px] sm:w-[500px] h-[250px] sm:h-[350px] bg-[#1988A3]/22 blur-[100px] sm:blur-[130px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[300px] sm:w-[450px] h-[250px] sm:h-[350px] bg-[#11C6DE]/18 blur-[90px] sm:blur-[120px] rounded-full" />
        <div className="absolute -bottom-10 left-10 w-[350px] sm:w-[550px] h-[250px] sm:h-[350px] bg-[#1B3154]/18 blur-[110px] sm:blur-[140px] rounded-full" />
        <div className="absolute bottom-4 right-1/4 w-[320px] sm:w-[480px] h-[200px] sm:h-[300px] bg-[#8A9CB7]/25 blur-[100px] sm:blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* 2. Giant Refractive 3D Sculpted Watermark Behind Liquid Glass */}
      <div className="absolute bottom-2 sm:bottom-6 left-0 right-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span className="text-[15vw] sm:text-[13vw] font-black tracking-[0.16em] sm:tracking-[0.28em] text-[#17233E]/10 uppercase bg-gradient-to-b from-[#17233E]/15 via-[#1988A3]/12 to-transparent bg-clip-text text-transparent transform translate-y-3 sm:translate-y-6 blur-[1.5px] scale-105">
          SKILLPULSE
        </span>
      </div>

      {/* 3. The Floating Liquid Glass Slab */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2rem] sm:rounded-[2.8rem] lg:rounded-[3.5rem] p-5 sm:p-8 md:p-12 lg:p-14 bg-gradient-to-br from-white/80 via-[#E4EEF8]/70 to-[#D0E4F5]/75 backdrop-blur-2xl sm:backdrop-blur-3xl border border-white/85 shadow-[0_25px_60px_-15px_rgba(23,35,62,0.18),inset_0_1px_2px_rgba(255,255,255,0.95)] overflow-hidden"
        >
          {/* Liquid Specular Top Rim Highlight */}
          <div className="absolute top-0 left-6 sm:left-8 right-6 sm:right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/40 blur-2xl rounded-full pointer-events-none" />

          {/* Main Grid: Left Hook & Newsletter + Right Nav Pod */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-8 sm:mb-12">
            
            {/* Left Brand & Newsletter Column (Col 5) */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-5 sm:space-y-6">
              
              {/* Brand Header */}
              <div>
                <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#1988A3] p-0.5 shadow-md shadow-[#17233E]/20 flex items-center justify-center border border-white/40 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-[14px] bg-[#17233E]/40 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <span className="text-lg sm:text-2xl font-black text-[#17233E] tracking-tight">
                      SkillPulse<span className="text-[#1988A3]">-AI</span>
                    </span>
                    <span className="block text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-[#5A6D89] uppercase">
                      Workforce Intelligence
                    </span>
                  </div>
                </Link>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#17233E] tracking-tight mt-4 sm:mt-5 leading-snug">
                  One unified talent matrix,{' '}
                  <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">
                    calibrated daily.
                  </span>
                </h3>
                <p className="text-[#5A6D89] text-xs sm:text-sm mt-2 leading-relaxed max-w-sm">
                  Subscribe to weekly talent intelligence telemetry, AI squad orchestration case studies, and corporate workforce benchmarks.
                </p>
              </div>

              {/* Liquid Pill Newsletter Input */}
              <div className="w-full max-w-md pt-1">
                <form onSubmit={handleSubscribe} className="relative">
                  <div className="p-1 sm:p-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-[inset_0_2px_4px_rgba(27,49,84,0.06),0_8px_20px_rgba(23,35,62,0.08)] flex items-center transition-all focus-within:border-[#1988A3]/60 focus-within:ring-2 focus-within:ring-[#1988A3]/20">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="work.email@company.com"
                      disabled={isSubscribed}
                      className="flex-1 bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none font-medium min-w-0"
                      required
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={isSubscribed}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#17233E] hover:bg-[#1988A3] text-white text-xs font-bold transition-colors shadow-md shadow-[#17233E]/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {isSubscribed ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#11C6DE]" />
                          <span>Joined!</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#11C6DE]" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>

                <p className="text-[10px] font-medium text-[#8A9CB7] mt-2 px-2 sm:px-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#1988A3] shrink-0" />
                  <span>Zero spam. Unsubscribe anytime. SOC 2 Type II compliant.</span>
                </p>

                {/* Frosted Glass Social Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2.5">
                  {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                    <Link
                      key={i}
                      to="/contact"
                      className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/70 hover:bg-[#1988A3]/15 border border-white/85 text-[11px] text-[#5A6D89] hover:text-[#17233E] font-semibold transition-all inline-flex items-center gap-1.5 shadow-2xs backdrop-blur-md cursor-pointer"
                    >
                      <span>{social}</span>
                      <ArrowUpRight className="w-3 h-3 text-[#1988A3]" />
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Recessed Glass Nav Pod (Col 7) */}
            <div className="lg:col-span-7">
              
              {/* Desktop View (lg:block): Wide 4-column recessed glass pod */}
              <div className="hidden lg:block p-8 rounded-[2rem] bg-white/55 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_10px_30px_rgba(23,35,62,0.06)]">
                <div className="grid grid-cols-4 gap-8">
                  {navColumns.map((col, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#17233E] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1988A3]" />
                        {col.title}
                      </h4>
                      <ul className="space-y-2">
                        {col.links.map((link, lIdx) => (
                          <li key={lIdx}>
                            <Link
                              to={link.path}
                              className="group inline-flex items-center gap-1.5 text-xs text-[#5A6D89] hover:text-[#17233E] font-medium transition-colors"
                            >
                              <span className="group-hover:translate-x-0.5 transition-transform">
                                {link.label}
                              </span>
                              {link.badge && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/25 uppercase leading-none">
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile View (block lg:hidden): Clean airy glass accordion pod */}
              <div className="block lg:hidden rounded-2xl bg-white/50 backdrop-blur-xl border border-white/75 p-2 sm:p-4 shadow-sm divide-y divide-white/60">
                {navColumns.map((col, idx) => {
                  const isOpen = !!openMobileSections[idx];
                  return (
                    <div key={idx} className="py-2 first:pt-1 last:pb-1">
                      <button
                        type="button"
                        onClick={() => toggleMobileSection(idx)}
                        className="w-full py-2 px-3 rounded-xl flex items-center justify-between text-left hover:bg-white/40 active:bg-white/60 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isOpen ? 'bg-[#11C6DE]' : 'bg-[#1988A3]'}`} />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#17233E]">
                            {col.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#8A9CB7] bg-white/60 px-2 py-0.5 rounded-full border border-white/80">
                            {col.links.length}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#5A6D89] transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-[#1988A3]' : ''
                            }`}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="overflow-hidden px-3 pt-2 pb-2 space-y-2.5"
                          >
                            {col.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                <Link
                                  to={link.path}
                                  className="flex items-center justify-between py-1 text-xs text-[#5A6D89] hover:text-[#17233E] active:text-[#1988A3] font-medium transition-colors"
                                >
                                  <span className="hover:translate-x-0.5 transition-transform">
                                    {link.label}
                                  </span>
                                  {link.badge && (
                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/25 uppercase leading-none">
                                      {link.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* 4. Bottom Horizontal Action & Status Bar */}
          <div className="pt-6 sm:pt-8 border-t border-white/60 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 text-xs">
            
            {/* Status & Telemetry Group */}
            <div className="w-full md:w-auto flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* Live Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[11px] font-semibold backdrop-blur-sm shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All systems normal</span>
              </div>

              {/* Live Telemetry Pills */}
              <div className="p-1 rounded-full bg-white/65 backdrop-blur-md border border-white/80 shadow-xs flex items-center gap-1">
                <button
                  onClick={() => setActiveTelemetryPill('normal')}
                  title="Cluster Node Health"
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTelemetryPill === 'normal'
                      ? 'bg-[#17233E] text-white shadow-xs'
                      : 'text-[#5A6D89] hover:text-[#17233E]'
                  }`}
                >
                  <Activity className="w-3 h-3 text-[#11C6DE]" />
                  <span>Neon HA</span>
                </button>

                <button
                  onClick={() => setActiveTelemetryPill('rls')}
                  title="Multi-Tenant Row-Level Security Enforced"
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTelemetryPill === 'rls'
                      ? 'bg-[#17233E] text-white shadow-xs'
                      : 'text-[#5A6D89] hover:text-[#17233E]'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-[#1988A3]" />
                  <span>RLS Active</span>
                </button>

                <button
                  onClick={() => setActiveTelemetryPill('ai')}
                  title="Multi-Cloud AI Inference Active"
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTelemetryPill === 'ai'
                      ? 'bg-[#17233E] text-white shadow-xs'
                      : 'text-[#5A6D89] hover:text-[#17233E]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>GenAI 4.0</span>
                </button>
              </div>
            </div>

            {/* Copyright & Legal Navigation */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center justify-center md:justify-end gap-2.5 sm:gap-4 text-center">
              <span className="text-[#5A6D89] font-medium text-[11px] sm:text-xs">
                © {new Date().getFullYear()} SkillPulse-AI Enterprise Systems.
              </span>

              <div className="flex items-center gap-2.5 text-[#5A6D89] text-[11px] font-medium">
                <Link to="/faq?tab=Privacy%20%26%20Terms" className="hover:text-[#17233E] transition-colors py-1">Privacy</Link>
                <span className="text-[#8A9CB7]/50 select-none">•</span>
                <Link to="/faq?tab=Privacy%20%26%20Terms" className="hover:text-[#17233E] transition-colors py-1">Terms</Link>
                <span className="text-[#8A9CB7]/50 select-none">•</span>
                <Link to="/features" className="hover:text-[#17233E] transition-colors py-1">Security</Link>
              </div>
            </div>

          </div>

        </motion.div>
      </div>

    </footer>
  );
}

export default Footer;
