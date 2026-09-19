import React, { useState } from 'react';
import {
  Search, Download, Plus, MoreHorizontal,
  DollarSign, CheckCircle, AlertTriangle, Users,
  Calendar, FileText, RefreshCw
} from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// ── Health Bar ────────────────────────────────────────────────────────────────
const HealthBar = ({ pct }) => (
  <div className="flex items-center gap-2">
    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
    </div>
    <span className="text-xs font-black text-slate-700">{pct}%</span>
  </div>
);

// ── Revenue Growth Bar Chart ──────────────────────────────────────────────────
const RevenueChart = () => {
  const bars = [
    { label: 'MAY', bot: 45, top: 30 },
    { label: 'JUN', bot: 55, top: 35 },
    { label: 'JUL', bot: 65, top: 45 },
    { label: 'AUG', bot: 70, top: 55 },
  ];
  const W = 340, H = 160, padB = 24, padT = 8, barW = 58, gap = 20;
  const totalW = bars.length * (barW + gap) - gap;
  const startX = (W - totalW) / 2;
  const maxH = H - padT;

  return (
    <svg viewBox={`0 0 ${W} ${H + padB}`} className="w-full" style={{ height: 185 }}>
      {bars.map((b, i) => {
        const x = startX + i * (barW + gap);
        const totalH = ((b.bot + b.top) / 130) * maxH;
        const botH = (b.bot / 130) * maxH;
        const topH = (b.top / 130) * maxH;
        const baseY = padT + maxH;
        return (
          <g key={i}>
            {/* bottom segment */}
            <rect x={x} y={baseY - botH} width={barW} height={botH} rx="6" fill="#93c5fd" />
            {/* top segment */}
            <rect x={x} y={baseY - botH - topH} width={barW} height={topH} rx="6" fill="#bfdbfe" />
            <text x={x + barW / 2} y={H + padB - 4} textAnchor="middle" fontSize="11"
              fill="#94a3b8" fontFamily="sans-serif" fontWeight="700">{b.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Payment Method Donut ──────────────────────────────────────────────────────
const PaymentDonut = () => {
  const segments = [
    { pct: 62, color: '#3b82f6' },
    { pct: 28, color: '#8b5cf6' },
    { pct: 10, color: '#a78bfa' },
  ];
  const r = 70, cx = 85, cy = 85, stroke = 20;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width="170" height="170" viewBox="0 0 170 170">
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return el;
      })}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="900" fill="#1e293b" fontFamily="sans-serif">100%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="sans-serif">TOTAL</text>
    </svg>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const PaymentGatewayBillingSettings = () => {
  const [autoBilling, setAutoBilling]   = useState(true);
  const [taxInvoices, setTaxInvoices]   = useState(true);
  const [retryLogic, setRetryLogic]     = useState(true);

  const statCards = [
    {
      label: 'Total Revenue (Monthly)', value: '$284,500',
      badge: '↑ 12%', badgeStyle: 'bg-slate-100 text-slate-600',
      Icon: DollarSign, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500',
    },
    {
      label: 'Successful Transactions', value: '4,120',
      badge: '99.8%', badgeStyle: 'text-slate-400',
      Icon: CheckCircle, iconBg: 'bg-blue-50', iconColor: 'text-blue-500',
    },
    {
      label: 'Failed Transactions', value: '42',
      badge: 'Attention', badgeStyle: 'bg-red-50 text-red-500 border border-red-100',
      Icon: AlertTriangle, iconBg: 'bg-red-50', iconColor: 'text-red-400',
    },
    {
      label: 'Active Subscriptions', value: '850',
      badge: '+124', badgeStyle: 'text-purple-500',
      Icon: Users, iconBg: 'bg-purple-50', iconColor: 'text-purple-500',
    },
  ];

  const gateways = [
    {
      name: 'Stripe Global', sub: 'Primary Gateway',
      color: '#635bff', initial: 'S',
      status: 'Active', fee: '2.9% + $0.30',
      methods: ['VISA', 'MC', 'ApplePay'],
      lastTx: '2 mins ago', health: 99.9,
    },
    {
      name: 'PayPal Express', sub: 'Secondary Gateway',
      color: '#003087', initial: 'P',
      status: 'Active', fee: '3.4% + $0.30',
      methods: ['PayPal Balance, CC'],
      lastTx: '45 mins ago', health: 96.4,
    },
  ];

  const transactions = [
    { id: 'TXN-849201-SP', org: 'TechCorp Solutions',  plan: 'Enterprise Plan', amount: '$12,400.00', gateway: 'Stripe',  status: 'SUCCESS', statusStyle: 'bg-emerald-50 text-emerald-700 border-emerald-100', date: 'Oct 24, 2023' },
    { id: 'TXN-849198-SP', org: 'EduFuture Academy',   plan: 'Standard Plan',  amount: '$2,100.00',  gateway: 'PayPal',  status: 'PENDING', statusStyle: 'bg-amber-50 text-amber-600 border-amber-100',   date: 'Oct 23, 2023' },
    { id: 'TXN-849195-SP', org: 'Innovate LLC',        plan: 'Premium Plan',   amount: '$5,500.00',  gateway: 'Stripe',  status: 'FAILED',  statusStyle: 'bg-red-50 text-red-600 border-red-100',         date: 'Oct 23, 2023' },
  ];

  const aiInsights = [
    {
      tag: 'RISK DETECTOR', tagColor: 'text-amber-400',
      badge: '98% Match', badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
      title: 'Fraud Risk Detected',
      desc: 'System identified unusual transaction pattern from IP: 184.22.x.x. Suggesting extra verification.',
    },
    {
      tag: 'FORECASTING', tagColor: 'text-blue-400',
      badge: 'High Confidence', badgeBg: 'bg-blue-500/20 text-blue-300 border border-blue-500/20',
      title: 'Revenue Projections',
      desc: 'Estimated $312K next month based on 85% subscription renewal probability.',
    },
    {
      tag: 'OPTIMIZER', tagColor: 'text-amber-500',
      badge: 'Insight', badgeBg: 'bg-slate-600 text-slate-300 border border-slate-500',
      title: 'Failure Prediction',
      desc: '12 subscriptions likely to fail on next billing due to card expiration. Notifying users now...',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <SuperadminSidebar />

      <div className="flex-1 pl-0 lg:pl-64 pt-20 lg:pt-0 flex flex-col min-h-screen overflow-hidden">

        {/* ── HEADER ── */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Payment Gateway Settings</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Configure payment gateways, billing policies, and transaction controls</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input type="text" placeholder="Search settings..."
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 outline-none w-56 focus:border-blue-400 focus:bg-white transition-all" />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all">
              <Download size={14} /> Export
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
              <Plus size={15} /> Add Gateway
            </button>
          </div>
        </header>

        {/* ── SCROLLABLE MAIN ── */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                    <s.Icon size={18} className={s.iconColor} />
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${s.badgeStyle}`}>{s.badge}</span>
                </div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400 font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── CONFIGURED PAYMENT GATEWAYS ── */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">Configured Payment Gateways</h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Gateway','Status','Fee','Methods','Last Transaction','Health Status','Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {gateways.map((gw, i) => (
                  <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                          style={{ background: gw.color }}>
                          {gw.initial}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{gw.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{gw.sub}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {gw.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">{gw.fee}</td>
                    <td className="px-5 py-4">
                      {i === 0 ? (
                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
                          <span className="italic font-black">VISA</span>
                          <span className="text-red-500 font-black text-base">●</span>
                          <span className="text-xs font-black">Pay</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500 font-medium">{gw.methods[0]}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400 font-medium">{gw.lastTx}</td>
                    <td className="px-5 py-4"><HealthBar pct={gw.health} /></td>
                    <td className="px-5 py-4">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreHorizontal size={15} className="text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── GLOBAL BILLING SETTINGS ── */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-black text-slate-900 mb-5">Global Billing Settings</h2>
            <div className="grid grid-cols-3 gap-6">

              {/* Auto-Billing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Calendar size={14} className="text-blue-500" />
                    </div>
                    <span className="text-sm font-black text-slate-800">Auto-Billing</span>
                  </div>
                  <Toggle enabled={autoBilling} onChange={setAutoBilling} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Subscription Interval</p>
                  <div className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 bg-white">
                    Yearly (Default)
                  </div>
                </div>
              </div>

              {/* Tax Invoices */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                      <FileText size={14} className="text-amber-500" />
                    </div>
                    <span className="text-sm font-black text-slate-800">Tax Invoices</span>
                  </div>
                  <Toggle enabled={taxInvoices} onChange={setTaxInvoices} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Invoice Prefix</p>
                  <div className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 bg-white">
                    SKP-
                  </div>
                </div>
              </div>

              {/* Retry Logic */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                      <RefreshCw size={14} className="text-purple-500" />
                    </div>
                    <span className="text-sm font-black text-slate-800">Retry Logic</span>
                  </div>
                  <Toggle enabled={retryLogic} onChange={setRetryLogic} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Failed Attempt Retry</p>
                  <div className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 bg-white">
                    Retry 3 times (1, 3, 5 days)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── REVENUE GROWTH TREND + PAYMENT METHOD USAGE ── */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-black text-slate-900 mb-4">Revenue Growth Trend</h3>
              <RevenueChart />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-black text-slate-900 mb-4">Payment Method Usage</h3>
              <div className="flex items-center gap-6">
                <PaymentDonut />
                <div className="space-y-3.5">
                  {[
                    { label: 'Credit Card (62%)', color: '#3b82f6' },
                    { label: 'PayPal (28%)',      color: '#8b5cf6' },
                    { label: 'Bank Transfer (10%)',color: '#a78bfa' },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
                      <span className="text-sm font-semibold text-slate-600">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── AI PAYMENT INTELLIGENCE INSIGHTS ── */}
          <div className="bg-[#0f172a] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <span className="text-blue-400 text-lg">◆</span>
              </div>
              <h3 className="text-base font-black text-white">AI Payment Intelligence Insights</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {aiInsights.map((ins, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${ins.tagColor}`}>{ins.tag}</span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full ${ins.badgeBg}`}>{ins.badge}</span>
                  </div>
                  <p className="text-sm font-black text-white mb-2">{ins.title}</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{ins.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RECENT TRANSACTIONS ── */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-base font-black text-slate-900">Recent Transactions</h2>
              <button className="text-sm font-bold text-blue-500 hover:text-blue-700 transition-colors">View Full Ledger</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Transaction ID','User / Org','Amount','Gateway','Status','Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-blue-500 font-mono">{tx.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-slate-800">{tx.org}</p>
                      <p className="text-xs text-slate-400 font-medium">{tx.plan}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">{tx.amount}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">{tx.gateway}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-black border ${tx.statusStyle}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
};

export default PaymentGatewayBillingSettings;