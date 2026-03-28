/**
 * useEmotionData.js
 * ─────────────────────────────────────────────────────────────────
 * Custom hook that resolves active brain regions for a selected emotion.
 * Uses API data when available, falls back to local static mappings.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchEmotionData, saveEmotionSelection } from '../utils/api';
import { EMOTION_MAPPINGS } from '../utils/emotionMappings';

export default function useEmotionData() {
  const [selectedEmotion, setSelectedEmotion]         = useState(null);
  const [activeRegions,   setActiveRegions]           = useState([]);
  const [intensityMult,   setIntensityMult]           = useState(1.0);
  const [loading,         setLoading]                 = useState(false);
  const [source,          setSource]                  = useState('local');  // 'local' | 'database'

  // Derive active regions whenever emotion or multiplier changes
  useEffect(() => {
    if (!selectedEmotion) {
      setActiveRegions([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      // 1. Try to fetch from API
      const data = await fetchEmotionData(selectedEmotion);

      if (cancelled) return;

      if (data?.regions?.length) {
        setActiveRegions(
          data.regions.map(r => ({
            name:      r.name,
            intensity: Math.min(r.intensity * intensityMult, 1),
            desc:      r.function_desc || r.function || '',
          }))
        );
        setSource(data.source || 'database');
      } else {
        // 2. Fall back to local static mappings
        const local = EMOTION_MAPPINGS[selectedEmotion] || [];
        setActiveRegions(
          local.map(r => ({
            name:      r.name,
            intensity: Math.min(r.intensity * intensityMult, 1),
            desc:      r.function_desc || '',
          }))
        );
        setSource('local');
      }

      setLoading(false);
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmotion]);

  // Re-scale intensities when multiplier slider changes (no API call needed)
  useEffect(() => {
    if (!selectedEmotion) return;

    const base = EMOTION_MAPPINGS[selectedEmotion] || [];
    setActiveRegions(
      base.map(r => ({
        name:      r.name,
        intensity: Math.min(r.intensity * intensityMult, 1),
        desc:      r.function_desc || '',
      }))
    );
  }, [intensityMult, selectedEmotion]);

  // Persist selection to history via API (fire-and-forget)
  const selectEmotion = useCallback((emotion) => {
    setSelectedEmotion(emotion);
    if (emotion) saveEmotionSelection(emotion, intensityMult);
  }, [intensityMult]);

  return {
    selectedEmotion,
    activeRegions,
    intensityMult,
    setIntensityMult,
    selectEmotion,
    loading,
    source,
  };
}

