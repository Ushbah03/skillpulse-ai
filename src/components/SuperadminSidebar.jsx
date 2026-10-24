import React, { useState } from 'react';
import { authAPI } from '../services/api';
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
  X,
  ShieldCheck
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

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const adminName = storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : (storedUser.name || 'Platform Master');

  const handleLogout = () => {
    authAPI.logout();
  };

  return (
    <>
      {/* Mobile Top Navbar (Visible only on < lg screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#17233E]/95 via-[#1B3154]/95 to-[#121E33]/95 backdrop-blur-2xl border-b border-white/10 px-4 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/select-role')}>
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
            <img src={logo} alt="SkillPulse Logo" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h1 className="text-white text-sm font-extrabold leading-none tracking-tight">
              SkillPulse <span className="text-[#11C6DE]">-AI</span>
            </h1>
            <span className="text-[9px] font-mono text-[#11C6DE] font-semibold uppercase tracking-wider">Super Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-white/5 text-[#8A9CB7] hover:text-white border border-white/10 cursor-pointer transition-colors"
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
      <aside className={`h-screen bg-gradient-to-b from-[#17233E] via-[#1B3154] to-[#121E33] text-[#8A9CB7] flex flex-col fixed left-0 top-0 w-64 border-r border-white/10 select-none z-50 shadow-2xl transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Logo Header */}
        <div className="p-5 border-b border-white/10">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => navigate('/select-role')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md group-hover:border-[#1988A3]/60 transition-all">
                <motion.img
                  src={logo}
                  alt="SkillPulse Logo"
                  whileHover={{ rotate: -10, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h1 className="text-white text-base font-extrabold tracking-tight">
                  SkillPulse <span className="text-[#11C6DE]">-AI</span>
                </h1>
                <span className="text-[10px] font-mono text-[#11C6DE] font-bold uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#11C6DE]" /> Super Admin
                </span>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }}
              className="lg:hidden p-1 text-[#8A9CB7] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto pb-6 custom-sidebar-nav relative">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              
              {section.type === 'section' && (
                <div className="px-3 pt-2.5 pb-1">
                  <span className="text-[9.5px] font-extrabold tracking-widest text-[#8A9CB7]/70 uppercase block">
                    {section.heading}
                  </span>
                </div>
              )}

              {section.items.map((item) => {
                const isItemActive = location.pathname === item.path || (item.path === '/superadmin/dashboard' && location.pathname === '/superadmin');

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group relative border-0 outline-none ${
                      isItemActive 
                        ? 'text-white font-bold bg-gradient-to-r from-[#1988A3] to-[#11C6DE] shadow-md shadow-[#1988A3]/25' 
                        : 'text-[#8A9CB7] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className={`w-[17px] h-[17px] shrink-0 transition-transform duration-200 ${
                      isItemActive ? 'text-white' : 'text-[#8A9CB7] group-hover:text-[#11C6DE] group-hover:scale-105'
                    }`} />
                    <span className="text-[12.5px] font-semibold tracking-wide truncate">
                      {item.name}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile Badge & Logout Footer */}
        <div className="p-3 border-t border-white/10 bg-[#121E33]/90 space-y-2">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1988A3] to-[#11C6DE] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{adminName}</p>
                <p className="text-[10px] text-[#11C6DE] font-semibold font-mono uppercase tracking-wider">Master Console</p>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleLogout}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </motion.button>
        </div>

        <style>{`
          .custom-sidebar-nav::-webkit-scrollbar { width: 0px; display: none; }
          .custom-sidebar-nav { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </aside>
    </>
  );
};

export default SuperadminSidebar;