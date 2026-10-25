import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const solutions = [
    { name: 'Skill Gap Engine', shortName: 'Skill Gaps', path: '/features' },
    { name: 'Readiness Scoring', shortName: 'Readiness', path: '/features' },
    { name: 'Role Dashboards', shortName: 'Dashboards', path: '/dashboard' },
    { name: 'Enterprise Partitioning', shortName: 'Multi-Tenant', path: '/features' },
  ];

  const platformLinks = [
    { name: 'Platform Features', shortName: 'Features', path: '/features' },
    { name: 'Pricing & Plans', shortName: 'Pricing', path: '/pricing' },
    { name: 'Architecture & FAQ', shortName: 'FAQ', path: '/faq' },
    { name: 'Contact Engineering', shortName: 'Contact', path: '/contact' },
  ];

  const companyLinks = [
    { name: 'About SkillPulse', shortName: 'About', path: '/about' },
    { name: 'Executive Contact', shortName: 'Enterprise', path: '/contact' },
    { name: 'Privacy Policy', shortName: 'Privacy', path: '/faq' },
    { name: 'Terms of Service', shortName: 'Terms', path: '/faq' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#17233E] via-[#1B3154] to-[#121E33] text-white py-5 sm:py-12 md:py-16 px-4 sm:px-8 md:px-12 border-t border-white/10 overflow-hidden font-sans">
      {/* Top Ambient Glow Edge */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1988A3] to-transparent opacity-80 pointer-events-none" />
      
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-[#1988A3]/10 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[160px] bg-[#11C6DE]/08 blur-[80px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* DESKTOP LAYOUT (>= lg) */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-start pb-10 border-b border-white/10">
          {/* Brand & Mission Column */}
          <div className="col-span-5 text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md group-hover:border-[#1988A3]/60 transition-all shadow-sm">
                <svg className="w-5 h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                SkillPulse <span className="text-[#11C6DE]">-AI</span>
              </span>
            </Link>
            
            <p className="text-[#BEDDF5]/80 text-sm leading-relaxed mb-6 font-normal max-w-md">
              Enterprise multi-tenant workforce intelligence platform delivering automated skill gap analysis, predictive career paths, and live organizational readiness benchmarks.
            </p>

            <div className="flex items-center gap-2.5 flex-wrap">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                <Link 
                  key={i} 
                  to="/contact"
                  className="px-3.5 py-1.5 rounded-xl bg-white/8 hover:bg-[#1988A3]/25 border border-white/15 hover:border-[#1988A3]/50 text-xs text-[#BEDDF5] hover:text-white transition-all font-semibold backdrop-blur-sm shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {social}
                  <ArrowUpRight className="w-3 h-3 text-[#11C6DE]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links 3 Columns on Desktop */}
          <div className="col-span-7 grid grid-cols-3 gap-8">
            <div className="text-left">
              <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1988A3]" /> Solutions
              </h4>
              <ul className="space-y-2.5 text-[#BEDDF5]/80 text-sm font-normal">
                {solutions.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-left">
              <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE]" /> Platform
              </h4>
              <ul className="space-y-2.5 text-[#BEDDF5]/80 text-sm font-normal">
                {platformLinks.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-left">
              <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A9CB7]" /> Company
              </h4>
              <ul className="space-y-2.5 text-[#BEDDF5]/80 text-sm font-normal mb-5">
                {companyLinks.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#BEDDF5] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1988A3]" />
                <span>Multi-Tenant Isolated</span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPACT SLEEK MOBILE & TABLET LAYOUT (< lg) */}
        <div className="lg:hidden flex flex-col gap-4 text-left">
          
          {/* Header Row: Logo on Left + Compact Social Icons on Right */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 border border-white/20">
                <svg className="w-3.5 h-3.5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                SkillPulse <span className="text-[#11C6DE]">-AI</span>
              </span>
            </Link>

            {/* Compact Socials */}
            <div className="flex items-center gap-1.5">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                <Link 
                  key={i} 
                  to="/contact"
                  className="px-2.5 py-1 rounded-lg bg-white/8 hover:bg-[#1988A3]/25 border border-white/10 text-[10px] text-[#BEDDF5] hover:text-white font-medium inline-flex items-center gap-1"
                >
                  {social}
                  <ArrowUpRight className="w-2.5 h-2.5 text-[#11C6DE]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Compact 3-Column Links Row */}
          <div className="grid grid-cols-3 gap-2 py-1">
            {/* Solutions */}
            <div>
              <h5 className="font-bold text-white text-[10px] uppercase tracking-wider font-mono mb-2 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#1988A3]" /> Solutions
              </h5>
              <ul className="space-y-1.5 text-[11px] text-[#BEDDF5]/75 font-normal">
                {solutions.map((item) => (
                  <li key={item.name} className="truncate">
                    <Link to={item.path} className="hover:text-white transition-colors block py-0.5">
                      {item.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h5 className="font-bold text-white text-[10px] uppercase tracking-wider font-mono mb-2 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#11C6DE]" /> Platform
              </h5>
              <ul className="space-y-1.5 text-[11px] text-[#BEDDF5]/75 font-normal">
                {platformLinks.map((item) => (
                  <li key={item.name} className="truncate">
                    <Link to={item.path} className="hover:text-white transition-colors block py-0.5">
                      {item.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h5 className="font-bold text-white text-[10px] uppercase tracking-wider font-mono mb-2 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#8A9CB7]" /> Company
              </h5>
              <ul className="space-y-1.5 text-[11px] text-[#BEDDF5]/75 font-normal">
                {companyLinks.map((item) => (
                  <li key={item.name} className="truncate">
                    <Link to={item.path} className="hover:text-white transition-colors block py-0.5">
                      {item.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-3 sm:mt-8 pt-3 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-[#8A9CB7] font-normal gap-2 sm:gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} SkillPulse-AI Enterprise Systems.</p>
          <div className="flex items-center gap-3 sm:gap-5 text-[#BEDDF5]/80">
            <Link to="/faq" className="hover:text-white transition-colors">Privacy</Link>
            <span className="text-white/20 select-none">•</span>
            <Link to="/faq" className="hover:text-white transition-colors">Terms</Link>
            <span className="text-white/20 select-none">•</span>
            <Link to="/features" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
