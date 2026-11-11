import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Cpu,
  Zap,
  ArrowRight,
  Activity,
  Sparkles,
  BrainCircuit,
  Lock,
  ChevronRight,
  Clock,
  Database,
  Layers
} from 'lucide-react';
import dashboardImg from '../assets/images/intro-image.jpg';
import LiquidRibbonWave from './LiquidRibbonWave';

const SkillPulseLanding = () => {
  const { tenantId } = useParams();

  // 3D Perspective Tilt Physics & Mouse Tracking for Liquid Wave Parallax
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 190, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);

  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 });
  const [waveMouse, setWaveMouse] = useState({ x: 0, y: 0 });

  const handlePageMouseMove = (e) => {
    const wx = e.clientX / window.innerWidth - 0.5;
    const wy = e.clientY / window.innerHeight - 0.5;
    setWaveMouse({ x: wx, y: wy });
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setSheen({
      x: ((x + 0.5) * 100).toFixed(1),
      y: ((y + 0.5) * 100).toFixed(1),
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSheen((prev) => ({ ...prev, opacity: 0 }));
  };

  const intenseUp = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.09 } }
  };

  const marqueeItems = [
    { label: 'PostgreSQL v16', icon: Database },
    { label: 'RLS Isolation', icon: Lock },
    { label: 'GenAI Taxonomy', icon: BrainCircuit },
    { label: '99.9% Platform SLA', icon: ShieldCheck },
    { label: 'Role-Scoped RBAC', icon: Layers },
    { label: 'Live Telemetry', icon: Activity }
  ];

  return (
    <div
      onMouseMove={handlePageMouseMove}
      className="bg-gradient-to-b from-[#17233E] via-[#1B3154] to-[#13284A] font-sans text-white overflow-x-hidden selection:bg-[#11C6DE] selection:text-[#17233E] relative min-h-screen"
    >
      {/* GLOBAL PROJECT BLUE COLOR GRADING & FULL-SCREEN ANIMATED SILK BACKDROP */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Signature Project Blue & Cyan Ambient Mesh Glows (#17233E / #1B3154 / #1988A3 / #11C6DE) */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1150px] h-[440px] bg-[radial-gradient(ellipse_at_center,rgba(25,136,163,0.28)_0%,rgba(17,198,222,0.12)_45%,transparent_75%)]" />
        <div className="absolute top-[22%] -left-24 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] bg-[#1988A3]/24 blur-[110px] rounded-full" />
        <div className="absolute top-[48%] -right-24 w-[450px] sm:w-[680px] h-[450px] sm:h-[680px] bg-[#11C6DE]/18 blur-[120px] rounded-full" />
        <div className="absolute bottom-[6%] left-1/4 w-[520px] sm:w-[780px] h-[400px] bg-[#1988A3]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[70%] right-1/4 w-[400px] h-[400px] bg-[#8A9CB7]/16 blur-[110px] rounded-full" />
        {/* Subtle Ice-Blue Dot Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(233,234,247,0.12)_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
        {/* Full-Viewport Seamless Ambient 3D Liquid Silk Wave Layer (Alpha Masked - Zero Seam Lines) */}
        <div className="absolute inset-0 opacity-45 [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_85%,transparent_100%)]">
          <LiquidRibbonWave mouseOffset={waveMouse} />
        </div>
      </div>

      {/* 1. HERO SECTION - FULL-BLEED PROJECT NAVY-BLUE WITH VIVID 3D LIQUID WAVE */}
      <section className="relative z-10 w-full border-b border-white/15 text-white overflow-hidden">
        {/* Foreground Vivid Hero 3D Metallic Liquid Silk Ribbon (Smoothly Alpha-Masked Top & Bottom) */}
        <div className="absolute inset-x-0 bottom-8 sm:bottom-10 h-[340px] sm:h-[420px] md:h-[460px] pointer-events-none z-0 opacity-95 [mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_85%,transparent_100%)]">
          <LiquidRibbonWave mouseOffset={waveMouse} />
        </div>

        {/* TOP CENTERED HERO TYPOGRAPHY & ACTIONS */}
        <div className="max-w-7xl mx-auto relative z-10 pt-8 sm:pt-11 md:pt-14 px-4 sm:px-8 md:px-14 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            {/* Announcement Capsule Pill */}
            <motion.div
              variants={intenseUp}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-4 sm:mb-5 backdrop-blur-xl shadow-sm"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#11C6DE] rounded-full animate-ping" />
              <span className="text-[#E9EAF7] text-[10px] sm:text-xs font-semibold tracking-wide">
                {tenantId ? `${tenantId} Enterprise Workspace` : 'SkillPulse-AI Multi-Tenant Platform'}
              </span>
              <span className="h-3 w-[1px] bg-white/25 mx-0.5 hidden sm:inline-block" />
              <Link
                to="/features"
                className="hidden sm:inline-flex items-center gap-0.5 text-[11px] font-bold text-[#11C6DE] hover:text-white transition-colors"
              >
                Explore <ChevronRight className="w-3 h-3" />
              </Link>
            </motion.div>

            {/* Bold Centered Display Heading */}
            <motion.h1
              variants={intenseUp}
              className="text-2xl sm:text-4xl md:text-[3.1rem] font-extrabold leading-[1.12] tracking-tight text-white mb-3 sm:mb-4"
            >
              AI-Powered Skill Intelligence <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-[#E9EAF7] via-white to-[#11C6DE] bg-clip-text text-transparent">
                for Modern Teams
              </span>
            </motion.h1>

            {/* Centered Subtitle */}
            <motion.p
              variants={intenseUp}
              className="text-[#E9EAF7]/85 text-xs sm:text-base leading-relaxed max-w-xl mb-5 sm:mb-6 font-light"
            >
              Measure readiness. Close skill gaps. Accelerate workforce growth with enterprise tenant-isolated data insights.
            </motion.p>

            {/* Centered Dual CTA Pill Buttons */}
            <motion.div
              variants={intenseUp}
              className="flex flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6"
            >
              <Link
                to="/signup"
                className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0FB5CB] text-[#17233E] px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-[0_8px_28px_-4px_rgba(17,198,222,0.55)] hover:shadow-[0_12px_36px_-4px_rgba(17,198,222,0.75)] hover:-translate-y-0.5 inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer group"
              >
                Get Started <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all backdrop-blur-md inline-flex items-center justify-center shrink-0 cursor-pointer"
              >
                Request Demo
              </Link>
            </motion.div>

            {/* 3 Minimal Inline Assurance Badges */}
            <motion.div
              variants={intenseUp}
              className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-2 text-[10px] sm:text-xs text-[#E9EAF7]/85 mb-5 sm:mb-7"
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-[#11C6DE]" />
                </span>
                98.4% Model Precision
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Lock className="w-2.5 h-2.5 text-[#11C6DE]" />
                </span>
                RLS Data Isolation
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Clock className="w-2.5 h-2.5 text-[#11C6DE]" />
                </span>
                Real-Time Telemetry
              </span>
            </motion.div>
          </motion.div>

          {/* CENTERED 3D PERSPECTIVE DASHBOARD SHOWCASE RIDING OVER THE 3D LIQUID WAVE */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative max-w-xl lg:max-w-[650px] mx-auto pb-6 sm:pb-8 [perspective:1400px] select-none"
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d'
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative rounded-xl sm:rounded-[1.8rem] group"
            >
              {/* Frosted Navy-Glass Vessel with Specular Cursor Sheen */}
              <div
                className="relative bg-[#1B3154]/60 backdrop-blur-2xl border border-white/30 rounded-xl sm:rounded-[1.8rem] p-1.5 sm:p-3 shadow-[0_30px_70px_-15px_rgba(23,35,62,0.85),0_0_45px_rgba(17,198,222,0.22)] overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Dynamic Cursor Specular Light Sheen */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-[1.8rem] transition-opacity duration-300 z-30"
                  style={{
                    background: `radial-gradient(circle 340px at ${sheen.x}% ${sheen.y}%, rgba(17, 198, 222, 0.28), rgba(233,234,247,0.08) 40%, transparent 72%)`,
                    opacity: sheen.opacity
                  }}
                />

                {/* Dashboard Image Canvas */}
                <div style={{ transform: 'translateZ(0px)' }} className="relative z-10 overflow-hidden rounded-lg sm:rounded-[1.2rem]">
                  <img
                    src={dashboardImg}
                    alt="SkillPulse Dashboard Preview"
                    className="rounded-lg sm:rounded-[1.2rem] w-full opacity-95 shadow-inner transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17233E]/35 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating 3D Telemetry Chip: Top Right */}
                <div
                  className="hidden sm:flex absolute top-5 right-5 bg-white/95 border border-white backdrop-blur-2xl px-3.5 py-2 rounded-2xl shadow-[0_14px_30px_-5px_rgba(23,35,62,0.5)] items-center gap-2.5 text-[#17233E] z-40"
                  style={{ transform: 'translateZ(42px)' }}
                >
                  <div className="p-1.5 rounded-xl bg-[#1988A3]/10 text-[#1988A3]">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[8px] text-[#5A6D89] uppercase font-mono font-bold">Accuracy Model</div>
                    <div className="text-[11px] font-black text-[#1988A3] flex items-center gap-1">
                      98.4% Precision
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                  </div>
                </div>

                {/* Floating 3D Telemetry Chip: Bottom Left */}
                <div
                  className="hidden sm:flex absolute bottom-5 left-5 bg-white/95 border border-white backdrop-blur-2xl px-3.5 py-2 rounded-2xl shadow-[0_14px_30px_-5px_rgba(23,35,62,0.5)] items-center gap-2.5 text-[#17233E] z-40"
                  style={{ transform: 'translateZ(46px)' }}
                >
                  <div className="p-1.5 rounded-xl bg-[#17233E]/10 text-[#17233E]">
                    <Building2 className="w-3.5 h-3.5 text-[#1988A3]" />
                  </div>
                  <div className="text-left">
                    <div className="text-[8px] text-[#5A6D89] uppercase font-mono font-bold">PostgreSQL Multi-Tenant</div>
                    <div className="text-[11px] font-black text-[#17233E]">Live Partition Active</div>
                  </div>
                </div>

                {/* Compact Mobile Status Row */}
                <div className="sm:hidden flex items-center justify-between gap-2 mt-2 px-1 relative z-20">
                  <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2 py-1 rounded-md border border-white/20 text-[9px] font-medium text-white">
                    <Zap className="w-2.5 h-2.5 text-[#11C6DE]" />
                    <span>98.4% Model Precision</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2 py-1 rounded-md border border-white/20 text-[9px] font-medium text-white">
                    <Building2 className="w-2.5 h-2.5 text-[#11C6DE]" />
                    <span>RLS Partition Active</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM ENTERPRISE MARQUEE STRIP */}
        <div className="relative z-10 border-t border-white/15 bg-[#17233E]/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-14 py-3.5 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <span className="text-[10px] sm:text-xs text-[#E9EAF7]/75 font-medium shrink-0 leading-tight text-center sm:text-left">
              Relied on for enterprise <br className="hidden sm:inline" /> workforce intelligence
            </span>

            <div className="flex-1 overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="flex items-center gap-8 sm:gap-12 w-max"
              >
                {[...marqueeItems, ...marqueeItems].map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-[#E9EAF7]/90 hover:text-[#11C6DE] transition-colors text-xs sm:text-sm font-semibold whitespace-nowrap"
                  >
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <m.icon className="w-3 h-3 text-[#11C6DE]" />
                    </span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION WITH ROYAL NAVY FROSTED GLASS CARDS */}
      <section className="py-10 sm:py-16 md:py-22 px-3.5 sm:px-6 md:px-14 text-center relative z-10">
        <div className="max-w-3xl mx-auto mb-7 sm:mb-12">
          <span className="px-3 py-1 rounded-full bg-[#11C6DE]/15 border border-[#11C6DE]/35 text-[#11C6DE] text-[9px] sm:text-xs font-mono font-bold uppercase tracking-wider inline-block mb-2 sm:mb-3 backdrop-blur-md">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight">Unlock Your Workforce Potential</h2>
          <p className="text-[#E9EAF7]/80 text-[11px] sm:text-base font-light">Actionable intelligence to align your team's capabilities with strategic goals.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-left">
          {[
            {
              title: 'AI Skill Gap Analysis',
              desc: 'Automatically detect critical skill deficiencies across enterprise teams and predict future talent needs.',
              icon: BrainCircuit,
              color: 'text-[#11C6DE] bg-[#1988A3]/20 border-[#11C6DE]/35',
              tag: 'GenAI Engine'
            },
            {
              title: 'Workforce Readiness',
              desc: "Quantify your organization's preparedness with dynamic, real-time readiness scoring models.",
              icon: Activity,
              color: 'text-[#11C6DE] bg-[#11C6DE]/20 border-[#11C6DE]/35',
              tag: 'Live Scoring'
            },
            {
              title: 'Multi-Tenant Security',
              desc: 'Enterprise-grade isolated data architecture supporting custom SSO and role-based access control.',
              icon: ShieldCheck,
              color: 'text-[#E9EAF7] bg-white/15 border-white/25',
              tag: 'Data Partition'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/[0.11] via-[#1B3154]/55 to-[#1988A3]/15 hover:from-white/[0.16] hover:to-[#11C6DE]/22 backdrop-blur-2xl border border-white/20 hover:border-[#11C6DE]/55 transition-all duration-300 group cursor-pointer relative overflow-hidden shadow-[0_20px_50px_-15px_rgba(23,35,62,0.55)] hover:shadow-[0_24px_55px_-12px_rgba(17,198,222,0.28)]"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-5">
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border flex items-center justify-center ${item.color} shadow-inner group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[8px] sm:text-[10px] font-mono font-bold text-[#E9EAF7]/85 bg-white/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-bold sm:font-extrabold text-sm sm:text-lg md:text-xl mb-1.5 sm:mb-2 text-white group-hover:text-[#11C6DE] transition-colors">{item.title}</h3>
              <p className="text-[#E9EAF7]/80 text-[11px] sm:text-xs leading-relaxed font-normal">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS STEPPER */}
      <section className="py-10 sm:py-14 md:py-20 px-3.5 sm:px-6 md:px-14 relative z-10">
        <div className="text-center mb-7 sm:mb-12">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#E9EAF7] text-[9px] sm:text-xs font-mono font-bold uppercase tracking-wider inline-block mb-2 sm:mb-3 backdrop-blur-md">
            SYSTEM WORKFLOW
          </span>
          <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight">How SkillPulse Works</h2>
          <p className="text-[#E9EAF7]/80 text-[11px] sm:text-base font-light">A streamlined process to continuously elevate your organizational capabilities.</p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {[
              { num: '01', t: 'Assess Skills', d: 'Baseline role-specific evaluations.' },
              { num: '02', t: 'Analyze Gaps', d: 'AI mapping to benchmarks.' },
              { num: '03', t: 'Recommend Learning', d: 'Targeted course programs.' },
              { num: '04', t: 'Improve Readiness', d: 'Live telemetry index tracking.' }
            ].map((step, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white/[0.10] via-[#1B3154]/50 to-[#1988A3]/12 hover:from-white/[0.15] hover:to-[#11C6DE]/20 backdrop-blur-2xl border border-white/20 hover:border-[#11C6DE]/50 p-4 sm:p-6 rounded-2xl flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 shadow-[0_18px_40px_-15px_rgba(23,35,62,0.5)]"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-[#1988A3] to-[#11C6DE] text-[#17233E] rounded-full flex items-center justify-center text-xs sm:text-sm font-black mb-2.5 sm:mb-3.5 shadow-[0_0_20px_rgba(17,198,222,0.35)] group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h4 className="font-bold sm:font-extrabold text-xs sm:text-sm text-white mb-1 group-hover:text-[#11C6DE] transition-colors">{step.t}</h4>
                <p className="text-[#E9EAF7]/80 text-[10px] sm:text-xs font-normal leading-tight sm:leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EMPOWERING EVERY ROLE */}
      <section className="py-10 sm:py-14 md:py-20 px-3.5 sm:px-6 md:px-14 relative z-10">
        <div className="text-center mb-7 sm:mb-12">
          <span className="px-3 py-1 rounded-full bg-[#11C6DE]/15 border border-[#11C6DE]/35 text-[#11C6DE] text-[9px] sm:text-xs font-mono font-bold uppercase tracking-wider inline-block mb-2 sm:mb-3 backdrop-blur-md">
            ROLE DASHBOARDS
          </span>
          <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight">Empowering Every Role</h2>
          <p className="text-[#E9EAF7]/80 text-[11px] sm:text-base font-light">Role-scoped dashboards tailored for individual and organizational success.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-left">
          {[
            {
              role: 'Employees',
              path: `/dashboard`,
              points: ['Personalized learning feeds', 'Transparent promotion criteria', 'Skill endorsement tracking']
            },
            {
              role: 'Team Leaders',
              path: `/team-leader`,
              points: ['Team readiness dashboards', 'Project resourcing insights', 'Performance trend analysis']
            },
            {
              role: 'HR & Admin Control',
              path: `/hr-dashboard`,
              points: ['Org-wide skill matrices', 'Multi-tenant access control', 'L&D budget optimization']
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white/[0.11] via-[#1B3154]/55 to-[#1988A3]/15 hover:from-white/[0.16] hover:to-[#11C6DE]/22 backdrop-blur-2xl border border-white/20 hover:border-[#11C6DE]/55 rounded-2xl md:rounded-[2rem] transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1.5 shadow-[0_20px_50px_-15px_rgba(23,35,62,0.55)]"
            >
              <div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#11C6DE]/15 border border-[#11C6DE]/30 rounded-xl mb-3 sm:mb-5 flex items-center justify-center group-hover:bg-[#11C6DE] transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#11C6DE] group-hover:bg-[#17233E]" />
                </div>
                <h3 className="font-bold sm:font-extrabold text-base sm:text-xl mb-1.5 sm:mb-2 text-white group-hover:text-[#11C6DE] transition-colors">{item.role}</h3>
                <p className="text-[#E9EAF7]/80 text-[11px] sm:text-xs mb-3 sm:mb-5 leading-relaxed font-normal">Dedicated role-based analytics and workforce management tools.</p>
                <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="text-[#E9EAF7] text-[11px] sm:text-xs flex items-center gap-2 font-medium">
                      <span className="w-1.5 h-1.5 bg-[#11C6DE] rounded-full flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={item.path} className="text-[#11C6DE] hover:text-white font-bold text-[11px] sm:text-xs inline-flex items-center gap-1 transition-all">
                Access Workspace <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTELLIGENCE SECTION WITH HIGH-TECH TELEMETRY CARD */}
      <section className="py-8 sm:py-14 px-3 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl md:rounded-[3rem] py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-14 glass-hero-dark text-white text-left relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 md:gap-12 items-center relative z-10">
            <div>
              <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold mb-3 sm:mb-5 leading-tight tracking-tight text-white">
                Intelligence That Drives <br className="hidden lg:block" />
                Smarter Decisions
              </h2>

              <div className="flex flex-wrap gap-1.5 sm:gap-2.5 mb-4 sm:mb-6">
                {[
                  { label: '42% Faster Upskilling', icon: Sparkles },
                  { label: '99.9% Platform SLA', icon: ShieldCheck },
                  { label: '500+ Skill Rubrics', icon: Activity }
                ].map((chip, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#E9EAF7] text-[9px] sm:text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-md"
                  >
                    <chip.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#11C6DE]" />
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { t: 'Predict promotion readiness', d: 'Identify talent poised for leadership before attrition occurs.' },
                  { t: 'Multi-tenant data governance', d: 'Ensure strict compliance and data isolation per organization.' },
                  { t: 'Monitor skill evolution', d: 'Track capability growth across departments in real-time.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-2.5 sm:gap-3 group cursor-default">
                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-[#11C6DE] mt-1 flex-shrink-0 group-hover:bg-[#11C6DE] transition-colors"></div>
                    <div>
                      <h4 className="font-bold sm:font-extrabold text-xs sm:text-base mb-0.5 text-white group-hover:text-[#11C6DE] transition-colors">
                        {item.t}
                      </h4>
                      <p className="text-[#E9EAF7]/80 text-[11px] sm:text-xs leading-relaxed font-light">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Tech Telemetry Card */}
            <div className="relative mt-2 lg:mt-0">
              <div className="bg-[#17233E]/65 backdrop-blur-2xl border border-white/25 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[0_20px_50px_-10px_rgba(23,35,62,0.7)] text-left">
                <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#11C6DE]" />
                    <span className="text-xs font-bold text-white tracking-wide">Neural Telemetry Engine</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#11C6DE] bg-[#1988A3]/25 border border-[#11C6DE]/35 px-2 py-0.5 rounded-full">
                    Live Synced
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-[#E9EAF7] mb-1">
                      <span>Model Precision Rate</span>
                      <span className="font-mono text-[#11C6DE] font-bold">98.4%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] h-full rounded-full w-[98.4%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-[#E9EAF7] mb-1">
                      <span>Workforce Readiness Index</span>
                      <span className="font-mono text-emerald-400 font-bold">84% Optimal</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[84%]" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-[#E9EAF7]/80">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-[#11C6DE]" /> RLS Row-Level Security
                    </span>
                    <span className="text-[#11C6DE] font-bold">PostgreSQL v16</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-8 sm:py-14 md:py-20 px-3 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl md:rounded-[3rem] py-8 sm:py-12 md:py-16 px-4 sm:px-8 text-center glass-hero-dark text-white relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#11C6DE]/20 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold mb-2.5 sm:mb-3.5 tracking-tight text-white relative z-10">Transform Workforce Skills with AI</h2>
          <p className="text-[#E9EAF7]/85 text-[11px] sm:text-base mb-5 sm:mb-8 max-w-xl mx-auto font-light relative z-10">
            Join leading enterprise teams building future-ready organizations with isolated, data-driven platforms.
          </p>
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 relative z-10 mx-auto">
            <Link to="/signup" className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0FB5CB] text-[#17233E] px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-[0_8px_28px_-4px_rgba(17,198,222,0.5)] inline-flex items-center justify-center gap-1.5 cursor-pointer">
              Start Free Trial <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/contact" className="bg-white/10 border border-white/25 text-white hover:bg-white/20 px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm transition-all inline-flex items-center justify-center backdrop-blur-md cursor-pointer">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillPulseLanding;
