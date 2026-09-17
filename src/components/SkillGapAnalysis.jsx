import React, { useState, useEffect } from 'react';
import TeamLeaderSidebar from './TeamLeaderSidebar'; 
import { teamLeaderAPI } from '../services/api';
import { 
  ChevronDown, 
  Search, 
  Download, 
  TrendingUp, 
  Flame, 
  ShieldAlert, 
  AlertTriangle,
  Layers,
  BrainCircuit,
  Sparkles,
  X,
  CheckCircle2,
  Users,
  FileText,
  Loader2
} from 'lucide-react';

export default function SkillGapAnalysis() {
  const [activeTab, setActiveTab] = useState('skill-gap');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [gapData, setGapData] = useState(null);
  const [assigningTrack, setAssigningTrack] = useState(false);
  
  // Interactive Modals & Toast State
  const [activeModal, setActiveModal] = useState(null); // 'assign', 'report', 'profiles'
  const [selectedGap, setSelectedGap] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadGapsData = async () => {
      setLoading(true);
      try {
        const res = await teamLeaderAPI.getGaps();
        if (isMounted && res?.success && res.data) {
          setGapData(res.data);
        }
      } catch (err) {
        console.warn('Error loading team skill gaps data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadGapsData();
    return () => { isMounted = false; };
  }, []);

  const gapsData = gapData?.gaps || [];
  const heatmapMatrix = gapData?.heatmapMatrix || { skills: [], members: [] };
  const stats = gapData?.stats || {
    totalGaps: 0,
    criticalGaps: 0,
    moderateGaps: 0,
    distinctSkillsCount: 0,
    resolutionProgress: '0%'
  };
  const categoryOptions = gapData?.categories || ['All'];
  const teamMemberList = gapData?.members || [];

  // Filter Data Logic
  const filteredGaps = gapsData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.training.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === 'All' || item.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const handleOpenAssignModal = (gap) => {
    setSelectedGap(gap);
    setActiveModal('assign');
  };

  const handleConfirmAssignment = async () => {
    try {
      setAssigningTrack(true);
      if (selectedGap) {
        await teamLeaderAPI.assignTraining({
          userId: selectedGap.userId,
          skillId: selectedGap.skillId,
          trainingTitle: selectedGap.training
        });
        setToastMessage(`Training track assigned to ${selectedGap.name}! Active now on employee portal.`);
      } else {
        const memberIdsToAssign = Array.from(new Set(gapsData.map(g => g.userId)));
        if (memberIdsToAssign.length > 0) {
          await teamLeaderAPI.assignTraining({
            userIds: memberIdsToAssign,
            trainingTitle: 'Enterprise Skill Gap Resolution Track'
          });
        }
        setToastMessage(`Training tracks assigned to team members! Active now on employee portals.`);
      }
      setTimeout(() => setToastMessage(''), 3500);
      setActiveModal(null);
      
      // Refetch live gaps data to display updated course assignment status
      const res = await teamLeaderAPI.getGaps();
      if (res?.success && res.data) {
        setGapData(res.data);
      }
    } catch (err) {
      console.warn('Error assigning training:', err);
      setActiveModal(null);
    } finally {
      setAssigningTrack(false);
    }
  };

  const handleExportCSV = () => {
    if (!gapsData || gapsData.length === 0) {
      setToastMessage('No skill gap records available to export.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    const headers = ["Member Name", "Job Role", "Skill Category", "Missing Skill", "Required Level", "Current Level", "Severity", "Recommended Training"];
    const rows = filteredGaps.map(g => [
      `"${(g.name || '').replace(/"/g, '""')}"`,
      `"${(g.role || '').replace(/"/g, '""')}"`,
      `"${(g.category || '').replace(/"/g, '""')}"`,
      `"${(g.skill || '').replace(/"/g, '""')}"`,
      g.required ?? 4.5,
      g.current ?? 2.0,
      `"${(g.severity || '').replace(/"/g, '""')}"`,
      `"${(g.training || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `team_skill_gaps_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage('Skill Gap Analysis CSV report successfully exported!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleExportSummaryReport = () => {
    if (!gapsData || gapsData.length === 0) {
      setToastMessage('No skill gap records available for report generation.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    const reportTitle = "SKILLPULSE - TEAM SKILL GAP EXECUTIVE REPORT\n";
    const timestamp = `Generated At: ${new Date().toLocaleString()}\n`;
    const lineDivider = "=====================================================\n\n";

    const statsHeader = `METRICS SUMMARY:\n- Total Active Skill Gaps: ${stats.totalGaps}\n- Critical Priority Gaps: ${stats.criticalGaps}\n- Moderate Priority Gaps: ${stats.moderateGaps}\n- Resolution Progress: ${stats.resolutionProgress}\n\n`;

    const gapDetails = `INDIVIDUAL GAP BREAKDOWN:\n` + filteredGaps.map((g, idx) => 
      `${idx + 1}. Member: ${g.name} (${g.role})\n   Skill: ${g.skill} [Category: ${g.category}]\n   Proficiency: ${g.current} / Required: ${g.required} (Severity: ${g.severity})\n   Recommended Action: ${g.training}\n`
    ).join('\n');

    const fullReportContent = reportTitle + timestamp + lineDivider + statsHeader + gapDetails;

    const blob = new Blob([fullReportContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `team_skill_gap_executive_report_${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage('Executive Gap Report summary successfully downloaded!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      
      {/* Constant Sidebar */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area - Fluid full width */}
      <main className="flex-1 ml-72 p-10 w-full space-y-8">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#0b1221] tracking-tight">Skill Gap Analysis (Team)</h1>
            <p className="text-slate-500 text-sm font-semibold mt-1">Identify missing skills and analyze deficiencies to improve team capability</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Skill Category Dropdown Filter */}
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-slate-200 pl-5 pr-10 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'All Skill Categories' : cat}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Severity Dropdown Filter */}
            <div className="relative">
              <select 
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="appearance-none bg-white border border-slate-200 pl-10 pr-10 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical Severity</option>
                <option value="High">High Severity</option>
                <option value="Low">Low Severity</option>
              </select>
              <AlertTriangle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </header>

        {/* 1. Top Performance Metrics Cards */}
        <div className="grid grid-cols-4 gap-6">
          <OverviewMetricCard 
            title="Total Gaps" 
            value={stats.totalGaps} 
            badgeText={`Across ${stats.distinctSkillsCount || 0} Skills`}
            icon={<Layers className="text-blue-500 bg-blue-50 p-1.5 rounded-lg" size={36} />} 
          />
          <OverviewMetricCard 
            title="Critical Gaps" 
            value={stats.criticalGaps} 
            subValue="High Priority"
            subValueColor="bg-rose-50 text-rose-600 border border-rose-100"
            icon={<Flame className="text-rose-500 bg-rose-50 p-1.5 rounded-lg" size={36} />} 
          />
          <OverviewMetricCard 
            title="Moderate Gaps" 
            value={stats.moderateGaps} 
            subValue="Active"
            subValueColor="text-slate-600"
            icon={<ShieldAlert className="text-amber-500 bg-amber-50 p-1.5 rounded-lg" size={36} />} 
          />
          <OverviewMetricCard 
            title="Resolution Progress" 
            value={stats.resolutionProgress} 
            subValue="Trend Up"
            icon={<TrendingUp className="text-emerald-500 bg-emerald-50 p-1.5 rounded-lg" size={36} />} 
            isTrendUp={true}
          />
        </div>

        {/* 2. Team Skill Gap Analysis Block */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Team Skill Gap Analysis</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search member or skill..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl pl-11 pr-4 py-2 text-xs font-semibold text-slate-700 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>
              <button 
                onClick={handleExportCSV}
                className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded-xl hover:bg-blue-50/50 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                title="Export Gap Data to CSV"
              >
                <Download size={18} />
                <span className="text-xs font-bold hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table Headers */}
          <div className="space-y-4">
            <div className="flex text-xs font-black text-slate-400 uppercase tracking-widest px-6 pb-1">
              <div className="w-[22%]">MEMBER NAME</div>
              <div className="w-[20%]">MISSING SKILL</div>
              <div className="w-[12%] text-center">REQ. / CUR.</div>
              <div className="w-[12%] text-center">SEVERITY</div>
              <div className="w-[24%]">RECOMMENDED TRAINING</div>
              <div className="w-[10%] text-right">ACTION</div>
            </div>
            
            {/* Table Rows */}
            <div className="space-y-3.5">
              {filteredGaps.length > 0 ? (
                filteredGaps.map((row) => (
                  <AnalysisRow 
                    key={row.id} 
                    data={row} 
                    onAssign={() => handleOpenAssignModal(row)} 
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-bold">
                  {loading ? 'Loading team skill gap metrics...' : `No skill gaps match the current filters or search query.`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Team Skill Gap Heatmap Section */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Team Skill Gap Heatmap</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Color intensity indicates severity of skill gaps across the team</p>
            </div>
            <div className="flex items-center gap-5 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#EF4444]"></span><span>Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#F97316]"></span><span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#3B82F6]"></span><span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#FFFDF5] border border-amber-100"></span><span>No Gap</span>
              </div>
            </div>
          </div>

          {/* Visual Heatmap Grid Element */}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] space-y-4">
              <div className="flex items-center text-center">
                <div className="w-[15%] text-left"></div>
                <div className="w-[85%] grid grid-cols-6 gap-3 text-xs font-black text-slate-400 tracking-widest">
                  {(heatmapMatrix.skills || []).map((skill, index) => (
                    <div key={index}>{skill}</div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {(heatmapMatrix.members || []).map((member, rIdx) => (
                  <div key={rIdx} className="flex items-center">
                    <div className="w-[15%] text-xs font-black text-slate-700 truncate pr-2">{member.name}</div>
                    <div className="w-[85%] grid grid-cols-6 gap-3">
                      {(member.cells || []).map((cellType, cIdx) => {
                        let cellBg = "bg-[#FFFDF4]/70 border border-amber-100/50";
                        if (cellType === 'critical') cellBg = "bg-[#EF4444]";
                        if (cellType === 'high') cellBg = "bg-[#F97316]";
                        if (cellType === 'low') cellBg = "bg-[#3B82F6]";
                        return (
                          <div 
                            key={cIdx} 
                            className={`h-14 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer ${cellBg}`}
                            title={`${member.name} - ${heatmapMatrix.skills[cIdx]}: ${cellType.toUpperCase()}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. AI Skill Gap Intelligence */}
        <div className="bg-[#F3F6FF] rounded-[2.5rem] p-8 border border-blue-100/60 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Skill Gap Intelligence</h3>
              <p className="text-slate-500 text-xs font-semibold">Predictive deficiency analysis and automated recommendations</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <AIIntelligenceCard 
              type="CRITICAL WARNING"
              typeColor="bg-rose-50 text-rose-600 border-rose-100"
              confidence="96%"
              title={gapsData[0] ? `${gapsData[0].skill} Deficiency` : "Core Capability Warning"}
              description={gapsData[0] 
                ? `Detected a ${gapsData[0].severity.toLowerCase()} deficiency for ${gapsData[0].name} in ${gapsData[0].skill}. Early resolution recommended.`
                : "Detected core capability constraints across active projects."}
              actionText="View Solution"
              onAction={() => handleOpenAssignModal(gapsData[0] || null)}
            />
            <AIIntelligenceCard 
              type="GROWTH PATH"
              typeColor="bg-blue-50 text-blue-600 border-blue-100"
              confidence="89%"
              title="Targeted Skill Upskilling"
              description={gapsData[1] 
                ? `Fast-tracking ${gapsData[1].name} into ${gapsData[1].training} will remove team dependencies.`
                : "Assigning targeted training tracks mitigates team skill bottlenecks efficiently."}
              actionText="Assign Path"
              onAction={() => handleOpenAssignModal(gapsData[1] || gapsData[0] || null)}
            />
            <AIIntelligenceCard 
              type="SKILL SUCCESS"
              typeColor="bg-emerald-50 text-emerald-600 border-emerald-100"
              confidence="92%"
              title="Resolution Velocity"
              description={`Current team gap resolution progress stands at ${stats.resolutionProgress}. Optimized for project deployment.`}
              actionText="View Progress"
              onAction={() => setActiveModal('report')}
            />
          </div>
        </div>

        {/* 5. Skill Gap Resolution Actions Footer */}
        <div className="bg-[#0b111e] p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl">
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-1">Skill Gap Resolution Actions</h3>
            <p className="text-slate-400 text-xs font-semibold">Surgical interventions to bridge identified technical deficiencies</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleOpenAssignModal(null)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              Assign Training
            </button>
            <button 
              onClick={() => setActiveModal('report')}
              className="px-6 py-3 bg-[#182235] hover:bg-[#202c44] text-slate-300 font-bold text-xs border border-slate-800 rounded-2xl transition-all cursor-pointer"
            >
              Generate Gap Report
            </button>
            <button 
              onClick={() => setActiveModal('profiles')}
              className="px-6 py-3 bg-[#182235] hover:bg-[#202c44] text-slate-300 font-bold text-xs border border-slate-800 rounded-2xl transition-all cursor-pointer"
            >
              View Team Profiles
            </button>
          </div>
        </div>

      </main>

      {/* --- Action Modals --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          
          {/* 1. Assign Training Modal */}
          {activeModal === 'assign' && (
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-blue-600" size={20} />
                  <h3 className="text-lg font-bold text-slate-900">Assign Training Intervention</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {selectedGap ? (
                  <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                      {selectedGap.initials || 'EM'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{selectedGap.name}</p>
                      <p className="text-xs text-slate-500">{selectedGap.role} • Skill: <span className="font-bold text-slate-800">{selectedGap.skill}</span></p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-slate-600">Assign targeted upskilling tracks to all team members with active gaps.</p>
                )}

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Recommended Course Module</label>
                  <input 
                    type="text" 
                    readOnly
                    value={selectedGap ? selectedGap.training : 'Enterprise Skill Gap Resolution Track'} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setActiveModal(null)} className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmAssignment} 
                  disabled={assigningTrack}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {assigningTrack && <Loader2 size={14} className="animate-spin" />}
                  <span>{assigningTrack ? 'Assigning...' : 'Confirm Assignment'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Generate Gap Report Modal */}
          {activeModal === 'report' && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <FileText size={20} />
                  <h3 className="text-lg font-bold text-slate-900">Skill Gap Executive Report</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Choose an analytical export format to download current team capability deficits, severity breakdowns, and training recommendations.
              </p>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => {
                    handleExportCSV();
                    setActiveModal(null);
                  }} 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  <span>Download Spreadsheet (.CSV)</span>
                </button>

                <button 
                  onClick={() => {
                    handleExportSummaryReport();
                    setActiveModal(null);
                  }} 
                  className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText size={14} />
                  <span>Download Executive Summary (.TXT)</span>
                </button>

                <button onClick={() => setActiveModal(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* 3. Team Profiles Modal */}
          {activeModal === 'profiles' && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <Users size={20} />
                  <h3 className="text-lg font-bold text-slate-900">Team Profiles Overview</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {teamMemberList.length > 0 ? (
                  teamMemberList.map((m) => (
                    <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{m.name}</p>
                        <p className="text-[10px] text-slate-400">{m.role}</p>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                        Active Member
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No team member profiles found.</p>
                )}
              </div>

              <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
                Close
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

/* --- Helpers --- */

const OverviewMetricCard = ({ title, value, badgeText, subValue, subValueColor, icon, isTrendUp }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden">
    <div className="flex justify-between items-start">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      {icon}
    </div>
    <div className="mt-4 flex justify-between items-end">
      <div>
        <h4 className="text-4xl font-black tracking-tight text-slate-900">{value}</h4>
        {subValue && (
          <span className={`inline-block text-xs font-black px-2.5 py-1 rounded-lg mt-2 ${subValueColor || 'text-slate-400'}`}>
            {subValue}
          </span>
        )}
      </div>
      {badgeText && (
        <span className="px-3 py-1.5 bg-[#FFF9ED] text-[#B16A00] text-xs font-black rounded-xl border border-[#FFF0D4]">
          {badgeText}
        </span>
      )}
      {isTrendUp && (
        <span className="flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
          <TrendingUp size={12} strokeWidth={3} /> Trend Up
        </span>
      )}
    </div>
  </div>
);

const AnalysisRow = ({ data, onAssign }) => {
  let severityBadge = "bg-blue-50 text-blue-600 border border-blue-100";
  if (data.severity === 'Critical') severityBadge = "bg-rose-50 text-rose-600 border border-rose-100";
  if (data.severity === 'High') severityBadge = "bg-amber-50 text-amber-600 border border-amber-100";

  return (
    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200/80 hover:bg-white transition-all shadow-sm">
      <div className="flex items-center gap-4 w-[22%]">
        <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-black text-blue-700 shadow-sm shrink-0">
          {data.initials || 'EM'}
        </div>
        <div>
          <p className="text-base font-black text-slate-900 leading-tight">{data.name}</p>
          <p className="text-sm font-bold text-slate-400 mt-1">{data.role}</p>
        </div>
      </div>
      
      <div className="w-[20%]">
        <span className="bg-[#FFFDF4]/80 border border-amber-200/40 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
          {data.skill}
        </span>
      </div>

      <div className="w-[12%] text-center text-sm font-black text-slate-800 tracking-wide">
        {data.required.toFixed(1)} <span className="text-slate-300 font-medium mx-0.5">/</span> <span className="text-rose-500">{data.current.toFixed(1)}</span>
      </div>

      <div className="w-[12%] flex justify-center">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${severityBadge}`}>
          {data.severity}
        </span>
      </div>

      <div className="w-[24%] text-sm font-semibold text-slate-600">{data.training}</div>

      <div className="w-[10%] flex justify-end">
        <button 
          onClick={onAssign}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow-md"
        >
          Assign
        </button>
      </div>
    </div>
  );
};

const AIIntelligenceCard = ({ type, typeColor, confidence, title, description, actionText, onAction }) => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 border rounded-md uppercase ${typeColor}`}>
          {type}
        </span>
        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
          <Sparkles size={12} className="text-blue-500" /> {confidence} Conf.
        </span>
      </div>
      <h4 className="text-lg font-black text-slate-900 tracking-tight">{title}</h4>
      <p className="text-sm text-slate-500 font-semibold leading-relaxed mt-2">{description}</p>
    </div>
    
    <button 
      onClick={onAction}
      className="text-blue-600 hover:text-blue-700 text-xs font-black text-left w-max pt-2 transition-all hover:underline"
    >
      {actionText} →
    </button>
  </div>
);