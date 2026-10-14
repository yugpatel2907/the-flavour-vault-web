'use client';

import React, { useState } from 'react';
import AuthenticBackground from '@/components/ui/AuthenticBackground';
import Preloader from '@/components/ui/Preloader';
import HeroSection from '@/components/sections/hero-section';
import StatsSection from '@/components/sections/StatsSection';
import PunjabiSabjiCarouselSection from '@/components/sections/PunjabiSabjiCarouselSection';
import MenuSection from '@/components/sections/MenuSection';
import AmbienceSection from '@/components/sections/AmbienceSection';
import FooterReservation from '@/components/sections/FooterReservation';
import CartDrawer from '@/components/ui/CartDrawer';
import AIRecommender from '@/components/ui/ai-recommender';
import OrderTracker from '@/components/ui/order-tracker';
import SoundToggle from '@/components/ui/sound-toggle';
import { CartProvider, useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

function FloatingCartButton() {
  const { setIsCartOpen, totalItems } = useCart();
  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-8 right-8 z-40 px-6 py-3.5 rounded-full bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs tracking-widest uppercase font-bold shadow-2xl shadow-saffron/40 border border-gold/40 flex items-center gap-3 animate-bounce hover:scale-105 transition-all"
    >
      <ShoppingBag className="w-4 h-4 text-[#0A0A0C]" />
      <span>VIEW ORDER ({totalItems})</span>
    </button>
  );
}

export default function Home() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  return (
    <CartProvider>
      <main id="home" className="relative w-full min-h-screen bg-[#0A0A0C] text-gold-light selection:bg-saffron selection:text-[#0A0A0C] overflow-x-hidden">
        {/* Preloader */}
        <Preloader />

        {/* Authentic 5-Star Royal Background */}
        <AuthenticBackground />

        {/* 1. Hero Section */}
        <HeroSection
          onOpenAI={() => setIsAIOpen(true)}
          onOpenTracker={() => setIsTrackerOpen(true)}
        />

        {/* 2. Vengeance UI Stats Counter Section */}
        <StatsSection />

        {/* 3. Most Saleable Dishes Carousel Section */}
        <PunjabiSabjiCarouselSection />

        {/* 4. Menu Experience (Official Menu Board & Interactive Grid) */}
        <MenuSection />

        {/* 5. Ambience Section */}
        <AmbienceSection />

        {/* 6. Reservations & Footer */}
        <FooterReservation />

        {/* AI Culinary Recommender Modal */}
        <AIRecommender isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

        {/* Order Tracking Demo Modal */}
        <OrderTracker isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />

        {/* Ambient Sound FX Toggle */}
        <SoundToggle />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Floating Cart Launcher */}
        <FloatingCartButton />
      </main>
    </CartProvider>
  );
}

