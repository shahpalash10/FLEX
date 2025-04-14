"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Payment method options
const PAYMENT_METHODS = [
  { 
    id: "card", 
    name: "Credit/Debit Card", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    id: "upi", 
    name: "UPI Payment", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: "wallet", 
    name: "Digital Wallet", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    id: "cash", 
    name: "Cash on Ride", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
];

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [amount, setAmount] = useState(0);
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rideId, setRideId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Payment method, 2: Processing, 3: Success
  
  // Load data from query params
  useEffect(() => {
    const amountParam = searchParams.get("amount");
    const pickupParam = searchParams.get("pickup");
    const dropParam = searchParams.get("drop");
    const rideIdParam = searchParams.get("rideId");
    
    if (amountParam) setAmount(Number(amountParam));
    if (pickupParam) setPickup(pickupParam);
    if (dropParam) setDrop(dropParam);
    if (rideIdParam) setRideId(rideIdParam);
  }, [searchParams]);
  
  // Apply promo code
  const applyPromoCode = () => {
    // In a real app, this would validate the promo code on the server
    if (promoCode.toUpperCase() === "FLEX20") {
      const discountAmount = Math.round(amount * 0.2); // 20% discount
      setDiscount(discountAmount);
    } else if (promoCode.toUpperCase() === "NEWUSER") {
      const discountAmount = Math.min(50, amount); // Max ₹50 discount
      setDiscount(discountAmount);
    } else {
      alert("Invalid promo code");
    }
  };
  
  // Process payment
  const processPayment = () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    setStep(2);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 3000);
  };
  
  // View ride status
  const viewRideStatus = () => {
    router.push("/tracking");
  };

  // Render payment method selection
  const renderPaymentMethodSelection = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <div className="cyber-card mb-6">
        <h3 className="text-lg font-medium mb-4">Trip Summary</h3>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-teal-300/70">From</span>
            <span className="font-medium text-right">{pickup}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-teal-300/70">To</span>
            <span className="font-medium text-right">{drop}</span>
          </div>
          <div className="h-px bg-gradient-to-r from-teal-500/20 to-transparent my-2"></div>
          <div className="flex justify-between">
            <span className="text-teal-300/70">Fare</span>
            <span className="font-medium">₹{amount}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-purple-400">
              <span>Promo discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{amount - discount}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Apply Promo Code</h3>
        <div className="flex">
          <input 
            type="text" 
            className="cyber-input flex-grow"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button 
            className="btn-secondary ml-2 whitespace-nowrap"
            onClick={applyPromoCode}
            disabled={!promoCode}
          >
            Apply
          </button>
        </div>
        <div className="text-xs text-teal-300/70 mt-2">
          Try promo codes: FLEX20, NEWUSER
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <div 
              key={method.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedMethod === method.id 
                  ? 'border-teal-500 bg-teal-900/20 shadow-lg shadow-teal-500/10' 
                  : 'border-gray-800 hover:border-teal-500/50 bg-gray-900/50'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-900/30 border border-teal-500/30 flex items-center justify-center">
                  {method.icon}
                </div>
                <div className="ml-3 flex-grow">
                  <h3 className="font-medium">{method.name}</h3>
                </div>
                <div className="ml-2">
                  {selectedMethod === method.id && (
                    <div className="h-5 w-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="btn-primary w-full py-3"
        onClick={processPayment}
        disabled={!selectedMethod}
      >
        Pay ₹{amount - discount}
      </button>
    </div>
  );

  // Render payment processing
  const renderPaymentProcessing = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-bold mb-2 animate-pulse">Processing Payment</h2>
      <p className="text-teal-300/70 text-center">
        Please wait while we process your payment...
      </p>
    </div>
  );

  // Render payment success
  const renderPaymentSuccess = () => (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-900/30 border-2 border-teal-500 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-teal-300/70 mb-8">
        Your ride has been confirmed. A driver is on the way to pick you up.
      </p>
      
      <div className="cyber-card mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-teal-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Rahul S.</h3>
            <div className="flex items-center space-x-1 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span>4.8</span>
            </div>
          </div>
          <div className="flex-grow"></div>
          <div className="h-12 w-12 rounded-full bg-teal-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm">
            <span className="text-teal-300/70">Vehicle</span>
            <p className="font-medium">Toyota Innova • KA 01 AJ 1234</p>
          </div>
          <div className="text-sm text-right">
            <span className="text-teal-300/70">ETA</span>
            <p className="font-medium">3 mins</p>
          </div>
        </div>
        
        <div className="rounded-lg overflow-hidden h-2 bg-gray-700 mb-2">
          <div className="h-full bg-gradient-to-r from-teal-500 to-purple-500" style={{ width: "30%" }}></div>
        </div>
        <div className="flex justify-between text-xs text-teal-300/70">
          <span>Driver is on the way</span>
          <span>Arriving at pickup</span>
        </div>
      </div>
      
      <button 
        className="btn-primary w-full py-3 mb-3"
        onClick={viewRideStatus}
      >
        View Ride Status
      </button>
      
      <Link href="/rides" className="text-teal-400 hover:text-teal-300 text-sm">
        Book another ride
      </Link>
    </div>
  );

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
              <Link href="/rides" className="nav-link">
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
            {step === 1 && renderPaymentMethodSelection()}
            {step === 2 && renderPaymentProcessing()}
            {step === 3 && renderPaymentSuccess()}
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