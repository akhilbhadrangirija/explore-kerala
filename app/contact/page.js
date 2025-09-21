import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ContactPageClient } from '../components/ContactPageClient';

export const metadata = {
  title: "Contact Us - Explore My Kerala | Get in Touch for Your Kerala Adventure",
  description: "Contact Explore My Kerala for your dream Kerala vacation. Get instant responses via WhatsApp, email, or phone. We're here to help plan your perfect God's Own Country experience.",
  keywords: "contact Explore My Kerala, Kerala travel inquiry, WhatsApp booking, Kerala tour consultation, travel planning help, Kerala vacation planning",
 
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