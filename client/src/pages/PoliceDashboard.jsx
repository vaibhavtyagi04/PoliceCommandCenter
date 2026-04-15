import React, { useEffect, useState, useContext } from "react";
import { FiShield, FiAlertTriangle, FiCheckCircle, FiClock, FiMap, FiActivity, FiTrendingUp, FiSearch, FiRss, FiLayout, FiInbox } from "react-icons/fi";
import axios from "../api/axios";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import CaseManagement from "./CaseManagement";
import FIRRecords from "./FIRRecords";
import DispatcherFeed from "../components/police/DispatcherFeed";
import { toast } from "react-hot-toast";

export default function PoliceDashboard() {
  const [view, setView] = useState("overview"); 
  const [stats, setStats] = useState({ total: 0, newCases: 0, active: 0, resolved: 0, sosActive: 0 });
  const [alerts, setAlerts] = useState([]);
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchInitialStats();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("complaint:created", (c) => {
      setStats(s => ({ ...s, newCases: s.newCases + 1 }));
      addAlert("incident", "New Incident Reported", `${c.category}: ${c.title}`);
      toast("New Incident Filed", { icon: "📝" });
    });

    socket.on("sos:trigger", (data) => {
      setStats(s => ({ ...s, sosActive: s.sosActive + 1 }));
      addAlert("emergency", "🚨 EMERGENCY SOS", `User ${data.userName} triggered SOS!`);
    });

    return () => {
      socket.off("complaint:created");
      socket.off("sos:trigger");
    };
  }, [socket]);

  const fetchInitialStats = async () => {
    try {
      const res = await axios.get("/api/complaints/all");
      const complaints = res.data.complaints || [];
      setStats({
        total: complaints.length,
        newCases: complaints.filter(c => c.status === "Submitted").length,
        active: complaints.filter(c => c.status !== "Resolved" && c.status !== "Closed").length,
        resolved: complaints.filter(c => c.status === "Resolved").length,
        sosActive: 0
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addAlert = (type, title, body) => {
    setAlerts(prev => [{ type, title, body, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 15));
  };

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col pt-16 font-sans">
      
      {/* COMMAND HEADER */}
      <section className="bg-navy-gradient pt-20 pb-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end relative z-10">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
               <div className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black tracking-widest uppercase">
                  Centralized Command
               </div>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-none mb-4">
              Police <span className="text-gold">Commander</span>
            </h1>
            <p className="text-white/40 text-lg font-medium flex items-center gap-3">
               <FiShield className="text-gold" />
               Batch {user?.batchNo || "P-7741"} • Zone 01 Strategic Center
            </p>
          </div>
          
          <div className="flex bg-white/5 backdrop-blur-3xl border border-white/10 p-2 rounded-[32px] gap-2">
             <NavTab active={view === 'overview'} onClick={() => setView('overview')} icon={<FiLayout />} label="Overview" />
             <NavTab active={view === 'cases'} onClick={() => setView('cases')} icon={<FiSearch />} label="Investigations" />
             <NavTab active={view === 'firs'} onClick={() => setView('firs')} icon={<FiInbox />} label="Records" />
          </div>
        </div>
      </section>

      {/* DASHBOARD GRID */}
      <div className="max-w-7xl w-full mx-auto px-6 -mt-24 relative z-20 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* STATS OVERVIEW */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <ModernStat value={stats.newCases} label="Unassigned" color="text-gold" />
               <ModernStat value={stats.active} label="Active" color="text-blue-400" />
               <ModernStat value={stats.resolved} label="Resolved" color="text-success" />
               <ModernStat value={stats.sosActive} label="Live SOS" color="text-emergency" pulse={stats.sosActive > 0} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {view === "overview" && <OverviewGrid setView={setView} />}
                {view === "cases" && <div className="glass-effect rounded-[40px] p-2 overflow-hidden"><CaseManagement /></div>}
                {view === "firs" && <div className="glass-effect rounded-[40px] p-2 overflow-hidden"><FIRRecords /></div>}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DISPATCH SIDEBAR */}
          <div className="lg:col-span-1 min-h-[600px]">
             <DispatcherFeed alerts={alerts} />
          </div>

        </div>

      </div>

    </div>
  );
}

const NavTab = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`px-8 py-4 rounded-[24px] font-black text-xs tracking-widest flex items-center gap-2 transition-luxury
      ${active ? 'bg-gold text-navy shadow-luxury scale-105' : 'text-white/40 hover:text-white hover:bg-white/5'}
    `}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

const ModernStat = ({ value, label, color, pulse }) => (
  <div className="bg-white/5 backdrop-blur-3xl border border-white/5 p-8 rounded-[40px] shadow-luxury transition-luxury hover:bg-white/[0.08] relative overflow-hidden group">
     {pulse && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />}
     <p className={`text-4xl font-display font-black mb-1 ${color}`}>{value}</p>
     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</p>
  </div>
);

const OverviewGrid = ({ setView }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
     <div className="bg-white/5 rounded-[40px] p-10 border border-white/5 hover:border-gold/30 transition-luxury group flex flex-col justify-between h-[400px]">
        <div>
           <FiTrendingUp className="text-gold text-4xl mb-6" />
           <h3 className="text-2xl font-black mb-2">Neighborhood Intelligence</h3>
           <p className="text-white/40 text-sm font-medium leading-relaxed">
             Real-time aggregation of safety data across your assigned station. View clusters and high-risk zones.
           </p>
        </div>
        <div className="h-40 bg-navy rounded-[30px] mt-6 flex items-center justify-center border border-white/5 group-hover:border-gold/20 relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--gold)_0%,_transparent_70%)] group-hover:opacity-40 transition-luxury" />
           <p className="text-[10px] font-black tracking-widest text-white/20">GIS HEATMAP DATA LOADING...</p>
        </div>
     </div>

     <div className="grid grid-cols-1 gap-8">
        <MiniActionCard 
          icon={<FiSearch />} 
          title="Case Investigation" 
          desc="Access legal documentation and assign active officers." 
          onClick={() => setView('cases')}
        />
        <MiniActionCard 
          icon={<FiRss />} 
          title="Citizen Broadcast" 
          desc="Push emergency updates or neighborhood safety news." 
          color="gold"
        />
     </div>
  </div>
);

const MiniActionCard = ({ icon, title, desc, onClick, color }) => (
  <button 
    onClick={onClick}
    className="bg-white/5 rounded-[40px] p-8 border border-white/5 hover:bg-white/[0.08] transition-luxury flex items-center gap-8 text-left group"
  >
     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-luxury 
       ${color === 'gold' ? 'bg-gold text-navy group-hover:shadow-gold-glow' : 'bg-navy-gradient text-gold'}
     `}>
        {icon}
     </div>
     <div>
        <h4 className="font-bold text-lg group-hover:text-gold transition-luxury">{title}</h4>
        <p className="text-white/30 text-xs font-medium leading-relaxed mt-1">{desc}</p>
     </div>
  </button>
);
