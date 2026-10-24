import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Clock, Globe, Award, CheckCircle2, ChevronRight, Star, Users, Lock, ShieldCheck, Zap, Check, Loader2, Play, BookOpen, Sparkles, ArrowLeft, Search, X, XCircle, Video
} from 'lucide-react';
import { employeeAPI } from '../services/api';
import SkillPulseLoader from './SkillPulseLoader';

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
  const workspaceName = storedUser.tenant?.name || 'Enterprise Corp Workspace';
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
        setToastMsg(res.message || `Training request for "${course.title}" submitted for approval!`);
        setTimeout(() => setToastMsg(''), 4500);
        await loadCourseData();
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
    return <SkillPulseLoader message="Loading Course Specifications..." />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-transparent p-12 text-center text-[#5A6D89]">
        <h3 className="text-xl font-bold text-[#17233E] mb-2">Course details not found</h3>
        <button 
          onClick={() => navigate('/dashboard/learning')}
          className="mt-4 px-6 py-2.5 bg-[#17233E] hover:bg-[#1988A3] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
        >
          Return to Learning Catalog
        </button>
      </div>
    );
  }

  const progressPct = course.progressPct || 0;
  const isRejected = course.isRejected || course.enrollmentStatus === 'REJECTED' || course.enrollmentStatus === 'DENIED' || progressPct === -1.0;
  const isCompleted = !isRejected && (course.enrollmentStatus === 'COMPLETED' || progressPct >= 100);
  const isInProgress = !isRejected && (progressPct > 0 && progressPct < 100);
  const isPending = !isRejected && (course.isPending || course.enrollmentStatus === 'NOT_STARTED' || course.enrollmentStatus === 'PENDING');
  const isApproved = !isRejected && (course.isApproved || course.enrollmentStatus === 'ENROLLED' || course.enrollmentStatus === 'IN_PROGRESS' || progressPct > 0);
  const isEnrolled = isApproved || isCompleted || isInProgress;
  const approvalTarget = course.approvalTarget || (course.hasTeam ? 'Leader' : 'HR');

  return (
    <div className="bg-transparent min-h-screen p-6 md:p-8 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#17233E] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#1988A3]/40">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#11C6DE]" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Top Header Controls & Search */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/dashboard/learning')}
            className="flex items-center gap-2 text-[#5A6D89] hover:text-[#17233E] font-bold text-xs mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learning Catalog
          </button>

          <div className="flex items-center gap-2 text-[10px] font-black text-[#5A6D89] uppercase tracking-widest">
            <span className="bg-[#1988A3]/10 text-[#1988A3] px-2.5 py-0.5 rounded border border-[#1988A3]/25">{workspaceName}</span>
            <ChevronRight className="w-3 h-3 text-[#8A9CB7]" />
            <span>{course.provider || 'YouTube Educational LMS'}</span>
            <ChevronRight className="w-3 h-3 text-[#8A9CB7]" />
            <span className="text-[#1988A3] font-bold">{course.title}</span>
          </div>
        </div>

        {/* High-Contrast Interactive Course Search Bar */}
        <div className="relative flex-1 max-w-md" ref={searchRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#8A9CB7] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search courses (e.g. React, Figma, Node, AWS)..."
              className="w-full pl-10 pr-9 py-2.5 bg-white/70 backdrop-blur-md rounded-2xl border border-[#8A9CB7]/30 focus:border-[#1988A3] text-xs font-bold text-[#17233E] focus:outline-none shadow-sm transition-all placeholder:text-[#8A9CB7]"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }}
                className="absolute right-3 text-[#8A9CB7] hover:text-[#17233E]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {showSearchDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl border border-[#8A9CB7]/30 shadow-2xl z-30 max-h-72 overflow-y-auto p-2">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#5A6D89] border-b border-[#8A9CB7]/15 mb-1 flex justify-between">
                <span>Matching Courses ({filteredSearchCourses.length})</span>
                <span>Click to Select</span>
              </div>
              {filteredSearchCourses.length > 0 ? (
                filteredSearchCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCourse(c.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      c.id === course.id ? 'bg-[#1988A3]/15 text-[#1988A3] font-black' : 'hover:bg-slate-50 text-[#17233E]'
                    }`}
                  >
                    <div className="pr-3">
                      <p className="text-xs font-bold leading-snug">{c.title}</p>
                      <p className="text-[10px] text-[#8A9CB7] font-medium mt-0.5">{c.provider || 'YouTube Educational LMS'} • {c.level || 'Intermediate'}</p>
                    </div>
                    <span className="text-[10px] font-black bg-[#17233E]/5 text-[#5A6D89] px-2 py-0.5 rounded shrink-0">
                      {c.durationHours || 12}h
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#5A6D89] font-medium">
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
          <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#17233E]/5 text-[#17233E] text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                {course.provider || 'YouTube Educational LMS'}
              </span>
              <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 border border-emerald-500/20">
                <Sparkles className="w-3 h-3 text-[#1988A3]" /> AI Verified Skill Match
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-[#17233E] mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-[#5A6D89] text-sm font-medium leading-relaxed mb-8 max-w-2xl">
              {course.description || "Master industry standards and scale your system with advanced architecture blueprints."}
            </p>

            <div className="flex flex-wrap items-center gap-6 border-t border-[#8A9CB7]/20 pt-6">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current text-amber-400" />
                <span className="font-black text-[#17233E] text-sm">{course.rating || 4.9}</span>
                <span className="text-xs text-[#8A9CB7] font-medium">(2,450 ratings)</span>
              </div>
              <div className="flex items-center gap-2 text-[#5A6D89] text-xs font-bold">
                <Users className="w-4 h-4 text-[#8A9CB7]" />
                {course.level || 'Intermediate'} Level
              </div>
              <div className="flex items-center gap-2 text-[#5A6D89] text-xs font-bold">
                <Clock className="w-4 h-4 text-[#8A9CB7]" />
                {course.durationHours || 12} Hours Total
              </div>
              <div className="flex items-center gap-2 text-[#5A6D89] text-xs font-bold">
                <Globe className="w-4 h-4 text-[#8A9CB7]" />
                English (Auto-Subtitles)
              </div>
            </div>
          </div>

          {/* Skills Taught Section */}
          {Array.isArray(course.skillsTaught) && course.skillsTaught.length > 0 && (
            <div className="glass-panel p-8 rounded-[2.5rem]">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-[#17233E]">Target Skills & Proficiency Boost</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {course.skillsTaught.map((skillName, idx) => (
                  <div key={idx} className="bg-[#1988A3]/10 border border-[#1988A3]/25 text-[#17233E] px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#1988A3]" />
                    <span>{skillName}</span>
                    <span className="bg-[#1988A3] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      Target 4.5/5
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Curriculum Modules List */}
          <div className="glass-panel p-8 rounded-[2.5rem] space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg md:text-xl font-black text-[#17233E]">Course Syllabus & Chapters</h3>
                <p className="text-xs text-[#5A6D89] font-medium">4 Video Modules • Hands-on capstone project</p>
              </div>
              <span className="text-xs font-black text-[#1988A3] bg-[#1988A3]/10 px-3 py-1 rounded-full border border-[#1988A3]/20">
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
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-[#17233E]'
                        : 'bg-white/70 border-[#8A9CB7]/25 text-[#5A6D89]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isModDone ? 'bg-emerald-600 text-white' : 'bg-[#17233E]/10 text-[#17233E]'
                      }`}>
                        {isModDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-[#17233E]">{mod.title}</h5>
                        <p className="text-[11px] text-[#5A6D89] font-medium">{mod.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-bold text-[#8A9CB7]">{mod.duration}</span>
                      {isEnrolled && (
                        <button
                          onClick={handleLaunchPlayer}
                          className="px-3 py-1.5 rounded-lg bg-[#17233E] hover:bg-[#1988A3] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
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
          <div className="glass-panel p-8 rounded-[2.5rem]">
            <h3 className="text-lg md:text-xl font-black text-[#17233E] mb-6">What you'll learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ObjectiveCard text="Integrate scalable software design parameters and architectural patterns." />
              <ObjectiveCard text="Establish clean zero-trust security models for cloud-native microservices." />
              <ObjectiveCard text="Automate CI/CD deployment scripts using enterprise pipelines." />
              <ObjectiveCard text="Fulfill critical performance readiness benchmarks to clear DB skill gaps." />
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR CARD */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-[2.5rem] sticky top-8">
            
            {/* Dark Video Preview Thumbnail */}
            <div className="relative bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#121E33] rounded-2xl h-48 overflow-hidden mb-6 flex items-center justify-center group cursor-pointer" onClick={isEnrolled ? handleLaunchPlayer : handleEnroll}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 text-[#17233E] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-0.5 text-[#1988A3]" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 bg-[#17233E]/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Course Preview
              </span>
            </div>

            {/* Lifecycle Status & Primary Action */}
            <div className="space-y-4">
              {isLmsLocked ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
                  <p className="text-xs font-bold text-amber-700 mb-2">Requires Growth or Enterprise Tier</p>
                  <button 
                    onClick={handleLaunchPlayer}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    View Plan Upgrade Details
                  </button>
                </div>
              ) : isCompleted ? (
                <div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center gap-2 mb-3 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Skill Gap Cleared & Verified in Database!</span>
                  </div>
                  <button 
                    onClick={handleLaunchPlayer}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Play className="w-4 h-4 fill-current" /> Review Course Lessons
                  </button>
                </div>
              ) : isInProgress ? (
                <div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-bold text-[#5A6D89] mb-1">
                      <span>Progress</span>
                      <span className="text-[#1988A3] font-black">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#17233E]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#1988A3] to-[#11C6DE] rounded-full" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                  <button 
                    onClick={handleLaunchPlayer}
                    className="w-full py-3 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1988A3]/25"
                  >
                    <Play className="w-4 h-4 fill-current" /> Resume Course ({progressPct}%)
                  </button>
                </div>
              ) : isPending ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
                  <p className="text-xs font-bold text-amber-700">Enrollment request pending {approvalTarget} approval.</p>
                </div>
              ) : isEnrolled ? (
                <button 
                  onClick={handleLaunchPlayer}
                  className="w-full py-3 bg-[#17233E] hover:bg-[#1988A3] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Course Now
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full py-3 bg-[#17233E] hover:bg-[#1988A3] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#17233E]/20"
                >
                  {isEnrolling && <Loader2 className="w-4 h-4 animate-spin text-[#11C6DE]" />}
                  {isEnrolling ? 'Submitting Request...' : 'Request Enrollment'}
                </button>
              )}

              <div className="text-[11px] text-[#5A6D89] space-y-2 border-t border-[#8A9CB7]/20 pt-4 font-medium">
                <div className="flex justify-between">
                  <span>Certificate:</span>
                  <span className="font-bold text-[#17233E]">Included on Completion</span>
                </div>
                <div className="flex justify-between">
                  <span>Prerequisites:</span>
                  <span className="font-bold text-[#17233E]">None required</span>
                </div>
                <div className="flex justify-between">
                  <span>Access:</span>
                  <span className="font-bold text-[#17233E]">Full Lifetime</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Video Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17233E]/80 backdrop-blur-md p-4 md:p-6 overflow-y-auto">
          <div className="bg-[#17233E] rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-white/10 flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="bg-[#121E33] p-5 text-white flex justify-between items-center border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1988A3]/20 text-[#11C6DE] rounded-xl">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-white">{course.title}</h3>
                  <p className="text-xs text-[#8A9CB7]">{course.provider || 'YouTube Educational LMS'}</p>
                </div>
              </div>
              <button onClick={() => setShowPlayer(false)} className="text-[#8A9CB7] hover:text-white p-2 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#121E33] space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <iframe
                  src={getModuleVideoUrl(course.videoUrl, currentModuleIdx)}
                  title={course.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm">{MODULE_CHAPTERS[currentModuleIdx]?.title}</h4>
                  <p className="text-xs text-[#8A9CB7] mt-0.5">{MODULE_CHAPTERS[currentModuleIdx]?.desc}</p>
                </div>
                <button
                  onClick={handleCompleteCurrentModuleVideo}
                  className="px-4 py-2 bg-[#1988A3] hover:bg-[#11C6DE] hover:text-[#17233E] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-md"
                >
                  <Check className="w-4 h-4" /> Mark Module Watched (+25%)
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#121E33] p-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#8A9CB7]">Progress:</span>
                <span className="text-xs font-bold text-[#11C6DE]">{Math.round((completedModules.length / 4) * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowPlayer(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[#8A9CB7] hover:text-white rounded-xl text-xs font-semibold">
                  Close Player
                </button>
                <button
                  onClick={handleCompleteCourse}
                  disabled={updatingProgress || !isVideoWatched}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 disabled:opacity-50"
                >
                  {updatingProgress && <Loader2 className="w-4 h-4 animate-spin text-[#17233E]" />}
                  {updatingProgress ? 'Verifying...' : '✓ Complete Course & Clear Gap'}
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
  <div className="flex items-start gap-3 p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-[#8A9CB7]/25">
    <CheckCircle2 className="w-5 h-5 text-[#1988A3] shrink-0 mt-0.5" />
    <span className="text-xs text-[#17233E] font-medium leading-relaxed">{text}</span>
  </div>
);

export default CourseDetails;
