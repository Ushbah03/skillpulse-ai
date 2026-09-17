import React, { useState } from 'react';
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
    <div className="min-h-screen bg-[#060b17] flex items-center justify-center p-6 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Ambient Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-6">
        
        {/* TOP ALERT BADGE & HEADER CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f172a] border border-rose-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 text-rose-500 pointer-events-none">
            <UserX size={160} />
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldAlert size={14} /> Account Deactivated
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold">
              <Building size={13} className="text-slate-400" /> {tenantName}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight mb-3">
            User Account Suspended
          </h1>
          
          <p className="text-slate-400 text-xs leading-relaxed mb-5 font-medium">
            Your personal account (<strong className="text-white">{userEmail}</strong>) has been set to <span className="text-rose-400 font-bold">INACTIVE</span> by your Organization Administrator.
          </p>

          {/* Account Details Box */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs mb-4">
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Account Email</span>
              <span className="text-slate-200 font-mono font-bold truncate block">{userEmail}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Organization</span>
              <span className="text-slate-200 font-bold truncate block">{tenantName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Assigned Role</span>
              <span className="text-indigo-400 font-bold truncate block">{userRole}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <HelpCircle size={14} /> What does this mean?
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Access to dashboards, skill profiles, and assessment tools is temporarily paused. Your assessment data remains safely saved in the database.
            </p>
          </div>
        </motion.div>

        {/* EMAIL SUPPORT ONLY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Support &amp; Reactivation Help
              </h2>
              <p className="text-xs text-slate-400">Contact system support or your Company Admin via email.</p>
            </div>
          </div>

          {/* Email Support Box */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Official Support Email</span>
                <a 
                  href={`mailto:${supportEmail}?subject=Reactivation%20Request%20for%20${encodeURIComponent(userEmail)}`}
                  className="text-sm font-mono font-bold text-indigo-300 hover:underline"
                >
                  {supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy Email Address"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>

              <a
                href={`mailto:${supportEmail}?subject=Account%20Reactivation%20Request%20-${encodeURIComponent(userEmail)}&body=Hello%20Support,%0A%0AMy%20account%20(${encodeURIComponent(userEmail)})%20has%20been%20deactivated.%20Please%20help%20me%20reactivate%20my%20access.%0A%0AOrganization:%20${encodeURIComponent(tenantName)}`}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
              >
                <Mail size={13} /> Send Email
              </a>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-800/80">
            <span className="text-[11px] text-slate-500">Contact your HR / Admin to restore workspace rights.</span>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
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
