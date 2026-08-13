import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Upgraded for seamless micro-interactions and mobile reveals

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle switch state

  return (
    <nav className="flex justify-between items-center px-6 md:px-16 py-4 bg-[#F1F3F5] sticky top-0 z-50 border-b border-slate-200 backdrop-blur-md bg-opacity-90">      
      
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer group relative z-50">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </motion.div>
        <div className="text-xl font-bold text-slate-900 tracking-tight">
          SkillPulse <span className="text-indigo-600 transition-colors duration-300 group-hover:text-indigo-500">-AI</span>
        </div>
      </Link>

      {/* Main Menu Links - Desktop Layout */}
      <div className="hidden md:flex gap-8 lg:gap-10 text-sm font-semibold text-slate-500">
        {['Features', 'Pricing', 'About', 'FAQ', 'Contact'].map((item) => (
          <Link 
            key={item}
            to={`/${item.toLowerCase()}`} 
            className="hover:text-indigo-600 transition-colors duration-200 relative py-1 group"
          >
            {item}
            {/* Animated Underline Effect */}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Auth Buttons - Desktop & Tablet Layout */}
      <div className="hidden sm:flex items-center gap-4 relative z-50">
        {/* Login: Transparent with Outline effect */}
        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
          <Link 
            to="/login" 
            className="px-6 py-2 rounded-full text-sm font-bold text-slate-700 border border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all inline-block"
          >
            Login
          </Link>
        </motion.div>

        {/* Sign Up: Solid Indigo */}
        <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/signup" 
            className="bg-indigo-600 px-7 py-2.5 rounded-full text-sm font-bold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100 block"
          >
            Sign Up
          </Link>
        </motion.div>
      </div>

      {/* Mobile Menu Action Trigger (Hamburger Menu Button) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1.5 md:hidden p-2 relative z-50 focus:outline-none"
        aria-label="Toggle Menu"
      >
        <span className={`w-6 h-0.5 bg-slate-800 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-slate-800 transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-slate-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Sidebar Flyout Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full bg-[#F1F3F5] border-b border-slate-200 pt-24 pb-10 px-6 shadow-xl z-40 flex flex-col gap-6 md:hidden"
          >
            <div className="flex flex-col gap-5 text-base font-bold text-slate-600 text-center">
              {['Features', 'Pricing', 'About', 'FAQ', 'Contact'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`} 
                  onClick={() => setIsOpen(false)}
                  className="hover:text-indigo-600 transition-colors py-2 border-b border-slate-200/50"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* In-Menu Responsive Alternative Auth Triggers */}
            <div className="flex flex-col sm:hidden gap-3 mt-4">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-full text-sm font-bold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 transition-all"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-indigo-600 py-3 rounded-full text-sm font-bold text-white hover:bg-indigo-700 transition shadow-md"
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