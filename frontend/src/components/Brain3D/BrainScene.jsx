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

/**
 * Cyan X-ray brain shell — 3 layers per part:
 *   1. Solid translucent surface  (FrontSide, low opacity cyan)
 *   2. Back-side inner glow       (BackSide, higher emissive)
 *   3. Wireframe cage overlay     (meshBasicMaterial, wireframe)
 */
function ShellPart({ geometry, position = [0,0,0], scale = [1,1,1], rotation = [0,0,0] }) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Layer 1 – solid translucent cyan surface */}
      <mesh>
        {geometry}
        <meshStandardMaterial
          color="#00bcd4" emissive="#007090" emissiveIntensity={0.55}
          transparent opacity={0.13} roughness={0.35} metalness={0.2}
        />
      </mesh>
      {/* Layer 2 – back-side inner glow */}
      <mesh>
        {geometry}
        <meshStandardMaterial
          color="#00e5ff" emissive="#00bcd4" emissiveIntensity={0.85}
          transparent opacity={0.07} side={2}   /* THREE.BackSide = 2 */
        />
      </mesh>
      {/* Layer 3 – wireframe cage */}
      <mesh>
        {geometry}
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.11} wireframe />
      </mesh>
    </group>
  );
}

/** Translucent outer brain shell built from overlapping ellipsoids */
function BrainShell() {
  return (
    <group>
      {/* Central mass */}
      <ShellPart geometry={<sphereGeometry args={[2.0, 48, 48]} />} />
      {/* Left hemisphere */}
      <ShellPart
        geometry={<sphereGeometry args={[1.68, 36, 36]} />}
        position={[-0.55, 0, 0]} scale={[1, 0.92, 1]}
      />
      {/* Right hemisphere */}
      <ShellPart
        geometry={<sphereGeometry args={[1.68, 36, 36]} />}
        position={[0.55, 0, 0]} scale={[1, 0.92, 1]}
      />
      {/* Cerebellum */}
      <ShellPart
        geometry={<sphereGeometry args={[0.82, 28, 28]} />}
        position={[0, -1.18, -1.15]} scale={[1.1, 0.75, 0.9]}
      />
      {/* Brain stem */}
      <ShellPart
        geometry={<cylinderGeometry args={[0.18, 0.14, 0.7, 16]} />}
        position={[0, -1.72, -0.55]} rotation={[0.3, 0, 0]}
      />
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

