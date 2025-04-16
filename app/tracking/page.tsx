"use client";

import PageTransition from "../../components/PageTransition";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';

// Mock ride data
const RIDE_DATA = {
  id: "FLEX1234",
  driver: {
    name: "Rahul S.",
    phone: "+91 98765 43210",
    rating: 4.8,
    photo: "/driver-photo.jpg"
  },
  vehicle: {
    type: "Toyota Innova",
    color: "White",
    regNumber: "KA 01 AJ 1234"
  },
  ride: {
    pickup: "Anna Nagar",
    dropoff: "Mount Road",
    status: "in-progress", // "waiting", "in-progress", "completed"
    pickupTime: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes from now
    fare: 350,
    distance: 12.5,
    duration: 35
  },
  route: {
    // Simplified route points (would be more in a real app)
    points: [
      { lat: 13.0827, lng: 80.2707 }, // Chennai Central
      { lat: 13.0569, lng: 80.2425 }, // Anna Nagar
      { lat: 13.0543, lng: 80.2650 }, // In between
      { lat: 13.0660, lng: 80.2611 }, // Mount Road
    ],
    // Current driver position (updated in simulation)
    driverPosition: { lat: 13.0569, lng: 80.2425 },
    driverPositionIndex: 1, // Start at Anna Nagar (pickup)
    progress: 25 // Percentage of the route completed
  }
};

// Dynamically import the Map component to avoid SSR issues with Leaflet
const TrackingMapComponent = dynamic(() => import('../../components/TrackingMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-gray-900/50 backdrop-blur-sm animate-pulse flex items-center justify-center rounded-lg">
      <p className="text-teal-400/80">Loading map...</p>
    </div>
  )
});

