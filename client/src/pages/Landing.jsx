import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiShield, FiArrowRight, FiLock, FiStar } from "react-icons/fi";
import useAuth from "../hooks/useAuth";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "police") navigate("/police");
      else navigate("/citizen/home");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center relative overflow-hidden font-sans selection:bg-gold selection:text-navy">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* TOP DECOR */}
      <div className="w-full flex justify-between px-10 pt-10 relative z-20">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-navy font-black shadow-gold-glow">IN</div>
            <span className="text-white font-black tracking-widest text-lg uppercase hidden md:inline">Smart Policing Portal</span>
         </div>
         <div className="flex items-center gap-6 text-white/40 text-[10px] font-black tracking-wider uppercase">
            <span>सत्यमेव जयते</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Ministry of Home Affairs</span>
         </div>
      </div>

      {/* HERO SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <FiStar className="text-gold" />
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Next-Gen Law Enforcement Interface</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tight">
            Protecting with <br />
            <span className="text-gold underline decoration-white/10 underline-offset-8">Intelligence.</span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl mt-8 max-w-2xl mx-auto font-medium leading-relaxed">
            A state-of-the-art digital ecosystem connecting citizens with law enforcement. Secure, transparent, and always vigilant.
          </p>

          <div className="flex flex-col md:flex-row gap-6 mt-16 justify-center">
            
            <LoginCard 
              to="/login"
              title="Citizen Access"
              subtitle="नागरिक लॉगिन"
              desc="File FIRs, track investigations, and access emergency services."
              icon={<FiUsers size={28} />}
              color="bg-gold"
            />

            <LoginCard 
              to="/admin-login"
              title="Police Command"
              subtitle="पुलिस लॉगिन"
              desc="Case management, real-time dispatch, and analytics for agencies."
              icon={<FiShield size={28} />}
              color="bg-blue-600"
              outline
            />

          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="pb-10 pt-20 px-10 w-full flex flex-col md:flex-row justify-between items-center text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase gap-4">
        <span>© 2026 DIGITAL POLICING PROTECTION SYSTEM</span>
        <div className="flex gap-8">
           <a href="#" className="hover:text-gold transition-colors">Privacy</a>
           <a href="#" className="hover:text-gold transition-colors">Security</a>
           <a href="#" className="hover:text-gold transition-colors">Contact</a>
        </div>
      </div>

      {/* ADDITIONAL DECOR */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    </div>
  );
}

const LoginCard = ({ to, title, subtitle, desc, icon, color, outline }) => (
  <Link 
    to={to}
    className={`group relative overflow-hidden transition-all duration-500 transform hover:scale-[1.05] w-full md:w-[320px] text-left p-10 rounded-[40px] border ${outline ? 'border-white/10 bg-white/5' : 'bg-white border-white'}`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transition-transform group-hover:rotate-6 ${color} ${outline ? 'text-white' : 'text-navy'}`}>
      {icon}
    </div>
    
    <span className={`text-[10px] font-black uppercase tracking-widest ${outline ? 'text-gold' : 'text-orange-600'}`}>
      {subtitle}
    </span>
    
    <h3 className={`text-2xl font-black mt-2 flex items-center gap-2 ${outline ? 'text-white' : 'text-navy'}`}>
      {title}
      <FiArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
    </h3>
    
    <p className={`text-sm mt-4 font-medium leading-relaxed ${outline ? 'text-white/40' : 'text-gray-500'}`}>
      {desc}
    </p>

    {outline && (
      <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
        <FiLock size={80} />
      </div>
    )}
  </Link>
);
