import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoleDefaultPath } from './ProtectedRoute';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setCurrentUser(null);
    window.location.replace('/login');
  };

  const dashboardPath = currentUser?.role ? getRoleDefaultPath(currentUser.role) : '/dashboard';

  return (
    <nav className="flex justify-between items-center px-4 sm:px-8 md:px-16 py-3.5 bg-[#E9EAF7]/85 sticky top-0 z-50 border-b border-[#8A9CB7]/30 backdrop-blur-md select-none shadow-[0_4px_20px_-4px_rgba(23,35,62,0.04)]">      
      
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2.5 cursor-pointer group relative z-50">
        <motion.div 
          whileHover={{ rotate: 12, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 bg-[#17233E] rounded-xl flex items-center justify-center shadow-md shadow-[#17233E]/25 border border-white/40"
        >
          <svg className="w-4.5 h-4.5 text-[#1988A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </motion.div>
        <div className="text-xl font-extrabold text-[#17233E] tracking-tight">
          SkillPulse <span className="text-[#1988A3] transition-colors duration-300 group-hover:text-[#11C6DE]">-AI</span>
        </div>
      </Link>

      {/* Main Menu Links - Desktop Layout */}
      <div className="hidden md:flex gap-8 lg:gap-10 text-sm font-semibold text-[#5A6D89]">
        {['Features', 'Pricing', 'About', 'FAQ', 'Contact'].map((item) => (
          <Link 
            key={item}
            to={`/${item.toLowerCase()}`} 
            className="hover:text-[#17233E] transition-colors duration-200 relative py-1 group"
          >
            {item}
            {/* Animated Underline Effect */}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1988A3] transition-all duration-300 group-hover:w-full rounded-full" />
          </Link>
        ))}
      </div>

      {/* Auth Buttons - Desktop & Tablet Layout */}
      <div className="hidden sm:flex items-center gap-3.5 relative z-50">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <Link
              to={dashboardPath}
              className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#17233E] hover:bg-[#1B3154] transition shadow-md shadow-[#17233E]/20"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-xs font-bold text-[#5A6D89] hover:text-[#17233E] transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* Login: Glass button */}
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/login" 
                className="px-5 py-2 rounded-full text-xs font-bold text-[#17233E] border border-[#8A9CB7]/40 bg-white/70 hover:bg-white hover:border-[#8A9CB7] transition-all shadow-sm inline-block"
              >
                Login
              </Link>
            </motion.div>

            {/* Sign Up: Cyan Accent */}
            <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/signup" 
                className="bg-[#1988A3] hover:bg-[#157289] px-6 py-2 rounded-full text-xs font-bold text-white transition shadow-lg shadow-[#1988A3]/25 hover:shadow-[#1988A3]/40 block"
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
        className="flex flex-col gap-1.5 md:hidden p-2 relative z-50 focus:outline-none"
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
            className="absolute top-0 left-0 w-full bg-[#E9EAF7]/95 backdrop-blur-2xl border-b border-[#8A9CB7]/30 pt-20 pb-8 px-6 shadow-2xl z-40 flex flex-col gap-5 md:hidden text-[#17233E]"
          >
            <div className="flex flex-col gap-4 text-sm font-bold text-[#5A6D89] text-center">
              {['Features', 'Pricing', 'About', 'FAQ', 'Contact'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`} 
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#1988A3] transition-colors py-2 border-b border-[#8A9CB7]/20"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* In-Menu Responsive Side-by-side Auth Buttons */}
            <div className="flex flex-row gap-3 mt-3 px-2">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2.5 rounded-full text-xs font-bold text-[#17233E] border border-[#8A9CB7]/40 bg-white/80 hover:bg-white transition-all shadow-sm"
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
