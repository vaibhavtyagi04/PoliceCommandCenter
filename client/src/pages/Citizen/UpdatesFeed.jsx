import React, { useState, useEffect } from "react";
import { 
  FiMapPin, FiInfo, FiAlertCircle, FiShield, FiFilter, FiNavigation, 
  FiPhone, FiExternalLink, FiList, FiHome 
} from "react-icons/fi";
import axios from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fix for default marker icon issue in Leaflet with Webpack/CRA
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom blue icon for user location
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to update map view when location changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const emergencyNumbers = [
  { label: "National Emergency", number: "112", icon: <FiAlertCircle className="text-red-500" /> },
  { label: "Police", number: "100", icon: <FiShield className="text-blue-600" /> },
  { label: "Fire", number: "101", icon: <FiAlertCircle className="text-orange-500" /> },
  { label: "Ambulance", number: "102", icon: <FiNavigation className="text-green-500" /> },
  { label: "Women Helpline", number: "1091", icon: <FiPhone className="text-purple-500" /> },
  { label: "Child Helpline", number: "1098", icon: <FiHome className="text-pink-500" /> },
  { label: "Cyber Crime", number: "1930", icon: <FiShield className="text-slate-700" /> },
  { label: "Disaster Management", number: "108", icon: <FiAlertCircle className="text-yellow-600" /> },
];

const safetyGuides = [
  { 
    title: "Cyber Security Tips", 
    emoji: "🛡️", 
    desc: "Protect your digital identity. Never share OTPs or click on suspicious links from unknown numbers." 
  },
  { 
    title: "Emergency First Aid", 
    emoji: "🩹", 
    desc: "Basic steps to handle injuries, bleeding, or unconsciousness before medical help arrives." 
  },
  { 
    title: "Women's Safety", 
    emoji: "🚺", 
    desc: "Download official police apps and keep emergency contacts on speed dial for quick access." 
  },
];

