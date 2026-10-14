"use client";

import React, { useState } from 'react';
import { menuCategories, MenuItem } from '@/data/ambrociaMenu';
import { useMenu } from '@/lib/useMenu';
import AuthenticMenuCardView from './AuthenticMenuCardView';
import { useCart } from '@/context/CartContext';
import { Search, Plus, Flame, Leaf, Phone, LayoutGrid, FileText, Check } from 'lucide-react';
import { audioSynthesizer } from '@/lib/audioSynthesizer';

export default function MenuSection() {
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { menu } = useMenu();

  const handleAdd = (item: MenuItem) => {
    audioSynthesizer.playSizzle();
    addToCart(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filteredMenu = menu.filter((item) => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const filterMatch =
      filterType === 'all' ||
      (filterType === 'veg' && item.isVeg === true) ||
      (filterType === 'nonveg' && item.isVeg === false);
    const searchMatch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && filterMatch && searchMatch;
  });

  return (
    <section id="cuisine" className="relative z-10 w-full min-h-screen py-20 px-4 sm:px-12 bg-[#0A0A0C]/95 border-t border-gold/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120F14]/90 border border-gold/30 mb-4 shadow-lg">
            <Flame className="w-3.5 h-3.5 text-saffron animate-pulse" />
            <span className="text-[11px] tracking-[0.35em] text-gold-muted uppercase font-serif font-bold">
              AMBROCIA&apos;S OFFICIAL HYDERABADI MENU
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-gold-gradient tracking-tight">
            THE FLAVOUR VAULT
          </h2>

          <p className="mt-3 text-gold-light/80 text-sm sm:text-base font-sans leading-relaxed">
            Order authentic Hyderabadi Biryani, Kebabs, Tandoori & Chinese specialties prepared fresh in clay handis.
          </p>

          {/* Delivery Hotline Banner */}
          <div className="mt-6 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] shadow-xl font-serif text-xs font-bold uppercase tracking-wider border border-gold/40">
            <Phone className="w-4 h-4 text-[#0A0A0C]" />
            <span>FOR DIRECT EXPRESS DELIVERY: 9444254893 / 8220580524</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-10">
          <div className="p-1 rounded-full bg-[#120F14]/90 border border-gold/30 flex items-center gap-2 shadow-2xl">
            <button
              onClick={() => setViewMode('card')}
              className={`px-5 py-2 rounded-full text-xs font-serif uppercase tracking-widest flex items-center gap-2 transition-all ${
                viewMode === 'card'
                  ? 'bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-extrabold shadow-lg'
                  : 'text-gold-muted hover:text-gold-light'
              }`}
            >
              <FileText className="w-4 h-4" /> OFFICIAL MENU BOARD
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-5 py-2 rounded-full text-xs font-serif uppercase tracking-widest flex items-center gap-2 transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-extrabold shadow-lg'
                  : 'text-gold-muted hover:text-gold-light'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> INTERACTIVE GRID
            </button>
          </div>
        </div>

        {/* VIEW 1: PRINTED MENU CARD BOARD VIEW */}
        {viewMode === 'card' && <AuthenticMenuCardView />}

        {/* VIEW 2: INTERACTIVE GRID VIEW */}
        {viewMode === 'grid' && (
          <div>
            {/* Category Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
              {/* Category Tabs Scroll */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
                {menuCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs tracking-wider font-serif uppercase whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-bold shadow-lg'
                        : 'bg-[#120F14]/80 text-gold-muted hover:text-gold hover:border-gold/30 border border-gold/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search & Dietary Toggle */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-gold-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-[#120F14]/90 text-xs text-gold-light placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-colors border border-gold/30"
                  />
                </div>

                <div className="flex items-center p-1 rounded-full bg-[#120F14]/90 border border-gold/30">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 rounded-full text-[10px] tracking-wider font-serif uppercase transition-all ${
                      filterType === 'all' ? 'bg-gold/20 text-gold font-bold' : 'text-gold-muted'
                    }`}
                  >
                    ALL
                  </button>
                  <button
                    onClick={() => setFilterType('veg')}
                    className={`px-3 py-1 rounded-full text-[10px] tracking-wider font-serif uppercase flex items-center gap-1 transition-all ${
                      filterType === 'veg' ? 'bg-gold/20 text-gold font-bold border border-gold/40' : 'text-gold-muted/70'
                    }`}
                  >
                    <Leaf className="w-3 h-3 text-emerald-400" /> VEG
                  </button>
                  <button
                    onClick={() => setFilterType('nonveg')}
                    className={`px-3 py-1 rounded-full text-[10px] tracking-wider font-serif uppercase flex items-center gap-1 transition-all ${
                      filterType === 'nonveg' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-500/30' : 'text-rose-500/70'
                    }`}
                  >
                    <Flame className="w-3 h-3 text-rose-500" /> NON-VEG
                  </button>
                </div>
              </div>
            </div>

            {/* Dish Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="group bg-[#120F14]/90 backdrop-blur-xl p-6 rounded-2xl border border-gold/30 hover:border-gold/60 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between shadow-2xl"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            item.isVeg === null ? 'bg-gold-muted' : item.isVeg ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-rose-500 ring-4 ring-rose-500/20'
                          }`}
                        />
                        <h3 className="font-serif text-lg font-bold text-gold-light group-hover:text-gold transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      <span className="font-serif text-xl font-extrabold text-gold-gradient whitespace-nowrap">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-gold-light/75 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gold/20 flex justify-between items-center gap-2">
                    <span className="text-[10px] tracking-widest text-gold-muted uppercase font-serif font-bold">
                      {item.category.replace('-', ' ')}
                    </span>

                    <button
                      onClick={() => handleAdd(item)}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 hover:scale-105 transition-all shadow-md"
                    >
                      {addedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
                      {addedId === item.id ? 'ADDED' : 'ADD TO ORDER'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
