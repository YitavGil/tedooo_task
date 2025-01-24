import { useCallback, useRef, useEffect } from 'react';
import { useFeedStore } from '../store/slices/feedSlice';
import { feedApi } from '../services/api/feedApi';

interface UseImpressionsOutput {
  trackImpression: (postId: string) => void;
  hasBeenImpressed: (postId: string) => boolean;
}

export const useImpressions = (): UseImpressionsOutput => {
  const queueRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { markAsImpressed } = useFeedStore();
  const impressions = useFeedStore(state => state.impressions);

  const processQueue = useCallback(async () => {
    if (queueRef.current.size === 0) return;

    const impressionsToTrack = Array.from(queueRef.current);
    queueRef.current.clear();

    try {
      await feedApi.batchTrackImpressions(impressionsToTrack);
      
      impressionsToTrack.forEach(postId => {
        markAsImpressed(postId);
      });
    } catch (error) {
      console.warn('Failed to track impressions:', error);
    }
  }, [markAsImpressed]);

  const trackImpression = useCallback((postId: string) => {
    if (impressions.has(postId)) return;

    queueRef.current.add(postId);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(processQueue, 1000);
  }, [impressions, processQueue]);

  const hasBeenImpressed = useCallback((postId: string) => {
    return impressions.has(postId);
  }, [impressions]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        processQueue();
      }
    };
  }, [processQueue]);

  return {
    trackImpression,
    hasBeenImpressed
  };
};