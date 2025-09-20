'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroImages = [
  {
    id: 1,
    src: '/backwaters.jpg',
    alt: 'Kerala Backwaters',
    title: 'Kerala Backwaters',
    subtitle: 'Experience the serene beauty of Kerala\'s backwaters'
  },
  {
    id: 2,
    src: '/munnar.jpg',
    alt: 'Munnar Tea Gardens',
    title: 'Munnar Tea Gardens',
    subtitle: 'Discover the rolling hills and tea plantations'
  },
  {
    id: 3,
    src: '/kovalam.jpg',
    alt: 'Kovalam Beach',
    title: 'Kovalam Beach',
    subtitle: 'Relax on the pristine beaches of Kerala'
  },
  {
    id: 4,
    src: '/alapuzha.jpg',
    alt: 'Alappuzha Houseboats',
    title: 'Alappuzha Houseboats',
    subtitle: 'Cruise through the famous backwaters'
  },
  {
    id: 5,
    src: '/athirapilly.jpg',
    alt: 'Athirappilly Falls',
    title: 'Athirappilly Falls',
    subtitle: 'Witness the majestic waterfalls of Kerala'
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Auto-advance slides every 5 seconds
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentImage = heroImages[currentSlide];

  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {/* Main Image Container */}
      <div className="relative w-full h-full">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url(${currentImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              {currentImage.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 drop-shadow-lg">
              {currentImage.subtitle}
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg">
              Explore Now
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-black p-3 rounded-full transition-all duration-200 z-20"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-black p-3 rounded-full transition-all duration-200 z-20"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-white scale-110'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-30">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading images...</p>
          </div>
        </div>
      )}
    </section>
  );
}