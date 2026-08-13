import React, { useState } from 'react';
import { Save, Search } from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange, size = 'default' }) => {
  const sizeClass = size === 'small' ? 'w-9 h-5' : 'w-11 h-6';
  const dotSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  const translateClass = size === 'small' ? 'translate-x-4' : 'translate-x-5';

  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex ${sizeClass} rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 ${dotSize} bg-white rounded-full shadow transition-transform duration-200 ${enabled ? translateClass : 'translate-x-0'}`} />
    </button>
  );
};

// ── Stat Card Component ───────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, subtext, subColor }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5">
    <div className="flex items-start gap-3 mb-3">
      <div className="text-2xl">{icon}</div>
    </div>
    <p className={`text-sm font-medium ${subColor || 'text-slate-500'} mb-1`}>{subtext}</p>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const SystemParameters= () => {
  const [skillWeight, setSkillWeight] = useState(40);
  const [performanceWeight, setPerformanceWeight] = useState(30);
  const [yearsWeight, setYearsWeight] = useState(15);
  const [lmsWeight, setLmsWeight] = useState(15);
  const [skillExpiryEnabled, setSkillExpiryEnabled] = useState(true);
  const [validityDuration, setValidityDuration] = useState('2 Years');
  const [confidenceThreshold, setConfidenceThreshold] = useState('0.75');
  const [minDataRecords, setMinDataRecords] = useState('50 records');
  const [recommendationFrequency, setRecommendationFrequency] = useState('Daily');
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);
  const [complianceAlerts, setComplianceAlerts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-72 z-50">
        <SuperadminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">System Parameters</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Configure platform behavior and operational rules</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search parameters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
              Reset to Default
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              icon="📁"
              label="Active Configuration"
              value="Enterprise_Default_v2"
              subtext=""
            />
            <StatCard
              icon="⏱️"
              label="Last Updated"
              value="2 hours ago"
              subtext=""
            />
            <StatCard
              icon="✓"
              label="System Health Score"
              value="99.4%"
              subtext="Optimal"
              subColor="text-emerald-600 font-semibold"
            />
            <StatCard
              icon="≡"
              label="Active System Rules"
              value="142"
              subtext=""
            />
          </div>

          {/* Readiness Score Parameters + Live Preview */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Section */}
            <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Readiness Score Parameters</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">Define weighted contribution of various factors toward the global Readiness Score</p>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">Skill Proficiency Weight</label>
                    <span className="text-sm font-bold text-blue-600">{skillWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillWeight}
                    onChange={(e) => setSkillWeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">Performance Review Weight</label>
                    <span className="text-sm font-bold text-blue-600">{performanceWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={performanceWeight}
                    onChange={(e) => setPerformanceWeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">Years of Experience Weight</label>
                    <span className="text-sm font-bold text-blue-600">{yearsWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={yearsWeight}
                    onChange={(e) => setYearsWeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">LMS Training Completion Weight</label>
                    <span className="text-sm font-bold text-blue-600">{lmsWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={lmsWeight}
                    onChange={(e) => setLmsWeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Live Calculation Preview */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-6 text-2xl">
                📊
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Live Calculation Preview</p>
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-slate-900">82.5</span>
                  <span className="text-2xl text-slate-400 font-medium">/100</span>
                </div>
                <div className="flex justify-center gap-1 my-4">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                </div>
                <p className="text-xs text-slate-500 italic text-center">Based on a sample employee with High Proficiency and Medium Performance history.</p>
              </div>
            </div>
          </div>

          {/* Skill Proficiency + Skill Expiry */}
          <div className="grid grid-cols-2 gap-6">
            {/* Skill Proficiency Levels */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-5">Skill Proficiency Levels</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Beginner (Level 1)</span>
                  <span className="text-sm font-semibold text-slate-500">1</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Intermediate (Level 2)</span>
                  <span className="text-sm font-semibold text-slate-500">2</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Advanced (Level 3)</span>
                  <span className="text-sm font-semibold text-slate-500">3</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Expert (Level 4)</span>
                  <span className="text-sm font-semibold text-slate-500">4</span>
                </div>
              </div>
            </div>

            {/* Skill Expiry Settings */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-5">Skill Expiry Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Skill Expiry</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Skills automatically expire after a set duration</p>
                  </div>
                  <Toggle enabled={skillExpiryEnabled} onChange={setSkillExpiryEnabled} />
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Default Validity Duration</p>
                  <input
                    type="text"
                    value={validityDuration}
                    readOnly
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-slate-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Processing Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">AI Processing Settings</h2>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">Prediction Confidence Threshold</label>
                    <span className="text-sm font-bold text-blue-600">{confidenceThreshold}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">Minimum Data Requirement</label>
                    <span className="text-sm font-bold text-blue-600">{minDataRecords}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Recommendation Frequency</p>
                  <input
                    type="text"
                    value={recommendationFrequency}
                    readOnly
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-slate-50"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Auto Model Optimization</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Platform periodically retrains models for accuracy</p>
                  </div>
                  <Toggle enabled={autoOptimization} onChange={setAutoOptimization} />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Notification Settings</h2>

            <div className="flex items-center gap-12">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700">Email Notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inAppNotifications}
                  onChange={(e) => setInAppNotifications(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700">In-App Notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiAlerts}
                  onChange={(e) => setAiAlerts(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700">AI Alerts</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={complianceAlerts}
                  onChange={(e) => setComplianceAlerts(e.target.checked)}
                  className="w-5 h-5 accent-slate-300 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700">Compliance Alerts</span>
              </label>
            </div>
          </div>

          {/* Configuration Change History */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-slate-900">Configuration Change History</h2>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Export CSV</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left font-bold text-slate-700 py-3 px-4 text-xs uppercase tracking-widest">Parameter Name</th>
                    <th className="text-left font-bold text-slate-700 py-3 px-4 text-xs uppercase tracking-widest">Old Value</th>
                    <th className="text-left font-bold text-slate-700 py-3 px-4 text-xs uppercase tracking-widest">New Value</th>
                    <th className="text-left font-bold text-slate-700 py-3 px-4 text-xs uppercase tracking-widest">Modified By</th>
                    <th className="text-left font-bold text-slate-700 py-3 px-4 text-xs uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">Skill_Weight</td>
                    <td className="py-3 px-4 text-slate-600">35%</td>
                    <td className="py-3 px-4 font-bold text-teal-600">40%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400" />
                        <span className="font-semibold text-slate-700">A. Pierce</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">Oct 24, 09:12 AM</td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">Auto_Optimize</td>
                    <td className="py-3 px-4 text-slate-600">Disabled</td>
                    <td className="py-3 px-4 font-bold text-teal-600">Enabled</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400" />
                        <span className="font-semibold text-slate-700">A. Pierce</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">Oct 24, 08:45 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Optimization Insights */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                •
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Optimization Insights</h3>
                <p className="text-xs text-slate-400 mt-1">Based on last week's system performance, SkillPulse AI suggests the following parameter adjustments to improve recommendation accuracy.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-slate-800 border border-blue-500/40 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                    ℹ
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Increase Performance Weight</p>
                    <p className="text-xs text-slate-300 mb-3">Adjustment from 30% to 35% is expected to increase Readiness Score correlation by +2.1%</p>
                    <div className="flex gap-2">
                      <button className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-all">ACCEPT</button>
                      <button className="text-xs font-bold text-slate-400 hover:text-slate-200">IGNORE</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-800 border border-amber-600/40 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-1">
                    ⚠
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Confidence Threshold Warning</p>
                    <p className="text-xs text-slate-300">Lowering threshold below 0.65 may increase noise in user recommendations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default SystemParameters;