/**
 * emotionMappings.js
 * ─────────────────────────────────────────────────────────────────
 * Static data used as the primary (and offline fallback) source for
 * emotion → brain-region mappings and 3-D scene geometry.
 */

// ── Emotion metadata ──────────────────────────────────────────────
export const EMOTIONS = [
  { id: 'pain',      label: 'Pain',      emoji: '🤕', color: '#ef4444', desc: 'Unpleasant sensory & emotional experience.' },
  { id: 'happiness', label: 'Happiness', emoji: '😊', color: '#eab308', desc: 'Positive state linked to reward & pleasure.'  },
  { id: 'fear',      label: 'Fear',      emoji: '😨', color: '#ec4899', desc: 'Response to perceived threat or danger.'      },
  { id: 'anger',     label: 'Anger',     emoji: '😡', color: '#f97316', desc: 'Reaction to injustice or provocation.'        },
  { id: 'sadness',   label: 'Sadness',   emoji: '😢', color: '#3b82f6', desc: 'Emotional pain tied to loss or helplessness.' },
  { id: 'calm',      label: 'Calm',      emoji: '😌', color: '#14b8a6', desc: 'Grounded, low-arousal state with clear focus.' },
  { id: 'surprise',  label: 'Surprise',  emoji: '😲', color: '#8b5cf6', desc: 'Rapid shift in attention toward the unexpected.' },
  { id: 'disgust',   label: 'Disgust',   emoji: '🤢', color: '#84cc16', desc: 'Aversion to something unpleasant or rejected.' },
  { id: 'anxiety',   label: 'Anxiety',   emoji: '😟', color: '#f43f5e', desc: 'Anticipatory tension with elevated vigilance.' },
];

export const EMOTION_RESEARCH_NOTES = {
  pain: {
    confidence: 'high',
    summary: 'Pain processing is commonly associated with insula, thalamus, and anterior cingulate cortex activity.',
    bullets: [
      'Insula is frequently linked to interoceptive and pain awareness.',
      'Thalamus acts as a major relay for sensory pain signals.',
      'Anterior cingulate cortex is often involved in the affective dimension of pain.',
    ],
  },
  happiness: {
    confidence: 'moderate',
    summary: 'Positive affect and reward are often linked to prefrontal and dopaminergic circuitry.',
    bullets: [
      'Prefrontal regions are commonly involved in regulation and appraisal.',
      'Dopaminergic pathways are strongly associated with reward and motivation.',
      'Reward processing is distributed rather than localized to one single site.',
    ],
  },
  fear: {
    confidence: 'high',
    summary: 'Threat detection and autonomic fear responses are commonly linked to amygdala and hypothalamic circuits.',
    bullets: [
      'Amygdala is widely associated with threat detection and fear learning.',
      'Hypothalamus contributes to autonomic and hormonal stress responses.',
      'Cortical regulation can modulate fear responses rather than acting alone.',
    ],
  },
  anger: {
    confidence: 'moderate',
    summary: 'Anger is typically treated as a distributed state involving limbic reactivity and frontal regulation.',
    bullets: [
      'Amygdala is often involved in salience and emotional reactivity.',
      'Prefrontal cortex contributes to impulse control and regulation.',
      'Anger is network-based and overlaps with stress and threat processing.',
    ],
  },
  sadness: {
    confidence: 'moderate',
    summary: 'Sadness and emotional memory are often associated with hippocampal and prefrontal systems.',
    bullets: [
      'Hippocampus is involved in memory and context, which can shape sad affect.',
      'Prefrontal regulation is relevant to reappraisal and mood control.',
      'Mood-related states usually involve several networks together.',
    ],
  },
  calm: {
    confidence: 'moderate',
    summary: 'Calm states are often linked to stronger prefrontal regulation and reduced limbic reactivity.',
    bullets: [
      'Prefrontal cortex can support deliberate regulation and task focus.',
      'Lower limbic drive is often associated with steadier emotional control.',
      'Calm states are useful recovery windows after higher-arousal emotions.',
    ],
  },
  surprise: {
    confidence: 'moderate',
    summary: 'Surprise is often associated with rapid attention shifting and heightened salience processing.',
    bullets: [
      'Thalamic routing helps redirect attention toward unexpected events.',
      'Prefrontal regions help reframe what the surprise means.',
      'Surprise can be neutral, positive, or negative depending on context.',
    ],
  },
  disgust: {
    confidence: 'moderate',
    summary: 'Disgust is frequently tied to insular and cingulate processing around aversion and rejection.',
    bullets: [
      'Insula is often linked to visceral aversion and internal state awareness.',
      'Cingulate regions can help decide whether to avoid or reappraise the trigger.',
      'Disgust often overlaps with protective and boundary-setting responses.',
    ],
  },
  anxiety: {
    confidence: 'high',
    summary: 'Anxiety often reflects sustained threat anticipation with amygdala, hippocampal, and prefrontal involvement.',
    bullets: [
      'Amygdala can bias attention toward possible danger.',
      'Hippocampus helps attach context to the feeling and the trigger.',
      'Prefrontal regulation matters for reducing overprediction and spirals.',
    ],
  },
};

