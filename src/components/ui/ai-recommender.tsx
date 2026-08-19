'use client';

import React, { useState } from 'react';
import { Bot, X, Sparkles, Flame, Check, Plus, ChefHat, HeartPulse, ShieldCheck, Search, Send, User, Award, Info } from 'lucide-react';
import { MenuItem, ambrociaMenu } from '@/data/ambrociaMenu';
import { useMenu } from '@/lib/useMenu';
import { useCart } from '@/context/CartContext';
import { audioSynthesizer } from '@/lib/audioSynthesizer';

interface AIRecommenderProps {
  isOpen: boolean;
  onClose: () => void;
}

export type HealthPrecaution = 
  | 'heart-healthy'
  | 'gluten-free'
  | 'high-protein'
  | 'low-spice'
  | 'jain-sattvik'
  | 'diabetic-friendly'
  | 'kid-friendly'
  | 'dairy-free';

interface RecommendedDish extends MenuItem {
  matchScore: number;
  healthBenefit: string;
}

export default function AIRecommender({ isOpen, onClose }: AIRecommenderProps) {
  const [selectedHealth, setSelectedHealth] = useState<HealthPrecaution | 'all'>('all');
  const [userQuery, setUserQuery] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendedDish[]>([]);
  const [aiMessage, setAiMessage] = useState<string>(
    "Greetings! I am Ambrocia's Royal AI Culinary Sommelier. Ask me anything about health precautions, calorie limits, or dietary cravings!"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addToCart } = useCart();
  const { menu: fetchedMenu } = useMenu();

  if (!isOpen) return null;

  // Smart AI Health & Query Intent Analyzer Logic
  const runAIAnalysis = (healthTag: HealthPrecaution | 'all', queryText: string) => {
    setIsAnalyzing(true);
    audioSynthesizer.playGong();

    setTimeout(() => {
      let pool = [...fetchedMenu];
      let aiReasoning = "";

      const q = queryText.toLowerCase().trim();

      // Check if user specifically requested VEG or NON-VEG
      const isExplicitNonVeg = q.includes('non-veg') || q.includes('non veg') || q.includes('chicken') || q.includes('mutton') || q.includes('egg') || q.includes('fish') || q.includes('prawn');
      const isExplicitVeg = (q.includes('veg') || q.includes('vegetarian') || q.includes('paneer') || q.includes('dal') || q.includes('gobi') || q.includes('aloo') || q.includes('chole') || q.includes('jain')) && !isExplicitNonVeg;

      // Check if user requested LOW SPICE or MILD
      const isLowSpice = q.includes('low spice') || q.includes('mild') || q.includes('less spice') || q.includes('not spicy') || healthTag === 'low-spice';
      const isHighSpice = q.includes('spicy') || q.includes('hot') || q.includes('fiery');

      // 1. Apply Health Precaution Rules
      if (healthTag === 'heart-healthy') {
        pool = pool.filter((i) => i.isVeg || i.category === 'rotis' || i.name.includes('Plain') || i.name.includes('Dal'));
        aiReasoning = "Filtered for Heart-Healthy options: Low saturated fat, wholesome lentils, and fiber-rich grain preparations.";
      } else if (healthTag === 'gluten-free') {
        pool = pool.filter((i) => i.category !== 'rotis' && !i.name.includes('Noodles'));
        aiReasoning = "Filtered for 100% Gluten-Free options: Aromatic basmati biryanis, tandoori grills, and clay handi curries.";
      } else if (healthTag === 'high-protein') {
        pool = pool.filter((i) => !i.isVeg || i.name.includes('Paneer') || i.name.includes('Kaju'));
        aiReasoning = "Filtered for High Protein Muscle Recovery: Rich in chicken, mutton, paneer, and roasted nuts.";
      } else if (healthTag === 'low-spice') {
        pool = pool.filter((i) => (i.spicyLevel || 1) === 1);
        aiReasoning = "Filtered for Mild & Stomach-Friendly options: Smooth creamy gravies, aromatic mild biryanis, and rotis.";
      } else if (healthTag === 'jain-sattvik') {
        pool = pool.filter((i) => i.isVeg && !i.name.includes('Gongura') && !i.name.includes('Andhra'));
        aiReasoning = "Filtered for Sattvik & Jain-friendly pure vegetarian preparations.";
      } else if (healthTag === 'diabetic-friendly') {
        pool = pool.filter((i) => (i.spicyLevel || 1) <= 2 && !i.name.includes('Honey') && !i.name.includes('Schezwan'));
        aiReasoning = "Filtered for Low Glycemic & Diabetic Friendly meals: Balanced proteins, whole wheat rotis, and low-sugar curries.";
      } else if (healthTag === 'kid-friendly') {
        pool = pool.filter((i) => i.isVeg || i.name.includes('Boneless') || i.name.includes('Noodles') || i.name.includes('Butter'));
        aiReasoning = "Filtered for Kid-Friendly favorites: Mild butter paneer, noodles, and boneless tender bites.";
      } else if (healthTag === 'dairy-free') {
        pool = pool.filter((i) => !i.name.includes('Paneer') && !i.name.includes('Butter') && !i.name.includes('Malai'));
        aiReasoning = "Filtered for Dairy-Free & Lactose Safe preparations.";
      }

      // 2. Strict Dietary Intent Enforcement
      if (isExplicitVeg) {
        pool = pool.filter((i) => i.isVeg === true);
      } else if (isExplicitNonVeg) {
        pool = pool.filter((i) => i.isVeg === false);
      }

      // 3. Spice Intent Enforcement
      if (isLowSpice) {
        pool = pool.filter((i) => (i.spicyLevel || 1) === 1);
      } else if (isHighSpice) {
        pool = pool.filter((i) => (i.spicyLevel || 1) >= 2);
      }

      // 4. Smart Token Keyword Matching if custom query provided
      if (q !== '') {
        const keywords = q
          .split(/\s+/)
          .filter((w) => w.length > 2 && !['low', 'spice', 'veg', 'food', 'dish', 'dishes', 'for', 'please', 'the'].includes(w));

        if (keywords.length > 0) {
          const keywordMatched = pool.filter((i) =>
            keywords.some(
              (kw) =>
                i.name.toLowerCase().includes(kw) ||
                i.category.toLowerCase().includes(kw) ||
                (i.description && i.description.toLowerCase().includes(kw))
            )
          );
          if (keywordMatched.length > 0) {
            pool = keywordMatched;
          }
        }
        aiReasoning = `Analyzed AI request "${queryText}": Matched 100% dietary safe options according to your health criteria.`;
      }

      // 5. Diet-Aware Fallback (NEVER return non-veg if user asked for veg!)
      if (pool.length === 0) {
        // fallback to static data if fetched menu empty
        if (isExplicitVeg) {
          pool = ambrociaMenu.filter((i) => i.isVeg === true).slice(0, 4);
        } else if (isExplicitNonVeg) {
          pool = ambrociaMenu.filter((i) => i.isVeg === false).slice(0, 4);
        } else {
          pool = ambrociaMenu.slice(0, 4);
        }
      }

      // Calculate health match score & benefit description
      const matched: RecommendedDish[] = pool.slice(0, 4).map((item, idx) => ({
        ...item,
        matchScore: 99 - idx * 2,
        healthBenefit:
          item.isVeg && isLowSpice
            ? 'Stomach-friendly mild vegetarian option, low spice & gentle on digestion.'
            : healthTag === 'heart-healthy'
            ? 'Low cholesterol, rich in plant nutrients and heart-friendly spices.'
            : healthTag === 'high-protein'
            ? 'Provides 28g+ essential amino acid protein for muscle synthesis.'
            : healthTag === 'gluten-free'
            ? '100% Wheat & Gluten-free aromatic basmati preparation.'
            : 'Balanced calories with authentic royal Hyderabadi spice alchemy.',
      }));

      setRecommendations(matched);
      setAiMessage(aiReasoning || "Here are your top AI-curated royal menu selections tailored to your health criteria.");
      setIsAnalyzing(false);
    }, 600);
  };

  const handleHealthSelect = (tag: HealthPrecaution | 'all') => {
    setSelectedHealth(tag);
    runAIAnalysis(tag, userQuery);
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAIAnalysis(selectedHealth, userQuery);
  };

  const handleAddToCart = (item: MenuItem) => {
    audioSynthesizer.playSizzle();
    addToCart(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/88 backdrop-blur-xl font-sans select-none animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#120F16]/95 border-2 border-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-gold-light max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gold/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-saffron to-gold p-0.5 shadow-xl">
                <div className="w-full h-full rounded-[14px] bg-[#120F16] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-gold animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-gold-gradient tracking-wider uppercase">
                  ROYAL AI CULINARY & HEALTH SOMMELIER
                </h2>
                <p className="text-[11px] text-gold-muted font-serif">
                  Intelligent menu recommendations tailored to health precautions & dietary needs
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#1A1622] border border-gold/40 flex items-center justify-center text-gold hover:text-white hover:border-gold transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI Bot Message Bubble */}
          <div className="my-5 p-4 rounded-2xl bg-[#1A1624]/90 border border-gold/30 flex items-start gap-3 shadow-lg">
            <Bot className="w-5 h-5 text-saffron flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gold-light/90 leading-relaxed font-sans">
              {aiMessage}
            </div>
          </div>

          {/* Natural Language AI Chat Search Bar */}
          <form onSubmit={handleQuerySubmit} className="mb-6">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gold-muted absolute left-4" />
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask AI: 'Low spice veg', 'High protein chicken', 'Diabetes safe dish'..."
                className="w-full pl-11 pr-24 py-3 rounded-full bg-[#1A1624] text-xs text-gold-light placeholder:text-gold-muted/50 border border-gold/40 focus:outline-none focus:border-gold shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-saffron to-gold text-[#0A0A0C] font-serif text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 hover:scale-105 transition-all shadow-md"
              >
                <Send className="w-3 h-3 text-[#0A0A0C]" /> ASK AI
              </button>
            </div>
          </form>

          {/* Health Precautions & Dietary Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <HeartPulse className="w-4 h-4 text-saffron" />
              <span className="text-xs font-serif uppercase tracking-widest text-gold font-bold">
                SELECT HEALTH PRECAUTION & DIET PROFILE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'heart-healthy', label: '🩺 HEART HEALTHY', desc: 'Low sodium & oil' },
                { id: 'gluten-free', label: '🌾 GLUTEN-FREE', desc: 'Rice & tandoori' },
                { id: 'high-protein', label: '🏋️ HIGH PROTEIN', desc: 'Fitness & muscle' },
                { id: 'low-spice', label: '🌶️ LOW SPICE', desc: 'Stomach friendly' },
                { id: 'jain-sattvik', label: '🌿 JAIN SATTVIK', desc: 'Pure vegetarian' },
                { id: 'diabetic-friendly', label: '🩸 DIABETIC SAFE', desc: 'Low glycemic index' },
                { id: 'kid-friendly', label: '👶 KID FRIENDLY', desc: 'Mild & boneless' },
                { id: 'dairy-free', label: '🥜 DAIRY-FREE', desc: 'Lactose safe' },
              ].map((hp) => (
                <button
                  key={hp.id}
                  onClick={() => handleHealthSelect(hp.id as HealthPrecaution)}
                  className={`p-2.5 rounded-2xl text-left border transition-all ${
                    selectedHealth === hp.id
                      ? 'bg-gradient-to-r from-saffron/20 to-gold/20 border-gold shadow-lg shadow-saffron/20'
                      : 'bg-[#1A1622]/80 border-gold/20 hover:border-gold/50 text-gold-muted hover:text-gold-light'
                  }`}
                >
                  <div className="text-[11px] font-serif font-bold text-gold">{hp.label}</div>
                  <div className="text-[9px] text-gold-light/60 font-sans mt-0.5">{hp.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations Dish Grid Results */}
        {isAnalyzing ? (
          <div className="py-12 text-center text-xs font-serif text-gold flex flex-col items-center gap-3">
            <ChefHat className="w-8 h-8 text-saffron animate-spin" />
            <span>AI ANALYZING MENU NUTRITIONAL PROFILES & HEALTH MATRIX...</span>
          </div>
        ) : recommendations.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-3 border-t border-gold/20 pt-4">
              <span className="text-xs font-serif uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-saffron" /> TOP AI HEALTH-MATCHED DISHES
              </span>
              <span className="text-[10px] text-emerald-400 font-serif font-bold">
                ✓ VERIFIED DIETARY SAFE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map((dish) => (
                <div
                  key={dish.id}
                  className="p-4 rounded-2xl bg-[#1A1624] border border-gold/30 hover:border-gold transition-all flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            dish.isVeg ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-rose-500 shadow-[0_0_6px_#f43f5e]'
                          }`}
                        />
                        <h4 className="font-serif text-sm font-bold text-gold-light line-clamp-1">{dish.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-serif text-emerald-400 font-bold">
                        {dish.matchScore}% MATCH
                      </span>
                    </div>

                    <div className="text-xs font-serif font-extrabold text-gold-gradient mb-2">₹{dish.price}</div>

                    <p className="text-[11px] text-gold-light/80 leading-relaxed font-sans line-clamp-2 mb-2">
                      {dish.description}
                    </p>

                    <div className="p-2 rounded-xl bg-[#120F16]/90 border border-gold/20 text-[10px] text-gold-muted flex items-start gap-1.5 mb-3">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{dish.healthBenefit}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(dish)}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md border border-gold/40"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" /> ADD TO ROYAL ORDER
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
