/**
 * HomePage.jsx – Landing / hero page
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: '🧠', title: '3D Brain Model',     desc: 'Interact with a real-time 3D visualisation of brain anatomy rendered via WebGL.' },
  { icon: '⚡', title: 'Live Activation',    desc: 'Watch brain regions light up with heatmap colouring as emotions change.' },
  { icon: '📊', title: 'Analytics',          desc: 'Track emotion frequency and intensity trends over time with Chart.js graphs.' },
  { icon: '🗄️', title: 'Persistent History', desc: 'Every selection is saved to MySQL and retrievable via the REST API.' },
];

const emotions = [
  { label: 'Pain',      emoji: '🤕', color: '#ef4444' },
  { label: 'Happiness', emoji: '😊', color: '#eab308' },
  { label: 'Fear',      emoji: '😨', color: '#8b5cf6' },
  { label: 'Anger',     emoji: '😡', color: '#f97316' },
  { label: 'Sadness',   emoji: '😢', color: '#3b82f6' },
];

export default function HomePage() {
  return (
    <main className="pt-20">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center
                           px-6 text-center overflow-hidden">
        {/* Radial glow backdrop */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #0e2a4d55 0%, transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full
                          border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Computational Neuroscience Simulator
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-5">
            Interactive{' '}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Brain Activation
            </span>{' '}
            Visualizer
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Select an emotion and watch the corresponding brain regions light up in real time
            using a WebGL 3D model with bloom glow and heatmap colouring.
          </p>

          {/* Emotion pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {emotions.map(e => (
              <span key={e.label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ borderColor: e.color + '60', color: e.color, background: e.color + '15' }}>
                {e.emoji} {e.label}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/visualize" className="btn-primary text-base px-8 py-3">
              🧠 Launch Visualizer
            </Link>
            <Link to="/analytics" className="btn-ghost text-base px-8 py-3">
              📊 View Analytics
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-2xl font-bold text-white mb-10"
        >
          What's Inside
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-5 space-y-3 hover:border-sky-500/50 transition-colors duration-300"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA footer ── */}
      <section className="py-16 text-center px-6">
        <Link to="/visualize"
          className="btn-primary text-base px-10 py-3.5 shadow-xl shadow-sky-500/20">
          Get Started →
        </Link>
      </section>
    </main>
  );
}

