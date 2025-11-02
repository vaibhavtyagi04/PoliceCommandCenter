import React, { useEffect, useState } from "react";
import Landing from "./components/Landing";
import CitizenLogin from "./components/CitizenLogin";
import PoliceLogin from "./components/PoliceLogin";
import CitizenDashboard from "./components/CitizenDashboard";
import PoliceDashboard from "./components/PoliceDashboard";

/*
  App - top-level routes switching (simple state based router)
*/
export default function App() {
  const [view, setView] = useState("landing"); // landing | citizenLogin | policeLogin | citizenDashboard | policeDashboard | report|track|map|status
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [crimeReports, setCrimeReports] = useState([]);

  useEffect(() => {
    // sample data init
    setCrimeReports([
      {
        id: "CR1703123456",
        type: "theft",
        description: "Bicycle stolen from apartment complex",
        date: "2024-01-15",
        time: "14:30",
        location: "123 Main St, Downtown",
        anonymous: false,
        reporter: "John Smith",
        status: "investigating",
        timestamp: "2024-01-15T14:30:00Z",
        assignedOfficer: "Inspector Sharma",
      },
      {
        id: "CR1703123457",
        type: "vandalism",
        description: "Graffiti on public building wall",
        date: "2024-01-14",
        time: "22:15",
        location: "456 Oak Ave, City Center",
        anonymous: true,
        reporter: "Anonymous",
        status: "pending",
        timestamp: "2024-01-14T22:15:00Z",
      },
      {
        id: "CR1703123458",
        type: "fraud",
        description: "Credit card fraud at local store",
        date: "2024-01-13",
        time: "16:45",
        location: "789 Pine St, Shopping District",
        anonymous: false,
        reporter: "Jane Doe",
        status: "resolved",
        timestamp: "2024-01-13T16:45:00Z",
        assignedOfficer: "Inspector Williams",
      },
    ]);
  }, []);

  // lightweight service-worker registration (same approach as before)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const swCode = `
        const CACHE_NAME = 'smart-policing-v1';
        const urlsToCache = ['/'];
        self.addEventListener('install', function(event) {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then(function(cache) {
                return cache.addAll(urlsToCache);
              })
          );
        });
        self.addEventListener('fetch', function(event) {
          event.respondWith(
            caches.match(event.request)
              .then(function(response) {
                if (response) return response;
                return fetch(event.request);
              })
          );
        });
      `;
      try {
        const blob = new Blob([swCode], { type: "application/javascript" });
        const swUrl = URL.createObjectURL(blob);
        navigator.serviceWorker.register(swUrl).catch(() => {});
      } catch (e) {}
    }
  }, []);

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    setView("landing");
  };

  const emergencyHelp = () => {
    alert(
      "🚨 Emergency Services\n\nFor immediate help:\n• Call 100 (Police)\n• Call 108 (Ambulance)\n• Call 101 (Fire)\n\nYour location has been shared with nearest police station."
    );
  };

  // Render based on view
  return (
    <div>
      {view === "landing" && (
        <Landing
          onCitizen={() => setView("citizenLogin")}
          onPolice={() => setView("policeLogin")}
        />
      )}

      {view === "citizenLogin" && (
        <CitizenLogin
          onBack={() => setView("landing")}
          onLogin={(id) => {
            setCurrentUser(id);
            setUserType("citizen");
            setView("citizenDashboard");
          }}
        />
      )}

      {view === "policeLogin" && (
        <PoliceLogin
          onBack={() => setView("landing")}
          onLogin={(id) => {
            setCurrentUser(id);
            setUserType("police");
            setView("policeDashboard");
          }}
        />
      )}

      {view === "citizenDashboard" && (
        <CitizenDashboard
          currentUser={currentUser}
          onLogout={logout}
          onEmergency={emergencyHelp}
          onShowSection={(sec) => setView(sec)}
        />
      )}

      {view === "policeDashboard" && (
        <PoliceDashboard
          currentUser={currentUser}
          onLogout={logout}
          onShowSection={(sec) => setView(sec)}
        />
      )}

      {/* simple placeholders for report/track/map/status */}
      {["report", "track", "map", "status"].includes(view) && (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white p-8 rounded-xl card-shadow text-center">
            <h2 className="text-2xl font-semibold mb-4">Section: {view}</h2>
            <p className="text-gray-600">This is a placeholder. Add the original section content here.</p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setView(userType === "police" ? "policeDashboard" : "citizenDashboard")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
