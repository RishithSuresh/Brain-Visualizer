/**
 * ResearchPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Educational page covering brain anatomy, function, and health with
 * embedded SVG visuals so the content works without external assets.
 */
import { motion } from 'framer-motion';

const sections = [
  {
    title: 'What the brain does',
    text: 'The brain is the body\'s control center. It interprets senses, coordinates movement, stores memory, regulates emotion, and helps plan future actions.',
  },
  {
    title: 'Major divisions',
    text: 'The cerebrum handles thinking and perception, the cerebellum coordinates balance and timing, and the brainstem manages breathing, heartbeat, and survival reflexes.',
  },
  {
    title: 'Why it matters',
    text: 'Brain health influences learning, mood, focus, stress tolerance, sleep quality, and the ability to adapt to new experiences.',
  },
];

const lobes = [
  { name: 'Frontal lobe', color: '#38bdf8', text: 'Planning, decision-making, personality, and voluntary movement.' },
  { name: 'Parietal lobe', color: '#a78bfa', text: 'Touch, spatial awareness, and sensory integration.' },
  { name: 'Temporal lobe', color: '#f97316', text: 'Hearing, memory, language, and emotion processing.' },
  { name: 'Occipital lobe', color: '#22c55e', text: 'Primary visual processing and interpretation.' },
];

const facts = [
  'The brain uses a large share of the body\'s energy even though it is a small part of total body weight.',
  'Neurons communicate using electrical signals and chemical messengers called neurotransmitters.',
  'Sleep supports memory consolidation, emotional regulation, and network repair.',
  'Exercise, hydration, learning, and social connection all support healthier brain function.',
];

function BrainOverviewDiagram() {
  return (
    <svg viewBox="0 0 640 420" className="h-full w-full" role="img" aria-label="Stylized brain anatomy diagram">
      <defs>
        <linearGradient id="brainGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#818cf8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="640" height="420" rx="28" fill="#081224" />
      <circle cx="490" cy="88" r="110" fill="#0f1d3b" opacity="0.9" />
      <circle cx="136" cy="332" r="140" fill="#0f1d3b" opacity="0.7" />
      <path
        d="M220 88c-51 0-92 41-92 92 0 31 14 59 37 77-1 6-2 12-2 18 0 61 49 110 110 110h133c63 0 114-51 114-114 0-21-6-41-16-58 22-20 36-49 36-81 0-62-50-112-112-112-36 0-69 17-90 44-18-15-42-24-68-24z"
        fill="url(#brainGlow)"
        opacity="0.92"
      />
      <path d="M315 120c-22 18-35 45-35 75 0 31 12 59 33 79" stroke="#e0f2fe" strokeOpacity="0.45" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M382 108c24 17 40 45 40 76 0 31-14 59-36 78" stroke="#e0f2fe" strokeOpacity="0.45" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M256 216c22-14 52-19 81-19 27 0 54 4 76 16" stroke="#f8fafc" strokeOpacity="0.4" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M240 274c27-10 61-15 95-15 37 0 72 7 100 21" stroke="#f8fafc" strokeOpacity="0.35" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g fill="#ffffff" opacity="0.95">
        <circle cx="176" cy="120" r="10" />
        <circle cx="464" cy="112" r="10" />
        <circle cx="404" cy="288" r="10" />
        <circle cx="236" cy="300" r="10" />
      </g>
      <g fill="none" stroke="#ffffff" strokeOpacity="0.34" strokeWidth="2.5">
        <path d="M186 120h36" />
        <path d="M474 112h42" />
        <path d="M414 288h52" />
        <path d="M246 300h-52" />
      </g>
      <text x="50" y="64" fill="#cbd5e1" fontSize="16" fontWeight="600">Brain overview</text>
      <text x="50" y="88" fill="#94a3b8" fontSize="12">Stylized anatomy with highlighted major functional regions.</text>
    </svg>
  );
}

