import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '16px'
};

const center = [28.6139, 77.2090]; // [lat, lng] for Leaflet

// Custom component to handle the heatmap layer
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    // Leaflet.heat expects [lat, lng, intensity]
    const heatPoints = points.map(p => [p.lat, p.lng, p.intensity]);
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 20,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default function CrimeHeatmap() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch simulated hotspots from AI service
    fetch("http://localhost:5000/hotspots")
      .then(res => res.json())
      .then(data => {
        setPoints(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching hotspots:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-[400px] flex items-center justify-center bg-slate-800 rounded-2xl">Loading GIS Maps...</div>;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
      <MapContainer
        center={center}
        zoom={12}
        style={containerStyle}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {points.length > 0 && <HeatmapLayer points={points} />}
      </MapContainer>
    </div>
  );
}
