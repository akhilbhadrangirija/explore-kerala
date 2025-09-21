import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePageClient } from './components/HomePageClient';


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HomePageClient />
      <Footer />
    </div>
  );
}
