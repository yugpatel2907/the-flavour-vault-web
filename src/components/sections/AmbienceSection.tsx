'use client';

import React, { useRef, useEffect } from 'react';
import { Eye, Sparkles, Compass } from 'lucide-react';

export default function AmbienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const galleryItems = [
    {
      title: 'ROYAL DINING SANCTUARY',
      subtitle: 'Terracotta & Midnight Gold Interiors',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'DUM-STYLE CLAY HANDI',
      subtitle: 'Slow Charcoal Wood Fire Cooking',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'GOLDEN HOUR COURTYARD',
      subtitle: 'Alfresco Desert Sunset Dining',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  return (
    <section id="ambience" ref={containerRef} className="relative z-10 w-full py-28 px-6 sm:px-12 bg-desert-card border-t border-sand/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-sand/20 mb-4">
              <Compass className="w-3.5 h-3.5 text-sand animate-pulse" />
              <span className="text-[11px] tracking-[0.35em] text-sand-muted uppercase font-serif">
                ATMOSPHERE & ARCHITECTURE
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-gold-gradient tracking-tight">
              THE DESERT MIRAGE
            </h2>
          </div>
          <p className="text-sand/70 text-sm max-w-md font-sans leading-relaxed">
            Step into a sanctuary where deep terracotta architecture meets shimmering midnight lighting and authentic Hyderabadi hospitality.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl glass-panel border-sand/10 aspect-[4/5] flex flex-col justify-end p-8 transition-transform duration-500 hover:-translate-y-2"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-desert-dark via-desert-dark/40 to-transparent" />

              {/* Card Content */}
              <div className="relative z-10">
                <span className="text-[10px] tracking-[0.3em] text-sand-muted uppercase font-serif block mb-2">
                  {item.subtitle}
                </span>
                <h3 className="font-serif text-2xl font-bold text-sand-light group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
