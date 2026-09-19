import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, Download, Users, Star, 
  CheckCircle2, TrendingUp, ChevronLeft, ChevronRight,
  ArrowUpRight, AlertTriangle, Sparkles, Filter, RefreshCw
} from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';

const AdminTeamReports = () => {
  // Backend Integrated State Controllers
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('All');
  const [reportType, setReportType] = useState('Performance Report');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Mock Dataset Mirroring Real-time Database Response
  const metrics = [
    { id: 1, title: 'Total Teams', value: '142', change: '+12%', isPositive: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 2, title: 'Avg Readiness Score', value: '86/100', change: '+4.2%', isPositive: true, icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 3, title: 'Training Completion', value: '72%', change: '+8.5%', isPositive: true, icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 4, title: 'Overall Performance', value: '4.2/5', change: '+3.1%', isPositive: true, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' }
  ];

  const skillGaps = [
    { skill: 'Cloud Architecture', severity: 'High Gap', percent: 85, color: 'bg-rose-500', textColor: 'text-rose-600' },
    { skill: 'System Design', severity: 'Medium Gap', percent: 45, color: 'bg-amber-500', textColor: 'text-amber-600' },
    { skill: 'Agile Leadership', severity: 'Low Gap', percent: 18, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { skill: 'Data Analytics', severity: 'Medium Gap', percent: 55, color: 'bg-amber-500', textColor: 'text-amber-600' },
    { skill: 'UI/UX Principles', severity: 'Low Gap', percent: 12, color: 'bg-emerald-500', textColor: 'text-emerald-600' }
  ];

  const teamReportsData = [
    { team: 'Frontend Core', members: 12, dept: 'Engineering', readiness: 92, status: 'high', score: '4.8 / 5', training: '85% Completed' },
    { team: 'Backend API', members: 18, dept: 'Engineering', readiness: 76, status: 'medium', score: '4.2 / 5', training: '62% Completed' },
    { team: 'Enterprise Sales', members: 24, dept: 'Sales', readiness: 88, status: 'high', score: '4.5 / 5', training: '90% Completed' },
    { team: 'Data Ops', members: 8, dept: 'Engineering', readiness: 65, status: 'low', score: '3.8 / 5', training: '45% Completed' },
    { team: 'Growth Marketing', members: 15, dept: 'Marketing', readiness: 81, status: 'medium', score: '4.0 / 5', training: '70% Completed' }
  ];

  const chartBars = [
    { label: 'Frontend Core', perf: 72, read: 68, train: 78 },
    { label: 'Backend API', perf: 82, read: 75, train: 70 },
    { label: 'DevOps Ops', perf: 62, read: 58, train: 48 },
    { label: 'Product Design', perf: 80, read: 74, train: 65 },
    { label: 'Sales NA', perf: 65, read: 72, train: 55 },
  ];

  // Pagination Engine Computations
  const totalPages = Math.ceil(teamReportsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTableData = teamReportsData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full" style={{ fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <SuperadminSidebar />

      <div className="flex-1 pl-0 lg:pl-64 pt-20 lg:pt-0 flex flex-col min-h-screen overflow-hidden">
        
        {/* ── TOP UTILITY CONTEXT HEADER ── */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Team Reports</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Analyze workforce performance and readiness across teams</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors bg-slate-50/50"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all">
              <Download size={14} /> Export
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden ml-2 border border-slate-200">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Profile" className="object-cover w-full h-full" />
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT RUNTIME ECOSYSTEM ── */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 w-full">
          
          {/* ── 4-COLUMN TOP STATS ROW ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {metrics.map((card) => {
              const IconComp = card.icon;
              return (
                <div key={card.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{card.title}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1.5">{card.value}</p>
                    <p className="text-xs text-emerald-500 font-black mt-2 flex items-center gap-1">
                      <span>{card.change}</span> <span className="text-slate-400 font-medium">vs last month</span>
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <IconComp size={22} className={card.color} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── CENTRAL MATRIX CONTROL ROUTER (FILTERS) ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col min-w-[140px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Department</label>
                  <select 
                    value={selectedDept} 
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                  >
                    <option>All Departments</option>
                    <option>Engineering</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                  </select>
                </div>

                <div className="flex flex-col min-w-[140px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Team</label>
                  <select 
                    value={selectedTeam} 
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                  >
                    <option>All Teams</option>
                    <option>Frontend Core</option>
                    <option>Backend API</option>
                    <option>Data Ops</option>
                  </select>
                </div>

                <div className="flex flex-col min-w-[140px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Skill Category</label>
                  <select 
                    value={selectedSkillCategory} 
                    onChange={(e) => setSelectedSkillCategory(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                  >
                    <option>Technical</option>
                    <option>Soft Skills</option>
                    <option>Leadership</option>
                  </select>
                </div>

                <div className="flex flex-col min-w-[160px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Report Type</label>
                  <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                  >
                    <option>Performance Report</option>
                    <option>Readiness Review</option>
                    <option>Skill Inventory</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end">
                <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm">
                  <RefreshCw size={15} />
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all shadow-md">
                  <Filter size={14} /> Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* ── ANALYTICS DATA STRIP ROW (CHART & INSIGHTS) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Team Performance Comparison Chart */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">Team Performance Comparison</h3>
                  <button className="text-slate-400 hover:text-slate-600 text-xs font-bold">•••</button>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Cross-department metrics across 5 top teams</p>
              </div>

              {/* Graphical Container Layer */}
              <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2 border-b border-slate-100 overflow-x-auto scrollbar-none">
                {chartBars.map((bar, i) => (
                  <div key={i} className="flex-1 min-w-[60px] flex flex-col items-center justify-end h-full space-y-4 group">
                    <div className="flex items-end gap-1.5 w-full h-52 justify-center">
                      <div style={{ height: `${bar.perf}%` }} className="w-3.5 bg-blue-500 rounded-t-sm transition-all duration-500" title={`Perf: ${bar.perf}`} />
                      <div style={{ height: `${bar.read}%` }} className="w-3.5 bg-emerald-400 rounded-t-sm transition-all duration-500" title={`Readiness: ${bar.read}`} />
                      <div style={{ height: `${bar.train}%` }} className="w-3.5 bg-amber-400 rounded-t-sm transition-all duration-500" title={`Training: ${bar.train}`} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 truncate w-full text-center tracking-tight pb-2">{bar.label}</span>
                  </div>
                ))}
              </div>

              {/* Chart Legend Meta Info */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[11px] font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Performance Score
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Readiness Score
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Training Completion
                </div>
              </div>
            </div>

            {/* AI Workforce Insights Panel */}
            <div className="bg-[#121826] text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black tracking-tight text-slate-100">AI Workforce Insights</h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">
                    High Confidence
                  </span>
                </div>

                <div className="space-y-5 pt-5 text-xs">
                  <div className="flex gap-3">
                    <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-200">Critical Skill Gap Detected</p>
                      <p className="text-slate-400 leading-relaxed mt-1 text-[11px]">Backend API team shows a <span className="text-amber-400 font-bold">24% gap</span> in Cloud Infrastructure security. Recommended action: Assign "Advanced AWS Security" path.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-200">Top Performing Segment</p>
                      <p className="text-slate-400 leading-relaxed mt-1 text-[11px]">Frontend Core team achieved highest readiness increase (+14%) after React 18 training module.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <TrendingUp size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-200">Predicted Readiness Trend</p>
                      <p className="text-slate-400 leading-relaxed mt-1 text-[11px]">Overall organizational readiness projected to hit <span className="text-blue-400 font-bold">92%</span> by Q3 if current training velocity is maintained.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full text-center py-2.5 bg-slate-800 hover:bg-slate-750 transition-colors border border-slate-700/60 rounded-xl text-xs font-black text-slate-300 flex items-center justify-center gap-1.5 mt-6">
                View Detailed AI Report <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* ── BOTTOM STRUCTURAL SPLIT GRID (GAP MATRIX & DETAILED DATA) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Skill Gap Severity Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight mb-4">Skill Gap Severity</h3>
                <div className="space-y-4">
                  {skillGaps.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700 font-bold">{item.skill}</span>
                        <span className={`text-[10px] font-black uppercase ${item.textColor}`}>{item.severity}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Team Reports Grid Section with Pagination */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-black text-slate-900">Detailed Team Reports</h3>
                  <button className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-sm transition-all">
                    Download CSV
                  </button>
                </div>
                
                {/* Responsive Viewport Grid Container for Table Structure */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[60px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/70">
                        <th className="py-3 px-6">Team</th>
                        <th className="py-3 px-6">Dept</th>
                        <th className="py-3 px-6">Readiness</th>
                        <th className="py-3 px-6">Perf. Score</th>
                        <th className="py-3 px-6">Training</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedTableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-6">
                            <p className="text-xs font-black text-slate-900">{row.team}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{row.members} Members</p>
                          </td>
                          <td className="py-4 px-6 text-xs font-semibold text-slate-500">{row.dept}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-black text-slate-800">{row.readiness}%</span>
                              <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    row.status === 'high' ? 'bg-emerald-500' : 
                                    row.status === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
                                  }`} 
                                  style={{ width: `${row.readiness}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-lg text-[11px]">
                              {row.score}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs font-bold text-slate-600">{row.training}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Action Trigger Pagination System Bar */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, teamReportsData.length)} of {teamReportsData.length} Teams
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:hover:bg-white shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 text-xs font-black rounded-lg transition-all ${
                        currentPage === i + 1 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:hover:bg-white shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminTeamReports;