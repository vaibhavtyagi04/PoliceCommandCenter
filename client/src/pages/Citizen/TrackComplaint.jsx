import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiClock, FiUser, FiMapPin, FiCheckCircle, FiFileText } from "react-icons/fi";
import axios from "../../api/axios";

export default function TrackComplaint() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await axios.get(`/api/complaints/${id}`);
        setComplaint(res.data.complaint);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold text-navy">Locating Report...</div>;
  if (!complaint) return <div className="p-20 text-center">Complaint not found.</div>;

  const steps = [
    { name: "Submitted", status: "Submitted", icon: "📝", color: "bg-blue-500" },
    { name: "Verified", status: "Verified", icon: "🔍", color: "bg-purple-500" },
    { name: "Assigned", status: "Assigned", icon: "👮", color: "bg-indigo-500" },
    { name: "Investigation", status: "Under Investigation", icon: "🔄", color: "bg-orange-500" },
    { name: "Resolved", status: "Resolved", icon: "✅", color: "bg-green-500" },
    { name: "Closed", status: "Closed", icon: "📁", color: "bg-gray-500" }
  ];

  const currentStatusIndex = steps.findIndex(s => s.status === complaint.status);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/citizen/home" className="flex items-center gap-2 text-navy font-bold mb-6 hover:translate-x-[-4px] transition-transform">
          <FiArrowLeft /> Back to Dashboard
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Complaint ID: {complaint._id.slice(-8).toUpperCase()}</p>
              <h1 className="text-3xl font-extrabold text-navy">{complaint.title}</h1>
            </div>
            <div className={`px-6 py-2 rounded-2xl font-bold text-sm shadow-sm ${getStatusColor(complaint.status)}`}>
              {complaint.status}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-gray-50">
            <InfoItem icon={<FiClock />} label="Reported On" value={new Date(complaint.createdAt).toLocaleDateString()} />
            <InfoItem icon={<FiUser />} label="Assigned Officer" value={complaint.officerName || "Processing..."} />
            <InfoItem icon={<FiMapPin />} label="Assigned Station" value={complaint.assignedToStation || "General Command"} />
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Visual Timeline */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-navy mb-8 flex items-center gap-2">
              <FiFileText className="text-gold" /> Investigation Timeline
            </h3>

            <div className="relative pl-8 border-l-2 border-slate-100 ml-4 space-y-10">
              {complaint.statusHistory && complaint.statusHistory.length > 0 ? (
                complaint.statusHistory.map((history, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="relative"
                  >
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-navy border-4 border-white shadow-md z-10" />
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-navy text-md">{history.status}</p>
                        <span className="text-[10px] text-gray-400 bg-white px-2 py-1 rounded-full">{new Date(history.date).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 italic">"{history.notes}"</p>
                      <p className="text-[10px] mt-2 text-gray-400 font-bold uppercase tracking-wider">— {history.updatedBy}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No history available yet.</p>
              )}
            </div>
          </div>

          {/* Quick Stats / sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-navy text-white rounded-3xl p-6 shadow-xl">
              <h4 className="font-bold text-sm text-gold uppercase mb-4">Case Details</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] opacity-60 font-bold">CATEGORY</p>
                  <p className="text-sm font-semibold">{complaint.category}</p>
                </div>
                <div>
                  <p className="text-[10px] opacity-60 font-bold">PRIORITY</p>
                  <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold mt-1 ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] opacity-60 font-bold">EST. RESOLUTION</p>
                  <p className="text-sm font-semibold">{complaint.estimatedCompletion ? new Date(complaint.estimatedCompletion).toLocaleDateString() : "Calculating..."}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h4 className="font-bold text-sm text-navy mb-4">Evidence Status</h4>
              <div className="flex gap-2">
                {complaint.images && complaint.images.length > 0 ? (
                  complaint.images.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} className="w-12 h-12 rounded-lg object-cover border" alt="Evidence" />
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No media attached.</p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    "Submitted": "bg-blue-100 text-blue-700",
    "Verified": "bg-purple-100 text-purple-700",
    "Assigned": "bg-indigo-100 text-indigo-700",
    "Under Investigation": "bg-orange-100 text-orange-700",
    "Resolved": "bg-green-100 text-green-700",
    "Closed": "bg-gray-100 text-gray-700"
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

function getPriorityColor(p) {
  if (p === "High") return "bg-red-500 text-white";
  if (p === "Medium") return "bg-orange-500 text-white";
  return "bg-blue-500 text-white";
}

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-navy shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
      <p className="text-sm font-bold text-navy">{value}</p>
    </div>
  </div>
);
