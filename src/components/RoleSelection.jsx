import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const roles = [
  {
    id: 'employee',
    title: 'Employee',
    desc: 'Access skill assessments, personalized learning paths, and career development.',
    access: 'USER ACCESS',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    )
  },
  {
    id: 'leader',
    title: 'Team Leader',
    desc: 'Monitor team skill readiness, project allocation, and growth performance.',
    access: 'MANAGER ACCESS',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    )
  },
  {
    id: 'hr',
    title: 'HR Manager',
    desc: 'Manage company talent analytics, workforce gaps, and recruitment strategies.',
    access: 'STRATEGIC ACCESS',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'company_admin',
    title: 'Company Admin',
    desc: 'Manage organization users, tenant settings, billing, and department hierarchy.',
    access: 'TENANT CONTROL',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
      </svg>
    )
  },
  {
    id: 'super_admin',
    title: 'Super Admin',
    desc: 'System-wide governance, global multi-tenant management, and platform logs.',
    access: 'GLOBAL SYSTEM',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
];

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('employee');
  const navigate = useNavigate();

  const containerStyle = {
    backgroundColor: '#020617',
    backgroundImage: `
      radial-gradient(circle at top left, rgba(37, 99, 235, 0.18) 0%, transparent 32%),
      radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.28) 0%, transparent 38%),
      radial-gradient(circle at center, rgba(30, 41, 59, 0.95) 0%, #020617 75%)
    `,
    backgroundBlendMode: 'screen'
  };

  const textVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const card3DVariant = {
    hidden: { 
      opacity: 0, 
      z: -200, 
      rotateX: 45, 
      rotateY: -25, 
      y: 80 
    },
    visible: { 
      opacity: 1, 
      z: 0, 
      rotateX: 0, 
      rotateY: 0, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 75, 
        damping: 14,
        mass: 1.2
      } 
    }
  };

  const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const handleNavigate = () => {
    switch (selectedRole) {
      case 'leader':
        navigate('/team-leader');
        break;
      case 'hr':
        navigate('/hr-dashboard');
        break;
      case 'company_admin':
        navigate('/company-admin');
        break;
      case 'super_admin':
        navigate('/superadmin');
        break;
      case 'employee':
      default:
        navigate('/dashboard');
        break;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative selection:bg-indigo-600 selection:text-white py-12"
      style={containerStyle}
    >
      <style>{`
        @keyframes floatDeep { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(35px, -35px); } }
        @keyframes floatDeepRev { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(-30px, 30px); } }
        .animate-deep-glow-1 { animation: floatDeep 14s ease-in-out infinite; }
        .animate-deep-glow-2 { animation: floatDeepRev 18s ease-in-out infinite; }
      `}</style>

      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-700/20 blur-3xl rounded-full pointer-events-none animate-deep-glow-1"></div>
      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-indigo-700/30 blur-3xl rounded-full pointer-events-none animate-deep-glow-2"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="
          relative
          z-10
          bg-[#1E293B]/70
          backdrop-blur-2xl
          border border-white/10
          rounded-[2.5rem]
          p-8 md:p-12
          max-w-[1280px]
          w-full
          text-center
          shadow-[0_25px_80px_rgba(0,0,0,0.55)]
        "
      >
        <motion.div initial="hidden" animate="visible" variants={staggerGrid}>
          <motion.h2 variants={textVariant} className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Select Workplace Context
          </motion.h2>

          <motion.p variants={textVariant} className="text-slate-400 mb-10 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose your portal view based on your assigned organizational tier and scope.
          </motion.p>
        </motion.div>

        {/* Roles Grid updated to 5 columns on extra large screens */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerGrid}
          style={{ perspective: 1200 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10"
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              variants={card3DVariant}
              whileHover={{ 
                y: -10, 
                z: 25,
                rotateY: 4,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole(role.id)}
              className={`relative p-5 rounded-[1.8rem] border transition-all duration-500 cursor-pointer text-left flex flex-col h-[270px] backdrop-blur-xl group overflow-hidden ${
                selectedRole === role.id
                  ? 'bg-indigo-600/10 border-indigo-500/70 shadow-[0_0_30px_rgba(99,102,241,0.35)]'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-white/[0.02] to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {selectedRole === role.id && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute top-4 right-4 bg-indigo-500 rounded-full p-1 shadow-lg shadow-indigo-500/40 z-20"
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}

              <div className="flex-grow relative z-10">
                <div
                  className={`w-11 h-11 rounded-2xl mb-5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-[6deg] ${
                    selectedRole === role.id
                      ? 'bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {role.icon}
                </div>

                <h4 className="text-white font-bold text-xl mb-2">
                  {role.title}
                </h4>

                <p className="text-slate-400 text-xs leading-5 transition-colors group-hover:text-slate-300">
                  {role.desc}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 relative z-10">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    selectedRole === role.id
                      ? 'bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,1)]'
                      : 'bg-slate-700'
                  }`}
                ></div>

                <span
                  className={`text-[9px] font-black tracking-[0.15em] uppercase transition-colors duration-300 ${
                    selectedRole === role.id
                      ? 'text-indigo-300'
                      : 'text-slate-500 group-hover:text-slate-400'
                  }`}
                >
                  {role.access}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2, boxShadow: "0 20px 40px rgba(99,102,241,0.45)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNavigate}
            className="group bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-14 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-[0_15px_40px_rgba(99,102,241,0.45)] flex items-center gap-3 text-base"
          >
            Continue to Portal
            <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          <p className="text-slate-500 text-xs tracking-wide font-medium select-none">
            Need access to a different tenant workspace?{' '}
            <span className="text-indigo-400 font-semibold cursor-pointer hover:underline underline-offset-4 hover:text-indigo-300 transition-colors">
              Contact Organization Admin
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;