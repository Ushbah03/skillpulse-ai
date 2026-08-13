import React, { useState } from 'react';
import { 
  Search, Bell, Plus, Users, Clock, CheckCircle, 
  ArrowRight, Calendar, Sparkles, X, BookOpen, Award, Check
} from 'lucide-react';
import HRSidebar from './HRSidebar';

// ── PROGRAM POPULARITY BAR CHART ─────────────────────────────────────────────
const ProgramPopularityChart = () => {
  const bars = [
    { label: 'LEAD', height: '75%', color: 'bg-blue-500' },
    { label: 'TECH', height: '60%', color: 'bg-emerald-500' },
    { label: 'COMP', height: '90%', color: 'bg-indigo-600' },
    { label: 'SOFT', height: '40%', color: 'bg-amber-500' },
    { label: 'OPER', height: '70%', color: 'bg-purple-500' },
  ];

  return (
    <div className="flex flex-col justify-between h-48 pt-4">
      <div className="flex items-end justify-between h-36 px-2">
        {bars.map((bar, i) => (
          <div key={i} className="flex flex-col items-center w-1/6 group">
            <div className="w-full bg-slate-50 rounded-md h-32 flex items-end">
              <div
                className={`w-full ${bar.color} rounded-md transition-all duration-500 ease-out`}
                style={{ height: bar.height }}
              />
            </div>
            <span className="text-xs font-bold text-slate-500 mt-2 tracking-wider">
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── COMPLETION TRENDS SVG CHART ──────────────────────────────────────────────
const CompletionTrendsChart = () => {
  const data = [
    { month: 'May', count: 180 },
    { month: 'Jun', count: 240 },
    { month: 'Jul', count: 310 },
    { month: 'Aug', count: 290 },
    { month: 'Sep', count: 420 },
    { month: 'Oct', count: 530 },
  ];

  const maxVal = 600;
  const width = 500;
  const height = 140;
  const points = data.map((d, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - (d.count / maxVal) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full pt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
        <polyline
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {data.map((d, idx) => {
          const x = (idx / (data.length - 1)) * width;
          const y = height - (d.count / maxVal) * height;
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r="5" className="fill-indigo-600 stroke-white stroke-2" />
              <text x={x} y={height + 20} textAnchor="middle" className="text-[11px] font-bold fill-slate-400">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ── TOAST NOTIFICATION ───────────────────────────────────────────────────────
const ToastNotification = ({ toast, onClose }) => {
  if (!toast.visible) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-slate-200 shadow-xl rounded-2xl px-5 py-4 min-w-[320px] max-w-md animate-in slide-in-from-bottom-4 duration-200">
      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
        <Check size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-slate-900">{toast.title}</p>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{toast.message}</p>
      </div>
      <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
        <X size={15} />
      </button>
    </div>
  );
};

// ── ACTION MODAL ─────────────────────────────────────────────────────────────
const ActionModal = ({ isOpen, title, description, confirmText, onConfirm, onClose, icon: Icon }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              {Icon ? <Icon size={22} /> : <BookOpen size={22} />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{title}</h3>
              <p className="text-xs text-slate-400 font-semibold">Training Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {description}
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md">
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── MAIN DASHBOARD COMPONENT ──────────────────────────────────────────────────
const TrainingProgramManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', description: '', confirmText: '', onConfirm: null, icon: null });

  const showToast = (title, message) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const closeModal = () => setModalConfig({ isOpen: false });

  const statusSummary = [
    { label: 'ACTIVE', count: '842', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Users size={16} /> },
    { label: 'PENDING', count: '156', color: 'text-orange-500', bg: 'bg-orange-50', icon: <Clock size={16} /> },
    { label: 'COMPLETED', count: '2.4k', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle size={16} /> },
  ];

  const programs = [
    {
      title: 'Executive Strategy Essentials',
      category: 'LEADERSHIP',
      enrolled: '142 Enrolled',
      completion: 65,
      barColor: 'bg-blue-600',
      img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Advanced Data Analytics 2024',
      category: 'TECHNICAL',
      enrolled: '89 Enrolled',
      completion: 42,
      barColor: 'bg-amber-500',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Cybersecurity Awareness',
      category: 'COMPLIANCE',
      enrolled: '520 Enrolled',
      completion: 92,
      barColor: 'bg-emerald-600',
      img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const funnelStages = [
    { label: 'Invited', count: '4,200', width: 'w-full', bg: 'bg-blue-500' },
    { label: 'Started', count: '3,120', width: 'w-[82%]', bg: 'bg-blue-400' },
    { label: 'In Progress', count: '2,450', width: 'w-[68%]', bg: 'bg-blue-300' },
    { label: 'Completed', count: '1,820', width: 'w-[52%]', bg: 'bg-blue-200' },
  ];

  const topPerformers = [
    { rank: 1, name: 'Marcus Thorne', dept: 'Product Design', courses: '12 Courses', score: '98.2%', img: 'https://i.pravatar.cc/150?img=33', badgeColor: 'bg-amber-400' },
    { rank: 2, name: 'Elena Rodriguez', dept: 'Sales Ops', courses: '10 Courses', score: '96.8%', img: 'https://i.pravatar.cc/150?img=49', badgeColor: 'bg-slate-300' },
    { rank: 3, name: 'James Wilson', dept: 'Engineering', courses: '9 Courses', score: '95.1%', img: 'https://i.pravatar.cc/150?img=12', badgeColor: 'bg-amber-600' },
  ];

  const upcomingSessions = [
    { date: '18', month: 'OCT', title: 'AI Implementation Lab', details: '2:00 PM • Virtual' },
    { date: '22', month: 'OCT', title: 'Effective Feedback Workshop', details: '10:00 AM • Room 4B' }
  ];

  const filteredPrograms = programs.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProgram = () => {
    setModalConfig({
      isOpen: true,
      title: 'Create New Training Program',
      description: 'Define program scope, target skills, and assign initial employee cohorts across departments.',
      confirmText: 'Create Program',
      icon: Plus,
      onConfirm: () => {
        closeModal();
        showToast('Program Created', 'New training module added to enterprise learning portal.');
      }
    });
  };

  const handleEnroll = (progTitle) => {
    setModalConfig({
      isOpen: true,
      title: 'Enroll Employees',
      description: `Open enrollment cohort for "${progTitle}"? Automated invitations will be dispatched.`,
      confirmText: 'Confirm Enrollment',
      icon: Users,
      onConfirm: () => {
        closeModal();
        showToast('Enrollment Updated', `Cohort registered for ${progTitle}.`);
      }
    });
  };

  const handleCalendarSync = () => {
    showToast('Calendar Synced', 'Upcoming training sessions synced with Outlook / Google Calendar.');
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="flex min-h-screen bg-[#f8fafc]">
      <HRSidebar />

      <div className="flex-1 ml-64 overflow-auto pb-12">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
            <span>Planning</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">Training Programs</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs..."
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 text-base text-slate-600 outline-none w-64 border border-slate-100 focus:border-slate-200 focus:bg-white transition-all"
              />
            </div>

            <button className="relative p-2 rounded-xl hover:bg-slate-50 text-slate-500">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            <button 
              onClick={handleCreateProgram}
              className="flex items-center gap-1.5 bg-[#1e293b] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            >
              <Plus size={14} />
              New Program
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="px-8 py-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Training & Development
            </h1>

            <p className="text-base text-slate-500 font-medium mt-2">
              Monitor course performance, track employee progression, and evaluate completion rates.
            </p>
          </div>

          <div className="flex gap-4">
            {statusSummary.map((status, index) => (
              <div
                key={index}
                className="bg-white border border-slate-100 shadow-sm rounded-xl px-5 py-3.5 flex items-center gap-4 w-40"
              >
                <div className={`w-10 h-10 rounded-full ${status.bg} ${status.color} flex items-center justify-center`}>
                  {status.icon}
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                    {status.label}
                  </p>

                  <p className="text-2xl font-black text-slate-800 leading-tight mt-0.5">
                    {status.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROGRAMS GRID */}
        <div className="px-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">
              Current Training Programs
            </h2>

            <button className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors">
              See all programs <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {filteredPrograms.map((prog, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 bg-slate-100">
                  <img src={prog.img} alt={prog.title} className="w-full h-full object-cover" />

                  <span className="absolute top-3 right-3 bg-white/95 text-xs font-extrabold px-2.5 py-1 rounded-md tracking-wider text-slate-800 shadow-sm">
                    {prog.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-snug">
                      {prog.title}
                    </h3>

                    <div className="flex justify-between items-center text-sm text-slate-500 font-bold mt-4 mb-2">
                      <span className="flex items-center gap-1">
                        👤 {prog.enrolled}
                      </span>

                      <span>{prog.completion}% Completion</span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${prog.barColor} rounded-full`}
                        style={{ width: `${prog.completion}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button 
                      onClick={() => handleEnroll(prog.title)}
                      className="py-2 bg-[#2e3e56] text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition-all active:scale-95"
                    >
                      Enroll
                    </button>

                    <button className="py-2 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MID ANALYTICS SECTION */}
        <div className="px-8 mt-8 grid grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 col-span-2 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Completion Trends
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Monthly training completions across all programs.
                </p>
              </div>
              <span className="text-sm font-bold bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1.5 rounded-lg">
                Last 6 months
              </span>
            </div>
            <CompletionTrendsChart />
          </div>

          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Program Popularity
              </h3>
            </div>
            <ProgramPopularityChart />
            <div className="border-t border-slate-50 pt-3 mt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-500">Most Enrolled</span>
              <span className="text-slate-800">Compliance</span>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="px-8 mt-6 grid grid-cols-3 gap-6">
          {/* Funnel */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Learning Funnel
              </h3>

              <div className="flex justify-between text-sm font-black text-slate-400 tracking-wider mb-2">
                <span>STAGE</span>
                <span>EMPLOYEES</span>
              </div>

              <div className="space-y-2">
                {funnelStages.map((stage, idx) => (
                  <div key={idx} className="flex justify-end">
                    <div
                      className={`${stage.width} ${stage.bg} text-white flex justify-between items-center px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm`}
                    >
                      <span>{stage.label}</span>
                      <span>{stage.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-4 text-sm font-bold">
              <span className="text-slate-500">CONVERSION RATE</span>
              <span className="text-emerald-500 font-black">43.3% Total</span>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-900">Top Performers</h3>
                <Award size={20} className="text-amber-500" />
              </div>

              <div className="space-y-3">
                {topPerformers.map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={user.img} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                        <span className={`absolute -bottom-1 -right-1 text-[9px] font-black text-white px-1.5 py-0.2 rounded-full ${user.badgeColor}`}>
                          #{user.rank}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{user.dept} • {user.courses}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {user.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-50 pt-3 mt-2 flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Updated Daily</span>
              <span className="text-indigo-600">Leaderboard</span>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Upcoming Sessions
              </h3>

              <div className="space-y-3">
                {upcomingSessions.map((session, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-center min-w-[42px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase">
                        {session.month}
                      </p>
                      <p className="text-sm font-black text-slate-700 leading-none">
                        {session.date}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-800 leading-tight">
                        {session.title}
                      </p>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">
                        {session.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleCalendarSync}
              className="w-full text-center text-sm font-bold text-slate-700 py-2 border border-slate-200 hover:bg-slate-50 transition-all rounded-xl mt-4 active:scale-95"
            >
              Calendar Sync
            </button>
          </div>
        </div>

      </div>

      <ToastNotification toast={toast} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
      <ActionModal {...modalConfig} onClose={closeModal} />
    </div>
  );
};

export default TrainingProgramManagement;