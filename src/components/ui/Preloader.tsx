'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Compass, Flame } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8 + 4);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
          onComplete();
        },
      });

      // Liquid curtain dissolve animation
      tl.to(textGroupRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.in',
      })
        .to(curtainLeftRef.current, {
          xPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
        }, '-=0.2')
        .to(curtainRightRef.current, {
          xPercent: 100,
          duration: 1.2,
          ease: 'power4.inOut',
        }, '<');
    }, containerRef);

    return () => ctx.revert();
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto select-none"
    >
      {/* Left Curtain */}
      <div
        ref={curtainLeftRef}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#0A0A0C] border-r border-gold/20 shadow-2xl"
      />

      {/* Right Curtain */}
      <div
        ref={curtainRightRef}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#0A0A0C] border-l border-gold/20 shadow-2xl"
      />

      {/* Central Content */}
      <div
        ref={textGroupRef}
        className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-md"
      >
        {/* Animated Royal Emblem */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-gold/30 animate-ping opacity-30" />
          <div className="w-16 h-16 rounded-full border-2 border-gold/50 flex items-center justify-center bg-[#120F14] shadow-2xl">
            <Compass className="w-8 h-8 text-gold animate-spin-slow" />
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="font-serif text-3xl font-extrabold text-gold-gradient tracking-[0.25em] uppercase mb-2">
          AMBROCIA'S
        </h1>

        <p className="text-[10px] font-serif tracking-[0.35em] text-gold-muted uppercase mb-6 flex items-center gap-1.5">
          <Flame className="w-3 h-3 text-saffron" /> HYDERABADI DUM ALCHEMY
        </p>

        {/* Progress Bar */}
        <div className="w-48 h-[2px] bg-gold/20 relative overflow-hidden rounded-full mb-3">
          <div
            className="h-full bg-gradient-to-r from-saffron to-gold transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <span className="font-serif text-xs tracking-widest text-gold font-bold">
          {Math.min(progress, 100)}%
        </span>
      </div>
    </div>
  );
}
