/**
 * IntensityTrend.jsx
 * ─────────────────────────────────────────────────────────────────
 * Line chart (Chart.js) showing intensity multipliers over time
 * for the most recent emotion selections.
 */
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { EMOTIONS } from '../../utils/emotionMappings';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const EMOTION_COLORS = Object.fromEntries(EMOTIONS.map(e => [e.id, e.color]));

function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function IntensityTrend({ trend = [] }) {
  const reversed = [...trend].reverse(); // show oldest → newest left to right

  const labels   = reversed.map(r => formatTime(r.timestamp));
  const values   = reversed.map(r => parseFloat(r.intensity_multiplier).toFixed(2));
  const ptColors = reversed.map(r => EMOTION_COLORS[r.emotion] ?? '#6366f1');

  const data = {
    labels,
    datasets: [{
      label:           'Intensity Multiplier',
      data:            values,
      borderColor:     '#38bdf8',
      backgroundColor: 'rgba(56,189,248,0.08)',
      pointBackgroundColor: ptColors,
      pointBorderColor:     ptColors,
      pointRadius:     5,
      pointHoverRadius:7,
      borderWidth:     2,
      tension:         0.4,
      fill:            true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend:  { display: false },
      tooltip: {
        backgroundColor: '#0d1b2e',
        borderColor:     '#1e3a5f',
        borderWidth:     1,
        titleColor:      '#f1f5f9',
        bodyColor:       '#94a3b8',
        callbacks: {
          label: ctx => ` Intensity: ${Math.round(ctx.parsed.y * 100)}%`,
          afterLabel: (ctx) => {
            const item = reversed[ctx.dataIndex];
            return item ? ` Emotion: ${item.emotion}` : '';
          },
        },
      },
    },
    scales: {
      x: {
        grid:  { color: '#1e3a5f33' },
        ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 8 },
      },
      y: {
        grid:   { color: '#1e3a5f33' },
        ticks:  { color: '#94a3b8', callback: v => `${Math.round(v * 100)}%` },
        min:    0,
        max:    1.05,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="glass-panel p-5 h-64">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
        Intensity Trend (recent 30)
      </p>
      {trend.length === 0
        ? <div className="h-48 flex items-center justify-center text-slate-600 text-sm">
            No trend data yet.
          </div>
        : <div className="h-48">
            <Line data={data} options={options} />
          </div>
      }
    </div>
  );
}

