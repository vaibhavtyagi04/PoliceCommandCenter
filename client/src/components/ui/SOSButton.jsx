import React, { useState, useContext, useEffect, useRef } from "react";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import { FiAlertOctagon, FiSquare, FiNavigation } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function SOSButton() {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const watchId = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const startTracking = () => {
    if (!("geolocation" in navigator)) return toast.error("Geolocation not supported");

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const payload = {
          userId: user._id,
          userName: user.name || user.phone,
          location: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          timestamp: new Date().toISOString()
        };
        socket.emit("sos:location_update", payload);
      },
      (err) => console.error("Tracking error", err),
      { enableHighAccuracy: true }
    );
  };

  const triggerSOS = () => {
    if (!user) return toast.error("Please login to use SOS");
    if (!socket) return toast.error("System connection error.");

    const confirmSOS = window.confirm("🚨 ALERT POLICE?\n\nThis will send your live location to the nearest station until you stop it.");
    
    if (confirmSOS) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data = {
            userId: user._id,
            userName: user.name || user.phone,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            timestamp: new Date().toISOString(),
          };

          socket.emit("sos:trigger", data);
          setActive(true);
          setLoading(false);
          startTracking(); // Start live updates
          toast.success("HELP IS ON THE WAY!", { duration: 6000, position: "top-center" });
        },
        (err) => {
          setLoading(false);
          toast.error("Error getting location: " + err.message);
        }
      );
    }
  };

  const stopSOS = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setActive(false);
    toast("SOS de-activated. Stay safe.", { icon: "🛡️" });
  };

  if (!user || user.role === 'police') return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-3">
      {active && (
        <motion_div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-red-600 animate-pulse"
        >
          <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="text-red-700 font-black text-xs uppercase tracking-tighter">Live Tracking Active</span>
        </motion_div>
      )}

      <button
        onClick={active ? stopSOS : triggerSOS}
        disabled={loading}
        className={`group relative flex items-center justify-center w-20 h-20 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95
          ${active ? 'bg-navy' : 'bg-red-600 hover:bg-red-500'}
          ${loading ? 'opacity-50 cursor-wait' : 'opacity-100'}`}
      >
        {/* Pulsing rings */}
        {!active && !loading && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse opacity-50"></div>
          </>
        )}

        <div className="flex flex-col items-center justify-center text-white z-10">
          {active ? <FiSquare className="text-2xl" /> : <FiAlertOctagon className="text-3xl mb-1" />}
          <span className="text-[10px] font-black tracking-widest uppercase">
            {active ? "STOP" : "SOS"}
          </span>
        </div>

        {/* Hover label */}
        <span className="absolute right-full mr-4 px-3 py-1 bg-navy text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
          {active ? "Stop Emergency Alert" : "One-Tap Police Alert"}
        </span>
      </button>
    </div>
  );
}
