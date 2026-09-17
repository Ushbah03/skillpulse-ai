import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PlayCircle,
  Clock,
  Globe,
  Award,
  CheckCircle2,
  ChevronRight,
  Star,
  Users,
  Lock,
  ShieldCheck,
  Zap,
  Check,
  Loader2,
  Play,
  ExternalLink,
  RefreshCw,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Search,
  X
} from 'lucide-react';
import { employeeAPI } from '../services/api';

const CourseDetails = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const courseIdParam = searchParams.get('id');

  const [allCourses, setAllCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Course Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // Video Player Modal State
  const [showPlayer, setShowPlayer] = useState(false);
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
  const planTier = (storedUser.tenant?.plan || storedUser.tenant?.subscriptionTier || storedUser.tenant?.planTier || 'PRO').toUpperCase();
  const isLmsLocked = planTier === 'STARTER';

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const res = await employeeAPI.getLearningRecs();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAllCourses(res.data);
        const matched = courseIdParam 
          ? res.data.find(c => c.id === courseIdParam) 
          : res.data[0];
        setCourse(matched || res.data[0]);
      }
    } catch (err) {
      console.warn('Error loading course details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [courseIdParam]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCourse = (selectedId) => {
    setSearchParams({ id: selectedId });
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const filteredSearchCourses = allCourses.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const titleMatch = c.title?.toLowerCase().includes(q);
    const providerMatch = c.provider?.toLowerCase().includes(q);
    const skillsMatch = Array.isArray(c.skillsTaught) && c.skillsTaught.some(s => s.toLowerCase().includes(q));
    const levelMatch = c.level?.toLowerCase().includes(q);
    return titleMatch || providerMatch || skillsMatch || levelMatch;
  });

  const handleEnroll = async () => {
    if (!course) return;
    setIsEnrolling(true);
    try {
      const res = await employeeAPI.enrollCourse(course.id);
      if (res.success) {
        setToastMsg(`Successfully enrolled in "${course.title}"!`);
        setTimeout(() => setToastMsg(''), 4000);
        setCourse(prev => ({ ...prev, enrollmentStatus: 'ENROLLED', progressPct: 0 }));
        loadCourseData();
      }
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleLaunchPlayer = () => {
    if (!course) return;
    setShowPlayer(true);
    setActiveTab('video');
    const initialProgress = course.progressPct || 0;
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

    if (course?.id) {
      try {
        await employeeAPI.updateCourseProgress(course.id, newPct);
        setCourse(prev => prev ? { ...prev, progressPct: newPct, enrollmentStatus: newPct >= 100 ? 'COMPLETED' : 'IN_PROGRESS' } : null);
        loadCourseData();
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

    if (useBackupStream && course) {
      const firstSkill = (Array.isArray(course.skillsTaught) && course.skillsTaught[0]) || '';
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
    if (!course) return;
    setUpdatingProgress(true);
    try {
      const res = await employeeAPI.updateCourseProgress(course.id, 100);
      if (res.success) {
        setToastMsg(`Course Completed! Skill Gap for "${course.title}" is resolved & verified in DB.`);
        setTimeout(() => setToastMsg(''), 5000);
        setShowPlayer(false);
        loadCourseData();
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-blue-600" />
        <p className="text-slate-500 font-bold text-xs">Loading Course Specifications from Database...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-12 text-center text-slate-500">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Course details not found</h3>
        <button 
          onClick={() => navigate('/dashboard/learning')}
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md"
        >
          Return to Learning Catalog
        </button>
      </div>
    );
  }

  const progressPct = course.progressPct || 0;
  const isCompleted = course.enrollmentStatus === 'COMPLETED' || progressPct >= 100;
  const isInProgress = (progressPct > 0 && progressPct < 100);
  const isPending = course.enrollmentStatus === 'NOT_STARTED';
  const isEnrolled = course.enrollmentStatus === 'ENROLLED' || course.enrollmentStatus === 'IN_PROGRESS' || progressPct > 0;

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Top Header Controls & High-Contrast Course Search Bar */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/dashboard/learning')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-xs mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learning Catalog
          </button>

          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded border border-blue-100">{workspaceName}</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span>{course.provider || 'YouTube Educational LMS'}</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-blue-600 font-bold">{course.title}</span>
          </div>
        </div>

        {/* High-Contrast Interactive Course Search Bar */}
        <div className="relative flex-1 max-w-md" ref={searchRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search 27 courses (e.g. React, Figma, Node, AWS)..."
              className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border-2 border-slate-300 focus:border-blue-600 text-xs font-bold text-slate-800 focus:outline-none shadow-sm transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Floating Search Results Dropdown */}
          {showSearchDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-30 max-h-72 overflow-y-auto p-2">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex justify-between">
                <span>Matching Courses ({filteredSearchCourses.length})</span>
                <span>Click to Select</span>
              </div>
              {filteredSearchCourses.length > 0 ? (
                filteredSearchCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCourse(c.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      c.id === course.id ? 'bg-blue-50 text-blue-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="pr-3">
                      <p className="text-xs font-bold leading-snug">{c.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{c.provider || 'YouTube Educational LMS'} • {c.level || 'Intermediate'}</p>
                    </div>
                    <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded shrink-0">
                      {c.durationHours || 12}h
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                  No courses matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT CONTENT AREA */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero Banner Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                {course.provider || 'YouTube Educational LMS'}
              </span>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Verified Skill Match
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-2xl">
              {course.description || "Master industry standards and scale your system with advanced architecture blueprints."}
            </p>

            <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current text-amber-400" />
                <span className="font-black text-slate-800 text-sm">{course.rating || 4.9}</span>
                <span className="text-xs text-slate-400 font-medium">(2,450 ratings)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                <Users className="w-4 h-4 text-slate-400" />
                {course.level || 'Intermediate'} Level
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                <Clock className="w-4 h-4 text-slate-400" />
                {course.durationHours || 12} Hours Total
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                <Globe className="w-4 h-4 text-slate-400" />
                English (Auto-Subtitles)
              </div>
            </div>
          </div>

          {/* Skills Taught Section */}
          {Array.isArray(course.skillsTaught) && course.skillsTaught.length > 0 && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-800">Target Skills & Proficiency Boost</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {course.skillsTaught.map((skillName, idx) => (
                  <div key={idx} className="bg-indigo-50/80 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>{skillName}</span>
                    <span className="bg-indigo-200/60 text-indigo-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                      Target 4.5/5
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Curriculum Modules List */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Course Syllabus & Chapters</h3>
                <p className="text-xs text-slate-400 font-medium">4 Video Modules • Hands-on capstone project</p>
              </div>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                {progressPct}% Completed
              </span>
            </div>

            <div className="space-y-3">
              {MODULE_CHAPTERS.map((mod, idx) => {
                const isModDone = (progressPct >= (idx + 1) * 25);
                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      isModDone 
                        ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-800'
                        : 'bg-slate-50/50 border-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isModDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isModDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-800">{mod.title}</h5>
                        <p className="text-[11px] text-slate-400 font-medium">{mod.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-bold text-slate-400">{mod.duration}</span>
                      {isEnrolled && (
                        <button
                          onClick={handleLaunchPlayer}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Play className="w-3 h-3 fill-current" /> Play
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learning Objectives Grid */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">What you'll learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ObjectiveCard text="Integrate scalable software design parameters and architectural patterns." />
              <ObjectiveCard text="Establish clean zero-trust security models for cloud-native microservices." />
              <ObjectiveCard text="Automate CI/CD deployment scripts using enterprise pipelines." />
              <ObjectiveCard text="Fulfill critical performance readiness benchmarks to clear DB skill gaps." />
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR CARD (STATIONARY PREVIEW & PLAYER CONTROLS) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl sticky top-8">
            
            {/* Dark Video Preview Thumbnail */}
            <div className="relative bg-slate-900 rounded-2xl h-48 overflow-hidden mb-6 flex items-center justify-center group cursor-pointer" onClick={isEnrolled ? handleLaunchPlayer : handleEnroll}>
              <img 
                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60'} 
                alt={course.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

              <div className="relative z-10 w-14 h-14 bg-indigo-600/90 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>

              <span className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">
                Interactive Video Player
              </span>
            </div>

            {/* Lifecycle Status & Progress Display */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Course Status</span>
                {isCompleted ? (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> COMPLETED
                  </span>
                ) : isInProgress ? (
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> IN PROGRESS ({progressPct}%)
                  </span>
                ) : isPending ? (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> PENDING APPROVAL
                  </span>
                ) : isEnrolled ? (
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> ENROLLED
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-slate-200">
                    OPEN FOR ENROLLMENT
                  </span>
                )}
              </div>

              {/* Progress Bar for Enrolled Courses */}
              {isEnrolled && (
                <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-600 mb-1">
                    <span>Overall Progress</span>
                    <span className="text-indigo-600 font-black">{progressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPct}%` }} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <div className="space-y-3 mb-6">
              {isLmsLocked ? (
                <button 
                  onClick={handleLaunchPlayer}
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-amber-500/10 text-amber-700 border border-amber-200 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-600" /> Upgrade Plan to Access
                </button>
              ) : isCompleted ? (
                <button 
                  onClick={handleLaunchPlayer}
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Course Completed (Review)
                </button>
              ) : isInProgress ? (
                <button 
                  onClick={handleLaunchPlayer}
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Continue Course ({progressPct}%)
                </button>
              ) : isPending ? (
                <button 
                  disabled
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-amber-600" /> Request Pending Leader Approval
                </button>
              ) : isEnrolled ? (
                <button 
                  onClick={handleLaunchPlayer}
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Course Player
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isEnrolling && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEnrolling ? 'Submitting Request...' : 'Request Enrollment'}
                </button>
              )}
            </div>

            {/* Course Features Guarantee */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <FeatureItem text="100% Verified YouTube Video Stream" />
              <FeatureItem text="PostgreSQL DB Progress Persistence" />
              <FeatureItem text="Automated Skill Gap Clearance upon 100%" />
              <FeatureItem text="Official Enterprise Credential Certificate" />
            </div>

          </div>
        </div>

      </div>

      {/* 4-Chapter Video Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Top Header Bar */}
            <div className="bg-[#0B1120] px-6 py-4 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                      {course.provider || 'YouTube Educational LMS'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• {course.durationHours || 12} Hours Courseware</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-tight mt-0.5">{course.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowPlayer(false)}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Sub-Header Tabs */}
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

            {/* Player Main Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'video' && (
                <div className="space-y-4">
                  
                  {/* Embedded Iframe Player */}
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                    <iframe 
                      key={currentModuleIdx}
                      src={getModuleVideoUrl(course.externalUrl, currentModuleIdx)} 
                      title={course.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Chapter Control Bar */}
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
                  onClick={() => setShowPlayer(false)}
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

const ObjectiveCard = ({ text }) => (
  <div className="flex gap-3 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
    <p className="text-slate-600 text-xs font-bold leading-relaxed">{text}</p>
  </div>
);

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
    <span>{text}</span>
  </div>
);

export default CourseDetails;