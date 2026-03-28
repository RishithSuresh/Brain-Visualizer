/**
 * AnalyticsPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Dashboard showing:
 *  • Stat cards (total selections, top emotion, avg intensity)
 *  • EmotionFrequency bar chart
 *  • IntensityTrend line chart
 *  • Recent history table
 */
import { motion } from 'framer-motion';
import useHistory from '../hooks/useHistory';
import EmotionFrequency from '../components/Analytics/EmotionFrequency';
import IntensityTrend   from '../components/Analytics/IntensityTrend';
import { EMOTIONS } from '../utils/emotionMappings';

const EMOTION_META = Object.fromEntries(EMOTIONS.map(e => [e.id, e]));

function StatCard({ icon, label, value, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-4 flex flex-col gap-1"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-xs font-semibold text-slate-300">{label}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </motion.div>
  );
}

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AnalyticsPage() {
  const { history, frequency, trend, loading, error, refresh } = useHistory();

  const totalSelections = frequency.reduce((a, f) => a + parseInt(f.count), 0);
  const topEmotion = frequency[0];
  const avgIntensity = history.length
    ? (history.reduce((a, h) => a + parseFloat(h.intensity_multiplier), 0) / history.length * 100).toFixed(0)
    : '—';

  return (
    <main className="pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="section-title">Analytics Dashboard</h1>
          <p className="section-sub">Emotion selection frequency and intensity trends</p>
        </div>
        <button onClick={refresh} disabled={loading}
          className="btn-ghost flex items-center gap-2 text-xs">
          {loading ? '⏳ Loading…' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg border border-amber-500/30 bg-amber-500/10
                        text-amber-400 text-sm flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🎯" label="Total Selections" value={totalSelections || '—'} />
        <StatCard icon="🏆" label="Top Emotion"
          value={topEmotion ? (EMOTION_META[topEmotion.emotion]?.emoji + ' ' + topEmotion.emotion) : '—'}
          sub={topEmotion ? `${topEmotion.count} times` : ''} />
        <StatCard icon="⚡" label="Avg Intensity"
          value={avgIntensity !== '—' ? `${avgIntensity}%` : '—'}
          sub="across all sessions" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <EmotionFrequency frequency={frequency} />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <IntensityTrend trend={trend} />
        </motion.div>
      </div>

      {/* History table */}
      <div className="glass-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-brain-border">
          <h2 className="text-sm font-semibold text-white">Recent History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-brain-border">
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Emotion</th>
                <th className="px-5 py-3 text-left">Intensity</th>
                <th className="px-5 py-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 20).map((row, i) => {
                const meta = EMOTION_META[row.emotion];
                return (
                  <tr key={row.id ?? i}
                    className="border-b border-brain-border/40 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-slate-600 font-mono text-xs">{i + 1}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ color: meta?.color ?? '#94a3b8', background: (meta?.color ?? '#6366f1') + '18' }}>
                        {meta?.emoji} {row.emotion}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-full heatmap-bar"
                            style={{ width: `${parseFloat(row.intensity_multiplier) * 100}%` }} />
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {Math.round(parseFloat(row.intensity_multiplier) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 font-mono">
                      {formatDate(row.timestamp)}
                    </td>
                  </tr>
                );
              })}
              {history.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-600">
                  No history yet – go select some emotions!
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

