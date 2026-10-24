import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

const ContactPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#E9EAF7] font-sans text-[#17233E] overflow-x-hidden selection:bg-[#1988A3] selection:text-white relative">
      {/* SECTION 1: HERO HEADER */}
      <section 
        className="relative text-white pt-24 pb-48 px-6 text-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #17233E 0%, #1B3154 50%, #1988A3 100%)`
        }}
      >
        <div className="relative z-10 container mx-auto max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight"
          >
            Let's <span className="text-[#11C6DE]">Connect</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#E9EAF7]/85 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light"
          >
            Have questions about SkillPulse AI? Our engineering and solutions team is ready to assist your organization.
          </motion.p>
        </div>
      </section>

      {/* SECTION 2: CONTACT CARDS OVERLAP */}
      <section className="relative z-20 -mt-32 px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-7xl bg-white/85 backdrop-blur-2xl rounded-[3rem] p-8 sm:p-14 md:p-16 shadow-[0_20px_60px_rgba(23,35,62,0.08)] border border-white"
        >
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            {/* Sales Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-[#E9EAF7]/60 rounded-3xl p-8 sm:p-10 border border-[#8A9CB7]/30 hover:border-[#1988A3]/50 hover:bg-white transition-all duration-300 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-14 h-14 bg-[#1988A3]/10 text-[#1988A3] rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#17233E] mb-3 tracking-tight">Sales Inquiries</h3>
                <p className="text-[#5A6D89] mb-8 leading-relaxed text-sm font-normal">
                  Interested in our multi-tenant enterprise solution? Speak with our workforce intelligence experts.
                </p>
              </div>
              <a href="mailto:sales@skillpulse.ai" className="text-[#1988A3] font-bold flex items-center gap-2 group transition-all w-fit text-sm">
                sales@skillpulse.ai 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </motion.div>

            {/* Support Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-[#E9EAF7]/60 rounded-3xl p-8 sm:p-10 border border-[#8A9CB7]/30 hover:border-[#1988A3]/50 hover:bg-white transition-all duration-300 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-14 h-14 bg-[#1988A3]/10 text-[#1988A3] rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#17233E] mb-3 tracking-tight">Customer Support</h3>
                <p className="text-[#5A6D89] mb-8 leading-relaxed text-sm font-normal">
                  Need help configuring tenant roles or LMS connectors? Our team responds within standard SLA windows.
                </p>
              </div>
              <a href="mailto:support@skillpulse.ai" className="text-[#1988A3] font-bold flex items-center gap-2 group transition-all w-fit text-sm">
                support@skillpulse.ai 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </motion.div>

            {/* Phone Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-[#E9EAF7]/60 rounded-3xl p-8 sm:p-10 border border-[#8A9CB7]/30 hover:border-[#1988A3]/50 hover:bg-white transition-all duration-300 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-14 h-14 bg-[#17233E]/10 text-[#17233E] rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <Phone className="w-7 h-7 text-[#1988A3]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#17233E] mb-3 tracking-tight">Direct Hotline</h3>
                <div className="space-y-1.5 mb-8">
                  <p className="text-[#17233E] font-extrabold text-xl tracking-tight">+1 (555) 000-0000</p>
                  <p className="text-[#5A6D89] text-xs font-medium">
                    Mon-Fri: 9:00 AM - 6:00 PM EST
                  </p>
                </div>
              </div>
              <span className="text-[#5A6D89] font-mono text-xs uppercase font-bold tracking-wider">
                Enterprise Support Ready
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 3: MAP & INFO */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-16 text-left">
          <div className="lg:w-1/3">
            <span className="bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/25 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
              Our Headquarters
            </span>
            <h2 className="text-4xl font-extrabold text-[#17233E] mb-8 leading-tight tracking-tight">Visit Our Office</h2>
            
            <div className="space-y-8 mb-10">
              <div className="flex gap-4 group">
                <div className="w-11 h-11 bg-white shadow-md rounded-2xl flex items-center justify-center shrink-0 border border-[#8A9CB7]/30">
                  <MapPin className="text-[#1988A3] w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base mb-1 text-[#17233E]">Head Office</h4>
                  <p className="text-[#5A6D89] leading-relaxed text-xs font-normal">
                    123 Intelligence Square, Tech District<br />
                    New York, NY 10001, USA
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-11 h-11 bg-white shadow-md rounded-2xl flex items-center justify-center shrink-0 border border-[#8A9CB7]/30">
                  <Clock className="text-[#1988A3] w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base mb-1 text-[#17233E]">Business Hours</h4>
                  <p className="text-[#5A6D89] leading-relaxed text-xs font-normal">
                    Monday - Friday: 9am - 6pm EST<br />
                    Weekend: Support On-Call
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 w-full">
             <div className="w-full h-[450px] bg-white rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" 
                  alt="Map Location" 
                  className="w-full h-full object-cover grayscale opacity-75 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-[#17233E] rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative z-10 text-[#1988A3]">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FINAL CTA */}
      <section className="py-16 px-6 md:px-20 mb-8">
        <div 
          className="max-w-5xl mx-auto rounded-[3rem] py-16 text-center text-white border border-white/20 shadow-2xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #17233E 0%, #1B3154 50%, #1988A3 100%)`
          }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight relative z-10 leading-tight">
            Ready to Transform <br /> Workforce Skills?
          </h2>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/signup" className="bg-white text-[#17233E] px-8 py-3.5 rounded-full font-extrabold text-sm hover:bg-[#E9EAF7] transition shadow-xl">
              Start Free Trial
            </Link>
            <Link to="/features" className="bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white/20 transition">
              Explore Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
