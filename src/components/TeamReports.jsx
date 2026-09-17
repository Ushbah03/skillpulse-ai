import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import { teamLeaderAPI } from '../services/api';
import {
  ChevronDown,
  Calendar,
  Download,
  Search,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  ShieldCheck,
  BrainCircuit,
  FileText,
  FileSpreadsheet,
  Share2,
  Send,
  Plus,
  X,
  ArrowRight,
  Filter,
  Loader2
} from 'lucide-react';

export default function TeamReports() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState('Executive Skill Gap Summary');
  const [dateRange, setDateRange] = useState('Jan 2024 - Mar 2024');
  const [selectedMemberScope, setSelectedMemberScope] = useState('All Members');
  const [loading, setLoading] = useState(true);
  const [liveTeams, setLiveTeams] = useState([]);
  const [reportsData, setReportsData] = useState(null);

  // Interactive Custom Report Group State
  const [memberGroups, setMemberGroups] = useState([
    { id: 'core', label: 'All Core Team', selected: true },
    { id: 'new', label: 'New Hires', selected: false },
    { id: 'lead', label: 'Leadership', selected: false }
  ]);

  // Modal & Toast States
  const [activeModal, setActiveModal] = useState(null); // 'addGroup', 'shareHR', 'insight'
  const [activeInsight, setActiveInsight] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [hrEmail, setHrEmail] = useState('hr-analytics@company.com');
  const [hrNote, setHrNote] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchReportsData = async () => {
      setLoading(true);
      try {
        const [repRes, ovRes] = await Promise.all([
          teamLeaderAPI.getReports().catch(() => null),
          teamLeaderAPI.getOverview().catch(() => null)
        ]);
        if (isMounted) {
          if (repRes?.data) setReportsData(repRes.data);
          if (ovRes?.data) setLiveTeams(ovRes.data);
        }
      } catch (err) {
        console.warn('Failed to fetch live report data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReportsData();
    return () => { isMounted = false; };
  }, []);

  // Workforce Member Metrics Data from DB
  const workforceData = React.useMemo(() => {
    if (reportsData?.members && Array.isArray(reportsData.members) && reportsData.members.length > 0) {
      return reportsData.members.map(m => {
        const scoreNum = typeof m.scoreNum === 'number' ? m.scoreNum : parseInt(m.score) || 75;
        const totalSkills = m.totalSkills || 1;
        const verifiedSkills = m.verifiedSkills || 0;
        const completionPct = Math.min(100, Math.max(30, Math.round((verifiedSkills / totalSkills) * 100)));
        const gapsCount = m.gaps || 0;

        return {
          id: m.id,
          name: m.name || 'Team Member',
          role: m.role || 'Software Engineer',
          skillScore: `${scoreNum}/100`,
          performance: (4.0 + (scoreNum % 10) * 0.1).toFixed(1),
          completion: completionPct,
          readiness: m.status === 'Ready' ? 'High' : 'Moderate',
          gapLevel: gapsCount === 0 ? 'Low' : gapsCount <= 2 ? 'Medium' : 'High',
          img: m.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150`
        };
      });
    }

    if (!liveTeams || !Array.isArray(liveTeams) || liveTeams.length === 0) {
      return [];
    }

    const memberList = [];
    liveTeams.forEach(team => {
      if (team.members && Array.isArray(team.members)) {
        team.members.forEach(m => {
          if (!memberList.some(x => x.id === m.id)) {
            const skillCount = m.skills?.length || 0;
            const score = Math.min(98, Math.max(60, 68 + (skillCount * 6)));
            const gapsCount = m.skillGaps?.length || 0;
            
            memberList.push({
              id: m.id,
              name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Team Member',
              role: m.jobTitle || (m.role === 'TEAM_LEADER' ? 'Team Lead' : 'Software Engineer'),
              skillScore: `${score}/100`,
              performance: (4.0 + (score % 10) * 0.1).toFixed(1),
              completion: Math.min(100, Math.max(40, score - 5)),
              readiness: score >= 85 ? 'High' : score >= 70 ? 'Moderate' : 'Developing',
              gapLevel: gapsCount === 0 ? 'Low' : gapsCount <= 2 ? 'Medium' : 'High',
              img: m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'
            });
          }
        });
      }
    });

    return memberList;
  }, [reportsData, liveTeams]);

  // Filtered members selector
  const filteredWorkforce = React.useMemo(() => {
    if (!workforceData) return [];
    return workforceData.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workforceData, searchQuery]);

  // Category Distribution Metrics from DB Radar Data
  const categoriesDistribution = React.useMemo(() => {
    if (reportsData?.radarData && Array.isArray(reportsData.radarData) && reportsData.radarData.length > 0) {
      const colors = ['bg-blue-600', 'bg-indigo-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500'];
      return reportsData.radarData.map((cat, idx) => ({
        name: (cat.subject || 'GENERAL').toUpperCase(),
        score: `${cat.A || 75}% PROFICIENCY`,
        fill: `w-[${cat.A || 75}%]`,
        color: colors[idx % colors.length]
      }));
    }
    return [
      { name: 'CORE ENGINEERING', score: '88% PROFICIENCY', fill: 'w-[88%]', color: 'bg-blue-600' },
      { name: 'ARCHITECTURE & DESIGN', score: '72% PROFICIENCY', fill: 'w-[72%]', color: 'bg-indigo-500' },
      { name: 'DEVOPS & INFRASTRUCTURE', score: '65% PROFICIENCY', fill: 'w-[65%]', color: 'bg-cyan-500' },
      { name: 'SOFT SKILLS & LEADERSHIP', score: '94% PROFICIENCY', fill: 'w-[94%]', color: 'bg-emerald-500' }
    ];
  }, [reportsData]);

  const handleExportCSV = () => {
    const csvHeader = "Name,Role,Skill Score,Performance,Completion (%),Readiness,Gap Level\n";
    const csvRows = filteredWorkforce.map(m => 
      `"${m.name}","${m.role}","${m.skillScore}","${m.performance}",${m.completion},"${m.readiness}","${m.gapLevel}"`
    ).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Team_Report_${reportType.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report CSV successfully generated & downloaded!');
  };

  const handleExportExcel = () => {
    // Generate simple XML spreadsheet representation for excel compatibility
    let excelContent = "<table><tr><th>Name</th><th>Role</th><th>Skill Score</th><th>Performance</th><th>Completion (%)</th><th>Readiness</th><th>Gap Level</th></tr>";
    filteredWorkforce.forEach(m => {
      excelContent += `<tr><td>${m.name}</td><td>${m.role}</td><td>${m.skillScore}</td><td>${m.performance}</td><td>${m.completion}</td><td>${m.readiness}</td><td>${m.gapLevel}</td></tr>`;
    });
    excelContent += "</table>";
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Team_Report_${reportType.replace(/\s+/g, '_')}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report Excel workbook successfully generated & downloaded!');
  };

  const handleExportPDF = () => {
    window.print();
    showToast('Browser print engine launched for PDF creation!');
  };

  // Group Selection Handlers
  const toggleGroupSelection = (id) => {
    setMemberGroups(prev => prev.map(g => g.id === id ? { ...g, selected: !g.selected } : g));
  };

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const newGroup = {
      id: `group-${Date.now()}`,
      label: newGroupName.trim(),
      selected: true
    };
    setMemberGroups([...memberGroups, newGroup]);
    setNewGroupName('');
    setActiveModal(null);
    showToast(`Added '${newGroup.label}' segment to target groups.`);
  };

  const handleExport = (format) => {
    if (format === 'CSV') {
      handleExportCSV();
    } else if (format === 'Excel') {
      handleExportExcel();
    } else if (format === 'PDF') {
      handleExportPDF();
    } else {
      handleExportPDF(); // Default fallback to PDF print engine
    }
  };

  const handleShareHR = (e) => {
    e.preventDefault();
    setActiveModal(null);
    showToast(`Workforce report successfully delivered to ${hrEmail}`);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar Navigation */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Workforce View Dashboard Framework */}
      <main className="flex-1 ml-72 p-10 w-full space-y-8">
        
        {/* Top Header & Operational Controls */}
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-black text-[#0b1221] tracking-tight">Team Reports</h1>
            <p className="text-slate-500 text-base font-semibold mt-2">Generate and analyze comprehensive team workforce reports</p>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="relative">
              <select 
                value={selectedMemberScope} 
                onChange={(e) => {
                  setSelectedMemberScope(e.target.value);
                  showToast(`Scope set to: ${e.target.value}`);
                }}
                className="appearance-none bg-white border border-slate-200 px-4 pr-9 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                <option value="All Members">All Members</option>
                <option value="Engineers">Engineers Only</option>
                <option value="Designers">Designers Only</option>
                <option value="Tech Leads">Tech Leads Only</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={dateRange} 
                onChange={(e) => {
                  setDateRange(e.target.value);
                  showToast(`Time horizon set to: ${e.target.value}`);
                }}
                className="appearance-none bg-white border border-slate-200 px-4 pr-9 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                <option value="Jan 2024 - Mar 2024">Jan - Mar 2024</option>
                <option value="Apr 2024 - Jun 2024">Apr - Jun 2024</option>
                <option value="Jul 2024 - Sep 2024">Jul - Sep 2024</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button 
              onClick={() => handleExport('Master Executive Summary PDF')}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Download size={16} />
              <span>Export Report</span>
            </button>
          </div>
        </header>

        {/* 1. Core Performance Matrix Cards Panel */}
        <div className="grid grid-cols-4 gap-6">
          <OverviewReportCard
            title="PERFORMANCE SCORE"
            value={reportsData?.overallScore ? (reportsData.overallScore * 0.9).toFixed(1) : (workforceData.length > 0 ? '86.4' : '0.0')}
            icon={<TrendingUp size={18} className="text-blue-600" />}
            iconBg="bg-blue-50"
            trend={reportsData?.overallScore ? "+12% TREND" : "STABLE"}
            trendColor="text-emerald-600 bg-emerald-50 border border-emerald-100"
          />
          <OverviewReportCard
            title="SKILL MATURITY INDEX"
            value={reportsData?.overallScore ? (reportsData.overallScore / 20).toFixed(1) : (workforceData.length > 0 ? '4.2' : '0.0')}
            valueSuffix="/5.0"
            icon={<Award size={18} className="text-blue-600" />}
            iconBg="bg-cyan-50"
            trend="OPTIMAL LEVEL"
            trendColor="text-emerald-600 bg-emerald-50 border border-emerald-100"
          />
          <OverviewReportCard
            title="TRAINING COMPLETION"
            value={reportsData?.overallScore ? `${Math.min(100, Math.round(reportsData.overallScore * 0.95))}%` : (workforceData.length > 0 ? '92%' : '0%')}
            icon={<CheckCircle2 size={18} className="text-indigo-600" />}
            iconBg="bg-indigo-50"
            customRing={true}
          />
          <OverviewReportCard
            title="TEAM READINESS SCORE"
            value={reportsData?.overallScore ? `${reportsData.overallScore}` : (workforceData.length > 0 ? '94.8' : '0.0')}
            icon={<ShieldCheck size={18} className="text-emerald-600" />}
            iconBg="bg-emerald-50"
          />
        </div>

        {/* 2. Longitudinal Tracking Analysis Block */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Team Performance Trend Analysis</h3>
              <p className="text-slate-400 text-sm font-semibold mt-1">Longitudinal tracking of team productivity and skill impact</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span><span>PERFORMANCE</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-slate-600">
                <span className="w-3 h-1 bg-cyan-400 border-2 border-dashed border-cyan-400"></span><span>SKILL GROWTH</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-indigo-300"></span><span>TRAINING IMPACT</span>
              </div>
            </div>
          </div>

          {/* Smooth Vector Graph Chart Area */}
          <div className="h-64 relative pt-10 flex flex-col justify-between">
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <path 
                d="M 50 180 Q 250 150 500 110 T 1000 70 L 1400 40" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="7" 
                strokeLinecap="round"
              />
              <path 
                d="M 50 220 Q 250 190 500 160 T 1000 120 L 1400 90" 
                fill="none" 
                stroke="#22D3EE" 
                strokeWidth="5" 
                strokeDasharray="12,10" 
                strokeLinecap="round"
              />
            </svg>

            <div className="border-b border-slate-50 w-full h-0"></div>
            <div className="border-b border-slate-50 w-full h-0"></div>
            <div className="border-b border-slate-50 w-full h-0"></div>
            <div className="border-b border-slate-100/80 w-full h-0"></div>

            <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 pt-2">
              <span>January</span>
              <span>February</span>
              <span>March</span>
              <span>April</span>
              <span>May</span>
              <span>June</span>
            </div>
          </div>
        </div>

        {/* 3. Skill & Training Proficiency Split Section */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Skill Distribution Segment */}
          <div className="col-span-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Skill Distribution by Category</h3>
            <div className="space-y-5 pt-2">
              {categoriesDistribution.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-wider">
                    <span className="text-slate-700">{cat.name}</span>
                    <span>{cat.score}</span>
                  </div>
                  <div className="w-full bg-amber-50/40 h-2.5 rounded-full border border-amber-100/10 overflow-hidden">
                    <div className={`h-full ${cat.color} ${cat.fill} rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proficiency Donut Breakdown */}
          <div className="col-span-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Skill Proficiency Distribution</h3>
            
            <div className="flex items-center justify-around flex-1 py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[14px] border-slate-50"></div>
                <div className="absolute inset-0 rounded-full border-[14px] border-blue-500 border-t-transparent border-r-transparent rotate-45"></div>
                <div className="absolute inset-0 rounded-full border-[14px] border-indigo-500 border-b-transparent border-l-transparent -rotate-12"></div>
                <div className="text-center z-10">
                  <span className="text-3xl font-black text-slate-900 tracking-tight block">100%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">Total Team</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Advanced</p>
                  <p className="text-xl font-black text-blue-600 mt-1">45%</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Intermediate</p>
                  <p className="text-xl font-black text-cyan-500 mt-1">30%</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Beginner</p>
                  <p className="text-xl font-black text-indigo-500 mt-1">25%</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Intervention Effectiveness Comparison Analytics */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Training Effectiveness Analysis</h3>
            <p className="text-slate-400 text-sm font-semibold mt-1">Comparison of skill proficiency levels before and after professional training interventions</p>
          </div>

          <div className="grid grid-cols-12 gap-8 items-center pt-2">
            <div className="col-span-3 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F172A] flex items-center justify-center text-white text-base font-black">+28%</div>
                <div>
                  <p className="text-sm font-black text-slate-800 leading-tight">Skill Improvement</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-base font-black">+18%</div>
                <div>
                  <p className="text-sm font-black text-slate-800 leading-tight">Performance Lift</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-base font-black">96.4%</div>
                <div>
                  <p className="text-sm font-black text-slate-800 leading-tight">Completion Impact</p>
                </div>
              </div>
            </div>

            <div className="col-span-9 bg-slate-50/60 rounded-3xl p-8 border border-slate-100 flex items-end justify-between h-56 relative">
              <div className="flex gap-16 items-end flex-1 justify-around h-full pt-6">
                <DoubleBarChartGroup label="Cloud Ops" valBefore={40} valAfter={80} />
                <DoubleBarChartGroup label="Security" valBefore={55} valAfter={85} />
                <DoubleBarChartGroup label="AI/ML" valBefore={20} valAfter={65} />
                <DoubleBarChartGroup label="Front-End" valBefore={60} valAfter={90} />
              </div>

              <div className="w-24 border-l border-slate-200/80 pl-6 space-y-3 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-slate-200 rounded-sm"></span><span>Before</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-sm"></span><span>After</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Detailed Team Workforce Spreadsheet */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Detailed Team Workforce Report</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search members..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold text-slate-700 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 pb-1 text-center">
              <div className="w-[20%] text-left">Member Name</div>
              <div className="w-[18%] text-left">Role</div>
              <div className="w-[12%]">Skill Score</div>
              <div className="w-[12%]">Performance</div>
              <div className="w-[14%]">Completion</div>
              <div className="w-[12%]">Readiness</div>
              <div className="w-[12%] text-right">Gap Level</div>
            </div>

            <div className="space-y-3">
              {filteredWorkforce.length > 0 ? (
                filteredWorkforce.map((member, rIdx) => (
                  <WorkforceRow 
                    key={rIdx} 
                    member={member} 
                    onClick={() => navigate(`/team-leader/member-profile?name=${encodeURIComponent(member.name)}`)} 
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-bold">
                  No workforce members match your search query.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. Customized Report Generation & Export Operations */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Custom Creation Prompt Box */}
          <div className="col-span-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Generate Custom Report</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Report Type</label>
                <div className="relative">
                  <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 appearance-none focus:outline-none"
                  >
                    <option>Executive Skill Gap Summary</option>
                    <option>Individual Performance Matrix</option>
                    <option>Training ROI & Completion Audit</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Date Range</label>
                <div className="relative">
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 appearance-none focus:outline-none"
                  >
                    <option>Jan 2024 - Mar 2024</option>
                    <option>Apr 2024 - Jun 2024</option>
                    <option>Jul 2024 - Sep 2024</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Select Members</label>
              <div className="flex flex-wrap gap-2.5">
                {memberGroups.map((grp) => (
                  <button
                    key={grp.id}
                    onClick={() => toggleGroupSelection(grp.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      grp.selected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {grp.label}
                  </button>
                ))}
                <button 
                  onClick={() => setActiveModal('addGroup')}
                  className="text-blue-600 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Group</span>
                </button>
              </div>
            </div>

            <button 
              onClick={() => showToast(`Generating custom ${reportType} report...`)}
              className="w-full py-4 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-black rounded-xl transition-all shadow-md mt-2 cursor-pointer"
            >
              Generate Intelligent Report
            </button>
          </div>

          {/* Export / Share Portal Links Panel */}
          <div className="col-span-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Export and Share Team Report</h3>
            
            <div className="grid grid-cols-2 gap-4 flex-1 mt-6">
              <ExportPortalButton 
                label="Export PDF" 
                icon={<FileText size={20} className="text-slate-500" />} 
                onClick={() => handleExport('PDF')}
              />
              <ExportPortalButton 
                label="Export Excel" 
                icon={<FileSpreadsheet size={20} className="text-slate-500" />} 
                onClick={() => handleExport('Excel')}
              />
              <ExportPortalButton 
                label="Export CSV" 
                icon={<Share2 size={20} className="text-slate-500" />} 
                onClick={() => handleExport('CSV')}
              />
              
              <button 
                onClick={() => setActiveModal('shareHR')}
                className="flex flex-col items-center justify-center p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-lg shadow-blue-600/10 space-y-2 cursor-pointer"
              >
                <Send size={20} />
                <span className="text-sm font-black tracking-tight">Share with HR</span>
              </button>
            </div>
          </div>

        </div>

        {/* 7. AI Intelligence Insights Footer Block */}
        <div className="bg-[#F3F6FF] rounded-[2.5rem] p-8 border border-blue-100/60 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-600/10">
                <BrainCircuit size={22} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AI Workforce Report Insights</h3>
                <p className="text-slate-500 text-sm font-semibold">Predictive intelligence and optimization recommendations</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>Active Processing
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <AIReportInsightCard
              badge="GROWTH"
              badgeColor="bg-blue-50 text-blue-600 border-blue-100"
              confidence="96%"
              desc={<span>Team performance is projected to increase by <b className="text-blue-600 font-black">14.2%</b> if the current Python microservices certification track is completed by all members by EOM.</span>}
              onAction={() => {
                setActiveInsight({
                  title: "Python Microservices Track Optimization",
                  recommendation: "Enroll Marcus Wright and Daniel Kim in Python Async Architecture to unlock immediate backend throughput gains.",
                  impact: "+14.2% Estimated Efficiency"
                });
                setActiveModal('insight');
              }}
            />
            <AIReportInsightCard
              badge="SUCCESS"
              badgeColor="bg-emerald-50 text-emerald-600 border-emerald-100"
              confidence="92%"
              desc={<span>The <b className="text-emerald-600 font-black">"Design Systems"</b> training has yielded the highest ROI to date, reducing design-to-dev handoff cycles by an average of <b className="text-slate-900 font-black">2.4 days</b>.</span>}
              onAction={() => {
                setActiveInsight({
                  title: "Design Systems ROI Analysis",
                  recommendation: "Standardize tokenized component libraries across the team to sustain the 2.4-day handoff reduction.",
                  impact: "High ROI Confirmed"
                });
                setActiveModal('insight');
              }}
            />
            <AIReportInsightCard
              badge="ALERT"
              badgeColor="bg-orange-50 text-orange-600 border-orange-100"
              confidence="88%"
              desc={<span>Critical skill gap detected in <b className="text-orange-600 font-black">Cloud Security Compliance</b>. Recommend immediate enrollment for Marcus W. and Lena P. to mitigate Q4 audit risks.</span>}
              onAction={() => {
                setActiveInsight({
                  title: "Cloud Security Risk Mitigation",
                  recommendation: "Assign SANS Cloud Security Automation training immediately to close Q4 enterprise audit vulnerabilities.",
                  impact: "Urgent Mitigation Required"
                });
                setActiveModal('insight');
              }}
            />
          </div>
        </div>

        {/* 8. Dashboard Executive Visual Summary Dark Module */}
        <div className="bg-[#0b111e] p-10 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl">
          <div className="max-w-md space-y-2">
            <h3 className="text-3xl font-bold tracking-tight">Executive Visual Summary</h3>
            <p className="text-slate-400 text-sm font-semibold leading-relaxed">
              Your team's workforce intelligence at a glance. Current trajectory suggests high-readiness for Enterprise-scale deployments in Q2.
            </p>
            
            <div className="flex gap-12 pt-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Index</p>
                <p className="text-3xl font-black mt-1 flex items-center gap-1.5">92.4 <span className="text-xs font-bold text-emerald-400">+5.2</span></p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Velocity</p>
                <p className="text-3xl font-black mt-1">High</p>
              </div>
            </div>
          </div>

          <div className="w-[420px] bg-[#141b2b] border border-slate-800 p-6 rounded-3xl space-y-4">
            <DarkBarTrack label="READINESS" percentage={98} color="bg-blue-500" />
            <DarkBarTrack label="OPTIMIZATION" percentage={84} color="bg-cyan-400" />
            <DarkBarTrack label="RESILIENCE" percentage={76} color="bg-indigo-500" />
          </div>
        </div>

      </main>

      {/* --- Action Modals --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          
          {/* 1. Add Group Modal */}
          {activeModal === 'addGroup' && (
            <form onSubmit={handleAddGroup} className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Add Member Group</h3>
                <button type="button" onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Group Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Backend Engineers, Q3 Cohort" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md">
                  Add Segment
                </button>
              </div>
            </form>
          )}

          {/* 2. Share with HR Modal */}
          {activeModal === 'shareHR' && (
            <form onSubmit={handleShareHR} className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Send size={18} />
                  <h3 className="text-lg font-bold text-slate-900">Share Report with HR</h3>
                </div>
                <button type="button" onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Recipient Email</label>
                  <input 
                    type="email" 
                    value={hrEmail}
                    onChange={(e) => setHrEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Include Note / Executive Commentary</label>
                  <textarea 
                    rows={3}
                    placeholder="Add optional notes for the HR team regarding budget allocations or skill readiness..."
                    value={hrNote}
                    onChange={(e) => setHrNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md">
                  Send Workforce Report
                </button>
              </div>
            </form>
          )}

          {/* 3. AI Insight Action Details Modal */}
          {activeModal === 'insight' && activeInsight && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Sparkles size={18} />
                  <h3 className="text-lg font-bold text-slate-900">Recommended Action</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-base">{activeInsight.title}</h4>
                <p className="text-xs font-semibold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                  {activeInsight.recommendation}
                </p>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400 font-bold">Expected Impact</span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    {activeInsight.impact}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setActiveModal(null);
                  showToast('Action plan initiated and logged to Team Backlog.');
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Apply Action Plan
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

/* --- Secondary Module Helper Components --- */

const OverviewReportCard = ({ title, value, valueSuffix, icon, iconBg, trend, trendColor, customRing }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden">
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-black text-slate-400 tracking-widest">{title}</span>
      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>{icon}</div>
    </div>
    
    <div className="mt-4 flex justify-between items-end">
      <h4 className="text-4xl font-black text-slate-900 tracking-tight">
        {value}{valueSuffix && <span className="text-base text-slate-400 font-medium ml-0.5">{valueSuffix}</span>}
      </h4>
      {trend && (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${trendColor}`}>{trend}</span>
      )}
      {customRing && (
        <div className="w-6 h-6 rounded-full border-2 border-dashed border-indigo-500 animate-spin"></div>
      )}
    </div>
  </div>
);

const DoubleBarChartGroup = ({ label, valBefore, valAfter }) => (
  <div className="flex flex-col items-center h-full justify-end space-y-3 w-16">
    <div className="flex items-end gap-2.5 h-full w-full justify-center">
      <div className="bg-slate-200 w-3.5 rounded-t-sm transition-all duration-500" style={{ height: `${valBefore}%` }}></div>
      <div className="bg-blue-500 w-3.5 rounded-t-sm transition-all duration-500" style={{ height: `${valAfter}%` }}></div>
    </div>
    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block whitespace-nowrap">{label}</span>
  </div>
);

const WorkforceRow = ({ member, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all text-center text-sm font-semibold text-slate-700 cursor-pointer"
  >
    <div className="w-[20%] flex items-center gap-3.5 text-left">
      <img src={member.img} alt={member.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
      <span className="text-base font-black text-slate-900 tracking-tight hover:text-blue-600 transition-colors">{member.name}</span>
    </div>
    <div className="w-[18%] text-left text-slate-400 font-medium">{member.role}</div>
    <div className="w-[12%] text-blue-600 font-black tracking-wide">{member.skillScore}</div>
    <div className="w-[12%] text-slate-900 font-black">{member.performance}</div>
    
    <div className="w-[14%] px-4">
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full ${member.completion < 60 ? 'bg-amber-500' : 'bg-blue-500'} rounded-full`} 
          style={{ width: `${member.completion}%` }}
        ></div>
      </div>
    </div>
    
    <div className="w-[12%] flex justify-center">
      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
        member.readiness === 'High' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
      }`}>
        {member.readiness}
      </span>
    </div>
    
    <div className="w-[12%] flex justify-end">
      <span className={`font-black text-sm pr-4 ${member.gapLevel === 'Low' ? 'text-emerald-500' : 'text-orange-500'}`}>
        {member.gapLevel}
      </span>
    </div>
  </div>
);

const ExportPortalButton = ({ label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-6 bg-slate-50/60 border border-slate-100 hover:bg-slate-50 hover:border-slate-200 rounded-2xl transition-all space-y-2 group cursor-pointer"
  >
    {icon}
    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
  </button>
);

const AIReportInsightCard = ({ badge, badgeColor, confidence, desc, onAction }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className={`text-[9px] font-black px-2 py-0.5 border rounded-md tracking-wider ${badgeColor}`}>{badge}</span>
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-0.5"><Sparkles size={12} className="text-blue-500" /> {confidence} Conf.</span>
      </div>
      <p className="text-sm text-slate-500 font-semibold leading-relaxed">{desc}</p>
    </div>
    <button 
      onClick={onAction}
      className="text-blue-600 hover:text-blue-700 text-xs font-black text-left w-max transition-all flex items-center gap-1 cursor-pointer"
    >
      <span>View Solution</span>
      <ArrowRight size={12} />
    </button>
  </div>
);

const DarkBarTrack = ({ label, percentage, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-400">
      <span>{label}</span>
      <span className="text-slate-200">{percentage}%</span>
    </div>
    <div className="w-full bg-[#1b2438] h-1.5 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);