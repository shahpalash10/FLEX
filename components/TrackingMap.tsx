"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for the default marker icon in Leaflet with Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Default icon fallbacks to prevent errors
L.Marker.prototype.options.icon = icon;

// Types for the component props
interface TrackingMapProps {
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  driverPosition: { lat: number; lng: number };
  routePoints: { lat: number; lng: number }[];
}

// Component to center the map on driver position
function DriverPositionFollower({ position }: { position: { lat: number; lng: number } }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([position.lat, position.lng], 15);
  }, [map, position]);
  
  return null;
}

export default function TrackingMap({ pickup, dropoff, driverPosition, routePoints }: TrackingMapProps) {
  // Create custom icons
  const pickupIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="h-4 w-4 rounded-full bg-teal-500 border-2 border-white"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  const dropoffIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="h-4 w-4 rounded-full bg-purple-500 border-2 border-white"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  const driverIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="h-6 w-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2a1 1 0 00.9-.5l1.5-2.5a1 1 0 00-.08-1.21 1 1 0 00-.82-.29H11v-1a1 1 0 00-1-1H3z" />
      </svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  // Polyline options
  const routeOptions = { 
    color: 'rgba(45, 212, 191, 0.7)', 
    weight: 4,
    dashArray: '5, 10'
  };

  return (
    <MapContainer 
      center={[driverPosition.lat, driverPosition.lng]} 
      zoom={14} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Pickup marker */}
      <Marker 
        position={[pickup.lat, pickup.lng]}
        icon={pickupIcon}
      >
        <Popup>
          <div className="font-medium">Pickup Location</div>
        </Popup>
      </Marker>
      
      {/* Dropoff marker */}
      <Marker 
        position={[dropoff.lat, dropoff.lng]}
        icon={dropoffIcon}
      >
        <Popup>
          <div className="font-medium">Dropoff Location</div>
        </Popup>
      </Marker>
      
      {/* Driver marker */}
      <Marker 
        position={[driverPosition.lat, driverPosition.lng]}
        icon={driverIcon}
      >
        <Popup>
          <div className="font-medium">Your Driver</div>
          <div className="text-xs">On the way</div>
        </Popup>
      </Marker>
      
      {/* Route polyline */}
      <Polyline positions={routePoints.map(point => [point.lat, point.lng])} pathOptions={routeOptions} />
      
      {/* Keep map centered on driver */}
      <DriverPositionFollower position={driverPosition} />
    </MapContainer>
  );
} 