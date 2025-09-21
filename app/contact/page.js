import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ContactPageClient } from '../components/ContactPageClient';

export const metadata = {
  title: "Contact Us - Explore My Kerala | Get in Touch for Your Kerala Adventure",
  description: "Contact Explore My Kerala for your dream Kerala vacation. Get instant responses via WhatsApp, email, or phone. We're here to help plan your perfect God's Own Country experience.",
  keywords: "contact Explore My Kerala, Kerala travel inquiry, WhatsApp booking, Kerala tour consultation, travel planning help, Kerala vacation planning",
  openGraph: {
    title: "Contact Explore My Kerala - Plan Your Kerala Adventure",
    description: "Get in touch with our local experts to plan your perfect Kerala vacation. Instant WhatsApp support available.",
    type: "website",
    locale: "en_US",
    siteName: "Explore My Kerala",
    images: [
      {
        url: "/alapuzha.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Explore My Kerala - Plan Your Kerala Adventure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Explore My Kerala - Plan Your Kerala Adventure",
    description: "Get in touch with our local experts to plan your perfect Kerala vacation.",
    images: ["/alapuzha.jpg"],
  },
  alternates: {
    canonical: "https://exploremykerala.com/contact",
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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ContactPageClient />
      <Footer />
    </div>
  );
}