function RideTrackingContent() {
  const [ride, setRide] = useState(RIDE_DATA);
  const [remainingTime, setRemainingTime] = useState("");
  const [isSimulating, setIsSimulating] = useState(true);
  
  // Format remaining time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const pickup = new Date(ride.ride.pickupTime);
      const diff = Math.max(0, Math.floor((pickup.getTime() - now.getTime()) / 1000));
      
      if (diff <= 0 && ride.ride.status === "waiting") {
        // Update status to in-progress when driver arrives
        setRide(prev => ({
          ...prev,
          ride: {
            ...prev.ride,
            status: "in-progress"
          }
        }));
      }
      
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [ride.ride.status, ride.ride.pickupTime]);
  
  // Simulate driver movement
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setRide(prev => {
        // If rider has arrived or ride is completed, don't update
        if (prev.route.progress >= 100 || prev.ride.status === "completed") {
          clearInterval(interval);
          return {
            ...prev,
            ride: {
              ...prev.ride,
              status: "completed"
            },
            route: {
              ...prev.route,
              progress: 100
            }
          };
        }
        
        // Move driver along the route
        const newProgress = Math.min(100, prev.route.progress + 2);
        const pointCount = prev.route.points.length;
        const pointIndex = Math.min(
          pointCount - 1, 
          Math.floor((newProgress / 100) * (pointCount - 1) + 1)
        );
        
        // Interpolate position between points for smoother movement
        const currentPoint = prev.route.points[pointIndex - 1];
        const nextPoint = prev.route.points[Math.min(pointCount - 1, pointIndex)];
        const fraction = (newProgress / 100) * (pointCount - 1) - (pointIndex - 1);
        
        const newPosition = {
          lat: currentPoint.lat + (nextPoint.lat - currentPoint.lat) * fraction,
          lng: currentPoint.lng + (nextPoint.lng - currentPoint.lng) * fraction
        };
        
        return {
          ...prev,
          route: {
            ...prev.route,
            driverPosition: newPosition,
            driverPositionIndex: pointIndex,
            progress: newProgress
          }
        };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isSimulating]);
  
  // Cancel ride
  const handleCancelRide = () => {
    if (window.confirm("Are you sure you want to cancel this ride?")) {
      // In a real app, this would send a cancellation request to the backend
      alert("Ride cancelled successfully");
      // Redirect to home
      window.location.href = "/";
    }
  };
  
  // Contact driver
  const handleContactDriver = () => {
    alert(`Calling driver: ${ride.driver.phone}`);
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
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Ride Status Card */}
          <div className="cyber-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Ride Status</h2>
              <div className="bg-teal-900/30 rounded-full px-3 py-1 text-teal-400 text-sm font-medium">
                {ride.ride.status === "waiting" && "Driver on the way"}
                {ride.ride.status === "in-progress" && "In Progress"}
                {ride.ride.status === "completed" && "Completed"}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm text-teal-300/70">From</div>
                <div className="font-medium">{ride.ride.pickup}</div>
              </div>
              <div className="flex-1 px-4">
                <div className="h-0.5 w-full bg-gray-800 relative">
                  <div 
                    className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-purple-500"
                    style={{ width: `${ride.route.progress}%` }}
                  ></div>
                  <div className="absolute -top-1.5 h-3 w-3 rounded-full bg-teal-500" style={{ left: '0%' }}></div>
                  <div 
                    className="absolute -top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 shadow-lg shadow-teal-500/50" 
                    style={{ left: `${ride.route.progress}%` }}
                  ></div>
                  <div className="absolute -top-1.5 right-0 h-3 w-3 rounded-full bg-purple-500"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-teal-300/70">To</div>
                <div className="font-medium">{ride.ride.dropoff}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-sm text-teal-300/70">Fare</div>
                <div className="font-medium">₹{ride.ride.fare}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-teal-300/70">Distance</div>
                <div className="font-medium">{ride.ride.distance} km</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-teal-300/70">Duration</div>
                <div className="font-medium">{ride.ride.duration} min</div>
              </div>
            </div>
            
            {ride.ride.status === "waiting" && (
              <div className="bg-teal-900/20 border border-teal-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-teal-300/70">Driver arriving in</div>
                    <div className="text-xl font-bold">{remainingTime}</div>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      className="p-3 bg-teal-900/30 rounded-full text-teal-400 hover:bg-teal-800/30"
                      onClick={handleContactDriver}
                      aria-label="Call driver"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button 
                      className="p-3 bg-red-900/30 rounded-full text-red-400 hover:bg-red-800/30"
                      onClick={handleCancelRide}
                      aria-label="Cancel ride"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Driver and Vehicle Card */}
          <div className="cyber-card mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-teal-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">{ride.driver.name}</h3>
                <div className="flex items-center space-x-1 text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span>{ride.driver.rating}</span>
                </div>
              </div>
              <div className="flex-grow"></div>
              <div className="h-16 w-16 rounded-full bg-teal-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 5v-5m-8 9h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-teal-300/70">Vehicle</div>
                <div className="font-medium">{ride.vehicle.type} • {ride.vehicle.color}</div>
              </div>
              <div>
                <div className="text-sm text-teal-300/70">Registration Number</div>
                <div className="font-medium">{ride.vehicle.regNumber}</div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button 
                className="btn-primary flex-1 py-2.5"
                onClick={handleContactDriver}
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Driver
                </span>
              </button>
              {ride.ride.status !== "completed" && (
                <button 
                  className="btn-secondary flex-1 py-2.5"
                  onClick={handleCancelRide}
                >
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Ride
                  </span>
                </button>
              )}
            </div>
          </div>
          
          {/* Map */}
          <div className="cyber-card overflow-hidden">
            <h3 className="text-lg font-bold mb-4">Live Tracking</h3>
            <div className="h-[300px] w-full relative rounded-lg overflow-hidden">
              <TrackingMapComponent 
                pickup={ride.route.points[1]}
                dropoff={ride.route.points[ride.route.points.length-1]}
                driverPosition={ride.route.driverPosition}
                routePoints={ride.route.points}
              />
            </div>
            
            <div className="mt-4 text-sm text-teal-300/70 text-center">
              {ride.ride.status === "waiting" && "Driver is on the way to pick you up"}
              {ride.ride.status === "in-progress" && "You are on your way to your destination"}
              {ride.ride.status === "completed" && "Ride completed! Thank you for using FLEX"}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 relative overflow-hidden mt-auto">
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

export default function RideTracking() {
  return (
    <PageTransition>
      <RideTrackingContent />
    </PageTransition>
  );
} 