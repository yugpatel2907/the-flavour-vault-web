"use client";

import React, { useState } from "react";
import CylinderCarousel, { CylinderItem } from "@/components/ui/cylinder-carousel";
import { punjabiSabjiDishes } from "@/data/punjabiSabjiData";
import { useCart } from "@/context/CartContext";
import { Flame, CheckCircle2, ShoppingBag, Award } from "lucide-react";
import { audioSynthesizer } from "@/lib/audioSynthesizer";
import { useMenu } from "@/lib/useMenu";

export default function PunjabiSabjiCarouselSection() {
  const { addToCart } = useCart();
  const { menu, authoritative } = useMenu();
  const [activeDish, setActiveDish] = useState<CylinderItem>(punjabiSabjiDishes[0]);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const handleAddToCart = (dish: CylinderItem) => {
    // PostgreSQL uses numeric IDs. Resolve the existing carousel record to the
    // active menu so normal ordering and AI use the same authoritative identity.
    const item = menu.find(item => item.id === dish.id) ||
      menu.find(item => item.name === dish.name && item.price === dish.price);
    if (authoritative && !item) {
      setAddedToast('This dish is unavailable on the current menu.');
      setTimeout(() => setAddedToast(null), 2500);
      return;
    }
    audioSynthesizer.playSizzle();
    addToCart(item || {
      id: dish.id,
      name: dish.name,
      category: "curries-veg",
      price: dish.price,
      isVeg: dish.isVeg ?? true,
      spicyLevel: (dish.spicyLevel as 1 | 2 | 3) || 1,
      description: dish.description,
    });

    setAddedToast(dish.name);
    setTimeout(() => {
      setAddedToast(null);
    }, 2500);
  };

  return (
    <section id="punjabi-sabji" className="relative z-10 w-full min-h-screen py-20 px-4 sm:px-12 bg-[#0A0A0C]/95 border-t border-gold/20 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120F14]/90 border border-gold/30 mb-4 shadow-lg">
            <Award className="w-4 h-4 text-saffron" />
            <span className="text-[11px] tracking-[0.35em] text-gold-muted uppercase font-serif font-bold">
              MOST POPULAR DISH EXPERIENCE
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-gold-gradient tracking-tight uppercase">
            MOST SALEABLE & SIGNATURE DISHES
          </h2>

          <p className="mt-4 text-gold-light/80 text-sm sm:text-base font-sans leading-relaxed">
            Explore our highest-rated & most ordered Punjabi Sabjis, Biryanis, and Chef&apos;s Royal Specialities.
          </p>
        </div>

        {/* Added to Cart Notification Toast */}
        {addedToast && (
          <div className="fixed top-24 right-8 z-50 px-5 py-3 rounded-full bg-gradient-to-r from-[#120F14] to-[#1E1712] border border-gold/60 text-gold-light font-serif text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            <span>ADDED {addedToast} TO ORDER!</span>
          </div>
        )}

        {/* Carousel Component */}
        <div className="relative w-full my-6">
          <CylinderCarousel
            items={punjabiSabjiDishes}
            onSelectItem={(dish) => setActiveDish(dish)}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Detailed Dish Preview Bar */}
        {activeDish && (
          <div className="mt-8 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#120F14]/95 border border-gold/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 backdrop-blur-xl">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gold/30 flex-shrink-0 shadow-lg relative group">
                <img
                  src={activeDish.imageUrl}
                  alt={activeDish.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] tracking-widest uppercase font-serif font-bold text-gold">
                    {activeDish.category}
                  </span>
                  <span className="text-gold-muted">•</span>
                  <span className="text-xs text-gold-gradient font-bold">
                    ★ {activeDish.rating || 4.9}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-light">
                  {activeDish.name}
                </h3>
                <p className="text-xs text-gold-light/75 font-sans mt-1 max-w-xl line-clamp-2">
                  {activeDish.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-end">
              <div className="text-right mr-2">
                <div className="text-[10px] tracking-widest text-gold-muted uppercase font-serif">PRICE</div>
                <div className="font-serif text-2xl font-extrabold text-gold-gradient">₹{activeDish.price}</div>
              </div>

              <button
                onClick={() => handleAddToCart(activeDish)}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-saffron/30 border border-gold/50"
              >
                <ShoppingBag className="w-4 h-4 text-[#0A0A0C]" /> ADD TO ORDER
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
