/**
 * useHistory.js
 * ─────────────────────────────────────────────────────────────────
 * Custom hook that fetches and manages the emotion-selection history
 * and derives analytics data for the dashboard charts.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchHistory, fetchAnalytics, clearHistory as clearHistoryRequest } from '../utils/api';
import { EMOTIONS } from '../utils/emotionMappings';

// Build a deterministic fallback frequency table from EMOTIONS list
function buildFallbackFrequency() {
  return EMOTIONS.map((e, i) => ({
    emotion:       e.id,
    count:         [4, 7, 5, 3, 6][i] ?? 2,
    avg_intensity: [0.85, 0.88, 0.92, 0.82, 0.85][i] ?? 0.8,
  }));
}

export default function useHistory() {
  const [history,   setHistory]   = useState([]);
  const [frequency, setFrequency] = useState(buildFallbackFrequency());
  const [trend,     setTrend]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [clearing,  setClearing]  = useState(false);
  const [error,     setError]     = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Fetch history list
    const histData = await fetchHistory(50);
    if (histData?.history) setHistory(histData.history);

    // Fetch aggregated analytics
    const analyticsData = await fetchAnalytics();
    if (analyticsData) {
      if (analyticsData.frequency?.length) setFrequency(analyticsData.frequency);
      if (analyticsData.trend?.length)     setTrend(analyticsData.trend);
    } else {
      setError('Backend unavailable – showing demo data.');
    }

    setLoading(false);
  }, []);

  const clearHistory = useCallback(async () => {
    setClearing(true);
    setError(null);

    const result = await clearHistoryRequest();
    if (!result) {
      setError('Unable to clear history right now.');
      setClearing(false);
      return false;
    }

    setHistory([]);
    setFrequency([]);
    setTrend([]);
    setClearing(false);
    return true;
  }, []);

  // Initial fetch on mount
  useEffect(() => { refresh(); }, [refresh]);

  return { history, frequency, trend, loading, clearing, error, refresh, clearHistory };
}

