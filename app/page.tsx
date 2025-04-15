"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

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
  "Valasaravakkam", "Mogappair", "Marina Beach", "Poonamallee","SRM University"
];

export default function Home() {
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [currentTab, setCurrentTab] = useState("search");
  
  // Add mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Location suggestion states
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  
  // Refs for suggestion dropdowns
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  
  // Animation state
  const [animatedCount, setAnimatedCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedCount(prev => (prev + 1) % 100);
    }, 3000);
    
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
      clearInterval(interval);
    };
  }, []);

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
    setSearchOrigin(value);
    
    // Filter locations based on input
    const suggestions = filterLocations(value);
    setOriginSuggestions(suggestions);
    setShowOriginSuggestions(suggestions.length > 0);
  };
  
  // Handle destination input change
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchDestination(value);
    
    // Filter locations based on input
    const suggestions = filterLocations(value);
    setDestinationSuggestions(suggestions);
    setShowDestinationSuggestions(suggestions.length > 0);
  };
  
  // Handle suggestion selection
  const handleSelectOrigin = (location: string) => {
    setSearchOrigin(location);
    setShowOriginSuggestions(false);
  };
  
  const handleSelectDestination = (location: string) => {
    setSearchDestination(location);
    setShowDestinationSuggestions(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // This would navigate to the trip planner with the search params
    window.location.href = `/trip-planner?origin=${encodeURIComponent(searchOrigin)}&destination=${encodeURIComponent(searchDestination)}`;
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
              <button 
                className="p-2 text-teal-400 focus:outline-none"
                aria-label="Toggle mobile menu"
                onClick={toggleMobileMenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/trip-planner" className="nav-link">
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
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 bg-gray-900/80 backdrop-blur-md rounded-lg p-4 border border-gray-800">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/trip-planner" 
                  className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Plan Route
                </Link>
                <Link 
                  href="/transport-map" 
                  className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Live Transit
                </Link>
                <Link 
                  href="/rides" 
                  className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Ride
                </Link>
                <Link 
                  href="/bookings" 
                  className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Rides
                </Link>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-grow py-12 md:py-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-teal-500/5 rounded-bl-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500/5 rounded-tr-full blur-3xl"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="cyber-heading">Next-Gen</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
                  Transport System
                </span>
              </h1>
              
              <p className="text-xl text-teal-100/80 max-w-xl">
                Seamlessly navigate Chennai with real-time updates, smart routing, and integrated payment systems.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-teal-100/90">Real-time tracking</span>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-teal-100/90">Smart payments</span>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span className="text-teal-100/90">Multi-modal routes</span>
              </div>
            </div>
            
            <div className="cyber-card max-w-xl">
              <div className="flex mb-4 space-x-1">
                {["search", "schedule", "pass"].map((tab) => (
                  <button 
                    key={tab}
                    className={`px-4 py-2 text-sm rounded-t-md ${
                      currentTab === tab 
                        ? "bg-teal-500/20 text-white border-b-2 border-teal-500" 
                        : "text-teal-300/70 hover:text-white"
                    }`}
                    onClick={() => setCurrentTab(tab)}
                  >
                    {tab === "search" && "Find Route"}
                    {tab === "schedule" && "Schedules"}
                    {tab === "pass" && "Transit Pass"}
                  </button>
                ))}
              </div>
              
              {currentTab === "search" && (
                <form onSubmit={handleSearch} className="space-y-4">
                  <div ref={originRef} className="relative cyber-input-group pl-3">
                    <label htmlFor="origin" className="block text-xs text-teal-400 uppercase tracking-wider mb-1 ml-1">Starting Point</label>
                    <input 
                      type="text" 
                      id="origin" 
                      placeholder="Enter any location in Chennai" 
                      className="cyber-input w-full"
                      value={searchOrigin}
                      onChange={handleOriginChange}
                      onFocus={() => setShowOriginSuggestions(originSuggestions.length > 0)}
                    />
                    {showOriginSuggestions && (
                      <div className="absolute z-20 w-full mt-1 bg-gray-900/90 shadow-lg rounded-md border border-teal-500/30 max-h-60 overflow-auto">
                        {originSuggestions.map((location, index) => (
                          <div 
                            key={index}
                            className="p-2 hover:bg-teal-500/20 cursor-pointer text-teal-100 border-l-2 border-transparent hover:border-teal-400"
                            onClick={() => handleSelectOrigin(location)}
                          >
                            {location}, Chennai
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div ref={destinationRef} className="relative cyber-input-group pl-3">
                    <label htmlFor="destination" className="block text-xs text-teal-400 uppercase tracking-wider mb-1 ml-1">Destination</label>
                    <input 
                      type="text" 
                      id="destination" 
                      placeholder="Enter any location in Chennai" 
                      className="cyber-input w-full"
                      value={searchDestination}
                      onChange={handleDestinationChange}
                      onFocus={() => setShowDestinationSuggestions(destinationSuggestions.length > 0)}
                    />
                    {showDestinationSuggestions && (
                      <div className="absolute z-20 w-full mt-1 bg-gray-900/90 shadow-lg rounded-md border border-teal-500/30 max-h-60 overflow-auto">
                        {destinationSuggestions.map((location, index) => (
                          <div 
                            key={index}
                            className="p-2 hover:bg-teal-500/20 cursor-pointer text-teal-100 border-l-2 border-transparent hover:border-teal-400"
                            onClick={() => handleSelectDestination(location)}
                          >
                            {location}, Chennai
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary flex-1 py-3">
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Find Routes
                      </span>
                    </button>
                  </div>
                </form>
              )}
              
              {currentTab === "schedule" && (
                <div className="p-6 flex justify-center items-center">
                  <div className="text-center text-teal-300/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-teal-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Schedule feature coming soon</p>
                  </div>
                </div>
              )}
              
              {currentTab === "pass" && (
                <div className="p-6 flex justify-center items-center">
                  <div className="text-center text-teal-300/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-teal-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <p>Transit pass feature coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block lg:col-span-2">
            <div className="relative h-full w-full glass-panel p-1 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-teal-900/10 backdrop-blur-sm rounded-lg"></div>
              <div className="absolute top-0 right-0 h-1/2 w-1/2 bg-gradient-to-br from-teal-500/20 to-purple-500/20 blur-2xl rounded-full"></div>
              
              <div className="relative z-10 p-4 h-full flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-teal-400 text-sm font-medium">Chennai Transit Network</div>
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  </div>
                </div>
                
                <div className="flex-grow relative">
                  {/* Stylized "map" with neon routes */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Map grid lines */}
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={`v-${i}`} className="absolute top-0 bottom-0" style={{ left: `${i * (100 / 6)}%`, width: '1px', background: 'rgba(45, 212, 191, 0.2)' }}></div>
                        ))}
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={`h-${i}`} className="absolute left-0 right-0" style={{ top: `${i * (100 / 6)}%`, height: '1px', background: 'rgba(45, 212, 191, 0.2)' }}></div>
                        ))}
                      </div>
                      
                      {/* Animated position indicator */}
                      <div 
                        className="absolute h-3 w-3 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50"
                        style={{ 
                          left: `${30 + Math.sin(animatedCount * 0.1) * 20}%`, 
                          top: `${40 + Math.cos(animatedCount * 0.1) * 15}%`,
                          transition: 'all 3s ease-in-out'
                        }}
                      ></div>
                      
                      {/* Route lines */}
                      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M50,50 C100,30 150,70 200,50 S250,20 300,50" 
                          stroke="rgba(45, 212, 191, 0.6)" 
                          strokeWidth="2" 
                          fill="none"
                          strokeDasharray="5,5"
                          strokeLinecap="round"
                        />
                        <path 
                          d="M50,100 C100,120 150,90 200,120 S250,140 300,120" 
                          stroke="rgba(168, 85, 247, 0.6)" 
                          strokeWidth="2" 
                          fill="none"
                          strokeDasharray="5,5"
                          strokeLinecap="round"
                        />
                        <path 
                          d="M50,150 C100,130 150,170 200,130 S250,110 300,150" 
                          stroke="rgba(251, 191, 36, 0.6)" 
                          strokeWidth="2" 
                          fill="none"
                          strokeDasharray="5,5"
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      {/* Map stations */}
                      <div className="absolute h-4 w-4 rounded-full border-2 border-teal-400 bg-teal-900/50" style={{ left: '20%', top: '30%' }}></div>
                      <div className="absolute h-4 w-4 rounded-full border-2 border-teal-400 bg-teal-900/50" style={{ left: '60%', top: '40%' }}></div>
                      <div className="absolute h-4 w-4 rounded-full border-2 border-purple-400 bg-purple-900/50" style={{ left: '30%', top: '70%' }}></div>
                      <div className="absolute h-4 w-4 rounded-full border-2 border-purple-400 bg-purple-900/50" style={{ left: '70%', top: '60%' }}></div>
                      <div className="absolute h-4 w-4 rounded-full border-2 border-amber-400 bg-amber-900/50" style={{ left: '50%', top: '25%' }}></div>
                      <div className="absolute h-4 w-4 rounded-full border-2 border-amber-400 bg-amber-900/50" style={{ left: '80%', top: '75%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-teal-900/30 pt-4">
                  <div className="text-xs text-teal-300/70">Transport status</div>
                  <div className="mt-2 flex space-x-4">
                    <div className="flex-1 bg-teal-900/20 rounded p-2">
                      <div className="text-teal-400 text-xs">Metro</div>
                      <div className="flex items-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Operational</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-teal-900/20 rounded p-2">
                      <div className="text-teal-400 text-xs">Bus</div>
                      <div className="flex items-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-sm">Minor delays</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-teal-900/30 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-teal-400 text-3xl md:text-4xl font-bold mb-1">25+</div>
              <div className="text-teal-200/60 text-sm uppercase tracking-wider">Transit Routes</div>
            </div>
            <div className="text-center">
              <div className="text-teal-400 text-3xl md:text-4xl font-bold mb-1">320K</div>
              <div className="text-teal-200/60 text-sm uppercase tracking-wider">Daily Commuters</div>
            </div>
            <div className="text-center">
              <div className="text-teal-400 text-3xl md:text-4xl font-bold mb-1">98%</div>
              <div className="text-teal-200/60 text-sm uppercase tracking-wider">On-time Rate</div>
            </div>
            <div className="text-center">
              <div className="text-teal-400 text-3xl md:text-4xl font-bold mb-1">5 min</div>
              <div className="text-teal-200/60 text-sm uppercase tracking-wider">Average Wait</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-full h-20 bg-gradient-to-t from-teal-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-purple-600 rounded-md flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-teal-400 text-xl font-bold neon-text">FLEX</span>
            </div>
            <div className="flex flex-wrap justify-center space-x-6">
              <a href="#" className="text-teal-300/70 hover:text-teal-300 text-sm">About</a>
              <a href="#" className="text-teal-300/70 hover:text-teal-300 text-sm">Careers</a>
              <a href="#" className="text-teal-300/70 hover:text-teal-300 text-sm">Privacy</a>
              <a href="#" className="text-teal-300/70 hover:text-teal-300 text-sm">Terms</a>
              <a href="#" className="text-teal-300/70 hover:text-teal-300 text-sm">Support</a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-teal-400/50 text-sm">&copy; 2023 FLEX Transit Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
