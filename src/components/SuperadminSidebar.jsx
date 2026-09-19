import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, 
  Building2, 
  Users, 
  ShieldAlert, 
  Binary, 
  Cpu, 
  Sliders, 
  History, 
  Cable, 
  CreditCard, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

import logo from '../assets/images/logo.png';

const menuSections = [
  {
    type: 'main',
    items: [
      { name: 'Admin Dashboard', path: '/superadmin/dashboard', icon: LayoutDashboard },
      { name: 'Tenant Management', path: '/superadmin/tenants', icon: Building2 },
      { name: 'User Management', path: '/superadmin/users', icon: Users },
      { name: 'Role Management', path: '/superadmin/roles', icon: ShieldAlert },
    ]
  },
  {
    type: 'section',
    heading: 'AI & TAXONOMY',
    items: [
      { name: 'Skill Taxonomy', path: '/superadmin/taxonomy', icon: Binary },
      { name: 'AI Configuration', path: '/superadmin/ai-config', icon: Cpu },
    ]
  },
  {
    type: 'section',
    heading: 'GOVERNANCE & PLATFORM',
    items: [
      { name: 'Global Integrations', path: '/superadmin/integrations', icon: Cable },
      { name: 'Billing & Subscriptions', path: '/superadmin/billing', icon: CreditCard },
      { name: 'System & Security', path: '/superadmin/settings', icon: Sliders },
      { name: 'Audit Trail Logs', path: '/superadmin/audit-logs', icon: History },
    ]
  }
];

const SuperadminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    window.location.replace('/login');
  };

  return (
    <>
      {/* Mobile Top Navbar (Visible only on < lg screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F172A] border-b border-slate-800/80 px-4 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/select-role')}>
          <img src={logo} alt="SkillPulse Logo" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-white text-sm font-bold leading-none">SkillPulse AI</h1>
            <span className="text-[9px] font-mono text-indigo-400 font-semibold uppercase">Platform Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer Container */}
      <aside className={`h-screen bg-[#0F172A] text-slate-400 flex flex-col shadow-2xl fixed left-0 top-0 w-64 border-r border-slate-800/40 select-none z-50 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Logo Header */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="p-6 mb-1 flex items-center justify-between cursor-pointer group relative z-10"
          onClick={() => navigate('/select-role')}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-transparent">
              <motion.img
                src={logo}
                alt="SkillPulse Logo"
                whileHover={{ rotate: -10, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
                className="w-9 h-9 object-contain"
              />
            </div>
            <div>
              <h1 className="text-white text-lg font-bold tracking-tight group-hover:text-indigo-400 transition-colors duration-300 leading-none">
                SkillPulse AI
              </h1>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold uppercase tracking-widest">
                Platform Admin
              </span>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-4 py-2 space-y-5 overflow-y-auto pb-6 sidebar-container relative">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              
              {section.type === 'section' && (
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block">
                    {section.heading}
                  </span>
                </div>
              )}

              {section.items.map((item) => {
                const isItemActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-colors duration-200 group relative border-0 outline-none ${
                        isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                      }`
                    }
                  >
                    {/* Sliding Active Highlight */}
                    {isItemActive && (
                      <motion.div
                        layoutId="superadminActiveIndicator"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-[#1E293B] rounded-xl z-0 shadow-sm"
                      />
                    )}

                    {/* Micro Interaction Hover Layer */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] rounded-xl transition-colors duration-200 pointer-events-none" />

                    <item.icon className={`w-[18px] h-[18px] z-10 transition-all duration-200 group-hover:scale-105 ${
                      isItemActive ? 'text-indigo-400 opacity-100' : 'opacity-80 group-hover:opacity-100'
                    }`} />
                    <span className="text-[13.5px] font-medium tracking-wide z-10 transition-transform duration-200 group-hover:translate-x-0.5">
                      {item.name}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0F172A]">
          <motion.button
            onClick={handleLogout}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group border-0 outline-none cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px] opacity-80 group-hover:opacity-100 text-slate-500 group-hover:text-rose-400 transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span className="text-[13.5px] font-medium tracking-wide transition-transform duration-300 group-hover:translate-x-0.5">
              Logout
            </span>
          </motion.button>
        </div>

        <style>{`
          .sidebar-container::-webkit-scrollbar {
            width: 4px;
          }
          .sidebar-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .sidebar-container::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 99px;
          }
          .sidebar-container::-webkit-scrollbar-thumb:hover {
            background: #334155;
          }
        `}</style>
      </aside>
    </>
  );
};

export default SuperadminSidebar;