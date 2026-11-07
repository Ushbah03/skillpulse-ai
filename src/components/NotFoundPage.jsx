import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF4FC] via-[#D8EBF9] to-[#C8E3F6] flex items-center justify-center px-4 py-16 sm:py-24 font-sans select-none relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl w-full bg-white/85 backdrop-blur-xl border border-white/90 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-blue-900/10 text-center relative z-10"
      >
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Compass className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Error 404 • Destination Unreachable</span>
        </div>

        {/* Big Glitch 404 Typography */}
        <h1 className="text-7xl sm:text-8xl font-black text-slate-900 tracking-tight mb-2">
          4<span className="text-blue-600">0</span>4
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Lost in the Talent Matrix
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          The requested route does not exist or may have been relocated. Verify the destination URL or navigate back to your workspace.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200/90 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Security & System Status Note */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldAlert className="w-4 h-4 text-slate-400" />
          <span>SkillPulse AI Multi-Tenant Security Gateway Active</span>
        </div>
      </motion.div>
    </div>
  );
}
