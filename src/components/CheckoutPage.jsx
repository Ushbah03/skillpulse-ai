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
  Sparkles,
  Edit3,
  RefreshCw,
  Check,
  ChevronDown
} from 'lucide-react';

const PLAN_CONFIGS = {
  'Starter': {
    name: 'Starter',
    basePrice: 600,
    seats: 30,
    badge: 'Popular for Small Teams',
    features: [
      'Full Access to Employee & HR Dashboards',
      'Up to 30 Employee Seats',
      'AI Skill Gap Inference & Assessment Engine',
      'Basic Course Recommendations & Analytics'
    ]
  },
  'Professional': {
    name: 'Professional',
    basePrice: 1200,
    seats: 250,
    badge: 'Best for Growing Companies',
    features: [
      'Everything in Starter + Team Leader Views',
      'Up to 250 Employee Seats',
      'Autonomous Team Formation & Skill Taxonomy',
      'HRIS & LMS Integration Connectors',
      'Succession & Compliance Management'
    ]
  },
  'Enterprise AI': {
    name: 'Enterprise AI',
    basePrice: 2500,
    seats: 1000,
    badge: 'Full Enterprise Suite',
    features: [
      'Everything in Professional + SuperAdmin',
      'Up to 1,000 Employee Seats',
      'Dedicated Custom AI Model Finetuning',
      '24/7 SLA Priority Support & Custom Domain'
    ]
  }
};

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tenantId = searchParams.get('tenantId') || '';
  const initialPlan = searchParams.get('plan') || 'Starter';

  // Interactive Plan & Card State
  const [selectedPlanKey, setSelectedPlanKey] = useState(
    PLAN_CONFIGS[initialPlan] ? initialPlan : (initialPlan === 'PRO' ? 'Professional' : initialPlan === 'ENTERPRISE' ? 'Enterprise AI' : 'Starter')
  );
  
  const currentPlanConfig = PLAN_CONFIGS[selectedPlanKey] || PLAN_CONFIGS['Starter'];

  const [cardHolder, setCardHolder] = useState('Organization Administrator');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  // Dynamic pricing calculations
  const basePrice = currentPlanConfig.basePrice;
  const seats = currentPlanConfig.seats;
  const tax = Math.round(basePrice * 0.05);
  const totalPrice = basePrice + tax;

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 3) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setExpiry(value);
  };

  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvc(value);
  };

  const fillTestCard = () => {
    setCardHolder('Verified Enterprise Admin');
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('888');
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!tenantId) {
      setError('Invalid or missing tenant workspace reference. Please register again.');
      return;
    }

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      setError('Please enter a valid 16-digit payment card number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await paymentAPI.completeSimulatedCheckout(tenantId, selectedPlanKey, seats);
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
        
        {/* Left Column: Order Summary & Plan Selector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Subscription Summary
              </span>
              <button
                type="button"
                onClick={() => setIsChangingPlan(!isChangingPlan)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition"
              >
                <Edit3 className="w-3.5 h-3.5" /> Change Plan
              </button>
            </div>

            {/* Plan Selector Toggle Drawer */}
            {isChangingPlan && (
              <div className="mb-6 p-4 bg-[#0B1120] border border-indigo-500/30 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-xs font-semibold text-white mb-2">Select Your Organization Plan:</div>
                {Object.keys(PLAN_CONFIGS).map((planKey) => {
                  const cfg = PLAN_CONFIGS[planKey];
                  const isSelected = selectedPlanKey === planKey;
                  return (
                    <button
                      key={planKey}
                      type="button"
                      onClick={() => {
                        setSelectedPlanKey(planKey);
                        setIsChangingPlan(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                        isSelected 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold' 
                          : 'bg-[#0F172A] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {cfg.name} Plan
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400">{cfg.seats} Seats • {cfg.badge}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-white">${cfg.basePrice.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">/ yr</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-2xl font-bold text-white">{currentPlanConfig.name} Plan</h2>
              <span className="text-xs font-medium text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                {currentPlanConfig.seats} Seats
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Annual organization workspace subscription</p>

            <div className="space-y-3 text-sm border-t border-b border-slate-800/80 py-4">
              <div className="flex justify-between text-slate-300">
                <span>Base Subscription ({currentPlanConfig.seats} Seats Included)</span>
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
              <Sparkles className="w-4 h-4 text-amber-400" /> What's Included in {currentPlanConfig.name}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {currentPlanConfig.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Editable Payment Form */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                <CheckCircle className="w-12 h-12 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Your organization workspace under the <strong>{currentPlanConfig.name} Plan</strong> has been fully activated. Redirecting you to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" /> Payment Details
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter or edit your payment card details below to activate your workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillTestCard}
                  className="text-[11px] font-semibold text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Quick Fill Demo Card
                </button>
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
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition font-medium"
                    placeholder="e.g. John Doe / Acme Corp Billing"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition tracking-wider"
                      placeholder="4242 4242 4242 4242"
                    />
                    <CreditCard className="w-5 h-5 text-indigo-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Expiration Date</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition tracking-wider"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">CVC / Security Code</label>
                    <input
                      type="text"
                      required
                      value={cvc}
                      onChange={handleCvcChange}
                      maxLength={4}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition tracking-wider"
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
