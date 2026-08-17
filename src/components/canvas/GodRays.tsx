'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { godRayVertexShader, godRayFragmentShader } from '@/shaders/godRayShader';

export default function GodRays() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRayColor: { value: new THREE.Color('#D4AF37') }, // Deep Royal Gold Light
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1 - 0.3;
    }
  });

  return (
    <group position={[2, 4, -4]} rotation={[0, 0, -Math.PI / 6]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[16, 25]} />
        <shaderMaterial
          vertexShader={godRayVertexShader}
          fragmentShader={godRayFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
