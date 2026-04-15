import React, { useState, useEffect, useContext } from "react";
import { FiBell, FiX, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../api/axios";
import { SocketContext } from "../../context/SocketContext";
import { toast } from "react-hot-toast";

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast(notif.title, { icon: "🔔", position: "top-right" });
      };

      socket.on("complaint:updated", handleNewNotification);
      socket.on("announcement:created", handleNewNotification);
      
      return () => {
        socket.off("complaint:updated");
        socket.off("announcement:created");
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications");
      setNotifications(res.data.notifications);
      // In a real app we'd filter unread; here we'll just set a mock count
      setUnreadCount(res.data.notifications.length);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.post("/api/notifications/read-all");
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => { setIsOpen(!isOpen); setUnreadCount(0); }}
        className="relative p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
      >
        <FiBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-gold text-navy text-[10px] font-black rounded-full flex items-center justify-center border-2 border-navy">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right"
            >
              <div className="bg-navy p-6 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg">Notifications</h3>
                <button onClick={() => setIsOpen(false)}><FiX /></button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n, i) => (
                    <div key={i} className="p-5 border-b border-gray-50 hover:bg-slate-50 transition cursor-pointer">
                      <div className="flex gap-4">
                        <div className={`mt-1 p-2 rounded-xl bg-opacity-10 ${getIconColor(n.title)}`}>
                          {getIcon(n.title)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-navy text-sm mb-1">{n.title}</p>
                          <p className="text-gray-500 text-xs leading-relaxed">{n.body}</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tight">
                            {new Date(n.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-gray-400 text-sm">All caught up!</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-slate-50 text-center border-t border-gray-100">
                <button 
                  onClick={markAllRead}
                  className="text-navy font-bold text-xs hover:text-gold transition"
                >
                  Clear All History
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function getIcon(title) {
  if (title.toLowerCase().includes("urgent") || title.toLowerCase().includes("sos")) return <FiAlertTriangle />;
  if (title.toLowerCase().includes("resolved")) return <FiCheckCircle />;
  return <FiInfo />;
}

function getIconColor(title) {
  if (title.toLowerCase().includes("urgent") || title.toLowerCase().includes("sos")) return "bg-red-500 text-red-500";
  if (title.toLowerCase().includes("resolved")) return "bg-green-500 text-green-500";
  return "bg-blue-500 text-blue-500";
}
