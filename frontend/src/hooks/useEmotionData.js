/**
 * useEmotionData.js
 * ─────────────────────────────────────────────────────────────────
 * Custom hook that resolves active brain regions for a selected emotion.
 * Uses API data when available, falls back to local static mappings.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchEmotionData, saveEmotionSelection } from '../utils/api';
import { EMOTION_MAPPINGS } from '../utils/emotionMappings';
import { useToast } from './useToast';

function scaleRegions(regions, multiplier) {
  return regions.map((region) => ({
    name: region.name,
    intensity: Math.min((Number(region.intensity) || 0) * multiplier, 1),
    desc: region.function_desc || region.function || '',
  }));
}

export default function useEmotionData() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [baseRegions, setBaseRegions] = useState([]);
  const [activeRegions, setActiveRegions] = useState([]);
  const [intensityMult, setIntensityMult] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('local');  // 'local' | 'database'
  const { pushToast } = useToast();

  // Derive active regions whenever emotion or multiplier changes
  useEffect(() => {
    if (!selectedEmotion) {
      setBaseRegions([]);
      setActiveRegions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        // 1. Try to fetch from API
        const data = await fetchEmotionData(selectedEmotion);

        if (cancelled) return;

        if (data?.regions?.length) {
          const regions = data.regions.map(r => ({
            name: r.name,
            intensity: Number(r.intensity) || 0,
            desc: r.function_desc || r.function || '',
          }));

          setBaseRegions(regions);
          setActiveRegions(scaleRegions(regions, intensityMult));
          setSource(data.source || 'database');
        } else {
          // 2. Fall back to local static mappings
          const local = EMOTION_MAPPINGS[selectedEmotion] || [];
          setBaseRegions(local);
          setActiveRegions(scaleRegions(local, intensityMult));
          setSource('local');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmotion]);

  // Re-scale intensities when multiplier slider changes (no API call needed)
  useEffect(() => {
    if (!selectedEmotion) return;

    setActiveRegions(scaleRegions(baseRegions, intensityMult));
  }, [baseRegions, intensityMult, selectedEmotion]);

  // Persist selection to history via API (fire-and-forget)
  const selectEmotion = useCallback(async (emotion) => {
    setSelectedEmotion(emotion);
    if (!emotion) return;

    const result = await saveEmotionSelection(emotion, intensityMult);
    if (result) {
      pushToast({
        title: 'Emotion saved',
        description: `${emotion} was added to history.`,
        tone: 'success',
      });
      return;
    }

    pushToast({
      title: 'Offline mode',
      description: 'Emotion updated locally, but the history entry was not saved.',
      tone: 'warning',
    });
  }, [intensityMult, pushToast]);

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

