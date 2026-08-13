import React from 'react';
import {
  PlayCircle,
  Clock,
  Globe,
  Award,
  CheckCircle2,
  ChevronRight,
  Star,
  Users,
  Share2,
  Heart,
  Lock,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const CourseDetails = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8 font-sans">
      
      {/* Top Header & Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md border border-blue-100">
            Acme Corp Workspace
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Courses</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>UI Design</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-blue-600">Advanced UI Systems</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT CONTENT AREA */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            
            <div className="flex justify-between items-start mb-6">
              <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest shadow-sm">
                Best Seller
              </span>

              <div className="flex gap-2">
                <button 
                  aria-label="Add to favorites"
                  className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all"
                >
                  <Heart className="w-5 h-5" />
                </button>

                <button 
                  aria-label="Share course"
                  className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
              Advanced UI Systems & Tokenization for Enterprise
            </h1>

            <p className="text-slate-500 text-base font-medium leading-relaxed mb-8">
              Master the art of building scalable design systems using Figma
              variables, design tokens, and advanced component architecture.
            </p>

            <div className="flex items-center gap-8 border-t border-slate-100 pt-6">

              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>

                <span className="font-black text-slate-800 text-sm">
                  4.9
                </span>

                <span className="text-slate-400 text-sm font-medium">
                  (1,240 reviews)
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                <Users className="w-4 h-4 text-slate-400" />
                4.5k Students
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">

            <h3 className="text-xl font-bold text-slate-800 mb-6">
              What you'll learn
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ObjectiveCard text="Build multi-mode design systems using Figma variables." />
              <ObjectiveCard text="Automate handoff with Style Dictionary & Tokens Studio." />
              <ObjectiveCard text="Create complex responsive components with Auto Layout 5.0." />
              <ObjectiveCard text="Master advanced prototyping and conditional logic." />
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">

            <div className="flex justify-between items-center mb-6">
              
              <h3 className="text-xl font-bold text-slate-800">
                Course Curriculum
              </h3>

              <span className="text-slate-400 text-xs font-bold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                18 Lessons • 12h 40m total
              </span>
            </div>

            <div className="space-y-3">
              <ModuleItem
                title="Module 1: Design Token Fundamentals"
                lessons="4 Lessons"
                time="45m"
                status="OPEN"
              />

              <ModuleItem
                title="Module 2: Thematic Systems & Dark Mode"
                lessons="6 Lessons"
                time="1h 20m"
                status="LOCKED"
              />

              <ModuleItem
                title="Module 3: Advanced Component Architecture"
                lessons="8 Lessons"
                time="2h 15m"
                status="LOCKED"
              />
            </div>
          </div>

          {/* AI Learning Value Insights */}
          <div className="bg-[#EEF2FF] border border-blue-100 rounded-[2.5rem] p-8 shadow-sm">

            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-400"></div>

              <h3 className="text-2xl font-black text-slate-900">
                AI Learning Value Insights
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Gap Coverage
                </p>

                <h4 className="text-base font-black text-slate-900">
                  Closes 3/5 major gaps
                </h4>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Career Impact
                </p>

                <h4 className="text-base font-black text-emerald-600">
                  High (Lead Eligibility)
                </h4>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Confidence Score
                </p>

                <h4 className="text-base font-black text-slate-900">
                  98.5% Accuracy
                </h4>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Time Value
                </p>

                <h4 className="text-base font-black text-slate-900">
                  Highly Efficient
                </h4>
              </div>

            </div>
          </div>

          {/* Bottom Enrollment Card */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex items-center w-full md:w-auto justify-around md:justify-start">

              <div className="pr-8 md:border-r border-slate-100">
                <p className="text-xs text-slate-400 font-bold mb-1">
                  Course Status
                </p>

                <h4 className="text-base font-black text-slate-900">
                  Open for Enrollment
                </h4>
              </div>

              <div className="pl-8">
                <p className="text-xs text-slate-400 font-bold mb-1">
                  Waitlist
                </p>

                <h4 className="text-base font-black text-slate-900">
                  None
                </h4>
              </div>

            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">

              <button className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all">
                Add to Path
              </button>

              <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-100 hover:bg-blue-700 transition-all">
                Enroll in Course
              </button>

            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="relative">

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 sticky top-8">

            {/* Preview Banner */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl mb-6 overflow-hidden flex items-center justify-center group cursor-pointer">

              <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/10 transition-all"></div>

              <PlayCircle className="w-14 h-14 text-white drop-shadow-2xl relative z-10 transition-transform group-hover:scale-105" />

              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                Preview Course
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-3 mb-6">

              <span className="text-3xl font-black text-slate-900">
                $84.99
              </span>

              <span className="text-slate-400 line-through font-bold text-base">
                $120
              </span>

              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-md border border-emerald-100">
                30% OFF
              </span>
            </div>

            {/* Main CTA */}
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider mb-4 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Enroll Now
            </button>

            {/* Guarantee */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                30-Day Money-Back Guarantee
              </p>
            </div>

            {/* Course Features / Stats */}
            <div className="space-y-4 border-t border-slate-100 pt-6">

              <SideStat
                icon={<Clock className="w-4 h-4" />}
                text="12.5 Total Hours"
              />

              <SideStat
                icon={<Globe className="w-4 h-4" />}
                text="English Subtitles"
              />

              <SideStat
                icon={<Award className="w-4 h-4" />}
                text="Certificate of Completion"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Helper Sub-components --- */

const ObjectiveCard = ({ text }) => (
  <div className="flex items-start gap-3 p-4 bg-slate-50/60 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">

    <div className="mt-0.5 bg-emerald-500 rounded-full p-0.5 shrink-0 shadow-sm">
      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
    </div>

    <p className="text-slate-600 text-sm font-medium leading-snug">
      {text}
    </p>
  </div>
);

const ModuleItem = ({ title, lessons, time, status }) => {
  const isOpen = status === 'OPEN';

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isOpen
          ? 'border-blue-100 bg-blue-50/30'
          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
      }`}
    >
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-4">

          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isOpen
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-slate-300 border border-slate-100'
            }`}
          >
            {isOpen ? (
              <PlayCircle className="w-5 h-5" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </div>

          <div>
            <h4
              className={`font-bold text-sm ${
                isOpen ? 'text-blue-600' : 'text-slate-700'
              }`}
            >
              {title}
            </h4>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {lessons} • {time}
            </p>
          </div>
        </div>

        <ChevronRight
          className={`w-4 h-4 ${
            isOpen ? 'text-blue-500' : 'text-slate-300'
          }`}
        />
      </div>
    </div>
  );
};

const SideStat = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-slate-600 font-bold text-xs">
    <div className="text-blue-600 bg-blue-50 p-2 rounded-xl">
      {icon}
    </div>
    {text}
  </div>
);

export default CourseDetails;