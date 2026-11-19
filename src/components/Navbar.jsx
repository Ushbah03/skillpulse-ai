import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoleDefaultPath } from './ProtectedRoute';
import { 
  Sparkles, 
  Zap, 
  Building2, 
  HelpCircle, 
  Send 
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  const handleLogout = () => {
    authAPI.logout();
  };

  const dashboardPath = currentUser?.role ? getRoleDefaultPath(currentUser.role) : '/dashboard';

  const navItems = [
    { label: 'Features', path: '/features', icon: <Sparkles className="w-4 h-4 lg:w-4.5 lg:h-4.5" /> },
    { label: 'Pricing', path: '/pricing', icon: <Zap className="w-4 h-4 lg:w-4.5 lg:h-4.5" /> },
    { label: 'About', path: '/about', icon: <Building2 className="w-4 h-4 lg:w-4.5 lg:h-4.5" /> },
    { label: 'FAQ', path: '/faq', icon: <HelpCircle className="w-4 h-4 lg:w-4.5 lg:h-4.5" /> },
    { label: 'Contact', path: '/contact', icon: <Send className="w-4 h-4 lg:w-4.5 lg:h-4.5" /> },
  ];

  return (
    <nav className="flex justify-between items-center px-4 sm:px-8 md:px-12 py-3.5 sm:py-4 glass-nav sticky top-0 z-50 select-none">      
      {/* Bottom Subtle Cyan-Ice Accent Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1988A3]/55 to-transparent opacity-90 pointer-events-none" />

      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer group relative z-50">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(23,35,62,0.10)] border border-white group-hover:border-[#1988A3]/50 transition-all"
        >
          <svg className="w-5 h-5 text-[#1988A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </motion.div>
        <div className="text-xl sm:text-2xl font-black text-[#17233E] tracking-tight">
          SkillPulse <span className="text-[#1988A3] transition-colors duration-300 group-hover:text-[#11C6DE]">-AI</span>
        </div>
      </Link>

      {/* Glassy Navigation Tabs Capsule Dock */}
      <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-white/75 backdrop-blur-2xl border border-white shadow-[0_8px_24px_rgba(23,35,62,0.08),inset_0_1px_1px_rgba(255,255,255,1)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link 
              key={item.label}
              to={item.path} 
              className={`relative px-5 py-2 rounded-full text-sm lg:text-[15px] font-extrabold transition-all duration-300 flex items-center gap-2 select-none group cursor-pointer ${
                isActive ? 'text-[#17233E]' : 'text-[#243656] hover:text-[#17233E]'
              }`}
            >
              {/* Translucent Light Ice-Glass Active Pill Pod */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-[#F4FAFD] to-[#E3F4FA] backdrop-blur-xl border border-[#1988A3]/35 shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_4px_14px_rgba(25,136,163,0.18)] -z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              
              <span className={`relative z-10 transition-colors duration-200 ${
                isActive ? 'text-[#1988A3]' : 'text-[#1988A3]/80 group-hover:text-[#1988A3]'
              }`}>
                {item.icon}
              </span>
              
              <span className="relative z-10 font-extrabold tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Auth Buttons - Desktop & Tablet Layout */}
      <div className="hidden sm:flex items-center gap-3 relative z-50">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <Link
              to={dashboardPath}
              className="px-6 py-2.5 rounded-full text-sm lg:text-[15px] font-extrabold text-white bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0FB5CB] transition shadow-md shadow-[#1988A3]/25"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full text-sm lg:text-[15px] font-extrabold text-[#243656] hover:text-[#17233E] transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* Login: Light Ice Frosted Glass Pill */}
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/login" 
                className="px-6 py-2.5 rounded-full text-sm lg:text-[15px] font-extrabold text-[#17233E] bg-white/85 hover:bg-white border border-white transition-all backdrop-blur-md shadow-[0_4px_12px_rgba(23,35,62,0.08)] inline-block"
              >
                Login
              </Link>
            </motion.div>

            {/* Sign Up: Cyan Accent Pill */}
            <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] hover:from-[#1988A3] hover:to-[#11C6DE] px-6 py-2.5 rounded-full text-sm lg:text-[15px] font-extrabold text-white transition shadow-md shadow-[#17233E]/25 hover:shadow-[#1988A3]/40 block"
              >
                Sign Up
              </Link>
            </motion.div>
          </>
        )}
      </div>

      {/* Mobile Menu Action Trigger (Hamburger Menu Button) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1.5 md:hidden p-2 relative z-50 focus:outline-none cursor-pointer"
        aria-label="Toggle Menu"
      >
        <span className={`w-6 h-0.5 bg-[#17233E] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-[#17233E] transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-[#17233E] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Sidebar Flyout Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full bg-[#EDF2FA]/98 backdrop-blur-3xl border-b border-white/95 pt-20 pb-8 px-6 shadow-[0_20px_50px_rgba(23,35,62,0.12)] z-40 flex flex-col gap-4 md:hidden text-[#17233E]"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link 
                    key={item.label}
                    to={item.path} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base transition-all ${
                      isActive 
                        ? 'bg-white/90 backdrop-blur-xl border border-[#1988A3]/30 text-[#17233E] font-extrabold shadow-[0_4px_14px_rgba(25,136,163,0.12),inset_0_1px_1px_rgba(255,255,255,1)]' 
                        : 'text-[#243656] hover:text-[#17233E] hover:bg-white/55 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-[#1988A3]' : 'text-[#243656]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#1988A3] shadow-[0_0_8px_rgba(25,136,163,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* In-Menu Responsive Side-by-side Auth Buttons */}
            {currentUser ? (
              <div className="flex flex-row gap-3 mt-3 px-2">
                <Link 
                  to={dashboardPath}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-3 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0FB5CB] transition shadow-md shadow-[#1988A3]/25"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="flex-1 text-center py-3 rounded-full text-sm font-extrabold text-[#243656] border border-white/80 bg-white/60 hover:text-[#17233E] transition-all shadow-sm backdrop-blur-md cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-row gap-3 mt-3 px-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-3 rounded-full text-sm font-extrabold text-[#17233E] border border-white bg-white/85 hover:bg-white transition-all shadow-sm backdrop-blur-md"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-3 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-[#17233E] to-[#1988A3] hover:from-[#157289] hover:to-[#0FB5CB] transition shadow-md shadow-[#1988A3]/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