export default function UpdatesFeed() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(25);
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("updates"); // "updates" | "stations" | "resources"
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [stations, setStations] = useState([]);
  const [globalNews, setGlobalNews] = useState([]);
  const [locError, setLocError] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  const DEFAULT_COORDS = [28.7306, 77.7774]; // Hapur, UP [lat, lng]

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation([pos.coords.latitude, pos.coords.longitude]);
          setLocError(false);
        },
        (err) => {
          console.warn("Location access denied. Using default location.");
          setLocation(DEFAULT_COORDS);
          setLocError(true);
        }
      );
    } else {
      setLocation(DEFAULT_COORDS);
    }
    fetchGlobalNews();
  }, []);

  const fetchGlobalNews = async () => {
    try {
      const res = await axios.get("/api/news");
      setGlobalNews(res.data.news);
    } catch (err) {
      console.error("Failed to load global news");
    }
  };

  useEffect(() => {
    if (activeTab === "updates") {
      fetchUpdates();
    } else if (activeTab === "stations") {
      fetchStations();
    }
  }, [location, radius, activeTab]);

  const fetchStations = async () => {
    try {
      if (!location) return;
      setLoading(true);
      const res = await axios.get(`/api/stations/nearby?lat=${location[0]}&lng=${location[1]}&distance=${radius}`);
      setStations(res.data.stations);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load nearby stations.");
    } finally {
      setLoading(false);
    }
  };

  const mapContainerStyle = { width: '100%', height: '500px' };

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      let url = "/api/announcements";
      if (location) {
        url += `?lat=${location[0]}&lng=${location[1]}&radius=${radius}`;
      }
      const res = await axios.get(url);
      setUpdates(res.data.announcements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Alert", "News", "Safety Guide", "Update"];
  const filteredUpdates = filter === "All" ? updates : updates.filter(u => u.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-navy mb-2">Local Police Updates</h1>
            <p className="text-gray-500 font-medium">Staying informed keeps your neighborhood safe.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
              <FiNavigation className="text-gold" />
              <select 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)}
                className="bg-transparent outline-none text-sm font-bold text-navy cursor-pointer"
              >
                <option value={10}>Within 10km</option>
                <option value={25}>Within 25km</option>
                <option value={50}>Within 50km</option>
                <option value={100}>Entire City</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-2xl shadow-md">
              <FiFilter className="text-gold" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent outline-none text-sm font-bold cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c} className="text-navy">{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-3 bg-white/50 p-1.5 rounded-[32px] w-fit border border-gray-100 shadow-sm">
            <button 
              onClick={() => setActiveTab("updates")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "updates" ? "bg-navy text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FiList /> Safety Feed
            </button>
            <button 
              onClick={() => setActiveTab("stations")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "stations" ? "bg-navy text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FiShield /> Nearby Stations
            </button>
            <button 
              onClick={() => setActiveTab("resources")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "resources" ? "bg-navy text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FiPhone /> Emergency Info
            </button>
          </div>

          {activeTab === "stations" && (
            <div className="flex gap-2 bg-white/50 p-1.5 rounded-3xl border border-gray-100 shadow-sm">
              <button onClick={() => setViewMode("list")} className={`px-4 py-2 rounded-xl font-bold text-xs ${viewMode === "list" ? "bg-gold text-navy" : "text-gray-400 hover:bg-gray-100"}`}>List View</button>
              <button onClick={() => setViewMode("map")} className={`px-4 py-2 rounded-xl font-bold text-xs ${viewMode === "map" ? "bg-gold text-navy" : "text-gray-400 hover:bg-gray-100"}`}>Map View</button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        {loading && activeTab !== "resources" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-200 rounded-3xl" />)}
          </div>
        ) : activeTab === "updates" ? (
          <>
            {filteredUpdates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence>
                  {filteredUpdates.map((item) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={item._id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
                      <div className={`h-2 ${getSeverityColor(item.severity)}`} />
                      <div className="p-7">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${getCategoryStyles(item.category)}`}>{item.category}</div>
                          <span className="text-[10px] text-gray-400 font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">{item.description}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                          <div className="flex items-center gap-2 text-navy/60 font-medium text-xs"><FiMapPin className="text-gold" /> {item.areaName || "Local Area"}</div>
                          <button className="text-navy font-bold text-xs flex items-center gap-1">Details <FiInfo /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[40px] shadow-sm border-2 border-dashed border-slate-200">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-xl font-black text-navy uppercase tracking-tighter">No Local Updates</h3>
                <p className="text-gray-400 text-sm mt-1 font-medium">There are no recent police reports in your immediate area.</p>
              </div>
            )}

            {globalNews.length > 0 && (
              <div className="mt-20 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-navy uppercase tracking-tighter flex items-center gap-3">
                    <span className="h-8 w-1.5 bg-gold rounded-full" />
                    Global Safety News
                  </h2>
                  <div className="px-4 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-black tracking-widest uppercase">Live Feed</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {globalNews.slice(0, 3).map((news, idx) => (
                    <a 
                      key={idx} 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 hover:border-gold transition-all group flex flex-col h-full"
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img 
                          src={news.urlToImage || "https://images.unsplash.com/photo-1557597774-9d2739f85a94?w=800"} 
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-7 flex flex-col flex-1">
                        <h4 className="font-bold text-navy text-sm mb-3 line-clamp-2 group-hover:text-gold transition-colors">{news.title}</h4>
                        <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-3 mb-6 flex-1">{news.description}</p>
                        <div className="flex justify-between items-center text-[10px] font-black text-navy uppercase tracking-widest pt-4 border-t border-slate-50">
                          <span className="group-hover:text-gold transition-colors">Read Full Article</span>
                          <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : activeTab === "stations" ? (
          <div className="space-y-8">
            {stations.length > 0 ? (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-navy to-slate-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><FiShield size={120} /></div>
                  <h2 className="text-3xl md:text-5xl font-black mb-4">{stations[0].name}</h2>
                  <p className="text-blue-100/70 font-medium text-lg mb-8 max-w-xl">{stations[0].address}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl"><span className="block text-xs font-bold text-gold/80 mb-1">Distance</span><span className="text-3xl font-black">{stations[0].distance?.toFixed(1)} km</span></div>
                    <a href={`tel:${stations[0].phone}`} className="h-14 w-14 flex items-center justify-center bg-gold text-navy rounded-2xl text-xl shadow-lg shadow-gold/20"><FiPhone /></a>
                  </div>
                </motion.div>

                {viewMode === "list" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {stations.slice(1).map((station) => (
                      <div key={station._id} className="bg-white rounded-3xl p-7 shadow-xl border border-gray-100 group">
                        <div className="flex justify-between items-start mb-6"><div className="p-3 bg-slate-50 rounded-2xl"><FiMapPin className="text-gold text-xl" /></div><span className="text-lg font-black text-navy">{station.distance?.toFixed(1)} km</span></div>
                        <h3 className="text-xl font-bold text-navy mb-2">{station.name}</h3>
                        <p className="text-gray-500 text-xs font-medium mb-8 leading-relaxed">{station.address}</p>
                        <div className="flex gap-2">
                          <a href={`tel:${station.phone}`} className="flex-1 bg-slate-100 text-navy py-3 rounded-xl text-[10px] font-black uppercase text-center hover:bg-gold transition-colors">Call</a>
                          <a href={`https://www.google.com/maps?q=${station.location.coordinates[1]},${station.location.coordinates[0]}`} target="_blank" className="flex-1 border-2 border-slate-100 text-navy py-3 rounded-xl text-[10px] font-black uppercase text-center hover:border-gold transition-colors">Route</a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                    <MapContainer center={location || DEFAULT_COORDS} zoom={12} style={mapContainerStyle}>
                      <ChangeView center={location || DEFAULT_COORDS} zoom={12} />
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {location && <Marker position={location} icon={blueIcon}><Popup>Your Location</Popup></Marker>}
                      {stations.map(station => (
                        <Marker key={station._id} position={[station.location.coordinates[1], station.location.coordinates[0]]}>
                          <Popup>
                            <div className="p-1 max-w-[180px]">
                              <h4 className="font-bold text-navy text-sm">{station.name}</h4>
                              <p className="text-[10px] text-gray-500 my-1">{station.address}</p>
                              <div className="flex gap-2 mt-2">
                                <a href={`tel:${station.phone}`} className="bg-navy text-white px-2 py-1 rounded text-[10px] font-bold">Call</a>
                                <a href={`https://www.google.com/maps?q=${station.location.coordinates[1]},${station.location.coordinates[0]}`} target="_blank" className="bg-gold text-navy px-2 py-1 rounded text-[10px] font-bold">Maps</a>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-40 bg-white rounded-3xl shadow-inner border border-dashed border-gray-200">
                <div className="text-7xl mb-6">🚓</div>
                <h3 className="text-2xl font-black text-navy uppercase tracking-tighter">No Stations Within Reach</h3>
                <p className="text-gray-500 mt-2 font-medium">Try setting a larger search radius in the header filters.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {emergencyNumbers.map((item, idx) => (
                <a key={idx} href={`tel:${item.number}`} className="bg-white p-6 rounded-[32px] shadow-xl border border-gray-100 flex flex-col items-center text-center group hover:bg-navy transition-all duration-500">
                  <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:bg-white/10 group-hover:text-gold transition-colors">{item.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white/50 mb-1">{item.label}</span>
                  <span className="text-2xl font-black text-navy group-hover:text-white">{item.number}</span>
                </a>
              ))}
            </div>
            <div className="pt-10">
              <h2 className="text-2xl font-black text-navy mb-8 uppercase tracking-tighter flex items-center gap-3"><span className="h-8 w-1.5 bg-gold rounded-full" /> Citizen Safety Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {safetyGuides.map((guide, idx) => (
                  <div key={idx} className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 hover:border-gold/30 transition-all group">
                    <div className="text-4xl mb-6">{guide.emoji}</div>
                    <h3 className="text-xl font-bold text-navy mb-3">{guide.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{guide.desc}</p>
                    <button className="text-gold font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Read Guide <FiExternalLink /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {locError && !loading && (
          <div className="mt-8 p-8 bg-gold rounded-[32px] shadow-xl shadow-gold/20 flex items-center gap-6 text-navy border-2 border-white">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-inner">📍</div>
            <div>
              <p className="text-xl font-black uppercase tracking-tighter">Location Access Required</p>
              <p className="text-sm font-bold opacity-80 leading-tight">Using default region (Hapur) as browser GPS is disabled.</p>
            </div>
          </div>
        )}

        {locError && !loading && (
          <div className="mt-8 p-8 bg-gold rounded-[32px] shadow-xl shadow-gold/20 flex items-center gap-6 text-navy border-2 border-white">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-inner">📍</div>
            <div>
              <p className="text-xl font-black uppercase tracking-tighter">Location Access Required</p>
              <p className="text-sm font-bold opacity-80 leading-tight">Using default region (Hapur) as browser GPS is disabled.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getSeverityColor(s) {
  if (s === "High") return "bg-red-500";
  if (s === "Medium") return "bg-orange-400";
  return "bg-navy";
}

function getCategoryStyles(c) {
  const styles = {
    "Alert": "bg-red-100 text-red-700",
    "News": "bg-blue-100 text-blue-700",
    "Safety Guide": "bg-green-100 text-green-700",
    "Update": "bg-purple-100 text-purple-700"
  };
  return styles[c] || "bg-gray-100 text-gray-700";
}
