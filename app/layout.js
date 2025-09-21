import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Explore My Kerala - Discover God's Own Country | Premium Travel Packages",
  description: "Experience the authentic beauty of Kerala with our curated travel packages. From serene backwaters to misty hill stations, discover the best of God's Own Country with local expertise and personalized service.",
  keywords: "Kerala tourism, travel packages, backwaters, Munnar, houseboats, Kerala tours, God's Own Country, authentic Kerala experience, local travel guide, Kerala vacation, sustainable tourism",
  authors: [{ name: "Explore My Kerala Team" }],
  creator: "Explore My Kerala",
  publisher: "Explore My Kerala",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://exploremykerala.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://exploremykerala.com',
    siteName: 'Explore My Kerala',
    title: "Explore My Kerala - Discover God's Own Country",
    description: "Experience the authentic beauty of Kerala with our curated travel packages. From serene backwaters to misty hill stations, discover the best of God's Own Country.",
    images: [
      {
        url: '/metaimage.jpg',
        width: 1200,
        height: 630,
        alt: 'Kerala Backwaters - Explore My Kerala',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@exploremykerala',
    creator: '@exploremykerala',
    title: "Explore My Kerala - Discover God's Own Country",
    description: "Experience the authentic beauty of Kerala with our curated travel packages.",
    images: ['/metaimage.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
