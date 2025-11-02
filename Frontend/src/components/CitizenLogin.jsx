import React, { useState } from "react";
import "./CitizenLogin.css";
export default function CitizenLogin({ onBack, onLogin }) {
  const [citizenId, setCitizenId] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    if ((citizenId || "").trim().length < 10) {
      alert("Please enter a valid mobile number or Aadhaar ID");
      return;
    }
    onLogin(citizenId.trim());
  }

  return (
    <div id="citizenLogin" className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative">
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjBmOWZmIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiNkZGY0ZmYiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iNDUwIiByPSI2MCIgZmlsbD0iI2RkZjRmZiIvPgo8L3N2Zz4=')" }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <button onClick={onBack} className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <span className="mr-2">←</span> Back to Home
          </button>

          <div className="bg-white rounded-2xl card-shadow p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Citizen Login</h2>
              <p className="text-gray-600">Connecting Citizens with Police Services – Secure & Transparent</p>
            </div>

            <form id="citizenLoginForm" className="space-y-6" onSubmit={submit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number / Aadhaar ID</label>
                <input
                  type="text"
                  id="citizenId"
                  required
                  value={citizenId}
                  onChange={(e) => setCitizenId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter mobile number or Aadhaar ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password / OTP</label>
                <input
                  type="password"
                  id="citizenPassword"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password or OTP"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700">Send OTP</button>
              </div>

              <button type="submit" className="w-full saffron-bg text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Login / लॉगिन करें
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">Available Services</p>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-1">📝</div>
                  <p className="text-xs text-gray-600">Lodge Complaint</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-1">📋</div>
                  <p className="text-xs text-gray-600">Track FIR</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl mb-1">🚨</div>
                  <p className="text-xs text-gray-600">Emergency Help</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl mb-1">📊</div>
                  <p className="text-xs text-gray-600">View Updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
