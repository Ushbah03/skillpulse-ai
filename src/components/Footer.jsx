import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  Check, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
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
    <footer className="relative w-full overflow-hidden font-sans select-none bg-gradient-to-b from-[#EAF3FA]/85 via-[#DEEFFB]/75 to-[#CDE4F7]/85 backdrop-blur-2xl border-t border-white/85 shadow-[0_-8px_30px_rgba(23,35,62,0.04)]">
      
      {/* 1. Ambient Background Glowing Mesh Orbs & Light Refraction Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-16 left-1/4 w-[400px] sm:w-[600px] h-[300px] bg-[#1988A3]/18 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-1/4 -right-16 w-[350px] sm:w-[500px] h-[300px] bg-[#11C6DE]/16 blur-[110px] rounded-full" />
        <div className="absolute -bottom-12 left-10 w-[400px] sm:w-[600px] h-[300px] bg-[#1B3154]/14 blur-[130px] rounded-full" />
        <div className="absolute bottom-2 right-1/3 w-[350px] sm:w-[500px] h-[250px] bg-[#8A9CB7]/20 blur-[110px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Top Specular Rim Light */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1988A3]/35 to-transparent pointer-events-none z-10" />

      {/* 2. Refractive Typography Watermark */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <span className="text-[14vw] font-black tracking-[0.2em] text-[#17233E]/07 uppercase bg-gradient-to-b from-[#17233E]/10 via-[#1988A3]/08 to-transparent bg-clip-text text-transparent transform translate-y-4 blur-[1px]">
          SKILLPULSE
        </span>
      </div>

      {/* 3. Main Full-Width Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10">
        
        {/* Main Grid: Left Hook & Newsletter + Right Nav Pod */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-12 sm:mb-16">
          
          {/* Left Brand & Newsletter Column (Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Brand Header */}
            <div>
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#1988A3] p-0.5 shadow-md shadow-[#17233E]/20 flex items-center justify-center border border-white/40 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-[14px] bg-[#17233E]/40 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#17233E] tracking-tight">
                    SkillPulse<span className="text-[#1988A3]">-AI</span>
                  </span>
                  <span className="block text-[10px] font-mono font-bold tracking-widest text-[#5A6D89] uppercase">
                    Workforce Intelligence
                  </span>
                </div>
              </Link>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17233E] tracking-tight mt-5 leading-tight">
                One unified talent matrix,{' '}
                <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">
                  calibrated daily.
                </span>
              </h3>
              <p className="text-[#5A6D89] text-xs sm:text-sm mt-2.5 leading-relaxed max-w-md">
                Subscribe to weekly talent intelligence telemetry, AI squad orchestration case studies, and corporate workforce benchmarks.
              </p>
            </div>

            {/* Liquid Pill Newsletter Input */}
            <div className="w-full max-w-md pt-1">
              <form onSubmit={handleSubscribe} className="relative">
                <div className="p-1 sm:p-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/95 shadow-[inset_0_2px_4px_rgba(27,49,84,0.06),0_8px_20px_rgba(23,35,62,0.06)] flex items-center transition-all focus-within:border-[#1988A3]/60 focus-within:ring-2 focus-within:ring-[#1988A3]/20">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="work.email@company.com"
                    disabled={isSubscribed}
                    className="flex-1 bg-transparent px-3.5 sm:px-4 py-2 text-xs sm:text-sm text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none font-medium min-w-0"
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

              <p className="text-[10px] font-medium text-[#8A9CB7] mt-2 px-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#1988A3] shrink-0" />
                <span>Zero spam. Unsubscribe anytime. SOC 2 Type II compliant.</span>
              </p>

              {/* Frosted Glass Social Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-3">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                  <Link
                    key={i}
                    to="/contact"
                    className="px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-[#1988A3]/15 border border-white/85 text-[11px] text-[#5A6D89] hover:text-[#17233E] font-semibold transition-all inline-flex items-center gap-1.5 shadow-2xs backdrop-blur-md cursor-pointer"
                  >
                    <span>{social}</span>
                    <ArrowUpRight className="w-3 h-3 text-[#1988A3]" />
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Right Navigation Pod (Col 7) */}
          <div className="lg:col-span-7">
            
            {/* Desktop View (lg:block): Wide 4-column recessed glass pod */}
            <div className="hidden lg:block p-8 rounded-[2rem] bg-white/55 backdrop-blur-xl border border-white/85 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_10px_30px_rgba(23,35,62,0.04)]">
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
            <div className="block lg:hidden rounded-2xl bg-white/55 backdrop-blur-xl border border-white/80 p-2 sm:p-4 shadow-xs divide-y divide-white/60">
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

        {/* 4. Bottom Horizontal Action & Compliance Bar (Full-Width Divider) */}
        <div className="pt-8 border-t border-white/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Left: Copyright */}
          <div className="text-[#5A6D89] font-medium text-xs text-center sm:text-left">
            © {new Date().getFullYear()} SkillPulse-AI Enterprise Systems. All rights reserved.
          </div>

          {/* Right: Legal & Security Navigation */}
          <div className="flex items-center gap-4 text-[#5A6D89] text-xs font-medium">
            <Link to="/faq?tab=Privacy%20%26%20Terms" className="hover:text-[#17233E] transition-colors py-1">Privacy</Link>
            <span className="text-[#8A9CB7]/50 select-none">•</span>
            <Link to="/faq?tab=Privacy%20%26%20Terms" className="hover:text-[#17233E] transition-colors py-1">Terms</Link>
            <span className="text-[#8A9CB7]/50 select-none">•</span>
            <Link to="/features" className="hover:text-[#17233E] transition-colors py-1">Security</Link>
          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
