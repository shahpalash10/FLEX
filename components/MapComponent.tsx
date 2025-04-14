"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Types for the transport vehicles and stops
interface TransportVehicle {
  id: number;
  type: string;
  number: string;
  route: string;
  lat: number;
  lng: number;
  speed: number;
  direction: number;
  status: string;
  nextStop: string;
  nextStopTime: string;
  capacity: number;
  currentCapacity: number;
}

interface TransportStop {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  lines: string[];
}

interface MapComponentProps {
  vehicles: TransportVehicle[];
  stops: TransportStop[];
  selectedVehicleId: number | null;
  onVehicleSelect: (id: number) => void;
}

// Component to center the map on a selected vehicle
function MapCenterControl({ selectedVehicle }: { selectedVehicle: TransportVehicle | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedVehicle) {
      map.setView([selectedVehicle.lat, selectedVehicle.lng], 15);
    }
  }, [map, selectedVehicle]);
  
  return null;
}

export default function MapComponent({ vehicles, stops, selectedVehicleId, onVehicleSelect }: MapComponentProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);

  // Update the selected vehicle when the ID changes
  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId) || null;
      setSelectedVehicle(vehicle);
    } else {
      setSelectedVehicle(null);
    }
  }, [selectedVehicleId, vehicles]);

  // Get custom icon based on vehicle type
  const getVehicleIcon = (type: string) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div class="bg-${
        type === 'bus' ? 'green' : type === 'metro' ? 'blue' : 'yellow'
      }-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
        ${type === 'bus' ? 'B' : type === 'metro' ? 'M' : 'T'}
      </div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    });
  };

  // Get custom icon for stops
  const getStopIcon = (type: string) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div class="bg-gray-200 dark:bg-gray-700 border-2 border-${
        type === 'bus' ? 'green' : type === 'metro' ? 'blue' : type === 'train' ? 'yellow' : 'gray'
      }-500 rounded-full h-4 w-4"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  return (
    <MapContainer 
      center={[40.7128, -74.006]} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Stops Markers */}
      {stops.map((stop) => (
        <Marker 
          key={`stop-${stop.id}`}
          position={[stop.lat, stop.lng]}
          icon={getStopIcon(stop.type)}
        >
          <Popup>
            <div>
              <h3 className="font-medium">{stop.name}</h3>
              <p className="text-sm text-gray-600">
                {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)} Stop
              </p>
              <p className="text-xs mt-1">
                <span className="font-medium">Lines:</span> {stop.lines.join(', ')}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Vehicle Markers */}
      {vehicles.map((vehicle) => (
        <Marker 
          key={`vehicle-${vehicle.id}`}
          position={[vehicle.lat, vehicle.lng]}
          icon={getVehicleIcon(vehicle.type)}
          eventHandlers={{
            click: () => onVehicleSelect(vehicle.id)
          }}
        >
          <Popup>
            <div>
              <h3 className="font-medium">
                {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} {vehicle.number}
              </h3>
              <p className="text-sm text-gray-600">{vehicle.route}</p>
              <div className="mt-2 text-xs">
                <p>
                  <span className="font-medium">Next Stop:</span> {vehicle.nextStop}
                </p>
                <p>
                  <span className="font-medium">ETA:</span> {vehicle.nextStopTime}
                </p>
                <p className={vehicle.status === 'on-time' ? 'text-green-600' : 'text-red-600'}>
                  <span className="font-medium text-gray-600">Status:</span> {vehicle.status}
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Center map on selected vehicle */}
      <MapCenterControl selectedVehicle={selectedVehicle} />
    </MapContainer>
  );
} 