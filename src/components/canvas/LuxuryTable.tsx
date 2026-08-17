'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LuxuryTable() {
  const groupRef = useRef<THREE.Group>(null);
  const lanternLightRef = useRef<THREE.PointLight>(null);

  // Subtle floating animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = -1.2 + Math.sin(t * 0.8) * 0.03;
    }
    if (lanternLightRef.current) {
      lanternLightRef.current.intensity = 2.5 + Math.sin(t * 4.0) * 0.3; // Warm candlelight flicker
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Table Top - Dark Terracotta Marble */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.2, 0.12, 64]} />
        <meshStandardMaterial
          color="#1A120C"
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Gold Trim Ring around Table Edge */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2.21, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Table Pedestal */}
      <mesh position={[0, -1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.7, 1.8, 32]} />
        <meshStandardMaterial
          color="#0D0B09"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Gold Base Ring */}
      <mesh position={[0, -1.85, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.1, 32]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* --- TABLE SETTING --- */}

      {/* Guest Setting 1 (Front) */}
      <group position={[0, 0.07, 1.3]}>
        {/* Obsidian Charger Plate */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.42, 0.02, 32]} />
          <meshStandardMaterial color="#14100C" roughness={0.1} metalness={0.6} />
        </mesh>
        {/* Inner Gold Rim Plate */}
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.35, 0.33, 0.015, 32]} />
          <meshStandardMaterial color="#E6C594" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Cutlery - Gold Fork & Knife */}
        <mesh position={[-0.55, 0.02, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.015, 0.35]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.95} />
        </mesh>
        <mesh position={[0.55, 0.02, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.015, 0.38]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.95} />
        </mesh>
        {/* Crystal Stemware / Glass */}
        <mesh position={[0.5, 0.18, -0.2]} castShadow>
          <cylinderGeometry args={[0.1, 0.06, 0.32, 24]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.9}
            opacity={1}
            transparent
            roughness={0.05}
            ior={1.5}
          />
        </mesh>
      </group>

      {/* Guest Setting 2 (Back) */}
      <group position={[0, 0.07, -1.3]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.42, 0.02, 32]} />
          <meshStandardMaterial color="#14100C" roughness={0.1} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.35, 0.33, 0.015, 32]} />
          <meshStandardMaterial color="#E6C594" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[-0.55, 0.02, 0]}>
          <boxGeometry args={[0.04, 0.015, 0.35]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.95} />
        </mesh>
        <mesh position={[0.55, 0.02, 0]}>
          <boxGeometry args={[0.04, 0.015, 0.38]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.95} />
        </mesh>
      </group>

      {/* --- CENTERPIECE: LUXURY DESERT LANTERN --- */}
      <group position={[0, 0.06, 0]}>
        {/* Lantern Base */}
        <mesh castShadow position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.2, 24]} />
          <meshStandardMaterial color="#6E2D18" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Glass Cylinder */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.35, 24]} />
          <meshPhysicalMaterial
            color="#FFE4B5"
            transmission={0.85}
            transparent
            roughness={0.1}
          />
        </mesh>
        {/* Golden Top Cap */}
        <mesh position={[0, 0.55, 0]}>
          <coneGeometry args={[0.22, 0.12, 24]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Glowing Flame / Core */}
        <mesh position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#FFB74D" />
        </mesh>
        {/* Warm Point Light Source */}
        <pointLight
          ref={lanternLightRef}
          position={[0, 0.35, 0]}
          color="#FF9E3B"
          intensity={2.8}
          distance={5}
          decay={2}
          castShadow
        />
      </group>
    </group>
  );
}
