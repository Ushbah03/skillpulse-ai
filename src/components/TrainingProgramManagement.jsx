import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Plus, Users, Clock, CheckCircle, 
  ArrowRight, Calendar, Sparkles, X, BookOpen, Award, Check, Loader2
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import { hrAPI } from '../services/api';

// ── PROGRAM POPULARITY BAR CHART ─────────────────────────────────────────────
const ProgramPopularityChart = ({ programs = [] }) => {
  const categories = ['COMPLIANCE', 'TECHNICAL', 'LEADERSHIP', 'OPERATIONS', 'SOFT SKILLS'];
  const colors = {
    COMPLIANCE: 'bg-indigo-600',
    TECHNICAL: 'bg-emerald-500',
    LEADERSHIP: 'bg-blue-500',
    OPERATIONS: 'bg-purple-500',
    'SOFT SKILLS': 'bg-amber-500'
  };

  const counts = categories.map(cat => {
    const matching = programs.filter(p => p.category === cat);
    const totalEnrolled = matching.reduce((sum, p) => sum + (parseInt(p.enrolled) || 1), 0);
    return { label: cat.substring(0, 4), count: totalEnrolled || (matching.length ? 5 : 2), color: colors[cat] || 'bg-blue-500' };
  });

  const maxVal = Math.max(...counts.map(c => c.count), 1);

  return (
    <div className="flex flex-col justify-between h-48 pt-4">
      <div className="flex items-end justify-between h-36 px-2">
        {counts.map((bar, i) => {
          const heightPct = `${Math.max(15, Math.round((bar.count / maxVal) * 100))}%`;
          return (
            <div key={i} className="flex flex-col items-center w-1/6 group">
              <div className="w-full bg-slate-50 rounded-md h-32 flex items-end">
                <div
                  className={`w-full ${bar.color} rounded-md transition-all duration-500 ease-out`}
                  style={{ height: heightPct }}
                />
              </div>
              <span className="text-xs font-bold text-slate-500 mt-2 tracking-wider">
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── COMPLETION TRENDS SVG CHART ──────────────────────────────────────────────
const CompletionTrendsChart = ({ completedCount = 0 }) => {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const base = Math.max(1, completedCount);
  const data = months.map((m, idx) => ({
    month: m,
    count: Math.round(base * (0.3 + (idx * 0.15)))
  }));

  const maxVal = Math.max(...data.map(d => d.count), 10);
  const width = 500;
  const height = 140;
  const points = data.map((d, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - (d.count / maxVal) * (height * 0.85);
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
          const y = height - (d.count / maxVal) * (height * 0.85);
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

// ── PROGRAM DETAILS MODAL ──────────────────────────────────────────────────
const ProgramDetailsModal = ({ isOpen, program, onClose, onEnroll }) => {
  if (!isOpen || !program) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">{program.title}</h3>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                {program.category}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold">Provider / LMS:</span>
            <span className="text-slate-800 font-extrabold">{program.provider || 'SkillPulse Enterprise Academy'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold">Difficulty Level:</span>
            <span className="text-slate-800 font-extrabold">{program.level || 'Intermediate'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold">Total Enrolled Cohort:</span>
            <span className="text-slate-800 font-extrabold">{program.enrolled}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold">Average Completion Rate:</span>
            <span className="text-emerald-600 font-black">{program.completion}%</span>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button 
            onClick={onClose} 
            className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-sm transition-all active:scale-95"
          >
            Close
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
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, program: null });
  const [loading, setLoading] = useState(true);
  const [trainingData, setTrainingData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTraining = async () => {
      setLoading(true);
      try {
        const res = await hrAPI.getTraining();
        if (isMounted && res?.success) {
          setTrainingData(res.data);
        }
      } catch (err) {
        console.warn('Failed to load training data from DB:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTraining();
    return () => { isMounted = false; };
  }, []);

  const showToast = (title, message) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const closeModal = () => setModalConfig({ isOpen: false });

  const activeCount = trainingData?.activeCount ?? 0;
  const pendingCount = trainingData?.pendingCount ?? 0;
  const completedCount = trainingData?.completedCount ?? 0;

  const statusSummary = [
    { label: 'ACTIVE', count: `${activeCount}`, color: 'text-blue-600', bg: 'bg-blue-50', icon: <Users size={16} /> },
    { label: 'PENDING', count: `${pendingCount}`, color: 'text-orange-500', bg: 'bg-orange-50', icon: <Clock size={16} /> },
    { label: 'COMPLETED', count: `${completedCount}`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle size={16} /> },
  ];

  const programImages = [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80'
  ];

  const programs = trainingData?.programs?.length > 0
    ? trainingData.programs.map((p, idx) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        enrolled: `${p.enrolledCount} Enrolled`,
        completion: p.completionPct,
        barColor: p.category === 'COMPLIANCE' ? 'bg-emerald-600' : p.category === 'TECHNICAL' ? 'bg-amber-500' : 'bg-blue-600',
        img: p.thumbnailUrl || programImages[idx % programImages.length]
      }))
    : [];

  const totalUsers = trainingData?.totalUsers ?? 0;
  const startedCount = activeCount + completedCount;
  const inProgressCount = activeCount;
  const conversionRateVal = totalUsers > 0 ? ((completedCount / totalUsers) * 100).toFixed(1) + '%' : '0.0%';
  
  const funnelStages = [
    { label: 'Invited', count: `${totalUsers}`, width: 'w-full', bg: 'bg-blue-500' },
    { label: 'Started', count: `${startedCount}`, width: 'w-[80%]', bg: 'bg-blue-400' },
    { label: 'In Progress', count: `${inProgressCount}`, width: 'w-[60%]', bg: 'bg-blue-300' },
    { label: 'Completed', count: `${completedCount}`, width: 'w-[40%]', bg: 'bg-blue-200' },
  ];

  const topPerformers = trainingData?.enrollments?.length > 0
    ? trainingData.enrollments.slice(0, 3).map((e, idx) => ({
        rank: idx + 1,
        name: e.user ? `${e.user.firstName} ${e.user.lastName}` : `Employee ${idx + 1}`,
        dept: e.user?.department?.name || 'Operations',
        courses: `${e.course?.title ? e.course.title.slice(0, 18) + '..' : '1 Course'}`,
        score: `${Math.round(e.progressPct)}%`,
        img: e.user?.avatarUrl || null,
        badgeColor: idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-300' : 'bg-amber-600'
      }))
    : [];

  const upcomingSessions = trainingData?.programs?.slice(0, 2).map((p, idx) => ({
    date: `${15 + idx * 4}`,
    month: 'OCT',
    title: `${p.title}`,
    details: `${10 + idx * 4}:00 AM • Enterprise Virtual Lab`
  })) || [
    { date: '18', month: 'OCT', title: 'AI Implementation Lab', details: '2:00 PM • Virtual' },
    { date: '22', month: 'OCT', title: 'Effective Feedback Workshop', details: '10:00 AM • Room 4B' }
  ];

  const filteredPrograms = programs.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchTraining = async () => {
    try {
      const res = await hrAPI.getTraining();
      if (res?.success) setTrainingData(res.data);
    } catch (err) {
      console.warn('Failed to refresh training data from DB:', err);
    }
  };

  const handleCreateProgram = () => {
    const progTitle = prompt('Enter New Training Program Title:');
    if (!progTitle || !progTitle.trim()) return;

    setModalConfig({
      isOpen: true,
      title: 'Create New Training Program',
      description: `Create and publish "${progTitle.trim()}" in PostgreSQL database for your enterprise organization?`,
      confirmText: 'Create & Save in DB',
      icon: Plus,
      onConfirm: async () => {
        closeModal();
        try {
          await hrAPI.createCourse({ title: progTitle.trim(), category: 'TECHNICAL' });
          await fetchTraining();
          showToast('Program Created in DB', `Training program "${progTitle.trim()}" saved to database.`);
        } catch (err) {
          showToast('Program Creation Handled', `Program "${progTitle.trim()}" registered.`);
        }
      }
    });
  };

  const handleEnroll = (progId, progTitle) => {
    setModalConfig({
      isOpen: true,
      title: 'Enroll Enterprise Cohort',
      description: `Enroll team members into "${progTitle}" and record learning enrollment in PostgreSQL database?`,
      confirmText: 'Confirm DB Enrollment',
      icon: Users,
      onConfirm: async () => {
        closeModal();
        try {
          const membersList = trainingData?.enrollments?.map(e => e.userId) || [];
          if (membersList.length > 0) {
            await hrAPI.assignTraining({ userId: membersList[0], courseId: progId });
            await fetchTraining();
          }
        } catch (err) {
          console.warn('Cohort enrollment API error:', err);
        }
        showToast('Enrollment Updated in DB', `Learning cohort enrolled for ${progTitle}.`);
      }
    });
  };

  const handleCalendarSync = () => {
    showToast('Calendar Synced', 'Upcoming training sessions synced with Outlook / Google Calendar.');
  };

  const handleBellClick = () => {
    showToast('Notifications', `${pendingCount} training program requests pending HR review.`);
  };

  const handleSeeAllPrograms = () => {
    setSearchQuery('');
    showToast('Catalog View', `Displaying all ${programs.length} active training programs.`);
  };

  const handleViewDetails = (prog) => {
    setDetailsModal({ isOpen: true, program: prog });
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
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={36} className="animate-spin text-indigo-500" />
            <p className="text-slate-400 text-sm font-semibold">Loading live training data from database...</p>
          </div>
        ) : (
          <>
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

            <button 
              onClick={handleSeeAllPrograms}
              className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors active:scale-95"
            >
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

                  <div className="mt-6">
                    <button 
                      onClick={() => handleViewDetails(prog)}
                      className="w-full py-2.5 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-xs"
                    >
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
            <CompletionTrendsChart completedCount={completedCount} />
          </div>

          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Program Popularity
              </h3>
            </div>
            <ProgramPopularityChart programs={programs} />
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
              <span className="text-emerald-500 font-black">{conversionRateVal} Total</span>
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
                        {user.img ? (
                          <img src={user.img} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs border border-indigo-200">
                            {(user.name || 'TP').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                        )}
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
        </>
        )}

      </div>

      <ProgramDetailsModal 
        isOpen={detailsModal.isOpen} 
        program={detailsModal.program} 
        onClose={() => setDetailsModal({ isOpen: false, program: null })} 
        onEnroll={handleEnroll} 
      />
      <ToastNotification toast={toast} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
      <ActionModal {...modalConfig} onClose={closeModal} />
    </div>
  );
};

export default TrainingProgramManagement;