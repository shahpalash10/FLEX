import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  activePage?: 'trip-planner' | 'transport-map' | 'rides' | 'bookings' | 'profile';
}

export default function Navbar({ activePage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
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
            <Link href="/trip-planner" className={`nav-link ${activePage === 'trip-planner' ? 'text-teal-400' : ''}`}>
              Plan Route
            </Link>
            <Link href="/transport-map" className={`nav-link ${activePage === 'transport-map' ? 'text-teal-400' : ''}`}>
              Live Transit
            </Link>
            <Link href="/rides" className={`nav-link ${activePage === 'rides' ? 'text-teal-400' : ''}`}>
              Book Ride
            </Link>
            <Link href="/bookings" className={`nav-link ${activePage === 'bookings' ? 'text-teal-400' : ''}`}>
              My Rides
            </Link>
            <Link href="/profile" className={`btn-primary ${activePage === 'profile' ? 'bg-teal-600' : ''}`}>
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
                className={`block px-3 py-2 rounded-md ${activePage === 'trip-planner' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Plan Route
              </Link>
              <Link 
                href="/transport-map" 
                className={`block px-3 py-2 rounded-md ${activePage === 'transport-map' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Live Transit
              </Link>
              <Link 
                href="/rides" 
                className={`block px-3 py-2 rounded-md ${activePage === 'rides' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Ride
              </Link>
              <Link 
                href="/bookings" 
                className={`block px-3 py-2 rounded-md ${activePage === 'bookings' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Rides
              </Link>
              <Link 
                href="/profile" 
                className={`block px-3 py-2 rounded-md ${activePage === 'profile' ? 'bg-teal-900/50 text-teal-400' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 