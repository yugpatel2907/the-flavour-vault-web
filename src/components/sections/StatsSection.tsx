"use client";

import React from "react";
import StatsCounter from "@/components/ui/stats-counter";
import { Utensils, Users, Star, Award, Flame } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: Utensils,
      value: 50,
      suffix: "+",
      label: "AUTHENTIC SPECIALTIES",
      subtext: "Punjabi Sabji, Dum Biryani & Kebabs",
    },
    {
      icon: Users,
      value: 125,
      suffix: "K+",
      label: "SATISFIED DINERS",
      subtext: "Dine-in & Express Home Deliveries",
    },
    {
      icon: Star,
      value: 4.9,
      decimals: 1,
      suffix: " ★",
      label: "MICHELIN RATED",
      subtext: "Over 20,000+ Verified Reviews",
    },
    {
      icon: Award,
      value: 100,
      suffix: "%",
      label: "ORGANIC SPICE BLENDS",
      subtext: "Slow Roasted in Clay Handi Fires",
    },
  ];

  return (
    <section className="relative z-10 w-full py-16 px-4 sm:px-12 bg-[#0A0A0C]/90 border-y border-gold/20 backdrop-blur-xl select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#120F14]/90 p-6 rounded-2xl border border-gold/30 shadow-2xl hover:border-gold/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <Flame className="w-4 h-4 text-saffron/60 group-hover:text-saffron transition-colors" />
              </div>

              <div>
                <div className="font-serif text-4xl sm:text-5xl font-black text-gold-gradient tracking-tight mb-1">
                  <StatsCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                    duration={2}
                  />
                </div>
                <h4 className="font-serif text-xs font-bold tracking-[0.2em] text-gold-light uppercase mb-1">
                  {stat.label}
                </h4>
                <p className="text-[11px] text-gold-muted/80 font-sans">
                  {stat.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
