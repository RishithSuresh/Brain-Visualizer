/**
 * BrainScene.jsx
 * ─────────────────────────────────────────────────────────────────
 * Main React Three Fiber scene containing:
 *   • A translucent holographic brain shell from brain.glb
 *   • Internal neural-like line structures and glowing nodes
 *   • Region activation markers positioned in 3D space
 *   • Bloom post-processing and orbit controls
 */
import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import BrainRegion from './BrainRegion';
import { BRAIN_REGION_DATA } from '../../utils/emotionMappings';

/**
 * Normalizes imported model size and center so it fits the camera consistently.
 */
function normalizeModel(object, targetSize = 3.9) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;

  object.position.sub(center);
  object.scale.multiplyScalar(scale);
  object.rotation.y += Math.PI;
}

const EMOTION_COLORS = {
  pain: '#a855f7',
  happiness: '#fde047',
  anger: '#ff0000',
  fear: '#ec4899',
  sadness: '#2125f9',
};

function getAnatomicalZone(x, y, z) {
  // High-resolution lobe zones in normalized local model space.
  // Frontal: anterior, high
  if (z > 0.68 && y > -0.2) return 'frontal';
  // Occipital: posterior, high
  if (z < -0.62 && y > -0.28) return 'occipital';
  // Temporal: lateral, low-mid
  if (Math.abs(x) > 0.52 && y < 0.08) return 'temporal';
  // Parietal: superior-posterior
  if (y > 0.34 && z < 0.5 && z > -0.5) return 'parietal';
  // Limbic + deep structures: medial-inferior
  if (y > -0.22 && z > -0.28 && z < 0.58) {
    // Hippocampus: posterior-lateral-deep
    if (z < -0.08 && Math.abs(x) > 0.35) return 'limbic';
    // Amygdala: lateral-inferior
    if (y < -0.15 && Math.abs(x) > 0.4) return 'limbic';
    // Prefrontal extension: anterior-deep
    if (z > 0.35 && y > 0.1) return 'frontal';
    return 'limbic';
  }
  // Deep brain structures: thalamus, hypothalamus
  return 'deep';
}

function emotionIntensityColor(t) {
  const clamped = Math.max(0, Math.min(1, t));
  if (clamped < 0.5) {
    const s = clamped * 2;
    return new THREE.Color(
      0.3 + s * 0.9,
      0.7 + s * 0.3,
      1.0 - s * 0.4,
    );
  }
  const s = (clamped - 0.5) * 2;
  return new THREE.Color(1.0, 0.85 - s * 0.65, 0.15 - s * 0.15);
}

function mapActiveRegionsToZones(activeRegions = []) {
  const zoneIntensities = {
    frontal: 0,
    parietal: 0,
    temporal: 0,
    occipital: 0,
    limbic: 0,
    deep: 0,
  };

  activeRegions.forEach((entry) => {
    const name = String(entry?.name || '').toLowerCase();
    const intensity = Math.max(0, Math.min(1, Number(entry?.intensity || 0)));
    if (!name || intensity <= 0) return;

    const apply = (zone) => {
      zoneIntensities[zone] = Math.max(zoneIntensities[zone], intensity);
    };

    if (name.includes('prefrontal')) {
      apply('frontal');
      apply('limbic');
    }
    if (name.includes('anterior cingulate')) apply('limbic');
    if (name.includes('amygdala')) {
      apply('limbic');
      apply('temporal');
    }
    if (name.includes('hippocampus')) {
      apply('limbic');
      apply('parietal');
    }
    if (name.includes('insula')) apply('temporal');
    if (name.includes('dopamine')) {
      apply('limbic');
      apply('deep');
      apply('temporal');
    }
    if (name.includes('thalamus')) apply('deep');
    if (name.includes('hypothalamus')) apply('deep');
  });

  return zoneIntensities;
}

function getEmotionColor(selectedEmotion) {
  return new THREE.Color(EMOTION_COLORS[selectedEmotion] || '#ffffff');
}

function applyActivationOverlay(root, zoneIntensities, selectedEmotion) {
  const emotionColor = getEmotionColor(selectedEmotion);
  const isFear = selectedEmotion === 'fear';

  root.traverse((child) => {
    if (!child.isMesh || !child.geometry?.attributes?.position) return;

    const geometry = child.geometry.clone();
    const positions = geometry.attributes.position;
    const colorArray = new Float32Array(positions.count * 3);

    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      const zone = getAnatomicalZone(x, y, z);
      const zoneIntensity = zoneIntensities[zone] || 0;

      if (zoneIntensity > 0) {
        const boosted = emotionColor.clone().multiplyScalar(0.55 + zoneIntensity * 0.9);
        colorArray[i * 3] = boosted.r;
        colorArray[i * 3 + 1] = boosted.g;
        colorArray[i * 3 + 2] = boosted.b;
        continue;
      }

      colorArray[i * 3] = 0;
      colorArray[i * 3 + 1] = 0;
      colorArray[i * 3 + 2] = 0;
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArray, 3));
    child.geometry = geometry;
  });
}

