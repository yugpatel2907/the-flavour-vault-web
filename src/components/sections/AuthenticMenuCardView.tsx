"use client";

import React from "react";
import { Phone, MapPin, Star } from "lucide-react";

export default function AuthenticMenuCardView() {
  return (
    <div className="w-full max-w-7xl mx-auto my-8 p-4 sm:p-8 bg-[#120F14]/95 border-2 border-gold/40 rounded-3xl shadow-2xl relative text-gold-light font-sans backdrop-blur-xl">
      <div className="text-center mb-8 pb-6 border-b border-gold/30">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#0A0A0C]/80 border border-gold/40 mb-3 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
          <span className="font-serif text-xs tracking-[0.3em] uppercase text-gold font-bold">
            5-STAR OFFICIAL PRINTED MENU BOARD
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-gold-gradient tracking-tight uppercase">
          AMBROCIA&apos;S RESTAURANT MENU
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-gold/40 bg-[#0A0A0C] shadow-2xl">
        <img
          src="/menu.png"
          alt="Ambrocia's Restaurant menu"
          className="w-full h-auto object-contain block"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-saffron via-saffron-light to-gold px-4 py-3 text-[#0A0A0C] shadow-xl border border-gold/50">
        <Phone className="w-4 h-4" />
        <span className="font-serif text-sm sm:text-base font-extrabold uppercase tracking-wider">
          FOR DELIVERY CONTACT: 9444254893 / 8220580524
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif text-gold-muted">
        <div className="p-4 rounded-xl bg-[#0A0A0C]/80 border border-gold/30 flex flex-col gap-1.5">
          <div className="font-bold text-gold text-sm uppercase flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-saffron" /> Ambrocia&apos;s Restaurant (Main Branch)
          </div>
          <div>Near VIT College, Opp To. Life Cell Company, Kelakottiyur, Chennai - 600 102</div>
          <div className="flex items-center gap-3 text-gold-light mt-1">
            <span>📞 +91 94442 54893 / 82205 80524</span>
            <span>✉️ ambrocias@outlook.com</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0C]/80 border border-gold/30 flex flex-col gap-1.5">
          <div className="font-bold text-gold text-sm uppercase flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-saffron" /> Branch: Bharath University
          </div>
          <div>No.46, Ranganathan Nagar, Agaram Main Road, Selaiyur, Chennai</div>
          <div className="flex items-center gap-3 text-gold-light mt-1">
            <span>📞 +91 94983 98203 / +91 73959 43129</span>
          </div>
        </div>
      </div>
    </div>
  );
}
