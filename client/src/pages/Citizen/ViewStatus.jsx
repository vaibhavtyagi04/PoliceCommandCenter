import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiFilter, FiClock, FiUser, FiArrowRight, FiShield } from "react-icons/fi";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ViewStatus() {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user, statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const url = `/api/complaints/user/${user._id}?status=${statusFilter}&category=${categoryFilter}&search=${search}`;
      const res = await axios.get(url);
      setComplaints(res.data.complaints);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-navy mb-2">My Reports</h1>
            <p className="text-gray-500 font-medium font-serif">Track and manage your submitted complaints.</p>
          </div>
          <Link to="/file" className="bg-navy text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition transform hover:scale-[1.02]">
            + New Complaint
          </Link>
        </div>

        {/* Filter Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-wrap items-center gap-4 mb-10">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-100 rounded-2xl outline-none focus:border-navy transition"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-2xl border border-gray-100">
            <FiFilter className="text-navy opacity-40" />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none font-bold text-sm text-navy cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button type="submit" className="bg-gold text-navy px-8 py-3 rounded-2xl font-black text-sm hover:shadow-md transition active:scale-95">
            FILTER
          </button>
        </form>

        {/* COMPLAINTS LIST */}
        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {complaints.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item._id}
                  className="bg-white rounded-[32px] p-7 shadow-xl border border-gray-50 flex flex-col justify-between group hover:border-gold/30 hover:shadow-2xl transition-all duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-sm ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-navy mb-2 line-clamp-1 group-hover:text-gold transition-colors">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{item.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-xs text-navy/60 font-bold bg-slate-50 p-3 rounded-2xl">
                        <FiUser className="text-gold" />
                        {item.officerName || "Reviewing Details..."}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-navy/60 font-bold bg-slate-50 p-3 rounded-2xl">
                        <FiClock className="text-gold" />
                        Exp: {item.estimatedCompletion ? new Date(item.estimatedCompletion).toLocaleDateString() : "Pending Scan"}
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/track/${item._id}`}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-navy text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-navy/10"
                  >
                    View Status History <FiArrowRight />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[40px] shadow-sm border border-dashed border-gray-200">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-extrabold text-navy">No complaints matching filters</h3>
            <p className="text-gray-500 mt-2">Adjust your search or start a new report.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function getStatusStyles(status) {
  const styles = {
    "Submitted": "bg-blue-50 text-blue-600",
    "Verified": "bg-purple-50 text-purple-600",
    "Assigned": "bg-indigo-50 text-indigo-600",
    "Under Investigation": "bg-orange-50 text-orange-600",
    "Resolved": "bg-green-50 text-green-600",
    "Closed": "bg-gray-100 text-gray-500"
  };
  return styles[status] || "bg-gray-50 text-gray-400";
}
