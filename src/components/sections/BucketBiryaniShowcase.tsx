'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import Bucket3DModel from '@/components/canvas/Bucket3DModel';
import MagneticButton from '@/components/ui/magnetic-button';
import { useCart } from '@/context/CartContext';
import { Flame, RefreshCw, ShoppingBag, Users, Sparkles } from 'lucide-react';

export default function BucketBiryaniShowcase() {
  const { addToCart } = useCart();

  const bucketItem = {
    id: 'bb1',
    name: 'Bucket Chicken Biryani (5 Serve)',
    category: 'bucket' as const,
    price: 999,
    isVeg: false,
    spicyLevel: 2 as const,
    description: 'Generous 5-portion bucket of authentic Hyderabadi chicken biryani with boiled eggs & raita.',
  };

  return (
    <section id="bucket-biryani" className="relative z-10 w-full py-28 px-6 sm:px-12 bg-gradient-to-b from-[#0A0A0C] via-[#120F14] to-[#0A0A0C] border-t border-gold/20 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: 3D Inertia Canvas */}
        <div className="lg:col-span-7 h-[500px] sm:h-[600px] w-full relative bg-[#120F14]/90 backdrop-blur-xl rounded-3xl border border-gold/30 overflow-hidden shadow-2xl">
          
          {/* Drag Overlay Hint */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0A0A0C]/90 border border-gold/40 shadow-lg">
            <RefreshCw className="w-4 h-4 text-gold animate-spin-slow" />
            <span className="text-[11px] font-serif uppercase tracking-widest text-gold-light font-bold">
              CLICK & DRAG 360° TO ROTATE BUCKET
            </span>
          </div>

          {/* R3F Interactive Canvas */}
          <Canvas shadows gl={{ antialias: true, alpha: true }}>
            <PerspectiveCamera makeDefault position={[0, 1.2, 5.5]} fov={45} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 8, 5]} intensity={2.8} color="#F3E5AB" castShadow />
            <directionalLight position={[-5, -2, -5]} intensity={1.0} color="#FF9E3B" />

            <Bucket3DModel />
          </Canvas>
        </div>

        {/* Right Column: Information & Ordering */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120F14] border border-gold/30 mb-4">
              <Flame className="w-3.5 h-3.5 text-saffron animate-pulse" />
              <span className="text-[11px] tracking-[0.35em] text-gold-muted uppercase font-serif font-bold">
                SIGNATURE CULINARY FEAST
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gold-gradient tracking-tight">
              AMBROCIA'S BUCKET BIRYANI
            </h2>
            <p className="mt-4 text-gold-light/80 text-sm sm:text-base leading-relaxed">
              Designed for royal gatherings and family celebrations. 5 generous portions of slow-cooked dum biryani with marinated tender meat, boiled eggs, mirchi ka salan, and raita.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-[#120F14]/90 p-4 rounded-2xl border border-gold/30 shadow-xl">
              <span className="text-2xl font-serif font-bold text-gold">5 SERVES</span>
              <p className="text-xs text-gold-muted mt-1">Generous Royal Family Size</p>
            </div>
            <div className="bg-[#120F14]/90 p-4 rounded-2xl border border-gold/30 shadow-xl">
              <span className="text-2xl font-serif font-bold text-saffron">DUM COOKED</span>
              <p className="text-xs text-gold-muted mt-1">Charcoal Wood Fire Sealed</p>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-6 border-t border-gold/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <span className="text-xs text-gold-muted uppercase font-serif tracking-widest block">
                SPECIAL FEAST PRICE
              </span>
              <span className="text-4xl font-serif font-black text-gold-gradient">
                ₹999 <span className="text-sm font-sans font-normal text-gold-muted">/ 5 Serve</span>
              </span>
            </div>

            <MagneticButton strength={0.4}>
              <button
                onClick={() => addToCart(bucketItem)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs tracking-[0.25em] uppercase font-bold hover:shadow-2xl hover:shadow-saffron/30 transition-all flex items-center gap-3 border border-gold/40"
              >
                <ShoppingBag className="w-4 h-4 text-[#0A0A0C]" /> ADD BUCKET TO ORDER
              </button>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
