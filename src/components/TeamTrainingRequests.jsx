import React, { useState, useEffect } from 'react';
import TeamLeaderSidebar from './TeamLeaderSidebar';
import { teamLeaderAPI } from '../services/api';
import {
  SlidersHorizontal,
  Search,
  Check,
  X,
  Eye,
  Wand2,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  ChevronDown,
  Filter,
  Users,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  Loader2,
  Download
} from 'lucide-react';

export default function TeamTrainingRequests() {
  const [activeTab, setActiveTab] = useState('training-requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Interactive Requests & Live State
  const [requestsData, setRequestsData] = useState([]);
  const [trainingDemand, setTrainingDemand] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalCount: 0,
    pendingCount: 0,
    approvedCount: 0,
    completedCount: 0
  });

  // Selection & Modal States
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'details', 'batch', 'report'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadRequests = async () => {
      setLoading(true);
      try {
        const res = await teamLeaderAPI.getTrainingRequests();
        if (isMounted && res?.success && res.data) {
          setRequestsData(res.data.requests || []);
          setTrainingDemand(res.data.trainingDemand || []);
          setSummaryStats(res.data.stats || { totalCount: 0, pendingCount: 0, approvedCount: 0, completedCount: 0 });
        }
      } catch (err) {
        console.warn('Error loading training requests:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadRequests();
    return () => { isMounted = false; };
  }, []);

  // Calculated Metrics
  const totalCount = requestsData.length;
  const pendingCount = requestsData.filter(r => r.status === 'Pending').length;
  const approvedCount = requestsData.filter(r => r.status === 'Approved').length;
  const completedCount = requestsData.filter(r => r.status === 'Completed').length;

  // Filter Data Logic
  const filteredRequests = requestsData.filter((item) => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || item.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handlers
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionLoading(true);
      await teamLeaderAPI.updateRequestStatus(id, newStatus);
      setRequestsData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      showToast(`Request ${id} status updated to ${newStatus} in DB.`);
    } catch (err) {
      console.warn('Error updating status:', err);
      showToast(`Failed to update request status.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRequests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRequests.map(r => r.id));
    }
  };

  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      setActionLoading(true);
      await teamLeaderAPI.batchApproveRequests(selectedIds);
      setRequestsData(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, status: 'Approved' } : item));
      showToast(`Successfully batch approved ${selectedIds.length} training request(s) in DB.`);
      setSelectedIds([]);
      setActiveModal(null);
    } catch (err) {
      console.warn('Error batch approving:', err);
      showToast('Failed to batch approve requests.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSVReport = () => {
    if (requestsData.length === 0) {
      showToast('No training requests available to export.');
      return;
    }

    const headers = ["Request ID", "Member Name", "Role / Provider", "Requested Course", "Cost", "Priority", "Status", "Justification"];
    const rows = filteredRequests.map(r => [
      `"${r.id}"`,
      `"${r.name}"`,
      `"${r.role}"`,
      `"${r.course}"`,
      `"${r.cost}"`,
      `"${r.priority}"`,
      `"${r.status}"`,
      `"${(r.justification || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `team_training_investment_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Investment Report CSV successfully exported!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar Container */}
      <TeamLeaderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Dashboard Area - Fluid Full Width */}
      <main className="flex-1 ml-72 p-10 w-full space-y-8">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#0b1221] tracking-tight">Team Training Requests</h1>
            <p className="text-slate-500 text-sm font-semibold mt-1">Review, approve, and manage team professional development pathways</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Priority Filter */}
            <div className="relative">
              <select 
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="appearance-none bg-white border border-slate-200 pl-4 pr-9 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-slate-200 pl-4 pr-9 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </header>

        {/* 1. Summary Metrics Panel */}
        <div className="grid grid-cols-4 gap-6">
          <OverviewMetricCard 
            title="TOTAL REQUESTS" 
            value={totalCount} 
            subValue={`${pendingCount} pending review`} 
            subValueColor="text-blue-600 font-bold"
          />
          <OverviewMetricCard 
            title="PENDING APPROVAL" 
            value={pendingCount} 
            badgeText={pendingCount > 0 ? "Action Required" : "Up to Date"} 
            badgeColor={pendingCount > 0 ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}
          />
          <OverviewMetricCard 
            title="APPROVED" 
            value={approvedCount} 
            subValue={`${Math.round((approvedCount / (totalCount || 1)) * 100)}% approval rate`} 
            subValueColor="text-emerald-600 font-bold"
          />
          <OverviewMetricCard 
            title="COMPLETED" 
            value={completedCount} 
            subValue="Skill levels updated" 
            subValueColor="text-slate-500 font-semibold"
            showIndicator={true}
          />
        </div>

        {/* 2. Management Table Data Wrapper Block */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Manage Training Requests</h3>
              {selectedIds.length > 0 && (
                <span className="text-xs font-black bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-xl">
                  {selectedIds.length} Selected
                </span>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 rounded-xl pl-11 pr-4 py-2 text-xs font-semibold text-slate-700 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Table Headers */}
          <div className="space-y-4">
            <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest px-6 pb-1">
              <div className="w-[4%]">
                <input 
                  type="checkbox" 
                  checked={filteredRequests.length > 0 && selectedIds.length === filteredRequests.length}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div className="w-[12%]">REQUEST ID</div>
              <div className="w-[20%]">MEMBER</div>
              <div className="w-[30%]">REQUESTED TRAINING</div>
              <div className="w-[11%] text-center">PRIORITY</div>
              <div className="w-[11%] text-center">STATUS</div>
              <div className="w-[12%] text-right">ACTIONS</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-3.5">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((row) => (
                  <RequestItemRow 
                    key={row.id} 
                    item={row} 
                    isSelected={selectedIds.includes(row.enrollmentId || row.id)}
                    onSelect={() => handleToggleSelect(row.enrollmentId || row.id)}
                    onApprove={() => handleUpdateStatus(row.enrollmentId || row.id, 'Approved')}
                    onReject={() => handleUpdateStatus(row.enrollmentId || row.id, 'Rejected')}
                    onViewDetails={() => {
                      setSelectedRequest(row);
                      setActiveModal('details');
                    }}
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-bold">
                  {loading ? 'Loading training requests...' : 'No training requests found matching the current filters.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Operational Analysis Metrics */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Block: Demands Breakdown */}
          <div className="col-span-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Training Demand by Skill</h3>
            <div className="space-y-6 pt-2">
              {trainingDemand.map((track, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-black text-slate-800">
                    <span>{track.skill}</span>
                    <span>{track.percentage}% of requests</span>
                  </div>
                  <div className="w-full bg-[#FFFDF5] h-2.5 rounded-full overflow-hidden border border-amber-100/40">
                    <div className={`h-full ${track.color} rounded-full transition-all duration-500`} style={{ width: `${track.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block: AI Optimization Engine Insights */}
          <div className="col-span-6 bg-[#F3F6FF] rounded-[2.5rem] p-8 border border-blue-100/60 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 size={18} className="text-blue-600" />
              <span className="text-sm font-black text-blue-900 uppercase tracking-wider">AI Training Insights</span>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-center">
              <InsightMessageBox 
                title="Budget & License Optimization"
                text="Approving corporate training requests in batch optimizes tenant licensing costs and accelerates team deployment thresholds."
              />
              <InsightMessageBox 
                title="Readiness Gap Impact"
                text="Approving high priority training requests directly closes active critical capability gaps identified in team readiness scores."
              />
            </div>
          </div>

        </div>

        {/* 4. Controls Action Area Base Footer Panel */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm text-center space-y-4 max-w-[900px] mx-auto">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Operational Controls</h3>
          <p className="text-slate-400 text-xs font-semibold max-w-xl mx-auto">
            Batch process pending requests or generate comprehensive training investment reports.
          </p>
          <div className="flex flex-col gap-3 pt-2 items-center justify-center">
            <button 
              onClick={() => setActiveModal('batch')}
              disabled={selectedIds.length === 0 || actionLoading}
              className={`px-8 py-3.5 font-black text-xs rounded-2xl shadow-xl transition-all min-w-[240px] flex items-center justify-center gap-2 ${
                selectedIds.length > 0 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 cursor-pointer' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {actionLoading && <Loader2 size={14} className="animate-spin" />}
              <span>Batch Approve Selected ({selectedIds.length})</span>
            </button>
            <button 
              onClick={() => setActiveModal('report')}
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-2xl shadow-sm transition-all min-w-[240px] cursor-pointer flex items-center justify-center gap-2"
            >
              <Download size={14} />
              <span>Generate Investment Report</span>
            </button>
          </div>
        </div>

      </main>

      {/* --- Action Modals --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          
          {/* 1. Request Details Modal */}
          {activeModal === 'details' && selectedRequest && (
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-400">{selectedRequest.id}</span>
                  <h3 className="text-lg font-bold text-slate-900">Request Details</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                    {selectedRequest.initials || 'EM'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedRequest.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{selectedRequest.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block mb-1">Estimated Cost</span>
                    <span className="font-black text-slate-800 text-sm">{selectedRequest.cost}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block mb-1">Provider</span>
                    <span className="font-black text-slate-800 text-sm">{selectedRequest.provider}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Justification</span>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">{selectedRequest.justification}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    handleUpdateStatus(selectedRequest.enrollmentId || selectedRequest.id, 'Rejected');
                    setActiveModal(null);
                  }} 
                  className="w-1/2 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Reject Request
                </button>
                <button 
                  onClick={() => {
                    handleUpdateStatus(selectedRequest.enrollmentId || selectedRequest.id, 'Approved');
                    setActiveModal(null);
                  }} 
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Approve Request
                </button>
              </div>
            </div>
          )}

          {/* 2. Batch Approve Confirmation Modal */}
          {activeModal === 'batch' && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Sparkles size={20} />
                  <h3 className="text-lg font-bold text-slate-900">Confirm Batch Approval</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                You are about to approve <span className="font-black text-slate-900">{selectedIds.length} training request(s)</span> in the database. This will update course enrollment statuses for team members.
              </p>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button 
                  onClick={handleBatchApprove} 
                  disabled={actionLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>{actionLoading ? 'Approving...' : 'Confirm Approval'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. Investment Report Modal */}
          {activeModal === 'report' && (
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <FileSpreadsheet size={20} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Training Investment Report</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Generate an executive budget summary broken down by department, provider discounts, and projected skill capability gains.
              </p>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleExportCSVReport();
                    setActiveModal(null);
                  }} 
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  <span>Export CSV Report</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

/* --- Visual Presentational Element Cards --- */

const OverviewMetricCard = ({ title, value, subValue, subValueColor, badgeText, badgeColor, showIndicator }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden">
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h4 className="text-3xl font-black tracking-tight text-slate-900 mt-2">{value}</h4>
    </div>
    <div className="mt-2">
      {subValue && (
        <div className={`text-xs flex items-center gap-1.5 ${subValueColor}`}>
          {showIndicator && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>}
          {subValue}
        </div>
      )}
      {badgeText && (
        <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-xl uppercase tracking-wide ${badgeColor}`}>
          {badgeText}
        </span>
      )}
    </div>
  </div>
);

const RequestItemRow = ({ item, isSelected, onSelect, onApprove, onReject, onViewDetails }) => {
  let priorityBadge = "bg-blue-50 text-blue-600";
  if (item.priority === "High") priorityBadge = "bg-rose-50 text-rose-600";
  if (item.priority === "Medium") priorityBadge = "bg-amber-50 text-amber-600";

  let statusDot = "bg-amber-500";
  if (item.status === 'Approved') statusDot = "bg-emerald-500";
  if (item.status === 'Completed') statusDot = "bg-blue-500";
  if (item.status === 'Rejected') statusDot = "bg-rose-500";

  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all shadow-sm ${
      isSelected ? 'bg-blue-50/40 border-blue-200' : 'bg-[#FFFDF5]/40 border-amber-100/30 hover:border-slate-200 hover:bg-white'
    }`}>
      
      <div className="w-[4%] flex items-center">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={onSelect}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </div>

      <div className="w-[12%] text-xs font-bold text-slate-400 tracking-tight">{item.id}</div>
      
      <div className="flex items-center gap-3 w-[20%]">
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200 shrink-0">
          {item.initials || 'EM'}
        </div>
        <span className="text-xs font-black text-slate-900 leading-none">{item.name}</span>
      </div>

      <div className="w-[30%]">
        <p className="text-xs font-black text-slate-900 leading-tight">{item.course}</p>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{item.role}</p>
      </div>

      <div className="w-[11%] flex justify-center">
        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black ${priorityBadge}`}>
          {item.priority}
        </span>
      </div>

      <div className="w-[11%] flex justify-center items-center gap-1.5 text-xs font-black text-slate-700">
        <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
        {item.status}
      </div>

      <div className="w-[12%] flex justify-end items-center gap-1.5">
        {item.status === "Pending" ? (
          <>
            <button 
              onClick={onApprove}
              className="p-1.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Approve Request"
            >
              <Check size={14} strokeWidth={3} />
            </button>
            <button 
              onClick={onReject}
              className="p-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Reject Request"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </>
        ) : (
          <span className="text-[11px] font-bold text-slate-400 italic pr-2">{item.status}</span>
        )}
        <button 
          onClick={onViewDetails}
          className="p-1.5 bg-slate-50 border border-slate-200/80 text-slate-500 rounded-xl hover:bg-slate-100 transition-all shadow-sm cursor-pointer"
          title="View Request Details"
        >
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
};

const InsightMessageBox = ({ title, text }) => (
  <div className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm space-y-1">
    <h4 className="text-xs font-black text-slate-900 tracking-tight">{title}</h4>
    <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
  </div>
);