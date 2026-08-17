'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  sandParticleVertexShader,
  sandParticleFragmentShader,
} from '@/shaders/sandParticles';

interface DustParticlesProps {
  count?: number;
}

export default function DustParticles({ count = 1200 }: DustParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales, randomness] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    const rand = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Swirling distribution volume
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.3) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;

      sc[i] = Math.random() * 0.85 + 0.3;

      rand[i * 3] = Math.random();
      rand[i * 3 + 1] = Math.random();
      rand[i * 3 + 2] = Math.random();
    }

    return [pos, sc, rand];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uColorGold: { value: new THREE.Color('#D4AF37') },
      uColorSaffron: { value: new THREE.Color('#E05A47') },
    }),
    []
  );

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aRandomness" args={[randomness, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={sandParticleVertexShader}
        fragmentShader={sandParticleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
