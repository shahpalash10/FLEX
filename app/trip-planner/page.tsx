import PageTransition from "@/components/PageTransition";
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";

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

// Client component that uses useSearchParams
function TripPlannerContent() {
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
    <PageTransition>
      <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navbar activePage="trip-planner" />

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
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn-primary rounded-l-none px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </div>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Search Results */}
          {hasSearched && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Route options */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Route Options</h2>
                <div className="space-y-3">
                  {ROUTE_OPTIONS.map((route) => (
                    <div
                      key={route.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        activeRouteId === route.id
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setActiveRouteId(route.id)}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{route.name}</h3>
                        <span className="text-teal-600 dark:text-teal-400 font-medium">₹{route.price}</span>
                      </div>
                      <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{route.duration} min</span>
                        <span>{route.transfers} transfer{route.transfers !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Filters</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-teal-500" />
                        <span>Prefer metro</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-teal-500" />
                        <span>Avoid buses</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-teal-500" />
                        <span>Less walking</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-teal-500" />
                        <span>Wheelchair accessible</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Route details */}
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Route Details</h2>
                    <div className="flex space-x-2">
                      <button className="btn-secondary text-sm px-3 py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save
                      </button>
                      <button className="btn-secondary text-sm px-3 py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">From</div>
                      <div className="font-medium">{origin || "Central Station"}</div>
                    </div>
                    <div className="flex items-center px-4">
                      <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">To</div>
                      <div className="font-medium">{destination || "Tech Park"}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {date} · Depart at {time} · {ROUTE_OPTIONS.find(r => r.id === activeRouteId)?.duration} min
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Transport steps */}
                    {TRANSPORT_OPTIONS.map((option, index) => (
                      <div key={option.id} className="relative">
                        {index < TRANSPORT_OPTIONS.length - 1 && (
                          <div className="absolute left-3.5 top-11 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
                        )}
                        
                        <div className="flex">
                          <div className="relative z-10">
                            <div className={`h-7 w-7 rounded-full ${option.color} flex items-center justify-center text-white font-medium text-xs`}>
                              {option.type === "bus" ? "B" : option.type === "metro" ? "M" : "W"}
                            </div>
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <span className="font-medium">
                                  {option.type === "bus" ? `Bus ${option.number}` : 
                                   option.type === "metro" ? `Metro ${option.number}` : 
                                   "Walk"}
                                </span>
                                {option.type !== "walk" && (
                                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                                    ({option.price ? `₹${option.price}` : "Free"})
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {option.startTime} - {option.endTime}
                              </div>
                            </div>
                            
                            <div className="mt-1 text-sm">
                              <div>From: {option.startLocation}</div>
                              <div>To: {option.endLocation}</div>
                              {option.type === "walk" && (
                                <div className="text-gray-600 dark:text-gray-400 mt-1">
                                  {option.distance} · about 10 min
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex space-x-4">
                    <button className="btn-primary w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      Buy Tickets
                    </button>
                    <Link href="/tracking" className="btn-secondary w-full text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Track Live
                    </Link>
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
              <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">FLEX Transit</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your local transportation solution</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400">About</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400">Contact</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400">Privacy</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Loading fallback for Suspense
function TripPlannerLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      <p className="ml-2 text-teal-500">Loading trip planner...</p>
    </div>
  );
}

// Main page component with Suspense boundary
export default function TripPlanner() {
  return (
    <Suspense fallback={<TripPlannerLoading />}>
      <TripPlannerContent />
    </Suspense>
  );
} 