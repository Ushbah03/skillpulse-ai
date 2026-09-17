import React, { useState, useEffect } from 'react';
import { 
  Search, Target, Zap, Clock, TrendingUp, CheckCircle2, Lock, Sparkles, Check, Play, BookOpen, Award, X, Loader2, Video, ExternalLink, RotateCcw, RefreshCw
} from 'lucide-react';
import { employeeAPI } from '../services/api';

const LearningRecommendations = () => {
  const [courses, setCourses] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Course Player Modal State
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'modules' | 'assignment'
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
  const isLmsLocked = planTier === 'STARTER'; // Only STARTER plan locks video playback & LMS courseware

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const loadData = async () => {
    try {
      const [coursesRes, gapsRes] = await Promise.allSettled([
        employeeAPI.getLearningRecs(),
        employeeAPI.getGaps()
      ]);

      if (coursesRes.status === 'fulfilled' && coursesRes.value?.success && coursesRes.value?.data) {
        setCourses(coursesRes.value.data);
      }
      if (gapsRes.status === 'fulfilled' && gapsRes.value?.success && gapsRes.value?.data) {
        setGaps(gapsRes.value.data);
      }
    } catch (err) {
      console.warn('Error loading learning recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnroll = async (courseId) => {
    if (isLmsLocked) {
      setShowUpgradeModal(true);
      return;
    }
    setEnrollingId(courseId);
    try {
      const res = await employeeAPI.enrollCourse(courseId);
      if (res.success) {
        setToastMsg(`Successfully enrolled in "${res.data?.course?.title || 'course'}"!`);
        setTimeout(() => setToastMsg(''), 4000);
        // Refresh local courses list
        loadData();
      }
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleLaunchCourse = (course) => {
    if (isLmsLocked) {
      setShowUpgradeModal(true);
      return;
    }
    setActiveCourse(course);
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

    if (activeCourse?.id) {
      try {
        await employeeAPI.updateCourseProgress(activeCourse.id, newPct);
        setActiveCourse(prev => prev ? { ...prev, progressPct: newPct, enrollmentStatus: newPct >= 100 ? 'COMPLETED' : 'IN_PROGRESS' } : null);
        loadData();
      } catch (err) {
        console.error('Error syncing chapter progress to DB:', err);
      }
    }

    if (currentModuleIdx < 3) {
      setCurrentModuleIdx(prev => prev + 1);
    }
  };

  const getModuleVideoUrl = (rawUrl, modIdx) => {
    let videoId = 'jwCmIBJ8Jtc'; // Active verified default course stream

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
        setToastMsg(`🎉 Course Completed! Skill Gap for "${activeCourse.title}" is resolved & verified in DB.`);
        setTimeout(() => setToastMsg(''), 5000);
        setActiveCourse(null);
        loadData(); // Reload DB state
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredCourses = courses.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = c.title?.toLowerCase().includes(q);
    const providerMatch = c.provider?.toLowerCase().includes(q);
    const descMatch = c.description?.toLowerCase().includes(q);
    const categoryMatch = c.category?.toLowerCase().includes(q);
    const skillsMatch = Array.isArray(c.skillsTaught) && c.skillsTaught.some(s => s.toLowerCase().includes(q));

    const matchesSearch = !q || titleMatch || providerMatch || descMatch || categoryMatch || skillsMatch;

    // Category Filter
    let matchesCategory = true;
    if (selectedCategory === 'Frontend & Web') {
      matchesCategory = /react|next|vue|angular|css|tailwind|typescript/i.test(c.title + ' ' + (c.provider || '') + ' ' + (c.category || ''));
    } else if (selectedCategory === 'Backend & Cloud') {
      matchesCategory = /python|node|java|spring|rust|graphql|aws|postgres|redis|mongodb/i.test(c.title + ' ' + (c.provider || '') + ' ' + (c.category || ''));
    } else if (selectedCategory === 'UI/UX & Design') {
      matchesCategory = /figma|canva|design|ui\/ux/i.test(c.title + ' ' + (c.provider || '') + ' ' + (c.category || ''));
    } else if (selectedCategory === 'Data & AI') {
      matchesCategory = /data|machine learning|python|prompt|generative ai/i.test(c.title + ' ' + (c.provider || '') + ' ' + (c.category || ''));
    } else if (selectedCategory === 'Security & DevOps') {
      matchesCategory = /kubernetes|docker|cybersecurity|git|linux|devops/i.test(c.title + ' ' + (c.provider || '') + ' ' + (c.category || ''));
    } else if (selectedCategory === 'Soft Skills & Mgmt') {
      matchesCategory = /problem solving|agile|scrum|critical thinking/i.test(c.title + ' ' + (c.provider || '') + ' ' + (c.category || ''));
    }

    // Level Filter
    let matchesLevel = true;
    if (selectedLevel !== 'All') {
      matchesLevel = c.level?.toLowerCase() === selectedLevel.toLowerCase();
    }

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-10 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Check className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
              {workspaceName}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Learning Recommendations</h1>
          <p className="text-slate-500 text-base mt-1 font-medium">AI-powered personalized learning linked directly to your skill gaps</p>
        </div>
        
        {/* Prominent High-Contrast Search Bar & Dropdown Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-blue-600 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 27+ video courses or skills..." 
              className="pl-12 pr-10 py-3 bg-white border-2 border-slate-300 hover:border-blue-400 focus:border-blue-600 rounded-2xl w-80 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-md transition-all" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-0.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Difficulty Level Select Filter */}
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 bg-white border-2 border-slate-300 hover:border-blue-400 focus:border-blue-600 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-md cursor-pointer transition-all"
            >
              <option value="All">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-2.5 mb-8 pb-2 overflow-x-auto">
        {[
          'All',
          'Frontend & Web',
          'Backend & Cloud',
          'UI/UX & Design',
          'Data & AI',
          'Security & DevOps',
          'Soft Skills & Mgmt'
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold tracking-wide transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30 scale-105'
                : 'bg-white text-slate-600 hover:text-blue-600 border-slate-200 hover:border-blue-300 shadow-sm'
            }`}
          >
            {cat === 'All' ? '⚡ All 27 Courses' : cat}
          </button>
        ))}
      </div>

      {/* 2. Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <LearningStat label="Available Courses" value={courses.length} sub="Curated for your profile" color="blue" />
        <LearningStat label="Active Gaps" value={gaps.length} sub="Targeted for training" color="indigo" />
        <LearningStat label="Readiness Boost" value={gaps.length > 0 ? "+25.0%" : "Optimized"} sub="Upon completing gaps" color="emerald" />
        <LearningStat label="AI Confidence" value="98%" sub="Based on career trajectory" color="orange" />
      </div>

      {/* 3. Top AI Recommendations */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-800">Top Recommended Courses</h3>
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Skill-Gap Catalog
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16 bg-white rounded-[2.5rem] border border-slate-100">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-3 gap-8">
            {filteredCourses.map((c) => {
              const progressPct = c.progressPct || 0;
              const isEnrolled = c.enrollmentStatus === 'ENROLLED' || c.enrollmentStatus === 'IN_PROGRESS' || progressPct > 0;
              const isCompleted = c.enrollmentStatus === 'COMPLETED' || progressPct >= 100;

              return (
                <CourseCard 
                  key={c.id}
                  title={c.title} 
                  category={c.provider || 'SkillPulse Academy'} 
                  match={`${Math.round((c.rating || 4.9) * 20)}% Match`} 
                  duration={`${c.durationHours || 12}h total`} 
                  readiness="+20% Readiness" 
                  isLmsLocked={isLmsLocked}
                  isEnrolled={isEnrolled}
                  isCompleted={isCompleted}
                  progressPct={progressPct}
                  isLoading={enrollingId === c.id}
                  onEnroll={() => handleEnroll(c.id)}
                  onLaunch={() => handleLaunchCourse(c)}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[2.5rem] text-center border border-slate-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-2">No Active Skill Gaps Found!</h4>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Great job! All your skill gaps are currently resolved. Take a new assessment to benchmark higher proficiency levels.
            </p>
          </div>
        )}
      </div>

      {/* 4. Plan Upgrade Required Modal for STARTER Tier (Lively & Animated Corporate Style) */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full text-center shadow-2xl border border-slate-100 relative overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Glowing Ambient Light Orbs */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none animate-pulse" />
            
            {/* Animated Lock Icon Badge */}
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-md animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-tr from-amber-100 to-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200/80 shadow-md transform hover:rotate-6 transition-all duration-300">
                <Lock className="w-8 h-8 text-amber-600 animate-bounce" />
              </div>
            </div>
            
            <span className="bg-amber-100/80 text-amber-800 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 mb-3 border border-amber-200 shadow-sm animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-600" /> STARTER TIER RESTRICTION
            </span>

            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              LMS & Video Streaming Locked
            </h3>
            
            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
              Your organization (<span className="font-bold text-slate-800">{workspaceName}</span>) is currently on the <span className="font-bold text-slate-800">Starter Plan</span>.
              <br/><br/>
              Skill gap recommendations are active, but live video streaming and interactive courseware execution require upgrading to the <span className="font-bold text-blue-600">Growth Tier</span> or <span className="font-bold text-indigo-600">Enterprise Tier</span>.
            </p>

            {/* Interactive Admin Contact Card */}
            <div className="bg-gradient-to-r from-blue-50/80 to-slate-50 p-4 rounded-2xl border border-blue-100 mb-6 text-left flex items-start gap-3.5 shadow-sm hover:shadow-md transition-all group">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Contact Your Administrator</h5>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-normal">
                  Reach out to your Workspace Admin to request an organizational plan upgrade.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-slate-900/20 active:scale-95"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Skill Gap Driven Recommendations */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600 p-3 rounded-xl shadow-md shadow-blue-200">
            <Target className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Skill Gap Driven Recommendations</h3>
            <p className="text-xs text-slate-400 font-medium">Courses automatically assigned based on your PostgreSQL skill gap records</p>
          </div>
        </div>

        <div className="space-y-4">
          {gaps.length > 0 ? (
            gaps.map((g) => (
              <GapRow 
                key={g.id}
                title={g.skill?.name || 'Skill Gap'} 
                tag={g.severity || 'HIGH'} 
                gain="+25%" 
                desc={`Target: ${g.requiredLevel || 4.5} • Current: ${g.currentLevel || 2.0} • Recommended training program available`}
                onEnroll={() => {
                  const matchedCourse = courses.find(c => c.skillsTaught.includes(g.skill?.name));
                  if (matchedCourse) {
                    if (matchedCourse.enrollmentStatus === 'ENROLLED' || matchedCourse.enrollmentStatus === 'IN_PROGRESS' || matchedCourse.enrollmentStatus === 'COMPLETED') {
                      handleLaunchCourse(matchedCourse);
                    } else {
                      handleEnroll(matchedCourse.id);
                    }
                  }
                }}
              />
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 font-medium">
              No critical skill gaps recorded in your profile.
            </div>
          )}
        </div>
      </div>

      {/* 5. Interactive Dual Video + AI Course Player Modal (Sleek Enterprise Dark UI) */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0B1120] rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-800 flex flex-col max-h-[92vh]">
            
            {/* Modal Header Bar */}
            <div className="bg-[#0F172A] p-5 text-white flex justify-between items-center border-b border-slate-800/80 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/10">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {activeCourse.provider}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">• {activeCourse.durationHours || 12} Hours Courseware</span>
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{activeCourse.title}</h2>
                </div>
              </div>

              <button 
                onClick={() => setActiveCourse(null)} 
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Navigation */}
            <div className="bg-[#0B1120] border-b border-slate-800/80 px-6 py-2.5 flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setActiveTab('video')}
                className={`py-2 px-4 font-bold text-xs rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === 'video' 
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> 1. Video Lecture Player
              </button>
              <button 
                onClick={() => setActiveTab('modules')}
                className={`py-2 px-4 font-bold text-xs rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === 'modules' 
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> 2. AI Interactive Modules ({completedModules.length}/4)
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#0F172A]">
              {activeTab === 'video' && (
                <div className="space-y-5">
                  {/* Module Chapter Selector Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {MODULE_CHAPTERS.map((ch, idx) => {
                      const isCompleted = completedModules.includes(idx);
                      const isCurrent = currentModuleIdx === idx;
                      const isUnlocked = idx === 0 || completedModules.includes(idx - 1) || isCompleted;

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isUnlocked) setCurrentModuleIdx(idx);
                          }}
                          disabled={!isUnlocked}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                            isCurrent
                              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50 shadow-md shadow-indigo-600/10'
                              : isCompleted
                                ? 'bg-[#0B1120] text-indigo-300 border-indigo-500/30'
                                : isUnlocked
                                  ? 'bg-[#0B1120] text-slate-300 border-slate-800 hover:border-slate-700'
                                  : 'bg-[#0B1120]/40 text-slate-600 border-slate-800/40 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          ) : isCurrent ? (
                            <Play className="w-3.5 h-3.5 text-indigo-400 fill-current" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>Ch {idx + 1}: {ch.title.split(':')[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Theater Video Container or 100% Celebration Screen */}
                  {completedModules.length === 4 ? (
                    <div className="aspect-video w-full bg-gradient-to-br from-indigo-950 via-[#0B1120] to-slate-950 rounded-2xl border border-indigo-500/40 p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                      <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 rounded-3xl flex items-center justify-center mb-5 shadow-xl shadow-indigo-600/20 animate-bounce">
                        <Award className="w-10 h-10 text-indigo-400" />
                      </div>

                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest mb-3">
                        100% COURSEWARE COMPLETED
                      </span>

                      <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                        Congratulations! All 4 Video Chapters Completed 🎉
                      </h3>

                      <p className="text-slate-400 text-xs max-w-lg mb-6 leading-relaxed">
                        You have successfully finished all video chapters for <span className="text-indigo-300 font-bold">{activeCourse.title}</span>. Click below to submit completion and verify your skill in PostgreSQL DB.
                      </p>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleCompleteCourse}
                          disabled={updatingProgress}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 border border-indigo-400/30"
                        >
                          {updatingProgress && <Loader2 className="w-4 h-4 animate-spin" />}
                          {updatingProgress ? 'Verifying in DB...' : '✓ Submit & Clear Skill Gap in DB'}
                        </button>

                        <button
                          onClick={() => {
                            setCompletedModules([]);
                            setCurrentModuleIdx(0);
                          }}
                          className="px-4 py-3 bg-[#1E293B] hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4 text-slate-400" />
                          Replay Video Lecture
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800">
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
                  )}

                  {/* Dark Glass About Card & Automated Next Video Button */}
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
                          ? `Completed Chapter ${currentModuleIdx + 1} ✓`
                          : currentModuleIdx < 3
                            ? `✓ Finish Chapter ${currentModuleIdx + 1} & Play Next Video`
                            : `✓ Finish Final Chapter ${currentModuleIdx + 1}`}
                      </button>

                      <button
                        onClick={() => setUseBackupStream(prev => !prev)}
                        title="Click if primary YouTube video is unavailable or restricted"
                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          useBackupStream
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${useBackupStream ? 'animate-spin' : ''}`} />
                        {useBackupStream ? 'Backup Stream' : 'Switch Stream'}
                      </button>

                      <a
                        href={(() => {
                          const raw = activeCourse.externalUrl || '';
                          const clean = raw.replace('youtube-nocookie.com', 'youtube.com');
                          const match = clean.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                          if (match && match[1]) {
                            return `https://www.youtube.com/watch?v=${match[1]}`;
                          }
                          return 'https://www.youtube.com';
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        YouTube
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'modules' && (
                <div className="space-y-4">
                  <div className="bg-[#0B1120] border border-slate-800 p-4 rounded-2xl flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">Automated Chapter Progression</h4>
                      <p className="text-xs text-slate-400 font-medium">
                        Chapter modules are automatically verified as you finish each video lecture in Tab 1
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-indigo-400">{Math.round((completedModules.length / 4) * 100)}%</span>
                    </div>
                  </div>

                  {MODULE_CHAPTERS.map((mod, idx) => {
                    const isChecked = completedModules.includes(idx);
                    const isCurrent = currentModuleIdx === idx && !isChecked;
                    const isLocked = !isChecked && !isCurrent && (idx > 0 && !completedModules.includes(idx - 1));

                    return (
                      <div 
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                          isChecked 
                            ? 'bg-[#0B1120] border-indigo-500/40 text-white shadow-lg shadow-indigo-500/5' 
                            : isCurrent
                              ? 'bg-[#0B1120] border-indigo-500/60 text-white shadow-md'
                              : 'bg-[#0B1120]/50 border-slate-800/60 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 border transition-all shrink-0 ${
                          isChecked 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-500/40' 
                            : isCurrent
                              ? 'border-indigo-500/60 bg-indigo-500/20 text-indigo-400 animate-pulse'
                              : 'border-slate-700 bg-slate-900 text-slate-600'
                        }`}>
                          {isChecked ? (
                            <Check className="w-4 h-4" />
                          ) : isCurrent ? (
                            <Play className="w-3 h-3 fill-current" />
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className={`font-bold text-sm ${isChecked ? 'text-white' : isCurrent ? 'text-indigo-300' : 'text-slate-400'}`}>{mod.title}</h5>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isChecked 
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                                : isCurrent 
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}>
                              {isChecked ? '✓ Auto-Completed (25%)' : isCurrent ? '▶ Playing in Video Player' : '🔒 Locked'}
                            </span>
                          </div>
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
                  {updatingProgress ? 'Verifying in DB...' : '✓ Complete Course & Clear Skill Gap'}
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

const LearningStat = ({ label, value, sub }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
    <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
    <p className="text-slate-500 text-xs font-medium">{sub}</p>
  </div>
);

const CourseCard = ({ title, category, match, duration, readiness, isLmsLocked, isEnrolled, isPending, isCompleted, progressPct = 0, isLoading, onEnroll, onLaunch }) => {
  const isInProgress = (progressPct > 0 && progressPct < 100);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all flex flex-col justify-between">
      <div className="bg-slate-900 h-36 relative flex items-center justify-center p-6 text-center">
        <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-white/20">{match}</span>
        
        {/* Course Lifecycle Badges */}
        {isCompleted ? (
          <span className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-emerald-400 flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED (100%)
          </span>
        ) : isInProgress ? (
          <span className="absolute top-4 left-4 bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-indigo-400 flex items-center gap-1 shadow-md animate-pulse">
            <Play className="w-3 h-3 fill-current" /> IN PROGRESS ({progressPct}%)
          </span>
        ) : isPending ? (
          <span className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-amber-400 flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3" /> PENDING APPROVAL
          </span>
        ) : isEnrolled ? (
          <span className="absolute top-4 left-4 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-blue-400 flex items-center gap-1 shadow-sm">
            <Check className="w-3 h-3" /> APPROVED & ENROLLED
          </span>
        ) : isLmsLocked ? (
          <span className="absolute top-4 left-4 bg-amber-500/20 backdrop-blur-md text-amber-300 text-[9px] font-black px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
            <Lock className="w-3 h-3" /> STARTER LOCKED
          </span>
        ) : null}

        <h4 className="text-white text-base font-black uppercase italic leading-tight">{title}</h4>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex gap-2 mb-3">
            <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">{category}</span>
            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">AI Verified</span>
          </div>
          <h4 className="text-base font-bold text-slate-800 mb-4 leading-tight">{title}</h4>
        </div>
        <div>
          {/* Visual Learning Progress Bar */}
          {isInProgress && (
            <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-600 mb-1.5">
                <span>Learning Progress</span>
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

          <div className="flex justify-between items-center text-slate-500 text-xs font-bold mb-6">
            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {duration}</div>
            <div className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> {readiness}</div>
          </div>
          
          {isLmsLocked ? (
            <button 
              onClick={onLaunch}
              className="w-full py-3 rounded-xl font-bold text-xs bg-amber-500/10 text-amber-700 border border-amber-200 hover:bg-amber-500/20 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" /> Upgrade Plan to Access
            </button>
          ) : isCompleted ? (
            <button 
              onClick={onLaunch}
              className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> ✓ Completed (Review Course)
            </button>
          ) : isInProgress ? (
            <button 
              onClick={onLaunch}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> ▶ Continue Course ({progressPct}%)
            </button>
          ) : isPending ? (
            <button 
              disabled
              className="w-full py-3 rounded-xl font-bold text-xs bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Leader Approval
            </button>
          ) : isEnrolled ? (
            <button 
              onClick={onLaunch}
              className="w-full py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> ▶ Start Course
            </button>
          ) : (
            <button 
              onClick={onEnroll}
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isLoading ? 'Submitting...' : 'Request Enrollment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const GapRow = ({ title, tag, gain, desc, onEnroll }) => (
  <div className="flex justify-between items-center p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shadow-sm">
        <Zap className="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h5 className="font-bold text-slate-800 text-base">{title}</h5>
          <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">{tag}</span>
        </div>
        <p className="text-slate-500 text-xs">{desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Readiness Gain</p>
        <p className="text-emerald-500 font-black text-lg">{gain}</p>
      </div>
      {onEnroll && (
        <button 
          onClick={onEnroll}
          className="border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
        >
          Launch Course
        </button>
      )}
    </div>
  </div>
);

export default LearningRecommendations;