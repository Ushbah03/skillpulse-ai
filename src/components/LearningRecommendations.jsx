import React, { useState, useEffect } from 'react';
import { 
  Search, Target, Zap, Clock, TrendingUp, CheckCircle2, Lock, Sparkles, Check, Play, BookOpen, Award, X, Loader2, Video, ExternalLink, RotateCcw, RefreshCw, XCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { employeeAPI } from '../services/api';
import SkillPulseLoader from './SkillPulseLoader';

const LearningRecommendations = () => {
  const [courses, setCourses] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // AI 30-Day Roadmap Modal State
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  const handleGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    setShowRoadmapModal(true);
    try {
      const res = await employeeAPI.getAiLearningRoadmap();
      if (res?.success && res?.data) {
        setRoadmapData(res.data);
      }
    } catch (err) {
      console.warn('Roadmap generation error:', err);
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  // Course Player Modal State
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
  const workspaceName = storedUser.tenant?.name || 'Enterprise Corp Workspace';
  const planTier = (storedUser.tenant?.plan || storedUser.tenant?.subscriptionTier || storedUser.tenant?.planTier || 'PRO').toUpperCase();
  const isLmsLocked = planTier === 'STARTER';

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
        setToastMsg(`🎉 Course Completed! Skill Gap for "${activeCourse.title}" is resolved & verified in DB.`);
        setTimeout(() => setToastMsg(''), 5000);
        setActiveCourse(null);
        loadData();
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

    let matchesLevel = true;
    if (selectedLevel !== 'All') {
      matchesLevel = c.level?.toLowerCase() === selectedLevel.toLowerCase();
    }

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLevel]);

  const totalCatalogPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCatalogCourses = filteredCourses.slice(startIndex, endIndex);

  if (loading) {
    return <SkillPulseLoader message="Analyzing Skill Vectors & Curating Courses..." />;
  }

  return (
    <div className="bg-transparent min-h-screen p-0 pb-12 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#17233E] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#1988A3]/40">
          <Check className="w-5 h-5 shrink-0 text-[#11C6DE]" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#1988A3]/10 text-[#1988A3] px-2.5 py-1 rounded-lg border border-[#1988A3]/25">
              {workspaceName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#17233E] tracking-tight">Learning Recommendations</h1>
          <p className="text-[#5A6D89] text-xs sm:text-sm md:text-base mt-1 font-medium">AI-powered personalized learning linked directly to your skill gaps</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial w-full sm:w-auto">
            <Search className="absolute left-4 top-3.5 text-[#8A9CB7] w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${courses.length || 45}+ courses or skills...`} 
              className="pl-11 pr-10 py-2.5 bg-[#F0F5FB]/85 backdrop-blur-md border border-[#8A9CB7]/30 rounded-2xl w-full sm:w-60 md:w-72 text-sm text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:border-[#1988A3] shadow-sm transition-all" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-[#8A9CB7] hover:text-[#17233E] p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#F0F5FB]/85 backdrop-blur-md border border-[#8A9CB7]/30 rounded-2xl text-xs font-bold text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm cursor-pointer"
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
      <div className="flex items-center gap-2 sm:gap-2.5 mb-6 sm:mb-8 pb-2 overflow-x-auto no-scrollbar">
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
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-black tracking-wide transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? 'bg-[#17233E] text-white border-[#17233E] shadow-md shadow-[#17233E]/20 scale-105'
                : 'bg-[#F0F5FB]/85 backdrop-blur-md text-[#5A6D89] hover:text-[#17233E] border-[#8A9CB7]/30 hover:border-[#1988A3]/40 shadow-sm'
            }`}
          >
            {cat === 'All' ? `⚡ All ${courses.length || 45} Courses` : cat}
          </button>
        ))}
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 mb-6 sm:mb-10">
        <LearningStat label="Available Courses" value={courses.length} sub="Curated for your profile" color="cyan" />
        <LearningStat label="Active Gaps" value={gaps.length} sub="Targeted for training" color="navy" />
        <LearningStat label="Readiness Boost" value={gaps.length > 0 ? "+25.0%" : "Optimized"} sub="Upon completing gaps" color="emerald" />
        <LearningStat label="AI Confidence" value="98%" sub="Based on career trajectory" color="amber" />
      </div>

      {/* Top 5 AI Recommendations */}
      <div className="mb-10 sm:mb-14">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl md:text-2xl font-black text-[#17233E] tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1988A3]" /> Top Recommended Courses for You
              </h3>
              <span className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] text-white text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#11C6DE]" /> AI Skill-Gap Engine
              </span>
            </div>
            <p className="text-[#5A6D89] text-xs md:text-sm font-medium">Scored in real-time based on your active skill gaps, department role, and career growth requirements.</p>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.slice(0, 5).map((c, idx) => {
              const progressPct = c.progressPct || 0;
              const isPending = c.isPending || c.enrollmentStatus === 'NOT_STARTED' || c.enrollmentStatus === 'PENDING';
              const isApproved = c.isApproved || c.enrollmentStatus === 'ENROLLED' || c.enrollmentStatus === 'IN_PROGRESS';
              const isRejected = c.isRejected || c.enrollmentStatus === 'REJECTED' || c.enrollmentStatus === 'DENIED';
              const isCompleted = c.enrollmentStatus === 'COMPLETED' || progressPct >= 100;
              const approvalTarget = c.approvalTarget || (c.hasTeam ? 'Leader' : 'HR');

              return (
                <CourseCard 
                  key={`top-${c.id}`}
                  title={c.title} 
                  category={c.provider || 'SkillPulse Academy'} 
                  match={c.matchScore ? `${c.matchScore}% Match` : `${Math.round((c.rating || 4.9) * 20)}% Match`} 
                  duration={`${c.durationHours || 12}h total`} 
                  readiness="+20% Readiness" 
                  isGapMatch={c.isGapMatch}
                  matchedGapSkill={c.matchedGapSkill}
                  aiRank={c.aiRank || idx + 1}
                  aiReason={c.aiReason}
                  isTopAiRecommendation={true}
                  isLmsLocked={isLmsLocked}
                  isEnrolled={isApproved}
                  isPending={isPending}
                  isRejected={isRejected}
                  approvalTarget={approvalTarget}
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
          <div className="glass-panel p-12 rounded-[2.5rem] text-center">
            <CheckCircle2 className="w-12 h-12 text-[#1988A3] mx-auto mb-4" />
            <h4 className="text-xl font-bold text-[#17233E] mb-2">No Active Skill Gaps Found!</h4>
            <p className="text-[#5A6D89] text-sm max-w-md mx-auto">
              Great job! All your skill gaps are currently resolved. Take a new assessment to benchmark higher proficiency levels.
            </p>
          </div>
        )}
      </div>

      {/* All Available Catalog Courses with Pagination */}
      <div className="mb-12 border-t border-[#8A9CB7]/20 pt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-[#17233E] tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1988A3]" /> All Available Courses
            </h3>
            <p className="text-[#5A6D89] text-xs md:text-sm font-medium">Browse all training modules and catalog courses across your organization.</p>
          </div>
          <span className="text-xs font-bold text-[#5A6D89] bg-[#17233E]/5 px-3.5 py-1.5 rounded-full border border-[#8A9CB7]/20">
            Showing {filteredCourses.length > 0 ? `${startIndex + 1}-${Math.min(endIndex, filteredCourses.length)} of ${filteredCourses.length}` : '0'} total courses
          </span>
        </div>

        {filteredCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCatalogCourses.map((c) => {
                const progressPct = c.progressPct || 0;
                const isPending = c.isPending || c.enrollmentStatus === 'NOT_STARTED' || c.enrollmentStatus === 'PENDING';
                const isApproved = c.isApproved || c.enrollmentStatus === 'ENROLLED' || c.enrollmentStatus === 'IN_PROGRESS';
                const isRejected = c.isRejected || c.enrollmentStatus === 'REJECTED' || c.enrollmentStatus === 'DENIED';
                const isCompleted = c.enrollmentStatus === 'COMPLETED' || progressPct >= 100;
                const approvalTarget = c.approvalTarget || (c.hasTeam ? 'Leader' : 'HR');

                return (
                  <CourseCard 
                    key={`catalog-${c.id}`}
                    title={c.title} 
                    category={c.provider || 'SkillPulse Academy'} 
                    match={`${c.matchScore || 79}% Match`} 
                    duration={`${c.durationHours || 12}h total`} 
                    readiness="+20% Readiness" 
                    isGapMatch={c.isGapMatch}
                    matchedGapSkill={c.matchedGapSkill}
                    aiReason={c.aiReason}
                    isLmsLocked={isLmsLocked}
                    isEnrolled={isApproved}
                    isPending={isPending}
                    isRejected={isRejected}
                    approvalTarget={approvalTarget}
                    isCompleted={isCompleted}
                    progressPct={progressPct}
                    isLoading={enrollingId === c.id}
                    onEnroll={() => handleEnroll(c.id)}
                    onLaunch={() => handleLaunchCourse(c)}
                  />
                );
              })}
            </div>

            {/* Catalog Pagination Navigation Bar */}
            {totalCatalogPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-[#8A9CB7]/20">
                <div className="text-xs font-bold text-[#5A6D89]">
                  Showing <span className="text-[#17233E] font-black">{startIndex + 1}</span> to <span className="text-[#17233E] font-black">{Math.min(endIndex, filteredCourses.length)}</span> of <span className="text-[#17233E] font-black">{filteredCourses.length}</span> courses (Page {currentPage} of {totalCatalogPages})
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-[#8A9CB7]/30 text-[#5A6D89] hover:text-[#17233E] hover:border-[#1988A3] disabled:opacity-40 disabled:cursor-not-allowed bg-[#F0F5FB]/85 backdrop-blur-md shadow-sm transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalCatalogPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all border ${
                        currentPage === pageNum
                          ? 'bg-[#17233E] text-white border-[#17233E] shadow-md shadow-[#17233E]/20 scale-105'
                          : 'bg-[#F0F5FB]/85 backdrop-blur-md text-[#5A6D89] hover:text-[#17233E] border-[#8A9CB7]/30 hover:border-[#1988A3]/40 shadow-sm'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalCatalogPages))}
                    disabled={currentPage === totalCatalogPages}
                    className="p-2.5 rounded-xl border border-[#8A9CB7]/30 text-[#5A6D89] hover:text-[#17233E] hover:border-[#1988A3] disabled:opacity-40 disabled:cursor-not-allowed bg-[#F0F5FB]/85 backdrop-blur-md shadow-sm transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="glass-panel p-8 rounded-2xl text-center text-[#5A6D89] font-medium text-sm">
            No catalog courses found matching your filter criteria.
          </div>
        )}
      </div>

      {/* Plan Upgrade Modal for STARTER Tier */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17233E]/70 backdrop-blur-md p-6">
          <div className="bg-[#D8EBF9]/95 backdrop-blur-2xl rounded-[2.5rem] p-8 max-w-lg w-full text-center shadow-2xl border border-white/80 relative overflow-hidden">
            <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-500/20">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            
            <span className="bg-amber-500/10 text-amber-800 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 mb-3 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-600" /> STARTER TIER RESTRICTION
            </span>

            <h3 className="text-2xl font-black text-[#17233E] mb-2 tracking-tight">
              LMS & Video Streaming Locked
            </h3>
            
            <p className="text-[#5A6D89] text-sm font-medium mb-6 leading-relaxed">
              Your organization (<span className="font-bold text-[#17233E]">{workspaceName}</span>) is currently on the <span className="font-bold text-[#17233E]">Starter Plan</span>.
              <br/><br/>
              Skill gap recommendations are active, but live video streaming and interactive courseware execution require upgrading to the <span className="font-bold text-[#1988A3]">Growth Tier</span> or <span className="font-bold text-[#17233E]">Enterprise Tier</span>.
            </p>

            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-full py-3.5 bg-[#17233E] hover:bg-[#1988A3] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg"
            >
              Close Notice
            </button>
          </div>
        </div>
      )}

      {/* 30-Day AI Learning Roadmap Modal */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17233E]/70 backdrop-blur-md p-4 md:p-6 overflow-y-auto">
          <div className="bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#121E33] rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-white/10 text-white p-8">
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#1988A3]/20 text-[#11C6DE] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-[#1988A3]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#11C6DE] animate-pulse" /> SkillPulse AI Learning Coach
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">30-Day AI Personalized Learning Roadmap</h2>
                <p className="text-[#8A9CB7] text-sm mt-1 font-medium">{roadmapData?.summary || 'Targeted 30-day learning plan to bridge critical skill gaps.'}</p>
              </div>
              <button 
                onClick={() => setShowRoadmapModal(false)}
                className="p-2.5 rounded-2xl bg-white/10 text-[#8A9CB7] hover:text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {generatingRoadmap ? (
              <div className="py-20 text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#11C6DE] mx-auto" />
                <p className="text-[#11C6DE] font-bold text-sm">Generating real-time LLM Learning Roadmap from your DB Skill Gaps...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest">Target Role Trajectory</p>
                    <p className="text-lg font-bold text-white">{roadmapData?.targetRole || 'Senior Specialist'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest">Duration</p>
                    <p className="text-lg font-bold text-emerald-400">{roadmapData?.estimatedCompletionDays || 30} Days</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#8A9CB7]">Weekly Milestones & Actions</h4>
                  {roadmapData?.weeklyMilestones?.map((m, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4 hover:border-[#1988A3]/40 transition-all">
                      <div className="w-9 h-9 rounded-xl bg-[#1988A3] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-lg shadow-[#1988A3]/30">
                        W{m.week}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-bold text-white text-sm">{m.focus}</h5>
                          <span className="text-[10px] font-black uppercase bg-[#1988A3]/20 text-[#11C6DE] px-2 py-0.5 rounded border border-[#1988A3]/30">
                            {m.recommendedSkill}
                          </span>
                        </div>
                        <p className="text-[#8A9CB7] text-xs font-medium leading-relaxed">{m.action}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowRoadmapModal(false)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1988A3]/30"
                >
                  Start 30-Day Learning Plan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Dual Video + AI Course Player Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17233E]/80 backdrop-blur-md p-4 md:p-6 overflow-y-auto">
          <div className="bg-[#17233E] rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-white/10 flex flex-col max-h-[92vh]">
            
            {/* Modal Header Bar */}
            <div className="bg-[#121E33] p-5 text-white flex justify-between items-center border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-[#1988A3]/20 text-[#11C6DE] border border-[#1988A3]/30 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="bg-[#1988A3]/10 text-[#11C6DE] border border-[#1988A3]/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {activeCourse.provider}
                    </span>
                    <span className="text-xs font-semibold text-[#8A9CB7]">• {activeCourse.durationHours || 12} Hours Courseware</span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-white tracking-tight">{activeCourse.title}</h2>
                </div>
              </div>

              <button 
                onClick={() => setActiveCourse(null)} 
                className="p-2 rounded-xl text-[#8A9CB7] hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Navigation */}
            <div className="bg-[#17233E] border-b border-white/10 px-6 py-2.5 flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setActiveTab('video')}
                className={`py-2 px-4 font-bold text-xs rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === 'video' 
                    ? 'bg-[#1988A3]/20 text-[#11C6DE] border border-[#1988A3]/40 shadow-md' 
                    : 'text-[#8A9CB7] hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> 1. Video Lecture Player
              </button>
              <button 
                onClick={() => setActiveTab('modules')}
                className={`py-2 px-4 font-bold text-xs rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === 'modules' 
                    ? 'bg-[#1988A3]/20 text-[#11C6DE] border border-[#1988A3]/40 shadow-md' 
                    : 'text-[#8A9CB7] hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> 2. AI Interactive Modules ({completedModules.length}/4)
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#121E33]">
              {activeTab === 'video' && (
                <div className="space-y-5">
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
                              ? 'bg-[#1988A3]/20 text-[#11C6DE] border-[#1988A3]/50'
                              : isCompleted
                                ? 'bg-white/5 text-emerald-400 border-emerald-500/30'
                                : isUnlocked
                                  ? 'bg-white/5 text-[#8A9CB7] border-white/10 hover:border-white/20'
                                  : 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : isCurrent ? (
                            <Play className="w-3.5 h-3.5 text-[#11C6DE] fill-current" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-current text-[9px] flex items-center justify-center">{idx + 1}</span>
                          )}
                          Module {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                    <iframe
                      src={getModuleVideoUrl(activeCourse.videoUrl, currentModuleIdx)}
                      title={activeCourse.title}
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
              )}

              {activeTab === 'modules' && (
                <div className="space-y-4">
                  {MODULE_CHAPTERS.map((ch, idx) => {
                    const isDone = completedModules.includes(idx);
                    return (
                      <div key={idx} className={`p-4 rounded-2xl border transition-all ${isDone ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="font-bold text-white text-sm">{ch.title}</h5>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-[#8A9CB7]'}`}>
                            {isDone ? 'Completed' : ch.duration}
                          </span>
                        </div>
                        <p className="text-xs text-[#8A9CB7]">{ch.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="bg-[#121E33] p-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#8A9CB7]">Overall Progress:</span>
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1988A3] to-[#11C6DE] rounded-full transition-all duration-300" 
                    style={{ width: `${(completedModules.length / 4) * 100}%` }} 
                  />
                </div>
                <span className="text-xs font-bold text-[#11C6DE]">{Math.round((completedModules.length / 4) * 100)}%</span>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setActiveCourse(null)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[#8A9CB7] hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-all"
                >
                  Close Player
                </button>

                <button
                  onClick={handleCompleteCourse}
                  disabled={updatingProgress || !isVideoWatched}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingProgress && <Loader2 className="w-4 h-4 animate-spin text-[#17233E]" />}
                  {updatingProgress ? 'Verifying in DB...' : '✓ Complete Course & Clear Gap'}
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

const LearningStat = ({ label, value, sub, color }) => {
  const themes = {
    cyan: 'bg-[#1988A3]/10 border border-[#1988A3]/20',
    navy: 'bg-[#17233E]/10 border border-[#17233E]/20',
    emerald: 'bg-emerald-500/10 border border-emerald-500/20',
    amber: 'bg-amber-500/10 border border-amber-500/20'
  };
  return (
    <div className="glass-panel p-3.5 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between">
      <p className="text-[#5A6D89] text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest mb-1 sm:mb-2 truncate">{label}</p>
      <h3 className="text-xl sm:text-3xl font-black text-[#17233E] mb-0.5 sm:mb-1 truncate">{value}</h3>
      <p className="text-[#5A6D89] text-[10px] sm:text-xs font-medium truncate">{sub}</p>
    </div>
  );
};

const CourseCard = ({ 
  title, category, match, duration, readiness, isGapMatch, matchedGapSkill, 
  aiRank, aiReason, isTopAiRecommendation, approvalTarget = 'Leader',
  isLmsLocked, isEnrolled, isPending, isRejected, isCompleted, progressPct = 0, isLoading, onEnroll, onLaunch 
}) => {
  const isInProgress = (progressPct > 0 && progressPct < 100);

  return (
    <div className={`glass-panel rounded-2xl sm:rounded-[2.5rem] overflow-hidden group hover:border-[#1988A3]/50 transition-all flex flex-col justify-between ${
      isRejected ? 'border-rose-300' : isTopAiRecommendation ? 'border-[#1988A3]/40 shadow-lg' : ''
    }`}>
      <div className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#121E33] h-28 sm:h-36 relative flex items-center justify-center p-4 sm:p-6 text-center">
        <span className="absolute top-4 right-4 text-[9px] font-black px-2.5 py-1 rounded-full border bg-[#1988A3] text-white border-[#1988A3]/50 shadow-sm">
          {match}
        </span>
        
        {/* Course Lifecycle Badges */}
        {isRejected ? (
          <span className="absolute top-4 left-4 bg-rose-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-rose-400 flex items-center gap-1 shadow-sm">
            <XCircle className="w-3 h-3" /> REQUEST REJECTED
          </span>
        ) : isTopAiRecommendation && aiRank ? (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-[#17233E] text-[9px] font-black px-2.5 py-1 rounded-full border border-[#11C6DE]/50 flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-[#17233E]" /> #{aiRank} AI RECOMMENDATION
          </span>
        ) : isCompleted ? (
          <span className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-emerald-400 flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED (100%)
          </span>
        ) : isInProgress ? (
          <span className="absolute top-4 left-4 bg-[#1988A3] text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-[#1988A3]/40 flex items-center gap-1 shadow-md animate-pulse">
            <Play className="w-3 h-3 fill-current" /> IN PROGRESS ({progressPct}%)
          </span>
        ) : isPending ? (
          <span className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-amber-400 flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3" /> PENDING {approvalTarget.toUpperCase()} APPROVAL
          </span>
        ) : isGapMatch ? (
          <span className="absolute top-4 left-4 bg-[#1988A3] text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-[#1988A3]/40 flex items-center gap-1 shadow-sm animate-pulse">
            <Sparkles className="w-3 h-3 text-[#11C6DE]" /> AI GAP TARGET
          </span>
        ) : isEnrolled ? (
          <span className="absolute top-4 left-4 bg-[#17233E] text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-[#1988A3]/30 flex items-center gap-1 shadow-sm">
            <Check className="w-3 h-3 text-[#11C6DE]" /> APPROVED & ENROLLED
          </span>
        ) : isLmsLocked ? (
          <span className="absolute top-4 left-4 bg-amber-500/20 backdrop-blur-md text-amber-300 text-[9px] font-black px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
            <Lock className="w-3 h-3" /> STARTER LOCKED
          </span>
        ) : null}

        <h4 className="text-white text-sm md:text-base font-black uppercase italic leading-tight">{title}</h4>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-[#17233E]/5 text-[#17233E] text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">{category}</span>
            {aiReason ? (
              <span className="bg-[#1988A3]/10 text-[#1988A3] text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 border border-[#1988A3]/20">
                {aiReason}
              </span>
            ) : isGapMatch ? (
              <span className="bg-[#1988A3]/15 text-[#1988A3] text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 border border-[#1988A3]/30">
                <Sparkles className="w-2.5 h-2.5 text-[#1988A3]" /> Gap: {matchedGapSkill}
              </span>
            ) : (
              <span className="bg-emerald-500/10 text-emerald-700 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">AI Verified</span>
            )}
          </div>
          <h4 className="text-sm md:text-base font-bold text-[#17233E] mb-4 leading-tight">{title}</h4>
        </div>
        <div>
          {/* Visual Learning Progress Bar */}
          {isInProgress && (
            <div className="mb-4 bg-white/70 p-3 rounded-xl border border-[#8A9CB7]/25">
              <div className="flex justify-between items-center text-[10px] font-extrabold text-[#5A6D89] mb-1.5">
                <span>Learning Progress</span>
                <span className="text-[#1988A3] font-black">{progressPct}%</span>
              </div>
              <div className="w-full h-2 bg-[#17233E]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1988A3] to-[#11C6DE] rounded-full transition-all duration-300" 
                  style={{ width: `${progressPct}%` }} 
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-[#5A6D89] text-xs font-bold mb-6">
            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#8A9CB7]" /> {duration}</div>
            <div className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#1988A3]" /> {readiness}</div>
          </div>
          
          {isLmsLocked ? (
            <button 
              onClick={onLaunch}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500/10 text-amber-700 border border-amber-200 hover:bg-amber-500/20 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" /> Upgrade Plan to Access
            </button>
          ) : isCompleted ? (
            <button 
              onClick={onLaunch}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> ✓ Completed (Review Course)
            </button>
          ) : isInProgress ? (
            <button 
              onClick={onLaunch}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> ▶ Continue Course ({progressPct}%)
            </button>
          ) : isRejected ? (
            <button 
              onClick={onEnroll}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isLoading ? 'Re-Submitting Request...' : '🔄 Try Again (Re-Request Enrollment)'}
            </button>
          ) : isPending ? (
            <button 
              disabled
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending {approvalTarget} Approval
            </button>
          ) : isEnrolled ? (
            <button 
              onClick={onLaunch}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#17233E] hover:bg-[#1988A3] text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> ▶ Start Course
            </button>
          ) : (
            <button 
              onClick={onEnroll}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#17233E] hover:bg-[#1988A3] text-white transition-all shadow-md flex items-center justify-center gap-2"
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

export default LearningRecommendations;
