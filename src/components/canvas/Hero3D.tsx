"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

function PotModel() {
  const group = useRef<THREE.Group | null>(null);
  const lid = useRef<Mesh | null>(null);

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.2;
    if (lid.current) lid.current.rotation.y -= delta * 0.12;
  });

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      {/* Pot body */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 0.9, 24, 1]} />
        <meshStandardMaterial color="#3b2b16" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Inner rice (slightly inset) */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.35, 24]} />
        <meshStandardMaterial color="#f3d6a9" metalness={0.05} roughness={0.9} />
      </mesh>

      {/* Lid */}
      <mesh ref={lid} position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.9, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5a3f22" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Handle */}
      <mesh position={[0, 0.95, 0]}> 
        <torusGeometry args={[0.25, 0.08, 8, 24]} />
        <meshStandardMaterial color="#d9b36a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas dpr={[1, 1.5]} shadows={false} gl={{ antialias: true }} camera={{ position: [0, 2.6, 6], fov: 35 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, 5]} intensity={1.0} />
        <spotLight position={[-5, 6, -5]} intensity={0.6} angle={0.6} />

        <React.Suspense fallback={null}>
          <PotModel />
        </React.Suspense>

        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
