/**
 * BrainScene.jsx
 * ─────────────────────────────────────────────────────────────────
 * The main React Three Fiber scene containing:
 *   • An anatomically-modelled transparent brain (loaded from brain.glb)
 *   • 3-layer X-ray shader: translucent surface + back-side glow + wireframe
 *   • All BrainRegion nodes positioned inside the brain
 *   • Bloom post-processing for the glow effect
 *   • Slow auto-rotation with OrbitControls for manual navigation
 */
import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import BrainRegion from './BrainRegion';
import { BRAIN_REGION_DATA } from '../../utils/emotionMappings';

/**
 * Loads the anatomical brain GLB and renders it with 3 material layers:
 *   1. Solid translucent cyan surface  (FrontSide)
 *   2. Back-side inner glow            (BackSide)
 *   3. Wireframe overlay               (meshBasicMaterial)
 */
function BrainModel() {
  const { scene } = useGLTF('/models/brain.glb');

  // Collect all mesh geometries from the loaded GLB scene
  const geometries = useMemo(() => {
    const geos = [];
    scene.traverse((child) => {
      if (child.isMesh) geos.push(child.geometry);
    });
    return geos;
  }, [scene]);

  return (
    <group>
      {geometries.map((geo, i) => (
        <group key={i}>
          {/* Layer 1 – solid translucent cyan surface */}
          <mesh geometry={geo}>
            <meshStandardMaterial
              color="#00bcd4" emissive="#006e84" emissiveIntensity={0.6}
              transparent opacity={0.14} roughness={0.30} metalness={0.15}
            />
          </mesh>
          {/* Layer 2 – back-side inner glow (creates lit-from-within effect) */}
          <mesh geometry={geo}>
            <meshStandardMaterial
              color="#00e5ff" emissive="#00bcd4" emissiveIntensity={0.90}
              transparent opacity={0.08} side={THREE.BackSide}
            />
          </mesh>
          {/* Layer 3 – wireframe cage (the fine grid lines) */}
          <mesh geometry={geo}>
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.10} wireframe />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Preload the model as soon as the module is imported
useGLTF.preload('/models/brain.glb');

/** Slowly auto-rotates the whole brain; user can override via OrbitControls */
function RotatingGroup({ activeRegions }) {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Anatomical brain model loaded from brain.glb */}
      <BrainModel />
      {BRAIN_REGION_DATA.map((region) => {
        const active = activeRegions.find(r => r.name === region.name);
        return (
          <BrainRegion
            key={region.id}
            region={region}
            active={!!active}
            intensity={active ? active.intensity : 0}
          />
        );
      })}
    </group>
  );
}

export default function BrainScene({ activeRegions = [] }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6], fov: 48 }}
      dpr={[1, 2]}
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #041e30 0%, #020c18 100%)' }}
    >
      {/* ── Lighting: cyan-dominant to match the X-ray brain look ── */}
      <ambientLight intensity={0.25} color="#003d52" />
      <pointLight position={[0,  4,  4]}  intensity={3.0} color="#00e5ff" />
      <pointLight position={[-5, 1, -2]} intensity={1.4} color="#00bcd4" />
      <pointLight position={[5, -2,  2]} intensity={0.9} color="#00a0b8" />
      <pointLight position={[0, -4, -3]} intensity={0.5} color="#006080" />

      {/* Stars — denser and slightly faster for a neural-network feel */}
      <Stars radius={60} depth={50} count={2800} factor={3.5} fade speed={0.8} />

      <Suspense fallback={null}>
        <RotatingGroup activeRegions={activeRegions} />
      </Suspense>

      {/* ── Bloom: stronger, lower threshold so the cyan shell glows ── */}
      <EffectComposer>
        <Bloom
          intensity={2.8}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>

      {/* User orbit controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={11}
        autoRotate={false}
      />
    </Canvas>
  );
}

