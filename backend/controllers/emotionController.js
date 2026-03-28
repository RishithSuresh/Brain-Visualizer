// Emotion Controller – handles all emotion-related API logic
const pool = require('../config/db');

// Fallback emotion→region mappings used when DB is unavailable
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
};

// GET /api/emotion/:name → return mapped brain regions + intensity
const getEmotionData = async (req, res) => {
  const emotionName = req.params.name.toLowerCase();

  try {
    const [rows] = await pool.execute(
      `SELECT br.name, br.function_desc, br.x_pos, br.y_pos, br.z_pos, br.size, m.intensity
       FROM emotions e
       JOIN mappings m ON e.id = m.emotion_id
       JOIN brain_regions br ON m.region_id = br.id
       WHERE LOWER(e.name) = ?`,
      [emotionName]
    );

    if (rows.length === 0) {
      const localData = LOCAL_MAPPINGS[emotionName];
      if (!localData) return res.status(404).json({ error: `Emotion "${emotionName}" not found.` });
      return res.json({ emotion: emotionName, regions: localData, source: 'local' });
    }

    res.json({ emotion: emotionName, regions: rows, source: 'database' });
  } catch {
    // DB unavailable – use local fallback
    const localData = LOCAL_MAPPINGS[emotionName];
    if (localData) return res.json({ emotion: emotionName, regions: localData, source: 'local' });
    res.status(500).json({ error: 'Database unavailable and emotion not in local data.' });
  }
};

// POST /api/emotion → persist a user-selected emotion to history
const saveEmotion = async (req, res) => {
  const { emotion, intensityMultiplier = 1.0 } = req.body;
  if (!emotion) return res.status(400).json({ error: 'emotion field is required.' });

  try {
    const [result] = await pool.execute(
      'INSERT INTO history (emotion, intensity_multiplier) VALUES (?, ?)',
      [emotion.toLowerCase(), intensityMultiplier]
    );
    res.status(201).json({ id: result.insertId, emotion: emotion.toLowerCase(), intensityMultiplier, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/history → retrieve past selections (paginated)
const getHistory = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);
  try {
    const [rows] = await pool.execute(
      'SELECT id, emotion, intensity_multiplier, timestamp FROM history ORDER BY timestamp DESC LIMIT ?',
      [limit]
    );
    res.json({ history: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics → aggregated frequency + intensity trend
const getAnalytics = async (req, res) => {
  try {
    const [frequency] = await pool.execute(
      'SELECT emotion, COUNT(*) AS count, AVG(intensity_multiplier) AS avg_intensity FROM history GROUP BY emotion ORDER BY count DESC'
    );
    const [trend] = await pool.execute(
      'SELECT emotion, intensity_multiplier, timestamp FROM history ORDER BY timestamp DESC LIMIT 30'
    );
    res.json({ frequency, trend });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getEmotionData, saveEmotion, getHistory, getAnalytics };

