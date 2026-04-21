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

const referenceImages = [
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Human_brain.jpg',
    title: 'Human brain anatomy',
    caption: 'Sagittal-section illustration of the human brain.',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vertebrate-brain-regions_small.png',
    title: 'Vertebrate brain regions',
    caption: 'Comparative brain layout showing shared vertebrate structures.',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chemical_synapse_schema_cropped.jpg',
    title: 'Neuron synapse',
    caption: 'How neurons communicate across a synapse.',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/EmbryonicBrain.svg',
    title: 'Embryonic brain development',
    caption: 'Early-stage brain development from the neural tube.',
  },
];

function ImageFeatureCard({ src, title, caption, overlay, fit = 'cover' }) {
  return (
    <figure className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_0_40px_rgba(15,23,42,0.35)]">
      <div className="relative">
        <img
          src={src}
          alt={title}
          className={`h-[420px] w-full object-${fit}`}
          loading="lazy"
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        )}
        <div className="absolute left-5 top-5 max-w-[75%]">
          <p className="text-lg font-semibold text-white drop-shadow-md">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-200/90 drop-shadow-md">{caption}</p>
        </div>
      </div>
    </figure>
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
            <ImageFeatureCard
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Human_brain.jpg"
              title="Brain overview"
              caption="Real sagittal-section anatomy of the human brain."
              overlay
              fit="contain"
            />
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
              <ImageFeatureCard
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Chemical_synapse_schema_cropped.jpg"
                title="Neuron communication"
                caption="A real synapse diagram showing how signals pass between cells."
                overlay
                fit="contain"
              />
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
                <ImageFeatureCard
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/Gehirn,_medial_-_Lobi_en.svg"
                  title="Brain lobes"
                  caption="A labeled medial-view lobe diagram used for anatomy study."
                  overlay
                  fit="contain"
                />
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

        <section className="glass-panel p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="section-title">Reference image gallery</h2>
              <p className="section-sub">Public Wikimedia images that support the brain overview and anatomy sections.</p>
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Open-license reference material</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {referenceImages.map((image) => (
              <figure key={image.title} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
                <img
                  src={image.src}
                  alt={image.title}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="space-y-1 p-4">
                  <h3 className="text-sm font-semibold text-white">{image.title}</h3>
                  <p className="text-xs leading-5 text-slate-400">{image.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
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