import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '16px'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

export default function CrimeHeatmap() {
  const [points, setPoints] = useState([]);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_API_KEY_HERE", // User needs to provide this
    libraries: ['visualization']
  });

  useEffect(() => {
    // Fetch simulated hotspots from AI service
    fetch("http://localhost:5000/hotspots")
      .then(res => res.json())
      .then(data => {
        if (window.google) {
           const mapPoints = data.map(p => ({
             location: new window.google.maps.LatLng(p.lat, p.lng),
             weight: p.intensity * 10
           }));
           setPoints(mapPoints);
        }
      })
      .catch(err => console.error("Error fetching hotspots:", err));
  }, [isLoaded]);

  if (!isLoaded) return <div className="h-[400px] flex items-center justify-center bg-slate-800 rounded-2xl">Loading GIS Maps...</div>;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={{
          styles: darkMapStyles
        }}
      >
        {points.length > 0 && (
          <HeatmapLayer
            data={points}
            options={{
              radius: 20,
              opacity: 0.6
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];
