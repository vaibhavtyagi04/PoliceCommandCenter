import React from "react";
import "./Landing.css";
export default function Landing({ onCitizen, onPolice }) {
  return (
    <div id="landing" className="min-h-screen tricolor-bg relative overflow-hidden">
      <div className="ashoka-chakra" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="text-6xl mr-4">🇮🇳</div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">Smart Policing Portal</h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">भारत - India</h2>
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connecting Citizens with Police Services – Secure, Transparent & Digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div
              className="bg-white rounded-2xl card-shadow p-8 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={onCitizen}
            >
              <div className="text-center">
                <div className="text-6xl mb-6">👥</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Citizen Login</h3>
                <p className="text-gray-600 mb-6">File complaints, track FIR status, and access police services</p>
                <div className="flex justify-center space-x-4 text-3xl mb-4">
                  <span title="Lodge Complaint">📝</span>
                  <span title="Track FIR">📋</span>
                  <span title="Emergency Help">🚨</span>
                  <span title="View Updates">📊</span>
                </div>
                <button className="w-full saffron-bg text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  नागरिक लॉगिन / Citizen Login
                </button>
              </div>
            </div>

            <div
              className="bg-white rounded-2xl card-shadow p-8 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={onPolice}
            >
              <div className="text-center">
                <div className="text-6xl mb-6">👮‍♂</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Police Login</h3>
                <p className="text-gray-600 mb-6">Case management, FIR records, and administrative tools</p>
                <div className="flex justify-center space-x-4 text-3xl mb-4">
                  <span title="Case Management">⚖</span>
                  <span title="FIR Records">📁</span>
                  <span title="Analytics">📈</span>
                  <span title="Reports">📊</span>
                </div>
                <button className="w-full navy-bg text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  पुलिस लॉगिन / Police Login
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              <span className="font-semibold">सत्यमेव जयते</span> • Truth Alone Triumphs
            </p>
            <p className="text-sm text-gray-500 mt-2">Government of India • Ministry of Home Affairs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
