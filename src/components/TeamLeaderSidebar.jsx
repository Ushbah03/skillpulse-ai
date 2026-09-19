import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  UserCircle,
  BookOpen,
  Users2,
  LineChart,
  Zap,
  AlertCircle,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';

import logo from '../assets/images/logo.png';

const menuItems = [
  { name: 'Dashboard', path: '/team-leader', icon: LayoutDashboard },
  { name: 'Team Skill Overview', path: '/team-leader/skill-overview', icon: BarChart3 },
  { name: 'Team Member Profile', path: '/team-leader/member-profile', icon: UserCircle },
  { name: 'Assign Learning', path: '/team-leader/assign-learning', icon: BookOpen },
  { name: 'Team Formation', path: '/team-leader/team-formation', icon: Users2 },
  { name: 'Performance Monitor', path: '/team-leader/performance', icon: LineChart },
  { name: 'Readiness Score', path: '/team-leader/readiness', icon: Zap },
  { name: 'Skill Gap Analysis', path: '/team-leader/gap-analysis', icon: AlertCircle },
  { name: 'Training Requests', path: '/team-leader/requests', icon: MessageSquare },
  { name: 'Team Reports', path: '/team-leader/reports', icon: FileText },
];

const TeamLeaderSidebar = () => {
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
      {/* Mobile Top Header (Visible only on < lg screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F172A] border-b border-slate-800/80 px-4 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/team-leader')}>
          <img src={logo} alt="SkillPulse Logo" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-white text-sm font-bold leading-none">SkillPulse AI</h1>
            <span className="text-[9px] font-mono text-indigo-400 font-semibold uppercase">Team Leader</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer"
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

        <style>{`
          .custom-sidebar-nav::-webkit-scrollbar { width: 0px; display: none; }
          .custom-sidebar-nav { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Logo Section */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="p-6 mb-2 flex items-center justify-between cursor-pointer group relative z-10"
          onClick={() => navigate('/team-leader')}
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
              <h1 className="text-white text-lg font-bold tracking-tight group-hover:text-indigo-400 transition-colors duration-300 leading-tight">
                SkillPulse AI
              </h1>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Team Leader
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

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-sidebar-nav pb-6 relative border-b border-slate-800/60">
          {menuItems.map((item) => {
            const isItemActive = item.path === '/team-leader'
              ? location.pathname === '/team-leader'
              : location.pathname.startsWith(item.path);

            const IconComponent = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group relative border-0 outline-none ${
                  isItemActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Sliding Pill Indicator */}
                {isItemActive && (
                  <motion.div
                    layoutId="leaderActiveIndicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#1E293B] rounded-xl z-0 shadow-sm border border-slate-700/50"
                  />
                )}

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] rounded-xl transition-colors duration-200 pointer-events-none" />

                <IconComponent className={`w-5 h-5 z-10 transition-all duration-200 group-hover:scale-105 shrink-0 ${
                  isItemActive ? 'text-blue-500 scale-105 opacity-100' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                
                <span className="text-sm font-medium tracking-wide z-10 transition-transform duration-200 group-hover:translate-x-0.5 truncate">
                  {item.name}
                </span>
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
    </>
  );
};

export default TeamLeaderSidebar;