import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  Building2, 
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tenantId = searchParams.get('tenantId') || '';
  const plan = searchParams.get('plan') || 'Professional';
  const seats = parseInt(searchParams.get('seats') || '30', 10);

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Organization Administrator');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Pricing logic
  let basePrice = 600;
  if (plan === 'Professional' || plan === 'PRO') basePrice = 1200;
  if (plan === 'Enterprise AI' || plan === 'ENTERPRISE') basePrice = 2500;

  const tax = Math.round(basePrice * 0.05);
  const totalPrice = basePrice + tax;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!tenantId) {
      setError('Invalid or missing tenant workspace reference. Please register again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await paymentAPI.completeSimulatedCheckout(tenantId, plan, seats);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login?payment=success');
        }, 2000);
      } else {
        setError(response.message || 'Payment processing failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to complete payment transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-between font-sans">
      {/* Top Brand Header */}
      <header className="border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/30 p-2 rounded-xl border border-indigo-500/30">
            <Zap className="h-6 w-6 text-indigo-400 fill-indigo-400" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            SkillPulse AI
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" /> 256-Bit Encrypted Secure Checkout
        </div>
      </header>

      {/* Main Checkout Grid */}
      <div className="max-w-6xl mx-auto w-full px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Order Summary & Features */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" /> Subscription Summary
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{plan} Plan</h2>
            <p className="text-xs text-slate-400 mb-6">Annual organization workspace billing</p>

            <div className="space-y-3 text-sm border-t border-b border-slate-800/80 py-4">
              <div className="flex justify-between text-slate-300">
                <span>Base Subscription ({seats} Seats Included)</span>
                <span className="font-semibold text-white">${basePrice.toLocaleString()}.00 / yr</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Platform Maintenance & Service Tax (5%)</span>
                <span>${tax.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>AI Skills Inference Engine</span>
                <span className="text-emerald-400 font-medium">Included (Unlimited)</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <div className="text-xs text-slate-400">Total Due Today</div>
                <div className="text-3xl font-extrabold text-white">${totalPrice.toLocaleString()}.00</div>
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-medium">
                Renews Annually
              </span>
            </div>
          </div>

          {/* Included Features Card */}
          <div className="bg-[#0F172A]/50 border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> What's Included in Your Plan
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Full Access to HR & SuperAdmin Dashboards
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Autonomous Team Formation & AI Skill Gap Inference
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Multi-Tenant Role Security & Granular Governance
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> 24/7 Dedicated Support & HRIS Integration Engine
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Payment Form */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                <CheckCircle className="w-12 h-12 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Your organization workspace has been fully activated. Redirecting you to the portal login...
              </p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" /> Payment Details
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Complete your payment to instantly activate your organization tenant workspace.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. Acme Corp Billing"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition"
                      placeholder="4242 4242 4242 4242"
                    />
                    <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Expiration Date</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">CVC / Security Code</label>
                    <input
                      type="text"
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <span>Processing Payment Transaction...</span>
                  ) : (
                    <>
                      <span>Pay ${totalPrice.toLocaleString()}.00 & Activate Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> PCI-DSS Level 1 Compliant
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Money-Back Guarantee
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0F172A]/50 py-4 text-center text-xs text-slate-400">
        © 2026 SkillPulse AI platform. All rights reserved. Secure payment processing.
      </footer>
    </div>
  );
}
