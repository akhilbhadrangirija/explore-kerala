'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroCarousel } from './components/HeroCarousel';
import { ItineraryCard } from './components/ItineraryCard';
import { MapPin, Star, Users, Shield, Loader2 } from 'lucide-react';
import { db } from './lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch featured packages (first 6 active packages)
    const q = query(
      collection(db, 'packages'),
      where('status', '==', 'active'),
      limit(6)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        // Sort by createdAt in descending order (newest first) and take first 6
        const sortedItems = items.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return bTime - aTime;
        }).slice(0, 6);
        setFeaturedPackages(sortedItems);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching featured packages:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {`Why Choose Explore My Kerala?`}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {`We provide authentic, memorable experiences that showcase the true beauty of God&apos;s Own Country.`}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-gray-600">Born and raised in Kerala, we know the hidden gems and authentic experiences.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handpicked accommodations and experiences that exceed expectations.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Small Groups</h3>
              <p className="text-gray-600">Intimate group sizes for personalized attention and authentic interactions.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">Fully insured tours with 24/7 support and safety protocols.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Travel Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {`Discover our carefully curated itineraries designed to showcase the best of Kerala&apos;s natural beauty and cultural heritage.`}
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading featured packages...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPackages.map((itinerary) => (
                  <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  href="/packages"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
                >
                  View All Packages
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore Kerala?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            {`Let us create the perfect Kerala experience for you. Contact us today to start planning your dream vacation.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919876543210?text=Hello, I'm interested in booking a Kerala tour package."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              WhatsApp Us Now
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Get Custom Quote
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
