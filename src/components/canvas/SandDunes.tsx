'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { duneVertexShader, duneFragmentShader } from '@/shaders/sandDunes';

export default function SandDunes() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDirection: { value: new THREE.Vector3(10.0, 8.0, 5.0).normalize() },
      uSunColor: { value: new THREE.Color('#F3E5AB') }, // Deep Royal Sun
      uEmeraldColor: { value: new THREE.Color('#05140E') }, // Midnight Emerald Shadow
      uGoldColor: { value: new THREE.Color('#D4AF37') }, // Royal Gold Highlight
      uAmbientColor: { value: new THREE.Color('#0F2E23') },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.5, -10]}
      receiveShadow
    >
      <planeGeometry args={[120, 120, 128, 128]} />
      <shaderMaterial
        vertexShader={duneVertexShader}
        fragmentShader={duneFragmentShader}
        uniforms={uniforms}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