function LobeDiagram() {
  return (
    <svg viewBox="0 0 640 420" className="h-full w-full" role="img" aria-label="Brain lobe map diagram">
      <rect x="0" y="0" width="640" height="420" rx="28" fill="#0b1329" />
      <g transform="translate(70 52)">
        <path d="M132 22c58 0 104 46 104 104 0 17-4 33-11 47 19 18 31 43 31 71 0 54-44 98-98 98H113c-54 0-98-44-98-98 0-28 12-53 31-71-7-14-11-30-11-47 0-58 46-104 104-104z" fill="#172554" />
        <path d="M132 22c58 0 104 46 104 104 0 17-4 33-11 47 19 18 31 43 31 71 0 54-44 98-98 98H113c-54 0-98-44-98-98 0-28 12-53 31-71-7-14-11-30-11-47 0-58 46-104 104-104z" fill="none" stroke="#38bdf8" strokeOpacity="0.24" strokeWidth="3" />
        <path d="M65 94c21-26 52-41 88-41 33 0 64 13 85 36" fill="none" stroke="#38bdf8" strokeWidth="16" strokeLinecap="round" />
        <path d="M40 168c28-19 62-29 100-29 41 0 78 11 107 32" fill="none" stroke="#a78bfa" strokeWidth="16" strokeLinecap="round" />
        <path d="M56 248c25-15 58-23 95-23 42 0 79 10 110 31" fill="none" stroke="#f97316" strokeWidth="16" strokeLinecap="round" />
        <path d="M87 316c15-10 37-16 62-16 31 0 59 8 83 24" fill="none" stroke="#22c55e" strokeWidth="16" strokeLinecap="round" />
      </g>
      <g fill="#e2e8f0">
        <text x="405" y="88" fontSize="24" fontWeight="700">Lobes</text>
        <text x="405" y="118" fontSize="13" fill="#94a3b8">Each lobe contributes a different part of cognition.</text>
      </g>
      <g>
        <rect x="392" y="148" width="196" height="50" rx="14" fill="#0f172a" stroke="#38bdf8" strokeOpacity="0.3" />
        <rect x="392" y="208" width="196" height="50" rx="14" fill="#0f172a" stroke="#a78bfa" strokeOpacity="0.3" />
        <rect x="392" y="268" width="196" height="50" rx="14" fill="#0f172a" stroke="#f97316" strokeOpacity="0.3" />
        <rect x="392" y="328" width="196" height="50" rx="14" fill="#0f172a" stroke="#22c55e" strokeOpacity="0.3" />
      </g>
      <g fill="#f8fafc" fontSize="14" fontWeight="600">
        <text x="410" y="179">Frontal lobe</text>
        <text x="410" y="239">Parietal lobe</text>
        <text x="410" y="299">Temporal lobe</text>
        <text x="410" y="359">Occipital lobe</text>
      </g>
    </svg>
  );
}

function NeuronDiagram() {
  return (
    <svg viewBox="0 0 640 420" className="h-full w-full" role="img" aria-label="Neuron and synapse diagram">
      <rect x="0" y="0" width="640" height="420" rx="28" fill="#09111f" />
      <circle cx="150" cy="210" r="56" fill="#1d4ed8" opacity="0.9" />
      <g stroke="#93c5fd" strokeWidth="10" strokeLinecap="round" fill="none">
        <path d="M204 210h130" />
        <path d="M334 210h88" />
        <path d="M420 210h88" />
      </g>
      <g stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.95">
        <path d="M136 192c-26-36-42-54-72-74" />
        <path d="M140 220c-38 6-60 16-88 34" />
        <path d="M164 181c10-38 22-60 47-92" />
        <path d="M168 234c18 30 31 50 56 78" />
      </g>
      <g fill="#e2e8f0">
        <circle cx="470" cy="210" r="16" fill="#f59e0b" />
        <circle cx="516" cy="210" r="16" fill="#f97316" />
        <circle cx="562" cy="210" r="16" fill="#ef4444" />
      </g>
      <g stroke="#f8fafc" strokeOpacity="0.22" strokeWidth="2">
        <path d="M486 210h16" />
        <path d="M532 210h16" />
      </g>
      <text x="52" y="62" fill="#cbd5e1" fontSize="16" fontWeight="600">Neuron communication</text>
      <text x="52" y="88" fill="#94a3b8" fontSize="12">Signals travel across axons and across synapses to different brain networks.</text>
    </svg>
  );
}