function BrainModel({ mode = 'classic', activeRegions = [], selectedEmotion = null }) {
  const modelPath = mode === 'holographic' ? '/models/brain_hologram.glb' : '/models/brain.glb';
  const { scene } = useGLTF(modelPath);

  const layers = useMemo(() => {
    const normalizedRoot = scene.clone(true);
    normalizeModel(normalizedRoot);

    const isHolographic = mode === 'holographic';
    const isFear = selectedEmotion === 'fear';
    const zoneIntensities = mapActiveRegionsToZones(activeRegions);
    const activationRoot = normalizedRoot.clone(true);
    applyActivationOverlay(activationRoot, zoneIntensities, selectedEmotion);

    const surfaceMaterial = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      vertexColors: false,
      emissive: '#ffffff',
      emissiveIntensity: isHolographic ? 0.05 : 0.03,
      transparent: true,
      opacity: isHolographic ? 0.82 : 0.78,
      roughness: isHolographic ? 0.24 : 0.3,
      metalness: 0.01,
      transmission: isHolographic ? 0.7 : 0.66,
      thickness: 0.35,
      ior: 1.18,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      depthWrite: false,
    });

    const innerGlowMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: isHolographic ? 0.06 : 0.04,
      transparent: true,
      opacity: isHolographic ? 0.01 : 0.008,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const activationMaterial = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      vertexColors: true,
      transparent: true,
      opacity: isFear ? 0.9 : (isHolographic ? 0.9 : 0.86),
      blending: isFear ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
      // Keep the classic mesh visual language on both models.
      color: '#ffffff',
      transparent: true,
      opacity: isHolographic ? 0.08 : 0.06,
      wireframe: true,
      depthWrite: false,
    });

    const makeLayer = (material, sourceRoot = normalizedRoot, scale = 1) => {
      const layer = sourceRoot.clone(true);
      layer.scale.multiplyScalar(scale);
      layer.traverse((child) => {
        if (child.isMesh) {
          child.material = material;
          child.renderOrder = 1;
        }
      });
      return layer;
    };

    return {
      shell: makeLayer(surfaceMaterial),
      glow: makeLayer(innerGlowMaterial),
      activation: makeLayer(activationMaterial, activationRoot, 1.015),
      wire: makeLayer(wireMaterial),
    };
  }, [scene, mode, activeRegions, selectedEmotion]);

  return (
    <group>
      <primitive object={layers.shell} />
      <primitive object={layers.glow} />
      <primitive object={layers.activation} />
      <primitive object={layers.wire} />
    </group>
  );
}

// Preload the model as soon as the module is imported
useGLTF.preload('/models/brain.glb');
useGLTF.preload('/models/brain_hologram.glb');

/** Slowly auto-rotates the whole brain; user can override via OrbitControls */
function RotatingGroup({ activeRegions, mode, selectedEmotion }) {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <BrainModel mode={mode} activeRegions={activeRegions} selectedEmotion={selectedEmotion} />
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

export default function BrainScene({ activeRegions = [], mode = 'classic', selectedEmotion = null }) {
  const isHolographic = mode === 'holographic';

  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{
        background: isHolographic
          ? 'radial-gradient(ellipse at 50% 35%, #0f4c8d 0%, #072856 45%, #03122f 100%)'
          : 'radial-gradient(ellipse at 50% 35%, #10348f 0%, #041247 45%, #01071f 100%)',
      }}
    >
      <color attach="background" args={[isHolographic ? '#03122f' : '#01071f']} />

      <ambientLight intensity={isHolographic ? 0.45 : 0.4} color="#ffffff" />
      <pointLight position={[0, 3.8, 4]} intensity={isHolographic ? 1.3 : 1.1} color="#ffffff" />
      <pointLight position={[-4, 1.2, -3]} intensity={isHolographic ? 0.55 : 0.45} color="#ffffff" />
      <pointLight position={[4, -1.5, 2.5]} intensity={isHolographic ? 0.45 : 0.35} color="#ffffff" />

      <Stars radius={55} depth={45} count={isHolographic ? 3000 : 2200} factor={2.5} fade speed={0.6} />

      <Suspense fallback={null}>
        <RotatingGroup activeRegions={activeRegions} mode={mode} selectedEmotion={selectedEmotion} />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={isHolographic ? 0.95 : 1.15}
          luminanceThreshold={isHolographic ? 0.18 : 0.14}
          luminanceSmoothing={0.88}
          mipmapBlur
        />
      </EffectComposer>

      {/* User orbit controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3.2}
        maxDistance={9}
        autoRotate={false}
      />
    </Canvas>
  );
}

