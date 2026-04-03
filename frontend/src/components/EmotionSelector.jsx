/**
 * EmotionSelector.jsx
 * ─────────────────────────────────────────────────────────────────
 * Grid of clickable emotion buttons. The active emotion is highlighted.
 * Passes the selected emotion id back via the onSelect callback.
 */
import { motion } from 'framer-motion';
import { EMOTIONS } from '../utils/emotionMappings';

export default function EmotionSelector({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Select Emotion
      </h2>

      <div className="grid grid-cols-1 gap-2">
        {EMOTIONS.map((emotion, i) => {
          const isActive = selected === emotion.id;

          return (
            <motion.button
              key={emotion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1,  x: 0   }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => onSelect(isActive ? null : emotion.id)}
              className={`relative flex items-center gap-3 w-full px-4 py-3 rounded-xl
                          border text-left transition-all duration-200 group
                          ${isActive
                            ? 'border-opacity-60 shadow-lg'
                            : 'border-brain-border bg-brain-panel hover:border-slate-500'
                          }`}
              style={isActive ? {
                borderColor:     emotion.color,
                backgroundColor: `${emotion.color}18`,
                boxShadow:       `0 0 18px ${emotion.color}40`,
              } : {}}
            >
              {/* Emoji icon */}
              <span className="text-xl leading-none flex-shrink-0">{emotion.emoji}</span>

                <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                  {i + 1}
                </span>

              {/* Labels */}
              <div className="flex-1 min-w-0">
                <span
                  className="block text-sm font-semibold"
                  style={{ color: isActive ? emotion.color : '#f1f5f9' }}
                >
                  {emotion.label}
                </span>
                <span className="block text-xs text-slate-500 truncate">{emotion.desc}</span>
              </div>

              {/* Active indicator dot */}
              {isActive && (
                <motion.span
                  layoutId="activeDot"
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: emotion.color }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {selected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-slate-500 text-center pt-1"
        >
          Click the same emotion again to deselect
        </motion.p>
      )}
    </div>
  );
}

