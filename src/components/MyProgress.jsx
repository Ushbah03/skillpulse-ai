import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  Award, 
  Target,
  Search,
  Sparkles,
  Check,
  Loader2,
  X,
  RefreshCw,
  BookOpen,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { employeeAPI } from '../services/api';

const MyProgress = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Video Player Modal State
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'modules'
  const [completedModules, setCompletedModules] = useState([]);
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [isVideoWatched, setIsVideoWatched] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [useBackupStream, setUseBackupStream] = useState(false);

  const SKILL_FALLBACK_MAP = {
    'UI/UX Design': 'jwCmIBJ8Jtc',
    'Figma': 'c9Wg6Cb_YlU',
    'Canva': 'c9Wg6Cb_YlU',
    'Problem Solving': '9TycLR0TqFA',
    'React': 'bMknfKXIFA8',
    'Node.js': 'Oe421EPjeBE',
    'Cybersecurity': '3Kq1MIfTWCE',
    'Data Science': 'LHBE6Q9XlzI',
    'Python': 't8pPdKYpowI',
    'Docker': 'fqMOX6JJhGo',
    'AWS': 'k1RI5locZE4',
    'Git': '8JJ101D3knE',
    'CSS': 'dFgzHOX84xQ',
    'Java': '35EQXmHKZYs',
    'Rust': '5C_HPTJg5ek',
    'Vue.js': 'FXpIoQ_rT_c',
    'Angular': 'Ata9cSC2WpM'
  };

  const MODULE_CHAPTERS = [
    { id: 0, title: "Module 1: Core Fundamentals & Concept Walkthrough", desc: "Understanding industry standard design patterns and core principles.", duration: "25 mins" },
    { id: 1, title: "Module 2: Hands-On Workflow & Tool Optimization", desc: "Practical step-by-step implementation techniques and shortcut workflows.", duration: "30 mins" },
    { id: 2, title: "Module 3: Advanced Optimization & Error Handling", desc: "Troubleshooting edge cases, performance benchmarks, and clean architecture.", duration: "35 mins" },
    { id: 3, title: "Module 4: Practical Capstone Exercise & Gap Assessment", desc: "Final hands-on assignment submission to resolve the DB skill gap.", duration: "40 mins" }
  ];

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const workspaceName = storedUser.tenant?.name || 'Apex Tech Solutions Workspace';

  const loadProgress = async () => {
    try {
      setLoading(true);
      const [recsRes, gapsRes] = await Promise.allSettled([
        employeeAPI.getLearningRecs(),
        employeeAPI.getGaps()
      ]);

      if (recsRes.status === 'fulfilled' && recsRes.value?.success && Array.isArray(recsRes.value.data)) {
        // Enrolled courses only (progressPct > 0 or status ENROLLED/IN_PROGRESS/COMPLETED)
        const enrolledOnly = recsRes.value.data.filter(c => c.enrollmentStatus !== 'NOT_STARTED' || (c.progressPct && c.progressPct > 0));
        setCourses(enrolledOnly);
      }
      if (gapsRes.status === 'fulfilled' && gapsRes.value?.success && Array.isArray(gapsRes.value.data)) {
        setGaps(gapsRes.value.data);
      }
    } catch (err) {
      console.warn('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const handleLaunchCourse = (c) => {
    setActiveCourse(c);
    setActiveTab('video');
    const initialProgress = c.progressPct || 0;
    if (initialProgress >= 100) {
      setIsVideoWatched(true);
      setCompletedModules([0, 1, 2, 3]);
      setCurrentModuleIdx(3);
    } else if (initialProgress >= 75) {
      setIsVideoWatched(true);
      setCompletedModules([0, 1, 2]);
      setCurrentModuleIdx(3);
    } else if (initialProgress >= 50) {
      setIsVideoWatched(true);
      setCompletedModules([0, 1]);
      setCurrentModuleIdx(2);
    } else if (initialProgress >= 25) {
      setIsVideoWatched(true);
      setCompletedModules([0]);
      setCurrentModuleIdx(1);
    } else {
      setIsVideoWatched(false);
      setCompletedModules([]);
      setCurrentModuleIdx(0);
    }
  };

  const handleCompleteCurrentModuleVideo = async () => {
    let updatedModules = completedModules;
    if (!completedModules.includes(currentModuleIdx)) {
      updatedModules = [...completedModules, currentModuleIdx];
      setCompletedModules(updatedModules);
    }
    setIsVideoWatched(true);

    const newPct = Math.min(100, Math.round((updatedModules.length / 4) * 100));

    if (activeCourse?.id) {
      try {
        await employeeAPI.updateCourseProgress(activeCourse.id, newPct);
        setActiveCourse(prev => prev ? { ...prev, progressPct: newPct, enrollmentStatus: newPct >= 100 ? 'COMPLETED' : 'IN_PROGRESS' } : null);
        loadProgress();
      } catch (err) {
        console.error('Error syncing chapter progress to DB:', err);
      }
    }

    if (currentModuleIdx < 3) {
      setCurrentModuleIdx(prev => prev + 1);
    }
  };

  const getModuleVideoUrl = (rawUrl, modIdx) => {
    let videoId = 'jwCmIBJ8Jtc';

    if (useBackupStream && activeCourse) {
      const firstSkill = (Array.isArray(activeCourse.skillsTaught) && activeCourse.skillsTaught[0]) || '';
      videoId = SKILL_FALLBACK_MAP[firstSkill] || 'jwCmIBJ8Jtc';
    } else if (rawUrl) {
      let clean = rawUrl.replace('youtube-nocookie.com', 'youtube.com');
      const match = clean.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        videoId = match[1];
      }
    }

    const timestamps = [0, 600, 1500, 2400];
    const startSec = timestamps[modIdx] || 0;
    return `https://www.youtube.com/embed/${videoId}?start=${startSec}&autoplay=1`;
  };

  const handleCompleteCourse = async () => {
    if (!activeCourse) return;
    setUpdatingProgress(true);
    try {
      const res = await employeeAPI.updateCourseProgress(activeCourse.id, 100);
      if (res.success) {
        setToastMsg(`Course Completed! Skill Gap for "${activeCourse.title}" is resolved & verified in DB.`);
        setTimeout(() => setToastMsg(''), 5000);
        setActiveCourse(null);
        loadProgress();
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    c.provider?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const activeCoursesCount = courses.filter(c => c.progressPct < 100).length;
  const completedCoursesCount = courses.filter(c => c.progressPct >= 100).length;
  const totalHoursSpent = courses.reduce((acc, c) => acc + (c.durationHours || 10) * ((c.progressPct || 0) / 100), 0);

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded border border-blue-100">
              {workspaceName}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Learning Progress</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time course metrics, video progress, and PostgreSQL skill gap resolutions</p>
        </div>

        {/* High Contrast Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enrolled courses..." 
            className="w-full pl-11 pr-9 py-2.5 rounded-2xl border-2 border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 bg-white shadow-sm transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* DYNAMIC TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Clock className="text-blue-600 w-6 h-6" />} label="Learning Time" value={`${totalHoursSpent.toFixed(1)}h`} subtext="Accumulated Hours" />
        <StatCard icon={<Play className="text-indigo-600 w-6 h-6 fill-current" />} label="In-Progress" value={`${activeCoursesCount}`} subtext="Active Courses" />
        <StatCard icon={<CheckCircle2 className="text-emerald-600 w-6 h-6" />} label="Completed Courses" value={`${completedCoursesCount}`} subtext="100% Finished" />
        <StatCard icon={<Award className="text-amber-500 w-6 h-6" />} label="Resolved Skill Gaps" value={`${gaps.length === 0 ? 'All Clear' : `${gaps.length} Active`}`} subtext="PostgreSQL Verified" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Enrolled & Active Courses List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-slate-800">My Course Enrolments & Progress</h2>
            <button 
              onClick={() => navigate('/dashboard/learning')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((c) => {
              const pct = c.progressPct || 0;
              const isDone = c.enrollmentStatus === 'COMPLETED' || pct >= 100;

              return (
                <div key={c.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
                  <div className="flex gap-5 items-start flex-1">
                    <div className={`p-4 rounded-2xl border shrink-0 ${isDone ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                      {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                          isDone 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        }`}>
                          {isDone ? 'COMPLETED (100%)' : `IN PROGRESS (${pct}%)`}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-bold">
                          <Clock className="w-3.5 h-3.5" /> {c.durationHours || 12}h total
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{c.title}</h3>
                      <p className="text-xs text-slate-400 mb-4 font-medium">{c.provider || 'YouTube Educational LMS'}</p>
                      
                      {/* Visual Progress Bar */}
                      <div className="flex items-center gap-4">
                        <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-blue-600'}`} 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-700">{pct}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => handleLaunchCourse(c)}
                      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                        isDone
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                          : 'bg-[#0F172A] hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Review Course
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> Resume Player
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => navigate(`/dashboard/courses?id=${c.id}`)}
                      className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-2xl font-bold text-xs transition-colors text-center"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">No Enrolled Courses Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our catalog of 27 verified YouTube educational courses linked to your skill gaps.
              </p>
              <button 
                onClick={() => navigate('/dashboard/learning')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
              >
                Browse Learning Catalog
              </button>
            </div>
          )}
        </div>

        {/* Right Column: AI Skill Targets & Certificate Status */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full -mr-16 -mt-16"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> PostgreSQL Skill Verification
              </div>
              
              <h3 className="text-2xl font-black leading-tight">Skill Gap Resolution Engine</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Completing 100% courseware automatically deletes matching skill gaps and verifies your user skill profile in PostgreSQL DB.
              </p>
              
              <div className="space-y-3 pt-2">
                <SkillGainer label="Frontend & Responsive Web" status={completedCoursesCount > 0 ? "Resolved" : "In Progress"} />
                <SkillGainer label="Backend Microservices & Databases" status="PostgreSQL Verified" />
                <SkillGainer label="DevOps & Security Hardening" status="Target 4.5/5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Enterprise Credentials</h4>
                <p className="text-[11px] text-slate-400 font-medium">Digital certificates issued on 100% completion</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500 space-y-2">
              <div className="flex justify-between">
                <span>Verified Certificates:</span>
                <span className="font-bold text-slate-800">{completedCoursesCount} Issued</span>
              </div>
              <div className="flex justify-between">
                <span>Database Engine:</span>
                <span className="font-bold text-emerald-600">Neon PostgreSQL</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4-Chapter Video Player Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#0B1120] px-6 py-4 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                      {activeCourse.provider || 'YouTube Educational LMS'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• {activeCourse.durationHours || 12} Hours Courseware</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-tight mt-0.5">{activeCourse.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="bg-[#0B1120]/60 px-6 py-2 border-b border-slate-800/60 flex gap-4 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('video')}
                className={`py-2 px-3 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'video' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" /> 1. Video Lecture Player
              </button>
              <button
                onClick={() => setActiveTab('modules')}
                className={`py-2 px-3 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'modules' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> 2. AI Interactive Modules ({completedModules.length}/4)
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                    <iframe 
                      key={currentModuleIdx}
                      src={getModuleVideoUrl(activeCourse.externalUrl, currentModuleIdx)} 
                      title={activeCourse.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1120] p-5 rounded-2xl border border-slate-800/80 shadow-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                          Playing Chapter {currentModuleIdx + 1} of 4
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• {MODULE_CHAPTERS[currentModuleIdx]?.duration}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{MODULE_CHAPTERS[currentModuleIdx]?.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">{MODULE_CHAPTERS[currentModuleIdx]?.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={handleCompleteCurrentModuleVideo}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/30"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {completedModules.includes(currentModuleIdx)
                          ? `Chapter ${currentModuleIdx + 1} Completed`
                          : currentModuleIdx < 3
                            ? `Finish Chapter ${currentModuleIdx + 1} & Play Next`
                            : `Finish Final Chapter ${currentModuleIdx + 1}`}
                      </button>

                      <button
                        onClick={() => setUseBackupStream(prev => !prev)}
                        title="Click if primary YouTube video is unavailable"
                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          useBackupStream
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${useBackupStream ? 'animate-spin' : ''}`} />
                        {useBackupStream ? 'Backup Stream' : 'Switch Stream'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'modules' && (
                <div className="space-y-4">
                  {MODULE_CHAPTERS.map((mod, idx) => {
                    const isChecked = completedModules.includes(idx);
                    return (
                      <div 
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                          isChecked 
                            ? 'bg-[#0B1120] border-indigo-500/40 text-white shadow-lg' 
                            : 'bg-[#0B1120]/50 border-slate-800/60 text-slate-400'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 border ${
                          isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900 text-slate-600'
                        }`}>
                          {isChecked ? <Check className="w-4 h-4" /> : <Lock className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-sm text-white">{mod.title}</h5>
                          <p className="text-slate-400 text-xs mt-0.5">{mod.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-[#0F172A] p-5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Calculated Progress:</span>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${Math.round((completedModules.length / 4) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-indigo-400">{Math.round((completedModules.length / 4) * 100)}%</span>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setActiveCourse(null)}
                  className="px-5 py-2.5 bg-[#1E293B] hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
                >
                  Close Player
                </button>

                <button
                  onClick={handleCompleteCourse}
                  disabled={updatingProgress || !isVideoWatched}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25 border border-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingProgress && <Loader2 className="w-4 h-4 animate-spin" />}
                  {updatingProgress ? 'Verifying in DB...' : 'Complete Course & Clear Skill Gap'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// --- Helper Components ---
const StatCard = ({ icon, label, value, subtext }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 leading-tight mb-0.5">{value}</h3>
      <p className="text-slate-500 text-[10px] font-bold">{subtext}</p>
    </div>
  </div>
);

const SkillGainer = ({ label, status }) => (
  <div className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-2xl">
    <span className="text-xs font-bold text-slate-200">{label}</span>
    <span className="text-xs font-black text-emerald-400">{status}</span>
  </div>
);

export default MyProgress;