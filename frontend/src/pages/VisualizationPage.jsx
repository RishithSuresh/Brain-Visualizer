/**
 * VisualizationPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Main interactive page:
 *  • Left panel  – 3D brain canvas (BrainScene)
 *  • Right panel – Emotion selector, intensity slider, region panel, session insight
 */
import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useEmotionData from '../hooks/useEmotionData';
import useHistory from '../hooks/useHistory';
import EmotionSelector from '../components/EmotionSelector';
import IntensitySlider  from '../components/IntensitySlider';
import RegionInfoPanel  from '../components/RegionInfoPanel';
import BrainScene       from '../components/Brain3D/BrainScene';
import { EMOTIONS, EMOTION_RESEARCH_NOTES } from '../utils/emotionMappings';

function buildSessionInsight(history, frequency, selectedEmotion, intensityMult) {
  const selectedMeta = EMOTIONS.find((emotion) => emotion.id === selectedEmotion);
  const dominant = frequency?.[0];
  const dominantMeta = EMOTIONS.find((emotion) => emotion.id === dominant?.emotion);
  const recent = history?.slice(0, 4) ?? [];
  const recentLabels = recent
    .map((entry) => EMOTIONS.find((emotion) => emotion.id === entry.emotion)?.label || entry.emotion)
    .filter(Boolean);

  const dominantLabel = dominantMeta?.label || dominant?.emotion || 'no dominant pattern yet';
  const selectedNote = selectedEmotion ? EMOTION_RESEARCH_NOTES[selectedEmotion] : null;
  const selectedLabel = selectedMeta?.label || 'No emotion selected';

  let headline = 'Start tracing your emotional footprint';
  let summary = 'Pick an emotion to activate the brain map and compare it with the recent session history.';
  let guidance = 'Use the number keys or the selector grid to jump between emotions quickly.';

  if (recent.length) {
    headline = `Recent activity leans toward ${dominantLabel}`;
    summary = `Across the latest ${history.length} selections, ${dominantLabel} appears most often. That suggests a repeating theme rather than a single isolated state.`;
    guidance = `A current ${selectedLabel.toLowerCase()} selection at ${(intensityMult * 100).toFixed(0)}% intensity can be read alongside the recent trail to spot whether the session is stabilizing or staying reactive.`;
  }

  if (selectedNote?.summary) {
    guidance = `${selectedNote.summary} ${guidance}`;
  }

  return {
    headline,
    summary,
    guidance,
    dominantLabel,
    recentLabels,
    selectedLabel,
  };
}

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
  const [researchMode, setResearchMode] = useState(true);
  const { history, frequency, loading: historyLoading } = useHistory();

  const {
    selectedEmotion, activeRegions, intensityMult,
    setIntensityMult, selectEmotion, loading, source,
  } = useEmotionData();

  const insight = buildSessionInsight(history, frequency, selectedEmotion, intensityMult);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const index = Number(event.key) - 1;
      if (index < 0 || index >= EMOTIONS.length) return;

      selectEmotion(selectedEmotion === EMOTIONS[index].id ? null : EMOTIONS[index].id);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectEmotion, selectedEmotion]);

  return (
    <main className="pt-16 h-screen flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* ── 3D Brain Canvas ─────────────────────────────────── */}
        <div className="relative flex-1 min-h-[55vh] lg:min-h-0"
             style={{ background: 'radial-gradient(ellipse at 50% 40%, #041e30 0%, #020c18 100%)' }}>
          <ActiveEmotionBadge emotion={selectedEmotion} />

          <button
            type="button"
            onClick={() => setResearchMode((value) => !value)}
            className={`absolute top-16 left-1/2 -translate-x-1/2 z-10 px-3 py-1 text-xs rounded-full border backdrop-blur-sm transition ${
              researchMode
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                : 'border-slate-600 bg-brain-panel/85 text-slate-400'
            }`}
          >
            Research mode {researchMode ? 'on' : 'off'}
          </button>

          {/* Source badge */}
          {source && (
            <div className="absolute top-4 right-4 z-10 text-xs px-2 py-1 rounded
                            border border-brain-border text-slate-500 bg-brain-panel">
              {source === 'local' ? '📦 Local' : source}
            </div>
          )}

          <Suspense fallback={
            <div className="h-full flex items-center justify-center text-slate-500">
              Loading 3D scene…
            </div>
          }>
            <BrainScene activeRegions={activeRegions} selectedEmotion={selectedEmotion} />
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
              researchMode={researchMode}
            />

            <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-slate-950/90 via-slate-900/75 to-cyan-950/30 p-4 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                    Session insight
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-slate-100">
                    {insight.headline}
                  </h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                  {historyLoading ? 'Syncing' : `${history.length} traces`}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {insight.summary}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">Dominant</span>
                  <span className="mt-1 block text-sm font-semibold text-cyan-200">{insight.dominantLabel}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">Current</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-100">{insight.selectedLabel}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">Intensity</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-100">{Math.round(intensityMult * 100)}%</span>
                </div>
              </div>

              {insight.recentLabels.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {insight.recentLabels.map((label, index) => (
                    <span
                      key={`${label}-${index}`}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm leading-6 text-slate-300">
                {insight.guidance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

