'use client';

import Link from 'next/link';
import { useAuthStore } from './store/authStore';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-blue-600">Travel Booking</h1>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/bookings" className="text-gray-600 hover:text-blue-600">
                  My Bookings
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                  Profile
                </Link>
                <button className="text-gray-600 hover:text-blue-600">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Discover Your Next Adventure</h2>
        <p className="text-xl text-gray-600 mb-8">
          Book tours, flights, and accommodations all in one place
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/tours"
            className="btn-primary p-4 rounded-lg text-center block"
          >
            Search Tours
          </Link>
          <Link
            href="/flights"
            className="btn-primary p-4 rounded-lg text-center block"
          >
            Search Flights
          </Link>
          <Link
            href="/accommodations"
            className="btn-primary p-4 rounded-lg text-center block"
          >
            Search Hotels
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-blue-50 py-16">
        <div className="container">
          <h3 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <h4 className="font-bold mb-2">Easy Booking</h4>
              <p className="text-gray-600">
                Intuitive interface for quick and easy bookings
              </p>
            </div>
            <div className="card">
              <h4 className="font-bold mb-2">Secure Payments</h4>
              <p className="text-gray-600">
                PCI DSS compliant payments with Stripe
              </p>
            </div>
            <div className="card">
              <h4 className="font-bold mb-2">Best Prices</h4>
              <p className="text-gray-600">
                Real-time pricing from multiple providers
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
