/**
 * AnalyticsPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Dashboard showing:
 *  • Stat cards and insight snapshots
 *  • Emotion mix breakdown and trend charts
 *  • EmotionFrequency bar chart
 *  • IntensityTrend line chart
 *  • Recent history table
 */
import { motion } from 'framer-motion';
import useHistory from '../hooks/useHistory';
import EmotionFrequency from '../components/Analytics/EmotionFrequency';
import IntensityTrend   from '../components/Analytics/IntensityTrend';
import { useToast } from '../hooks/useToast';
import { EMOTIONS } from '../utils/emotionMappings';
import { formatExactTime, formatRelativeTime } from '../utils/dateUtils';

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

function SectionCard({ title, eyebrow, children, className = '' }) {
  return (
    <div className={`glass-panel overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-brain-border flex items-center justify-between gap-3">
        <div>
          {eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 mb-1">{eyebrow}</p>}
          <h2 className="text-sm font-semibold text-white">{title}</h2>
        </div>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { history, frequency, trend, loading, clearing, error, refresh, clearHistory } = useHistory();
  const { pushToast } = useToast();

  const totalSelections = frequency.reduce((a, f) => a + parseInt(f.count), 0);
  const topEmotion = frequency[0];
  const topEmotionMeta = topEmotion ? EMOTION_META[topEmotion.emotion] : null;
  const avgIntensity = history.length
    ? (history.reduce((a, h) => a + parseFloat(h.intensity_multiplier), 0) / history.length * 100).toFixed(0)
    : '—';
  const emotionDiversity = frequency.length;
  const topShare = totalSelections && topEmotion ? Math.round((Number(topEmotion.count) / totalSelections) * 100) : 0;
  const mostIntenseSelection = history.length
    ? history.reduce((max, row) => (parseFloat(row.intensity_multiplier) > parseFloat(max.intensity_multiplier) ? row : max), history[0])
    : null;
  const latestSelection = history[0] || null;
  const oldestSelection = history.length ? history[history.length - 1] : null;
  const activeRangeDays = history.length >= 2
    ? Math.max(1, Math.round((new Date(history[0].timestamp) - new Date(history[history.length - 1].timestamp)) / (1000 * 60 * 60 * 24)))
    : 0;
  const recentHistory = history.slice(0, 5);
  const sortedFrequency = [...frequency].sort((a, b) => b.count - a.count);
  const strongestTrend = trend.length
    ? trend.reduce((max, row) => (parseFloat(row.intensity_multiplier) > parseFloat(max.intensity_multiplier) ? row : max), trend[0])
    : null;

  const insightNotes = [
    latestSelection && {
      icon: '🕒',
      title: 'Latest selection',
      value: `${EMOTION_META[latestSelection.emotion]?.emoji || ''} ${latestSelection.emotion}`.trim(),
      sub: `Saved ${formatRelativeTime(latestSelection.timestamp)}`,
    },
    mostIntenseSelection && {
      icon: '🔥',
      title: 'Peak intensity',
      value: `${Math.round(parseFloat(mostIntenseSelection.intensity_multiplier) * 100)}%`,
      sub: `${EMOTION_META[mostIntenseSelection.emotion]?.label || mostIntenseSelection.emotion} recorded the strongest signal`,
    },
    strongestTrend && {
      icon: '📈',
      title: 'Trend anchor',
      value: `${EMOTION_META[strongestTrend.emotion]?.label || strongestTrend.emotion}`,
      sub: `Highest point inside the latest 30-session window`,
    },
  ].filter(Boolean);

  const handleClearHistory = async () => {
    if (!history.length) return;

    const confirmed = window.confirm('Clear all saved history entries? This cannot be undone.');
    if (!confirmed) return;

    const result = await clearHistory();
    if (result) {
      pushToast({
        title: 'History cleared',
        description: 'Analytics data has been reset.',
        tone: 'success',
      });
      return;
    }

    pushToast({
      title: 'Clear failed',
      description: 'The server could not remove the saved history.',
      tone: 'error',
    });
  };

  return (
    <main className="pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="section-title">Analytics Dashboard</h1>
          <p className="section-sub">Emotion selection frequency, intensity trends, and session insights</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleClearHistory} disabled={clearing || loading || !history.length}
            className="btn-ghost flex items-center gap-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
            {clearing ? '🧹 Clearing…' : '🧹 Clear history'}
          </button>
          <button onClick={refresh} disabled={loading || clearing}
            className="btn-ghost flex items-center gap-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? '⏳ Loading…' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      <SectionCard title="Snapshot" eyebrow="At a glance" className="mb-6">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-4 items-stretch">
          <div className="rounded-2xl border border-brain-border bg-white/[0.02] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Session pulse</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon="🎯" label="Total Selections" value={totalSelections || '—'} sub="all saved interactions" />
              <StatCard icon="🏆" label="Top Emotion" value={topEmotion ? `${topEmotionMeta?.emoji || ''} ${topEmotion.emotion}`.trim() : '—'} sub={topEmotion ? `${topEmotion.count} picks · ${topShare}% share` : ''} />
              <StatCard icon="⚡" label="Avg Intensity" value={avgIntensity !== '—' ? `${avgIntensity}%` : '—'} sub="across all sessions" />
              <StatCard icon="🧭" label="Emotion Diversity" value={emotionDiversity || '—'} sub="unique emotions represented" />
              <StatCard icon="🗓️" label="Active Range" value={activeRangeDays ? `${activeRangeDays}d` : '—'} sub="between first and last saved entry" />
              <StatCard icon="📌" label="Latest Entry" value={latestSelection ? `${EMOTION_META[latestSelection.emotion]?.emoji || ''} ${latestSelection.emotion}`.trim() : '—'} sub={latestSelection ? formatRelativeTime(latestSelection.timestamp) : ''} />
            </div>
          </div>

          <div className="rounded-2xl border border-brain-border bg-white/[0.02] p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Insight notes</p>
            {insightNotes.length ? insightNotes.map((note) => (
              <div key={note.title} className="rounded-xl border border-brain-border/70 bg-slate-950/30 p-3 flex items-start gap-3">
                <span className="text-lg leading-none">{note.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{note.title}</div>
                  <div className="text-sm text-slate-200">{note.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{note.sub}</div>
                </div>
              </div>
            )) : (
              <div className="h-full min-h-[160px] flex items-center justify-center text-slate-600 text-sm">
                Select a few emotions to unlock dashboard insights.
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Emotion Mix" eyebrow="Distribution" className="mb-8">
        {sortedFrequency.length ? (
          <div className="space-y-3">
            {sortedFrequency.map((item) => {
              const meta = EMOTION_META[item.emotion];
              const share = totalSelections ? Math.round((Number(item.count) / totalSelections) * 100) : 0;
              return (
                <div key={item.emotion} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <span>{meta?.emoji}</span>
                      <span>{meta?.label ?? item.emotion}</span>
                    </div>
                    <div className="text-slate-500 font-mono">
                      {item.count} selections · {share}%
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full heatmap-bar"
                      style={{ width: `${share}%`, background: meta?.color ?? '#38bdf8' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-600 text-sm">
            No distribution data yet. Start selecting emotions to populate this view.
          </div>
        )}
      </SectionCard>

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
          value={topEmotion ? `${topEmotionMeta?.emoji || ''} ${topEmotion.emotion}`.trim() : '—'}
          sub={topEmotion ? `${topEmotion.count} times · ${topShare}% share` : ''} />
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

      <SectionCard title="Recent Activity" eyebrow="Latest 5" className="mb-8">
        {recentHistory.length ? (
          <div className="space-y-3">
            {recentHistory.map((row, index) => {
              const meta = EMOTION_META[row.emotion];
              return (
                <div key={row.id ?? index} className="flex items-center justify-between gap-4 rounded-xl border border-brain-border/70 bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-slate-600 w-5">#{index + 1}</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ color: meta?.color ?? '#94a3b8', background: (meta?.color ?? '#6366f1') + '18' }}>
                      {meta?.emoji} {row.emotion}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="font-mono">{Math.round(parseFloat(row.intensity_multiplier) * 100)}%</span>
                    <span className="font-mono">{formatRelativeTime(row.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-600 text-sm">
            No recent activity yet.
          </div>
        )}
      </SectionCard>

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
                      <div title={formatExactTime(row.timestamp)}>
                        {formatRelativeTime(row.timestamp)}
                      </div>
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

