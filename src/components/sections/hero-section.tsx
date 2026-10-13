'use client';

import React from 'react';
import MagneticButton from '@/components/ui/magnetic-button';
import SpotlightNavbar from '@/components/ui/spotlight-navbar';
import { ArrowDown, Flame, Sparkles, Compass, Star, Bot, Clock } from 'lucide-react';

interface HeroSectionProps {
  onOpenAI: () => void;
  onOpenTracker: () => void;
}

export default function HeroSection({ onOpenAI, onOpenTracker }: HeroSectionProps) {
  return (
    <section id="home" className="relative z-10 w-full min-h-screen flex flex-col justify-between p-4 sm:p-8 md:p-12 overflow-hidden select-none">
      
      {/* Upper Navigation Header */}
      <header className="relative z-20 w-full flex flex-wrap justify-between items-center gap-4">
        {/* Crisp Luxury Brand Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-[#120F14]/90 shadow-xl shadow-black/80 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-gold animate-spin-slow" />
          </div>
          <div className="font-serif text-xl tracking-[0.25em] text-gold-gradient font-black uppercase">
            AMBROCIA&apos;S
          </div>
        </div>

        {/* Vengeance UI Spotlight Navbar in Header */}
        <SpotlightNavbar
          items={[
            { label: "Home", href: "#home" },
            { label: "Most Saleable", href: "#punjabi-sabji" },
            { label: "Menu Vault", href: "#cuisine" },
            { label: "Ambience", href: "#ambience" },
            { label: "Reserve", href: "#reservations" },
          ]}
          className="hidden lg:flex"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTracker}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#120F14]/80 text-[11px] font-serif uppercase tracking-wider text-gold-muted hover:text-gold transition-colors border border-gold/30 shadow-lg"
          >
            <Clock className="w-3.5 h-3.5 text-saffron" /> TRACKING DEMO
          </button>

          <MagneticButton>
            <button
              onClick={onOpenAI}
              className="px-5 py-2.5 rounded-full text-xs tracking-[0.15em] font-serif uppercase bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] hover:scale-105 transition-all duration-300 active:scale-95 shadow-2xl shadow-saffron/30 font-bold flex items-center gap-2 border border-gold/50"
            >
              <Bot className="w-4 h-4 text-[#0A0A0C]" /> FLAVOUR AI
            </button>
          </MagneticButton>
        </div>
      </header>

      {/* Hero Body Content */}
      <div className="my-auto py-12 flex flex-col items-center text-center max-w-5xl mx-auto w-full">
        
        {/* 5-Star Subheading Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#120F14]/90 border border-gold/40 mb-6 shadow-2xl">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
            ))}
          </div>
          <span className="text-[11px] sm:text-xs tracking-[0.35em] text-gold-light uppercase font-serif font-bold">
            5-STAR MICHELIN RATED HYDERABADI GASTRONOMY
          </span>
        </div>

        {/* Crisp Liquid Gold Shimmer Hero Title "AMBROCIA'S" */}
        <div className="relative group my-2 cursor-pointer">
          {/* Ambient Glow behind title */}
          <div className="absolute inset-0 bg-radial-gradient from-saffron/20 via-gold/10 to-transparent blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
          
          <h1 className="relative font-serif text-4xl sm:text-6xl lg:text-[5rem] xl:text-[7rem] font-black leading-none tracking-tight text-gold-gradient filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.95)] hover:scale-[1.02] transition-transform duration-500">
            AMBROCIA&apos;S — Authentic Hyderabadi Biryani in Chennai
          </h1>
        </div>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-lg max-w-2xl text-gold-light/90 font-sans tracking-wide leading-relaxed">
          Order authentic Hyderabadi dum biryani, kebabs and tandoori — handcrafted in charcoal wood-fired clay handis. Delivery & dine-in across Chennai, quick bucket biryani for parties.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-5">
          <MagneticButton strength={0.4}>
            <a
              href="#cuisine"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs tracking-[0.25em] uppercase font-bold hover:shadow-2xl hover:shadow-saffron/40 transition-all duration-300 block shadow-xl border border-gold/40"
            >
              EXPLORE FLAVOUR VAULT
            </a>
          </MagneticButton>
          
          <MagneticButton strength={0.3}>
            <button
              onClick={onOpenAI}
              className="px-8 py-4 rounded-full bg-[#120F14]/90 text-gold-light font-serif text-xs tracking-[0.25em] uppercase hover:border-gold transition-all duration-300 flex items-center gap-2 border border-gold/40 shadow-xl"
            >
              <Sparkles className="w-4 h-4 text-gold" /> ASK FLAVOUR AI
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* Hero Footer Indicator */}
      <div className="w-full flex justify-between items-end">
        <div className="hidden sm:block text-[11px] tracking-[0.25em] text-gold-muted/80 font-serif uppercase">
          EST. 2014 <br />
          CHENNAI • HYDERABAD
        </div>

        <div className="flex flex-col items-center gap-2 mx-auto sm:mx-0">
          <span className="text-[10px] tracking-[0.3em] text-gold-muted/90 uppercase font-sans font-semibold">
            SCROLL TO IMMERSE
          </span>
          <div className="w-8 h-12 rounded-full border border-gold/40 flex items-center justify-center p-1 bg-[#120F14]/80 shadow-lg">
            <ArrowDown className="w-4 h-4 text-gold animate-bounce" />
          </div>
        </div>

        <div className="hidden sm:block text-[11px] tracking-[0.25em] text-gold-muted/80 font-serif uppercase text-right">
          AUTHENTIC HYDERABADI DUM <br />
          DAILY 11:30 — 23:00
        </div>
      </div>
    </section>
  );
}
