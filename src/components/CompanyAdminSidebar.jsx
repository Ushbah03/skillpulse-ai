import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GitFork,
  Network,
  ShieldCheck,
  Building2,
  LogOut,
  Lock
} from 'lucide-react';

import logo from '../assets/images/logo.png';

const menuItems = [
  { name: 'Overview', path: '/company-admin', icon: LayoutDashboard },
  { name: 'User & Role Governance', path: '/company-admin/users', icon: Users },
  { name: 'Skill Taxonomy', path: '/company-admin/taxonomy', icon: GitFork },
  { name: 'Integrations Hub', path: '/company-admin/integrations', icon: Network, minPlan: 'PRO' },
  { name: 'Security & Access', path: '/company-admin/security', icon: ShieldCheck },
  { name: 'Org Settings & Audit', path: '/company-admin/settings', icon: Building2 },
];

const CompanyAdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userState, setUserState] = useState(localStorage.getItem('user'));

  useEffect(() => {
    const handleUserUpdate = () => setUserState(localStorage.getItem('user'));
    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, []);

  let userPlan = 'STARTER';
  if (userState) {
    try {
      const u = JSON.parse(userState);
      userPlan = u?.tenant?.plan || u?.plan || 'STARTER';
    } catch(e) {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    window.location.replace('/login');
  };

  const isLocked = (minPlan) => {
    if (!minPlan) return false;
    const planLevel = { 'STARTER': 1, 'PRO': 2, 'Professional': 2, 'Business': 2, 'ENTERPRISE': 3, 'Enterprise AI': 3 };
    return (planLevel[userPlan] || 1) < planLevel[minPlan];
  };

  return (
    <aside className="h-screen bg-[#0F172A] text-slate-400 flex flex-col shadow-2xl fixed left-0 top-0 w-72 border-r border-slate-800/40 select-none z-50">

      {/* Scrollbar styling */}
      <style>{`
        .custom-sidebar-nav::-webkit-scrollbar { width: 0px; display: none; }
        .custom-sidebar-nav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Brand & Badge Header */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="p-6 mb-2 flex items-center gap-3 cursor-pointer group relative z-10"
        onClick={() => navigate('/company-admin')}
      >
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
          <h1 className="text-white text-lg font-bold tracking-tight group-hover:text-indigo-400 transition-colors duration-300 leading-tight">
            SkillPulse AI
          </h1>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            Company Admin
          </span>
        </div>
      </motion.div>

      {/* Navigation Routes */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-sidebar-nav pb-6 relative border-b border-slate-800/60">
        {menuItems.map((item) => {
          const isItemActive = item.path === '/company-admin'
            ? location.pathname === '/company-admin'
            : location.pathname.startsWith(item.path);

          const IconComponent = item.icon;
          const locked = isLocked(item.minPlan);

          return (
            <NavLink
              key={item.name}
              to={locked ? '/company-admin/settings' : item.path}
              state={locked ? { planRestricted: true } : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group relative border-0 outline-none ${
                isItemActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              } ${locked ? 'opacity-60 cursor-not-allowed hover:bg-slate-800/50' : ''}`}
              onClick={(e) => {
                if (locked) {
                  e.preventDefault();
                  navigate('/company-admin/settings', { state: { planRestricted: true } });
                }
              }}
            >
              {/* Active Item Sliding Indicator */}
              {isItemActive && !locked && (
                <motion.div
                  layoutId="companyAdminActiveIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-[#1E293B] rounded-xl z-0 shadow-sm border border-slate-700/50"
                />
              )}

              {/* Hover effect overlay */}
              {!locked && <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] rounded-xl transition-colors duration-200 pointer-events-none" />}

              <IconComponent className={`w-5 h-5 z-10 transition-all duration-200 group-hover:scale-105 shrink-0 ${
                isItemActive && !locked ? 'text-blue-500 scale-105 opacity-100' : 'text-slate-500 group-hover:text-slate-300'
              }`} />
              
              <span className="text-sm font-medium tracking-wide z-10 transition-transform duration-200 group-hover:translate-x-0.5 truncate flex-1">
                {item.name}
              </span>

              {locked && (
                <Lock className="w-4 h-4 text-amber-500/70 z-10" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Tray: Logout */}
      <div className="p-4 bg-[#0F172A]">
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group border-0 outline-none relative"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-transform duration-300 group-hover:-translate-x-0.5 shrink-0" />
          <span className="text-sm font-medium tracking-wide transition-transform duration-300 group-hover:translate-x-0.5">
            Logout
          </span>
        </motion.button>
      </div>

    </aside>
  );
};

export default CompanyAdminSidebar;