"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Chennai location data - popular areas and landmarks
const CHENNAI_LOCATIONS = [
  "T Nagar", "Anna Nagar", "Adyar", "Velachery", "Tambaram", 
  "Porur", "Nungambakkam", "Guindy", "Egmore", "Mylapore",
  "Besant Nagar", "Chromepet", "Chennai Central", "Koyambedu",
  "Vadapalani", "Chennai Airport", "Mount Road", "Perambur",
  "Ambattur", "Sholinganallur", "OMR", "ECR", "Pallavaram"
];

// Ride options with pricing
const RIDE_OPTIONS = [
  { 
    id: "cab-mini", 
    type: "cab", 
    name: "Mini Cab", 
    capacity: "3 persons", 
    waitTime: "3 min",
    baseFare: 50,
    perKm: 12,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 5v-5m-8 9h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: "cab-prime", 
    type: "cab", 
    name: "Prime Sedan", 
    capacity: "4 persons", 
    waitTime: "5 min",
    baseFare: 70,
    perKm: 15,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  },
  { 
    id: "cab-suv", 
    type: "cab", 
    name: "SUV", 
    capacity: "6 persons", 
    waitTime: "7 min",
    baseFare: 100,
    perKm: 18,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
  { 
    id: "auto", 
    type: "auto", 
    name: "Auto Rickshaw", 
    capacity: "3 persons", 
    waitTime: "2 min",
    baseFare: 35,
    perKm: 10,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    )
  },
  { 
    id: "bike", 
    type: "bike", 
    name: "Bike Taxi", 
    capacity: "1 person", 
    waitTime: "1 min",
    baseFare: 25,
    perKm: 8,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  }
];

