import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiActivity, FiNavigation, FiClock } from "react-icons/fi";

const DispatcherFeed = ({ alerts }) => {
  return (
    <div className="bg-slate-800/80 rounded-[40px] p-8 border border-white/5 h-full flex flex-col shadow-luxury">
      <h3 className="text-xl font-display font-black mb-8 flex items-center justify-between text-white">
        Live Dispatch
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </h3>

      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        <AnimatePresence initial={false}>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className={`p-5 rounded-3xl border transition-luxury group hover:scale-[1.02] cursor-pointer
                  ${alert.type === 'emergency' 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-xl text-lg 
                    ${alert.type === 'emergency' ? 'text-red-400 bg-red-400/10' : 'text-gold bg-gold/10'}
                  `}>
                    {alert.type === 'emergency' ? <FiAlertCircle /> : <FiActivity />}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{alert.time}</p>
                    <p className="text-[9px] font-bold text-gold/60">{alert.type?.toUpperCase()}</p>
                  </div>
                </div>
                
                <h4 className={`font-black text-sm mb-1 ${alert.type === 'emergency' ? 'text-red-100' : 'text-white'}`}>
                  {alert.title}
                </h4>
                <p className="text-xs text-white/40 leading-relaxed line-clamp-2 uppercase font-medium tracking-tight">
                  {alert.body}
                </p>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-luxury">
                   <div className="flex items-center gap-2 text-[10px] font-black text-gold">
                      <FiNavigation size={12} /> TRACKING
                   </div>
                   <div className="text-white/20">
                      <FiClock size={12} />
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/10 mb-4">
                <FiActivity size={32} />
              </div>
              <p className="text-white/20 font-black text-xs uppercase tracking-[0.2em]">Monitoring Airwaves</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <button className="w-full py-4 bg-navy-gradient text-white rounded-2xl font-black text-[10px] tracking-[0.2em] border border-white/10 hover:bg-gold hover:text-navy transition-luxury shadow-lg">
           CLEAR ARCHIVE
        </button>
      </div>
    </div>
  );
};

export default DispatcherFeed;
