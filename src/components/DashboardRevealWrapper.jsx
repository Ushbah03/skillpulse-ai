import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DashboardRevealWrapper
 * Inspired by the "Dashboard V22" UI interaction (@CODE.XR):
 * 1. Atmospheric ambient dark loader with glowing SkillPulse radar and telemetry
 * 2. Dramatic circular iris expansion (clip-path bloom) revealing the glassmorphic dashboard
 * 3. Staggered kinetic entrance for cards and dashboard widgets
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.12,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 18, filter: 'blur(3px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const DashboardRevealWrapper = ({
  loading = false,
  loadingMessage = 'Calibrating Neural Skill Matrices...',
  workspaceName = 'Enterprise AI Workspace',
  origin = 'top-left', // 'top-left' | 'center'
  children,
}) => {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [telemetryStep, setTelemetryStep] = useState(0);

  const telemetrySteps = [
    'Calibrating Neural Skill Matrices...',
    'Synthesizing Enterprise Workforce Telemetry...',
    'Mapping Multi-Tenant Skill Taxonomy...',
    'Synchronizing Live Readiness Indexes...',
  ];

  // Minimum duration to guarantee a smooth, cinematic transition without micro-flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  // Cycle telemetry messages
  useEffect(() => {
    if (!loading && minTimeElapsed) return;
    const interval = setInterval(() => {
      setTelemetryStep((prev) => (prev + 1) % telemetrySteps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading, minTimeElapsed]);

  const isVisuallyLoading = loading || !minTimeElapsed;

  // Origin point for the circular iris expansion
  const originCoord = origin === 'center' ? '50% 50%' : '48px 48px';

  return (
    <div className="relative w-full min-h-screen">
      {/* 1. Cinematic Dark Ambient Loader Overlay */}
      <AnimatePresence mode="wait">
        {isVisuallyLoading && (
          <motion.div
            key="dashboard-dark-loader"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#091220] overflow-hidden select-none"
          >
            {/* Ambient Radial Glowing Orbs */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(25,136,163,0.32)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-[#11C6DE]/12 blur-[140px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {/* Glowing Logo & Telemetry Core */}
            <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-md w-full mx-4">
              {/* Outer Rotating Glowing Rings */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-[#1988A3]/30 blur-2xl rounded-full animate-pulse" />

                {/* Outer Dashed Orbital Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-[#1988A3]/45"
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#11C6DE] shadow-[0_0_14px_#11C6DE]" />
                </motion.div>

                {/* Counter Orbital Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 6.5, ease: 'linear' }}
                  className="absolute inset-2.5 rounded-full border border-white/20"
                >
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#1988A3] shadow-[0_0_10px_#1988A3]" />
                </motion.div>

                {/* Glowing Center Logo Mark */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#0D1A2E] border border-white/40 flex items-center justify-center shadow-2xl backdrop-blur-md">
                  <motion.div
                    animate={{ scale: [1, 1.14, 1], opacity: [0.85, 1, 0.85] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/25 shadow-inner"
                  >
                    <svg
                      className="w-6 h-6 text-[#11C6DE]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Status & Telemetry Readout */}
              <div className="space-y-2.5 max-w-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#11C6DE] animate-ping" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#11C6DE]">
                    {workspaceName}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  SkillPulse <span className="text-[#11C6DE]">AI</span>
                </h3>

                <div className="h-6 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={telemetryStep}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-xs font-mono text-slate-300/80 font-medium tracking-wide"
                    >
                      {loadingMessage || telemetrySteps[telemetryStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Shimmering Progress Bar */}
                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto mt-2 relative">
                  <motion.div
                    animate={{ x: [-192, 192] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                    className="w-24 h-full bg-gradient-to-r from-transparent via-[#11C6DE] to-transparent rounded-full shadow-[0_0_10px_#11C6DE]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Revealed Dashboard with Circular Iris Bloom & Staggered Entrance */}
      <motion.div
        key="dashboard-revealed-view"
        initial={{
          clipPath: `circle(0% at ${originCoord})`,
          opacity: 0.85,
        }}
        animate={
          !isVisuallyLoading
            ? {
                clipPath: `circle(170% at ${originCoord})`,
                opacity: 1,
              }
            : {
                clipPath: `circle(0% at ${originCoord})`,
                opacity: 0.85,
              }
        }
        transition={{
          duration: 0.95,
          ease: [0.16, 1, 0.3, 1], // Smooth organic spring ease
        }}
        onAnimationComplete={() => {
          if (!isVisuallyLoading) {
            setIsRevealed(true);
          }
        }}
        style={isRevealed ? { clipPath: 'none' } : {}}
        className="w-full relative"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={!isVisuallyLoading ? 'show' : 'hidden'}
          className="w-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardRevealWrapper;
