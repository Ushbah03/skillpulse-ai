import React, { useState } from 'react';
import { authAPI } from '../services/api';
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
    authAPI.logout();
  };

  return (
    <>
      {/* Mobile Top Header (Visible only on < lg screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#17233E]/95 via-[#1B3154]/95 to-[#121E33]/95 backdrop-blur-2xl border-b border-white/10 px-4 flex items-center justify-between z-50 select-none">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/team-leader')}>
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
            <svg className="w-4.5 h-4.5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-sm font-extrabold leading-none tracking-tight">
              SkillPulse <span className="text-[#11C6DE]">-AI</span>
            </h1>
            <span className="text-[9px] font-mono text-[#8A9CB7] font-semibold uppercase">Team Leader</span>
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
            className="fixed inset-0 bg-[#0A101C]/70 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer Container */}
      <aside className={`h-screen bg-gradient-to-b from-[#17233E] via-[#1B3154] to-[#121E33] text-[#8A9CB7] p-5 flex flex-col shadow-2xl fixed left-0 top-0 w-64 border-r border-white/10 select-none z-50 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>

        <style>{`
          .custom-sidebar-nav::-webkit-scrollbar { width: 0px; display: none; }
          .custom-sidebar-nav { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Logo Section */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="mb-8 px-2 flex items-center justify-between cursor-pointer group relative z-10"
          onClick={() => navigate('/team-leader')}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md group-hover:border-[#1988A3]/60 transition-all">
              <svg className="w-5 h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>

            <div>
              <h1 className="text-white text-lg font-extrabold tracking-tight">
                SkillPulse <span className="text-[#11C6DE]">-AI</span>
              </h1>
              <p className="text-[10px] font-mono text-[#8A9CB7] font-bold uppercase tracking-wider">
                Team Leader
              </p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }}
            className="lg:hidden p-1 text-[#8A9CB7] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1 overflow-y-auto custom-sidebar-nav relative pb-4 border-b border-white/10">
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative border-0 outline-none ${
                  isItemActive ? 'text-white' : 'text-[#8A9CB7] hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Sliding Pill Indicator */}
                {isItemActive && (
                  <motion.div
                    layoutId="leaderActiveIndicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-white/10 border border-white/15 rounded-xl z-0 shadow-sm"
                  />
                )}

                <IconComponent className={`w-4.5 h-4.5 transition-colors duration-200 z-10 shrink-0 ${
                  isItemActive ? 'text-[#11C6DE]' : 'text-[#8A9CB7] group-hover:text-white'
                }`} />
                
                <span className="font-semibold text-xs tracking-wide z-10 truncate">
                  {item.name}
                </span>

                {isItemActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE] ml-auto z-10 shadow-[0_0_8px_#11C6DE]" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Tray: Logout */}
        <div className="pt-4 z-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-[#8A9CB7] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all font-semibold text-xs tracking-wide cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default TeamLeaderSidebar;
