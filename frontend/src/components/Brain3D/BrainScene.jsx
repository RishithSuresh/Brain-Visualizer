/**
 * BrainScene.jsx
 * ─────────────────────────────────────────────────────────────────
 * The main React Three Fiber scene containing:
 *   • A stylised transparent brain shell (main + hemispheres + cerebellum)
 *   • All BrainRegion nodes positioned anatomically
 *   • Bloom post-processing for the glow effect
 *   • Slow auto-rotation with OrbitControls for manual navigation
 *   • Starfield background particles
 */
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import BrainRegion from './BrainRegion';
import { BRAIN_REGION_DATA } from '../../utils/emotionMappings';

/** Translucent outer brain shell built from overlapping ellipsoids */
function BrainShell() {
  return (
    <group>
      {/* Central mass */}
      <mesh>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial color="#0a1f3d" transparent opacity={0.14} wireframe={false} />
      </mesh>
      {/* Left hemisphere */}
      <mesh position={[-0.55, 0, 0]} scale={[1, 0.92, 1]}>
        <sphereGeometry args={[1.68, 48, 48]} />
        <meshStandardMaterial color="#0d2545" transparent opacity={0.18} />
      </mesh>
      {/* Right hemisphere */}
      <mesh position={[0.55, 0, 0]} scale={[1, 0.92, 1]}>
        <sphereGeometry args={[1.68, 48, 48]} />
        <meshStandardMaterial color="#0d2545" transparent opacity={0.18} />
      </mesh>
      {/* Cerebellum */}
      <mesh position={[0, -1.18, -1.15]} scale={[1.1, 0.75, 0.9]}>
        <sphereGeometry args={[0.82, 32, 32]} />
        <meshStandardMaterial color="#0d2545" transparent opacity={0.22} />
      </mesh>
      {/* Brain stem */}
      <mesh position={[0, -1.72, -0.55]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.7, 16]} />
        <meshStandardMaterial color="#0d2545" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

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
      <BrainShell />
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
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[6,  6,  6]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-6,-4, -4]} intensity={0.6} color="#3b82f6" />
      <pointLight position={[0,  8,  0]} intensity={0.4} color="#38bdf8" />

      {/* Stars background */}
      <Stars radius={50} depth={40} count={1800} factor={3} fade speed={0.6} />

      <Suspense fallback={null}>
        <RotatingGroup activeRegions={activeRegions} />
      </Suspense>

      {/* Bloom glow post-processing */}
      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.85}
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

