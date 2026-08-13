import React, { useState, useMemo } from 'react';
import { 
  Search, Bell, TrendingUp, Award, AlertCircle, Sparkles, 
  Filter, Download, ChevronLeft, ChevronRight, Briefcase, 
  UserCheck, Settings, FileText, Check, ArrowUpDown 
} from 'lucide-react';
import HRSidebar from './HRSidebar';

// ── PERFORMANCE DISTRIBUTION HISTOGRAM ───────────────────────────────────────
const PerformanceDistribution = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="w-full pt-6">
      <div className="flex items-end justify-between h-56 px-4 border-b border-slate-100">
        {data.map((bar, i) => {
          const heightPct = `${(bar.count / maxCount) * 100}%`;
          return (
            <div key={i} className="flex flex-col items-center flex-1 group mx-2">
              <div className="w-full flex items-end h-48 relative">
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded mb-1 transition-opacity whitespace-nowrap z-10">
                  {bar.count} Employees
                </div>
                <div 
                  className={`w-full ${bar.color} rounded-t-xl transition-all duration-500 ease-out`} 
                  style={{ height: heightPct }}
                />
              </div>
              <span className="text-xs font-bold text-slate-400 my-3 tracking-wider">{bar.range}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── CIRCULAR PROGRESS COMPONENT ──────────────────────────────────────────────
const CircularProgress = ({ percentage = 80, size = 64, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-100 fill-none"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-indigo-600 fill-none transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-black text-slate-800">{percentage}%</span>
    </div>
  );
};

// ── MAIN DASHBOARD COMPONENT ──────────────────────────────────────────────────
const EmployeePerformance = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [timeframe, setTimeframe] = useState('Q3 2026');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({});
  const itemsPerPage = 3;

  const histogramData = [
    { range: '0-20', count: 12, color: 'bg-indigo-500/80' },
    { range: '21-40', count: 18, color: 'bg-indigo-500/80' },
    { range: '41-60', count: 34, color: 'bg-indigo-500/80' },
    { range: '61-80', count: 62, color: 'bg-indigo-500' },
    { range: '81-90', count: 45, color: 'bg-emerald-500' },
    { range: '91-100', count: 22, color: 'bg-emerald-500' },
  ];

  const statMetrics = [
    { label: 'Avg. Performance', value: '84%', sub: '+2.4% vs last month', type: 'spark' },
    { label: 'High Performers', value: '142', sub: 'Target: 150', progress: '94%', type: 'bar' },
    { label: 'At-Risk Employees', value: '26', sub: 'Action needed for 5 critical cases', type: 'avatars' },
    { label: 'Training Impact', value: '+12%', sub: 'Performance lift post-training', pct: 80, type: 'radial' }
  ];

  const topPerformers = [
    { name: 'Sarah Jenkins', role: 'Senior Product Designer', score: '98%', img: 'https://i.pravatar.cc/150?img=47', rank: 1 },
    { name: 'Michael Chen', role: 'Engineering Manager', score: '97%', img: 'https://i.pravatar.cc/150?img=11', rank: 2 },
    { name: 'Emily Rodriguez', role: 'Marketing Specialist', score: '96%', img: 'https://i.pravatar.cc/150?img=49', rank: 3 }
  ];

  const needsAttention = [
    { id: 'usr-1', name: 'Robert Fox', dept: 'Sales', score: '52%', img: 'https://i.pravatar.cc/150?img=60' },
    { id: 'usr-2', name: 'Jenny Wilson', dept: 'Support', score: '58%', img: 'https://i.pravatar.cc/150?img=45' },
    { id: 'usr-3', name: 'Albert Flores', dept: 'DevOps', score: '61%', img: 'https://i.pravatar.cc/150?img=51' }
  ];

  const rawPerformanceDetails = [
    { id: 'e1', name: 'Esther Howard', dept: 'Marketing', role: 'CMO', skillScore: 92, performanceNum: 95, performance: '95%', status: 'Completed', risk: 'Low', riskColor: 'text-emerald-500 bg-emerald-50', statusColor: 'bg-emerald-50 text-emerald-600', skillColor: 'bg-cyan-500', avatar: 'https://i.pravatar.cc/150?img=31' },
    { id: 'e2', name: 'Cameron Williamson', dept: 'Engineering', role: 'Backend Dev', skillScore: 78, performanceNum: 76, performance: '76%', status: 'In Progress', risk: 'Medium', riskColor: 'text-amber-500 bg-amber-50', statusColor: 'bg-amber-50 text-amber-600', skillColor: 'bg-amber-500', avatar: 'https://i.pravatar.cc/150?img=59' },
    { id: 'e3', name: 'Brooklyn Simmons', dept: 'Sales', role: 'Account Exec', skillScore: 45, performanceNum: 52, performance: '52%', status: 'Overdue', risk: 'High', riskColor: 'text-rose-500 bg-rose-50', statusColor: 'bg-rose-50 text-rose-600', skillColor: 'bg-rose-500', avatar: 'https://i.pravatar.cc/150?img=26' },
    { id: 'e4', name: 'Leslie Alexander', dept: 'Product', role: 'UX Designer', skillScore: 88, performanceNum: 91, performance: '91%', status: 'Completed', risk: 'Low', riskColor: 'text-emerald-500 bg-emerald-50', statusColor: 'bg-emerald-50 text-emerald-600', skillColor: 'bg-cyan-500', avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: 'e5', name: 'Guy Hawkins', dept: 'DevOps', role: 'SRE Specialist', skillScore: 61, performanceNum: 64, performance: '64%', status: 'In Progress', risk: 'Medium', riskColor: 'text-amber-500 bg-amber-50', statusColor: 'bg-amber-50 text-amber-600', skillColor: 'bg-amber-500', avatar: 'https://i.pravatar.cc/150?img=15' }
  ];

  // Filtering & Sorting Logic
  const processedDetails = useMemo(() => {
    let result = rawPerformanceDetails.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All' || item.dept === selectedDept;
      return matchesSearch && matchesDept;
    });

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchQuery, selectedDept, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(processedDetails.length / itemsPerPage));
  const currentTableData = processedDetails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleBulkTraining = () => {
    if (selectedRows.length === 0) return;
    setActiveNotification(`Training assigned to ${selectedRows.length} selected employee(s).`);
    setSelectedRows([]);
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Department", "Role", "Skill Score", "Performance", "Status", "Risk Level"];
    const rows = processedDetails.map(d => [
      `"${d.name}"`, 
      `"${d.dept}"`, 
      `"${d.role}"`, 
      `"${d.skillScore}%"`, 
      `"${d.performance}"`, 
      `"${d.status}"`, 
      `"${d.risk}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_performance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActiveNotification("Performance report exported successfully.");
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const triggerQuickAction = (actionName) => {
    setActiveNotification(`Action Launched: ${actionName}`);
    setTimeout(() => setActiveNotification(null), 3000);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="flex min-h-screen bg-[#f8fafc] relative">
      <HRSidebar />

      <div className="flex-1 ml-64 overflow-auto">
        
        {activeNotification && (
          <div className="fixed top-5 right-8 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all">
            <Sparkles size={14} className="text-indigo-400" />
            {activeNotification}
          </div>
        )}

        {/* HEADER BAR */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Employee Performance Reports</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Monitor workforce performance, identify risks, and improve productivity</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Timeframe Selector */}
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl outline-none"
            >
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Q1 2026">Q1 2026</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search employees, skills..."
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 text-sm text-slate-600 outline-none w-60 border border-slate-100 focus:border-slate-200 focus:bg-white transition-all"
              />
            </div>
            <button 
              onClick={() => triggerQuickAction("Notifications Panel")} 
              className="relative p-2 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors"
            >
              <Bell size={19} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">

          {/* TOP METRIC CARDS */}
          <div className="grid grid-cols-4 gap-5">
            {statMetrics.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                  {card.type === 'spark' && <TrendingUp size={16} className="text-indigo-500" />}
                  {card.type === 'bar' && <Award size={16} className="text-emerald-500" />}
                  {card.type === 'avatars' && <AlertCircle size={16} className="text-rose-400" />}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
                    {card.type === 'spark' && (
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md mt-2">
                        <span>↗</span> {card.sub}
                      </div>
                    )}
                    {card.type === 'bar' && (
                      <div className="w-44 mt-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>{card.sub}</span>
                          <span>{card.progress}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: card.progress }} />
                        </div>
                      </div>
                    )}
                  </div>
                  {card.type === 'radial' && (
                    <div className="absolute right-4 bottom-4">
                      <CircularProgress percentage={card.pct} size={56} strokeWidth={5} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* HISTOGRAM CARD */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-900">Performance Distribution</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Employee count by performance score range ({timeframe})</p>
              </div>
            </div>
            <PerformanceDistribution data={histogramData} />
          </div>

          {/* PERFORMANCE TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Performance Details</h3>
              <div className="flex items-center gap-3">
                {selectedRows.length > 0 && (
                  <button 
                    onClick={handleBulkTraining}
                    className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    Assign Training ({selectedRows.length})
                  </button>
                )}
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className="text-xs font-bold bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-all"
                  >
                    <Filter size={13} /> Dept: {selectedDept}
                  </button>
                  {isFilterMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 shadow-xl rounded-xl py-1 z-30">
                      {['All', 'Marketing', 'Engineering', 'Sales', 'Product', 'DevOps'].map((dept) => (
                        <button
                          key={dept}
                          onClick={() => {
                            setSelectedDept(dept);
                            setIsFilterMenuOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-between ${selectedDept === dept ? 'text-indigo-600' : 'text-slate-600'}`}
                        >
                          {dept}
                          {selectedDept === dept && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="text-xs font-bold bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-all"
                >
                  <Download size={13} /> Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-4 py-3.5 w-10 text-center">
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRows(currentTableData.map(r => r.id));
                          else setSelectedRows([]);
                        }}
                        checked={selectedRows.length > 0 && selectedRows.length === currentTableData.length}
                      />
                    </th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">Employee Name <ArrowUpDown size={12} /></div>
                    </th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('skillScore')}>
                      <div className="flex items-center gap-1">Skill Score <ArrowUpDown size={12} /></div>
                    </th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('performanceNum')}>
                      <div className="flex items-center gap-1">Performance <ArrowUpDown size={12} /></div>
                    </th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">Training</th>
                    <th className="px-6 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentTableData.length > 0 ? (
                    currentTableData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-4 py-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleSelectRow(row.id)}
                          />
                        </td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-bold text-slate-800 text-sm">{row.name}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-semibold text-sm">{row.dept}</td>
                        <td className="px-6 py-4 text-slate-400 font-semibold text-sm">{row.role}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 w-32">
                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${row.skillColor}`} style={{ width: `${row.skillScore}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{row.skillScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-slate-800">{row.performance}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${row.statusColor}`}>{row.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${row.riskColor}`}>
                            ● {row.risk}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-xs font-bold text-slate-400">
                        No employees found matching the current criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30">
              <span className="text-xs font-semibold text-slate-400">
                Showing page <span className="text-slate-700 font-bold">{currentPage}</span> of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeePerformance;