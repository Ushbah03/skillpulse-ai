import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#0E1626] font-sans text-white overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative">
      {/* Ambient Glass Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#1988A3]/12 blur-[170px] rounded-full" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#1B3154]/25 blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 right-10 w-[650px] h-[650px] bg-[#17233E]/35 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(138,156,183,0.12)_1px,transparent_1px)] [background-size:36px_36px] opacity-40" />
      </div>

      {/* SECTION 1: HERO HEADER */}
      <section className="relative pt-20 pb-20 px-6 text-center overflow-hidden z-10">
        <div className="relative z-10 container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#1988A3]/15 border border-[#1988A3]/30 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <span className="text-[#11C6DE] text-xs font-bold uppercase tracking-widest font-mono">
              GET IN TOUCH
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight text-white">
            Let's <span className="text-[#11C6DE]">Connect</span>
          </h1>
          <p className="text-[#8A9CB7] text-base md:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            Have questions about SkillPulse AI? Our engineering and solutions team is ready to assist your organization.
          </p>
        </div>
      </section>

      {/* SECTION 2: CONTACT CARDS */}
      <section className="relative z-10 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Sales Card */}
            <div className="glass-container rounded-3xl p-8 sm:p-10 hover:border-[#1988A3]/50 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-14 h-14 bg-[#1988A3]/15 text-[#11C6DE] border border-[#1988A3]/30 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">Sales Inquiries</h3>
                <p className="text-[#8A9CB7] mb-8 leading-relaxed text-sm font-normal">
                  Interested in our multi-tenant enterprise solution? Speak with our workforce intelligence experts.
                </p>
              </div>
              <a href="mailto:sales@skillpulse.ai" className="text-[#1988A3] hover:text-[#11C6DE] font-bold flex items-center gap-2 group transition-all w-fit text-sm">
                sales@skillpulse.ai 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </div>

            {/* Support Card */}
            <div className="glass-container rounded-3xl p-8 sm:p-10 hover:border-[#1988A3]/50 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-14 h-14 bg-[#1988A3]/15 text-[#11C6DE] border border-[#1988A3]/30 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">Customer Support</h3>
                <p className="text-[#8A9CB7] mb-8 leading-relaxed text-sm font-normal">
                  Need help configuring tenant roles or LMS connectors? Our team responds within standard SLA windows.
                </p>
              </div>
              <a href="mailto:support@skillpulse.ai" className="text-[#1988A3] hover:text-[#11C6DE] font-bold flex items-center gap-2 group transition-all w-fit text-sm">
                support@skillpulse.ai 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </div>

            {/* Phone Card */}
            <div className="glass-container rounded-3xl p-8 sm:p-10 hover:border-[#1988A3]/50 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-14 h-14 bg-[#1988A3]/15 text-[#11C6DE] border border-[#1988A3]/30 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <Phone className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">Direct Hotline</h3>
                <div className="space-y-1.5 mb-8">
                  <p className="text-white font-extrabold text-xl tracking-tight">+1 (555) 000-0000</p>
                  <p className="text-[#8A9CB7] text-xs font-normal">
                    Mon-Fri: 9:00 AM - 6:00 PM EST
                  </p>
                </div>
              </div>
              <span className="text-[#8A9CB7] font-mono text-xs uppercase font-bold tracking-wider">
                Enterprise Support Ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MAP & INFO */}
      <section className="py-16 px-6 relative z-10">
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-16 text-left">
          <div className="lg:w-1/3">
            <span className="bg-[#1988A3]/15 text-[#11C6DE] border border-[#1988A3]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
              Our Headquarters
            </span>
            <h2 className="text-4xl font-extrabold text-white mb-8 leading-tight tracking-tight">Visit Our Office</h2>
            
            <div className="space-y-8 mb-10">
              <div className="flex gap-4 group">
                <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="text-[#11C6DE] w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base mb-1 text-white">Head Office</h4>
                  <p className="text-[#8A9CB7] leading-relaxed text-xs font-normal">
                    123 Intelligence Square, Tech District<br />
                    New York, NY 10001, USA
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock className="text-[#11C6DE] w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base mb-1 text-white">Business Hours</h4>
                  <p className="text-[#8A9CB7] leading-relaxed text-xs font-normal">
                    Monday - Friday: 9am - 6pm EST<br />
                    Weekend: Support On-Call
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 w-full">
             <div className="w-full h-[420px] bg-white/5 rounded-[3rem] overflow-hidden glass-container relative group">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" 
                  alt="Map Location" 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-[#0E1626] rounded-full flex items-center justify-center shadow-2xl border-2 border-[#1988A3] relative z-10 text-[#11C6DE]">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FINAL CTA */}
      <section className="py-16 px-6 md:px-20 mb-8 relative z-10">
        <div className="max-w-5xl mx-auto rounded-[3rem] py-16 text-center glass-container relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-white leading-tight">
            Ready to Transform <br /> Workforce Skills?
          </h2>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/signup" className="bg-[#1988A3] hover:bg-[#157289] text-white px-8 py-3.5 rounded-full font-bold text-sm transition shadow-xl shadow-[#1988A3]/30">
              Start Free Trial
            </Link>
            <Link to="/features" className="bg-white/5 border border-white/15 text-[#E9EAF7] hover:bg-white/10 px-8 py-3.5 rounded-full font-bold text-sm transition backdrop-blur-md">
              Explore Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
