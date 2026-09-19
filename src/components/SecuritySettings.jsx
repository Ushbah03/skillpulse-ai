import React, { useState } from 'react';
import { Search, RotateCcw, Save, Lock, LogIn, AlertCircle, Shield, Key, Users, AlertTriangle, Clock } from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange, size = 'default' }) => {
  const sizeClass = size === 'small' ? 'w-9 h-5' : 'w-11 h-6';
  const dotSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  const translateClass = size === 'small' ? 'translate-x-4' : 'translate-x-5';

  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex ${sizeClass} rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? 'bg-slate-900' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 ${dotSize} bg-white rounded-full shadow transition-transform duration-200 ${enabled ? translateClass : 'translate-x-0'}`} />
    </button>
  );
};

// ── Stat Card Component ───────────────────────────────────────────────────────
const StatCard = ({ Icon, value, label, badge, badgeColor, iconBg }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
        <Icon size={24} className="text-slate-900" />
      </div>
      {badge && (
        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500 font-medium mt-1">{label}</p>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const SecuritySettings = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [passwordlessEnabled, setPasswordlessEnabled] = useState(false);
  const [uppercaseRequired, setUppercaseRequired] = useState(true);
  const [lowercaseRequired, setLowercaseRequired] = useState(false);
  const [numbersRequired, setNumbersRequired] = useState(false);
  const [specialCharsRequired, setSpecialCharsRequired] = useState(false);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState('90 Days');
  const [minPasswordLength, setMinPasswordLength] = useState('12');
  const [failedAttemptLimit, setFailedAttemptLimit] = useState('5');
  const [lockoutDuration, setLockoutDuration] = useState('30 Minutes');
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(true);
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <SuperadminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Security Settings</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Configure authentication and platform security policies</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search security settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
              <RotateCcw size={16} /> Reset to Default
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">
              <Save size={16} /> Save Security Settings
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              Icon={Shield}
              value="94%"
              label="Security Score"
              badge="Secure"
              badgeColor="bg-emerald-100 text-emerald-700"
              iconBg="bg-orange-100"
            />
            <StatCard
              Icon={Key}
              value="88.2%"
              label="MFA Adoption Rate"
              iconBg="bg-orange-100"
            />
            <StatCard
              Icon={Users}
              value="1,242"
              label="Active Sessions"
              iconBg="bg-blue-100"
            />
            <StatCard
              Icon={AlertTriangle}
              value="03"
              label="Active Threat Alerts"
              iconBg="bg-orange-100"
            />
          </div>

          {/* Authentication Policies */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Authentication Policies</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Global identity verification controls</p>
              </div>
              <Shield size={28} className="text-slate-400" />
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-semibold text-slate-800">Multi-Factor (MFA)</span>
                <Toggle enabled={mfaEnabled} onChange={setMfaEnabled} />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-semibold text-slate-800">Single Sign-On (SSO)</span>
                <Toggle enabled={ssoEnabled} onChange={setSsoEnabled} />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-semibold text-slate-800">Biometric Auth</span>
                <Toggle enabled={biometricEnabled} onChange={setBiometricEnabled} />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-semibold text-slate-800">Passwordless Login</span>
                <Toggle enabled={passwordlessEnabled} onChange={setPasswordlessEnabled} />
              </div>
            </div>
          </div>

          {/* Password Policy + Login Security */}
          <div className="grid grid-cols-2 gap-6">
            {/* Password Policy */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock size={24} className="text-slate-900" />
                <h3 className="text-lg font-bold text-slate-900">Password Policy</h3>
              </div>

              <div className="space-y-6">
                {/* Minimum Password Length */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">Minimum Password Length</label>
                    <span className="text-sm font-bold text-slate-900">{minPasswordLength}</span>
                  </div>
                  <input
                    type="number"
                    value={minPasswordLength}
                    onChange={(e) => setMinPasswordLength(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Character Requirements */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Character Requirements</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={uppercaseRequired}
                        onChange={(e) => setUppercaseRequired(e.target.checked)}
                        className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700">Uppercase</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lowercaseRequired}
                        onChange={(e) => setLowercaseRequired(e.target.checked)}
                        className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700">Lowercase</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={numbersRequired}
                        onChange={(e) => setNumbersRequired(e.target.checked)}
                        className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700">Numbers</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={specialCharsRequired}
                        onChange={(e) => setSpecialCharsRequired(e.target.checked)}
                        className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700">Special Characters</span>
                    </label>
                  </div>
                </div>

                {/* Password Expiry Duration */}
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Password Expiry Duration</p>
                  <input
                    type="text"
                    value={passwordExpiryDays}
                    readOnly
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-slate-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Login Security */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <LogIn size={24} className="text-slate-900" />
                <h3 className="text-lg font-bold text-slate-900">Login Security</h3>
              </div>

              <div className="space-y-6">
                {/* Failed Attempt Limit */}
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Failed Attempt Limit</p>
                  <input
                    type="number"
                    value={failedAttemptLimit}
                    onChange={(e) => setFailedAttemptLimit(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Lockout Duration */}
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Lockout Duration</p>
                  <input
                    type="text"
                    value={lockoutDuration}
                    readOnly
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-slate-50 cursor-not-allowed"
                  />
                </div>

                {/* IP Whitelist Enforcement */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle size={18} className="text-orange-600" />
                    <h4 className="text-sm font-bold text-orange-900">IP Whitelist Enforcement</h4>
                  </div>
                  <p className="text-xs text-orange-700 font-medium">Restrict access to specific corporate IP ranges</p>
                  <div className="mt-3">
                    <Toggle enabled={ipWhitelistEnabled} onChange={setIpWhitelistEnabled} />
                  </div>
                </div>

                {/* Enable CAPTCHA */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Enable CAPTCHA on failure</p>
                  </div>
                  <Toggle enabled={captchaEnabled} onChange={setCaptchaEnabled} />
                </div>

                {/* Manage Allowed Login Hours */}
                <button className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <Clock size={18} /> Manage Allowed Login Hours
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default SecuritySettings;