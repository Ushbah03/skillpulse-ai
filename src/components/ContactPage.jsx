import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

const ContactPage = () => {
  const darkGradient = "bg-[linear-gradient(135deg,#0F172B_0%,#1E293B_50%,#312E81_100%)]";

  // Framer motion variants optimized for smooth structural entrance curves
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Ambient background keyframe extensions for fluid drifting glows */}
      <style>{`
        @keyframes driftGlow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(50px, -30px) scale(1.12); }
        }
        .animate-aurora-drift { animation: driftGlow 14s ease-in-out infinite; }
      `}</style>
      
      {/* SECTION 1: HERO HEADER - Deep Deep Indigo/Blue Gradient */}
      <section className="relative bg-[#0F172B] text-white pt-40 pb-72 px-6 text-center overflow-hidden">
        {/* Glowing Gradient Aura */}
        <div 
          className="absolute inset-0 z-0 opacity-90 transition-opacity duration-1000"
          style={{ 
            background: `radial-gradient(circle at 50% 40%, rgba(79, 70, 229, 0.45) 0%, rgba(15, 23, 42, 1) 75%)` 
          }}
        />
        {/* Floating background lights */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-aurora-drift" />
        
        <div className="relative z-10 container mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl font-bold mb-8 tracking-tight"
          >
            Let's <span className="text-[#94A3B8] drop-shadow-[0_0_30px_rgba(148,163,184,0.15)]">Connect</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed opacity-90 font-light"
          >
            Have questions about SkillPulse-AI? Our team is here to help you transform your workforce skills.
          </motion.p>
        </div>
      </section>

      {/* SECTION 2: CONTACT CARDS - High Spacing & Overlap */}
      <section className="relative z-20 -mt-48 px-6 pb-24">
        {/* The White Background Container with large rounded corners */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-7xl bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_30px_70px_rgba(0,0,0,0.02)] border border-slate-100/50"
        >
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {/* Sales Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(79,70,229,0.06)" }}
              className="bg-[#F8FAFC] rounded-[3rem] p-12 border border-slate-100/80 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <motion.div 
                  whileHover={{ scale: 1.08 }}
                  className="w-16 h-16 bg-indigo-100/50 rounded-2xl flex items-center justify-center mb-10 shadow-sm"
                >
                  <MessageSquare className="text-indigo-600 w-8 h-8" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Sales Inquiries</h3>
                <p className="text-slate-500 mb-10 leading-relaxed text-base font-light">
                  Interested in our enterprise solutions? Speak with our sales experts.
                </p>
              </div>
              <a href="mailto:sales@skillpulse.ai" className="text-indigo-600 font-bold flex items-center gap-2 group transition-all w-fit">
                sales@skillpulse.ai 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </motion.div>

            {/* Support Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(79,70,229,0.06)" }}
              className="bg-[#F8FAFC] rounded-[3rem] p-12 border border-slate-100/80 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <motion.div 
                  whileHover={{ scale: 1.08 }}
                  className="w-16 h-16 bg-indigo-100/50 rounded-2xl flex items-center justify-center mb-10 shadow-sm"
                >
                  <Mail className="text-indigo-600 w-8 h-8" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Customer Support</h3>
                <p className="text-slate-500 mb-10 leading-relaxed text-base font-light">
                  Need help with your account? Our team responds in under 2 hours.
                </p>
              </div>
              <a href="mailto:support@skillpulse.ai" className="text-indigo-600 font-bold flex items-center gap-2 group transition-all w-fit">
                support@skillpulse.ai 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </motion.div>

            {/* Phone Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.02)" }}
              className="bg-[#F8FAFC] rounded-[3rem] p-12 border border-slate-100/80 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <motion.div 
                  whileHover={{ scale: 1.08 }}
                  className="w-16 h-16 bg-indigo-100/50 rounded-2xl flex items-center justify-center mb-10 shadow-sm"
                >
                  <Phone className="text-indigo-600 w-8 h-8" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Phone / Office</h3>
                <div className="space-y-2 mb-10">
                  <p className="text-slate-900 font-bold text-xl tracking-tight">+1 (555) 000-0000</p>
                  <p className="text-slate-400 text-sm font-medium">
                    Mon-Fri: 9:00 AM — 6:00 PM EST
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 3: MAP & INFO */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/3"
          >
            <span className="bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 inline-block shadow-sm">
              Our Headquarters
            </span>
            <h2 className="text-5xl font-bold text-slate-900 mb-10 leading-[1.1] tracking-tight">Visit Our Office</h2>
            
            <div className="space-y-10 mb-12">
              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center shrink-0 border border-slate-50 group-hover:scale-110 group-hover:border-indigo-100 transition-all duration-300">
                  <MapPin className="text-indigo-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-slate-900">Head Office</h4>
                  <p className="text-slate-500 leading-relaxed font-light">
                    123 Intelligence Square, Tech District<br />
                    New York, NY 10001, USA
                  </p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center shrink-0 border border-slate-50 group-hover:scale-110 group-hover:border-indigo-100 transition-all duration-300">
                  <Clock className="text-indigo-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-slate-900">Hours</h4>
                  <p className="text-slate-500 leading-relaxed font-light">
                    Monday – Friday: 9am – 6pm EST<br />
                    Weekend: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Open in Google Maps
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-2/3 w-full"
          >
             <div className="w-full h-[550px] bg-slate-200 rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white relative group">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" 
                  alt="Map Location" 
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-indigo-900/5 pointer-events-none" />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-indigo-500/20 rounded-full animate-ping duration-1000" />
                    <motion.div 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative z-10"
                    >
                      <MapPin className="text-white w-7 h-7" />
                    </motion.div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: FINAL CTA */}
      <section className="py-32 px-6 md:px-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`${darkGradient} rounded-[3rem] py-24 text-center text-white border border-white/10 shadow-3xl relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight relative z-10 leading-tight">
            Ready to Transform <br /> Workforce Skills?
          </h2>
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <motion.button 
              whileHover={{ scale: 1.04, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.98 }}
              className="bg-indigo-600 px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_4px_20px_rgba(79,70,229,0.25)]"
            >
              Start Free Trial
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 border border-white/20 px-12 py-4 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm"
            >
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
  
    </div>
  );
};

export default ContactPage;