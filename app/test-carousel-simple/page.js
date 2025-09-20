'use client';

import { HeroCarousel } from '../components/HeroCarousel';

export default function TestCarouselSimple() {
  return (
    <div className="min-h-screen">
      <div className="bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-2">Hero Carousel Test</h1>
        <p className="text-gray-600">Testing the recreated hero carousel component</p>
      </div>
      <HeroCarousel />
      <div className="bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Images should auto-rotate every 5 seconds</li>
          <li>• Use arrow buttons to navigate manually</li>
          <li>• Click dots at bottom to jump to specific slides</li>
          <li>• Check browser console for any errors</li>
        </ul>
      </div>
    </div>
  );
}
