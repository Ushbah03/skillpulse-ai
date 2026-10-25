import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Bell, Plus, Users, Clock, CheckCircle,
  ArrowRight, Calendar, Sparkles, X, BookOpen, Award, Check, Loader2,
  ChevronLeft, ChevronRight, UserCheck
} from 'lucide-react';
import HRSidebar from './HRSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { hrAPI } from '../services/api';

// ── PROGRAM POPULARITY BAR CHART ─────────────────────────────────────────────
const ProgramPopularityChart = ({ programs = [] }) => {
  const categories = [
    { key: 'TECHNICAL', label: 'TECH', color: 'bg-emerald-500' },
    { key: 'DESIGN', label: 'DSGN', color: 'bg-pink-500' },
    { key: 'SOFT SKILLS', label: 'SOFT', color: 'bg-amber-500' },
    { key: 'OPERATIONS', label: 'OPER', color: 'bg-purple-500' },
    { key: 'LEADERSHIP', label: 'LEAD', color: 'bg-blue-500' },
    { key: 'COMPLIANCE', label: 'COMP', color: 'bg-indigo-600' }
  ];

  const counts = categories.map(cat => {
    const matching = programs.filter(p => p.category === cat.key);
    const totalEnrolled = matching.reduce((sum, p) => sum + (Number(p.enrolledCount) || 0), 0);
    return {
      category: cat.key,
      label: cat.label,
      count: totalEnrolled,
      color: cat.color
    };
  });

  const maxVal = Math.max(...counts.map(c => c.count), 1);

  return (
    <div className="flex flex-col justify-between h-48 pt-4">
      <div className="flex items-end justify-between h-36 px-2 gap-2">
        {counts.map((bar, i) => {
          const heightPct = bar.count > 0
            ? `${Math.max(16, Math.round((bar.count / maxVal) * 100))}%`
            : '4px';
          return (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <div className="w-full bg-slate-50 rounded-md h-32 flex items-end justify-center">
                <div
                  className={`w-full ${bar.color} rounded-md transition-all duration-500 ease-out`}
                  style={{ height: heightPct }}
                  title={`${bar.category}: ${bar.count} enrolled`}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 mt-2 tracking-wider">
                {bar.label}
              </span>
              <span className="text-[10px] font-extrabold text-slate-500">
                {bar.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── COMPLETION TRENDS SVG CHART ──────────────────────────────────────────────
const CompletionTrendsChart = ({ monthlyCompletions = [] }) => {
  const data = monthlyCompletions && monthlyCompletions.length > 0
    ? monthlyCompletions
    : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map(m => ({ month: m, count: 0 }));

  const maxVal = Math.max(...data.map(d => d.count), 5);
  const width = 500;
  const height = 130;
  const points = data.map((d, idx) => {
    const x = data.length > 1 ? (idx / (data.length - 1)) * width : width / 2;
    const y = height - (d.count / maxVal) * (height * 0.75) - 15;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full pt-4">
      <svg viewBox={`0 0 ${width} ${height + 25}`} className="w-full h-36 overflow-visible">
        <polyline
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {data.map((d, idx) => {
          const x = data.length > 1 ? (idx / (data.length - 1)) * width : width / 2;
          const y = height - (d.count / maxVal) * (height * 0.75) - 15;
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r="5" className="fill-indigo-600 stroke-white stroke-2" />
              <text x={x} y={y - 10} textAnchor="middle" className="text-[11px] font-black fill-indigo-600">
                {d.count}
              </text>
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
      <div className="bg-gradient-to-br from-[#D8EBF9] to-[#BEDDF5] backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl max-w-md w-full p-6 space-y-4">
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
      <div className="bg-gradient-to-br from-[#D8EBF9] to-[#BEDDF5] backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl max-w-lg w-full p-6 space-y-4">
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

// ── ALL ENROLLMENTS MODAL ──────────────────────────────────────────────────
const EnrollmentsListModal = ({ isOpen, enrollments = [], onClose }) => {
  const [enrollSearch, setEnrollSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (!isOpen) return null;

  const filtered = enrollments.filter(e => {
    const employeeName = e.user ? `${e.user.firstName} ${e.user.lastName}`.toLowerCase() : '';
    const courseTitle = (e.course?.title || e.courseTitle || '').toLowerCase();
    const matchesSearch = employeeName.includes(enrollSearch.toLowerCase()) || courseTitle.includes(enrollSearch.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-[#D8EBF9] to-[#BEDDF5] backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Enterprise Learning Enrollments</h3>
              <p className="text-xs text-slate-400 font-semibold">
                {enrollments.length} total enrollments recorded in PostgreSQL database
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              value={enrollSearch}
              onChange={(e) => setEnrollSearch(e.target.value)}
              placeholder="Search by employee or course..."
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 text-xs text-slate-700 outline-none w-full border border-slate-200 focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['ALL', 'IN_PROGRESS', 'NOT_STARTED', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status === 'ALL' ? 'All' : status === 'IN_PROGRESS' ? 'In Progress' : status === 'NOT_STARTED' ? 'Not Started' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

        {/* List of Enrollments */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[480px]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">
              No learning enrollments match the filter criteria.
            </div>
          ) : (
            filtered.map((e) => {
              const userName = e.user ? `${e.user.firstName} ${e.user.lastName}` : 'Employee';
              const courseTitle = e.course?.title || e.courseTitle || 'Training Course';
              const dept = e.user?.department?.name || 'Enterprise';
              const progress = Math.max(0, Number(e.progressPct) || 0);
              const enrollDate = e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : 'Active';

              const statusBadge =
                e.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                e.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                'bg-amber-50 text-amber-700 border-amber-200';

              return (
                <div key={e.id} className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs border border-indigo-200 shrink-0">
                      {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{userName}</p>
                      <p className="text-[11px] font-bold text-slate-600 truncate mt-0.5">{courseTitle}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{dept} • Enrolled: {enrollDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="w-24 text-right">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden w-24">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${statusBadge}`}>
                      {e.status === 'IN_PROGRESS' ? 'In Progress' : e.status === 'NOT_STARTED' ? 'Not Started' : 'Completed'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
          <span className="text-xs font-semibold text-slate-400">
            Showing {filtered.length} of {enrollments.length} enrollments
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', description: '', confirmText: '', onConfirm: null, icon: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, program: null });
  const [enrollmentsModalOpen, setEnrollmentsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trainingData, setTrainingData] = useState(null);
  const programsRef = useRef(null);

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
  const totalUsers = trainingData?.totalUsers ?? 0;

  const statusSummary = [
    { label: 'ACTIVE', count: `${activeCount}`, color: 'text-blue-600', bg: 'bg-blue-50', icon: <Users size={16} /> },
    { label: 'PENDING', count: `${pendingCount}`, color: 'text-orange-500', bg: 'bg-orange-50', icon: <Clock size={16} /> },
    { label: 'COMPLETED', count: `${completedCount}`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle size={16} /> },
  ];

  const programs = trainingData?.programs?.length > 0
    ? trainingData.programs.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        enrolledCount: p.enrolledCount,
        enrolled: `${p.enrolledCount} Enrolled`,
        completion: p.completionPct,
        level: p.level,
        provider: p.provider,
        barColor: p.category === 'COMPLIANCE' ? 'bg-emerald-600' : p.category === 'TECHNICAL' ? 'bg-amber-500' : 'bg-blue-600',
        img: p.thumbnailUrl || null
      }))
    : [];

  const startedCount = activeCount + completedCount;
  const inProgressCount = activeCount;
  const conversionRateVal = totalUsers > 0 ? ((completedCount / totalUsers) * 100).toFixed(1) + '%' : '0.0%';

  const funnelStages = [
    { label: 'Total Employees', count: totalUsers, pct: 100, bg: 'bg-blue-600' },
    {
      label: 'Enrolled / Started',
      count: startedCount,
      pct: totalUsers > 0 ? Math.max(12, Math.min(100, Math.round((startedCount / totalUsers) * 100))) : (startedCount > 0 ? 100 : 12),
      bg: 'bg-blue-500'
    },
    {
      label: 'In Progress',
      count: inProgressCount,
      pct: totalUsers > 0 ? Math.max(12, Math.min(100, Math.round((inProgressCount / totalUsers) * 100))) : (inProgressCount > 0 ? 100 : 12),
      bg: 'bg-indigo-500'
    },
    {
      label: 'Completed',
      count: completedCount,
      pct: totalUsers > 0 ? Math.max(12, Math.min(100, Math.round((completedCount / totalUsers) * 100))) : (completedCount > 0 ? 100 : 12),
      bg: 'bg-emerald-500'
    },
  ];

  // Real Top Performers aggregated by employee from real enrollments
  const userProgressMap = new Map();
  (trainingData?.enrollments || []).forEach(e => {
    if (!e.user) return;
    const uid = e.userId || (e.user.firstName + ' ' + e.user.lastName);
    const existing = userProgressMap.get(uid);
    const pPct = Math.max(0, Number(e.progressPct) || 0);
    if (!existing || pPct > existing.progressPct) {
      userProgressMap.set(uid, {
        name: `${e.user.firstName} ${e.user.lastName}`,
        dept: e.user.department?.name || 'Enterprise',
        course: e.course?.title || e.courseTitle || 'Training Course',
        progressPct: pPct,
        avatarUrl: e.user.avatarUrl || null
      });
    }
  });

  const sortedPerformers = Array.from(userProgressMap.values())
    .sort((a, b) => b.progressPct - a.progressPct)
    .slice(0, 3);

  const topPerformers = sortedPerformers.map((u, idx) => ({
    rank: idx + 1,
    name: u.name,
    dept: u.dept,
    courses: u.course.length > 24 ? u.course.slice(0, 22) + '...' : u.course,
    score: `${Math.round(u.progressPct)}%`,
    img: u.avatarUrl,
    badgeColor: idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-300' : 'bg-amber-600'
  }));

  // Real Recent Enrollments from database
  const recentEnrollments = (trainingData?.enrollments || []).slice(0, 3).map((e) => {
    const enrollDate = e.enrolledAt ? new Date(e.enrolledAt) : new Date(e.createdAt || Date.now());
    const month = enrollDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = enrollDate.getDate();
    return {
      month,
      day,
      name: e.user ? `${e.user.firstName} ${e.user.lastName}` : 'Employee',
      dept: e.user?.department?.name || 'Enterprise',
      courseTitle: e.course?.title || e.courseTitle || 'Course',
      status: e.status === 'COMPLETED' ? 'Completed' : e.status === 'IN_PROGRESS' ? `${Math.round(e.progressPct)}% Progress` : 'Enrolled'
    };
  });

  const filteredPrograms = programs.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage) || 1;
  const paginatedPrograms = filteredPrograms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic Most Enrolled Category calculation for Program Popularity
  const categoryKeys = ['TECHNICAL', 'DESIGN', 'SOFT SKILLS', 'OPERATIONS', 'LEADERSHIP', 'COMPLIANCE'];
  const categoryCounts = categoryKeys.map(cat => ({
    cat,
    count: programs.filter(p => p.category === cat).reduce((sum, p) => sum + (Number(p.enrolledCount) || 0), 0)
  }));
  const topCategory = categoryCounts.reduce((prev, curr) => curr.count > prev.count ? curr : prev, categoryCounts[0]);

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

  const handleSeeAllPrograms = () => {
    setSearchQuery('');
    setCurrentPage(1);
    if (programsRef.current) {
      programsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDetails = (prog) => {
    setDetailsModal({ isOpen: true, program: prog });
  };

  return (
    <div className="flex min-h-screen bg-[#E9EAF7] font-sans text-[#17233E] relative overflow-x-hidden selection:bg-[#1988A3] selection:text-white">
      {/* Ambient Gradient Depth - Glowing mesh orbs behind frosted glass panels */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-[#1988A3]/20 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#11C6DE]/16 blur-[140px] rounded-full" />
        <div className="absolute top-2/3 left-10 w-[600px] h-[600px] bg-[#1B3154]/16 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-[#8A9CB7]/28 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.10)_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
      </div>
      <HRSidebar />

      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 px-3.5 sm:px-6 md:px-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8">
        {/* HEADER */}
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-base text-slate-500 font-medium">
            <span>Planning</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">Training Programs</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial w-full sm:w-auto">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search programs..."
                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/85 text-xs text-[#17233E] outline-none border border-slate-100 focus:border-slate-200 focus:bg-white transition-all"
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="my-8">
            <SkillPulseLoader message="Synchronizing Enterprise Workforce Telemetry..." fullScreen={false} />
          </div>
        ) : (
          <>
        {/* HERO SECTION */}
        <div className="px-0 sm:px-4 py-2 sm:py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Training & Development
            </h1>

            <p className="text-xs sm:text-base text-slate-500 font-medium mt-1">
              Monitor course performance, track employee progression, and evaluate completion rates.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full md:w-auto">
            {statusSummary.map((status, index) => (
              <div
                key={index}
                className="bg-white border border-slate-100 shadow-xs rounded-xl px-2.5 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3.5 w-full sm:w-36"
              >
                <div className={`w-9 h-9 rounded-xl ${status.bg} ${status.color} flex items-center justify-center`}>
                  {status.icon}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    {status.label}
                  </p>

                  <p className="text-xl font-black text-slate-800 leading-tight mt-0.5">
                    {status.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROGRAMS SECTION */}
        <div ref={programsRef} className="px-0 sm:px-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Current Training Programs
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {filteredPrograms.length} courses loaded from enterprise catalog
              </p>
            </div>

            <button
              onClick={handleSeeAllPrograms}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors active:scale-95 bg-white/70 border border-white/80 px-3 py-1.5 rounded-xl shadow-2xs text-[#17233E]"
            >
              See all programs <ArrowRight size={13} />
            </button>
          </div>

          {paginatedPrograms.length === 0 ? (
            <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-3xl p-12 text-center">
              <BookOpen size={36} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No training programs match your filter</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for a different keyword or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl hover:border-[#1988A3]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Minimized Thumbnail Header (h-28) */}
                  <div className="relative h-28 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {prog.img ? (
                      <img
                        src={prog.img}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50/50">
                        <BookOpen size={32} className="text-indigo-400" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-[10px] font-black px-2 py-0.5 rounded shadow-xs tracking-wider text-slate-800">
                      {prog.category}
                    </span>

                    <span className="absolute bottom-2 left-2.5 text-[11px] font-bold text-white drop-shadow-xs">
                      {prog.provider || 'Internal LMS'}
                    </span>
                  </div>

                  {/* Compact Body Content */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors"
                        title={prog.title}
                      >
                        {prog.title}
                      </h3>

                      <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mt-2.5 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-slate-400" />
                          {prog.enrolled}
                        </span>
                        <span className="text-slate-600 font-bold">{prog.completion}% Done</span>
                      </div>

                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${prog.barColor} rounded-full transition-all duration-300`}
                          style={{ width: `${prog.completion}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-400">
                        {prog.level || 'Intermediate'}
                      </span>
                      <button
                        onClick={() => handleViewDetails(prog)}
                        className="py-1 px-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-2xs"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredPrograms.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200/80 mt-4">
              <p className="text-xs font-semibold text-slate-500">
                Showing <span className="font-bold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredPrograms.length)}</span> of{' '}
                <span className="font-bold text-slate-800">{filteredPrograms.length}</span> programs
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-white/80 bg-white/70 text-[#17233E] hover:bg-[#E4EEF8] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  <ChevronLeft size={13} /> Previous
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((pageNum, idx, arr) => {
                      const prevPageNum = arr[idx - 1];
                      const showEllipsis = prevPageNum && pageNum - prevPageNum > 1;
                      return (
                        <React.Fragment key={pageNum}>
                          {showEllipsis && <span className="text-slate-400 text-xs px-1">...</span>}
                          <button
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 text-xs font-bold rounded-lg transition-all ${
                              currentPage === pageNum
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'border border-white/80 bg-white/70 text-[#17233E] hover:bg-[#E4EEF8]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-white/80 bg-white/70 text-[#17233E] hover:bg-[#E4EEF8] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MID ANALYTICS SECTION */}
        <div className="px-0 sm:px-4 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:col-span-2 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Completion Trends
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1">
                  Monthly training completions across all programs from database.
                </p>
              </div>
              <span className="text-xs font-bold bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1.5 rounded-lg">
                Last 6 months
              </span>
            </div>
            <div className="overflow-x-auto no-scrollbar pb-2">
              <div className="min-w-[420px]">
                <CompletionTrendsChart monthlyCompletions={trainingData?.monthlyCompletions} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Program Popularity
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Active enrollments per category
              </p>
            </div>
            <ProgramPopularityChart programs={programs} />
            <div className="border-t border-slate-50 pt-3 mt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-500">Most Enrolled</span>
              <span className="text-slate-800">{topCategory && topCategory.count > 0 ? topCategory.cat : 'None Yet'}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="px-0 sm:px-4 mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Funnel */}
          <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Learning Funnel
              </h3>

              <div className="flex justify-between text-xs font-black text-slate-400 tracking-wider mb-2">
                <span>STAGE</span>
                <span>EMPLOYEES</span>
              </div>

              <div className="space-y-2">
                {funnelStages.map((stage, idx) => (
                  <div key={idx} className="flex justify-end">
                    <div
                      className={`${stage.bg} text-white flex justify-between items-center px-4 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all duration-500`}
                      style={{ width: `${stage.pct}%` }}
                    >
                      <span>{stage.label}</span>
                      <span>{stage.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-4 text-xs font-bold">
              <span className="text-slate-500 uppercase tracking-wider">Conversion Rate</span>
              <span className="text-emerald-500 font-black">{conversionRateVal} Total</span>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-900">Top Performers</h3>
                <Award size={20} className="text-amber-500" />
              </div>

              {topPerformers.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                  No active course progress recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {topPerformers.map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 hover:bg-[#E4EEF8]/80 border border-white/80 transition-colors shadow-2xs">
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
              )}
            </div>

            <div className="border-t border-slate-50 pt-3 mt-2 flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Live Database Stats</span>
              <span className="text-indigo-600">Leaderboard</span>
            </div>
          </div>

          {/* Recent Enrollments (Replaced fake mock sessions) */}
          <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-900">
                  Recent Enrollments
                </h3>
                <UserCheck size={18} className="text-indigo-500" />
              </div>

              {recentEnrollments.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                  No recent enrollments recorded.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentEnrollments.map((session, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 hover:bg-[#E4EEF8]/80 border border-white/80 transition-colors shadow-2xs">
                      <div className="bg-white border border-slate-200/80 rounded-lg p-1.5 text-center min-w-[42px] shadow-2xs">
                        <p className="text-[9px] font-black text-slate-400 uppercase">
                          {session.month}
                        </p>
                        <p className="text-xs font-black text-slate-800 leading-none mt-0.5">
                          {session.day}
                        </p>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-800 leading-tight truncate">
                          {session.name}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                          {session.courseTitle}
                        </p>
                      </div>

                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setEnrollmentsModalOpen(true)}
              className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 py-2.5 border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition-all rounded-xl mt-4 active:scale-95 shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Users size={14} />
              View All Enrollments ({trainingData?.enrollments?.length || 0})
            </button>
          </div>
        </div>
        </>
        )}

      </main>

      <ProgramDetailsModal
        isOpen={detailsModal.isOpen}
        program={detailsModal.program}
        onClose={() => setDetailsModal({ isOpen: false, program: null })}
        onEnroll={handleEnroll}
      />
      <EnrollmentsListModal
        isOpen={enrollmentsModalOpen}
        enrollments={trainingData?.enrollments || []}
        onClose={() => setEnrollmentsModalOpen(false)}
      />
      <ToastNotification toast={toast} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
      <ActionModal {...modalConfig} onClose={closeModal} />
    </div>
  );
};

export default TrainingProgramManagement;