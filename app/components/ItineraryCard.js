'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Clock } from 'lucide-react';

export function ItineraryCard({ itinerary }) {
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello, I'm interested in booking the ${itinerary.title} package from Explore My Kerala.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <Link href={`/packages/${itinerary.id}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={itinerary.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
            alt={itinerary.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {itinerary.duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
            {itinerary.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {itinerary.description}
          </p>

          {/* Duration and Location */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{itinerary.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{itinerary.location}</span>
            </div>
          </div>

          {/* Price and Book Button */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">
              {itinerary.price ? `₹${itinerary.price}` : 'Contact Us'}
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
            >
              Book Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