// ── Brain region 3-D layout ───────────────────────────────────────
// position = [x, y, z] in Three.js world units; brain shell ≈ r2 sphere
export const BRAIN_REGION_DATA = [
  { id: 'pfc',        name: 'Prefrontal Cortex',         position: [ 0.0,  0.45,  1.50], size: 0.45,
    desc: 'Decision-making, planning, personality expression, and positive emotion regulation.' },
  { id: 'acc',        name: 'Anterior Cingulate Cortex', position: [ 0.0,  0.75,  0.90], size: 0.32,
    desc: 'Error detection, attention, conflict monitoring, and the emotional coloring of pain.' },
  { id: 'thalamus',   name: 'Thalamus',                  position: [ 0.0, -0.15,  0.10], size: 0.38,
    desc: 'Central relay hub routing sensory and motor signals to the appropriate cortical areas.' },
  { id: 'hypo',       name: 'Hypothalamus',              position: [ 0.0, -0.58,  0.38], size: 0.25,
    desc: 'Regulates stress hormones (cortisol, adrenaline), autonomic responses, and homeostasis.' },
  { id: 'dopamine',   name: 'Dopamine Pathway',          position: [ 0.0,  0.10,  0.65], size: 0.36,
    desc: 'Mesolimbic reward circuit driving pleasure, motivation, and behavioural reinforcement.' },
  { id: 'amyg_l',    name: 'Amygdala',                  position: [-0.80,-0.44,  0.55], size: 0.28,
    desc: 'Primary threat-detection nucleus; consolidates fear memories and triggers fight-or-flight.' },
  { id: 'amyg_r',    name: 'Amygdala',                  position: [ 0.80,-0.44,  0.55], size: 0.28,
    desc: 'Primary threat-detection nucleus; consolidates fear memories and triggers fight-or-flight.' },
  { id: 'hippo_l',   name: 'Hippocampus',               position: [-1.00,-0.54, -0.22], size: 0.30,
    desc: 'Episodic memory formation, spatial navigation, and emotional memory modulation.' },
  { id: 'hippo_r',   name: 'Hippocampus',               position: [ 1.00,-0.54, -0.22], size: 0.30,
    desc: 'Episodic memory formation, spatial navigation, and emotional memory modulation.' },
  { id: 'insula_l',  name: 'Insula',                    position: [-1.10, 0.12,  0.30], size: 0.28,
    desc: 'Interoception, pain perception, disgust, and awareness of internal bodily states.' },
  { id: 'insula_r',  name: 'Insula',                    position: [ 1.10, 0.12,  0.30], size: 0.28,
    desc: 'Interoception, pain perception, disgust, and awareness of internal bodily states.' },
];

// ── Emotion → active region mapping ──────────────────────────────
export const EMOTION_MAPPINGS = {
  pain: [
    { name: 'Insula',                    intensity: 0.90 },
    { name: 'Thalamus',                  intensity: 0.80 },
    { name: 'Anterior Cingulate Cortex', intensity: 0.85 },
  ],
  happiness: [
    { name: 'Prefrontal Cortex', intensity: 0.90 },
    { name: 'Dopamine Pathway',  intensity: 0.85 },
  ],
  fear: [
    { name: 'Amygdala',    intensity: 0.95 },
    { name: 'Hypothalamus', intensity: 0.70 },
  ],
  anger: [
    { name: 'Amygdala',          intensity: 0.90 },
    { name: 'Prefrontal Cortex', intensity: 0.75 },
  ],
  sadness: [
    { name: 'Hippocampus', intensity: 0.85 },
  ],
  calm: [
    { name: 'Prefrontal Cortex', intensity: 0.82 },
    { name: 'Hippocampus', intensity: 0.60 },
  ],
  surprise: [
    { name: 'Thalamus', intensity: 0.80 },
    { name: 'Prefrontal Cortex', intensity: 0.68 },
    { name: 'Amygdala', intensity: 0.55 },
  ],
  disgust: [
    { name: 'Insula', intensity: 0.92 },
    { name: 'Anterior Cingulate Cortex', intensity: 0.72 },
  ],
  anxiety: [
    { name: 'Amygdala', intensity: 0.95 },
    { name: 'Hippocampus', intensity: 0.80 },
    { name: 'Prefrontal Cortex', intensity: 0.72 },
  ],
};

/**
 * Map an intensity value (0–1) to an RGB hex colour using a
 * Blue → Yellow → Red heatmap gradient.
 */
export function intensityToColor(t) {
  t = Math.max(0, Math.min(1, t));
  if (t < 0.5) {
    const s = t * 2;
    const r = Math.round(s * 255);
    const g = Math.round(s * 200);
    const b = Math.round((1 - s) * 255);
    return `rgb(${r},${g},${b})`;
  } else {
    const s = (t - 0.5) * 2;
    const r = 255;
    const g = Math.round((1 - s) * 200);
    const b = 0;
    return `rgb(${r},${g},${b})`;
  }
}

