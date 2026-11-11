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
    { label: 'Features', path: '/features', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Pricing', path: '/pricing', icon: <Zap className="w-3.5 h-3.5" /> },
    { label: 'About', path: '/about', icon: <Building2 className="w-3.5 h-3.5" /> },
    { label: 'FAQ', path: '/faq', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { label: 'Contact', path: '/contact', icon: <Send className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="flex justify-between items-center px-4 sm:px-8 md:px-12 py-3 bg-gradient-to-r from-[#17233E]/95 via-[#1B3154]/95 to-[#121E33]/95 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 select-none relative">      
      {/* Bottom Glowing Cyan Accent Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1988A3] to-transparent opacity-80 pointer-events-none" />

      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2.5 cursor-pointer group relative z-50">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-md border border-white/20 group-hover:border-[#1988A3]/60 transition-all"
        >
          <svg className="w-4.5 h-4.5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </motion.div>
        <div className="text-xl font-extrabold text-white tracking-tight">
          SkillPulse <span className="text-[#11C6DE] transition-colors duration-300 group-hover:text-[#1988A3]">-AI</span>
        </div>
      </Link>

      {/* Glassy Navigation Tabs Capsule Dock (Style 1 from @code.xr reference) */}
      <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_10px_30px_rgba(11,21,40,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link 
              key={item.label}
              to={item.path} 
              className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 flex items-center gap-2 select-none group cursor-pointer ${
                isActive ? 'text-[#17233E]' : 'text-[#8A9CB7] hover:text-white'
              }`}
            >
              {/* Sliding Raised Frosted Active Pill Pod */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.2)] -z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              
              <span className={`relative z-10 transition-colors ${
                isActive ? 'text-[#1988A3]' : 'text-[#8A9CB7] group-hover:text-[#11C6DE]'
              }`}>
                {item.icon}
              </span>
              
              <span className="relative z-10 font-bold tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Auth Buttons - Desktop & Tablet Layout */}
      <div className="hidden sm:flex items-center gap-3 relative z-50">
        {currentUser ? (
          <div className="flex items-center gap-2.5">
            <Link
              to={dashboardPath}
              className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#1988A3] hover:bg-[#157289] transition shadow-md shadow-[#1988A3]/25"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-xs font-bold text-[#8A9CB7] hover:text-white transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* Login: Frosted Glass Pill */}
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/login" 
                className="px-4.5 py-1.5 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all backdrop-blur-md shadow-xs inline-block"
              >
                Login
              </Link>
            </motion.div>

            {/* Sign Up: Cyan Accent */}
            <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0FB5CB] px-5 py-1.5 rounded-full text-xs font-extrabold text-[#0B1528] transition shadow-md shadow-[#1988A3]/30 hover:shadow-[#1988A3]/50 block"
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
        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-white transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Sidebar Flyout Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full bg-[#17233E]/98 backdrop-blur-3xl border-b border-white/10 pt-20 pb-8 px-6 shadow-2xl z-40 flex flex-col gap-4 md:hidden text-white"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link 
                    key={item.label}
                    to={item.path} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-white text-[#17233E] font-bold shadow-md' 
                        : 'text-[#8A9CB7] hover:text-white hover:bg-white/5 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#1988A3]' : 'text-[#8A9CB7]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1988A3]" />
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
                  className="flex-1 text-center py-2.5 rounded-full text-xs font-bold text-white bg-[#1988A3] hover:bg-[#157289] transition shadow-md shadow-[#1988A3]/25"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="flex-1 text-center py-2.5 rounded-full text-xs font-bold text-[#8A9CB7] border border-white/20 hover:text-white transition-all shadow-sm backdrop-blur-md cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-row gap-3 mt-3 px-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-full text-xs font-bold text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-all shadow-sm backdrop-blur-md"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-full text-xs font-bold text-white bg-[#1988A3] hover:bg-[#157289] transition shadow-md shadow-[#1988A3]/25"
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
