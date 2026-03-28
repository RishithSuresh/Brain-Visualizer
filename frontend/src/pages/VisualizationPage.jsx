/**
 * VisualizationPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Main interactive page:
 *  • Left panel  – 3D brain canvas (BrainScene)
 *  • Right panel – Emotion selector, intensity slider, region panel
 */
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import useEmotionData from '../hooks/useEmotionData';
import EmotionSelector from '../components/EmotionSelector';
import IntensitySlider  from '../components/IntensitySlider';
import RegionInfoPanel  from '../components/RegionInfoPanel';
import BrainScene       from '../components/Brain3D/BrainScene';
import { EMOTIONS } from '../utils/emotionMappings';

function ActiveEmotionBadge({ emotion }) {
  if (!emotion) return null;
  const meta = EMOTIONS.find(e => e.id === emotion);
  if (!meta) return null;
  return (
    <motion.div
      key={emotion}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5
                 rounded-full text-xs font-semibold backdrop-blur-sm border"
      style={{
        borderColor:     meta.color + '60',
        color:           meta.color,
        backgroundColor: meta.color + '18',
      }}
    >
      {meta.emoji} {meta.label} active
    </motion.div>
  );
}

export default function VisualizationPage() {
  const {
    selectedEmotion, activeRegions, intensityMult,
    setIntensityMult, selectEmotion, loading, source,
  } = useEmotionData();

  return (
    <main className="pt-16 h-screen flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* ── 3D Brain Canvas ─────────────────────────────────── */}
        <div className="relative flex-1 min-h-[55vh] lg:min-h-0"
             style={{ background: 'radial-gradient(ellipse at 50% 40%, #041e30 0%, #020c18 100%)' }}>
          <ActiveEmotionBadge emotion={selectedEmotion} />

          {/* Source badge */}
          {source && (
            <div className="absolute top-4 right-4 z-10 text-xs px-2 py-1 rounded
                            border border-brain-border text-slate-500 bg-brain-panel">
              {source === 'database' ? '🗄️ DB' : '📦 Local'}
            </div>
          )}

          <Suspense fallback={
            <div className="h-full flex items-center justify-center text-slate-500">
              Loading 3D scene…
            </div>
          }>
            <BrainScene activeRegions={activeRegions} />
          </Suspense>

          {/* Overlay hint */}
          {!selectedEmotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none"
            >
              <span className="text-xs text-slate-600 border border-brain-border px-3 py-1.5
                               rounded-full bg-brain-panel">
                🖱 Drag to rotate · Scroll to zoom · Select emotion →
              </span>
            </motion.div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center
                            bg-brain-dark/40 backdrop-blur-sm">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-sky-400"
                    style={{ animation: `bounce 0.8s ${i*0.15}s infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Control Panel ─────────────────────────────── */}
        <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l
                        border-brain-border bg-brain-panel overflow-y-auto">
          <div className="p-5 space-y-6">

            {/* Emotion selector */}
            <EmotionSelector
              selected={selectedEmotion}
              onSelect={selectEmotion}
            />

            <hr className="border-brain-border" />

            {/* Intensity slider */}
            <IntensitySlider value={intensityMult} onChange={setIntensityMult} />

            <hr className="border-brain-border" />

            {/* Region info panel */}
            <RegionInfoPanel
              activeRegions={activeRegions}
              emotion={selectedEmotion}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

