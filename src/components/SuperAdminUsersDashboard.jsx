import React, { useState } from 'react';
import {
  Search, Filter, UserPlus, Download, Printer,
  MoreHorizontal, ChevronLeft, ChevronRight,
  Users, UserCheck, UserX, Clock,
  ArrowUpRight
} from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';

// ── Role Donut Chart ──────────────────────────────────────────────────────────
const RoleDonut = () => {
  // Employees 72%, Managers 18%, Super Admins 10%
  const segments = [
    { pct: 72, color: '#6366f1' },
    { pct: 18, color: '#818cf8' },
    { pct: 10, color: '#c7d2fe' },
  ];
  const r = 70, cx = 85, cy = 85, stroke = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width="170" height="170" viewBox="0 0 170 170">
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circ;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return el;
      })}
      {/* White center */}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="900" fill="#1e293b" fontFamily="sans-serif">24k</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="sans-serif">Total</text>
    </svg>
  );
};

// ── Account Status Bar Chart ─────────────────────────────────────────────────
const AccountStatusChart = () => {
  const bars = [
    { label: 'ACTIVE',    pct: 74, color: '#6366f1' },
    { label: 'INACTIVE',  pct: 24, color: '#6366f1' },
    { label: 'PENDING',   pct: 12, color: '#6366f1' },
    { label: 'SUSPENDED', pct:  6, color: '#6366f1' },
  ];
  const W = 340, H = 120, padB = 24, padT = 10, barW = 44, gap = 28;
  const totalW = bars.length * (barW + gap) - gap;
  const startX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H + padB}`} className="w-full" style={{ height: 140 }}>
      {bars.map((b, i) => {
        const barH = (b.pct / 100) * H;
        const x = startX + i * (barW + gap);
        const y = padT + H - barH;
        return (
          <g key={i}>
            <rect x={x} y={padT} width={barW} height={H} rx="8" fill="#f1f5f9" />
            <rect x={x} y={y} width={barW} height={barH} rx="8" fill={b.color} />
            <text x={x + barW / 2} y={padT + H + 18} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="sans-serif" fontWeight="800" letterSpacing="0.5">{b.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Avatar Placeholder ────────────────────────────────────────────────────────
const Avatar = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-black text-slate-500">{initials}</span>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const UserManagement = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [currentPage, setCurrentPage] = useState(1);

  const statCards = [
    { label: 'TOTAL USERS',    value: '24,853', icon: Users,       iconBg: 'bg-blue-50',   iconColor: 'text-blue-500'   },
    { label: 'ACTIVE USERS',   value: '18,402', icon: UserCheck,   iconBg: 'bg-emerald-50',iconColor: 'text-emerald-500' },
    { label: 'INACTIVE USERS', value: '5,930',  icon: UserX,       iconBg: 'bg-slate-100', iconColor: 'text-slate-400'  },
    { label: 'PENDING',        value: '521',    icon: Clock,       iconBg: 'bg-amber-50',  iconColor: 'text-amber-500'  },
  ];

  const users = [
    { id: '#USR-8921', name: 'James Wilson',    email: 'james.w@global.com',    role: 'Team Leader', dept: 'Product Design', status: 'Active',   lastLogin: '2h ago'   },
    { id: '#USR-8922', name: 'Sarah Jenkins',   email: 's.jenkins@global.com',  role: 'HR Manager',  dept: 'People & Ops',   status: 'Active',   lastLogin: '5h ago'   },
    { id: '#USR-8923', name: 'David Chen',      email: 'd.chen@global.com',     role: 'Employee',    dept: 'Engineering',    status: 'Pending',  lastLogin: 'Never'    },
    { id: '#USR-8924', name: 'Elena Rodriguez', email: 'elena.r@global.com',    role: 'Team Leader', dept: 'Marketing',      status: 'Inactive', lastLogin: '12d ago'  },
    { id: '#USR-8925', name: 'Marcus Vance',    email: 'm.vance@global.com',    role: 'Employee',    dept: 'Security Ops',   status: 'Active',   lastLogin: '10m ago'  },
    { id: '#USR-8926', name: 'Priya Singh',     email: 'p.singh@global.com',    role: 'HR Manager',  dept: 'People & Ops',   status: 'Active',   lastLogin: '1h ago'   },
    { id: '#USR-8927', name: 'David Park',      email: 'd.park@global.com',     role: 'Employee',    dept: 'Engineering',    status: 'Active',   lastLogin: '3h ago'   },
    { id: '#USR-8928', name: 'Aisha Karim',     email: 'a.karim@global.com',    role: 'Team Leader', dept: 'Finance',        status: 'Inactive', lastLogin: '5d ago'   },
    { id: '#USR-8929', name: 'Ryan Torres',     email: 'r.torres@global.com',   role: 'Employee',    dept: 'Sales',          status: 'Active',   lastLogin: '45m ago'  },
    { id: '#USR-8930', name: 'Sophia Lee',      email: 's.lee@global.com',      role: 'Employee',    dept: 'Engineering',    status: 'Pending',  lastLogin: 'Never'    },
  ];

  const statusStyle = (status) => {
    if (status === 'Active')   return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    if (status === 'Pending')  return 'bg-amber-50 border-amber-200 text-amber-600';
    if (status === 'Inactive') return 'bg-slate-100 border-slate-200 text-slate-500';
    return '';
  };
  const statusDot = (status) => {
    if (status === 'Active')   return 'bg-emerald-500';
    if (status === 'Pending')  return 'bg-amber-400';
    return 'bg-slate-400';
  };

  const aiInsights = [
    {
      tag: 'ATTENTION REQUIRED', tagBg: 'bg-purple-100 text-purple-700', conf: '94% Conf.', confColor: 'text-purple-600',
      title: 'Dormant Accounts Spike',
      desc: "System detected 142 users in 'Engineering' haven't logged in for 30+ days. Potential offboarding gap.",
      border: 'border-purple-100',
    },
    {
      tag: 'TREND SPOTTED', tagBg: 'bg-teal-100 text-teal-700', conf: '88% Conf.', confColor: 'text-teal-600',
      title: 'Peak Activity Times',
      desc: 'Login frequency peaks between 9:00 AM – 11:00 AM GMT. Consider scheduling maintenance outside this window.',
      border: 'border-teal-100',
    },
    {
      tag: 'OPTIMAL SYNC', tagBg: 'bg-emerald-100 text-emerald-700', conf: '99% Conf.', confColor: 'text-emerald-600',
      title: 'HRIS Data Integrity',
      desc: 'User profile data is 99.8% synchronized with Workday. No manual reconciliation needed this cycle.',
      border: 'border-emerald-100',
    },
  ];

  const totalPages = 248;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <SuperadminSidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen overflow-hidden">

        {/* ── TOP HEADER ── */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">User Management</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Manage, configure, and monitor all platform users</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search users by name, email..."
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 outline-none w-64 focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all">
              <Filter size={14} /> Filters
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
              <UserPlus size={15} /> Add New User
            </button>
            <Avatar name={loggedInUser?.firstName ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : loggedInUser?.email || "Super Admin"} />
          </div>
        </header>

        {/* ── SCROLLABLE MAIN ── */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon size={20} className={s.iconColor} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── ALL PLATFORM USERS TABLE ── */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-base font-black text-slate-900">All Platform Users</h2>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all">
                  <Download size={13} /> Export CSV
                </button>
                <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all">
                  <Printer size={13} /> Print
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="px-6 py-3 w-10"><input type="checkbox" className="rounded" /></th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">User ID</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Name & Email</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Last Login</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user, i) => (
                    <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4"><input type="checkbox" className="rounded" /></td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-400 font-semibold">{user.id}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} />
                          <div>
                            <p className="text-sm font-black text-slate-800">{user.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-700">{user.role}</td>
                      <td className="px-4 py-4 text-sm text-slate-500">{user.dept}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-black ${statusStyle(user.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot(user.status)}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400 font-medium">{user.lastLogin}</td>
                      <td className="px-4 py-4 text-right">
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreHorizontal size={15} className="text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="font-black text-slate-700">1-10</span> of <span className="font-black text-slate-700">24,853</span> users
              </p>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-slate-200/60 rounded-xl transition-all text-slate-400 hover:text-slate-700">
                  <ChevronLeft size={14} />
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${currentPage === p ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {p}
                  </button>
                ))}
                <span className="text-slate-400 text-xs font-bold px-1">...</span>
                <button className="w-8 h-8 rounded-lg text-xs font-black bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                  248
                </button>
                <button className="p-2 hover:bg-slate-200/60 rounded-xl transition-all text-slate-400 hover:text-slate-700">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ── USER ROLE DISTRIBUTION + ACCOUNT STATUS OVERVIEW ── */}
          <div className="grid grid-cols-2 gap-5">

            {/* User Role Distribution */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-base font-black text-slate-900">User Role Distribution</h3>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreHorizontal size={15} className="text-slate-400" />
                </button>
              </div>
              <div className="flex items-center gap-6">
                <RoleDonut />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-black text-slate-800">Employees</p>
                      <p className="text-xs text-slate-400 font-medium">72% of total</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-black text-slate-800">Managers</p>
                      <p className="text-xs text-slate-400 font-medium">18% of total</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-indigo-200 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-black text-slate-800">Super Admins</p>
                      <p className="text-xs text-slate-400 font-medium">10% of total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status Overview */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-base font-black text-slate-900">Account Status Overview</h3>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">Overall +8.4%</span>
              </div>
              <AccountStatusChart />
            </div>
          </div>

          {/* ── BULK USER ACTIONS ── */}
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Users size={20} className="text-slate-400" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">Bulk User Actions</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Perform actions on multiple selected users simultaneously</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all">
                Bulk Deactivate
              </button>
              <button className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all">
                Assign Role
              </button>
              <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                Bulk Activate
              </button>
            </div>
          </div>

          {/* ── AI USER ACTIVITY INSIGHTS ── */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-black text-slate-900 mb-5">
              AI User Activity<br />Insights
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {aiInsights.map((insight, i) => (
                <div key={i} className={`border ${insight.border} rounded-2xl p-4 bg-white hover:shadow-sm transition-shadow`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full tracking-widest uppercase ${insight.tagBg}`}>{insight.tag}</span>
                    <span className={`text-xs font-black ${insight.confColor}`}>{insight.conf}</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 mb-2">{insight.title}</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{insight.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default UserManagement;