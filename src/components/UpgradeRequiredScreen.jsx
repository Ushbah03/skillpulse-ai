import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VisitorBackdrop from './VisitorBackdrop';

const UpgradeRequiredScreen = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  let user = null;
  try { user = JSON.parse(userStr); } catch(e) {}

  return (
    <div className="min-h-screen bg-[#E9EAF7] bg-gradient-to-b from-[#E9EAF7] via-[#E2EEFA] to-[#DCEAF8] text-[#17233E] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <VisitorBackdrop />
      <div className="relative z-10 max-w-md w-full bg-white/85 backdrop-blur-3xl border border-white/95 p-8 rounded-3xl shadow-[0_25px_65px_rgba(23,35,62,0.12)] text-center">
        <div className="w-20 h-20 bg-[#D8EBF9] text-[#1988A3] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#1988A3]/30 shadow-md">
          <ShieldAlert className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-extrabold text-[#17233E] mb-3 tracking-tight">Upgrade Required</h1>
        
        <p className="text-[#5A6D89] text-sm font-medium mb-8 leading-relaxed">
          Your organization's current subscription plan does not include access to this module. 
          {user?.role === 'COMPANY_ADMIN' 
            ? " Please upgrade your plan in Organization Settings to unlock these features."
            : " Please contact your Company Admin to upgrade your workspace's subscription."}
        </p>

        {user?.role === 'COMPANY_ADMIN' ? (
          <button 
            onClick={() => navigate('/company-admin/settings', { state: { planRestricted: true } })}
            className="w-full py-3.5 bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] hover:from-[#1B3154] hover:to-[#11C6DE] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#17233E]/20 cursor-pointer"
          >
            Go to Billing & Settings
          </button>
        ) : (
          <button 
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="w-full py-3.5 bg-[#F0F5FB] hover:bg-[#D8EBF9] text-[#17233E] rounded-xl font-bold border border-[#8A9CB7]/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default UpgradeRequiredScreen;
