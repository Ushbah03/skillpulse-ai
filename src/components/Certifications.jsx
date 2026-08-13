import React from 'react';

const Certifications = () => {
  return (
    <div className="p-8 bg-[#F8F9FE] min-h-screen font-sans text-slate-900">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md border border-indigo-100 mb-2 inline-block">
            Employee Workspace
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Certifications & Achievements</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Track, verify, and export your enterprise credentials</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search certificates..." 
              className="pl-11 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <span className="absolute left-3.5 top-3 text-slate-400">
              <IconSearch className="w-4 h-4" />
            </span>
          </div>

          <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer relative hover:bg-slate-50 transition-colors">
            <IconBell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
            JS
          </div>
        </div>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <HeaderStatCard 
          label="Total Certifications" value="14" 
          icon={<IconFile className="w-6 h-6" />} 
          bgClass="bg-indigo-50" colorClass="text-indigo-600"
          badge="+1 new" badgeColor="bg-emerald-100 text-emerald-700" 
        />
        <HeaderStatCard 
          label="Badges Earned" value="28" 
          icon={<IconAward className="w-6 h-6" />} 
          bgClass="bg-orange-50" colorClass="text-orange-600"
          badge="Top 5%" badgeColor="bg-indigo-100 text-indigo-700" 
        />
        <HeaderStatCard 
          label="Completed Courses" value="42" 
          icon={<IconCheckCircle className="w-6 h-6" />} 
          bgClass="bg-emerald-50" colorClass="text-emerald-600"
          badge="Overall" badgeColor="bg-slate-100 text-slate-600" 
        />
        <HeaderStatCard 
          label="Skill Certifications" value="6" 
          icon={<IconStar className="w-6 h-6" />} 
          bgClass="bg-purple-50" colorClass="text-purple-600"
          badge="Mastery" badgeColor="bg-amber-100 text-amber-700" 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Main Section */}
        <div className="col-span-12 lg:col-span-9 space-y-10">
          
          {/* My Certifications Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">My Certifications</h2>
              <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><IconGrid className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"><IconList className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CertCard title="AWS Certified Solutions Architect" provider="Amazon Web Services" date="Oct 2026" type="aws" skills={["CLOUD", "SECURITY", "ARCHITECTING"]} />
              <CertCard title="Advanced Python Development" provider="SkillPulse Academy" date="Permanent" type="code" skills={["PYTHON", "BACKEND", "AI"]} />
              <CertCard title="Professional Data Analyst" provider="Google Cloud" date="Dec 2025" type="data" skills={["ANALYTICS", "SQL", "BI"]} />
            </div>
          </section>

          {/* Badges Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Badges & Recognition</h2>
              <span className="text-indigo-600 text-sm font-bold cursor-pointer hover:underline">View Gallery</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <BadgeItem label="Fast Learner" icon={<IconZap className="w-6 h-6" />} bg="bg-amber-50" color="text-amber-500" />
              <BadgeItem label="High Flyer" icon={<IconRocket className="w-6 h-6" />} bg="bg-blue-50" color="text-blue-500" />
              <BadgeItem label="Night Owl" icon={<IconMoon className="w-6 h-6" />} bg="bg-slate-100" color="text-slate-400" locked />
              <BadgeItem label="Consistent" icon={<IconTarget className="w-6 h-6" />} bg="bg-rose-50" color="text-rose-500" />
              <BadgeItem label="Top Scorer" icon={<IconMedal className="w-6 h-6" />} bg="bg-emerald-50" color="text-emerald-500" />
              <BadgeItem label="King" icon={<IconCrown className="w-6 h-6" />} bg="bg-slate-100" color="text-slate-400" locked />
            </div>
          </section>

          {/* Certification Journey */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">
             <h2 className="text-xl font-bold mb-8 text-slate-900">Certification Journey</h2>
             <div className="flex items-center justify-between relative min-w-[500px] px-8">
                <div className="absolute top-[20px] left-20 right-20 h-1 bg-slate-100 z-0 rounded-full"></div>
                <TimelineStep label="Onboarding" sub="Foundation" date="Q1 2023" active />
                <TimelineStep label="Associate" sub="Cloud" date="Q2 2023" active />
                <TimelineStep label="Professional" sub="Solutions Arch" date="CURRENT" active highlight />
                <TimelineStep label="Specialty" sub="Security" date="Q4 2023" />
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-3 border border-slate-100">
            <button className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95">
              <IconDownload className="w-4 h-4" /> Export PDF
            </button>
            <SidebarAction label="Add to LinkedIn" icon={<IconLinkedin className="w-4 h-4" />} />
            <SidebarAction label="Share internally" icon={<IconShare className="w-4 h-4" />} />
          </div>

          <div className="bg-[#0F172A] p-7 rounded-3xl text-white relative overflow-hidden shadow-xl">
             <div className="flex items-center gap-2 mb-3">
               <span className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                 94% Match
               </span>
             </div>
             <h4 className="text-lg font-bold mb-2 leading-tight">Deep Learning Certification</h4>
             <p className="text-slate-400 text-xs leading-relaxed mb-6">Elevate your AI skills based on your current learning progress.</p>
             <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition">
               Start Path
             </button>
          </div>
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

const CertCard = ({ title, provider, date, skills, type }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          type === 'aws' ? 'bg-blue-50 text-blue-600' : 
          type === 'code' ? 'bg-emerald-50 text-emerald-600' : 
          'bg-amber-50 text-amber-600'
        }`}>
          {type === 'aws' ? <IconCloud className="w-6 h-6" /> : type === 'code' ? <IconTerminal className="w-6 h-6" /> : <IconDatabase className="w-6 h-6" />}
        </div>
        <div className="text-right">
          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Expiry</span>
          <span className="text-xs font-bold text-slate-700">{date}</span>
        </div>
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
      <button className="grow bg-[#F0F3FF] text-indigo-600 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-100 transition">
        Download
      </button>
      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition">
        <IconExternalLink className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const BadgeItem = ({ label, icon, bg, color, locked }) => (
  <div className={`flex flex-col items-center p-4 rounded-2xl border border-slate-100 transition-all ${locked ? 'opacity-30 bg-slate-50' : 'bg-white shadow-sm hover:-translate-y-1 hover:shadow-md'}`}>
    <div className={`w-12 h-12 ${bg} ${color} rounded-full flex items-center justify-center mb-2 shadow-sm`}>
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-800 text-center leading-tight">{label}</span>
  </div>
);

const TimelineStep = ({ label, sub, date, active, highlight }) => (
  <div className="flex flex-col items-center z-10">
    <div className={`w-10 h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all ${
      highlight ? 'bg-indigo-600 scale-110' : active ? 'bg-indigo-400' : 'bg-slate-200'
    }`}>
      {active && <IconCheck className="w-4 h-4 text-white" />}
    </div>
    <div className="mt-4 text-center">
      <span className="text-[9px] font-black text-slate-400 block uppercase tracking-widest mb-0.5">{date}</span>
      <p className="text-xs font-bold text-slate-900">{label}</p>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
  </div>
);

const SidebarAction = ({ label, icon }) => (
  <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-all group">
    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-700">{label}</span>
  </div>
);

/* --- FLEXIBLE SVG ICONS --- */
const IconSearch = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconBell = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const IconFile = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconAward = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IconCheckCircle = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconStar = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconCloud = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17.5 19a5.5 5.5 0 0 0 0-11h-1.5a7 7 0 1 0-12 5h.5a4 4 0 0 1 0 8h13Z"/></svg>;
const IconTerminal = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
const IconDatabase = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>;
const IconDownload = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m2-5 7 7 7-7m-7 7V3"/></svg>;
const IconZap = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconRocket = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>;
const IconCheck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
const IconLinkedin = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const IconShare = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8m-4-6-4-4-4 4m4-4v13"/></svg>;
const IconExternalLink = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"/></svg>;
const IconGrid = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconList = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconMoon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconTarget = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconMedal = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 3"/></svg>;
const IconCrown = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/></svg>;

export default Certifications;