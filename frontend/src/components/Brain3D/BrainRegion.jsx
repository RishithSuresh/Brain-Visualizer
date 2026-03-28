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

/** Map intensity 0-1 → Three.Color (blue→yellow→red heatmap) */
function heatColor(t) {
  t = Math.max(0, Math.min(1, t));
  if (t < 0.5) {
    const s = t * 2;
    return new THREE.Color(s, s * 0.78, 1 - s);
  }
  const s = (t - 0.5) * 2;
  return new THREE.Color(1, 1 - s, 0);
}

export default function BrainRegion({ region, active, intensity, onClick }) {
  const meshRef  = useRef();
  const [hovered, setHovered] = useState(false);

  // Pre-compute colours so they only update when intensity changes
  const activeColor = useMemo(() => heatColor(intensity), [intensity]);
  const emissiveInt = active ? intensity * 2.2 : 0;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    if (active) {
      // Smooth sine-wave pulse
      const pulse = 1 + Math.sin(clock.elapsedTime * 3.5) * 0.08;
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
          color={active ? activeColor : new THREE.Color('#0f2a4a')}
          emissive={active ? activeColor : new THREE.Color('#000000')}
          emissiveIntensity={emissiveInt}
          transparent
          opacity={active ? 0.92 : 0.38}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Outer glow ring (active only) */}
      {active && (
        <mesh>
          <sphereGeometry args={[region.size * 1.35, 24, 24]} />
          <meshStandardMaterial
            color={activeColor}
            emissive={activeColor}
            emissiveIntensity={intensity * 0.6}
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* HTML label – shown when active or hovered */}
      {(active || hovered) && (
        <Html distanceFactor={8} center style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background:    'rgba(5,11,26,0.88)',
              border:        `1px solid ${active ? '#38bdf8' : '#334155'}`,
              color:         active ? '#bae6fd' : '#94a3b8',
              padding:       '3px 8px',
              borderRadius:  '6px',
              fontSize:      '10px',
              fontFamily:    'Inter, sans-serif',
              fontWeight:    500,
              whiteSpace:    'nowrap',
              boxShadow:     active ? '0 0 12px #38bdf840' : 'none',
            }}
          >
            {region.name}
            {active && <span style={{ marginLeft: 4, opacity: 0.7 }}>
              {Math.round(intensity * 100)}%
            </span>}
          </div>
        </Html>
      )}
    </group>
  );
}

