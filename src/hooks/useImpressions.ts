import { useCallback, useRef, useEffect } from 'react';
import { useFeedStore } from '../store/slices/feedSlice';
import { feedApi } from '../services/api/feedApi';

interface UseImpressionsOutput {
  trackImpression: (postId: string) => void;
  hasBeenImpressed: (postId: string) => boolean;
}

export const useImpressions = (): UseImpressionsOutput => {
  // Queue for batching impression tracking
  const queueRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Get store actions
  const { markAsImpressed } = useFeedStore();
  const impressions = useFeedStore(state => state.impressions);

  // Batch process queued impressions
  const processQueue = useCallback(async () => {
    if (queueRef.current.size === 0) return;

    const impressionsToTrack = Array.from(queueRef.current);
    queueRef.current.clear();

    try {
      // Track all queued impressions in parallel
      await feedApi.batchTrackImpressions(impressionsToTrack);
      
      // Mark all as impressed in store after successful tracking
      impressionsToTrack.forEach(postId => {
        markAsImpressed(postId);
      });
    } catch (error) {
      console.warn('Failed to track impressions:', error);
      // Optionally retry failed impressions
    }
  }, [markAsImpressed]);

  // Queue an impression for tracking
  const trackImpression = useCallback((postId: string) => {
    // Skip if already impressed
    if (impressions.has(postId)) return;

    // Add to queue
    queueRef.current.add(postId);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to process queue
    timeoutRef.current = setTimeout(processQueue, 1000);
  }, [impressions, processQueue]);

  // Check if a post has been impressed
  const hasBeenImpressed = useCallback((postId: string) => {
    return impressions.has(postId);
  }, [impressions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        // Process any remaining impressions
        processQueue();
      }
    };
  }, [processQueue]);

  return {
    trackImpression,
    hasBeenImpressed
  };
};