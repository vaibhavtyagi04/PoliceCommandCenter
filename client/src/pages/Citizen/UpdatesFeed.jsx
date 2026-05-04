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

export default function UpdatesFeed() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(25);
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("updates"); // "updates" | "stations"
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [stations, setStations] = useState([]);
  const [locError, setLocError] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  const DEFAULT_COORDS = [28.7306, 77.7774]; // Hapur, UP [lat, lng]

  useEffect(() => {
    // Attempt to get user location
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
  }, []);

  useEffect(() => {
    if (activeTab === "updates") {
      fetchUpdates();
    } else {
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
      toast.error("Failed to load nearby stations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

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

  const filteredUpdates = filter === "All" 
    ? updates 
    : updates.filter(u => u.category === filter);

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

        {/* Tab Switcher & View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-4 bg-white/50 p-1.5 rounded-3xl w-fit border border-gray-100 shadow-sm">
            <button 
              onClick={() => setActiveTab("updates")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "updates" 
                  ? "bg-navy text-white shadow-lg shadow-navy/20" 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiList /> Safety Feed
            </button>
            <button 
              onClick={() => setActiveTab("stations")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "stations" 
                  ? "bg-navy text-white shadow-lg shadow-navy/20" 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiShield /> Nearby Stations
            </button>
          </div>

          {activeTab === "stations" && (
            <div className="flex gap-2 bg-white/50 p-1.5 rounded-3xl border border-gray-100 shadow-sm">
              <button 
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  viewMode === "list" ? "bg-gold text-navy" : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                List View
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  viewMode === "map" ? "bg-gold text-navy" : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                Map View
              </button>
            </div>
          )}
        </div>

        {/* FEED */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-200 rounded-3xl" />)}
          </div>
        ) : activeTab === "updates" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredUpdates.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group hover:translate-y-[-4px] transition-all duration-300"
                >
                  <div className={`h-2 ${getSeverityColor(item.severity)}`} />
                  <div className="p-7">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${getCategoryStyles(item.category)}`}>
                        {item.category}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-navy/60 font-medium text-xs">
                        <FiMapPin className="text-gold" />
                        {item.areaName || "Local Area"}
                      </div>
                      <button className="text-navy font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                        Details <FiInfo />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* NEARBY STATIONS VIEW */
          <div className="space-y-8">
            {/* NEAREST HIGHLIGHT */}
            {stations.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-navy to-slate-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/10"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <FiShield size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-gold font-black text-xs uppercase tracking-widest mb-4 bounce-x">
                    <FiShield /> Recommended Nearest Station
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black mb-4">{stations[0].name}</h2>
                  <p className="text-blue-100/70 font-medium text-lg mb-8 max-w-xl">{stations[0].address}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/5">
                      <span className="block text-xs font-bold text-gold/80 uppercase tracking-tighter mb-1">Distance</span>
                      <span className="text-3xl font-black">{stations[0].distance?.toFixed(1)} km</span>
                    </div>
                    <div className="flex gap-3">
                      <a href={`tel:${stations[0].phone}`} className="h-14 w-14 flex items-center justify-center bg-gold text-navy rounded-2xl text-xl hover:scale-110 transition-transform shadow-lg shadow-gold/20">
                        <FiPhone />
                      </a>
                      <a 
                        href={`https://www.google.com/maps?q=${stations[0].location.coordinates[1]},${stations[0].location.coordinates[0]}`}
                        target="_blank"
                        className="h-14 px-8 flex items-center justify-center bg-white text-navy rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gold transition-colors"
                      >
                        Navigate
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === "list" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence>
                  {stations.slice(1).map((station, i) => (
                    <motion.div 
                      key={station._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-3xl p-7 shadow-xl border border-gray-100 group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-slate-50 rounded-2xl">
                          <FiMapPin className="text-gold text-xl" />
                        </div>
                        <span className="text-lg font-black text-navy">{station.distance?.toFixed(1)} km</span>
                      </div>
                      <h3 className="text-xl font-bold text-navy mb-2">{station.name}</h3>
                      <p className="text-gray-500 text-xs font-medium mb-8 leading-relaxed">{station.address}</p>
                      
                      <div className="flex gap-2">
                        <a href={`tel:${station.phone}`} className="flex-1 bg-slate-100 text-navy py-3 rounded-xl text-[10px] font-black uppercase text-center hover:bg-gold transition-colors">Call</a>
                        <a href={`https://www.google.com/maps?q=${station.location.coordinates[1]},${station.location.coordinates[0]}`} target="_blank" className="flex-1 border-2 border-slate-100 text-navy py-3 rounded-xl text-[10px] font-black uppercase text-center hover:border-gold transition-colors">Route</a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* LEAFLET MAP VIEW */
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white"
              >
                <MapContainer
                  center={location || DEFAULT_COORDS}
                  zoom={12}
                  style={mapContainerStyle}
                >
                  <ChangeView center={location || DEFAULT_COORDS} zoom={12} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {location && (
                    <Marker position={location} icon={blueIcon}>
                      <Popup>Your Location</Popup>
                    </Marker>
                  )}
                  {stations.map(station => (
                    <Marker 
                      key={station._id}
                      position={[station.location.coordinates[1], station.location.coordinates[0]]}
                    >
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
              </motion.div>
            )}
          </div>
        )}

        {!loading && (activeTab === "updates" ? filteredUpdates.length === 0 : stations.length === 0) && (
          <div className="text-center py-40 bg-white rounded-3xl shadow-inner border border-dashed border-gray-200">
            <div className="text-7xl mb-6">{activeTab === "updates" ? "📍" : "🚓"}</div>
            <h3 className="text-2xl font-black text-navy uppercase tracking-tighter">
              {activeTab === "updates" ? "No Crime Updates Nearby" : "No Stations Within Reach"}
            </h3>
            <p className="text-gray-500 mt-2 font-medium">Try setting a larger search radius in the header filters.</p>
          </div>
        )}

        {locError && !loading && (
          <div className="mt-8 p-8 bg-gold rounded-[32px] shadow-xl shadow-gold/20 flex items-center gap-6 text-navy border-2 border-white">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-inner">
              📍
            </div>
            <div>
              <p className="text-xl font-black uppercase tracking-tighter">Location Access Required</p>
              <p className="text-sm font-bold opacity-80 leading-tight">Using default region (Hapur) as browser GPS is disabled. Content may not be accurate to your exact position.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const mapStyles = [
  { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#12192b" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] },
  { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] }
];

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
