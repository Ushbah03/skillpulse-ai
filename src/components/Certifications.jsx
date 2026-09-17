import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import { Loader2, Download } from 'lucide-react';

const Certifications = () => {
  const [completed, setCompleted] = useState([]);
  const [skillCerts, setSkillCerts] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const workspaceName = storedUser.tenant?.name || 'Apex Tech Solutions Workspace';
  const userInitials = `${storedUser.firstName?.charAt(0) || 'E'}${storedUser.lastName?.charAt(0) || 'Z'}`;

  useEffect(() => {
    async function loadCertificationsData() {
      try {
        setLoading(true);
        const [recsRes, profileRes, asmRes] = await Promise.allSettled([
          employeeAPI.getLearningRecs(),
          employeeAPI.getProfile(),
          employeeAPI.getAssessments()
        ]);

        if (recsRes.status === 'fulfilled' && recsRes.value?.success && Array.isArray(recsRes.value.data)) {
          const finished = recsRes.value.data.filter(c => c.enrollmentStatus === 'COMPLETED' || (c.progressPct && c.progressPct >= 100));
          setCompleted(finished);
        }

        if (profileRes.status === 'fulfilled' && profileRes.value?.success && profileRes.value.data) {
          const uSkills = profileRes.value.data.userSkills || profileRes.value.data.skills || [];
          const vSkills = uSkills.filter(s => s.verified || s.isVerified);
          setVerifiedSkills(vSkills);
        }

        if (asmRes.status === 'fulfilled' && asmRes.value?.success && asmRes.value.data?.taken) {
          const passed = asmRes.value.data.taken.filter(a => Number(a.score) >= 75);
          setSkillCerts(passed);
        }
      } catch (err) {
        console.warn('Error loading certifications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCertificationsData();
  }, []);

  const allCertifications = [
    ...completed.map(c => ({
      id: c.id,
      title: c.title,
      category: 'Courseware Training',
      provider: c.provider || 'YouTube Educational LMS',
      completedAt: c.completedAt,
      credentialId: c.credentialId || `SP-CRS-${String(c.id).substring(0, 8).toUpperCase()}`,
      certType: 'COURSE',
      skillsTaught: c.skillsTaught || ["VERIFIED SKILL"],
      level: c.level || 'Intermediate'
    })),
    ...skillCerts.map(a => ({
      id: a.id,
      title: a.title,
      category: a.category || 'Skill Verification',
      provider: 'SkillPulse Assessment Engine',
      completedAt: a.createdAt,
      credentialId: a.credentialId || `SP-CERT-${String(a.id).substring(0, 8).toUpperCase()}`,
      certType: 'ASSESSMENT',
      skillsTaught: [a.category || 'Skill Verification', 'AI Evaluated'],
      level: a.score >= 90 ? 'Expert' : 'Verified'
    }))
  ];

  const filteredCerts = allCertifications.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    c.provider.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Dynamic Badges System
  const badgesList = [
    { 
      id: 'b-1', 
      label: 'Fast Learner', 
      desc: 'Complete 1 course or assessment', 
      unlocked: completed.length >= 1 || skillCerts.length >= 1,
      icon: <IconZap className="w-6 h-6" />,
      bg: 'bg-amber-50',
      color: 'text-amber-500'
    },
    { 
      id: 'b-2', 
      label: 'Skill Master', 
      desc: 'Verify 1 skill in DB assessment', 
      unlocked: verifiedSkills.length >= 1 || skillCerts.length >= 1,
      icon: <IconStar className="w-6 h-6" />,
      bg: 'bg-purple-50',
      color: 'text-purple-500'
    },
    { 
      id: 'b-3', 
      label: 'Course Conqueror', 
      desc: 'Complete 3 learning items', 
      unlocked: (completed.length + skillCerts.length) >= 3,
      icon: <IconRocket className="w-6 h-6" />,
      bg: 'bg-blue-50',
      color: 'text-blue-500'
    },
    { 
      id: 'b-4', 
      label: 'DevOps Pioneer', 
      desc: 'Complete 5 learning items', 
      unlocked: (completed.length + skillCerts.length) >= 5,
      icon: <IconMoon className="w-6 h-6" />,
      bg: 'bg-indigo-50',
      color: 'text-indigo-500'
    }
  ];

  const unlockedBadgesCount = badgesList.filter(b => b.unlocked).length;

  // --- Certificate Download Handler (Landscape Style) ---
  const downloadCertificate = (cert) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentName = user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Waqar Mughal';
    const issueDate = cert.completedAt 
      ? new Date(cert.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
      : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const certCode = cert.credentialId || `SP-CERT-${String(cert.id || 'CERT001').substring(0, 8).toUpperCase()}`;
    const isAssessment = cert.certType === 'ASSESSMENT';
    const categoryName = cert.category || (isAssessment ? 'Skill Verification' : 'Courseware Training');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate of Competency - ${cert.title}</title>
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
    
    <div class="cert-title">${isAssessment ? 'Certificate of Competency' : 'Certificate of Completion'}</div>
    <div class="divider-line"></div>

    <div class="presented-text">This document certifies that</div>
    <div class="recipient-name">${studentName}</div>

    <div class="cert-body">
      ${isAssessment 
        ? 'has successfully demonstrated technical proficiency in the standardized AI evaluation framework for' 
        : 'has successfully completed the enterprise courseware training program for'}
      <br>
      <div class="skill-title">${cert.title}</div>
    </div>

    <div class="seal-emblem">
      <span class="seal-text">VERIFIED</span>
      <span class="seal-sub">${isAssessment ? 'COMPETENCY' : 'COMPLETION'}</span>
    </div>

    <div class="metadata-grid">
      <div class="meta-block">
        <strong>Verification Record</strong>
        Domain Category: ${categoryName}<br>
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
    if (certWindow) {
      certWindow.document.write(htmlContent);
      certWindow.document.close();
    }
  };

  return (
    <div className="p-8 bg-[#F8F9FE] min-h-screen font-sans text-slate-900">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md border border-indigo-100 mb-2 inline-block">
            {workspaceName}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Certifications & Achievements</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Track, verify, and export your enterprise course & skill credentials</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border-2 border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
            />
          </div>

          <div className="w-10 h-10 rounded-xl bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
            {userInitials}
          </div>
        </div>
      </header>

      {/* Top Stats Cards - 100% Live DB Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <HeaderStatCard 
          label="Total Certifications" value={allCertifications.length} 
          icon={<IconFile className="w-6 h-6" />} 
          bgClass="bg-indigo-50" colorClass="text-indigo-600"
          badge={allCertifications.length > 0 ? `${allCertifications.length} Issued` : '0 Issued'} 
          badgeColor={allCertifications.length > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}
        />
        <HeaderStatCard 
          label="Badges Earned" value={unlockedBadgesCount} 
          icon={<IconAward className="w-6 h-6" />} 
          bgClass="bg-orange-50" colorClass="text-orange-600"
          badge={`${unlockedBadgesCount}/${badgesList.length} Unlocked`} 
          badgeColor={unlockedBadgesCount > 0 ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}
        />
        <HeaderStatCard 
          label="Course Certificates" value={completed.length} 
          icon={<IconCheckCircle className="w-6 h-6" />} 
          bgClass="bg-emerald-50" colorClass="text-emerald-600"
          badge={`${completed.length} Completed`} badgeColor="bg-slate-100 text-slate-600" 
        />
        <HeaderStatCard 
          label="Skill Certificates" value={skillCerts.length > 0 ? skillCerts.length : verifiedSkills.length} 
          icon={<IconStar className="w-6 h-6" />} 
          bgClass="bg-purple-50" colorClass="text-purple-600"
          badge="Assessment Verified" badgeColor="bg-amber-100 text-amber-700" 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Main Section */}
        <div className="col-span-12 space-y-10">
          
          {/* My Certifications Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">My Certifications</h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                Showing {filteredCerts.length} Verified Credentials
              </span>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : filteredCerts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCerts.map((c, i) => (
                  <CertCard 
                    key={c.id || i}
                    title={c.title} 
                    provider={c.provider} 
                    date={c.completedAt ? new Date(c.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Permanent'} 
                    certType={c.certType} 
                    skills={c.skillsTaught} 
                    onDownload={() => downloadCertificate(c)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8 space-y-3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <IconFile className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">No Certificates Earned Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Pass a Skill Assessment with 75%+ score or complete 100% of any courseware item to generate your official enterprise certificate PDF.
                </p>
              </div>
            )}
          </section>

          {/* Badges Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Badges & Recognition</h2>
                <p className="text-xs text-slate-500 font-medium">Unlocked automatically as you achieve course & assessment milestones</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {unlockedBadgesCount} of {badgesList.length} Badges Earned
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {badgesList.map((badge) => (
                <BadgeItem 
                  key={badge.id}
                  label={badge.label} 
                  desc={badge.desc}
                  icon={badge.icon} 
                  bg={badge.bg} 
                  color={badge.color} 
                  locked={!badge.unlocked} 
                />
              ))}
            </div>
          </section>

        </div>
      </div>

    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const HeaderStatCard = ({ label, value, icon, badge, badgeColor, bgClass, colorClass }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className={`w-11 h-11 ${bgClass} ${colorClass} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${badgeColor}`}>
        {badge}
      </span>
    </div>
    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">{label}</p>
    <h3 className="text-2xl font-black text-slate-900">{value}</h3>
  </div>
);

const CertCard = ({ title, provider, date, skills, certType, onDownload }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          certType === 'ASSESSMENT' ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600'
        }`}>
          {certType === 'ASSESSMENT' ? <IconStar className="w-6 h-6" /> : <IconFile className="w-6 h-6" />}
        </div>
        <div className="text-right">
          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">
            {certType === 'ASSESSMENT' ? 'Verified Test' : 'Issued'}
          </span>
          <span className="text-xs font-bold text-slate-700">{date}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
          certType === 'ASSESSMENT' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
        }`}>
          {certType === 'ASSESSMENT' ? 'Skill Certificate' : 'Course Certificate'}
        </span>
      </div>

      <h4 className="text-base font-bold mb-1 leading-snug text-slate-900 h-11 overflow-hidden">{title}</h4>
      <p className="text-xs text-slate-400 font-medium mb-5 italic">Issued by {provider}</p>
      
      <div className="flex flex-wrap gap-1.5 mb-6">
        {skills.map(s => (
          <span key={s} className="text-[9px] font-bold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100 tracking-wider">
            #{s}
          </span>
        ))}
      </div>
    </div>

    <div className="flex gap-2">
      <button 
        onClick={onDownload}
        className="grow bg-[#F0F3FF] text-indigo-600 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-100 transition flex items-center justify-center gap-1.5"
      >
        <Download className="w-3.5 h-3.5" />
        Download PDF
      </button>
    </div>
  </div>
);

const BadgeItem = ({ label, desc, icon, bg, color, locked }) => (
  <div className={`flex flex-col items-center p-5 rounded-2xl border border-slate-100 transition-all ${locked ? 'opacity-40 bg-slate-50 border-slate-200' : 'bg-white shadow-sm hover:-translate-y-1 hover:shadow-md'}`}>
    <div className={`w-12 h-12 ${bg} ${color} rounded-full flex items-center justify-center mb-3 shadow-sm relative`}>
      {icon}
      {locked && (
        <span className="absolute -top-1 -right-1 bg-slate-800 text-white p-0.5 rounded-full text-[8px]">
          🔒
        </span>
      )}
    </div>
    <span className="text-xs font-bold text-slate-900 text-center leading-tight mb-1">{label}</span>
    <span className="text-[10px] text-slate-400 text-center font-medium leading-normal">{locked ? `🔒 ${desc}` : '✓ Unlocked'}</span>
  </div>
);

/* --- FLEXIBLE SVG ICONS --- */
const IconSearch = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconFile = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconAward = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IconCheckCircle = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconStar = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconZap = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconRocket = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>;
const IconMoon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

export default Certifications;