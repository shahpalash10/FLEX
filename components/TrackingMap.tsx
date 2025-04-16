"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Define the prop types for the component
interface TrackingMapProps {
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  driverPosition: { lat: number; lng: number };
  routePoints: { lat: number; lng: number }[];
}

// Fix Leaflet icon issue with Next.js
const fixLeafletIcons = () => {
  // @ts-ignore - Leaflet has custom issues with Next.js
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Custom icon for driver
const createDriverIcon = () => {
  return L.divIcon({
    html: `<div class="h-6 w-6 bg-teal-400 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8" />
            </svg>
          </div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Custom icon for pickup and dropoff locations
const createLocationIcon = (color: string) => {
  return L.divIcon({
    html: `<div class="h-6 w-6 bg-${color} border-2 border-white rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function TrackingMap({ pickup, dropoff, driverPosition, routePoints }: TrackingMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    // Initialize map only on client-side
    fixLeafletIcons();

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      // Calculate the center point between pickup and dropoff
      const center = {
        lat: (pickup.lat + dropoff.lat) / 2,
        lng: (pickup.lng + dropoff.lng) / 2
      };

      // Create map
      mapRef.current = L.map('tracking-map', {
        center: [center.lat, center.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Add tile layer (dark theme)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapRef.current);

      // Add pickup marker
      L.marker([pickup.lat, pickup.lng], {
        icon: createLocationIcon('green-500')
      }).addTo(mapRef.current)
        .bindTooltip('Pickup', { permanent: false, direction: 'top' });

      // Add dropoff marker
      L.marker([dropoff.lat, dropoff.lng], {
        icon: createLocationIcon('purple-500')
      }).addTo(mapRef.current)
        .bindTooltip('Dropoff', { permanent: false, direction: 'top' });
    }

    // Update driver position
    if (mapRef.current) {
      // Remove previous driver marker if exists
      if (driverMarkerRef.current) {
        driverMarkerRef.current.remove();
      }

      // Add new driver marker
      driverMarkerRef.current = L.marker([driverPosition.lat, driverPosition.lng], {
        icon: createDriverIcon()
      }).addTo(mapRef.current)
        .bindTooltip('Driver', { permanent: false, direction: 'top' });

      // Remove previous route if exists
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
      }

      // Draw route
      if (routePoints && routePoints.length > 0) {
        const latLngs = routePoints.map(point => L.latLng(point.lat, point.lng));
        routeLayerRef.current = L.polyline(latLngs, {
          color: '#2dd4bf',
          weight: 5,
          opacity: 0.7,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: '10, 10'
        }).addTo(mapRef.current);

        // Fit map to route bounds
        mapRef.current.fitBounds(routeLayerRef.current.getBounds(), {
          padding: [30, 30]
        });
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pickup, dropoff, driverPosition, routePoints]);

  return <div id="tracking-map" className="h-full w-full z-0"></div>;
} 