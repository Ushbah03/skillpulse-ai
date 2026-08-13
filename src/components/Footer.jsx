import React from 'react';

export function Footer() {
  return (
    <footer className="relative bg-[#0F172B] text-white py-20 px-6 md:px-20 border-t border-white/5 overflow-hidden">
      {/* Subtle Radial Gradient Background to match image */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{ 
          background: `radial-gradient(circle at 50% -20%, #2E3759 0%, transparent 70%)` 
        }}
      />

      <div className="relative z-10 container mx-auto grid md:grid-cols-4 gap-16">
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">S</div>
            <h2 className="text-xl font-bold">SkillPulse <span className="text-indigo-400">-AI</span></h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Enterprise-grade skill intelligence platform powering the future of workforce readiness.
          </p>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 bg-white/5 rounded-full border border-white/10 hover:bg-indigo-500/20 transition-all cursor-pointer"></div>
            ))}
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-semibold mb-6 text-white">Product</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            {['Features', 'Assessments', 'Analytics', 'Pricing'].map(l => (
              <li key={l} className="hover:text-indigo-400 cursor-pointer transition-colors">{l}</li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold mb-6 text-white">Company</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            {['About Us', 'Careers', 'Blog', 'Contact'].map(l => (
              <li key={l} className="hover:text-indigo-400 cursor-pointer transition-colors">{l}</li>
            ))}
          </ul>
        </div>

        {/* Subscribe Section */}
        <div>
          <h4 className="font-semibold mb-6 text-white">Subscribe</h4>
          <p className="text-slate-400 text-sm mb-6">Get the latest news and updates right to your inbox.</p>
          <div className="relative flex items-center">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-white/5 text-white pl-5 pr-20 py-4 rounded-xl border border-white/10 outline-none focus:border-indigo-500/50 transition-all placeholder-slate-500 text-sm" 
            />
            <button className="absolute right-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative z-10 container mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>© 2026 SkillPulse-AI Inc. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          {['Privacy Policy', 'Terms of Service', 'Security'].map(l => (
            <span key={l} className="hover:text-indigo-400 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;