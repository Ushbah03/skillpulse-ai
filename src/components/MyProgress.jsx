import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Clock, CheckCircle2, Cpu, Award, Search, Sparkles, Check, Loader2, X, RefreshCw, BookOpen, ShieldCheck, ArrowRight, XCircle, Lock
} from 'lucide-react';
import { employeeAPI } from '../services/api';
import SkillPulseLoader from './SkillPulseLoader';

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
  const workspaceName = storedUser.tenant?.name || 'Enterprise Corp Workspace';

  const loadProgress = async () => {
    try {
      setLoading(true);
      const [recsRes, gapsRes] = await Promise.allSettled([
        employeeAPI.getLearningRecs(),
        employeeAPI.getGaps()
      ]);

      if (recsRes.status === 'fulfilled' && recsRes.value?.success && Array.isArray(recsRes.value.data)) {
        const activeOrEnrolled = recsRes.value.data.filter(c => {
          const isRejected = c.isRejected || c.enrollmentStatus === 'REJECTED' || c.enrollmentStatus === 'DENIED' || c.progressPct === -1.0;
          const isApprovedOrActive = c.isApproved || c.enrollmentStatus === 'ENROLLED' || c.enrollmentStatus === 'IN_PROGRESS' || c.enrollmentStatus === 'COMPLETED' || (c.progressPct && c.progressPct > 0);
          return !isRejected && isApprovedOrActive;
        });
        setCourses(activeOrEnrolled);
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

  const handleLaunchCourse = (course) => {
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

  const handleReEnroll = async (courseId) => {
    setUpdatingId(courseId);
    try {
      const res = await employeeAPI.enrollCourse(courseId);
      if (res?.success) {
        setToastMsg(`Enrollment request re-submitted!`);
        setTimeout(() => setToastMsg(''), 4000);
        await loadProgress();
      }
    } catch (err) {
      console.error('Re-enroll error:', err);
    } finally {
      setUpdatingId(null);
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
        setToastMsg(`🎉 Course Completed! Skill Gap for "${activeCourse.title}" is resolved & verified in DB.`);
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

  if (loading) {
    return <SkillPulseLoader message="Analyzing Active Learning Trajectory..." />;
  }

  return (
    <div className="bg-transparent min-h-screen p-6 md:p-10 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#17233E] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#1988A3]/40">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#11C6DE]" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#1988A3]/10 text-[#1988A3] px-2.5 py-0.5 rounded border border-[#1988A3]/25">
              {workspaceName}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#17233E] tracking-tight">My Learning Progress</h1>
          <p className="text-sm md:text-base text-[#5A6D89] font-medium mt-1">Real-time course metrics, video progress, and skill gap resolutions</p>
        </div>

        {/* High Contrast Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-[#8A9CB7] w-4 h-4 pointer-events-none" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enrolled courses..." 
            className="w-full pl-11 pr-9 py-2.5 rounded-2xl border border-[#8A9CB7]/30 text-xs font-bold text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:border-[#1988A3] bg-white/70 backdrop-blur-md shadow-sm transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-[#8A9CB7] hover:text-[#17233E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Clock className="text-[#1988A3] w-6 h-6" />} label="Learning Time" value={`${totalHoursSpent.toFixed(1)}h`} subtext="Accumulated Hours" color="cyan" />
        <StatCard icon={<Play className="text-[#17233E] w-6 h-6 fill-current" />} label="In-Progress" value={`${activeCoursesCount}`} subtext="Active Courses" color="navy" />
        <StatCard icon={<CheckCircle2 className="text-emerald-600 w-6 h-6" />} label="Completed Courses" value={`${completedCoursesCount}`} subtext="100% Finished" color="emerald" />
        <StatCard icon={<Award className="text-amber-500 w-6 h-6" />} label="Resolved Skill Gaps" value={`${gaps.length === 0 ? 'All Clear' : `${gaps.length} Active`}`} subtext="AI Verified" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Enrolled & Active Courses List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-black text-[#17233E]">My Course Enrolments & Progress</h2>
            <button 
              onClick={() => navigate('/dashboard/learning')}
              className="text-xs font-bold text-[#1988A3] hover:underline flex items-center gap-1"
            >
              Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {filteredCourses.length > 0 ? (
            filteredCourses.map((c) => {
              const pct = isNaN(c.progressPct) || c.progressPct < 0 ? 0 : c.progressPct;
              const isRejected = c.isRejected || c.enrollmentStatus === 'REJECTED' || c.enrollmentStatus === 'DENIED' || c.progressPct === -1.0;
              const isDone = !isRejected && (c.enrollmentStatus === 'COMPLETED' || pct >= 100);
              const isInProgress = !isRejected && (c.enrollmentStatus === 'IN_PROGRESS' || (pct > 0 && pct < 100));
              const isPending = !isRejected && (c.isPending || c.enrollmentStatus === 'NOT_STARTED' || c.enrollmentStatus === 'PENDING');
              const approvalTarget = c.approvalTarget || (c.hasTeam ? 'Leader' : 'HR');

              return (
                <div key={c.id} className={`glass-panel p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#1988A3]/40 transition-all ${isRejected ? 'border-rose-300' : ''}`}>
                  <div className="flex gap-5 items-start flex-1">
                    <div className={`p-4 rounded-2xl border shrink-0 ${isDone ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : isRejected ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' : isPending ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' : 'bg-[#1988A3]/10 border-[#1988A3]/20 text-[#1988A3]'}`}>
                      {isDone ? <CheckCircle2 className="w-6 h-6" /> : isRejected ? <XCircle className="w-6 h-6" /> : isPending ? <Clock className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {isDone ? (
                          <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> COMPLETED (100%)
                          </span>
                        ) : isInProgress ? (
                          <span className="bg-[#1988A3]/15 text-[#1988A3] border border-[#1988A3]/30 text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                            <Play className="w-3 h-3 fill-current" /> IN PROGRESS ({pct}%)
                          </span>
                        ) : isRejected ? (
                          <span className="bg-rose-500/10 text-rose-700 border border-rose-500/20 text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" /> REQUEST REJECTED
                          </span>
                        ) : isPending ? (
                          <span className="bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> PENDING {approvalTarget.toUpperCase()} APPROVAL
                          </span>
                        ) : (
                          <span className="bg-[#17233E]/10 text-[#17233E] border border-[#17233E]/20 text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                            <Check className="w-3 h-3" /> AUTHORIZED & ENROLLED
                          </span>
                        )}
                        <span className="text-xs text-[#8A9CB7] flex items-center gap-1 font-bold">
                          <Clock className="w-3.5 h-3.5" /> {c.durationHours || 12}h total
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-[#17233E] text-base md:text-lg mb-1">{c.title}</h3>
                      <p className="text-xs text-[#8A9CB7] mb-4 font-medium">{c.provider || 'YouTube Educational LMS'}</p>
                      
                      {/* Visual Progress Bar */}
                      <div className="flex items-center gap-4">
                        <div className="h-2 flex-1 bg-[#17233E]/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : isRejected ? 'bg-rose-400' : 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE]'}`} 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-[#17233E]">{pct}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                    {isDone ? (
                      <button 
                        onClick={() => handleLaunchCourse(c)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Review Course
                      </button>
                    ) : isInProgress ? (
                      <button 
                        onClick={() => handleLaunchCourse(c)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] shadow-sm transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Resume Player
                      </button>
                    ) : isRejected ? (
                      <button 
                        onClick={() => handleReEnroll(c.id)}
                        disabled={updatingId === c.id}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
                      >
                        {updatingId === c.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {updatingId === c.id ? 'Re-Submitting...' : '🔄 Try Again'}
                      </button>
                    ) : isPending ? (
                      <button 
                        disabled
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/20 cursor-not-allowed shadow-sm"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending {approvalTarget}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleLaunchCourse(c)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-[#17233E] hover:bg-[#1988A3] text-white shadow-sm transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> ▶ Start Course
                      </button>
                    )}

                    <button 
                      onClick={() => navigate(`/dashboard/courses?id=${c.id}`)}
                      className="border border-[#8A9CB7]/30 hover:bg-[#1988A3]/10 text-[#5A6D89] px-4 py-2 rounded-2xl font-bold text-xs transition-colors text-center"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 glass-panel rounded-[2.5rem] p-8 space-y-4">
              <div className="w-14 h-14 bg-[#1988A3]/10 text-[#1988A3] rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-[#17233E]">No Enrolled Courses Found</h4>
              <p className="text-xs text-[#5A6D89] max-w-sm mx-auto">
                Explore our catalog of verified educational courses linked to your skill gaps.
              </p>
              <button 
                onClick={() => navigate('/dashboard/learning')}
                className="px-6 py-2.5 bg-[#17233E] hover:bg-[#1988A3] text-white rounded-xl font-bold text-xs shadow-md transition-all"
              >
                Browse Learning Catalog
              </button>
            </div>
          )}
        </div>

        {/* Right Column: AI Skill Targets & Certificate Status */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#121E33] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1988A3]/15 blur-[80px] rounded-full -mr-16 -mt-16"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#1988A3]/20 text-[#11C6DE] px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#1988A3]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#11C6DE]" /> AI Skill Verification
              </div>
              
              <h3 className="text-xl md:text-2xl font-black leading-tight">Skill Gap Resolution Engine</h3>
              <p className="text-[#8A9CB7] text-xs leading-relaxed">
                Completing 100% courseware automatically resolves matching skill gaps and verifies your user skill profile.
              </p>
              
              <div className="space-y-3 pt-2">
                {gaps.length > 0 ? (
                  gaps.slice(0, 4).map((g) => {
                    const isResolved = g.currentLevel >= g.requiredLevel;
                    const statusText = isResolved
                      ? 'Resolved & Verified'
                      : `Target ${g.requiredLevel || 4.5} (${g.severity || 'Medium'})`;
                    return (
                      <SkillGainer 
                        key={g.id} 
                        label={g.skill?.name || 'Skill Gap'} 
                        status={statusText} 
                        isResolved={isResolved}
                      />
                    );
                  })
                ) : (
                  <SkillGainer label="All Profile Skill Gaps" status="100% Resolved & Verified 🎉" isResolved={true} />
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#17233E] text-sm">Enterprise Credentials</h4>
                <p className="text-[11px] text-[#5A6D89] font-medium">Digital certificates issued on 100% completion</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#8A9CB7]/20 text-xs font-semibold text-[#5A6D89] space-y-2">
              <div className="flex justify-between">
                <span>Verified Certificates:</span>
                <span className="font-bold text-[#17233E]">{completedCoursesCount} Issued</span>
              </div>
              <div className="flex justify-between">
                <span>Credential Status:</span>
                <span className="font-bold text-emerald-600">Verified & Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Video Player Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17233E]/80 backdrop-blur-md p-4 sm:p-6">
          <div className="bg-[#17233E] border border-white/10 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#121E33] px-6 py-4 border-b border-white/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1988A3]/20 border border-[#1988A3]/30 flex items-center justify-center text-[#11C6DE]">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#1988A3]/10 text-[#11C6DE] px-2 py-0.5 rounded border border-[#1988A3]/20">
                      {activeCourse.provider || 'YouTube Educational LMS'}
                    </span>
                    <span className="text-xs text-[#8A9CB7] font-medium">• {activeCourse.durationHours || 12} Hours Courseware</span>
                  </div>
                  <h3 className="font-bold text-white text-sm md:text-base leading-tight mt-0.5">{activeCourse.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveCourse(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#8A9CB7] hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="bg-[#17233E] px-6 py-2 border-b border-white/10 flex gap-4 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('video')}
                className={`py-2 px-3 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'video' ? 'bg-[#1988A3] text-white shadow-sm' : 'text-[#8A9CB7] hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" /> 1. Video Lecture Player
              </button>
              <button
                onClick={() => setActiveTab('modules')}
                className={`py-2 px-3 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'modules' ? 'bg-[#1988A3] text-white shadow-sm' : 'text-[#8A9CB7] hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> 2. AI Interactive Modules ({completedModules.length}/4)
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#121E33]">
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
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

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1988A3]/15 text-[#11C6DE] px-2 py-0.5 rounded border border-[#1988A3]/30">
                          Playing Chapter {currentModuleIdx + 1} of 4
                        </span>
                        <span className="text-xs text-[#8A9CB7] font-medium">• {MODULE_CHAPTERS[currentModuleIdx]?.duration}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{MODULE_CHAPTERS[currentModuleIdx]?.title}</h4>
                      <p className="text-[#8A9CB7] text-xs leading-relaxed max-w-2xl">{MODULE_CHAPTERS[currentModuleIdx]?.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={handleCompleteCurrentModuleVideo}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:brightness-110 text-[#17233E] shadow-lg shadow-[#1988A3]/30"
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
                            : 'bg-white/10 text-[#8A9CB7] border-white/10 hover:bg-white/20'
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
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-white' 
                            : 'bg-white/5 border-white/10 text-[#8A9CB7]'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 border ${
                          isChecked ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-white/10 bg-white/5 text-[#8A9CB7]'
                        }`}>
                          {isChecked ? <Check className="w-4 h-4" /> : <Lock className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-sm text-white">{mod.title}</h5>
                          <p className="text-[#8A9CB7] text-xs mt-0.5">{mod.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-[#121E33] p-5 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#8A9CB7] uppercase tracking-wider">Calculated Progress:</span>
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1988A3] to-[#11C6DE] transition-all duration-300" 
                    style={{ width: `${Math.round((completedModules.length / 4) * 100)}%` }}
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
const StatCard = ({ icon, label, value, subtext, color }) => {
  const themes = {
    cyan: 'bg-[#1988A3]/10 border border-[#1988A3]/20',
    navy: 'bg-[#17233E]/10 border border-[#17233E]/20',
    emerald: 'bg-emerald-500/10 border border-emerald-500/20',
    amber: 'bg-amber-500/10 border border-amber-500/20'
  };
  return (
    <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5">
      <div className={`p-4 rounded-2xl shrink-0 ${themes[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[#5A6D89] text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-[#17233E] leading-tight mb-0.5">{value}</h3>
        <p className="text-[#8A9CB7] text-[10px] font-bold">{subtext}</p>
      </div>
    </div>
  );
};

const SkillGainer = ({ label, status, isResolved }) => (
  <div className="flex justify-between items-center bg-white/5 border border-white/10 p-3.5 rounded-2xl">
    <span className="text-xs font-bold text-white">{label}</span>
    <span className={`text-xs font-black ${isResolved ? 'text-emerald-400' : 'text-[#11C6DE]'}`}>{status}</span>
  </div>
);

export default MyProgress;
