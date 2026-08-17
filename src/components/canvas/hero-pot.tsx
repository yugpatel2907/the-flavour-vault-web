'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { steamVertexShader, steamFragmentShader } from '@/shaders/steamParticles';

export default function HeroPot() {
  const potGroupRef = useRef<THREE.Group>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const steamRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Mouse inertia Vector3 target
  const targetLightPos = useRef(new THREE.Vector3(0, 4, 3));

  // Instanced steam particles setup
  const particleCount = 600;
  const [positions, scales, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sc = new Float32Array(particleCount);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Circle emission around rim of pot
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.45;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0.8; // Rim height
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      sc[i] = Math.random() * 0.6 + 0.4;
      vel[i * 3] = Math.random();
      vel[i * 3 + 1] = Math.random();
      vel[i * 3 + 2] = Math.random();
    }

    return [pos, sc, vel];
  }, [particleCount]);

  const steamUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#F3E5AB') },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Subtle Pot Floating & Rotation
    if (potGroupRef.current) {
      potGroupRef.current.position.y = -0.5 + Math.sin(t * 0.9) * 0.04;
      potGroupRef.current.rotation.y = Math.sin(t * 0.4) * 0.1;
    }

    // 2. Steam Particles animation
    if (steamRef.current) {
      const material = steamRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = t;
    }

    // 3. Mouse 3D Spotlight inertia following cursor (Vector3.lerp)
    if (spotlightRef.current) {
      const mouseX = (state.pointer.x * viewport.width) / 2;
      const mouseY = (state.pointer.y * viewport.height) / 2;

      targetLightPos.current.set(mouseX * 0.8, mouseY * 0.8 + 3, 4);
      spotlightRef.current.position.lerp(targetLightPos.current, 0.06);
    }
  });

  return (
    <group>
      {/* Dynamic Warm Mouse 3D Spotlight with Inertia */}
      <spotLight
        ref={spotlightRef}
        position={[0, 4, 3]}
        color="#FFF2C6"
        intensity={4.5}
        angle={0.6}
        penumbra={0.8}
        castShadow
      />

      {/* 3D ROYAL CLAY HANDI POT */}
      <group ref={potGroupRef} position={[0, -0.5, 0]} scale={[1.4, 1.4, 1.4]}>
        
        {/* Pot Clay Body */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color="#5C2D0C"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>

        {/* Gold Filigree Band around Rim */}
        <mesh position={[0, 0.7, 0]}>
          <torusGeometry args={[0.62, 0.08, 16, 32]} />
          <meshStandardMaterial
            color="#D4AF37"
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>

        {/* Terracotta Neck */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.6, 0.65, 0.25, 32]} />
          <meshStandardMaterial color="#8B4513" roughness={0.5} />
        </mesh>

        {/* Royal Gold Dome Lid */}
        <mesh position={[0, 0.98, 0]} castShadow>
          <coneGeometry args={[0.62, 0.35, 32]} />
          <meshStandardMaterial
            color="#D4AF37"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>

        {/* Gold Crown Handle Top */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#F3E5AB" roughness={0.1} metalness={0.95} />
        </mesh>

        {/* Warm Internal Glowing Spices PointLight */}
        <pointLight position={[0, 0.8, 0]} color="#E05A47" intensity={3.0} distance={4} />

        {/* DYNAMIC INSTANCED STEAM PARTICLES */}
        <points ref={steamRef} position={[0, 0.1, 0]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
            <bufferAttribute attach="attributes-aVelocity" args={[velocities, 3]} />
          </bufferGeometry>
          <shaderMaterial
            vertexShader={steamVertexShader}
            fragmentShader={steamFragmentShader}
            uniforms={steamUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}
