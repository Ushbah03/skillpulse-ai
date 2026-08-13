import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  UserCheck
} from 'lucide-react';

import logo from '../assets/images/logo.png';

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

  const handleLogout = () => {
    // Clear auth session or tokens if stored
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="h-screen bg-[#071229] text-slate-400 flex flex-col fixed left-0 top-0 w-64 border-r border-[#0f1c38] z-50 select-none">
      
      {/* Invisible Custom Scrollbar Rules */}
      <style>{`
        .custom-hr-scrollbar::-webkit-scrollbar { width: 0px; display: none; }
        .custom-hr-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header & Tenant Identity Branding Section */}
      <div className="border-b border-[#0f1c38]">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="px-5 pt-5 pb-3 flex items-center gap-3 cursor-pointer group relative z-10"
          onClick={() => navigate('/select-role')}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 bg-transparent">
            <motion.img
              src={logo}
              alt="SkillPulse Logo"
              whileHover={{ rotate: -10, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 14 }}
              className="w-8 h-8 object-contain"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-white text-[18px] font-semibold tracking-tight group-hover:text-indigo-400 transition-colors duration-300">
              SkillPulse AI
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400/80">
              HR Administration
            </span>
          </div>
        </motion.div>

        {/* Multi-Tenant Scope Pill */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1832] border border-[#16274e] text-xs text-slate-300">
            <Building className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate font-medium">{currentTenant}</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Tenant Active" />
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-hr-scrollbar border-b border-[#0f1c38] relative">
        {menuItems.map((item) => {
          const isItemActive = item.path === '/hr-dashboard'
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/hr-dashboard'}
              className={({ isActive }) =>
                `flex items-start gap-3 px-3.5 py-2.5 rounded-2xl transition-colors duration-200 group relative border-0 outline-none ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
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
                      className="absolute inset-0 bg-[#101D3A] rounded-2xl z-0"
                    />
                  )}

                  {/* Micro-interaction Hover Layer */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-[#0d1832]/40 rounded-2xl transition-colors duration-200 pointer-events-none" />

                  <item.icon
                    className={`w-[17px] h-[17px] mt-[2px] flex-shrink-0 z-10 transition-all duration-200 group-hover:scale-105 ${
                      isActive ? 'text-blue-500 scale-105' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />

                  <span className="text-[13.5px] leading-[20px] font-medium tracking-wide z-10 transition-transform duration-200 group-hover:translate-x-0.5">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Persistent HR Profile & Logout Tray */}
      <div className="p-3 bg-[#071229] space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#0b162e] border border-[#102142]">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
            HR
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-slate-200 truncate">HR Director</span>
            <span className="text-[10px] text-slate-500 truncate">hr@enterprise.com</span>
          </div>
        </div>

        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group border-0 outline-none relative"
        >
          <LogOut className="w-[17px] h-[17px] flex-shrink-0 text-slate-500 group-hover:text-red-400 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span className="text-[13.5px] leading-[20px] font-medium tracking-wide transition-transform duration-300 group-hover:translate-x-0.5">
            Logout
          </span>
        </motion.button>
      </div>

    </div>
  );
};

export default HRSidebar;