export default function ResearchPage() {
  return (
    <main className="pt-20 px-6 pb-16">
      <section className="max-w-7xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-center"
        >
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.26em] text-sky-300">
              Brain research hub
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight text-white">
              Important brain information in one{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                visual guide
              </span>
            </h1>
            <p className="max-w-2xl text-base sm:text-lg leading-8 text-slate-300">
              This page collects the core ideas behind how the brain works, which structures matter most,
              and what everyday habits can support better brain health.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {sections.map((section) => (
                <div key={section.title} className="glass-panel p-4">
                  <h2 className="text-sm font-semibold text-white">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{section.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel overflow-hidden border-sky-500/20 bg-slate-950/70 p-3 shadow-[0_0_50px_rgba(56,189,248,0.08)]">
            <BrainOverviewDiagram />
          </div>
        </motion.div>

        <section className="grid gap-5 lg:grid-cols-2">
          <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} className="glass-panel p-5">
            <h2 className="section-title">Brain lobes and their roles</h2>
            <p className="section-sub">The lobes work together instead of acting in isolation.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {lobes.map((lobe) => (
                <div key={lobe.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: lobe.color }} />
                    <h3 className="font-semibold text-white">{lobe.name}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{lobe.text}</p>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} className="glass-panel p-5">
            <h2 className="section-title">How neurons communicate</h2>
            <p className="section-sub">The brain depends on fast signaling between neurons and networks.</p>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
              <NeuronDiagram />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Electrical impulses move down the axon.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Chemical messengers cross synapses.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Networks adapt through learning and repetition.</div>
            </div>
          </motion.article>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} className="glass-panel p-5">
            <h2 className="section-title">The main structures you should know</h2>
            <p className="section-sub">These regions frequently appear in basic anatomy and cognitive research.</p>
            <div className="grid gap-3">
              {[
                ['Cerebrum', 'Higher thinking, sensory interpretation, language, memory, and voluntary movement.'],
                ['Cerebellum', 'Balance, coordination, posture, and the fine tuning of movement.'],
                ['Brainstem', 'Breathing, heart rate, arousal, and essential life-support functions.'],
                ['Limbic system', 'Emotion, motivation, memory, and threat detection.'],
                ['Hippocampus', 'Memory formation and context linking.'],
                ['Amygdala', 'Salience, fear, and rapid emotional reaction.'],
              ].map(([title, description]) => (
                <div key={title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.65)]" />
                  <div>
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} className="glass-panel p-5">
            <h2 className="section-title">Images and visual references</h2>
            <p className="section-sub">Use visual cues to remember the major topics faster.</p>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
                <LobeDiagram />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold text-white">What to study first</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Start with the lobes, then move to subcortical structures, then connect them to behavior and emotion.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold text-white">How to remember it</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Link each structure to one job, one emotion, and one everyday example.</p>
                </div>
              </div>
            </div>
          </motion.article>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} className="glass-panel p-5">
            <h2 className="section-title">Brain health basics</h2>
            <p className="section-sub">Small habits can have a measurable impact on brain performance.</p>
            <div className="space-y-3">
              {facts.map((fact) => (
                <div key={fact} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                  {fact}
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} className="glass-panel p-5">
            <h2 className="section-title">Key takeaways</h2>
            <p className="section-sub">A simple summary of the most important ideas on this page.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'The brain is a network, not a single organ with one job.',
                'Emotion, memory, and attention are tightly connected.',
                'Healthy habits support learning and emotional stability.',
                'Visual diagrams make complex anatomy easier to remember.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-sky-500/15 bg-sky-500/5 p-4 text-sm leading-6 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </motion.article>
        </section>
      </section>
    </main>
  );
}