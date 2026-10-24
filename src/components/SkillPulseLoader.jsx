import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SkillPulseLoader = ({ 
  message = "Calibrating Neural Skill Matrices...", 
  fullScreen = true,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const telemetrySteps = [
    "Calibrating Neural Skill Matrices...",
    "Synthesizing Enterprise Workforce Telemetry...",
    "Mapping Multi-Tenant Skill Taxonomy...",
    "Synchronizing Live Readiness Indexes..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % telemetrySteps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      {/* Outer Rotating Glowing Motion Graphic */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        {/* Ambient Backlight Glow */}
        <div className="absolute inset-0 bg-[#1988A3]/30 blur-2xl rounded-full animate-pulse" />
        
        {/* Outer Orbital Ring with Cyan Glow Node */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#1988A3]/40"
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#11C6DE] shadow-[0_0_12px_#11C6DE]" />
        </motion.div>

        {/* Counter-Rotating Mid Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute inset-2.5 rounded-full border border-[#8A9CB7]/30"
        >
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#1988A3] shadow-[0_0_8px_#1988A3]" />
        </motion.div>

        {/* Inner Pulsing Radar Core */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#121E33] border border-white/30 flex items-center justify-center shadow-xl backdrop-blur-md">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20"
          >
            <svg className="w-5 h-5 text-[#11C6DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Brand & Dynamic Telemetry Readout */}
      <div className="space-y-2 max-w-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1988A3]/10 border border-[#1988A3]/20">
          <span className="w-2 h-2 rounded-full bg-[#11C6DE] animate-ping" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1988A3]">
            Telemetry Active
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-[#17233E] tracking-tight">
          SkillPulse <span className="text-[#1988A3]">-AI</span>
        </h3>

        <div className="h-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-mono text-[#5A6D89] font-medium"
            >
              {message || telemetrySteps[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Shimmering Progress Bar */}
        <div className="w-48 h-1.5 bg-[#8A9CB7]/20 rounded-full overflow-hidden mx-auto mt-3 relative">
          <motion.div
            animate={{ x: [-192, 192] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-24 h-full bg-gradient-to-r from-transparent via-[#1988A3] to-transparent rounded-full shadow-[0_0_8px_#1988A3]"
          />
        </div>
      </div>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#E9EAF7]/80 backdrop-blur-xl"
    >
      <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl border border-white/80 max-w-sm w-full mx-4 relative overflow-hidden">
        {content}
      </div>
    </motion.div>
  );
};

export default SkillPulseLoader;