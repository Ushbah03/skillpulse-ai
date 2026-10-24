import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShieldCheck,
  Briefcase,
  FileBarChart2,
  GraduationCap,
  ClipboardList,
  Building2,
  Lightbulb,
  LogOut,
  Building,
  UserCheck,
  Menu,
  X
} from 'lucide-react';


const menuItems = [
  { name: 'Dashboard', path: '/hr-dashboard', icon: LayoutDashboard },
  { name: 'Organization Skill Analytics', path: '/hr-dashboard/skill-analytics', icon: BarChart3 },
  { name: 'Workforce Planning', path: '/hr-dashboard/workforce-planning', icon: Users },
  { name: 'Compliance Management', path: '/hr-dashboard/compliance-management', icon: ShieldCheck },
  { name: 'Career & Succession Planning', path: '/hr-dashboard/career-planning', icon: Briefcase },
  { name: 'Skill Gap Reports', path: '/hr-dashboard/skill-gap-reports', icon: FileBarChart2 },
  { name: 'Training Program Management', path: '/hr-dashboard/training-management', icon: GraduationCap },
  { name: 'Employee Performance Reports', path: '/hr-dashboard/performance-reports', icon: ClipboardList },
  { name: 'Department Comparison', path: '/hr-dashboard/department-comparison', icon: Building2 },
  { name: 'HR Insights & Forecasting', path: '/hr-dashboard/hr-insights', icon: Lightbulb },
];

const HRSidebar = ({ currentTenant = "Enterprise Corp" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
  };

  return (
    <>
      {/* Mobile Top Navbar (Visible only on < lg screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#17233E]/95 via-[#1B3154]/95 to-[#121E33]/95 backdrop-blur-2xl border-b border-white/10 px-4 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/hr-dashboard')}>
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
            <svg className="w-4.5 h-4.5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-sm font-extrabold leading-none tracking-tight">
              SkillPulse <span className="text-[#11C6DE]">-AI</span>
            </h1>
            <span className="text-[9px] font-mono text-[#8A9CB7] font-semibold uppercase">HR Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-[#8A9CB7] hover:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

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
      <aside className={`h-screen bg-gradient-to-b from-[#17233E] via-[#1B3154] to-[#121E33] text-[#8A9CB7] p-4 flex flex-col fixed left-0 top-0 w-64 border-r border-white/10 z-50 select-none shadow-2xl transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Invisible Custom Scrollbar Rules */}
        <style>{`
          .custom-hr-scrollbar::-webkit-scrollbar { width: 0px; display: none; }
          .custom-hr-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Header & Tenant Identity Branding Section */}
        <div className="mb-6 px-1 relative z-10 border-b border-white/10 pb-4">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between cursor-pointer group mb-3"
            onClick={() => navigate('/hr-dashboard')}
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
                <span className="text-[10px] font-mono text-[#8A9CB7] font-bold uppercase tracking-wider block">
                  HR Workspace
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
            <Building className="w-3.5 h-3.5 text-[#11C6DE] flex-shrink-0" />
            <span className="truncate font-semibold text-white/90">{currentTenant}</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-[#11C6DE] animate-pulse shadow-[0_0_6px_#11C6DE]" title="Tenant Active" />
          </div>
        </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-hr-scrollbar border-b border-white/10 pb-4 relative">
        {menuItems.map((item) => {
          const isItemActive = item.path === '/hr-dashboard'
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              end={item.path === '/hr-dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-200 group relative border-0 outline-none ${
                  isActive ? 'text-white font-semibold shadow-inner' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator Backdrop */}
                  {isItemActive && (
                    <motion.div
                      layoutId="hrActiveIndicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-white/10 border border-white/15 rounded-xl z-0 shadow-sm"
                    />
                  )}

                  {/* Micro-interaction Hover Layer */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-[#0d1832]/40 rounded-2xl transition-colors duration-200 pointer-events-none" />

                  <item.icon
                    className={`w-[17px] h-[17px] mt-[2px] flex-shrink-0 z-10 transition-all duration-200 group-hover:scale-105 ${
                      isActive ? 'text-blue-500 scale-105' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />

                  <span className="font-semibold text-xs tracking-wide z-10 truncate">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Persistent HR Profile & Logout Tray */}
      <div className="pt-3 space-y-2 z-10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#17233E] to-[#1B3154] text-[#11C6DE] border border-white/20 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
            HR
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-white truncate">HR Director</span>
            <span className="text-[10px] text-[#8A9CB7] truncate">hr@enterprise.com</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#8A9CB7] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all font-semibold text-xs tracking-wide cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>

      </aside>
    </>
  );
};

export default HRSidebar;
