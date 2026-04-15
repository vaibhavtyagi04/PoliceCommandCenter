import React, { useState } from "react";
import { FiMapPin, FiClock, FiImage, FiDownload, FiUserCheck, FiUserX } from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ComplaintCard({ complaint, onOpen, onTrack }) {
  const [viewImage, setViewImage] = useState(null);

  const {
    title,
    description,
    category,
    location,
    status,
    images = [],
    createdAt,
    priority = "Medium",
    isAnonymous = false,
    userId
  } = complaint;

  const generateFIR = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(20, 41, 78);
    doc.text("OFFICIAL FIR RECORD", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Government of India - Smart Policing Portal", 105, 30, { align: "center" });
    
    // Content Table
    const tableData = [
      ["FIR ID", complaint._id || complaint.id],
      ["Date", new Date(createdAt).toLocaleString()],
      ["Title", title],
      ["Category", category],
      ["Priority", priority],
      ["Anonymous", isAnonymous ? "Yes" : "No"],
      ["Status", status],
      ["Description", description],
      ["Address/Location", location && location.latitude ? `Lat: ${location.latitude}, Lng: ${location.longitude}` : "N/A"]
    ];

    if (!isAnonymous && userId) {
      tableData.splice(1, 0, ["Reported By", userId.name || userId.phone]);
    }

    doc.autoTable({
      startY: 40,
      head: [["Field", "Information"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [50, 70, 200] }
    });

    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(8);
    doc.text("Note: This is an automatically generated document from the Smart Policing command center.", 14, finalY + 10);
    doc.text("Scan QR from dashboard to verify authenticity.", 14, finalY + 15);
    
    doc.save(`FIR_${complaint._id || "NEW"}.pdf`);
  };

  return (
    <>
      <div className="bg-[#0b1628] border border-[#1d2d42] rounded-xl p-5 shadow-lg hover:bg-[#0f1d33] transition">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
               <h3 className="text-lg font-bold text-white">{title}</h3>
               <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                 priority === 'High' ? 'bg-red-900/50 text-red-300 border border-red-500/30' : 
                 priority === 'Medium' ? 'bg-orange-900/50 text-orange-300 border border-orange-500/30' : 
                 'bg-green-900/50 text-green-300 border border-green-500/30'
               }`}>
                 {priority}
               </span>
            </div>
            <p className="text-gray-400 text-sm capitalize flex items-center gap-2">
              {category}
              {isAnonymous ? (
                <span className="flex items-center gap-1 text-gray-500 text-[10px]">
                  <FiUserX /> Anonymous Report
                </span>
              ) : (
                <span className="flex items-center gap-1 text-blue-400 text-[10px]">
                  <FiUserCheck /> Verified Citizen
                </span>
              )}
            </p>
          </div>

          {/* Status */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === "Pending"
                ? "bg-blue-600/30 text-blue-300"
                : status === "In Progress"
                ? "bg-yellow-600/30 text-yellow-300"
                : "bg-green-600/30 text-green-300"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Location + Time */}
        <div className="flex items-center text-gray-400 text-sm gap-2 mb-4">
          <FiMapPin className="text-blue-300" />
          {location && location.latitude ? `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}` : "GPS data unavailable"}
        </div>

        <div className="flex items-center text-gray-500 text-xs gap-2 mb-4">
          <FiClock />
          {new Date(createdAt).toLocaleString()}
        </div>

        {/* IMAGES SECTION */}
        {images.length > 0 && (
          <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setViewImage(img)}
                className="cursor-pointer group"
              >
                <img
                  src={img}
                  alt="Evidence"
                  className="w-20 h-20 object-cover rounded-lg border border-[#1d2d42] group-hover:opacity-80 transition"
                />
              </div>
            ))}
          </div>
        )}

        {/* No Images */}
        {images.length === 0 && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FiImage /> No evidence uploaded
          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onTrack && onTrack(complaint)}
            className="flex-1 px-4 py-2 rounded-lg bg-[#122434] text-blue-200 border border-[#1d2d42] hover:bg-[#1d2d42] transition font-semibold"
          >
            Track File
          </button>
          <button
            onClick={() => onOpen && onOpen(complaint)}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition font-semibold"
          >
            Update Status
          </button>
          <button
            onClick={generateFIR}
            title="Download Official FIR PDF"
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center"
          >
            <FiDownload />
          </button>
        </div>
      </div>

      {/* IMAGE VIEW MODAL */}
      {viewImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setViewImage(null)}
        >
          <img
            src={viewImage}
            alt="full"
            className="max-w-3xl max-h-[85vh] rounded-xl shadow-2xl border border-gray-600"
          />
        </div>
      )}
    </>
  );
}
