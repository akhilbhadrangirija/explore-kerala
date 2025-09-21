import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PackagesPageClient } from '../components/PackagesPageClient';

export const metadata = {
  title: "Kerala Travel Packages - Explore My Kerala | Best Tour Packages in God's Own Country",
  description: "Discover our curated Kerala travel packages including backwaters, hill stations, beaches, and cultural tours. Authentic experiences with local expertise. Book your perfect Kerala vacation today.",
  keywords: "Kerala travel packages, Kerala tours, backwater packages, Munnar packages, Kerala hill stations, Kerala beaches, cultural tours Kerala, Kerala vacation packages, God's Own Country tours",
  openGraph: {
    title: "Kerala Travel Packages - Explore My Kerala",
    description: "Discover our curated Kerala travel packages including backwaters, hill stations, beaches, and cultural tours with local expertise.",
    type: "website",
    locale: "en_US",
    siteName: "Explore My Kerala",
    images: [
      {
        url: "/kovalam.jpg",
        width: 1200,
        height: 630,
        alt: "Kerala Travel Packages - Explore My Kerala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kerala Travel Packages - Explore My Kerala",
    description: "Discover our curated Kerala travel packages with local expertise and authentic experiences.",
    images: ["/kovalam.jpg"],
  },
  alternates: {
    canonical: "https://exploremykerala.com/packages",
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

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PackagesPageClient />
      <Footer />
    </div>
  );
}