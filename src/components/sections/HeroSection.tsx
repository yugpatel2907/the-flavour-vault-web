'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('@/components/canvas/Hero3D'), { ssr: false, loading: () => null });

function Hero3DPlaceholder() {
  return <Hero3D />;
}
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { ArrowDown, Sparkles, Compass } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  isLoaded: boolean;
}

export default function HeroSection({ cameraRef, isLoaded }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax Effect on THAR Typography & Camera Tilt
  useEffect(() => {
    if (!containerRef.current || !titleRef.current) return;

    const xTo = gsap.quickTo(titleRef.current, 'x', {
      duration: 0.8,
      ease: 'power3.out',
    });
    const yTo = gsap.quickTo(titleRef.current, 'y', {
      duration: 0.8,
      ease: 'power3.out',
    });
    const rotXTo = gsap.quickTo(titleRef.current, 'rotateX', {
      duration: 0.8,
      ease: 'power3.out',
    });
    const rotYTo = gsap.quickTo(titleRef.current, 'rotateY', {
      duration: 0.8,
      ease: 'power3.out',
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const mouseX = (e.clientX / innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / innerHeight - 0.5) * 2;

      xTo(mouseX * 25);
      yTo(mouseY * 15);
      rotYTo(mouseX * 8);
      rotXTo(-mouseY * 8);

      // Subtle Camera Tilt
      if (cameraRef.current) {
        gsap.to(cameraRef.current.rotation, {
          y: mouseX * 0.05,
          x: -mouseY * 0.03,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cameraRef]);

  // Entrance & ScrollTrigger Camera Sequence
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial DOM Entrance Animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        titleRef.current,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, delay: 0.2 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0 },
          '-=0.8'
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        );

      // 2. Camera Fly-over ScrollTrigger Sequence
      if (cameraRef.current) {
        const cam = cameraRef.current;
        
        // Initial Camera position
        cam.position.set(0, 2.8, 7.5);
        cam.lookAt(0, -0.5, 0);

        // GSAP ScrollTrigger timeline mapping camera path
        const camTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        // Swoop camera down towards the dining table centerpiece
        camTl
          .to(cam.position, {
            x: 0,
            y: 0.6,
            z: 2.8,
            ease: 'power2.inOut',
          })
          .to(
            titleRef.current,
            {
              opacity: 0,
              y: -100,
              scale: 1.1,
              ease: 'power2.in',
            },
            0
          );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded, cameraRef]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[180vh] pointer-events-none"
    >
      {/* 3D Hero Canvas (lazy-loaded) */}
      <Suspense>{/* lazy component rendered client-side only */}
        <div className="hidden sm:block">
          {/* imported dynamically to avoid SSR issues */}
          <Hero3DPlaceholder />
        </div>
      </Suspense>

      {/* Sticky Hero Viewport */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-between p-6 sm:p-12 overflow-hidden">
        
        {/* Navigation Bar */}
        <header className="relative z-20 w-full flex justify-between items-center pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-sand/30 flex items-center justify-center glass-panel">
              <Compass className="w-4 h-4 text-sand" />
            </div>
            <span className="font-serif text-lg tracking-[0.25em] text-sand-light uppercase font-bold">
              THAR
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-xs tracking-[0.25em] text-sand-muted uppercase font-sans">
            <a href="#cuisine" className="hover:text-sand transition-colors duration-300">
              CUISINE
            </a>
            <a href="#ambience" className="hover:text-sand transition-colors duration-300">
              AMBIENCE
            </a>
            <a href="#story" className="hover:text-sand transition-colors duration-300">
              OUR STORY
            </a>
            <a href="#reservations" className="hover:text-sand transition-colors duration-300">
              RESERVATIONS
            </a>
          </nav>

          <button className="px-6 py-2.5 rounded-full text-xs tracking-[0.2em] font-serif uppercase glass-gold text-sand-light hover:border-sand hover:scale-105 transition-all duration-300 active:scale-95 shadow-lg shadow-terracotta/10">
            RESERVE A TABLE
          </button>
        </header>

        {/* Hero Center Typography */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-5xl mx-auto perspective-1000">
          
          {/* Subheading Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-sand/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse-slow" />
            <span className="text-[11px] tracking-[0.35em] text-sand-muted uppercase font-serif">
              DESERT LUXURY DINING
            </span>
          </div>

          {/* Massive THAR Title */}
          <h1
            ref={titleRef}
            className="font-serif text-[20vw] sm:text-[16vw] font-black leading-none tracking-tighter text-gold-gradient select-none filter drop-shadow-2xl opacity-0 transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            THAR
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-6 text-sm sm:text-lg max-w-xl text-sand/80 font-sans tracking-wide leading-relaxed opacity-0"
          >
            A high-end gastronomy sanctuary where ancient Thar desert spices, fine culinary alchemy, and golden hour elegance converge.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto opacity-0"
          >
            <a
              href="#cuisine"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-terracotta to-terracotta-light text-sand-light font-serif text-xs tracking-[0.25em] uppercase hover:shadow-xl hover:shadow-terracotta/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              EXPLORE TASTING MENU
            </a>
            <a
              href="#ambience"
              className="px-8 py-3.5 rounded-full glass-panel text-sand font-serif text-xs tracking-[0.25em] uppercase hover:border-sand/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              VIRTUAL TOUR
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 w-full flex justify-between items-end pointer-events-auto">
          <div className="hidden sm:block text-[11px] tracking-[0.25em] text-sand-muted/60 font-serif uppercase">
            26.9124° N, 70.9023° E <br />
            RAJASTHAN DESERT
          </div>

          <div className="flex flex-col items-center gap-2 mx-auto sm:mx-0">
            <span className="text-[10px] tracking-[0.3em] text-sand-muted/70 uppercase font-sans">
              SCROLL TO IMMERSE
            </span>
            <div className="w-8 h-12 rounded-full border border-sand/30 flex items-center justify-center p-1 glass-panel">
              <ArrowDown className="w-4 h-4 text-sand animate-bounce" />
            </div>
          </div>

          <div className="hidden sm:block text-[11px] tracking-[0.25em] text-sand-muted/60 font-serif uppercase text-right">
            GOLDEN HOUR EXPERIENCE <br />
            DAILY 18:00 — 23:30
          </div>
        </div>
      </div>
    </section>
  );
}
