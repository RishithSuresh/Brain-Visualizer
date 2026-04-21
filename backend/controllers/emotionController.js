// Emotion Controller – handles all emotion-related API logic

// Static emotion→region mappings used by the API
const LOCAL_MAPPINGS = {
  pain: [
    { name: 'Insula', intensity: 0.9, function_desc: 'Processes pain signals, interoception, and emotional experience.' },
    { name: 'Thalamus', intensity: 0.8, function_desc: 'Relay station that routes pain signals to the cortex.' },
    { name: 'Anterior Cingulate Cortex', intensity: 0.85, function_desc: 'Handles the emotional/affective component of pain.' },
  ],
  happiness: [
    { name: 'Prefrontal Cortex', intensity: 0.9, function_desc: 'Regulates positive emotions, decision-making, and reward anticipation.' },
    { name: 'Dopamine Pathway', intensity: 0.85, function_desc: 'Mesolimbic reward pathway driving pleasure and motivation.' },
  ],
  fear: [
    { name: 'Amygdala', intensity: 0.95, function_desc: 'Primary fear-detection hub; triggers fight-or-flight response.' },
    { name: 'Hypothalamus', intensity: 0.7, function_desc: 'Activates the HPA axis; releases cortisol and adrenaline.' },
  ],
  anger: [
    { name: 'Amygdala', intensity: 0.9, function_desc: 'Generates the emotional arousal underlying angry reactions.' },
    { name: 'Prefrontal Cortex', intensity: 0.75, function_desc: 'Attempts to regulate and inhibit aggressive impulses.' },
  ],
  sadness: [
    { name: 'Hippocampus', intensity: 0.85, function_desc: 'Encodes sad memories and connects past experience to current mood.' },
  ],
  calm: [
    { name: 'Prefrontal Cortex', intensity: 0.82, function_desc: 'Supports regulation, attention, and a steady low-arousal state.' },
    { name: 'Hippocampus', intensity: 0.6, function_desc: 'Helps anchor safe context and memory when the system is settled.' },
  ],
  surprise: [
    { name: 'Thalamus', intensity: 0.8, function_desc: 'Redirects attention toward unexpected input and rapid changes.' },
    { name: 'Prefrontal Cortex', intensity: 0.68, function_desc: 'Interprets the meaning of the unexpected event and helps resolve it.' },
    { name: 'Amygdala', intensity: 0.55, function_desc: 'Adds a quick salience response when surprise feels intense.' },
  ],
  disgust: [
    { name: 'Insula', intensity: 0.92, function_desc: 'Tracks aversion, bodily discomfort, and rejection signals.' },
    { name: 'Anterior Cingulate Cortex', intensity: 0.72, function_desc: 'Helps evaluate and regulate the response to unpleasant stimuli.' },
  ],
  anxiety: [
    { name: 'Amygdala', intensity: 0.95, function_desc: 'Creates threat vigilance and anticipatory alarm.' },
    { name: 'Hippocampus', intensity: 0.8, function_desc: 'Attaches context and memory to the anxious state.' },
    { name: 'Prefrontal Cortex', intensity: 0.72, function_desc: 'Works to regulate worry and reframe threat predictions.' },
  ],
};

// In-memory history used for demos and local development
const INITIAL_HISTORY = [
  { id: 1, emotion: 'pain', intensity_multiplier: 0.9, timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  { id: 2, emotion: 'fear', intensity_multiplier: 1.0, timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
  { id: 3, emotion: 'happiness', intensity_multiplier: 0.8, timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
  { id: 4, emotion: 'sadness', intensity_multiplier: 0.95, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  { id: 5, emotion: 'anger', intensity_multiplier: 1.0, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
  { id: 6, emotion: 'happiness', intensity_multiplier: 1.0, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: 7, emotion: 'fear', intensity_multiplier: 0.85, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
  { id: 8, emotion: 'pain', intensity_multiplier: 1.0, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: 9, emotion: 'happiness', intensity_multiplier: 0.9, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: 10, emotion: 'sadness', intensity_multiplier: 0.7, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: 11, emotion: 'calm', intensity_multiplier: 0.7, timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000) },
  { id: 12, emotion: 'surprise', intensity_multiplier: 0.82, timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000) },
  { id: 13, emotion: 'anxiety', intensity_multiplier: 0.93, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
  { id: 14, emotion: 'disgust', intensity_multiplier: 0.76, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) },
];

let history = INITIAL_HISTORY.slice();
let nextHistoryId = INITIAL_HISTORY.length + 1;

function buildFrequency(rows) {
  const counts = new Map();
  const totals = new Map();

  rows.forEach((row) => {
    counts.set(row.emotion, (counts.get(row.emotion) || 0) + 1);
    totals.set(row.emotion, (totals.get(row.emotion) || 0) + Number(row.intensity_multiplier || 0));
  });

  return Array.from(counts.entries())
    .map(([emotion, count]) => ({
      emotion,
      count,
      avg_intensity: count ? totals.get(emotion) / count : 0,
    }))
    .sort((a, b) => b.count - a.count || a.emotion.localeCompare(b.emotion));
}

function buildTrend(rows) {
  return rows
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 30)
    .map((row) => ({
      emotion: row.emotion,
      intensity_multiplier: row.intensity_multiplier,
      timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : row.timestamp,
    }));
}

// GET /api/emotion/:name → return mapped brain regions + intensity
const getEmotionData = async (req, res) => {
  const emotionName = req.params.name.toLowerCase();

  const localData = LOCAL_MAPPINGS[emotionName];
  if (!localData) {
    return res.status(404).json({ error: `Emotion "${emotionName}" not found.` });
  }

  res.json({ emotion: emotionName, regions: localData, source: 'local' });
};

// POST /api/emotion → persist a user-selected emotion to in-memory history
const saveEmotion = async (req, res) => {
  const { emotion, intensityMultiplier = 1.0 } = req.body;
  if (!emotion) return res.status(400).json({ error: 'emotion field is required.' });

  const savedEmotion = emotion.toLowerCase();
  const entry = {
    id: nextHistoryId++,
    emotion: savedEmotion,
    intensity_multiplier: Number(intensityMultiplier) || 0,
    timestamp: new Date(),
  };

  history.push(entry);
  res.status(201).json({
    id: entry.id,
    emotion: entry.emotion,
    intensityMultiplier: entry.intensity_multiplier,
    timestamp: entry.timestamp,
  });
};

// GET /api/history → retrieve past selections (paginated)
const getHistory = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);

  const rows = history
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit)
    .map((row) => ({
      id: row.id,
      emotion: row.emotion,
      intensity_multiplier: row.intensity_multiplier,
      timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : row.timestamp,
    }));

  res.json({ history: rows, total: rows.length });
};

// GET /api/analytics → aggregated frequency + intensity trend
const getAnalytics = async (req, res) => {
  res.json({
    frequency: buildFrequency(history),
    trend: buildTrend(history),
  });
};

// DELETE /api/history → clear saved selections for demos/reset
const clearHistory = async (_req, res) => {
  const deleted = history.length;
  history = [];
  res.json({ ok: true, deleted });
};

module.exports = { getEmotionData, saveEmotion, getHistory, getAnalytics, clearHistory };

