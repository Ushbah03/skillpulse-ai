import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Download, TrendingUp, Award, Users, Rocket, CheckCircle, AlertCircle, Eye, FileText, Sparkles, X
} from 'lucide-react';
import { employeeAPI } from '../services/api';
import SkillPulseLoader from './SkillPulseLoader';

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

  // --- Certificate Download / Print Handler ---
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
      background-color: #E9EAF7;
      font-family: 'Inter', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #17233E;
    }
    .certificate-page {
      width: 1000px;
      background: #FFFFFF;
      padding: 45px 60px 35px 60px;
      position: relative;
      box-shadow: 0 20px 40px -15px rgba(23, 35, 62, 0.15);
      border: 3px solid #17233E;
      outline: 1px solid #8A9CB7;
      outline-offset: -12px;
      text-align: center;
    }

    .brand-header {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 5px;
      color: #1988A3;
      text-transform: uppercase;
    }
    .cert-title {
      font-family: 'Cinzel', serif;
      font-size: 34px;
      font-weight: 700;
      color: #17233E;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin: 12px 0 4px 0;
    }
    .divider-line {
      width: 70px;
      height: 2px;
      background: #1988A3;
      margin: 10px auto 18px auto;
    }
    .presented-text {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 3px;
      color: #5A6D89;
      text-transform: uppercase;
    }
    .recipient-name {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 44px;
      font-weight: 600;
      color: #17233E;
      margin: 10px 0 16px 0;
      border-bottom: 1px dashed #CBD5E1;
      display: inline-block;
      padding: 0 40px 6px 40px;
    }
    .cert-body {
      font-size: 14px;
      line-height: 1.6;
      color: #5A6D89;
      max-width: 640px;
      margin: 0 auto 20px auto;
    }
    .skill-title {
      font-weight: 700;
      color: #17233E;
      font-size: 17px;
    }

    .seal-emblem {
      width: 70px;
      height: 70px;
      border: 2px dashed #1988A3;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 auto 16px auto;
    }
    .seal-text {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #1988A3;
    }
    .seal-sub {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #5A6D89;
    }

    .metadata-grid {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #E2E8F0;
      padding-top: 14px;
      font-size: 11px;
      color: #5A6D89;
      text-align: left;
    }
    .meta-block strong {
      display: block;
      color: #17233E;
      margin-bottom: 2px;
    }

    .print-btn {
      position: fixed;
      top: 24px;
      right: 24px;
      background: #17233E;
      color: #FFFFFF;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(23, 35, 62, 0.2);
      z-index: 1000;
    }
    .print-btn:hover { background: #1988A3; }
    
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
        border: 4px solid #17233E !important;
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

  if (loading) {
    return <SkillPulseLoader message="Aggregating Assessment Telemetry..." />;
  }

  return (
    <div className="bg-transparent min-h-screen p-0 pb-12 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#1988A3]/10 text-[#1988A3] px-2.5 py-1 rounded-lg border border-[#1988A3]/25">
              {workspaceName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#17233E] tracking-tight">Assessment Results</h1>
          <p className="text-[#5A6D89] text-xs sm:text-sm md:text-base mt-1 font-medium">Review your performance, validated skill levels, and detailed validation logs</p>
        </div>
        
        <div className="flex items-center gap-2.5 sm:gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial w-full sm:w-auto">
            <Search className="absolute left-4 top-3.5 text-[#8A9CB7] w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search results..." 
              className="pl-11 pr-4 py-2.5 bg-[#F0F5FB]/85 backdrop-blur-md border border-[#8A9CB7]/30 rounded-2xl w-full sm:w-60 md:w-72 text-sm text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:border-[#1988A3] shadow-sm transition-all" 
            />
          </div>
          <button 
            onClick={() => navigate('/dashboard/assessment')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#17233E] hover:bg-[#1988A3] text-white px-4 sm:px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#17233E]/20"
          >
            Take New Assessment
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 mb-6 sm:mb-10">
        <ResultStat label="Average Score" value={`${avgScore}%`} trend={totalTaken > 0 ? "Overall success rate" : "No completed exams"} icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#1988A3]" />} color="cyan" />
        <ResultStat label="Highest Proficiency" value={levelLabel} trend={totalTaken > 0 ? `Validated score: ${highestScore}%` : "Awaiting first exam"} icon={<Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />} color="emerald" />
        <ResultStat label="Assessments Taken" value={totalTaken} trend="Total completed attempts" icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#17233E]" />} color="navy" />
        <ResultStat label="Readiness Impact" value={`+${Math.round(highestScore * 0.1)}%`} trend={totalTaken > 0 ? `Benchmark score: ${highestScore}%` : "Initial profile setup"} icon={<Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />} color="amber" />
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-10 items-stretch">
        {/* Score History */}
        <div className="lg:col-span-2 glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem] flex flex-col">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-black text-[#17233E] flex items-center gap-2 sm:gap-3">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#1988A3]" /> Completed Attempts & Score History
            </h3>
            <span className="text-xs font-bold text-[#5A6D89] bg-[#17233E]/5 px-2.5 sm:px-3 py-1 rounded-full">
              {filteredTaken.length} {filteredTaken.length === 1 ? 'Attempt' : 'Attempts'}
            </span>
          </div>
          
          {filteredTaken.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto pr-1 sm:pr-2 flex-1 scrollbar-thin scrollbar-thumb-[#8A9CB7]/30 scrollbar-track-transparent">
              {filteredTaken.map((t) => {
                const isPassed = t.score >= 75;
                const difficulty = t.resultsJson?.difficulty || (t.score >= 80 ? 'ADVANCED' : 'INTERMEDIATE');
                const diffBadgeStyle = difficulty === 'EXPERT' ? 'bg-rose-50 text-rose-600 border-rose-200' : difficulty === 'ADVANCED' ? 'bg-[#1988A3]/10 text-[#1988A3] border-[#1988A3]/25' : 'bg-amber-50 text-amber-600 border-amber-200';

                return (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedResult(t)}
                    className="p-3.5 sm:p-5 bg-[#F0F5FB]/85 backdrop-blur-md border border-[#8A9CB7]/25 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 sm:gap-4 hover:border-[#1988A3]/40 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                        isPassed ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      }`}>
                        {isPassed ? <Award className="w-5 h-5 sm:w-6 sm:h-6" /> : <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-black text-[#17233E] text-sm sm:text-base group-hover:text-[#1988A3] transition-colors">
                            {t.title}
                          </h4>
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#17233E]/5 text-[#5A6D89] border border-[#8A9CB7]/20">
                            {t.category}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${diffBadgeStyle}`}>
                            ★ {difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-[#8A9CB7] font-medium">Attempted on {new Date(t.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest">Score</p>
                        <span className={`text-lg sm:text-xl font-black ${isPassed ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {t.score}%
                        </span>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedResult(t); }}
                        className="p-2 sm:p-2.5 bg-white hover:bg-[#1988A3]/10 text-[#8A9CB7] hover:text-[#1988A3] rounded-xl transition-all border border-[#8A9CB7]/25"
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
            <div className="text-center py-16 text-[#5A6D89] font-medium flex-1 flex items-center justify-center">
              No assessment results found in the database. Take your first assessment to view results.
            </div>
          )}
        </div>

        {/* Skill Validation Status */}
        <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem] text-center flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-black text-[#17233E] mb-4 text-left">Skill Validation Status</h3>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4">
              <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#17233E]/10" />
                <circle 
                  cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={301.59} 
                  strokeDashoffset={301.59 - (301.59 * (highestScore / 100))} 
                  className={highestScore >= 75 ? "text-[#1988A3]" : "text-[#17233E]"} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-black text-[#17233E]">{highestScore}%</span>
                <span className="text-[9px] font-black text-[#8A9CB7] uppercase tracking-wider">Confidence</span>
              </div>
            </div>

            <div className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 mb-4 border ${
              totalTaken > 0 && highestScore >= 75 ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-[#17233E]/5 text-[#5A6D89] border-[#8A9CB7]/25'
            }`}>
              {totalTaken > 0 && highestScore >= 75 ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-[#8A9CB7]" />}
              {totalTaken > 0 ? `${levelLabel} Skill Validated` : 'Pending Verification'}
            </div>

            <div className="space-y-2.5 text-left border-t border-[#8A9CB7]/20 pt-4">
              <StatusRow label="Validation Status" value={totalTaken > 0 ? "Active & Verified" : "Verification Required"} color={totalTaken > 0 ? "text-emerald-600" : "text-[#8A9CB7]"} />
              <StatusRow label="Role Readiness Impact" value={`+${Math.round(highestScore * 0.1)} Points`} color={totalTaken > 0 ? "text-[#1988A3]" : "text-[#8A9CB7]"} />
              <StatusRow label="Certificate Code" value={totalTaken > 0 ? `SP-${taken[0]?.id.substring(0, 6).toUpperCase()}` : "N/A"} />
            </div>
          </div>

          {totalTaken > 0 && taken[0]?.score >= 80 && (
            <button
              onClick={() => handleDownloadCertificate(taken[0])}
              className="w-full mt-4 py-3 bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] hover:brightness-110 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#17233E]/20"
            >
              <Download className="w-4 h-4" /> Download Certificate
            </button>
          )}
        </div>
      </div>

      {/* Detailed Result Inspection Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17233E]/60 backdrop-blur-md p-6 overflow-y-auto">
          <div className="bg-[#D8EBF9]/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/80">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#121E33] p-8 text-white flex justify-between items-center relative">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#1988A3] text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {selectedResult.category}
                  </span>
                  <span className="text-xs font-bold text-[#8A9CB7]">• ★ {selectedResult.resultsJson?.difficulty || 'INTERMEDIATE'}</span>
                </div>
                <h2 className="text-2xl font-black">{selectedResult.title}</h2>
              </div>
              <button onClick={() => setSelectedResult(null)} className="text-[#8A9CB7] hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Score Banner */}
              <div className={`p-6 rounded-2xl border mb-8 flex justify-around items-center ${
                selectedResult.score >= 75 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'
              }`}>
                <div className="text-center">
                  <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest mb-1">Final Score</p>
                  <p className={`text-4xl font-black ${selectedResult.score >= 75 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {selectedResult.score}%
                  </p>
                </div>
                <div className="h-10 w-px bg-[#8A9CB7]/30" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest mb-1">Correct Answers</p>
                  <p className="text-2xl font-black text-[#17233E]">{selectedResult.correctAnswers} / {selectedResult.totalQuestions}</p>
                </div>
                <div className="h-10 w-px bg-[#8A9CB7]/30" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest mb-1">Outcome</p>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                    selectedResult.score >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {selectedResult.score >= 75 ? 'VERIFIED' : 'GAP RECORDED'}
                  </span>
                </div>
              </div>

              {/* Validation Log & System Impact */}
              <div className="bg-[#17233E]/5 p-6 rounded-2xl border border-[#8A9CB7]/25 mb-8 space-y-3 text-sm">
                <h4 className="font-bold text-[#17233E] mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1988A3]" /> System Impact Log
                </h4>
                <div className="flex justify-between text-[#5A6D89]">
                  <span>Attempt Date:</span>
                  <span className="font-bold text-[#17233E]">{new Date(selectedResult.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#5A6D89]">
                  <span>Database Verification:</span>
                  <span className={`font-bold ${selectedResult.score >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedResult.score >= 75 ? 'UserSkill Marked Verified' : 'SkillGap Recorded in DB'}
                  </span>
                </div>
                <div className="flex justify-between text-[#5A6D89]">
                  <span>Certificate Issued:</span>
                  <span className="font-bold text-[#17233E]">{selectedResult.score >= 80 ? 'Yes (80%+ Passed)' : 'No (Requires 80%+)'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {selectedResult.score >= 80 && (
                  <button
                    onClick={() => handleDownloadCertificate(selectedResult)}
                    className="flex-1 bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#1988A3] hover:brightness-110 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Download className="w-4 h-4" /> Download Certificate
                  </button>
                )}
                <button
                  onClick={() => setSelectedResult(null)}
                  className="flex-1 bg-[#17233E] hover:bg-[#1988A3] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md"
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
    cyan: 'bg-[#1988A3]/10 border border-[#1988A3]/20',
    emerald: 'bg-emerald-500/10 border border-emerald-500/20',
    navy: 'bg-[#17233E]/10 border border-[#17233E]/20',
    amber: 'bg-amber-500/10 border border-amber-500/20'
  };
  return (
    <div className="glass-panel p-3.5 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between">
      <div className="flex justify-between items-start gap-1 mb-2 sm:mb-3">
        <p className="text-[#5A6D89] text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">{label}</p>
        <div className={`${themes[color]} p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shrink-0`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-xl sm:text-3xl font-black text-[#17233E] mb-0.5 sm:mb-1 tracking-tight truncate">{value}</h3>
        <p className="text-[#5A6D89] text-[10px] sm:text-xs font-medium truncate">{trend}</p>
      </div>
    </div>
  );
};

const StatusRow = ({ label, value, color = "text-[#17233E]" }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-[#5A6D89] text-xs font-medium">{label}</span>
    <span className={`text-xs font-bold ${color}`}>{value}</span>
  </div>
);

export default AssessmentResults;
