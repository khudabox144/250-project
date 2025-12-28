"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map view updates
function MapUpdater({ center, zoom, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.flyTo(center, zoom || map.getZoom());
    }
  }, [center, zoom, bounds, map]);
  return null;
}

const MapComponent = ({ center = [23.8103, 90.4125], zoom = 7, markers = [] }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  const destination = markers.length > 0 ? markers[0].position : null;

  const handleGetDirections = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);

        if (destination) {
          try {
            const destLat = destination[0];
            const destLng = destination[1];
            
            // Call backend API
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:5000/api'}/map/route?startLat=${latitude}&startLng=${longitude}&destLat=${destLat}&destLng=${destLng}`
            );
            
            const data = await response.json();

            if (data.status === 'success' && data.data.polyline) {
              const decodedPolyline = decodePolyline(data.data.polyline);
              setRoute({
                positions: decodedPolyline,
                distance: (data.data.distance / 1000).toFixed(1), // km
                duration: Math.round(data.data.duration / 60) // minutes
              });
              
              // Set bounds to include both points
              const bounds = L.latLngBounds([latitude, longitude], [destLat, destLng]);
              setMapBounds(bounds);
            } else {
               setError("Could not find a route");
            }

          } catch (err) {
            console.error("Route fetch error:", err);
            setError("Failed to fetch route");
          }
        }
        setLoading(false);
      },
      (err) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  // Simple OSRM polyline decoder 
  // OSRM with geometries=geojson returns { type: 'LineString', coordinates: [[lng, lat], ...] }
  // Leaflet Polyline expects [lat, lng].
  const decodePolyline = (geometry) => {
      if (geometry && geometry.coordinates) {
          return geometry.coordinates.map(coord => [coord[1], coord[0]]); // Swap lng,lat to lat,lng
      }
      return [];
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater center={center} zoom={zoom} bounds={mapBounds} />

        {/* Destination Markers */}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={icon}>
            <Popup className="font-sans">
              <div className="text-center">
                  <h3 className="font-bold text-gray-800">{marker.content}</h3>
                  <p className="text-xs text-gray-500 mt-1">Destination</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {route && (
            <Polyline 
                positions={route.positions} 
                color="#3B82F6" 
                weight={5} 
                opacity={0.7} 
                dashArray={null}
            />
        )}
      </MapContainer>

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
         {/* Directions Button */}
         {destination && (
             <button
               onClick={handleGetDirections}
               disabled={loading}
               className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 border border-blue-100"
             >
               {loading ? (
                   <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               ) : (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                   </svg>
               )}
               <span>Get Directions</span>
             </button>
         )}
      </div>

      {/* Bottom Information Panel (if route active) */}
      {route && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white p-4 rounded-xl shadow-xl border-l-4 border-blue-500 animate-slide-up mx-auto max-w-md">
             <div className="flex justify-between items-center">
                 <div>
                     <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Route Details</p>
                     <div className="flex items-baseline gap-2 mt-1">
                         <span className="text-2xl font-bold text-gray-900">{route.duration} min</span>
                         <span className="text-sm text-gray-600">({route.distance} km)</span>
                     </div>
                 </div>
                 <a 
                   href={`https://www.google.com/maps/dir/?api=1&destination=${destination[0]},${destination[1]}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                 >
                   Open in Google Maps
                 </a>
             </div>
          </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="absolute top-20 right-4 z-[1000] bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded shadow-lg max-w-xs animate-fade-in">
           <p className="font-bold text-sm">Error</p>
           <p className="text-xs">{error}</p>
           <button onClick={() => setError(null)} className="absolute top-1 right-1 text-red-500 hover:text-red-800">
               &times;
           </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
