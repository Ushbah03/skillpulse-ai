import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, UserCircle, 
  ClipboardCheck, 
  BarChart3, 
  Lightbulb, 
  BookOpen, 
  History, 
  Award, 
  Navigation, 
  LogOut,
  Activity,
  Menu,
  X
} from 'lucide-react';

import logo from '../assets/images/logo.png';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Skill Profile', path: '/dashboard/profile', icon: UserCircle },
  { name: 'Skill Assessment', path: '/dashboard/assessment', icon: ClipboardCheck },
  { name: 'Assessment Results', path: '/dashboard/results', icon: BarChart3 },
  { name: 'Learning Recs', path: '/dashboard/learning', icon: Lightbulb },
  { name: 'Course Details', path: '/dashboard/courses', icon: BookOpen },
  { name: 'My Progress', path: '/dashboard/progress', icon: History },
  { name: 'Certifications', path: '/dashboard/certifications', icon: Award },
  { name: 'Career Paths', path: '/dashboard/career', icon: Navigation },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [imgFailed, setImgFailed] = useState(false);
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
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <img src={logo} alt="SkillPulse Logo" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-white text-sm font-bold leading-none">SkillPulse AI</h1>
            <span className="text-[9px] font-mono text-indigo-400 font-semibold uppercase">Employee Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          {/* Menu Drawer Toggle */}
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

      <aside className={`h-screen bg-[#0F172A] text-slate-400 p-6 flex flex-col shadow-2xl fixed left-0 top-0 w-64 border-r border-slate-800/40 select-none z-50 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      
      <style>{`
        .custom-sidebar-nav::-webkit-scrollbar { width: 0px; display: none; }
        .custom-sidebar-nav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Logo Section */}
      <motion.div
        onClick={() => navigate('/dashboard')}
        whileTap={{ scale: 0.98 }}
        className="mb-10 px-2 flex items-center gap-3 cursor-pointer group relative z-10"
      >
        {!imgFailed ? (
          <motion.img 
            src={logo} 
            alt="SkillPulse Logo" 
            onError={() => setImgFailed(true)}
            whileHover={{ rotate: -12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-8 h-8 object-contain" 
          />
        ) : (
          <motion.div 
            whileHover={{ rotate: -12, scale: 1.1 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md"
          >
            <Activity className="w-5 h-5 text-white" />
          </motion.div>
        )}

        <h1 className="text-white text-xl font-bold tracking-tight group-hover:text-indigo-400 transition-colors duration-300">
          SkillPulse AI
        </h1>
      </motion.div>

      {/* Navigation Links */}
      <nav className="space-y-1 flex-1 overflow-y-auto custom-sidebar-nav relative pb-4 border-b border-slate-800">
        {menuItems.map((item) => {
          const isItemActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-300 relative group border-0 outline-none ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isItemActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-[#1E293B] rounded-xl z-0"
                    />
                  )}

                  <item.icon 
                    className={`w-5 h-5 transition-colors duration-300 z-10 shrink-0 ${
                      isItemActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} 
                  />

                  <span className="font-semibold text-sm tracking-wide z-10 truncate">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="pt-4 z-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors duration-300 font-semibold text-sm tracking-wide cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  </>
  );
};

export default Sidebar;