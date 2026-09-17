import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

export function Footer() {
  const productLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Assessments', path: '/features' },
    { name: 'Analytics', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/about' },
    { name: 'Blog', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/faq' },
    { name: 'Terms of Service', path: '/faq' },
    { name: 'Security', path: '/features' },
  ];

  return (
    <footer className="relative bg-[#0B1120] text-white py-12 md:py-14 px-6 md:px-12 border-t border-slate-800/80 overflow-hidden">
      {/* Subtle Radial Gradient Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 50% -20%, #2E3759 0%, transparent 75%)` 
        }}
      />

      <div className="relative z-10 container mx-auto max-w-5xl grid md:grid-cols-3 gap-10 lg:gap-16 items-start">
        {/* Brand Section */}
        <div>
          <Link to="/" className="flex items-center gap-3 mb-4 group w-fit">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-transparent group-hover:scale-105 transition-transform">
              <img src={logo} alt="SkillPulse Logo" className="w-9 h-9 object-contain" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              SkillPulse <span className="text-indigo-400">-AI</span>
            </h2>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed mb-5 font-light max-w-sm">
            Enterprise-grade skill intelligence platform powering the future of workforce readiness.
          </p>
          <div className="flex gap-3">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
              <Link 
                key={i} 
                to="/contact"
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 transition-all font-medium"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Links */}
        <div className="md:justify-self-center">
          <h4 className="font-bold mb-4 text-white text-sm uppercase tracking-wider font-mono">Product</h4>
          <ul className="space-y-2.5 text-slate-400 text-sm font-light">
            {productLinks.map((l) => (
              <li key={l.name}>
                <Link to={l.path} className="hover:text-indigo-400 transition-colors flex items-center gap-1 w-fit">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div className="md:justify-self-end">
          <h4 className="font-bold mb-4 text-white text-sm uppercase tracking-wider font-mono">Company</h4>
          <ul className="space-y-2.5 text-slate-400 text-sm font-light">
            {companyLinks.map((l) => (
              <li key={l.name}>
                <Link to={l.path} className="hover:text-indigo-400 transition-colors flex items-center gap-1 w-fit">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative z-10 container mx-auto max-w-5xl mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-light">
        <p>© 2026 SkillPulse-AI Inc. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          {legalLinks.map((l) => (
            <Link key={l.name} to={l.path} className="hover:text-indigo-400 transition-colors">
              {l.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;