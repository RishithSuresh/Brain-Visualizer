/**
 * RegionInfoPanel.jsx
 * ─────────────────────────────────────────────────────────────────
 * Displays a list of currently active brain regions with their
 * intensity bars, descriptions, and a colour-coded heat indicator.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { intensityToColor, EMOTION_RESEARCH_NOTES } from '../utils/emotionMappings';
import { BRAIN_REGION_DATA } from '../utils/emotionMappings';

function getDesc(regionName) {
  const found = BRAIN_REGION_DATA.find(r => r.name === regionName);
  return found?.desc ?? '';
}

export default function RegionInfoPanel({ activeRegions, emotion, researchMode = true }) {
  if (!emotion) {
    return (
      <div className="glass-panel p-4 text-center text-slate-500 text-sm">
        <div className="text-3xl mb-2">🧠</div>
        <p>Select an emotion above to activate brain regions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Active Brain Regions
      </h2>

      {researchMode && EMOTION_RESEARCH_NOTES[emotion] && (
        <div className="glass-panel p-3 space-y-2 border border-slate-700/60">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Research basis
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-600 text-slate-400 bg-slate-900/60">
              {EMOTION_RESEARCH_NOTES[emotion].confidence}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-snug">
            {EMOTION_RESEARCH_NOTES[emotion].summary}
          </p>
          <ul className="space-y-1 text-xs text-slate-500 leading-snug list-disc pl-4">
            {EMOTION_RESEARCH_NOTES[emotion].bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {activeRegions.map((region, i) => {
          const color = intensityToColor(region.intensity);
          const pct   = Math.round(region.intensity * 100);
          const desc  = region.desc || getDesc(region.name);

          return (
            <motion.div
              key={region.name + '-' + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              exit={{ opacity: 0, y: -10   }}
              transition={{ delay: i * 0.07 }}
              className="glass-panel p-3 space-y-2"
            >
              {/* Region header */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color }}
                >
                  {region.name}
                </span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: `${color}22`,
                    color,
                    border:          `1px solid ${color}66`,
                  }}
                >
                  {pct}%
                </span>
              </div>

              {/* Intensity bar */}
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full heatmap-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              {/* Description */}
              {desc && (
                <p className="text-xs text-slate-500 leading-snug">{desc}</p>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {activeRegions.length === 0 && (
        <p className="text-xs text-slate-600 text-center">No regions mapped.</p>
      )}
    </div>
  );
}

