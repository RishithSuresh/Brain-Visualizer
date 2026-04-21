/**
 * HomePage.jsx – Landing / hero page
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EMOTIONS } from '../utils/emotionMappings';

const features = [
  { icon: '🧠', title: '3D Brain Model',     desc: 'Explore a WebGL brain scene with holographic activation layers and region markers.' },
  { icon: '⚡', title: 'Live Activation',    desc: 'Trigger animated intensity changes and see the matching brain regions respond instantly.' },
  { icon: '📊', title: 'Analytics',          desc: 'Review emotion frequency, trends, and deeper session-level patterns on the analytics page.' },
  { icon: '🧾', title: 'Session History',    desc: 'Selections are stored locally so the experience stays useful without a database.' },
  { icon: '🔬', title: 'Research View',     desc: 'Jump into the research page for anatomy, brain health, and visual reference material.' },
  { icon: '🎛️', title: 'Many Emotions',     desc: 'Use a broader emotion vocabulary, from calm and surprise to anxiety and disgust.' },
];

const stats = [
  { value: '9+', label: 'emotion states' },
  { value: '3D', label: 'interactive brain view' },
  { value: '1', label: 'shared local demo stack' },
  { value: 'Live', label: 'analytics and history' },
];

const journey = [
  { step: '1', title: 'Select an emotion', desc: 'Choose a state from the expanded emotion set and immediately activate the matching brain regions.' },
  { step: '2', title: 'Tune intensity', desc: 'Adjust the intensity slider to see how stronger or weaker responses reshape the visualization.' },
  { step: '3', title: 'Read the pattern', desc: 'Use the analytics and research pages to connect what you selected with broader brain context.' },
];

const spotlight = EMOTIONS.slice(0, 8);

export default function HomePage() {
  return (
    <main className="pt-20 overflow-hidden">
      <section className="relative px-6 py-10 lg:py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute left-[-8rem] bottom-10 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
              Computational neuroscience simulator
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
                Build an emotional map of the brain with a more{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                  powerful visualizer
                </span>
                .
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Explore a holographic 3D brain, compare multiple emotions, track session history,
                and move from a feeling to a brain-region explanation in a few clicks.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel p-4">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/visualize" className="btn-primary text-base px-8 py-3.5">
                Launch Visualizer
              </Link>
              <Link to="/research" className="btn-ghost text-base px-8 py-3.5">
                Open Research Page
              </Link>
              <Link to="/analytics" className="btn-ghost text-base px-8 py-3.5">
                View Analytics
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 blur-2xl" />
            <div className="relative glass-panel overflow-hidden border-cyan-400/20 bg-slate-950/70 p-5 shadow-[0_0_60px_rgba(34,211,238,0.10)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Live demo snapshot</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Emotion signals in motion</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                    The landing page now previews the kinds of signals and states the app can explore.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                  Real-time ready
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Active regions</p>
                  <div className="mt-3 space-y-3">
                    {['Prefrontal cortex', 'Amygdala', 'Hippocampus', 'Thalamus'].map((region, index) => (
                      <div key={region} className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-300" style={{ opacity: 1 - index * 0.16 }} />
                        <div className="h-2 flex-1 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400"
                            style={{ width: `${88 - index * 14}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Emotion palette</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {spotlight.map((emotion) => (
                      <span
                        key={emotion.id}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                        style={{ borderColor: `${emotion.color}55`, color: emotion.color, backgroundColor: `${emotion.color}14` }}
                      >
                        {emotion.emoji} {emotion.label}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    The app now covers calm, surprise, disgust, and anxiety alongside the core emotions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <h2 className="section-title">How it works</h2>
            <p className="section-sub">A simple path from emotion selection to deeper understanding.</p>
            <div className="space-y-4">
              {journey.map((item) => (
                <div key={item.step} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-sm font-bold text-cyan-300">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <h2 className="section-title">What’s inside</h2>
            <p className="section-sub">The home page now introduces the main surfaces in the app more clearly.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-cyan-400/30 transition-colors duration-300"
                >
                  <span className="text-3xl">{feature.icon}</span>
                  <h3 className="mt-3 font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-10 pb-16">
        <div className="max-w-7xl mx-auto glass-panel overflow-hidden p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Broader emotion map</p>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                From pain and happiness to calm, surprise, disgust, and anxiety.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                The visualizer now covers a wider emotional range so the landing page can point users toward more meaningful exploration, not just the default five states.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {spotlight.map((emotion) => (
                  <span
                    key={emotion.id}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{ borderColor: `${emotion.color}55`, color: emotion.color, backgroundColor: `${emotion.color}14` }}
                  >
                    {emotion.emoji} {emotion.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Research', 'Brain anatomy, function, and study references'],
                  ['Visualization', 'Holographic 3D activation and region overlays'],
                  ['Analytics', 'Frequency, trends, and deeper insights'],
                  ['History', 'Session patterns stored locally for the demo'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link to="/visualize" className="btn-primary text-base px-6 py-3">
                  Start Exploring
                </Link>
                <Link to="/research" className="btn-ghost text-base px-6 py-3">
                  Read the Research
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

