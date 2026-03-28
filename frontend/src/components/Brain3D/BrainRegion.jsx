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
 * Map intensity 0-1 → THREE.Color
 * Low  → deep cyan-teal  (#00bcd4)
 * Mid  → warm orange     (#ff8c00)
 * High → bright white    (#ffffff)
 * This matches the reference image: cyan brain with hot-white active zones.
 */
function heatColor(t) {
  t = Math.max(0, Math.min(1, t));
  if (t < 0.5) {
    // cyan (#00bcd4) → orange (#ff8c00)
    const s = t * 2;
    return new THREE.Color(
      s * 1.0,
      0.74 - s * 0.19,
      0.83 - s * 0.83,
    );
  }
  // orange (#ff8c00) → white (#ffffff)
  const s = (t - 0.5) * 2;
  return new THREE.Color(1, 0.55 + s * 0.45, s);
}

/** Inactive region colour: dim teal so it's visible against dark bg */
const INACTIVE_COLOR   = new THREE.Color('#006680');
const INACTIVE_EMISSIVE = new THREE.Color('#003d50');

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
          emissiveIntensity={active ? emissiveInt : 0.45}
          transparent
          opacity={active ? 0.95 : 0.60}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      {/* Outer glow halo — always visible, brighter when active */}
      <mesh>
        <sphereGeometry args={[region.size * (active ? 1.55 : 1.25), 20, 20]} />
        <meshStandardMaterial
          color={active ? activeColor : INACTIVE_COLOR}
          emissive={active ? activeColor : INACTIVE_EMISSIVE}
          emissiveIntensity={active ? intensity * 1.2 : 0.2}
          transparent
          opacity={active ? 0.14 : 0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* HTML label – shown when active or hovered */}
      {(active || hovered) && (
        <Html distanceFactor={8} center style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background:    'rgba(2,12,24,0.90)',
              border:        `1px solid ${active ? '#00e5ff' : '#1e6080'}`,
              color:         active ? '#00e5ff' : '#5fb8d0',
              padding:       '3px 8px',
              borderRadius:  '6px',
              fontSize:      '10px',
              fontFamily:    'Inter, sans-serif',
              fontWeight:    500,
              whiteSpace:    'nowrap',
              boxShadow:     active ? '0 0 14px #00e5ff50' : 'none',
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

