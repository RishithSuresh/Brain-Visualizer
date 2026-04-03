/**
 * api.js
 * ─────────────────────────────────────────────────────────────────
 * Thin wrapper around fetch() for communicating with the Express API.
 * All calls are graceful – they return null / [] on failure so the
 * UI can transparently fall back to local data.
 */

const BASE_URL = '/api'; // proxied by Vite to http://localhost:5000

// ── Helpers ───────────────────────────────────────────────────────
async function getJSON(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API] GET ${path} failed:`, err.message);
    return null;
  }
}

async function postJSON(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API] POST ${path} failed:`, err.message);
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────

/**
 * Fetch brain region activations for an emotion name.
 * Returns { emotion, regions: [{name, intensity, function_desc}] } or null.
 */
export async function fetchEmotionData(emotionName) {
  return getJSON(`/emotion/${encodeURIComponent(emotionName)}`);
}

/**
 * Record an emotion selection in the history table.
 * @param {string} emotion
 * @param {number} intensityMultiplier  0.1 – 1.0
 */
export async function saveEmotionSelection(emotion, intensityMultiplier = 1.0) {
  return postJSON('/emotion', { emotion, intensityMultiplier });
}

/**
 * Retrieve the most recent history entries.
 * Returns { history: [...], total } or null.
 */
export async function fetchHistory(limit = 50) {
  return getJSON(`/history?limit=${limit}`);
}

/**
 * Retrieve aggregated analytics data.
 * Returns { frequency: [{emotion, count, avg_intensity}], trend: [...] } or null.
 */
export async function fetchAnalytics() {
  return getJSON('/analytics');
}

/**
 * Clear the stored history entries.
 * Returns the backend response or null on failure.
 */
export async function clearHistory() {
  try {
    const res = await fetch(`${BASE_URL}/history`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] DELETE /history failed:', err.message);
    return null;
  }
}

