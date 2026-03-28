/**
 * BrainRegion.jsx
 * ─────────────────────────────────────────────────────────────────
 * A single brain-region mesh inside the Three.js scene.
 *  • Inactive  → dark-blue translucent sphere
 *  • Active    → glowing sphere whose colour maps via a heatmap gradient
 *                (blue → yellow → red) according to intensity (0–1).
 *  • Pulses smoothly when active.
 *  • Shows an HTML label tag when hovered or active.
 */
import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Map intensity 0-1 -> THREE.Color
 * Low -> cyan, Mid -> sky blue, High -> white.
 */
function heatColor(t) {
  t = Math.max(0, Math.min(1, t));
  if (t < 0.5) {
    // cyan (#4fd8ff) -> sky-blue (#86e6ff)
    const s = t * 2;
    return new THREE.Color(
      0.31 + s * 0.22,
      0.85 + s * 0.05,
      1.0,
    );
  }
  // sky-blue (#86e6ff) -> white (#ffffff)
  const s = (t - 0.5) * 2;
  return new THREE.Color(0.53 + s * 0.47, 0.90 + s * 0.10, 1.0);
}

/** Inactive region color: muted violet-gray so regions stay subtle */
const INACTIVE_COLOR = new THREE.Color('#24507a');
const INACTIVE_EMISSIVE = new THREE.Color('#0f2a44');

export default function BrainRegion({ region, active, intensity, onClick }) {
  const meshRef  = useRef();
  const [hovered, setHovered] = useState(false);

  // Pre-compute colours so they only update when intensity changes
  const activeColor = useMemo(() => heatColor(intensity), [intensity]);
  const emissiveInt = active ? Math.max(0.6, intensity * 2.4) : 0;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    if (active) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 3.5) * 0.09;
      meshRef.current.scale.setScalar(pulse);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group position={region.position}>
      {/* Main region sphere */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[region.size, 32, 32]} />
        <meshStandardMaterial
          color={active ? activeColor : INACTIVE_COLOR}
          emissive={active ? activeColor : INACTIVE_EMISSIVE}
          emissiveIntensity={active ? emissiveInt : 0.32}
          transparent
          opacity={active ? 0.95 : 0.22}
          roughness={0.2}
          metalness={0.08}
        />
      </mesh>

      {/* Outer glow halo — always visible, brighter when active */}
      <mesh>
        <sphereGeometry args={[region.size * (active ? 1.55 : 1.25), 20, 20]} />
        <meshStandardMaterial
          color={active ? activeColor : INACTIVE_COLOR}
          emissive={active ? activeColor : INACTIVE_EMISSIVE}
          emissiveIntensity={active ? intensity * 1.35 : 0.15}
          transparent
          opacity={active ? 0.24 : 0.03}
          side={THREE.BackSide}
        />
      </mesh>

      {/* HTML label – shown when active or hovered */}
      {(active || hovered) && (
        <Html distanceFactor={8} center style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background:    'rgba(2, 17, 45, 0.9)',
              border:        `1px solid ${active ? '#72e0ff' : '#4b7fb0'}`,
              color:         active ? '#d6f8ff' : '#9cc4ea',
              padding:       '3px 8px',
              borderRadius:  '6px',
              fontSize:      '10px',
              fontFamily:    'Inter, sans-serif',
              fontWeight:    500,
              whiteSpace:    'nowrap',
              boxShadow:     active ? '0 0 14px rgba(114, 224, 255, 0.4)' : 'none',
            }}
          >
            {region.name}
            {active && (
              <span style={{ marginLeft: 4, opacity: 0.75 }}>
                {Math.round(intensity * 100)}%
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

