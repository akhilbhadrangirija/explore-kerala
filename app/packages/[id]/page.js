import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PackageDetailClient } from '../../components/PackageDetailClient';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  
  try {
    if (!resolvedParams?.id) {
      return {
        title: "Package Not Found - Explore My Kerala",
        description: "The requested travel package could not be found.",
      };
    }

    const packageRef = doc(db, 'packages', resolvedParams.id);
    const packageSnap = await getDoc(packageRef);

    if (!packageSnap.exists()) {
      return {
        title: "Package Not Found - Explore My Kerala",
        description: "The requested travel package could not be found.",
      };
    }

    const packageData = packageSnap.data();
    const title = `${packageData.title} - Kerala Travel Package | Explore My Kerala`;
    const description = packageData.description || packageData.fullDescription || `Experience ${packageData.title} in Kerala with our expertly crafted travel package.`;

    return {
      title,
      description,
      keywords: `${packageData.title}, Kerala travel package, ${packageData.location}, ${packageData.category}, Kerala tour, God's Own Country`,
      openGraph: {
        title: `${packageData.title} - Kerala Travel Package`,
        description: description,
        type: "website",
        locale: "en_US",
        siteName: "Explore My Kerala",
        images: [
          {
            url: packageData.image || packageData.mainImage || "/backwaters.jpg",
            width: 1200,
            height: 630,
            alt: `${packageData.title} - Kerala Travel Package`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${packageData.title} - Kerala Travel Package`,
        description: description,
        images: [packageData.image || packageData.mainImage || "/backwaters.jpg"],
      },
      alternates: {
        canonical: `https://exploremykerala.com/packages/${resolvedParams.id}`,
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
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Package Details - Explore My Kerala",
      description: "Discover this amazing Kerala travel package with Explore My Kerala.",
    };
  }
}

export default async function ItineraryDetailPage({ params }) {
  const resolvedParams = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PackageDetailClient packageId={resolvedParams.id} />
      <Footer />
    </div>
  );
}
