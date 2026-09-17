import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, Bell, TrendingUp, 
  Award, Users, Rocket, CheckCircle, CheckCircle2, AlertCircle, ArrowRight, Loader2, X, Eye, FileText, Sparkles
} from 'lucide-react';
import { employeeAPI } from '../services/api';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const [taken, setTaken] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const workspaceName = storedUser.tenant?.name || 'Enterprise Corp Workspace';

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await employeeAPI.getAssessments();
        if (res.success && res.data?.taken) {
          setTaken(res.data.taken);
        }
      } catch (err) {
        console.warn('Error loading assessment results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  // Real Dynamic Calculations (Zero-State Safe)
  const totalTaken = taken.length;
  const avgScore = totalTaken > 0 ? Math.round(taken.reduce((sum, item) => sum + item.score, 0) / totalTaken) : 0;
  const highestScore = totalTaken > 0 ? Math.max(...taken.map(t => t.score)) : 0;
  const levelLabel = totalTaken > 0 
    ? (highestScore >= 90 ? 'Expert' : highestScore >= 80 ? 'Advanced' : highestScore >= 60 ? 'Intermediate' : 'Beginner') 
    : 'N/A';

  const filteredTaken = taken.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Certificate Download / Print Handler (Mature & Clean Landscape Style) ---
  const handleDownloadCertificate = (result) => {
    const issueDate = new Date(result.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const studentName = storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : 'Waqar Mughal';
    const certCode = `SP-CERT-${result.id.substring(0, 8).toUpperCase()}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate of Competency - ${result.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@1,600&display=swap');
    
    @page {
      size: A4 landscape;
      margin: 0;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 30px;
      background-color: #F8FAFC;
      font-family: 'Inter', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #0F172A;
    }
    .certificate-page {
      width: 1000px;
      background: #FFFFFF;
      padding: 45px 60px 35px 60px;
      position: relative;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.12);
      border: 3px solid #0F172A;
      outline: 1px solid #CBD5E1;
      outline-offset: -12px;
      text-align: center;
    }

    .brand-header {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 5px;
      color: #64748B;
      text-transform: uppercase;
    }
    .cert-title {
      font-family: 'Cinzel', serif;
      font-size: 34px;
      font-weight: 700;
      color: #0F172A;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin: 12px 0 4px 0;
    }
    .divider-line {
      width: 70px;
      height: 2px;
      background: #0F172A;
      margin: 10px auto 18px auto;
    }
    .presented-text {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 3px;
      color: #64748B;
      text-transform: uppercase;
    }
    .recipient-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 48px;
      font-style: italic;
      font-weight: 600;
      color: #0F172A;
      margin: 8px 0 12px 0;
      line-height: 1.1;
    }
    .cert-body {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
      max-width: 680px;
      margin: 0 auto 20px auto;
      font-weight: 400;
    }
    .skill-title {
      font-family: 'Cinzel', serif;
      font-size: 22px;
      font-weight: 700;
      color: #0F172A;
      margin-top: 6px;
      display: inline-block;
      letter-spacing: 1.5px;
    }

    .seal-emblem {
      width: 70px;
      height: 70px;
      border: 1.5px solid #0F172A;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 20px auto 25px auto;
      color: #0F172A;
    }
    .seal-text {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .seal-sub {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #64748B;
      margin-top: 1px;
      text-transform: uppercase;
    }

    .metadata-grid {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 18px;
      border-top: 1px solid #E2E8F0;
      text-align: left;
    }
    .meta-block {
      font-size: 11px;
      color: #64748B;
      line-height: 1.6;
    }
    .meta-block strong {
      color: #0F172A;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 10px;
      display: block;
      margin-bottom: 4px;
    }
    .print-btn {
      position: fixed;
      top: 24px;
      right: 24px;
      background: #0F172A;
      color: #FFFFFF;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
      z-index: 1000;
    }
    .print-btn:hover { background: #334155; }
    
    @media print {
      body {
        background: white !important;
        padding: 0 !important;
      }
      .print-btn {
        display: none !important;
      }
      .certificate-page {
        width: 100vw !important;
        height: 100vh !important;
        box-shadow: none !important;
        border: 4px solid #0F172A !important;
        outline-offset: -16px !important;
        page-break-after: avoid;
        page-break-inside: avoid;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

  <div class="certificate-page">
    <div class="brand-header">SkillPulse AI • Workforce Intelligence</div>
    
    <div class="cert-title">Certificate of Competency</div>
    <div class="divider-line"></div>

    <div class="presented-text">This document certifies that</div>
    <div class="recipient-name">${studentName}</div>

    <div class="cert-body">
      has successfully demonstrated technical proficiency in the standardized AI evaluation framework for
      <br>
      <div class="skill-title">${result.title}</div>
    </div>

    <div class="seal-emblem">
      <span class="seal-text">VERIFIED</span>
      <span class="seal-sub">COMPETENCY</span>
    </div>

    <div class="metadata-grid">
      <div class="meta-block">
        <strong>Verification Record</strong>
        Domain Category: ${result.category}<br>
        Organization: ${workspaceName}
      </div>
      <div class="meta-block" style="text-align: right;">
        <strong>Credential Metadata</strong>
        Certificate ID: ${certCode}<br>
        Issue Date: ${issueDate}<br>
        Validation Status: VERIFIED
      </div>
    </div>
  </div>
</body>
</html>
`;

    const certWindow = window.open('', '_blank');
    certWindow.document.write(htmlContent);
    certWindow.document.close();
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-10 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
              {workspaceName}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Results</h1>
          <p className="text-slate-500 text-base mt-1 font-medium">Review your performance, validated skill levels, and detailed validation logs</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search results..." 
              className="pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl w-72 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-sm" 
            />
          </div>
          <button 
            onClick={() => navigate('/dashboard/assessment')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-md text-sm"
          >
            Take New Assessment
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        <ResultStat label="Average Score" value={`${avgScore}%`} trend={totalTaken > 0 ? "Overall success rate" : "No assessments completed"} icon={<TrendingUp className="w-5 h-5" />} color="blue" />
        <ResultStat label="Highest Proficiency" value={levelLabel} trend={totalTaken > 0 ? `Validated score: ${highestScore}%` : "Awaiting first exam"} icon={<Award className="w-5 h-5" />} color="emerald" />
        <ResultStat label="Assessments Taken" value={totalTaken} trend="Total completed attempts" icon={<Users className="w-5 h-5" />} color="violet" />
        <ResultStat label="Readiness Impact" value={`+${Math.round(highestScore * 0.1)}%`} trend={totalTaken > 0 ? `Benchmark score: ${highestScore}%` : "Initial profile setup"} icon={<Rocket className="w-5 h-5" />} color="orange" />
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        {/* Score History */}
        <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-600" /> Completed Attempts & Score History
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              {filteredTaken.length} {filteredTaken.length === 1 ? 'Attempt' : 'Attempts'}
            </span>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredTaken.length > 0 ? (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
              {filteredTaken.map((t) => {
                const isPassed = t.score >= 75;
                const difficulty = t.resultsJson?.difficulty || (t.score >= 80 ? 'ADVANCED' : 'INTERMEDIATE');
                const diffBadgeStyle = difficulty === 'EXPERT' ? 'bg-rose-50 text-rose-600 border-rose-200' : difficulty === 'ADVANCED' ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-amber-50 text-amber-600 border-amber-200';

                return (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedResult(t)}
                    className="p-5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                        isPassed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {isPassed ? <Award className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                          <h4 className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                            {t.title}
                          </h4>
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {t.category}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${diffBadgeStyle}`}>
                            ★ {difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Attempted on {new Date(t.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                        <span className={`text-xl font-black ${isPassed ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {t.score}%
                        </span>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedResult(t); }}
                        className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all border border-slate-100"
                        title="View Detailed Breakdown"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 font-medium">
              No assessment results found in the database. Take your first assessment to view results.
            </div>
          )}
        </div>

        {/* Skill Validation Status */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-left">Skill Validation Status</h3>
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" 
                  strokeDasharray={402} 
                  strokeDashoffset={402 - (402 * (highestScore / 100))} 
                  className={highestScore >= 75 ? "text-emerald-500" : "text-slate-300"} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{highestScore}%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Confidence</span>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 mb-6 border ${
              totalTaken > 0 && highestScore >= 75 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {totalTaken > 0 && highestScore >= 75 ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-slate-400" />}
              {totalTaken > 0 ? `${levelLabel} Skill Validated` : 'Pending Verification'}
            </div>

            <div className="space-y-3 text-left border-t border-slate-50 pt-6">
              <StatusRow label="Validation Status" value={totalTaken > 0 ? "Active & Verified" : "Verification Required"} color={totalTaken > 0 ? "text-emerald-600" : "text-slate-400"} />
              <StatusRow label="Role Readiness Impact" value={`+${Math.round(highestScore * 0.1)} Points`} color={totalTaken > 0 ? "text-emerald-500" : "text-slate-400"} />
              <StatusRow label="Certificate Code" value={totalTaken > 0 ? `SP-${taken[0]?.id.substring(0, 6).toUpperCase()}` : "N/A"} />
            </div>
          </div>

          {totalTaken > 0 && taken[0]?.score >= 80 && (
            <button
              onClick={() => handleDownloadCertificate(taken[0])}
              className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Download className="w-4 h-4" /> Download Certificate
            </button>
          )}
        </div>
      </div>

      {/* Detailed Result Inspection Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100">
            
            {/* Modal Header */}
            <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center relative">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {selectedResult.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">• ★ {selectedResult.resultsJson?.difficulty || 'INTERMEDIATE'}</span>
                </div>
                <h2 className="text-2xl font-black">{selectedResult.title}</h2>
              </div>
              <button onClick={() => setSelectedResult(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Score Banner */}
              <div className={`p-6 rounded-2xl border mb-8 flex justify-around items-center ${
                selectedResult.score >= 75 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
              }`}>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
                  <p className={`text-4xl font-black ${selectedResult.score >= 75 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {selectedResult.score}%
                  </p>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Correct Answers</p>
                  <p className="text-2xl font-black text-slate-800">{selectedResult.correctAnswers} / {selectedResult.totalQuestions}</p>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Outcome</p>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                    selectedResult.score >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {selectedResult.score >= 75 ? 'VERIFIED' : 'GAP RECORDED'}
                  </span>
                </div>
              </div>

              {/* Validation Log & System Impact */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 space-y-3 text-sm">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> System Impact Log
                </h4>
                <div className="flex justify-between text-slate-600">
                  <span>Attempt Date:</span>
                  <span className="font-bold">{new Date(selectedResult.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Database Verification:</span>
                  <span className={`font-bold ${selectedResult.score >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedResult.score >= 75 ? 'UserSkill Marked Verified' : 'SkillGap Recorded in DB'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Certificate Issued:</span>
                  <span className="font-bold text-slate-700">{selectedResult.score >= 80 ? 'Yes (80%+ Passed)' : 'No (Requires 80%+)'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {selectedResult.score >= 80 && (
                  <button
                    onClick={() => handleDownloadCertificate(selectedResult)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Download className="w-4 h-4" /> Download Certificate
                  </button>
                )}
                <button
                  onClick={() => setSelectedResult(null)}
                  className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md"
                >
                  Close Inspection
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
const ResultStat = ({ label, value, trend, icon, color }) => {
  const themes = {
    blue: 'text-blue-600 bg-blue-50/50',
    emerald: 'text-emerald-600 bg-emerald-50/50',
    violet: 'text-violet-600 bg-violet-50/50',
    orange: 'text-orange-600 bg-orange-50/50'
  };
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        <div className={`${themes[color]} p-2.5 rounded-2xl`}>{icon}</div>
      </div>
      <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">{value}</h3>
      <p className="text-slate-500 text-sm font-medium">{trend}</p>
    </div>
  );
};

const StatusRow = ({ label, value, color = "text-slate-700" }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-slate-500 text-sm font-medium">{label}</span>
    <span className={`text-sm font-bold ${color}`}>{value}</span>
  </div>
);

export default AssessmentResults;