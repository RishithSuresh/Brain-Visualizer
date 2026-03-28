/**
 * EmotionFrequency.jsx
 * ─────────────────────────────────────────────────────────────────
 * Bar chart (Chart.js) displaying how often each emotion has been
 * selected, using each emotion's canonical colour.
 */
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { EMOTIONS } from '../../utils/emotionMappings';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EMOTION_COLORS = Object.fromEntries(EMOTIONS.map(e => [e.id, e.color]));

export default function EmotionFrequency({ frequency = [] }) {
  const labels  = frequency.map(f => f.emotion.charAt(0).toUpperCase() + f.emotion.slice(1));
  const counts  = frequency.map(f => f.count);
  const colors  = frequency.map(f => EMOTION_COLORS[f.emotion] ?? '#6366f1');

  const data = {
    labels,
    datasets: [{
      label: 'Times Selected',
      data:  counts,
      backgroundColor: colors.map(c => c + 'aa'),
      borderColor:     colors,
      borderWidth:     2,
      borderRadius:    6,
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
          label: ctx => ` ${ctx.parsed.y} selection${ctx.parsed.y !== 1 ? 's' : ''}`,
        },
      },
    },
    scales: {
      x: {
        grid:  { color: '#1e3a5f44' },
        ticks: { color: '#94a3b8', font: { size: 12 } },
      },
      y: {
        grid:   { color: '#1e3a5f44' },
        ticks:  { color: '#94a3b8', stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="glass-panel p-5 h-64">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
        Emotion Frequency
      </p>
      {frequency.length === 0
        ? <div className="h-48 flex items-center justify-center text-slate-600 text-sm">
            No data yet – select some emotions to start tracking.
          </div>
        : <div className="h-48">
            <Bar data={data} options={options} />
          </div>
      }
    </div>
  );
}

