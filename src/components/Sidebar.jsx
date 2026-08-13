import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, UserCircle, 
  ClipboardCheck, 
  BarChart3, 
  Lightbulb, 
  BookOpen, 
  History, 
  Award, 
  Navigation, 
  LogOut 
} from 'lucide-react';

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

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="h-full bg-[#0F172A] text-slate-400 p-6 flex flex-col shadow-2xl relative select-none">
      
      <style>{`
        .custom-sidebar-nav::-webkit-scrollbar { width: 0px; display: none; }
        .custom-sidebar-nav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Logo Section */}
      <motion.div
        onClick={() => navigate('/select-role')}
        whileTap={{ scale: 0.98 }}
        className="mb-10 px-2 flex items-center gap-3 cursor-pointer group relative z-10"
      >
        <motion.img 
          src="/favicon.ico" 
          alt="SkillPulse Logo" 
          whileHover={{ rotate: -12, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="w-8 h-8 object-contain" 
        />
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

                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/3 rounded-xl transition-colors duration-200 pointer-events-none" />

                  <item.icon 
                    className={`w-5 h-5 transition-all duration-300 z-10 group-hover:scale-105 ${
                      isActive ? 'text-blue-500 scale-105' : 'text-slate-500 group-hover:text-slate-300'
                    }`} 
                  />
                  
                  <span className="text-sm font-medium tracking-wide z-10 transition-transform duration-300 group-hover:translate-x-0.5">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sticky Bottom Logout Button */}
      <div className="pt-4 mt-auto">
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group border-0 outline-none relative"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span className="text-sm font-medium tracking-wide transition-transform duration-300 group-hover:translate-x-0.5">
            Logout
          </span>
        </motion.button>
      </div>

    </div>
  );
};

export default Sidebar;