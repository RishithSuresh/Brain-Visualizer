/**
 * IntensitySlider.jsx
 * ─────────────────────────────────────────────────────────────────
 * A styled range slider that controls the intensity multiplier
 * applied to all active brain region activations (0.1 – 1.0).
 */
import { motion } from 'framer-motion';

export default function IntensitySlider({ value, onChange }) {
  const pct = Math.round(value * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Intensity Multiplier
        </h2>
        <motion.span
          key={pct}
          initial={{ scale: 1.3, color: '#38bdf8' }}
          animate={{ scale: 1,   color: '#f1f5f9' }}
          className="text-sm font-mono font-bold"
        >
          {pct}%
        </motion.span>
      </div>

      {/* Heatmap gradient track */}
      <div className="relative">
        <div className="h-2 rounded-full heatmap-bar opacity-30" />
        <input
          type="range"
          min={0.1}
          max={1.0}
          step={0.01}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          style={{ zIndex: 10 }}
        />
        {/* Visible thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2
                     border-sky-400 bg-brain-dark shadow-lg shadow-sky-400/40
                     transition-all duration-75"
          style={{ left: `calc(${((value - 0.1) / 0.9) * 100}% - 8px)` }}
        />
        {/* Filled portion */}
        <div
          className="absolute top-0 left-0 h-2 rounded-full heatmap-bar"
          style={{ width: `${((value - 0.1) / 0.9) * 100}%` }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-slate-600 font-mono">
        <span>10%</span>
        <span>100%</span>
      </div>

      {/* Intensity level description */}
      <p className="text-xs text-slate-500 text-center">
        {value < 0.4
          ? '🔵 Low activation – subtle response'
          : value < 0.7
          ? '🟡 Moderate activation – clear signal'
          : '🔴 High activation – strong response'}
      </p>
    </div>
  );
}

