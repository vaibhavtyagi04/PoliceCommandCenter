import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiShield, FiAlertCircle, FiActivity, FiMapPin, FiNavigation, FiRss } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "../api/axios";

export default function CitizenHome() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0 });
  const [recentUpdates, setRecentUpdates] = useState([]);

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        const [complaintsRes, updatesRes] = await Promise.all([
          axios.get(`/api/complaints/user/${user?._id}`),
          axios.get("/api/announcements?limit=3")
        ]);
        
        const complaints = complaintsRes.data.complaints;
        setStats({
          total: complaints.length,
          active: complaints.filter(c => c.status !== "Resolved" && c.status !== "Closed").length,
          resolved: complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length
        });
        setRecentUpdates(updatesRes.data.announcements.slice(0, 3));
      } catch (err) {
        console.log("Fetch error", err);
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16">
      
      {/* EXECUTIVE HEADER */}
      <section className="bg-navy pt-20 pb-32 px-6 rounded-b-[60px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Hello, <span className="text-gold capitalize">{user?.name?.split(' ')[0] || "Citizen"}</span>
            </h1>
            <p className="text-white/60 text-lg mt-2 font-medium">Your Digital Safety Dashboard</p>
          </div>
          <div className="flex gap-4">
            <StatsBadge icon={<FiActivity />} label="Active Cases" value={stats.active} />
            <StatsBadge icon={<FiShield />} label="Security Score" value="98%" />
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS GRID */}
      <div className="max-w-6xl w-full mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard 
            link="/file" 
            icon={<FiPlus />} 
            title="Lodge Report" 
            desc="Submit FIR or Crime Report" 
            primary 
          />
          <ActionCard 
            link="/status" 
            icon={<FiSearch />} 
            title="Tracking" 
            desc="Monitor investigation progress" 
          />
          <ActionCard 
            link="/updates" 
            icon={<FiRss />} 
            title="Police Feed" 
            desc="Local neighborhood alerts" 
          />
          <ActionCard 
            link="/emergency" 
            icon={<FiAlertCircle />} 
            title="SOS Alert" 
            desc="Immediate help request" 
            alert 
          />
        </div>

        {/* RECENT ACTIVITY & UPDATES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 pb-20">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                  <FiNavigation className="text-gold" />
                  Live Community Feed
                </h2>
                <Link to="/updates" className="text-xs font-bold text-gray-400 hover:text-navy transition">VIEW ALL</Link>
              </div>

              <div className="space-y-6">
                {recentUpdates.length > 0 ? (
                  recentUpdates.map((update, i) => (
                    <UpdateItem key={i} item={update} />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-4 italic">No recent safety updates in your area.</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gold/10 flex items-center justify-center text-3xl text-gold mb-4 border-2 border-gold/20">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-navy">Verified Identity</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Your profile is linked with official records. Keep your emergency contacts updated for faster response.
              </p>
              <Link to="/profile" className="mt-6 w-full py-3 bg-navy/5 text-navy rounded-xl font-bold text-sm hover:bg-gold hover:text-white transition">
                Manage Profile
              </Link>
            </div>

            <div className="bg-navy rounded-[40px] p-8 shadow-xl text-white overflow-hidden relative group cursor-pointer">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                  <FiShield size={80} />
               </div>
               <h4 className="text-gold font-black text-xs uppercase tracking-widest mb-2">Safety Guide</h4>
               <p className="text-lg font-bold leading-snug">Tips for home security during vacations.</p>
               <div className="mt-4 flex items-center gap-2 text-xs font-medium opacity-60">
                  Read Article →
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const StatsBadge = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
    <div className="text-gold bg-gold/10 p-2 rounded-xl">{icon}</div>
    <div>
      <p className="text-[10px] text-white/50 font-bold uppercase">{label}</p>
      <p className="text-lg font-black text-white">{value}</p>
    </div>
  </div>
);

const ActionCard = ({ link, icon, title, desc, primary, alert }) => (
  <Link 
    to={link}
    className={`p-10 rounded-[40px] shadow-xl transition-all duration-300 transform hover:scale-[1.03] flex flex-col h-full border border-gray-50
      ${primary ? 'bg-white' : alert ? 'bg-red-50' : 'bg-white'}
    `}
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg
      ${primary ? 'bg-navy text-gold' : alert ? 'bg-red-600 text-white' : 'bg-slate-50 text-navy'}
    `}>
      {icon}
    </div>
    <h3 className="text-xl font-black text-navy">{title}</h3>
    <p className="text-gray-400 text-xs mt-2 font-medium leading-relaxed">{desc}</p>
  </Link>
);

const UpdateItem = ({ item }) => (
  <div className="p-6 bg-slate-50 rounded-3xl border border-gray-100 hover:border-gold/30 transition-colors">
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-black uppercase tracking-widest text-navy bg-gold/10 px-2 py-1 rounded-md">{item.category}</span>
      <span className="text-[10px] text-gray-400 font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
    </div>
    <h4 className="font-bold text-navy">{item.title}</h4>
    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
  </div>
);
