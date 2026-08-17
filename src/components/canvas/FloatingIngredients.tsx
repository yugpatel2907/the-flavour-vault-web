'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface FloatingIngredientsProps {
  activeSpice: 'star-anise' | 'clove' | 'cardamom' | 'chilli' | 'ember' | 'pot' | null;
}

export default function FloatingIngredients({ activeSpice }: FloatingIngredientsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spice1Ref = useRef<THREE.Mesh>(null);
  const spice2Ref = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Target mouse position for magnetic spring physics
  const targetPos = useRef(new THREE.Vector3(2.5, 0.5, 1.2));

  // GSAP Smooth scale & spin transition on activeSpice change
  useEffect(() => {
    if (!groupRef.current) return;

    if (activeSpice) {
      gsap.to(groupRef.current.scale, {
        x: 1.15,
        y: 1.15,
        z: 1.15,
        duration: 0.7,
        ease: 'power3.out',
      });
      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y + Math.PI * 1.5,
        duration: 1.2,
        ease: 'power3.out',
      });
    } else {
      gsap.to(groupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: 'power2.in',
      });
    }
  }, [activeSpice]);

  // Continuous subtle spin, bobbing & 3D mouse repulsion physics
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Mouse 3D repulsion vector
      const mouseX = (state.pointer.x * viewport.width) / 4;
      const mouseY = (state.pointer.y * viewport.height) / 4;

      const baseX = 2.5 + Math.sin(t * 0.7) * 0.2 + mouseX * 0.4;
      const baseY = 0.5 + Math.sin(t * 1.5) * 0.18 + mouseY * 0.4;
      const baseZ = 1.2 + Math.cos(t * 0.9) * 0.2;

      targetPos.current.set(baseX, baseY, baseZ);
      groupRef.current.position.lerp(targetPos.current, 0.06);

      groupRef.current.rotation.x = Math.sin(t * 0.8) * 0.25 + mouseY * 0.3;
      groupRef.current.rotation.z = Math.cos(t * 0.7) * 0.2 + mouseX * 0.3;
    }

    if (spice1Ref.current) {
      spice1Ref.current.rotation.y += 0.02;
    }
    if (spice2Ref.current) {
      spice2Ref.current.rotation.y -= 0.025;
    }
  });

  return (
    <group ref={groupRef} position={[2.5, 0.5, 1.2]} scale={[0, 0, 0]}>
      {/* 1. STAR ANISE MODEL */}
      {activeSpice === 'star-anise' && (
        <group>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              rotation={[0, 0, (i * Math.PI) / 4]}
              position={[Math.cos((i * Math.PI) / 4) * 0.55, Math.sin((i * Math.PI) / 4) * 0.55, 0]}
              castShadow
            >
              <coneGeometry args={[0.16, 0.65, 16]} />
              <meshStandardMaterial color="#5C2E0B" roughness={0.5} metalness={0.25} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#8B4513" roughness={0.4} />
          </mesh>
          <pointLight color="#FFD700" intensity={1.8} distance={3} />
        </group>
      )}

      {/* 2. CLOVE MODEL */}
      {activeSpice === 'clove' && (
        <group>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.06, 0.95, 16]} />
            <meshStandardMaterial color="#3D1E08" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#6E2D18" roughness={0.3} />
          </mesh>
          <pointLight color="#FFAA00" intensity={1.5} distance={3} />
        </group>
      )}

      {/* 3. CARDAMOM POD */}
      {activeSpice === 'cardamom' && (
        <group>
          <mesh castShadow>
            <sphereGeometry args={[0.55, 32, 16]} />
            <meshStandardMaterial color="#4A5D23" roughness={0.35} metalness={0.15} />
          </mesh>
          <pointLight color="#7CFC00" intensity={1.2} distance={3} />
        </group>
      )}

      {/* 4. RED CHILLI */}
      {activeSpice === 'chilli' && (
        <group rotation={[0, 0, -Math.PI / 4]}>
          <mesh castShadow>
            <coneGeometry args={[0.24, 1.5, 24]} />
            <meshStandardMaterial color="#C02626" roughness={0.2} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.22, 12]} />
            <meshStandardMaterial color="#2E5A1C" roughness={0.5} />
          </mesh>
          <pointLight color="#FF3300" intensity={2.2} distance={3.5} />
        </group>
      )}

      {/* 5. EMBER SPORES */}
      {activeSpice === 'ember' && (
        <group>
          {Array.from({ length: 16 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 1.8,
                (Math.random() - 0.5) * 1.8,
                (Math.random() - 0.5) * 1.8,
              ]}
            >
              <sphereGeometry args={[0.06 + Math.random() * 0.08, 12, 12]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#FF5500' : '#FFAA00'} />
            </mesh>
          ))}
          <pointLight color="#FF5500" intensity={3.5} distance={4.5} />
        </group>
      )}

      {/* 6. CLAY HANDI POT */}
      {activeSpice === 'pot' && (
        <group scale={[0.75, 0.75, 0.75]}>
          <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.85, 32, 32]} />
            <meshStandardMaterial color="#8B3A1C" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <torusGeometry args={[0.52, 0.1, 16, 32]} />
            <meshStandardMaterial color="#6E2D18" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.88, 0]}>
            <coneGeometry args={[0.55, 0.32, 32]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.18} metalness={0.85} />
          </mesh>
        </group>
      )}
    </group>
  );
}
