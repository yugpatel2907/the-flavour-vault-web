'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function Bucket3DModel() {
  const bucketGroupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previousMouseX = useRef(0);
  const velocity = useRef(0);

  // Mouse / Touch Drag Inertia Physics
  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    previousMouseX.current = e.clientX || 0;
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    const clientX = e.clientX || 0;
    const deltaX = clientX - previousMouseX.current;
    velocity.current = deltaX * 0.008;
    previousMouseX.current = clientX;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useFrame(() => {
    if (bucketGroupRef.current) {
      // Apply rotation velocity with friction damping (inertia)
      bucketGroupRef.current.rotation.y += velocity.current;
      velocity.current *= 0.95; // Friction damping

      if (!isDragging && Math.abs(velocity.current) < 0.001) {
        bucketGroupRef.current.rotation.y += 0.005; // Idle slow spin
      }
    }
  });

  return (
    <group
      ref={bucketGroupRef}
      position={[0, 0, 0]}
      scale={[1.3, 1.3, 1.3]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Bucket Main Outer Shell (Metallic Dark Emerald & Gold Filigree) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.1, 0.85, 1.6, 64]} />
        <meshStandardMaterial
          color="#0F2E23"
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Royal Gold Top Filigree Rim */}
      <mesh position={[0, 0.82, 0]}>
        <torusGeometry args={[1.11, 0.06, 16, 64]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* Ambrocia's Signature Label Band */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.02, 0.96, 0.7, 64]} />
        <meshStandardMaterial color="#E05A47" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Saffron Basmati Rice & Biryani Top Fill */}
      <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 32]} />
        <meshStandardMaterial color="#F3E5AB" roughness={0.7} />
      </mesh>

      {/* Crispy Fried Onions & Spices Garnish Layer */}
      <mesh position={[0, 0.83, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.05, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Point Light for Saffron Glow */}
      <pointLight position={[0, 1.2, 0]} color="#FF9E3B" intensity={2.5} distance={3} />

      {/* --- FLOATING 3D HTML ANNOTATION HOTSPOTS --- */}
      <Html position={[1.4, 0.8, 0]} distanceFactor={6} zIndexRange={[100, 0]}>
        <div className="glass-panel px-4 py-2 rounded-full border-gold/30 shadow-2xl flex items-center gap-2 whitespace-nowrap animate-bounce">
          <span className="w-2 h-2 rounded-full bg-saffron animate-ping" />
          <span className="text-[11px] font-serif uppercase tracking-wider text-gold-light font-bold">
            SERVES 5 PEOPLE
          </span>
        </div>
      </Html>

      <Html position={[-1.4, -0.2, 0]} distanceFactor={6} zIndexRange={[100, 0]}>
        <div className="glass-panel px-4 py-2 rounded-full border-gold/30 shadow-2xl flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
          <span className="text-[11px] font-serif uppercase tracking-wider text-gold-light font-bold">
            AROMATIC BASMATI
          </span>
        </div>
      </Html>

      <Html position={[0, -1.1, 1.2]} distanceFactor={6} zIndexRange={[100, 0]}>
        <div className="glass-panel px-4 py-2 rounded-full border-gold/30 shadow-2xl flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
          <span className="text-[11px] font-serif uppercase tracking-wider text-gold-light font-bold">
            SECRET HYDERABADI SPICES
          </span>
        </div>
      </Html>
    </group>
  );
}
