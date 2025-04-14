"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"profile" | "payments" | "preferences">("profile");

  // Mock user data
  const userData = {
    name: "Raj Kumar",
    email: "raj.kumar@example.com",
    phone: "+91 98765 43210",
    profileImage: "/profile-avatar.jpg", // Would be in public folder
    memberSince: "March 2023",
    savedAddresses: [
      { id: 1, name: "Home", address: "123 Anna Nagar East, Chennai 600102" },
      { id: 2, name: "Work", address: "Tech Park Tower B, Guindy, Chennai 600032" },
      { id: 3, name: "Gym", address: "Fitness Center, T Nagar, Chennai 600017" }
    ],
    stats: {
      totalRides: 27,
      totalSpent: 7820,
      favoriteVehicle: "Cab",
      savedCarbon: "84kg"
    },
    paymentMethods: [
      { id: 1, type: "credit", name: "HDFC Credit Card", last4: "4242", default: true },
      { id: 2, type: "upi", name: "Google Pay", last4: "raj@upi", default: false }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navbar activePage="profile" />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="md:col-span-1">
              <div className="cyber-card mb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 bg-teal-900/30 rounded-full flex items-center justify-center mb-4 border-2 border-teal-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-teal-300">{userData.name}</h2>
                  <p className="text-gray-400 mb-2">{userData.email}</p>
                  <p className="text-gray-400 text-sm">Member since {userData.memberSince}</p>
                </div>
                
                <div className="mt-6 border-t border-gray-700/20 pt-4">
                  <div className="flex flex-col space-y-2">
                    <button 
                      className={`text-left px-4 py-2 rounded-md transition-colors ${activeTab === "profile" ? "bg-teal-900/30 text-teal-300" : "text-gray-400 hover:bg-gray-800/30"}`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </span>
                    </button>
                    <button 
                      className={`text-left px-4 py-2 rounded-md transition-colors ${activeTab === "payments" ? "bg-teal-900/30 text-teal-300" : "text-gray-400 hover:bg-gray-800/30"}`}
                      onClick={() => setActiveTab("payments")}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Methods
                      </span>
                    </button>
                    <button 
                      className={`text-left px-4 py-2 rounded-md transition-colors ${activeTab === "preferences" ? "bg-teal-900/30 text-teal-300" : "text-gray-400 hover:bg-gray-800/30"}`}
                      onClick={() => setActiveTab("preferences")}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Preferences
                      </span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-700/20 pt-4">
                  <Link href="/" className="text-left px-4 py-2 rounded-md text-red-400 hover:bg-red-900/20 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              {activeTab === "profile" && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="cyber-card p-4">
                      <div className="text-sm text-teal-300/70 mb-1">Total Rides</div>
                      <div className="text-2xl font-bold text-teal-300">{userData.stats.totalRides}</div>
                    </div>
                    <div className="cyber-card p-4">
                      <div className="text-sm text-teal-300/70 mb-1">Total Spent</div>
                      <div className="text-2xl font-bold text-teal-300">₹{userData.stats.totalSpent}</div>
                    </div>
                    <div className="cyber-card p-4">
                      <div className="text-sm text-teal-300/70 mb-1">Favorite Ride</div>
                      <div className="text-2xl font-bold text-teal-300">{userData.stats.favoriteVehicle}</div>
                    </div>
                    <div className="cyber-card p-4">
                      <div className="text-sm text-teal-300/70 mb-1">Carbon Saved</div>
                      <div className="text-2xl font-bold text-teal-300">{userData.stats.savedCarbon}</div>
                    </div>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="cyber-card mb-8">
                    <h2 className="text-xl font-bold mb-4">Profile Details</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-teal-300/70 mb-1">Full Name</label>
                          <input 
                            type="text"
                            className="cyber-input w-full"
                            value={userData.name}
                            readOnly
                            aria-label="Full Name"
                            id="fullName"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-teal-300/70 mb-1">Email</label>
                          <input 
                            type="email"
                            className="cyber-input w-full"
                            value={userData.email}
                            readOnly
                            aria-label="Email"
                            id="email"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-teal-300/70 mb-1">Phone Number</label>
                        <input 
                          type="tel"
                          className="cyber-input w-full"
                          value={userData.phone}
                          readOnly
                          aria-label="Phone Number"
                          id="phone"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button className="btn-primary py-2 px-4">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                  
                  {/* Saved Addresses */}
                  <div className="cyber-card">
                    <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>
                    <div className="space-y-4">
                      {userData.savedAddresses.map(address => (
                        <div 
                          key={address.id}
                          className="p-4 border border-gray-700/20 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <div className="font-bold text-teal-300">{address.name}</div>
                            <div className="text-gray-400 text-sm">{address.address}</div>
                          </div>
                          <button 
                            className="text-teal-400 hover:text-teal-300 p-2"
                            aria-label="Edit address"
                            title="Edit address"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <button className="btn-secondary py-2 px-4">
                        Add New Address
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === "payments" && (
                <div className="cyber-card">
                  <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
                  <div className="space-y-4">
                    {userData.paymentMethods.map(method => (
                      <div 
                        key={method.id}
                        className="p-4 border border-gray-700/20 rounded-lg flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          {method.type === "credit" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                          <div>
                            <div className="font-bold text-teal-300">{method.name}</div>
                            <div className="text-gray-400 text-sm">
                              {method.type === "credit" ? `•••• ${method.last4}` : method.last4}
                              {method.default && <span className="ml-2 text-teal-500">Default</span>}
                            </div>
                          </div>
                        </div>
                        <button 
                          className="text-teal-400 hover:text-teal-300 p-2"
                          aria-label="Remove payment method"
                          title="Remove payment method"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button className="btn-primary py-2 px-4">
                      Add Payment Method
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === "preferences" && (
                <div className="cyber-card">
                  <h2 className="text-xl font-bold mb-4">Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor="emailNotifications" className="text-gray-300">Email Notifications</label>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              id="emailNotifications" 
                              name="emailNotifications"
                              className="sr-only" 
                              defaultChecked 
                            />
                            <div className="block bg-gray-600 w-12 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-teal-400 w-4 h-4 rounded-full transition transform translate-x-6"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="smsNotifications" className="text-gray-300">SMS Notifications</label>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              id="smsNotifications" 
                              name="smsNotifications"
                              className="sr-only" 
                              defaultChecked 
                            />
                            <div className="block bg-gray-600 w-12 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-teal-400 w-4 h-4 rounded-full transition transform translate-x-6"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="pushNotifications" className="text-gray-300">Push Notifications</label>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              id="pushNotifications" 
                              name="pushNotifications"
                              className="sr-only" 
                              defaultChecked 
                            />
                            <div className="block bg-gray-600 w-12 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-teal-400 w-4 h-4 rounded-full transition transform translate-x-6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Ride Preferences</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-teal-300/70 mb-1">Preferred Vehicle Type</label>
                          <select 
                            className="cyber-input w-full"
                            aria-label="Preferred Vehicle Type"
                            id="vehicleType"
                          >
                            <option>No Preference</option>
                            <option>Cab</option>
                            <option>Auto</option>
                            <option>Bike</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="premiumRides" className="text-gray-300">Prefer Premium Rides</label>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              id="premiumRides"
                              name="premiumRides"
                            />
                            <div className="block bg-gray-600 w-12 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-teal-400 w-4 h-4 rounded-full transition"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">App Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor="darkMode" className="text-gray-300">Dark Mode</label>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              id="darkMode" 
                              name="darkMode"
                              className="sr-only" 
                              defaultChecked 
                            />
                            <div className="block bg-gray-600 w-12 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-teal-400 w-4 h-4 rounded-full transition transform translate-x-6"></div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-teal-300/70 mb-1">Language</label>
                          <select 
                            className="cyber-input w-full"
                            aria-label="Language"
                            id="language"
                          >
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Tamil</option>
                            <option>Telugu</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="btn-primary py-2 px-4">
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
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