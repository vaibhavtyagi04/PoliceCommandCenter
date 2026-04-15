import React, { useState, useEffect } from "react";
import { FiMapPin, FiInfo, FiAlertCircle, FiShield, FiFilter, FiNavigation } from "react-icons/fi";
import axios from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

export default function UpdatesFeed() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(25);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // Attempt to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Location access denied")
      );
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [location, radius]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      let url = "/api/announcements";
      if (location) {
        url += `?lat=${location.lat}&lng=${location.lng}&radius=${radius}`;
      }
      const res = await axios.get(url);
      setUpdates(res.data.announcements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Alert", "News", "Safety Guide", "Update"];

  const filteredUpdates = filter === "All" 
    ? updates 
    : updates.filter(u => u.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-navy mb-2">Local Police Updates</h1>
            <p className="text-gray-500 font-medium">Staying informed keeps your neighborhood safe.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
              <FiNavigation className="text-gold" />
              <select 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)}
                className="bg-transparent outline-none text-sm font-bold text-navy cursor-pointer"
              >
                <option value={10}>Within 10km</option>
                <option value={25}>Within 25km</option>
                <option value={50}>Within 50km</option>
                <option value={100}>Entire City</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-2xl shadow-md">
              <FiFilter className="text-gold" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent outline-none text-sm font-bold cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c} className="text-navy">{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* FEED */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-200 rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredUpdates.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group hover:translate-y-[-4px] transition-all duration-300"
                >
                  <div className={`h-2 ${getSeverityColor(item.severity)}`} />
                  <div className="p-7">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${getCategoryStyles(item.category)}`}>
                        {item.category}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-navy/60 font-medium text-xs">
                        <FiMapPin className="text-gold" />
                        {item.areaName || "Local Area"}
                      </div>
                      <button className="text-navy font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                        Details <FiInfo />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredUpdates.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-inner border border-dashed border-gray-200">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-navy">No updates found nearby</h3>
            <p className="text-gray-500 mt-1">Try expanding your search radius or checking back later.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function getSeverityColor(s) {
  if (s === "High") return "bg-red-500";
  if (s === "Medium") return "bg-orange-400";
  return "bg-navy";
}

function getCategoryStyles(c) {
  const styles = {
    "Alert": "bg-red-100 text-red-700",
    "News": "bg-blue-100 text-blue-700",
    "Safety Guide": "bg-green-100 text-green-700",
    "Update": "bg-purple-100 text-purple-700"
  };
  return styles[c] || "bg-gray-100 text-gray-700";
}
