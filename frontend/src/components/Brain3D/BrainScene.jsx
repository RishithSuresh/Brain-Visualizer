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
import { OrbitControls, Line, Stars, useGLTF } from '@react-three/drei';
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

function randomPointInEllipsoid(rand, rx, ry, rz) {
  let x = 0;
  let y = 0;
  let z = 0;
  do {
    x = rand() * 2 - 1;
    y = rand() * 2 - 1;
    z = rand() * 2 - 1;
  } while (x * x + y * y + z * z > 1);
  return new THREE.Vector3(x * rx, y * ry, z * rz);
}

function createStableRandom(seedStart = 7) {
  let seed = seedStart;
  return () => {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function NeuralStructures({ mode = 'classic' }) {
  const { pathways, nodes } = useMemo(() => {
    const rand = createStableRandom(7);

    const generatedPathways = [];
    const pathCount = mode === 'holographic' ? 86 : 42;
    const pointCount = mode === 'holographic' ? 30 : 24;
    for (let i = 0; i < pathCount; i += 1) {
      const start = randomPointInEllipsoid(rand, 1.15, 0.85, 1.45);
      const end = randomPointInEllipsoid(rand, 1.15, 0.85, 1.45);
      const mid = start.clone().add(end).multiplyScalar(0.5).add(
        new THREE.Vector3(
          (rand() * 2 - 1) * 0.35,
          (rand() * 2 - 1) * 0.25,
          (rand() * 2 - 1) * 0.35,
        ),
      );

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      generatedPathways.push(curve.getPoints(pointCount));
    }

    const generatedNodes = [];
    const nodeCount = mode === 'holographic' ? 85 : 80;
    for (let i = 0; i < nodeCount; i += 1) {
      generatedNodes.push(randomPointInEllipsoid(rand, 1.2, 0.9, 1.5));
    }

    return { pathways: generatedPathways, nodes: generatedNodes };
  }, [mode]);

  const lineColor = mode === 'holographic' ? '#8df5ff' : '#8ae8ff';
  const lineOpacity = mode === 'holographic' ? 0.52 : 0.35;
  const nodeColor = mode === 'holographic' ? '#d7ffff' : '#baf6ff';
  const nodeOpacity = mode === 'holographic' ? 0.95 : 0.9;
  const nodeSize = mode === 'holographic' ? 0.03 : 0.028;

  return (
    <group>
      {pathways.map((points, i) => (
        <Line
          key={`path-${i}`}
          points={points}
          color={lineColor}
          transparent
          opacity={lineOpacity}
          lineWidth={0.65}
        />
      ))}
      {nodes.map((position, i) => (
        <mesh key={`node-${i}`} position={position}>
          <sphereGeometry args={[nodeSize, 10, 10]} />
          <meshBasicMaterial color={nodeColor} transparent opacity={nodeOpacity} />
        </mesh>
      ))}
    </group>
  );
}

function BrainModel({ mode = 'classic' }) {
  const modelPath = mode === 'holographic' ? '/models/brain_hologram.glb' : '/models/brain.glb';
  const { scene } = useGLTF(modelPath);

  const layers = useMemo(() => {
    const normalizedRoot = scene.clone(true);
    normalizeModel(normalizedRoot);

    const isHolographic = mode === 'holographic';

    const surfaceMaterial = new THREE.MeshPhysicalMaterial({
      color: isHolographic ? '#6ad2ff' : '#8dd9ff',
      emissive: isHolographic ? '#7be7ff' : '#53ccff',
      emissiveIntensity: isHolographic ? 1.25 : 0.75,
      transparent: true,
      opacity: isHolographic ? 0.2 : 0.16,
      roughness: isHolographic ? 0.08 : 0.2,
      metalness: 0.06,
      transmission: isHolographic ? 0.98 : 0.95,
      thickness: 0.35,
      ior: 1.18,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      depthWrite: false,
    });

    const innerGlowMaterial = new THREE.MeshStandardMaterial({
      color: isHolographic ? '#93ecff' : '#6fd8ff',
      emissive: isHolographic ? '#75e4ff' : '#4ad0ff',
      emissiveIntensity: isHolographic ? 2.0 : 1.4,
      transparent: true,
      opacity: isHolographic ? 0.17 : 0.12,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
      // Keep the classic mesh visual language on both models.
      color: '#a8edff',
      transparent: true,
      opacity: isHolographic ? 0.16 : 0.13,
      wireframe: true,
      depthWrite: false,
    });

    const makeLayer = (material) => {
      const layer = normalizedRoot.clone(true);
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
      wire: makeLayer(wireMaterial),
    };
  }, [scene, mode]);

  return (
    <group>
      <primitive object={layers.shell} />
      <primitive object={layers.glow} />
      <primitive object={layers.wire} />
      <NeuralStructures mode={mode} />
    </group>
  );
}

// Preload the model as soon as the module is imported
useGLTF.preload('/models/brain.glb');
useGLTF.preload('/models/brain_hologram.glb');

/** Slowly auto-rotates the whole brain; user can override via OrbitControls */
function RotatingGroup({ activeRegions, mode }) {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <BrainModel mode={mode} />
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

export default function BrainScene({ activeRegions = [], mode = 'classic' }) {
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

      <ambientLight intensity={isHolographic ? 0.28 : 0.22} color={isHolographic ? '#2a73ce' : '#264fbe'} />
      <pointLight position={[0, 3.8, 4]} intensity={isHolographic ? 2.6 : 2.1} color="#8ce7ff" />
      <pointLight position={[-4, 1.2, -3]} intensity={isHolographic ? 1.5 : 1.2} color="#4ca6ff" />
      <pointLight position={[4, -1.5, 2.5]} intensity={isHolographic ? 1.2 : 0.9} color="#2f81ff" />

      <Stars radius={55} depth={45} count={isHolographic ? 3000 : 2200} factor={2.5} fade speed={0.6} />

      <Suspense fallback={null}>
        <RotatingGroup activeRegions={activeRegions} mode={mode} />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={isHolographic ? 3.0 : 2.4}
          luminanceThreshold={isHolographic ? 0.05 : 0.07}
          luminanceSmoothing={0.92}
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

