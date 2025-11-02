import React from "react";
import "./PoliceLogin.css";
export default function PoliceDashboard({ currentUser, onLogout, onShowSection }) {
  return (
    <div id="policeDashboard" className="min-h-screen police-dark">
      <nav className="bg-gray-900 text-white shadow-lg border-b border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold">👮‍♂ Police Command Center</div>
            </div>
            <div className="flex items-center space-x-4">
              <select id="policeRole" className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600">
                <option value="inspector">Inspector</option>
                <option value="sho">SHO</option>
                <option value="admin">Admin</option>
              </select>
              <span id="officerName" className="text-sm">👮 {currentUser || "Officer Portal"}</span>
              <button onClick={onLogout} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-2xl p-8 mb-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDgwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMWUzYThlIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiMzYjgyZjYiIG9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSI3MDAiIGN5PSI1MCIgcj0iMzAiIGZpbGw9IiMzYjgyZjYiIG9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4=')",
              }}
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl mr-4">🛡</div>
              <div className="text-6xl mr-4">🇮🇳</div>
              <div className="text-6xl">⚖</div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Serving with Honor, Protecting with Technology</h2>
            <p className="text-xl opacity-90">Digital Command Center - Indian Police Force</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="police-card p-6 rounded-xl card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">New Cases</p>
                <p className="text-3xl font-bold text-red-400">12</p>
              </div>
              <div className="text-3xl">🚨</div>
            </div>
          </div>
          <div className="police-card p-6 rounded-xl card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Cases</p>
                <p className="text-3xl font-bold text-blue-400">45</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
          <div className="police-card p-6 rounded-xl card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Resolved Today</p>
                <p className="text-3xl font-bold text-green-400">8</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          <div className="police-card p-6 rounded-xl card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Response Time</p>
                <p className="text-3xl font-bold text-yellow-400">18m</p>
              </div>
              <div className="text-3xl">⏱</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="police-card p-6 rounded-xl card-shadow hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-4">⚖</div>
              <h3 className="text-xl font-semibold text-white mb-2">Case Management</h3>
              <p className="text-gray-400">Manage and assign cases</p>
            </div>
          </div>
          <div className="police-card p-6 rounded-xl card-shadow hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-white mb-2">FIR Records</h3>
              <p className="text-gray-400">Access and update FIR database</p>
            </div>
          </div>
          <div className="police-card p-6 rounded-xl card-shadow hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-white mb-2">Analytics & Reports</h3>
              <p className="text-gray-400">Crime statistics and trends</p>
            </div>
          </div>
        </div>

        <div className="police-card rounded-xl card-shadow p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🔔 Priority Alerts & Pending Tasks</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-red-900 bg-opacity-50 rounded-lg border border-red-700">
              <div className="text-2xl">🚨</div>
              <div>
                <h4 className="font-semibold text-red-300">Emergency Alert</h4>
                <p className="text-gray-300 text-sm">High priority case CR1703123459 requires immediate attention.</p>
                <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-700">
              <div className="text-2xl">⏰</div>
              <div>
                <h4 className="font-semibold text-yellow-300">Pending Assignment</h4>
                <p className="text-gray-300 text-sm">5 new cases awaiting officer assignment.</p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-700">
              <div className="text-2xl">📊</div>
              <div>
                <h4 className="font-semibold text-blue-300">Weekly Report Due</h4>
                <p className="text-gray-300 text-sm">Crime statistics report for this week is due tomorrow.</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
