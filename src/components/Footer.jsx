import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Lock, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const solutions = [
    { name: 'AI Skill Gap Engine', path: '/features' },
    { name: 'Readiness Scoring', path: '/features' },
    { name: 'Role Dashboards', path: '/dashboard' },
    { name: 'Enterprise Partitioning', path: '/features' },
  ];

  const platformLinks = [
    { name: 'Platform Features', path: '/features' },
    { name: 'Pricing & Plans', path: '/pricing' },
    { name: 'Architecture & FAQ', path: '/faq' },
    { name: 'Contact Engineering', path: '/contact' },
  ];

  const companyLinks = [
    { name: 'About SkillPulse', path: '/about' },
    { name: 'Executive Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/faq' },
    { name: 'Terms of Service', path: '/faq' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#17233E] via-[#1B3154] to-[#121E33] text-white pt-10 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-8 md:px-12 border-t border-white/10 overflow-hidden font-sans">
      {/* Top Ambient Glow Edge */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1988A3] to-transparent opacity-80 pointer-events-none" />
      
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[250px] bg-[#1988A3]/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[200px] bg-[#11C6DE]/08 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start pb-8 sm:pb-12 border-b border-white/10">
          
          {/* Brand & Mission Column (5 cols on Desktop, Full Width on Mobile) */}
          <div className="lg:col-span-5 text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-3 sm:mb-4 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md group-hover:border-[#1988A3]/60 transition-all shadow-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                SkillPulse <span className="text-[#11C6DE]">-AI</span>
              </span>
            </Link>
            
            <p className="text-[#BEDDF5]/80 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-normal max-w-md">
              Enterprise multi-tenant workforce intelligence platform delivering automated skill gap analysis, predictive career paths, and live organizational readiness benchmarks.
            </p>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                <Link 
                  key={i} 
                  to="/contact"
                  className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-white/8 hover:bg-[#1988A3]/25 border border-white/15 hover:border-[#1988A3]/50 text-[11px] sm:text-xs text-[#BEDDF5] hover:text-white transition-all font-semibold backdrop-blur-sm shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {social}
                  <ArrowUpRight className="w-3 h-3 text-[#11C6DE]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Grid: Symmetrical 2x2 Grid on Mobile (<sm), 3 Columns on Desktop (>=sm) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-7 sm:gap-8">
            
            {/* Solutions Column */}
            <div className="text-left">
              <h4 className="font-bold mb-3 sm:mb-4 text-white text-[11px] sm:text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1988A3]" /> Solutions
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-[#BEDDF5]/80 text-xs sm:text-sm font-normal">
                {solutions.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform Column */}
            <div className="text-left">
              <h4 className="font-bold mb-3 sm:mb-4 text-white text-[11px] sm:text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE]" /> Platform
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-[#BEDDF5]/80 text-xs sm:text-sm font-normal">
                {platformLinks.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="text-left">
              <h4 className="font-bold mb-3 sm:mb-4 text-white text-[11px] sm:text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A9CB7]" /> Company & Trust
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-[#BEDDF5]/80 text-xs sm:text-sm font-normal mb-4 sm:mb-5">
                {companyLinks.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Desktop-only Isolation Badge */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#BEDDF5] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1988A3]" />
                <span>Multi-Tenant Isolated</span>
              </div>
            </div>

            {/* Mobile-Only Security & Governance Card (Pairs with Company to form perfect 2x2 grid on mobile) */}
            <div className="sm:hidden text-left flex flex-col justify-start">
              <h4 className="font-bold mb-3 text-white text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Security
              </h4>
              <div className="space-y-2 text-[#BEDDF5]/80 text-xs font-normal mb-3">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Logical RLS Partition</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#11C6DE] shrink-0" />
                  <span>256-Bit Encrypted</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[10px] text-[#BEDDF5] font-mono w-fit">
                <ShieldCheck className="w-3 h-3 text-[#11C6DE]" />
                <span>Isolated Data</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] sm:text-xs text-[#8A9CB7] font-normal gap-3 sm:gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} SkillPulse-AI Enterprise Systems. All rights reserved.</p>
          <div className="flex items-center flex-wrap justify-center sm:justify-end gap-3 sm:gap-5 text-[#BEDDF5]/80">
            <Link to="/faq" className="hover:text-white transition-colors py-0.5">Privacy</Link>
            <span className="text-white/20 select-none">•</span>
            <Link to="/faq" className="hover:text-white transition-colors py-0.5">Terms of Service</Link>
            <span className="text-white/20 select-none">•</span>
            <Link to="/features" className="hover:text-white transition-colors py-0.5">Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
