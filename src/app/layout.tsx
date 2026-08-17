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
  description: "Elite 5-star Indian gastronomy sanctuary in Chennai. Ancient Hyderabadi spice alchemy slow-cooked in charcoal wood-fired clay handis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} scroll-smooth`}>
      <body className="bg-[#0A0A0C] text-gold-light antialiased selection:bg-saffron selection:text-[#0A0A0C]">
        {children}
      </body>
    </html>
  );
}
