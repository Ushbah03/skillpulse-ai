import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import UpgradeRequiredScreen from './UpgradeRequiredScreen';

/**
 * Helper to get default dashboard path for a given role
 */
export const getRoleDefaultPath = (role) => {
  switch (role) {
    case 'EMPLOYEE':
      return '/dashboard';
    case 'TEAM_LEADER':
      return '/team-leader';
    case 'HR_MANAGER':
      return '/hr-dashboard';
    case 'COMPANY_ADMIN':
      return '/company-admin';
    case 'SUPER_ADMIN':
      return '/superadmin';
    default:
      return '/login';
  }
};

/**
 * Payment Pending Wall — handles both Stripe return verification and manual retry
 */
const PaymentPendingWall = ({ user }) => {
  const [status, setStatus] = useState('idle'); // idle | verifying | success | error | retrying
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const paymentParam = urlParams.get('payment');

    if (sessionId && paymentParam === 'success') {
      // Stripe just returned — verify the payment
      setStatus('verifying');
      import('../services/api').then(({ paymentAPI, authAPI }) => {
        paymentAPI.verifySession(sessionId)
          .then((res) => {
            if (res?.success) {
              setStatus('success');
              // Refresh user data to get updated ACTIVE tenant status
              authAPI.getMe()
                .then((meRes) => {
                  if (meRes?.success && meRes.user) {
                    localStorage.setItem('user', JSON.stringify(meRes.user));
                  }
                  window.location.replace(getRoleDefaultPath(user.role));
                })
                .catch(() => {
                  window.location.replace(getRoleDefaultPath(user.role));
                });
            } else {
              setStatus('error');
              setErrorMsg(res?.message || 'Payment could not be verified. Please contact support.');
            }
          })
          .catch((err) => {
            setStatus('error');
            setErrorMsg(err?.message || 'Failed to verify payment. Please try again.');
          });
      });
    }
  }, []);

  const handleCompletePayment = async () => {
    setStatus('retrying');
    setErrorMsg('');
    try {
      const { paymentAPI } = await import('../services/api');
      const tenantId = user.tenant?.id;
      const plan = user.tenant?.plan === 'PRO' ? 'Professional'
        : user.tenant?.plan === 'ENTERPRISE' ? 'Enterprise AI'
        : 'Starter';
      const seats = user.tenant?.maxUsers || 30;
      const res = await paymentAPI.createCheckoutSession(tenantId, plan, seats);
      if (res?.success && res.url) {
        window.location.href = res.url;
      } else {
        setErrorMsg(res?.message || 'Failed to start checkout. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to connect to payment gateway.');
      setStatus('error');
    }
  };

  const isLoading = ['verifying', 'retrying', 'success'].includes(status);
  const loadingLabel = status === 'verifying'
    ? 'Verifying your payment...'
    : status === 'success'
    ? 'Payment confirmed! Loading your dashboard...'
    : 'Connecting to Stripe...';

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0F172B] text-white">
      <div className="p-10 bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full text-center shadow-2xl">
        {isLoading ? (
          <>
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black mb-2">
              {status === 'success' ? '✅ Payment Confirmed!' : 'Processing Payment...'}
            </h1>
            <p className="text-slate-400 text-sm">{loadingLabel}</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black mb-2">Complete Your Payment</h1>
            <p className="text-slate-400 mb-2 text-sm leading-relaxed">
              Your <span className="text-white font-semibold">{user.tenant?.name}</span> workspace is ready but needs an active subscription to unlock.
            </p>
            <p className="text-slate-500 text-xs mb-8">Your account has been created. Just complete the payment to get started.</p>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4">
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleCompletePayment}
              className="w-full py-3.5 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-all mb-3 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Complete Payment on Stripe →
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="w-full py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Sign out &amp; use a different account
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Approval Pending Wall — shown when user registered but not yet approved by Company Admin
 */
const ApprovalPendingWall = ({ user }) => (
  <div className="h-screen w-full flex items-center justify-center bg-[#0F172B] text-white">
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full text-center shadow-2xl">
      <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-black mb-2">Awaiting Approval</h1>
      <p className="text-slate-400 mb-2 text-sm leading-relaxed">
        Your request to join <span className="text-white font-semibold">{user.tenant?.name || 'the workspace'}</span> is under review.
      </p>
      <p className="text-slate-500 text-xs mb-8">
        Your Company Admin has been notified. You'll get access as soon as they approve your account. Check back later or contact your Admin directly.
      </p>
      <div className="bg-slate-800/60 rounded-2xl p-4 mb-6 text-left">
        <p className="text-xs text-slate-400"><span className="text-slate-300 font-semibold">Account:</span> {user.email}</p>
        <p className="text-xs text-slate-400 mt-1"><span className="text-slate-300 font-semibold">Workspace:</span> {user.tenant?.name || '—'}</p>
        <p className="text-xs text-slate-400 mt-1"><span className="text-slate-300 font-semibold">Requested Role:</span> {user.role}</p>
        <p className="text-xs text-yellow-400/80 mt-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block"></span>
          Status: Pending Admin Approval
        </p>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}
        className="w-full py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        Sign out &amp; use a different account
      </button>
    </div>
  </div>
);

import WorkspaceSuspended from './WorkspaceSuspended';
import AccountSuspended from './AccountSuspended';

/**
 * ProtectedRoute Guard
 */
export const ProtectedRoute = ({ allowedRoles, allowedPlans }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  // 1. Not logged in
  if (!token || !storedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let user = null;
  try {
    user = JSON.parse(storedUser);
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Tenant Suspended check — blocks all non-superadmin portal access
  if (user.tenant?.status === 'SUSPENDED' && user.role !== 'SUPER_ADMIN') {
    return <WorkspaceSuspended />;
  }

  // 3. User Account Inactive / Suspended check
  if (user.status === 'INACTIVE' && user.role !== 'SUPER_ADMIN') {
    return <AccountSuspended user={user} />;
  }

  // 4. Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleDefaultPath(user.role)} replace />;
  }

  // 3. Pending payment — show wall (handles Stripe redirect + retry)
  if (user.tenant?.status === 'PENDING_PAYMENT' && user.role !== 'SUPER_ADMIN') {
    return <PaymentPendingWall user={user} />;
  }

  // 4. Pending invite approval — show approval wall
  if (user.status === 'PENDING_INVITE' && user.role !== 'SUPER_ADMIN') {
    return <ApprovalPendingWall user={user} />;
  }

  // 5. Plan restrictions
  if (allowedPlans && allowedPlans.length > 0 && user.role !== 'SUPER_ADMIN') {
    const userPlan = user.tenant?.plan || user.plan || 'STARTER';
    const normalizedPlan = userPlan === 'Business' ? 'PRO' : userPlan;
    if (!allowedPlans.includes(normalizedPlan)) {
      return <UpgradeRequiredScreen />;
    }
  }

  // 6. Fully authorized
  return <Outlet />;
};

export default ProtectedRoute;


