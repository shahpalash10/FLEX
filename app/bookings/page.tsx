import PageTransition from "@/components/PageTransition";
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Mock data for bookings
const MOCK_BOOKINGS = [
  {
    id: 1,
    from: "Anna Nagar",
    to: "Mount Road",
    date: "2023-07-15",
    time: "08:15",
    status: "completed",
    price: 350,
    transportTypes: ["cab"],
    journeyTime: "35 min",
    driver: "Rahul S.",
    vehicle: "Toyota Innova (White)"
  },
  {
    id: 2,
    from: "T Nagar",
    to: "Chennai Airport",
    date: "2023-08-05",
    time: "09:30",
    status: "upcoming",
    price: 420,
    transportTypes: ["cab"],
    journeyTime: "45 min",
    driver: "Priya M.",
    vehicle: "Hyundai Creta (Silver)"
  },
  {
    id: 3,
    from: "Velachery",
    to: "Central Station",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "14:00",
    status: "upcoming",
    price: 280,
    transportTypes: ["auto"],
    journeyTime: "30 min",
    driver: "Karthik R.",
    vehicle: "Auto Rickshaw (Yellow)"
  },
  {
    id: 4,
    from: "Adyar",
    to: "Besant Nagar",
    date: "2023-07-28",
    time: "10:45",
    status: "completed",
    price: 150,
    transportTypes: ["bike"],
    journeyTime: "15 min",
    driver: "Vikram S.",
    vehicle: "Bajaj Pulsar (Black)"
  },
  {
    id: 5,
    from: "Egmore",
    to: "Marina Beach",
    date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    status: "upcoming",
    price: 200,
    transportTypes: ["auto"],
    journeyTime: "25 min",
    driver: "Kumar P.",
    vehicle: "Auto Rickshaw (Yellow)"
  }
];

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  
  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => booking.status === activeTab);

  // Get transport icon
  const getTransportIcon = (type: string) => {
    switch (type) {
      case "cab":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 5v-5m-8 9h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case "auto":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case "bike":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Cancel booking handler
  const handleCancelRide = (id: number) => {
    if (window.confirm("Are you sure you want to cancel this ride?")) {
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: "completed" } : booking
      ));
      alert("Ride cancelled successfully");
    }
  };

  return (
    <PageTransition>
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
              <Link href="/bookings" className="nav-link text-teal-400">
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
          <h1 className="text-3xl font-bold mb-8">My Rides</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700/20 mb-8">
            <button
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === "upcoming"
                  ? "border-b-2 border-teal-500 text-teal-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Rides
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === "completed"
                  ? "border-b-2 border-teal-500 text-teal-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Past Rides
            </button>
          </div>
          
          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="cyber-card py-16">
              <p className="text-center text-gray-400">
                {activeTab === "upcoming" 
                  ? "You don't have any upcoming rides." 
                  : "You don't have any past rides."}
              </p>
              {activeTab === "upcoming" && (
                <div className="mt-4 text-center">
                  <Link href="/rides" className="btn-primary inline-block">
                    Book a Ride
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="cyber-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-teal-300">
                        {booking.from} to {booking.to}
                      </h2>
                      <p className="text-gray-400">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.transportTypes.map((type, index) => (
                        <div key={`${booking.id}-${type}-${index}`} className="flex items-center justify-center">
                          {getTransportIcon(type)}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-teal-300/70">Journey Time</div>
                      <div className="font-medium">{booking.journeyTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-teal-300/70">Price</div>
                      <div className="font-medium">₹{booking.price}</div>
                    </div>
                    <div>
                      <div className="text-sm text-teal-300/70">Driver</div>
                      <div className="font-medium">{booking.driver}</div>
                    </div>
                    <div>
                      <div className="text-sm text-teal-300/70">Vehicle</div>
                      <div className="font-medium">{booking.vehicle}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link href={`/tracking?rideId=${booking.id}`} className="btn-primary py-2.5">
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Track Ride
                      </span>
                    </Link>
                    {booking.status === "upcoming" && (
                      <button 
                        className="btn-secondary py-2.5"
                        onClick={() => handleCancelRide(booking.id)}
                      >
                        <span className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel Ride
                        </span>
                      </button>
                    )}
                    {booking.status === "completed" && (
                      <Link href={`/rides?repeat=${booking.id}`} className="btn-secondary py-2.5">
                        <span className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Book Again
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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