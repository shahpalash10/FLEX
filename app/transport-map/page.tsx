import PageTransition from "@/components/PageTransition";
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";

// Mock data for transport vehicles
const TRANSPORT_VEHICLES = [
  { id: 1, type: "bus", number: "B101", route: "Downtown - North Square", lat: 40.7128, lng: -74.006, speed: 25, direction: 45, status: "on-time", nextStop: "Central Park South", nextStopTime: "14:35", capacity: 75, currentCapacity: 40 },
  { id: 2, type: "bus", number: "B205", route: "Uptown Express", lat: 40.7230, lng: -73.9949, speed: 18, direction: 120, status: "delayed", nextStop: "Grand Central", nextStopTime: "14:42", capacity: 60, currentCapacity: 55 },
  { id: 3, type: "metro", number: "M2", route: "Blue Line", lat: 40.7300, lng: -74.0100, speed: 40, direction: 90, status: "on-time", nextStop: "Union Square", nextStopTime: "14:32", capacity: 200, currentCapacity: 180 },
  { id: 4, type: "metro", number: "M5", route: "Green Line", lat: 40.7350, lng: -73.9900, speed: 35, direction: 270, status: "on-time", nextStop: "Times Square", nextStopTime: "14:30", capacity: 180, currentCapacity: 120 },
  { id: 5, type: "train", number: "T3", route: "Express Regional", lat: 40.7500, lng: -74.0050, speed: 80, direction: 180, status: "delayed", nextStop: "Penn Station", nextStopTime: "14:45", capacity: 350, currentCapacity: 290 }
];

// Mock data for transport stops
const TRANSPORT_STOPS = [
  { id: 1, name: "Central Station", type: "multimodal", lat: 40.7128, lng: -74.006, lines: ["B101", "B205", "M2", "T3"] },
  { id: 2, name: "North Square", type: "bus", lat: 40.7230, lng: -73.9949, lines: ["B101"] },
  { id: 3, name: "Union Square", type: "metro", lat: 40.7300, lng: -74.0100, lines: ["M2", "M5"] },
  { id: 4, name: "Business Park", type: "bus", lat: 40.7350, lng: -73.9900, lines: ["B205"] },
  { id: 5, name: "Penn Station", type: "train", lat: 40.7500, lng: -74.0050, lines: ["T3"] }
];

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
    </div>
  )
});

export default function TransportMap() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedTransportType, setSelectedTransportType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Filter vehicles based on transport type and search query
  const filteredVehicles = TRANSPORT_VEHICLES.filter(vehicle => {
    const matchesType = selectedTransportType === "all" || vehicle.type === selectedTransportType;
    const matchesSearch = vehicle.number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vehicle.route.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Selected vehicle details
  const selectedVehicle = selectedVehicleId ? 
    TRANSPORT_VEHICLES.find(v => v.id === selectedVehicleId) : null;

  // Update time and simulate vehicle movement
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // In a real app, we would update the positions of vehicles here
      // For now, we're just simulating with static data
    }, 1000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navbar activePage="transport-map" />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Transport Map</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time view of transportation services
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                <span className="text-xl font-mono">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center ml-4">
                <button 
                  className={`p-2 rounded-md ${isSimulating ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'}`}
                  onClick={() => setIsSimulating(!isSimulating)}
                  aria-label={isSimulating ? "Pause simulation" : "Start simulation"}
                >
                  {isSimulating ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
                <div className="ml-2">
                  <select 
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2"
                    value={simulationSpeed}
                    onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                    aria-label="Simulation speed"
                  >
                    <option value={0.5}>0.5x Speed</option>
                    <option value={1}>1x Speed</option>
                    <option value={2}>2x Speed</option>
                    <option value={4}>4x Speed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters and Transport List */}
            <div className="lg:col-span-1">
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>
                <div className="mb-4">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search by route or number
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="E.g. B101, Downtown..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Transport Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTransportType === "all"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                      onClick={() => setSelectedTransportType("all")}
                    >
                      All
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTransportType === "bus"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                      onClick={() => setSelectedTransportType("bus")}
                    >
                      Bus
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTransportType === "metro"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                      onClick={() => setSelectedTransportType("metro")}
                    >
                      Metro
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTransportType === "train"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                      onClick={() => setSelectedTransportType("train")}
                    >
                      Train
                    </button>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Live Transports</h2>
                <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
                  {filteredVehicles.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No vehicles match your filters
                    </p>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedVehicleId === vehicle.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setSelectedVehicleId(vehicle.id)}
                      >
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white
                            ${vehicle.type === "bus" ? "bg-green-500" : 
                              vehicle.type === "metro" ? "bg-blue-500" : 
                              "bg-yellow-500"}`}
                          >
                            {vehicle.type === "bus" ? "B" : 
                             vehicle.type === "metro" ? "M" : "T"}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} {vehicle.number}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.route}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Next stop:</span>
                            <span>{vehicle.nextStop}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">ETA:</span>
                            <span>{vehicle.nextStopTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <span className={vehicle.status === "on-time" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                              {vehicle.status === "on-time" ? "On time" : "Delayed"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Map and Vehicle Details */}
            <div className="lg:col-span-3">
              <div className="h-[500px] w-full overflow-hidden rounded-lg shadow-md mb-6">
                <MapComponent 
                  vehicles={filteredVehicles}
                  stops={TRANSPORT_STOPS}
                  selectedVehicleId={selectedVehicleId}
                  onVehicleSelect={setSelectedVehicleId}
                />
              </div>

              {/* Selected Vehicle Details */}
              {selectedVehicle && (
                <div className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedVehicle.type.charAt(0).toUpperCase() + selectedVehicle.type.slice(1)} {selectedVehicle.number}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">{selectedVehicle.route}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedVehicle.status === "on-time"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {selectedVehicle.status === "on-time" ? "On Time" : "Delayed"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-gray-600 dark:text-gray-400">Next Stop</h3>
                      <p className="font-medium">{selectedVehicle.nextStop}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-600 dark:text-gray-400">Estimated Arrival</h3>
                      <p className="font-medium">{selectedVehicle.nextStopTime}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-600 dark:text-gray-400">Current Speed</h3>
                      <p className="font-medium">{selectedVehicle.speed} km/h</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-600 dark:text-gray-400">Occupancy</h3>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            {Math.round((selectedVehicle.currentCapacity / selectedVehicle.capacity) * 100)}%
                          </span>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                (selectedVehicle.currentCapacity / selectedVehicle.capacity) > 0.8
                                  ? "bg-red-500"
                                  : (selectedVehicle.currentCapacity / selectedVehicle.capacity) > 0.5
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${(selectedVehicle.currentCapacity / selectedVehicle.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {selectedVehicle.currentCapacity} / {selectedVehicle.capacity} passengers
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Live Updates</h3>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-green-500">
                        <p className="text-sm">
                          Vehicle departed from Downtown Station at 14:15
                        </p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-blue-500">
                        <p className="text-sm">
                          Vehicle is currently en route to {selectedVehicle.nextStop}
                        </p>
                      </div>
                      {selectedVehicle.status === "delayed" && (
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-red-500">
                          <p className="text-sm">
                            Vehicle is experiencing delays due to traffic
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button className="btn-primary">View Full Route</button>
                    <button className="btn-secondary">Set Alert</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">Urban Transit</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your local transportation solution</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">About</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Privacy</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 