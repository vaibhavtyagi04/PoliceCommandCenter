import React from "react";
import QuickCard from "./QuickCard";

export default function CitizenDashboard({ currentUser, onLogout, onEmergency, onShowSection }) {
  return (
    <div id="citizenDashboard" className="min-h-screen bg-gray-50">
      <nav className="saffron-bg text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold">🇮🇳 Smart Policing Portal</div>
            </div>
            <div className="flex items-center space-x-4">
              <span id="citizenName" className="text-sm">👤 {currentUser || "Citizen Portal"}</span>
              <button onClick={onLogout} className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 mb-8 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl mr-4">👮‍♂</div>
            <div className="text-6xl mr-4">🇮🇳</div>
            <div className="text-6xl">🛡</div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Serving with Honor, Protecting with Technology</h2>
          <p className="text-xl opacity-90">Indian Police - Modernized for Better Service</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickCard emoji="📝" title="File Complaint" subtitle="Lodge a new complaint or FIR" onClick={() => onShowSection("report")} />
          <QuickCard emoji="📋" title="Track Complaint" subtitle="Check status of your complaints" onClick={() => onShowSection("track")} />
          <QuickCard emoji="🚨" title="Emergency Help" subtitle="Immediate police assistance" onClick={onEmergency} />
          <QuickCard emoji="📊" title="View Status" subtitle="Check all updates and notifications" onClick={() => onShowSection("status")} />
        </div>

        <div className="bg-white rounded-xl card-shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📢 Latest Updates from Local Police Station</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl">ℹ</div>
              <div>
                <h4 className="font-semibold text-gray-900">Traffic Advisory</h4>
                <p className="text-gray-600 text-sm">Road closure on MG Road from 2 PM to 6 PM today for VIP movement.</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="text-2xl">✅</div>
              <div>
                <h4 className="font-semibold text-gray-900">Case Update</h4>
                <p className="text-gray-600 text-sm">Your complaint CR1703123456 has been assigned to Inspector Sharma.</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl">⚠</div>
              <div>
                <h4 className="font-semibold text-gray-900">Safety Alert</h4>
                <p className="text-gray-600 text-sm">Increased patrolling in residential areas due to recent incidents.</p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
