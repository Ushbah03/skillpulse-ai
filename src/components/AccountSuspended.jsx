import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { 
  UserX, 
  ShieldAlert, 
  Mail, 
  Building, 
  ArrowLeft, 
  Check, 
  Copy, 
  HelpCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AccountSuspended = ({ user: propUser }) => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const user = propUser || storedUser;
  
  const tenantName = user?.tenant?.name || user?.tenantName || user?.workspace || "Your Organization";
  const userEmail = user?.email || "user@company.com";
  const userRole = user?.role || "EMPLOYEE";
  const supportEmail = "support@skillpulse.ai";

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#E9EAF7] flex items-center justify-center p-4 sm:p-6 text-[#17233E] font-sans relative overflow-hidden selection:bg-[#1988A3] selection:text-white">
      {/* Ambient Gradient Depth - Vibrant glowing mesh lights behind frosted glass */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-[#1988A3]/22 blur-[100px] rounded-full" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-[#11C6DE]/18 blur-[100px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-[550px] h-[550px] bg-[#1B3154]/18 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#8A9CB7]/30 blur-[90px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.10)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      <div className="max-w-xl w-full relative z-10 space-y-5 sm:space-y-6">
        
        {/* TOP ALERT BADGE & HEADER CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/75 backdrop-blur-3xl border border-white/90 rounded-3xl p-6 sm:p-8 shadow-[0_30px_70px_rgba(23,35,62,0.12),inset_0_1.5px_2px_rgba(255,255,255,1)] relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 text-[#17233E] pointer-events-none">
            <UserX size={150} />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-600 border border-rose-500/25 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
              <ShieldAlert size={13} /> Account Deactivated
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#17233E]/10 text-[#17233E] border border-[#17233E]/15 rounded-full text-xs font-bold font-mono">
              <Building size={13} className="text-[#1988A3]" /> {tenantName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233E] tracking-tight mb-2">
            User Account Suspended
          </h1>
          
          <p className="text-[#5A6D89] text-xs sm:text-sm leading-relaxed mb-5 font-normal">
            Your personal account (<strong className="text-[#17233E] font-semibold">{userEmail}</strong>) has been set to <span className="text-rose-600 font-bold">INACTIVE</span> by your Organization Administrator.
          </p>

          {/* Account Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 bg-[#E9EAF7]/60 rounded-2xl border border-[#8A9CB7]/25 text-xs mb-4">
            <div>
              <span className="text-[#5A6D89] font-bold block uppercase text-[10px] font-mono">Account Email</span>
              <span className="text-[#17233E] font-mono font-bold truncate block">{userEmail}</span>
            </div>
            <div>
              <span className="text-[#5A6D89] font-bold block uppercase text-[10px] font-mono">Organization</span>
              <span className="text-[#17233E] font-bold truncate block">{tenantName}</span>
            </div>
            <div>
              <span className="text-[#5A6D89] font-bold block uppercase text-[10px] font-mono">Assigned Role</span>
              <span className="text-[#1988A3] font-bold font-mono truncate block">{userRole}</span>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-3.5 bg-white/60 rounded-2xl border border-white/80 space-y-1 text-xs font-medium text-[#17233E] shadow-inner">
            <div className="flex items-center gap-1.5 text-[#17233E] font-bold">
              <HelpCircle size={14} className="text-[#1988A3]" /> What does this mean?
            </div>
            <p className="text-[#5A6D89] leading-relaxed text-[11px] sm:text-xs">
              Access to dashboards, skill profiles, and assessment tools is temporarily paused. Your assessment data remains safely preserved in the database.
            </p>
          </div>
        </motion.div>

        {/* EMAIL SUPPORT CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/75 backdrop-blur-3xl border border-white/90 rounded-3xl p-6 shadow-[0_20px_50px_rgba(23,35,62,0.1),inset_0_1.5px_2px_rgba(255,255,255,1)] space-y-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#1988A3] rounded-2xl">
              <Mail size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#17233E] tracking-tight">
                Support &amp; Reactivation Help
              </h2>
              <p className="text-xs text-[#5A6D89]">Contact system support or your Organization Admin via email.</p>
            </div>
          </div>

          {/* Email Support Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#E9EAF7]/60 border border-[#8A9CB7]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#1988A3] shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-[#5A6D89] uppercase tracking-wider block font-mono">Official Support Email</span>
                <a 
                  href={`mailto:${supportEmail}?subject=Reactivation%20Request%20for%20${encodeURIComponent(userEmail)}`}
                  className="text-xs sm:text-sm font-mono font-bold text-[#1988A3] hover:text-[#157289] hover:underline"
                >
                  {supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-white hover:bg-[#E9EAF7] text-[#17233E] border border-[#8A9CB7]/30 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                title="Copy Email Address"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>

              <a
                href={`mailto:${supportEmail}?subject=Account%20Reactivation%20Request%20-${encodeURIComponent(userEmail)}&body=Hello%20Support,%0A%0AMy%20account%20(${encodeURIComponent(userEmail)})%20has%20been%20deactivated.%20Please%20help%20me%20reactivate%20my%20access.%0A%0AOrganization:%20${encodeURIComponent(tenantName)}`}
                className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-[#17233E] hover:bg-[#1B3154] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#17233E]/20"
              >
                <Mail size={13} /> Send Email
              </a>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-[#8A9CB7]/20">
            <span className="text-[11px] text-[#5A6D89] text-center sm:text-left">Contact your HR / Admin to restore workspace rights.</span>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-[#E9EAF7] text-[#17233E] border border-[#8A9CB7]/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ArrowLeft size={13} /> Back to Sign In
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AccountSuspended;
