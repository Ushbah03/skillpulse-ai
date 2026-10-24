import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

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
    <footer className="relative bg-gradient-to-b from-[#17233E] via-[#1B3154] to-[#121E33] text-white pt-16 pb-12 px-6 md:px-12 border-t border-white/10 overflow-hidden">
      {/* Top Ambient Glow Edge */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1988A3] to-transparent opacity-80" />
      
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[250px] bg-[#1988A3]/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[200px] bg-[#11C6DE]/08 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start pb-12 border-b border-white/10">
          
          {/* Brand & Mission Column (5 cols) */}
          <div className="lg:col-span-5 text-left">
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
            
            <p className="text-[#8A9CB7] text-sm leading-relaxed mb-6 font-normal max-w-md">
              Enterprise multi-tenant workforce intelligence platform delivering automated skill gap analysis, predictive career paths, and live organizational readiness benchmarks.
            </p>

            <div className="flex items-center gap-2.5 flex-wrap">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                <Link 
                  key={i} 
                  to="/contact"
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#1988A3]/20 border border-white/10 hover:border-[#1988A3]/50 text-xs text-[#8A9CB7] hover:text-white transition-all font-medium backdrop-blur-sm shadow-sm inline-flex items-center gap-1.5"
                >
                  {social}
                  <ArrowUpRight className="w-3 h-3 text-[#1988A3]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Solutions Column (2.5 cols) */}
          <div className="lg:col-span-2 text-left">
            <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1988A3]" /> Solutions
            </h4>
            <ul className="space-y-3 text-[#8A9CB7] text-sm font-normal">
              {solutions.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column (2.5 cols) */}
          <div className="lg:col-span-2 text-left">
            <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE]" /> Platform
            </h4>
            <ul className="space-y-3 text-[#8A9CB7] text-sm font-normal">
              {platformLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column (2 cols) */}
          <div className="lg:col-span-3 text-left">
            <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A9CB7]" /> Company & Trust
            </h4>
            <ul className="space-y-3 text-[#8A9CB7] text-sm font-normal mb-5">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#8A9CB7] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1988A3]" />
              <span>Multi-Tenant Isolated</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#8A9CB7] font-normal gap-4">
          <p>© {new Date().getFullYear()} SkillPulse-AI Enterprise Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/faq" className="hover:text-white transition-colors">Privacy</Link>
            <span className="text-white/20">•</span>
            <Link to="/faq" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-white/20">•</span>
            <Link to="/features" className="hover:text-white transition-colors">Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
