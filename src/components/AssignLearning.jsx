import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import SkillPulseLoader from './SkillPulseLoader'; 
import { teamLeaderAPI } from '../services/api';
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal,
  Check,
  Zap,
  Play,
  X,
  Loader2,
  AlertCircle,
  BookOpenCheck,
  Info
} from 'lucide-react';

const AssignLearning = () => {
  const [activeTab, setActiveTab] = useState('assign-learning');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Live DB State
  const [members, setMembers] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    availableProgramsCount: 0,
    assignedCount: 0,
    inProgressCount: 0,
    completionRate: '0%'
  });

  // Modal & Error State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeProgramToAssign, setActiveProgramToAssign] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [modalError, setModalError] = useState('');
  const [toastError, setToastError] = useState('');

  // 1. Fetch live assign learning data from backend
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await teamLeaderAPI.getAssignLearningData();
      if (res?.success && res.data) {
        setMembers(res.data.members || []);
        setAvailablePrograms(res.data.availableCourses || []);
        setEnrollments(res.data.enrollments || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
        if (res.data.members && res.data.members.length > 0 && selectedMemberIds.length === 0) {
          setSelectedMemberIds([res.data.members[0].id]);
        }
      }
    } catch (err) {
      console.warn('Error fetching assign learning data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleMemberSelection = (id) => {
    setModalError('');
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter(mId => mId !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleSelectAll = () => {
    setModalError('');
    if (selectedMemberIds.length === members.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(members.map(m => m.id));
    }
  };

  // 100% Real Multi-Factor AI Recommendation Engine for currently selected team recipients
  const dynamicRecommendations = useMemo(() => {
    const targetMembers = members.filter(m => selectedMemberIds.includes(m.id));
    const activeEvalMembers = targetMembers.length > 0 ? targetMembers : members;

    // Collect verified skill gaps for evaluated members
    const activeGaps = [];
    activeEvalMembers.forEach(m => {
      (m.skillGaps || []).forEach(g => {
        const sName = (g.skill?.name || '').trim();
        if (sName) {
          activeGaps.push({
            userId: m.id,
            userName: `${m.firstName} ${m.lastName}`.trim(),
            skillName: sName,
            severity: (g.severity || 'MEDIUM').toUpperCase(),
            currentLevel: Number(g.currentLevel) || 1.0,
            targetLevel: Number(g.targetLevel) || 4.0
          });
        }
      });
    });

    if (activeGaps.length === 0) {
      return [];
    }

    // Match and score available programs against active gaps
    const scoredMap = new Map();

    availablePrograms.forEach(prog => {
      // Pedagogical Logic: Do not recommend courses the member has already completed
      const isAlreadyCompleted = enrollments.some(en => 
        en.courseId === prog.id && 
        selectedMemberIds.includes(en.userId) && 
        (en.status === 'COMPLETED' || en.progressPct >= 100)
      );
      if (isAlreadyCompleted) return;

      const titleLower = (prog.title || '').toLowerCase();
      const descLower = (prog.description || '').toLowerCase();
      const progSkills = (prog.skillsTaught || []).map(st => (st.skill?.name || '').toLowerCase());

      let bestScore = 0;
      let matchedGap = null;
      const beneficiaries = new Set();
      let maxSeverity = 'NONE';

      activeGaps.forEach(gap => {
        // Pedagogical & System Logic: If this user is ALREADY enrolled or taking this program,
        // do not recommend this program to them again!
        const isUserAlreadyAssigned = enrollments.some(en => 
          en.courseId === prog.id && 
          en.userId === gap.userId &&
          en.status !== 'CANCELLED' && en.status !== 'DROPPED'
        );
        if (isUserAlreadyAssigned) return;

        const gapClean = gap.skillName.replace(/\s+/g, ' ').trim().toLowerCase();

        // High-Precision Match: Direct Taught Skill OR Direct Course Title Focus
        const directSkillMatch = progSkills.some(s => {
          const sClean = s.replace(/\s+/g, ' ').trim();
          return sClean === gapClean || sClean.includes(gapClean) || gapClean.includes(sClean);
        });

        const titleMatch = titleLower.includes(gapClean) || 
          (gapClean.includes('react') && titleLower.includes('react')) ||
          (gapClean.includes('figma') && titleLower.includes('figma')) ||
          (gapClean.includes('canva') && titleLower.includes('canva')) ||
          (gapClean.includes('problem solving') && titleLower.includes('problem solving'));

        const isMatch = directSkillMatch || titleMatch;

        if (isMatch) {
          beneficiaries.add(gap.userName);
          const sevBonus = gap.severity === 'CRITICAL' ? 40 : gap.severity === 'HIGH' ? 30 : 15;
          const deltaL = Math.max(0.5, gap.targetLevel - gap.currentLevel);
          const score = 55 + sevBonus + Math.min(10, deltaL * 2.5);

          if (score > bestScore) {
            bestScore = score;
            matchedGap = { ...gap, skillName: gap.skillName.replace(/\s+/g, ' ').trim() };
            maxSeverity = gap.severity;
          }
        }
      });

      if (bestScore >= 70 && matchedGap && beneficiaries.size > 0) {
        const impactTier = (maxSeverity === 'CRITICAL' || maxSeverity === 'HIGH') ? 'HIGH IMPACT' : 'MED IMPACT';
        const beneficiariesArr = Array.from(beneficiaries);
        const namesStr = beneficiariesArr.length === 1 
          ? beneficiariesArr[0] 
          : `${beneficiariesArr.length} selected members (${beneficiariesArr.slice(0, 2).join(', ')}${beneficiariesArr.length > 2 ? '...' : ''})`;

        const text = maxSeverity === 'CRITICAL'
          ? `Directly bridges CRITICAL skill gap in ${matchedGap.skillName} (Current: ${matchedGap.currentLevel}, Target: ${matchedGap.targetLevel}) for ${namesStr}. Eliminates active capability deficit.`
          : `Targeted training program designed to bridge ${maxSeverity} gap in ${matchedGap.skillName} for ${namesStr}.`;

        scoredMap.set(prog.id, {
          program: prog,
          impactTier,
          impactScore: bestScore,
          matchedSkill: matchedGap.skillName,
          text,
          severity: maxSeverity
        });
      }
    });

    const results = Array.from(scoredMap.values());
    results.sort((a, b) => b.impactScore - a.impactScore);
    return results;
  }, [availablePrograms, members, selectedMemberIds, enrollments]);

  const openAssignModal = (program = null) => {
    setModalError('');
    setActiveProgramToAssign(program);
    // If program resolves critical/high gap, preselect High priority
    const matchingRec = dynamicRecommendations.find(r => r.program.id === program?.id);
    if (matchingRec && (matchingRec.severity === 'CRITICAL' || matchingRec.severity === 'HIGH')) {
      setPriority('High');
    } else {
      setPriority('Medium');
    }
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    setModalError('');
    const courseId = activeProgramToAssign?.id || (availablePrograms.length > 0 ? availablePrograms[0].id : null);
    
    if (!courseId) {
      setModalError('Please select a valid course/program to assign.');
      return;
    }

    if (selectedMemberIds.length === 0) {
      setModalError('Please select at least one team member recipient.');
      return;
    }

    // Filter out members who already have this course assigned
    const unassignedMemberIds = selectedMemberIds.filter(uid => 
      !enrollments.some(en => en.courseId === courseId && en.userId === uid && en.status !== 'CANCELLED' && en.status !== 'DROPPED')
    );

    if (unassignedMemberIds.length === 0) {
      setModalError('All selected team member(s) already have this training program assigned.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        userIds: unassignedMemberIds,
        courseId,
        dueDate,
        priority,
        note: assignmentNote
      };
      const res = await teamLeaderAPI.assignTraining(payload);
      if (res?.success) {
        setToastMessage(res.message || 'Training assigned successfully!');
        setIsAssignModalOpen(false);
        setActiveProgramToAssign(null);
        setAssignmentNote('');
        setModalError('');
        loadData();
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      console.error('Failed to assign training:', err);
      setToastError('Failed to assign training. Please try again.');
      setTimeout(() => setToastError(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const leaderName = storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : 'Team Leader';

  // Filtered Programs - prioritized by AI Gap Closure relevance
  const filteredPrograms = useMemo(() => {
    const list = availablePrograms.filter(p => 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort matching AI Recommendations first
    const recIdSet = new Set(dynamicRecommendations.map(r => r.program.id));
    return list.sort((a, b) => {
      const aMatch = recIdSet.has(a.id);
      const bMatch = recIdSet.has(b.id);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [availablePrograms, searchQuery, dynamicRecommendations]);

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
      {/* Sidebar Component Integration */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Container Area */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 px-3.5 sm:px-6 md:px-8 py-4 sm:py-8 w-full relative z-10 space-y-4 sm:space-y-8">
        
        {/* Toast Notifications */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center justify-between font-bold text-sm">
            <div className="flex items-center gap-2">
              <Check size={18} />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="hover:opacity-80 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {toastError && (
          <div className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center justify-between font-bold text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{toastError}</span>
            </div>
            <button onClick={() => setToastError('')} className="hover:opacity-80 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Top Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#17233E] tracking-tight">Assign Learning to <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Team</span></h1>
            <p className="text-[#8A9CB7] text-sm md:text-base font-medium mt-1">Assign curated training programs based on critical skill gaps and growth goals</p>
          </div>
          
          {/* Header Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 md:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search training program..." 
                className="w-full bg-white/80 backdrop-blur-md text-[#17233E] border border-white/80 pl-10 pr-9 py-2.5 rounded-xl text-xs md:text-sm font-semibold focus:outline-none focus:border-[#1988A3] transition-all placeholder:text-[#8A9CB7] shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 shrink-0">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-tight">{leaderName}</p>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Team Leader</span>
              </div>
              <div className="w-10 h-10 rounded-2xl border border-white/60 bg-gradient-to-br from-[#17233E] via-[#1B3154] to-[#1988A3] flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm">
                TL
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="my-8">
            <SkillPulseLoader message="Querying Training Curriculums & Gaps..." fullScreen={false} />
          </div>
        ) : (
          <>
            {/* 1. Metrics Grid Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
              <TopMetricCard title="Available Programs" value={String(stats.availableProgramsCount)} extra="Global Catalog" color="bg-blue-50 text-blue-600">
                <BookOpenCheck size={20} />
              </TopMetricCard>

              <TopMetricCard title="Assigned to Team" value={String(stats.assignedCount)} extra="Active Enrollments" color="bg-purple-50 text-purple-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-2.533-3.076l-1.408-.393A10.031 10.031 0 0018 12.5c0-.43-.075-.847-.213-1.233M12.433 19.43l-.433.076-.433-.076M11.5 12.5c0 .43-.075.847-.213 1.233L9.88 14.128a4.125 4.125 0 00-2.533 3.076 9.337 9.337 0 004.121.952c.9 0 1.772-.126 2.599-.363M12 6.75a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zm0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /></svg>
              </TopMetricCard>

              <TopMetricCard title="Training In Progress" value={String(stats.inProgressCount)} extra="Ongoing" color="bg-amber-50 text-amber-600" extraColor="text-amber-600 font-bold">
                <Play size={18} fill="currentColor" />
              </TopMetricCard>

              <TopMetricCard title="Completion Rate" value={stats.completionRate} extra="Team Average" color="bg-emerald-50 text-emerald-600" extraColor="text-emerald-600 font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
              </TopMetricCard>
            </div>

            {/* 2. Content Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start">
              
              {/* LEFT: Available Training Programs Section */}
              <div className="col-span-1 lg:col-span-8 bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-4 sm:space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Available Training Programs</h3>
                  <span className="text-xs font-bold text-slate-400">{filteredPrograms.length} Programs</span>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[420px] border border-slate-100 rounded-2xl shadow-xs scrollbar-thin">
                  <table className="w-full min-w-[560px] text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 border-b border-slate-200">
                      <tr className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Training Name</th>
                        <th className="py-4 px-6">Skill Covered</th>
                        <th className="py-4 px-6">Difficulty</th>
                        <th className="py-4 px-6">Duration</th>
                        <th className="py-4 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/60 text-sm font-bold text-[#17233E] bg-[#E4EEF8]/30 backdrop-blur-xs">
                      {filteredPrograms.length > 0 ? (
                        filteredPrograms.map((program) => {
                          const skillTag = program.skillsTaught?.[0]?.skill?.name || 'Technical';
                          const diffLevel = program.level || 'INTERMEDIATE';
                          const diffColor = diffLevel === 'ADVANCED' 
                            ? 'text-rose-500' 
                            : diffLevel === 'INTERMEDIATE' 
                            ? 'text-amber-500' 
                            : 'text-emerald-500';

                          const recMatch = dynamicRecommendations.find(r => r.program.id === program.id);

                          const enrolledUsersForCourse = enrollments
                            .filter(en => en.courseId === program.id && en.status !== 'CANCELLED' && en.status !== 'DROPPED')
                            .map(en => {
                              if (en.user) return `${en.user.firstName} ${en.user.lastName}`.trim();
                              const found = members.find(m => m.id === en.userId);
                              return found ? `${found.firstName} ${found.lastName}`.trim() : 'Team Member';
                            });
                          const assignedUsers = Array.from(new Set(enrolledUsersForCourse));

                          // Check if all selected members already have this training assigned
                          const isAssignedToSelected = selectedMemberIds.length > 0 &&
                            selectedMemberIds.every(uid => enrollments.some(en => 
                              en.courseId === program.id && 
                              en.userId === uid && 
                              en.status !== 'CANCELLED' && 
                              en.status !== 'DROPPED'
                            ));

                          return (
                            <TrainingRow 
                              key={program.id}
                              name={program.title} 
                              domain={program.provider || 'Course'} 
                              skill={skillTag} 
                              skillColor="bg-blue-50 text-blue-600 border-blue-100/50" 
                              diff={diffLevel} 
                              diffColor={diffColor} 
                              duration={`${program.durationHours || 6}h`} 
                              aiBadge={recMatch ? recMatch.impactTier : null}
                              assignedUsers={assignedUsers}
                              isAssignedToSelected={isAssignedToSelected}
                              onAssign={() => openAssignModal(program)}
                            />
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-slate-400 text-sm font-medium">
                            No training programs match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Sub-Section: Assigned Training Tracker with Vertical Scroll */}
                <div className="pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Assigned Training Tracker</h3>
                    <span className="text-xs font-bold text-slate-400">{enrollments.length} Assignments</span>
                  </div>
                  <div className="overflow-x-auto overflow-y-auto max-h-[360px] border border-slate-100 rounded-2xl shadow-xs scrollbar-thin">
                    <table className="w-full min-w-[560px] text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 border-b border-slate-200">
                        <tr className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                          <th className="py-4 px-6">Training Name</th>
                          <th className="py-4 px-6">Assigned To</th>
                          <th className="py-4 px-6">Date</th>
                          <th className="py-4 px-6">Progress</th>
                          <th className="py-4 px-6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/60 text-sm font-bold text-[#17233E] bg-[#E4EEF8]/30 backdrop-blur-xs">
                        {enrollments.length > 0 ? (
                          enrollments.map((en) => {
                            const isDone = en.status === 'COMPLETED' || en.progressPct >= 100;
                            const statusLabel = isDone ? 'Completed' : 'In Progress';
                            const statusStyle = isDone 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                              : 'bg-blue-50 text-blue-600 border-blue-100/50';
                            const progressColor = isDone ? 'bg-emerald-500' : 'bg-blue-500';
                            const userName = en.user ? `${en.user.firstName} ${en.user.lastName}` : 'Team Member';
                            const initials = en.user ? `${en.user.firstName?.[0] || 'T'}${en.user.lastName?.[0] || 'M'}` : 'TM';

                            return (
                              <TrackerRow 
                                key={en.id}
                                name={en.course?.title || 'Assigned Training'} 
                                user={userName} 
                                img={en.user?.avatarUrl}
                                initials={initials}
                                date={new Date(en.createdAt).toLocaleDateString()} 
                                progress={Math.round(en.progressPct || 0)} 
                                status={statusLabel} 
                                statusStyle={statusStyle} 
                                progressColor={progressColor} 
                              />
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-slate-400 text-sm font-medium">
                              No active training assignments for your team yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* RIGHT: Select Team Members, Recs, & Action Box */}
              <div className="col-span-1 lg:col-span-4 space-y-4 sm:space-y-6">
                
                {/* Box 1: Select Team Members */}
                <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Select Team Members</h3>
                    <button 
                      onClick={handleSelectAll} 
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      {selectedMemberIds.length === members.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {members.length > 0 ? (
                      members.map((member) => {
                        const fullName = `${member.firstName} ${member.lastName}`;
                        const gapCount = member.skillGaps?.length || 0;
                        const gapTag = gapCount > 0 ? `GAP: ${gapCount}` : 'NO GAPS';
                        const gapStyle = gapCount > 0 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200';
                        const initials = `${member.firstName?.[0] || 'T'}${member.lastName?.[0] || 'M'}`;

                        return (
                          <MemberCheckRow 
                            key={member.id}
                            name={fullName} 
                            role={member.jobTitle || member.role || 'Member'} 
                            gap={gapTag} 
                            gapStyle={gapStyle}
                            img={member.avatarUrl}
                            initials={initials}
                            isSelected={selectedMemberIds.includes(member.id)}
                            onToggle={() => toggleMemberSelection(member.id)}
                          />
                        );
                      })
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400 font-medium">
                        No members assigned to your team yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Box 2: AI Recommended Block */}
                <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-600">
                      <Zap size={18} fill="currentColor" />
                      <h3 className="text-base font-black tracking-tight">AI Recommended</h3>
                    </div>
                    {dynamicRecommendations.length > 0 && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                        {dynamicRecommendations.length} Gap {dynamicRecommendations.length === 1 ? 'Match' : 'Matches'}
                      </span>
                    )}
                  </div>

                    <div className="space-y-4">
                    {dynamicRecommendations.length > 0 ? (
                      dynamicRecommendations.slice(0, 3).map((rec) => (
                        <RecommendationCard 
                          key={rec.program.id}
                          title={rec.program.title} 
                          level={rec.impactTier} 
                          levelStyle={rec.impactTier === "HIGH IMPACT" 
                            ? "text-purple-700 bg-purple-50 border border-purple-200" 
                            : "text-amber-700 bg-amber-50 border border-amber-200"
                          } 
                          text={rec.text} 
                          onAction={() => openAssignModal(rec.program)}
                        />
                      ))
                    ) : (
                      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold text-xs">
                          <Check size={16} />
                          <span>All Identified Gaps Covered</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Selected team members currently have active training programs assigned for their skill gaps or meet proficiency targets. Browse the training catalog on the left for optional development courses.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Box 3: Dark Actions Block */}
                <div className="bg-[#0b0f19] p-6 rounded-[2.5rem] text-white shadow-xl space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-1">Actions</h3>
                  <button 
                    onClick={() => openAssignModal()}
                    disabled={selectedMemberIds.length === 0 || availablePrograms.length === 0}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Assign Selected ({selectedMemberIds.length})
                  </button>
                  <button 
                    onClick={handleSelectAll}
                    className="w-full py-3.5 bg-[#131926] hover:bg-[#1a2233] text-slate-300 border border-slate-800 font-bold text-sm rounded-xl transition-all text-center cursor-pointer"
                  >
                    {selectedMemberIds.length === members.length ? 'Deselect All Members' : 'Select Entire Team'}
                  </button>
                </div>

              </div>
            </div>
          </>
        )}

      </main>

      {/* Assignment Modal Drawer */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Training Assignment</h3>
                <p className="text-xs text-blue-600 font-bold mt-0.5">
                  {activeProgramToAssign ? activeProgramToAssign.title : 'Selected Training Program'}
                </p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-4">
              {modalError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={18} className="text-rose-500 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                  <button type="button" onClick={() => setModalError('')} className="text-rose-400 hover:text-rose-600 p-1 cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assigned Recipients ({selectedMemberIds.length})</label>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {selectedMemberIds.length > 0 ? (
                    members.filter(m => selectedMemberIds.includes(m.id)).map((m) => (
                      <span key={m.id} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1 rounded-full font-bold">
                        {m.firstName} {m.lastName}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-rose-500 font-bold bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
                      No team members selected. Please select at least one recipient.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Program</label>
                <select
                  value={activeProgramToAssign?.id || ''}
                  onChange={(e) => {
                    const prog = availablePrograms.find(p => p.id === e.target.value);
                    if (prog) setActiveProgramToAssign(prog);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {availablePrograms.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                {(() => {
                  const currentCourseId = activeProgramToAssign?.id || (availablePrograms.length > 0 ? availablePrograms[0].id : null);
                  const alreadyAssigned = members
                    .filter(m => selectedMemberIds.includes(m.id) && enrollments.some(en => en.courseId === currentCourseId && en.userId === m.id && en.status !== 'CANCELLED' && en.status !== 'DROPPED'))
                    .map(m => `${m.firstName} ${m.lastName}`);

                  if (alreadyAssigned.length > 0) {
                    const allAreAssigned = alreadyAssigned.length === selectedMemberIds.length;
                    return (
                      <div className={`mt-2 border px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        allAreAssigned 
                          ? 'bg-rose-50 border-rose-200 text-rose-800' 
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}>
                        <AlertCircle size={15} className={`shrink-0 ${allAreAssigned ? 'text-rose-600' : 'text-amber-600'}`} />
                        <span>
                          {allAreAssigned 
                            ? `Already actively assigned to ${alreadyAssigned.join(', ')}. Duplicate assignment is not allowed.`
                            : `Already assigned to ${alreadyAssigned.join(', ')}. Training will only be assigned to members without an active enrollment.`
                          }
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  required 
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Note for Assignees (Optional)</label>
                <textarea 
                  rows={3} 
                  value={assignmentNote} 
                  onChange={(e) => setAssignmentNote(e.target.value)} 
                  placeholder="Provide context or learning objectives..." 
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAssignModalOpen(false)} 
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                {(() => {
                  const currentCourseId = activeProgramToAssign?.id || (availablePrograms.length > 0 ? availablePrograms[0].id : null);
                  const isAllAssigned = selectedMemberIds.length > 0 && selectedMemberIds.every(uid => 
                    enrollments.some(en => en.courseId === currentCourseId && en.userId === uid && en.status !== 'CANCELLED' && en.status !== 'DROPPED')
                  );
                  return (
                    <button 
                      type="submit" 
                      disabled={submitting || isAllAssigned || selectedMemberIds.length === 0}
                      className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : isAllAssigned ? (
                        'Already Assigned'
                      ) : (
                        'Confirm & Send'
                      )}
                    </button>
                  );
                })()}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Component Helpers --- */
const TopMetricCard = ({ title, value, extra, color, extraColor = "text-[#8A9CB7]", children }) => (
  <div className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex items-center justify-between group hover:border-[#1988A3]/40 transition-all">
    <div className="space-y-1">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
      <p className={`text-xs font-semibold ${extraColor}`}>{extra}</p>
    </div>
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
      {children}
    </div>
  </div>
);

const TrainingRow = ({ name, domain, skill, skillColor, diff, diffColor, duration, aiBadge, assignedUsers = [], isAssignedToSelected = false, onAssign }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="py-4 px-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-extrabold text-slate-900 leading-tight">{name}</span>
        {aiBadge && (
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${
            aiBadge === 'HIGH IMPACT'
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {aiBadge}
          </span>
        )}
        {assignedUsers.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
            <Check size={11} strokeWidth={3} />
            Assigned to {assignedUsers.join(', ')}
          </span>
        )}
      </div>
      <div className="text-xs text-slate-400 font-medium mt-0.5">{domain}</div>
    </td>
    <td className="py-4 px-6">
      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${skillColor}`}>
        {skill}
      </span>
    </td>
    <td className="py-4 px-6">
      <div className={`flex items-center gap-1.5 text-xs font-bold ${diffColor}`}>
        <span className="w-1.5 h-1.5 rounded-full fill-current bg-current"></span>
        {diff}
      </div>
    </td>
    <td className="py-4 px-6 text-slate-400 font-bold text-xs">{duration}</td>
    <td className="py-4 px-6 text-center">
      {isAssignedToSelected ? (
        <span 
          className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl cursor-default whitespace-nowrap shadow-xs"
          title="Already assigned to selected team member(s)"
        >
          <Check size={12} strokeWidth={3} />
          Already Assigned
        </span>
      ) : (
        <button 
          onClick={onAssign}
          className="bg-[#0b1221] hover:bg-[#151f33] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          Assign
        </button>
      )}
    </td>
  </tr>
);

const TrackerRow = ({ name, user, img, initials, date, progress, status, statusStyle, progressColor }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="py-4 px-6 text-slate-900 font-extrabold">{name}</td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-2.5">
        {img ? (
          <img src={img} alt={user} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">
            {initials || user.slice(0, 2).toUpperCase()}
          </div>
        )}
        <span className="text-slate-700 text-xs font-bold">{user}</span>
      </div>
    </td>
    <td className="py-4 px-6 text-slate-400 font-medium text-xs">{date}</td>
    <td className="py-4 px-6 w-36">
      <div className="flex items-center gap-3">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${progressColor}`} style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs font-black text-slate-600">{progress}%</span>
      </div>
    </td>
    <td className="py-4 px-6">
      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusStyle}`}>
        {status}
      </span>
    </td>
  </tr>
);

const MemberCheckRow = ({ name, role, gap, gapStyle, img, initials, isSelected, onToggle }) => (
  <div 
    onClick={onToggle}
    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
      isSelected ? 'bg-blue-500/15 border-[#1988A3] shadow-sm' : 'bg-[#E4EEF8]/60 backdrop-blur-md border border-white/85 hover:border-[#1988A3]/50 hover:bg-[#E4EEF8]/90'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
      }`}>
        {isSelected && <Check size={12} strokeWidth={3} />}
      </div>
      {img ? (
        <img src={img} alt={name} className="w-9 h-9 rounded-full object-cover" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
          {initials || name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div>
        <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{name}</h4>
        <p className="text-xs text-slate-400 font-medium">{role}</p>
      </div>
    </div>
    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${gapStyle}`}>
      {gap}
    </span>
  </div>
);

const RecommendationCard = ({ title, level, levelStyle, text, onAction }) => (
  <div className="p-4 bg-[#E4EEF8]/60 backdrop-blur-md rounded-2xl border border-white/85 flex flex-col gap-3 shadow-sm">
    <div className="flex justify-between items-start gap-2">
      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{title}</h4>
      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${levelStyle}`}>
        {level}
      </span>
    </div>
    <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
    <button 
      onClick={onAction}
      className="w-full mt-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
    >
      Assign Training
    </button>
  </div>
);

export default AssignLearning;