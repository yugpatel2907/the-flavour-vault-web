"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AuthenticBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#0A0A0C] select-none">
      {/* 1. Flowing Golden Aura Wave Curtains */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[120vw] h-[70vh] rounded-full opacity-35 blur-[100px] pointer-events-none"
        animate={{
          x: [0, 80, -60, 0],
          y: [0, 40, -30, 0],
          scale: [1, 1.15, 0.95, 1],
          rotate: [0, 8, -5, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(139,69,19,0.2) 60%, transparent 80%)",
        }}
      />

      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[110vw] h-[75vh] rounded-full opacity-30 blur-[110px] pointer-events-none"
        animate={{
          x: [0, -70, 50, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, -10, 6, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(255,158,59,0.25) 0%, rgba(20,15,20,0.4) 60%, transparent 80%)",
        }}
      />

      {/* 2. Floating Gold Dust & Candlelit Ember Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => {
          const size = Math.random() * 4 + 2;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 10 + 12;
          const delay = Math.random() * 5;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                background: i % 2 === 0 ? "rgba(212, 175, 55, 0.8)" : "rgba(255, 158, 59, 0.8)",
                boxShadow: i % 2 === 0 ? "0 0 12px rgba(212, 175, 55, 0.8)" : "0 0 12px rgba(255, 158, 59, 0.8)",
              }}
              animate={{
                y: [0, -70, 0],
                x: [0, (Math.random() - 0.5) * 30, 0],
                opacity: [0.2, 0.85, 0.2],
                scale: [0.7, 1.3, 0.7],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* 3. Luxury Royal Damask Texture Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#D4AF37_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />
    </div>
  );
}
