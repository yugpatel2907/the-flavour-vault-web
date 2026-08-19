import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AMBROCIA'S | Royal Hyderabadi Dum Biryani & Luxury Cuisine",
  description:
    "Elite 5-star Indian gastronomy sanctuary in Chennai. Authentic Hyderabadi dum biryani, kebabs, tandoori & family buckets — order online or reserve a table.",
  keywords: [
    'biryani near me',
    'best biryani in Chennai',
    'order biryani online Chennai',
    'authentic Hyderabadi biryani',
    'bucket biryani delivery',
  ],
  openGraph: {
    title: "AMBROCIA'S | Royal Hyderabadi Dum Biryani",
    description:
      "Order authentic Hyderabadi dum biryani, kebabs & tandoori. Delivery & dine-in — Ambrocia's Restaurant, Chennai.",
    url: 'https://example.com',
    siteName: "Ambrocia's Restaurant",
    images: [
      {
        url: '/og-image.svg',
        alt: "Ambrocia's Signature Biryani",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: "AMBROCIA'S | Royal Hyderabadi Dum Biryani",
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} scroll-smooth`}>
      <body className="bg-[#0A0A0C] text-gold-light antialiased selection:bg-saffron selection:text-[#0A0A0C]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: "Ambrocia's Restaurant",
              description:
                "Ambrocia's — Authentic Hyderabadi Dum Biryani, kebabs, tandoori and family bucket biryanis. Delivery and dine-in available in Chennai.",
              telephone: ['+919444254893', '+918220580524'],
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Near VIT College, Opp To Life Cell Company, Kelakottiyur',
                addressLocality: 'Chennai',
                postalCode: '600102',
                addressRegion: 'TN',
                addressCountry: 'IN',
              },
              url: 'https://example.com',
              sameAs: ['https://www.facebook.com/ambrociasrestaurant'],
              hasMenu: { '@type': 'Menu', name: "Ambrocia's Menu", url: 'https://example.com/#cuisine' },
              servesCuisine: ['Hyderabadi', 'Indian', 'Mughlai'],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Menu',
              name: "Ambrocia's Menu",
              hasMenuItem: (() => {
                try {
                  const menu = require('../data/ambrociaMenu').ambrociaMenu;
                  return menu.slice(0, 200).map((it: any) => ({
                    '@type': 'MenuItem',
                    name: it.name,
                    description: it.description || undefined,
                    offers: {
                      '@type': 'Offer',
                      price: String(it.price || 0),
                      priceCurrency: 'INR',
                    },
                  }));
                } catch (e) {
                  return [];
                }
              })(),
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}