'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { BakeShadows, Preload, PerspectiveCamera, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import SandDunes from './SandDunes';
import DustParticles from './DustParticles';
import GodRays from './GodRays';

interface CameraControllerProps {
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
}

function CameraController({ cameraRef }: CameraControllerProps) {
  const { camera } = useThree();

  useEffect(() => {
    if (camera) {
      cameraRef.current = camera as THREE.PerspectiveCamera;
    }
  }, [camera, cameraRef]);

  return null;
}

interface GlobalCanvasProps {
  cameraRef?: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  children?: React.ReactNode;
}

export default function GlobalCanvas({ cameraRef, children }: GlobalCanvasProps) {
  const localCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const activeCameraRef = cameraRef || localCameraRef;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 2.5, 7.5]}
          fov={45}
          near={0.1}
          far={100}
        />
        <CameraController cameraRef={activeCameraRef} />

        {/* Global Royal Lighting */}
        <ambientLight color="#0F2E23" intensity={1.4} />
        
        {/* Main Golden Sun Spotlight */}
        <directionalLight
          position={[10, 12, 8]}
          color="#F3E5AB"
          intensity={3.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Copper Rim Fill */}
        <directionalLight
          position={[-10, 4, -8]}
          color="#E05A47"
          intensity={1.8}
        />

        {/* Dynamic 3D WebGL Background Engine */}
        <GodRays />
        <SandDunes />
        <DustParticles count={2500} />

        {children}

        {/* Performance Optimization */}
        <AdaptiveDpr pixelated />
        <BakeShadows />
        <Preload all />
      </Canvas>
    </div>
  );
}
