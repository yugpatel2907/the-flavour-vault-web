"use client";

import React from "react";
import { ambrociaMenu, MenuItem } from "@/data/ambrociaMenu";
import { useCart } from "@/context/CartContext";
import { Phone, MapPin, Flame, Plus, Check, Star } from "lucide-react";
import { audioSynthesizer } from "@/lib/audioSynthesizer";

/** Standard Indian FSSAI Food Marker: Green Square + Green Dot for Veg, Red Square + Red Dot for Non-Veg */
function DietaryDot({ isVeg }: { isVeg?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] border flex-shrink-0 ${
        isVeg
          ? "border-emerald-500 bg-emerald-950/90"
          : "border-rose-600 bg-rose-950/90"
      }`}
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isVeg
            ? "bg-emerald-400 shadow-[0_0_6px_#10b981]"
            : "bg-rose-500 shadow-[0_0_6px_#f43f5e]"
        }`}
      />
    </span>
  );
}

export default function AuthenticMenuCardView() {
  const { addToCart } = useCart();
  const [addedItem, setAddedItem] = React.useState<string | null>(null);

  const handleAdd = (item: MenuItem) => {
    audioSynthesizer.playSizzle();
    addToCart(item);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const getCategoryItems = (catId: string) => {
    return ambrociaMenu.filter((i) => i.category === catId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-8 p-4 sm:p-8 bg-[#120F14]/95 border-2 border-gold/40 rounded-3xl shadow-2xl relative text-gold-light font-sans backdrop-blur-xl">
      
      {/* Menu Header Banner */}
      <div className="text-center mb-8 pb-6 border-b border-gold/30">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#0A0A0C]/80 border border-gold/40 mb-3 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
          <span className="font-serif text-xs tracking-[0.3em] uppercase text-gold font-bold">
            5-STAR OFFICIAL PRINTED MENU BOARD
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-gold-gradient tracking-tight uppercase">
          AMBROCIA'S RESTAURANT MENU
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gold-muted font-serif flex items-center justify-center gap-4">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <DietaryDot isVeg={true} /> GREEN DOT = VEGETARIAN
          </span>
          <span className="inline-flex items-center gap-1 text-rose-400">
            <DietaryDot isVeg={false} /> RED DOT = NON-VEGETARIAN
          </span>
        </p>
      </div>

      {/* 2-Board Printed Menu Grid (Equal Height Distribution Left & Right Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT BOARD: BIRYANI, BUCKET, CHINESE, VEG STARTERS, VEG KEBABS, VEG CURRIES */}
        <div className="border-2 border-gold/35 rounded-2xl p-4 sm:p-6 bg-[#0A0A0C]/90 backdrop-blur-md relative shadow-2xl flex flex-col gap-6">
          {/* Board Title Header */}
          <div className="bg-gradient-to-r from-copper/40 via-saffron/20 to-copper/40 border border-gold/40 rounded-xl p-4 text-center shadow-xl">
            <h3 className="font-serif text-3xl font-extrabold text-gold-gradient tracking-wider">
              ambrocia's
            </h3>
            <div className="text-xs font-serif tracking-[0.25em] text-gold-light uppercase font-bold">
              ✦ AUTHENTIC HYDERABADI BIRYANI & VEG VAULT ✦
            </div>
          </div>

          {/* BIRYANI SECTION */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-saffron" /> BIRYANI
              </h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {getCategoryItems('biryani').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={item.isVeg} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient flex items-center gap-1">
                    ₹{item.price}
                    {addedItem === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold" />}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BUCKET BIRYANI (5 SERVE) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#1E1712] via-[#2A1E16] to-[#1E1712] border border-gold/50 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-gold/30 pb-2 mb-3">
              <h4 className="font-serif text-base sm:text-lg font-black text-gold uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-saffron" /> BUCKET BIRYANI (5 SERVE)
              </h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>

            <div className="space-y-2 text-xs">
              {getCategoryItems('bucket').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/20 cursor-pointer transition-colors group font-bold"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={item.isVeg} />
                    {item.name}
                  </span>
                  <span className="font-serif font-extrabold text-gold-gradient text-sm">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHINESE SPECIALTIES */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider">CHINESE SPECIALTIES</h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {getCategoryItems('chinese').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={item.isVeg} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VEG STARTERS */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider">VEG STARTERS</h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {getCategoryItems('starters-veg').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={true} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VEG KEBABS */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider">VEG KEBABS</h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {getCategoryItems('kebabs-veg').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={true} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VEG CURRIES */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider">VEG CURRIES</h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {getCategoryItems('curries-veg').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={true} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT BOARD: NON-VEG STARTERS, NON-VEG KEBABS, TANDOORI, NON-VEG CURRIES, ROTIS */}
        <div className="border-2 border-gold/35 rounded-2xl p-4 sm:p-6 bg-[#0A0A0C]/90 backdrop-blur-md relative shadow-2xl flex flex-col gap-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-copper/40 via-saffron/20 to-copper/40 border border-gold/40 rounded-xl p-4 text-center shadow-xl">
            <h3 className="font-serif text-3xl font-extrabold text-gold-gradient tracking-wider">
              ambrocia's
            </h3>
            <div className="text-xs font-serif tracking-[0.25em] text-gold-light uppercase font-bold">
              ✦ TANDOORI, KEBABS & NON-VEG VAULT ✦
            </div>
          </div>

          {/* NON-VEG STARTERS */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider">NON-VEG STARTERS</h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {getCategoryItems('starters-nonveg').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-1.5 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors truncate flex items-center gap-1.5">
                    <DietaryDot isVeg={false} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient ml-2">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NON-VEG KEBABS */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider">NON-VEG KEBABS</h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {getCategoryItems('kebabs-nonveg').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={false} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TANDOORI / GRILL ITEMS */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider">TANDOORI / GRILL ITEMS</h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {getCategoryItems('tandoori').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={false} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NON-VEG CURRIES */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider">NON-VEG CURRIES</h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {getCategoryItems('curries-nonveg').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={false} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* INDIAN ROTIS & NAAN */}
          <div>
            <div className="flex items-center justify-between border-b border-gold/30 pb-1 mb-3">
              <h4 className="font-serif text-base font-bold text-gold uppercase tracking-wider">INDIAN ROTIS & NAAN</h4>
              <span className="text-[11px] font-serif text-gold-muted uppercase">PRICE (₹)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {getCategoryItems('rotis').map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-gold/15 cursor-pointer transition-colors group"
                >
                  <span className="group-hover:text-gold transition-colors flex items-center gap-2">
                    <DietaryDot isVeg={true} />
                    {item.name}
                  </span>
                  <span className="font-serif font-bold text-gold-gradient">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* DELIVERY CONTACT BANNER */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] text-center shadow-2xl border border-gold/50">
        <div className="font-serif text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center justify-center gap-2">
          <Phone className="w-4 h-4 fill-[#0A0A0C]" /> FOR DELIVERY CONTACT: 9444254893 / 8220580524
        </div>
        <div className="text-[11px] font-serif uppercase tracking-widest mt-0.5 font-bold">
          ★ COMBO PACK & FAMILY PACK AVAILABLE • WE ACCEPT ALL PARTY ORDERS ★
        </div>
      </div>

      {/* RESTAURANT BRANCH FOOTER DETAILS */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif text-gold-muted">
        <div className="p-4 rounded-xl bg-[#0A0A0C]/80 border border-gold/30 flex flex-col gap-1.5">
          <div className="font-bold text-gold text-sm uppercase flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-saffron" /> Ambrocia's Restaurant (Main Branch)
          </div>
          <div>Near VIT College, Opp To. Life Cell Company, Kelakottiyur, Chennai - 600 1027</div>
          <div className="flex items-center gap-3 text-gold-light mt-1">
            <span>📞 +91 94442 54893 / 82205 80524</span>
            <span>✉️ ambrocias@outlook.com</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0C]/80 border border-gold/30 flex flex-col gap-1.5">
          <div className="font-bold text-gold text-sm uppercase flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-saffron" /> Branch: BHARATH UNIVERSITY
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
