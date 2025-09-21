import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroCarousel } from './components/HeroCarousel';
import { ItineraryCard } from './components/ItineraryCard';
import { MapPin, Star, Users, Shield, Loader2 } from 'lucide-react';
import { db } from './lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { HomePageClient } from './components/HomePageClient';

export const metadata = {
  title: "Explore My Kerala - Discover God's Own Country | Premium Travel Packages",
  description: "Experience the authentic beauty of Kerala with our curated travel packages. From serene backwaters to misty hill stations, discover the best of God's Own Country with local expertise and personalized service.",
  keywords: "Kerala tourism, travel packages, backwaters, Munnar, houseboats, Kerala tours, God's Own Country, authentic Kerala experience, local travel guide, Kerala vacation",
  openGraph: {
    title: "Explore My Kerala - Discover God's Own Country",
    description: "Experience the authentic beauty of Kerala with our curated travel packages. From serene backwaters to misty hill stations, discover the best of God's Own Country.",
    type: "website",
    locale: "en_US",
    siteName: "Explore My Kerala",
    images: [
      {
        url: "/backwaters.jpg",
        width: 1200,
        height: 630,
        alt: "Kerala Backwaters - Explore My Kerala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore My Kerala - Discover God's Own Country",
    description: "Experience the authentic beauty of Kerala with our curated travel packages.",
    images: ["/backwaters.jpg"],
  },
  alternates: {
    canonical: "https://exploremykerala.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HomePageClient />
      <Footer />
    </div>
  );
}
