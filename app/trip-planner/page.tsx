"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Chennai location data - popular areas and landmarks
const CHENNAI_LOCATIONS = [
  "T Nagar", "Anna Nagar", "Adyar", "Velachery", "Tambaram", 
  "Porur", "Nungambakkam", "Guindy", "Egmore", "Mylapore",
  "Besant Nagar", "Chromepet", "Chennai Central", "Koyambedu",
  "Vadapalani", "Chennai Airport", "Mount Road", "Perambur",
  "Ambattur", "Sholinganallur", "OMR", "ECR", "Pallavaram",
  "Perungudi", "Thiruvanmiyur", "Kilpauk", "Choolaimedu",
  "Royapettah", "Chetpet", "Kodambakkam", "West Mambalam",
  "Saidapet", "Madipakkam", "Thoraipakkam", "Pallikaranai",
  "Meenambakkam", "Nanganallur", "Ashok Nagar", "KK Nagar",
  "Valasaravakkam", "Mogappair", "Marina Beach", "Poonamallee"
];

// Mock data for transport options
const TRANSPORT_OPTIONS = [
  { id: 1, type: "bus", number: "B101", startTime: "08:15", endTime: "08:45", startLocation: "Central Bus Station", endLocation: "North Square", price: 40, color: "bg-green-500" },
  { id: 2, type: "metro", number: "M2", startTime: "08:50", endTime: "09:10", startLocation: "North Square Metro", endLocation: "East End Station", price: 60, color: "bg-blue-500" },
  { id: 3, type: "walk", startTime: "09:10", endTime: "09:20", startLocation: "East End Station", endLocation: "Business Park", distance: "0.5km", color: "bg-gray-400" },
  { id: 4, type: "bus", number: "B205", startTime: "09:30", endTime: "09:45", startLocation: "Business Park", endLocation: "Tech Campus", price: 40, color: "bg-green-500" },
];

// Alternative route options
const ROUTE_OPTIONS = [
  { id: 1, name: "Fastest Route", duration: 65, price: 140, transfers: 2 },
  { id: 2, name: "Cheapest Route", duration: 75, price: 100, transfers: 3 },
  { id: 3, name: "Least Transfers", duration: 80, price: 180, transfers: 1 },
];