export default function Rides() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: locations, 2: select ride, 3: confirm
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  
  // Refs for suggestion dropdowns
  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add click outside listener to close suggestion dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupSuggestions(false);
      }
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setShowDropSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Filter location suggestions based on input
  const filterLocations = (input: string) => {
    if (!input) return [];
    
    input = input.toLowerCase();
    
    // Match locations that include the input
    const matches = CHENNAI_LOCATIONS.filter(loc => 
      loc.toLowerCase().includes(input)
    );
    
    return matches.slice(0, 5);
  };
  
  // Handle pickup location input change
  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPickupLocation(value);
    
    // Filter locations based on input
    const suggestions = filterLocations(value);
    setPickupSuggestions(suggestions);
    setShowPickupSuggestions(suggestions.length > 0);
  };
  
  // Handle drop location input change
  const handleDropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDropLocation(value);
    
    // Filter locations based on input
    const suggestions = filterLocations(value);
    setDropSuggestions(suggestions);
    setShowDropSuggestions(suggestions.length > 0);
  };
  
  // Handle suggestion selection
  const handleSelectPickup = (location: string) => {
    setPickupLocation(location);
    setShowPickupSuggestions(false);
  };
  
  const handleSelectDrop = (location: string) => {
    setDropLocation(location);
    setShowDropSuggestions(false);
  };
  
  // Find available rides
  const handleFindRides = () => {
    if (!pickupLocation || !dropLocation) return;
    
    setIsLoading(true);
    
    // Simulate API call to get distance and time
    setTimeout(() => {
      // Generate a random distance between 3 and 20 km
      const distance = Math.floor(Math.random() * 17) + 3;
      // Generate estimated time based on distance (roughly 2-3 min per km)
      const time = Math.floor(distance * (Math.random() * 1 + 2));
      
      setEstimatedDistance(distance);
      setEstimatedTime(time);
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };
  
  // Calculate price based on ride type and distance
  const calculatePrice = (rideOption: typeof RIDE_OPTIONS[0]) => {
    return Math.round(rideOption.baseFare + (rideOption.perKm * estimatedDistance));
  };
  
  // Select a ride type
  const handleSelectRide = (rideId: string) => {
    setSelectedRide(rideId);
    const ride = RIDE_OPTIONS.find(option => option.id === rideId);
    if (ride) {
      setEstimatedPrice(calculatePrice(ride));
    }
  };
  
  // Confirm ride booking
  const handleConfirmRide = () => {
    setStep(3);
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    // In a real app, this would navigate to a payment gateway
    // For now, we'll just simulate this and redirect to the payment page
    router.push(`/payment?amount=${estimatedPrice}&pickup=${encodeURIComponent(pickupLocation)}&drop=${encodeURIComponent(dropLocation)}&rideId=${selectedRide}`);
  };

  // Renders the step 1 UI: location selection
  const renderLocationSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Book a Ride</h2>
        <p className="text-teal-300/70 mb-6">Enter your pickup and drop-off locations to get started</p>
      </div>

      <div ref={pickupRef} className="relative cyber-input-group pl-3">
        <label htmlFor="pickup" className="block text-xs text-teal-400 uppercase tracking-wider mb-1 ml-1">Pickup Location</label>
        <input 
          type="text" 
          id="pickup" 
          placeholder="Enter pickup location" 
          className="cyber-input w-full"
          value={pickupLocation}
          onChange={handlePickupChange}
          onFocus={() => setShowPickupSuggestions(pickupSuggestions.length > 0)}
        />
        {showPickupSuggestions && (
          <div className="absolute z-20 w-full mt-1 bg-gray-900/90 shadow-lg rounded-md border border-teal-500/30 max-h-60 overflow-auto">
            {pickupSuggestions.map((location, index) => (
              <div 
                key={index}
                className="p-2 hover:bg-teal-500/20 cursor-pointer text-teal-100 border-l-2 border-transparent hover:border-teal-400"
                onClick={() => handleSelectPickup(location)}
              >
                {location}, Chennai
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div ref={dropRef} className="relative cyber-input-group pl-3">
        <label htmlFor="drop" className="block text-xs text-teal-400 uppercase tracking-wider mb-1 ml-1">Drop-off Location</label>
        <input 
          type="text" 
          id="drop" 
          placeholder="Enter destination" 
          className="cyber-input w-full"
          value={dropLocation}
          onChange={handleDropChange}
          onFocus={() => setShowDropSuggestions(dropSuggestions.length > 0)}
        />
        {showDropSuggestions && (
          <div className="absolute z-20 w-full mt-1 bg-gray-900/90 shadow-lg rounded-md border border-teal-500/30 max-h-60 overflow-auto">
            {dropSuggestions.map((location, index) => (
              <div 
                key={index}
                className="p-2 hover:bg-teal-500/20 cursor-pointer text-teal-100 border-l-2 border-transparent hover:border-teal-400"
                onClick={() => handleSelectDrop(location)}
              >
                {location}, Chennai
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button 
        className="btn-primary w-full py-3 mt-4"
        onClick={handleFindRides}
        disabled={!pickupLocation || !dropLocation || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Finding rides...
          </span>
        ) : (
          "Find Rides"
        )}
      </button>
    </div>
  );

  // Renders the step 2 UI: ride selection
  const renderRideSelection = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => setStep(1)} 
          className="flex items-center text-teal-400 hover:text-teal-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <div className="text-right">
          <div className="text-sm text-teal-300/70">Trip details</div>
          <div className="font-medium flex items-center space-x-2">
            <span>{pickupLocation}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span>{dropLocation}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Available Rides</h2>
          <div className="text-sm">
            <span className="text-teal-300/70">Est. distance:</span> <span className="font-medium">{estimatedDistance} km</span> | 
            <span className="text-teal-300/70"> Est. time:</span> <span className="font-medium">{estimatedTime} min</span>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-teal-500/50 via-purple-500/50 to-transparent"></div>
      </div>

      <div className="space-y-3 mb-6">
        {RIDE_OPTIONS.map((ride) => (
          <div 
            key={ride.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedRide === ride.id 
                ? 'border-teal-500 bg-teal-900/20 shadow-lg shadow-teal-500/10' 
                : 'border-gray-800 hover:border-teal-500/50 bg-gray-900/50'
            }`}
            onClick={() => handleSelectRide(ride.id)}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-${ride.type === 'cab' ? 'teal' : ride.type === 'auto' ? 'amber' : 'purple'}-900/30 border border-${ride.type === 'cab' ? 'teal' : ride.type === 'auto' ? 'amber' : 'purple'}-500/30 flex items-center justify-center`}>
                {ride.icon}
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex justify-between">
                  <h3 className="font-medium">{ride.name}</h3>
                  <span className="font-bold">₹{calculatePrice(ride)}</span>
                </div>
                <div className="flex justify-between text-sm text-teal-300/70">
                  <div>{ride.capacity} • {ride.waitTime} away</div>
                  <div className="text-teal-400/80">{ride.type === 'cab' ? 'Cab' : ride.type === 'auto' ? 'Auto' : 'Bike'}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="btn-primary w-full py-3"
        onClick={handleConfirmRide}
        disabled={!selectedRide}
      >
        Confirm {selectedRide ? RIDE_OPTIONS.find(r => r.id === selectedRide)?.name : 'Ride'}
      </button>
    </div>
  );

  // Renders the step 3 UI: booking confirmation
  const renderBookingConfirmation = () => {
    const ride = RIDE_OPTIONS.find(r => r.id === selectedRide);
    
    return (
      <div>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-900/30 border-2 border-teal-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-teal-300/70">Your ride has been booked and is waiting for payment</p>
        </div>

        <div className="cyber-card mb-6">
          <h3 className="text-lg font-medium mb-4">Ride Details</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-teal-300/70">Ride Type</span>
              <span className="font-medium">{ride?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-300/70">From</span>
              <span className="font-medium text-right">{pickupLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-300/70">To</span>
              <span className="font-medium text-right">{dropLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-300/70">Distance</span>
              <span className="font-medium">{estimatedDistance} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-300/70">Estimated Time</span>
              <span className="font-medium">{estimatedTime} min</span>
            </div>
            
            <div className="h-px bg-gradient-to-r from-teal-500/20 to-transparent"></div>
            
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Fare</span>
              <span className="font-bold">₹{estimatedPrice}</span>
            </div>
          </div>
          
          <div className="text-xs text-teal-300/70 mb-4">
            * Final fare may vary based on actual distance traveled
          </div>
        </div>

        <button 
          className="btn-primary w-full py-3 mb-3"
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </button>
        
        <button 
          className="btn-secondary w-full py-3"
          onClick={() => setStep(1)}
        >
          Cancel Booking
        </button>
      </div>
    );
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
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/trip-planner" className="nav-link">
                Plan Route
              </Link>
              <Link href="/transport-map" className="nav-link">
                Live Transit
              </Link>
              <Link href="/rides" className="nav-link text-teal-400">
                Book Ride
              </Link>
              <Link href="/bookings" className="nav-link">
                My Rides
              </Link>
              <button className="btn-primary">
                <span className="relative z-10">Connect</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cyber-card">
            {step === 1 && renderLocationSelection()}
            {step === 2 && renderRideSelection()}
            {step === 3 && renderBookingConfirmation()}
          </div>
        </div>
      </main>

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