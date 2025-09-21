'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Users, Star, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ImageZoomModal } from '../../../components/ui/image-zoom-modal';

export default function ItineraryDetailPage({ params }) {
  const resolvedParams = React.use(params);
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        if (!resolvedParams?.id) {
          setError('Package ID not found');
          setIsLoading(false);
          return;
        }

        const packageRef = doc(db, 'packages', resolvedParams.id);
        const packageSnap = await getDoc(packageRef);

        if (!packageSnap.exists()) {
          setError('Package not found');
          setIsLoading(false);
          return;
        }

        const packageData = packageSnap.data();
        console.log('packageData', packageData);
        setItinerary({
          id: packageSnap.id,
          ...packageData
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to load package details');
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [resolvedParams?.id]);

  const handleWhatsAppClick = () => {
    if (!itinerary) return;
    const message = `Hello, I'm interested in booking the ${itinerary.title} package from Explore My Kerala.`;
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleImageIndexChange = (index) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading package details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Package not found'}</p>
            <Link 
              href="/packages"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Back to Packages
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/packages" 
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Packages
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src={itinerary.image || itinerary.mainImage || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
          alt={itinerary.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {itinerary.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
              {itinerary.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
              >
                Book Now on WhatsApp
              </button>
              <div className="bg-white bg-opacity-20 text-white px-8 py-3 rounded-lg text-lg font-semibold">
                {itinerary.price ? `₹${itinerary.price}` : 'Contact for Price'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Info */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold">{itinerary.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold">{itinerary.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Group Size</p>
                <p className="font-semibold">2-12 People</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Difficulty</p>
                <p className="font-semibold">Easy to Moderate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description & Highlights */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Description */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Experience</h2>
              <p className="text-lg text-gray-600 mb-6">{itinerary.fullDescription}</p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h3>
              <ul className="space-y-3">
                {(itinerary.highlights || []).map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Gallery */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Photo Gallery</h3>
              {(itinerary.images && itinerary.images.length > 0) || (itinerary.gallery && itinerary.gallery.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(itinerary.images || itinerary.gallery || []).map((image, index) => (
                    <div 
                      key={index} 
                      className="relative h-48 rounded-lg overflow-hidden group cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    >
                      <Image
                        src={image}
                        alt={`${itinerary.title} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white bg-opacity-90 rounded-full p-2">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No gallery images available for this package.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Itinerary */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Detailed Itinerary</h2>
          <div className="space-y-8">
            {(itinerary.itinerary || []).map((day) => (
              <div key={day.day} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                    {day.day}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{day.title}</h3>
                </div>
                <ul className="space-y-2">
                  {(day.activities || []).map((activity, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Clock className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Includes & Excludes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
              <ul className="space-y-3">
                {(itinerary.includes || []).map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Not Included</h3>
              <ul className="space-y-3">
                {(itinerary.excludes || []).map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="h-5 w-5 border-2 border-red-400 rounded-full mt-0.5 flex-shrink-0"></div>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book This Experience?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Contact us now to secure your spot and start planning your unforgettable Kerala adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleWhatsAppClick}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Book Now on WhatsApp
            </button>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Ask Questions
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        images={itinerary?.images || itinerary?.gallery || []}
        currentIndex={currentImageIndex}
        onIndexChange={handleImageIndexChange}
      />
    </div>
  );
}