export default function TripPlanner() {
  const searchParams = useSearchParams();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [activeRouteId, setActiveRouteId] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Location suggestion states
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  
  // Refs for suggestion dropdowns
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current date and time for the input defaults
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().substring(0, 5));

    // Get params from URL if present
    const originParam = searchParams.get("origin");
    const destParam = searchParams.get("destination");
    
    if (originParam) setOrigin(originParam);
    if (destParam) setDestination(destParam);
    
    // If both params exist, auto-search
    if (originParam && destParam) {
      setHasSearched(true);
    }
    
    // Add click outside listener to close suggestion dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchParams]);

  // Filter location suggestions based on input
  const filterLocations = (input: string) => {
    if (!input) return [];
    
    input = input.toLowerCase();
    
    // First check for exact matches or contains
    const exactMatches = CHENNAI_LOCATIONS.filter(loc => 
      loc.toLowerCase() === input || loc.toLowerCase().includes(input)
    );
    
    // If we have enough exact matches, return those
    if (exactMatches.length >= 3) {
      return exactMatches.slice(0, 5);
    }
    
    // Add fuzzy matches - locations that might be misspelled
    const fuzzyMatches = CHENNAI_LOCATIONS.filter(loc => {
      // Split the location name into words
      const words = loc.toLowerCase().split(' ');
      // Check if any word starts with the input
      return words.some(word => word.startsWith(input.substring(0, 3)));
    });
    
    // Combine and deduplicate results
    const allMatches = [...new Set([...exactMatches, ...fuzzyMatches])];
    return allMatches.slice(0, 5);
  };
  
  // Handle origin input change
  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrigin(value);
    
    // Filter locations based on input
    const suggestions = filterLocations(value);
    setOriginSuggestions(suggestions);
    setShowOriginSuggestions(suggestions.length > 0);
  };
  
  // Handle destination input change
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    
    // Filter locations based on input
    const suggestions = filterLocations(value);
    setDestinationSuggestions(suggestions);
    setShowDestinationSuggestions(suggestions.length > 0);
  };
  
  // Handle suggestion selection
  const handleSelectOrigin = (location: string) => {
    setOrigin(location);
    setShowOriginSuggestions(false);
  };
  
  const handleSelectDestination = (location: string) => {
    setDestination(location);
    setShowDestinationSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Always show results for Chennai locations, regardless of input
    // This ensures users get routes even if they type locations not in our database
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-purple-600 rounded-md flex items-center justify-center neon-border">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-teal-400 text-2xl font-bold neon-text tracking-wider">FLEX</span>
              </Link>
            </div>
            <div className="md:hidden">
              <button className="p-2 text-teal-400 focus:outline-none" aria-label="Toggle mobile menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/trip-planner" className="nav-link text-teal-400">
                Plan Route
              </Link>
              <Link href="/transport-map" className="nav-link">
                Live Transit
              </Link>
              <Link href="/rides" className="nav-link">
                Book Ride
              </Link>
              <Link href="/bookings" className="nav-link">
                My Rides
              </Link>
              <Link href="/profile" className="btn-primary">
                <span className="relative z-10">Profile</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Trip Planner</h1>
          
          {/* Search Form */}
          <div className="card mb-8">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div ref={originRef} className="relative">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origin</label>
                <input
                  type="text"
                  id="origin"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  placeholder="Enter any location in Chennai"
                  value={origin}
                  onChange={handleOriginChange}
                  onFocus={() => setShowOriginSuggestions(originSuggestions.length > 0)}
                  required
                />
                {showOriginSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                    {originSuggestions.map((location, index) => (
                      <div 
                        key={index}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleSelectOrigin(location)}
                      >
                        {location}, Chennai
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div ref={destinationRef} className="relative">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
                <input
                  type="text"
                  id="destination"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  placeholder="Enter any location in Chennai"
                  value={destination}
                  onChange={handleDestinationChange}
                  onFocus={() => setShowDestinationSuggestions(destinationSuggestions.length > 0)}
                  required
                />
                {showDestinationSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                    {destinationSuggestions.map((location, index) => (
                      <div 
                        key={index}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleSelectDestination(location)}
                      >
                        {location}, Chennai
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <div className="flex">
                  <input
                    type="time"
                    id="time"
                    className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn-primary rounded-l-none"
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Find Routes"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Route Options */}
              <div className="lg:col-span-1">
                <div className="card mb-6">
                  <h2 className="text-xl font-semibold mb-4">Available Routes</h2>
                  <div className="space-y-3">
                    {ROUTE_OPTIONS.map((route) => (
                      <div
                        key={route.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          activeRouteId === route.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setActiveRouteId(route.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{route.name}</span>
                          <span className="text-blue-600 dark:text-blue-400">₹{route.price}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>{Math.floor(route.duration / 60)}h {route.duration % 60}m</span>
                          <span className="mx-2">•</span>
                          <span>{route.transfers} transfer{route.transfers !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Journey Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">From</span>
                      <span className="font-medium">{origin}, Chennai</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">To</span>
                      <span className="font-medium">{destination}, Chennai</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Departure</span>
                      <span className="font-medium">{TRANSPORT_OPTIONS[0].startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Arrival</span>
                      <span className="font-medium">{TRANSPORT_OPTIONS[TRANSPORT_OPTIONS.length - 1].endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration</span>
                      <span className="font-medium">1h 30m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transfers</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Fare</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">₹{ROUTE_OPTIONS.find(route => route.id === activeRouteId)?.price}</span>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                    
                    <button className="btn-primary w-full">Book This Journey</button>
                  </div>
                </div>
              </div>

              {/* Journey Details */}
              <div className="lg:col-span-2">
                <div className="card">
                  <h2 className="text-xl font-semibold mb-6">Journey Details</h2>
                  
                  <div className="space-y-6">
                    {TRANSPORT_OPTIONS.map((option, index) => (
                      <div key={option.id} className="relative">
                        {/* Connection Line */}
                        {index < TRANSPORT_OPTIONS.length - 1 && (
                          <div className="absolute top-10 bottom-0 left-4 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                        )}
                        
                        <div className="flex">
                          {/* Left timeline with colored dot */}
                          <div className="mr-4 relative">
                            <div className={`h-8 w-8 rounded-full ${option.color} flex items-center justify-center text-white`}>
                              {option.type === "bus" && "B"}
                              {option.type === "metro" && "M"}
                              {option.type === "walk" && "W"}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium">
                                  {option.type === "bus" && `Bus ${option.number}`}
                                  {option.type === "metro" && `Metro Line ${option.number}`}
                                  {option.type === "walk" && `Walk ${option.distance}`}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {option.startLocation} → {option.endLocation}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  {option.startTime} - {option.endTime}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {option.type !== "walk" ? `₹${option.price}` : "Free"}
                                </div>
                              </div>
                            </div>
                            
                            {/* Details specific to transport type */}
                            {option.type === "bus" && (
                              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm mb-1">
                                  <span className="font-medium">Bus Stop:</span> Platform {Math.floor(Math.random() * 10) + 1}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Frequency:</span> Every 10 minutes
                                </p>
                                <div className="mt-2 flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                  <span className="text-sm text-green-600 dark:text-green-400">On time</span>
                                </div>
                              </div>
                            )}
                            
                            {option.type === "metro" && (
                              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm mb-1">
                                  <span className="font-medium">Platform:</span> {Math.floor(Math.random() * 5) + 1}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Direction:</span> Eastbound
                                </p>
                                <div className="mt-2 flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                                  <span className="text-sm text-yellow-600 dark:text-yellow-400">2 min delay</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
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