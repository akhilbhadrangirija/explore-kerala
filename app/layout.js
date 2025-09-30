import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
        {/* Google Tag Manager (noscript) - first element inside body */}
        {process.env.NEXT_PUBLIC_GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}

        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID ? (
          <Script id="gtm" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){
                w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        ) : null}

        {/* Meta Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1100037448943966');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tibjkpgbvc");
          `}
        </Script>

        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src="https://www.facebook.com/tr?id=1100037448943966&ev=PageView&noscript=1"
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
          />
        </noscript>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
