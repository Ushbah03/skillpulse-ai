import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import VisitorBackdrop from './VisitorBackdrop';
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
  Check
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
    <div className="min-h-screen bg-[#E9EAF7] bg-gradient-to-b from-[#E9EAF7] via-[#E2EEFA] to-[#DCEAF8] text-[#17233E] flex flex-col justify-between font-sans relative overflow-x-hidden selection:bg-[#1988A3] selection:text-white">
      <VisitorBackdrop />

      {/* Top Brand Header */}
      <header className="relative z-10 border-b border-white/85 bg-white/75 backdrop-blur-xl px-4 sm:px-8 py-4 flex items-center justify-between gap-2 shadow-xs">
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="bg-[#17233E] p-1.5 sm:p-2 rounded-xl border border-[#11C6DE]/30 shadow-md shadow-[#17233E]/15 group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5 sm:h-5 sm:w-5 text-[#11C6DE] fill-[#11C6DE]" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-[#17233E] tracking-tight">
            SkillPulse <span className="text-[#1988A3]">-AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-bold text-emerald-700 bg-emerald-500/12 border border-emerald-500/30 px-3 sm:px-3.5 py-1.5 rounded-full shrink-0 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          <span className="hidden sm:inline">256-Bit Encrypted </span>Secure Checkout
        </div>
      </header>

      {/* Main Checkout Grid */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 items-start">
        
        {/* Left Column: Order Summary & Plan Selector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-2xl border border-white/90 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(23,35,62,0.08)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#17233E] via-[#1988A3] to-[#11C6DE]" />

            <div className="flex items-center justify-between text-[#1988A3] text-sm font-extrabold uppercase tracking-wider mb-3">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1988A3]" /> Subscription Summary
              </span>
              <button
                type="button"
                onClick={() => setIsChangingPlan(!isChangingPlan)}
                className="text-sm text-[#17233E] hover:text-[#1988A3] flex items-center gap-1 font-bold bg-white/85 hover:bg-white border border-white/95 shadow-2xs px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#1988A3]" /> Change Plan
              </button>
            </div>

            {/* Plan Selector Toggle Drawer */}
            {isChangingPlan && (
              <div className="mb-6 p-4 bg-white/85 backdrop-blur-xl border border-white rounded-2xl space-y-2.5 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-sm font-extrabold text-[#17233E] mb-2">Select Your Organization Plan:</div>
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
                      className={`w-full text-left p-3 rounded-xl border text-sm flex items-center justify-between transition cursor-pointer ${
                        isSelected 
                          ? 'bg-[#17233E] border-[#1988A3] text-white font-bold shadow-md' 
                          : 'bg-[#F0F5FB]/90 border-white text-[#17233E] hover:border-[#1988A3]/40'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {cfg.name} Plan
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#11C6DE]" />}
                        </div>
                        <div className={`text-sm ${isSelected ? 'text-[#BEDDF5]' : 'text-[#243656]'}`}>
                          {cfg.seats} Seats • {cfg.badge}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-extrabold ${isSelected ? 'text-white' : 'text-[#17233E]'}`}>
                          ${cfg.basePrice.toLocaleString()}
                        </div>
                        <div className={`text-xs sm:text-sm ${isSelected ? 'text-[#11C6DE]' : 'text-[#243656]'}`}>/ yr</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-2xl font-extrabold text-[#17233E] tracking-tight">{currentPlanConfig.name} Plan</h2>
              <span className="text-sm font-extrabold text-white bg-[#17233E] border border-[#1988A3]/30 px-3 py-0.5 rounded-full shadow-2xs">
                {currentPlanConfig.seats} Seats
              </span>
            </div>
            <p className="text-sm text-[#243656] font-medium mb-6">Annual organization workspace subscription</p>

            <div className="space-y-3 text-sm border-t border-b border-white/80 py-4">
              <div className="flex justify-between text-[#17233E] font-medium">
                <span>Base Subscription ({currentPlanConfig.seats} Seats Included)</span>
                <span className="font-extrabold text-[#17233E]">${basePrice.toLocaleString()}.00 / yr</span>
              </div>
              <div className="flex justify-between text-[#243656] text-sm font-medium">
                <span>Platform Maintenance & Service Tax (5%)</span>
                <span className="font-bold text-[#17233E]">${tax.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-[#243656] text-sm font-medium">
                <span>AI Skills Inference Engine</span>
                <span className="text-emerald-700 font-bold">Included (Unlimited)</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <div className="text-sm font-bold text-[#243656] uppercase tracking-wider">Total Due Today</div>
                <div className="text-3xl font-black text-[#17233E] tracking-tight">${totalPrice.toLocaleString()}.00</div>
              </div>
              <span className="text-sm bg-white/85 text-[#1988A3] border border-white px-3.5 py-1.5 rounded-full font-extrabold shadow-2xs">
                Renews Annually
              </span>
            </div>
          </div>

          {/* Included Features Card */}
          <div className="bg-gradient-to-br from-[#D8EBF9]/90 via-[#CBE3F7]/85 to-[#BEDDF5]/80 backdrop-blur-2xl border border-white/90 rounded-3xl p-6 shadow-[0_15px_40px_rgba(23,35,62,0.06)]">
            <h3 className="text-sm font-extrabold text-[#17233E] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1988A3]" /> What's Included in {currentPlanConfig.name}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#17233E] font-semibold">
              {currentPlanConfig.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#1988A3] shrink-0" /> {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Editable Payment Form */}
        <div className="lg:col-span-7 bg-white/85 backdrop-blur-3xl border border-white/95 rounded-3xl p-6 sm:p-9 shadow-[0_25px_65px_rgba(23,35,62,0.10)] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#17233E] via-[#1988A3] to-[#11C6DE]" />

          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-500/12 text-emerald-600 border border-emerald-500/25 mb-2 shadow-sm">
                <CheckCircle className="w-12 h-12 animate-bounce" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#17233E]">Payment Successful!</h2>
              <p className="text-sm text-[#243656] font-medium max-w-md mx-auto">
                Your organization workspace under the <strong className="text-[#17233E]">{currentPlanConfig.name} Plan</strong> has been fully activated. Redirecting you to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#17233E] flex items-center gap-2 tracking-tight">
                    <CreditCard className="w-5 h-5 text-[#1988A3]" /> Payment Details
                  </h2>
                  <p className="text-sm text-[#243656] font-medium mt-1">
                    Enter or edit your payment card details below to activate your workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillTestCard}
                  className="text-sm font-bold text-[#1988A3] hover:text-[#17233E] bg-[#D8EBF9]/80 hover:bg-[#CBE3F7] border border-[#1988A3]/30 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Quick Fill Demo Card
                </button>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-sm font-semibold text-rose-600">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-extrabold uppercase tracking-wider text-[#243656] mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-[#F0F5FB]/95 border border-[#8A9CB7]/35 rounded-xl px-4 py-3 text-sm text-[#17233E] focus:outline-none focus:border-[#1988A3] focus:bg-white focus:ring-2 focus:ring-[#11C6DE]/20 transition font-semibold"
                    placeholder="e.g. John Doe / Acme Corp Billing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold uppercase tracking-wider text-[#243656] mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="w-full bg-[#F0F5FB]/95 border border-[#8A9CB7]/35 rounded-xl pl-4 pr-10 py-3 text-sm text-[#17233E] font-mono font-semibold focus:outline-none focus:border-[#1988A3] focus:bg-white focus:ring-2 focus:ring-[#11C6DE]/20 transition tracking-wider"
                      placeholder="4242 4242 4242 4242"
                    />
                    <CreditCard className="w-5 h-5 text-[#1988A3] absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-extrabold uppercase tracking-wider text-[#243656] mb-1.5">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className="w-full bg-[#F0F5FB]/95 border border-[#8A9CB7]/35 rounded-xl px-4 py-3 text-sm text-[#17233E] font-mono font-semibold focus:outline-none focus:border-[#1988A3] focus:bg-white focus:ring-2 focus:ring-[#11C6DE]/20 transition tracking-wider"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-extrabold uppercase tracking-wider text-[#243656] mb-1.5">
                      CVC / Security Code
                    </label>
                    <input
                      type="text"
                      required
                      value={cvc}
                      onChange={handleCvcChange}
                      maxLength={4}
                      className="w-full bg-[#F0F5FB]/95 border border-[#8A9CB7]/35 rounded-xl px-4 py-3 text-sm text-[#17233E] font-mono font-semibold focus:outline-none focus:border-[#1988A3] focus:bg-white focus:ring-2 focus:ring-[#11C6DE]/20 transition tracking-wider"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] hover:from-[#1B3154] hover:to-[#11C6DE] text-white shadow-lg shadow-[#17233E]/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
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

              <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-semibold text-[#243656] pt-3 border-t border-[#8A9CB7]/20">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> PCI-DSS Level 1 Compliant
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Money-Back Guarantee
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/80 bg-white/60 backdrop-blur-md py-4 text-center text-sm font-semibold text-[#243656]">
        © 2026 SkillPulse AI platform. All rights reserved. Secure payment processing.
      </footer>
    </div>
  );
}
