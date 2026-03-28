/**
 * BrainRegion.jsx
 * ─────────────────────────────────────────────────────────────────
 * Label-only representation of a brain region.
 * Region colors are now painted directly on the brain mesh surface,
 * so this component only displays active labels.
 */
import { Html } from '@react-three/drei';
export default function BrainRegion({ region, active, intensity }) {
  if (!active) return null;

  return (
    <group position={region.position}>
      <Html distanceFactor={8} center style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(2, 17, 45, 0.9)',
            border: '1px solid #72e0ff',
            color: '#d6f8ff',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: '0 0 14px rgba(114, 224, 255, 0.35)',
          }}
        >
          {region.name}
          <span style={{ marginLeft: 4, opacity: 0.75 }}>
            {Math.round(intensity * 100)}%
          </span>
        </div>
      </Html>
    </group>
  );
}

