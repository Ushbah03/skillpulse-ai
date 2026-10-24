import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GitFork,
  Network,
  ShieldCheck,
  Building2,
  LogOut,
  Lock,
  Menu,
  X,
  ShieldAlert
} from 'lucide-react';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleUserUpdate = () => setUserState(localStorage.getItem('user'));
    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, []);

  let userPlan = 'STARTER';
  let companyName = 'Workspace';
  if (userState) {
    try {
      const u = JSON.parse(userState);
      userPlan = u?.tenant?.plan || u?.plan || 'STARTER';
      companyName = u?.tenant?.name || u?.companyName || 'Enterprise Corp';
    } catch(e) {}
  }

  const handleLogout = () => {
    authAPI.logout();
  };

  const isLocked = (minPlan) => {
    if (!minPlan) return false;
    const planLevel = { 'STARTER': 1, 'PRO': 2, 'Professional': 2, 'Business': 2, 'ENTERPRISE': 3, 'Enterprise AI': 3 };
    return (planLevel[userPlan] || 1) < planLevel[minPlan];
  };

  return (
    <>
      {/* Mobile Top Navbar (Visible only on < lg screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#17233E]/95 via-[#1B3154]/95 to-[#121E33]/95 backdrop-blur-2xl border-b border-white/10 px-4 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/company-admin')}>
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
            <svg className="w-4.5 h-4.5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-sm font-extrabold leading-none tracking-tight">
              SkillPulse <span className="text-[#11C6DE]">-AI</span>
            </h1>
            <span className="text-[9px] font-mono text-[#11C6DE] font-semibold uppercase tracking-wider">Company Admin</span>
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

      <aside className={`h-screen bg-gradient-to-b from-[#17233E] via-[#1B3154] to-[#121E33] text-[#8A9CB7] p-4 flex flex-col fixed left-0 top-0 w-64 border-r border-white/10 select-none z-50 shadow-2xl transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>

        {/* Scrollbar styling */}
        <style>{`
          .custom-sidebar-nav::-webkit-scrollbar { width: 0px; display: none; }
          .custom-sidebar-nav { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Brand & Badge Header */}
        <div className="mb-4 px-1 relative z-10 border-b border-white/10 pb-4">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between cursor-pointer group mb-2.5"
            onClick={() => navigate('/company-admin')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md group-hover:border-[#1988A3]/60 transition-all">
                <svg className="w-5 h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-white text-base font-extrabold tracking-tight">
                  SkillPulse <span className="text-[#11C6DE]">-AI</span>
                </h1>
                <span className="text-[10px] font-mono text-[#11C6DE] font-bold uppercase tracking-wider block">
                  Company Admin
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

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#8A9CB7]">
            <Building2 className="w-3.5 h-3.5 text-[#11C6DE] shrink-0" />
            <span className="truncate font-semibold text-white/90">{companyName}</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-[#11C6DE] animate-pulse shadow-[0_0_6px_#11C6DE]" title="Tenant Active" />
          </div>
        </div>

        {/* Navigation Routes */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-sidebar-nav pb-4 relative border-b border-white/10">
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative border-0 outline-none ${
                  isItemActive ? 'text-white font-semibold shadow-inner' : 'text-[#8A9CB7] hover:text-white'
                } ${locked ? 'opacity-55 cursor-not-allowed hover:bg-white/5' : ''}`}
                onClick={(e) => {
                  setMobileOpen(false);
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
                    className="absolute inset-0 bg-white/10 border border-white/15 rounded-xl z-0 shadow-sm"
                  />
                )}

                {/* Hover effect overlay */}
                {!locked && <div className="absolute inset-0 bg-white/0 group-hover:bg-[#0d1832]/40 rounded-xl transition-colors duration-200 pointer-events-none" />}

                <IconComponent className={`w-[17px] h-[17px] flex-shrink-0 z-10 transition-all duration-200 group-hover:scale-105 ${
                  isItemActive && !locked ? 'text-[#11C6DE] scale-105 opacity-100' : 'text-[#8A9CB7] group-hover:text-slate-200'
                }`} />
                
                <span className="text-xs font-semibold tracking-wide z-10 transition-transform duration-200 group-hover:translate-x-0.5 truncate flex-1">
                  {item.name}
                </span>

                {locked && (
                  <Lock className="w-3.5 h-3.5 text-amber-400/80 z-10" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Persistent Admin Profile & Logout Tray */}
        <div className="pt-3 space-y-2 z-10">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1988A3] to-[#11C6DE] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              CA
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate">Admin Tower</span>
              <span className="text-[10px] text-[#11C6DE] font-mono uppercase tracking-wider">{userPlan} Plan</span>
            </div>
          </div>

          <motion.button
            onClick={handleLogout}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#8A9CB7] hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all font-semibold text-xs tracking-wide cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default CompanyAdminSidebar;
