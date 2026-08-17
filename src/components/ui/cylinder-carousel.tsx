"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Star, ChevronLeft, ChevronRight } from "lucide-react";

export interface CylinderItem {
  id: string;
  name: string;
  category?: string;
  price: number;
  rating?: number;
  spicyLevel?: number;
  description: string;
  imageUrl: string;
  isVeg?: boolean;
}

export interface CylinderCarouselProps {
  items: CylinderItem[];
  radius?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  onSelectItem?: (item: CylinderItem) => void;
  onAddToCart?: (item: CylinderItem) => void;
  onInspect3D?: (item: CylinderItem) => void;
  className?: string;
}

export function CylinderCarousel({
  items,
  onSelectItem,
  onAddToCart,
  className,
}: CylinderCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIdx);
    if (onSelectItem && items[nextIdx]) {
      onSelectItem(items[nextIdx]);
    }
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(prevIdx);
    if (onSelectItem && items[prevIdx]) {
      onSelectItem(items[prevIdx]);
    }
  };

  const handleSelect = (idx: number) => {
    setCurrentIndex(idx);
    if (onSelectItem && items[idx]) {
      onSelectItem(items[idx]);
    }
  };

  // Compute visible items indices for smooth 3-card layout (Prev, Active, Next)
  const getVisibleIndices = () => {
    const total = items.length;
    const prev = (currentIndex - 1 + total) % total;
    const next = (currentIndex + 1) % total;
    return [prev, currentIndex, next];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <div className={cn("relative w-full py-8 flex flex-col items-center select-none", className)}>
      {/* Cards Showcase Stage */}
      <div className="relative w-full max-w-5xl h-[420px] flex items-center justify-center gap-4 sm:gap-6 px-4">
        {visibleIndices.map((idx, position) => {
          const item = items[idx];
          if (!item) return null;

          const isActive = position === 1;
          const isLeft = position === 0;
          const isRight = position === 2;

          return (
            <motion.div
              key={item.id}
              onClick={() => handleSelect(idx)}
              initial={false}
              animate={{
                scale: isActive ? 1.05 : 0.88,
                opacity: isActive ? 1 : 0.6,
                x: isLeft ? -15 : isRight ? 15 : 0,
                zIndex: isActive ? 30 : 10,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={cn(
                "relative w-[280px] sm:w-[320px] h-[390px] rounded-2xl p-4 bg-[#120F14]/95 backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-2xl overflow-hidden group",
                isActive ? "border-gold ring-2 ring-gold/30 shadow-gold/20" : "border-gold/30 hover:border-gold/60"
              )}
            >
              {/* Dish Image */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3 border border-gold/30 shadow-md">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent opacity-80" />

                {/* Dietary badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#0A0A0C]/90 border border-gold/30 text-[10px] font-serif uppercase tracking-widest flex items-center gap-1.5 text-gold shadow-lg">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.isVeg ? "bg-emerald-400 shadow-[0_0_6px_#10b981]" : "bg-rose-500 shadow-[0_0_6px_#f43f5e]"
                    }`}
                  />
                  {item.isVeg ? "VEG" : "NON-VEG"}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-saffron to-gold text-[#0A0A0C] font-serif font-bold text-[10px] flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-[#0A0A0C] text-[#0A0A0C]" />
                  <span>{item.rating || 4.9}</span>
                </div>

                {/* Price tag */}
                <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-[#0A0A0C]/95 border border-gold/40 text-gold-gradient font-serif text-sm font-extrabold shadow-xl">
                  ₹{item.price}
                </div>
              </div>

              {/* Dish Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-gold-light line-clamp-1 group-hover:text-gold transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-[11px] text-gold-light/75 line-clamp-2 leading-relaxed font-sans mt-1">
                    {item.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-gold/20 flex items-center justify-between gap-2 mt-2">
                  <span className="text-[10px] font-serif tracking-wider uppercase text-gold font-bold">
                    {item.category || "SPECIALTY"}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) onAddToCart(item);
                    }}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-saffron/20"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" /> ADD TO ORDER
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex items-center gap-4 px-6 py-2.5 rounded-full bg-[#120F14]/90 border border-gold/40 shadow-2xl">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-[#1A1622] text-gold hover:text-white border border-gold/30 hover:border-gold transition-all shadow-lg"
          title="Previous Dish"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentIndex ? "w-6 bg-gold" : "w-2 bg-gold/30 hover:bg-gold/60"
              )}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-[#1A1622] text-gold hover:text-white border border-gold/30 hover:border-gold transition-all shadow-lg"
          title="Next Dish"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default CylinderCarousel;
