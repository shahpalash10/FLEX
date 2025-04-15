"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavbarProps {
  activePage?: 'trip-planner' | 'transport-map' | 'rides' | 'bookings' | 'profile';
}

export default function Navbar({ activePage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // If activePage is not provided, derive it from the pathname
  const currentPage = activePage || 
    pathname === "/trip-planner" ? "trip-planner" :
    pathname === "/transport-map" ? "transport-map" :
    pathname === "/rides" ? "rides" :
    pathname === "/bookings" ? "bookings" :
    pathname === "/profile" ? "profile" : undefined;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div 
                className="h-8 w-8 bg-gradient-to-br from-teal-500 to-purple-600 rounded-md flex items-center justify-center neon-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              <span className="text-teal-400 text-2xl font-bold neon-text tracking-wider">FLEX</span>
            </Link>
          </div>
          <div className="md:hidden">
            <motion.button 
              className="p-2 text-teal-400 focus:outline-none" 
              aria-label="Toggle mobile menu"
              onClick={toggleMobileMenu}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/trip-planner">
              <motion.div 
                className={`nav-link ${currentPage === 'trip-planner' ? 'text-teal-400' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Plan Route
              </motion.div>
            </Link>
            <Link href="/transport-map">
              <motion.div 
                className={`nav-link ${currentPage === 'transport-map' ? 'text-teal-400' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Live Transit
              </motion.div>
            </Link>
            <Link href="/rides">
              <motion.div 
                className={`nav-link ${currentPage === 'rides' ? 'text-teal-400' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Book Ride
              </motion.div>
            </Link>
            <Link href="/bookings">
              <motion.div 
                className={`nav-link ${currentPage === 'bookings' ? 'text-teal-400' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                My Rides
              </motion.div>
            </Link>
            <Link href="/profile">
              <motion.div 
                className={`btn-primary ${currentPage === 'profile' ? 'bg-teal-600' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Profile</span>
              </motion.div>
            </Link>
          </div>
        </div>
        
        {/* Mobile menu with animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 bg-gray-900/80 backdrop-blur-md rounded-lg p-4 border border-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-3">
                <Link href="/trip-planner" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div 
                    className={`block px-3 py-2 rounded-md ${currentPage === 'trip-planner' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    Plan Route
                  </motion.div>
                </Link>
                <Link href="/transport-map" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div 
                    className={`block px-3 py-2 rounded-md ${currentPage === 'transport-map' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    Live Transit
                  </motion.div>
                </Link>
                <Link href="/rides" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div 
                    className={`block px-3 py-2 rounded-md ${currentPage === 'rides' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    Book Ride
                  </motion.div>
                </Link>
                <Link href="/bookings" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div 
                    className={`block px-3 py-2 rounded-md ${currentPage === 'bookings' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    My Rides
                  </motion.div>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div 
                    className={`block px-3 py-2 rounded-md ${currentPage === 'profile' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    Profile
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
} 