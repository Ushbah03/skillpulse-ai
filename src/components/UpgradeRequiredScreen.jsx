import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpgradeRequiredScreen = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  let user = null;
  try { user = JSON.parse(userStr); } catch(e) {}

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#0F172A] border border-indigo-500/30 p-8 rounded-3xl shadow-2xl text-center">
        <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
          <ShieldAlert className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-3">Upgrade Required</h1>
        
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Your organization's current subscription plan does not include access to this module. 
          {user?.role === 'COMPANY_ADMIN' 
            ? " Please upgrade your plan in Organization Settings to unlock these features."
            : " Please contact your Company Admin to upgrade your workspace's subscription."}
        </p>

        {user?.role === 'COMPANY_ADMIN' ? (
          <button 
            onClick={() => navigate('/company-admin/settings', { state: { planRestricted: true } })}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
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
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default UpgradeRequiredScreen;
