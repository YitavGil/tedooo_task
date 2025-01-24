import { useEffect, useCallback, useRef } from 'react';
import { useFeedStore } from '../store/slices/feedSlice';
import { feedApi } from '../services/api/feedApi';
import type { Post, ApiError, LoadingState } from '../types';

interface UseFeedOutput {
  posts: ReadonlyArray<Post>;
  hasMore: boolean;
  isLoading: boolean;
  error: ApiError | null;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
}

interface FeedState {
  isInitialized: boolean;
  isFetching: boolean;
}

export const useFeed = (): UseFeedOutput => {
  const feedStateRef = useRef<FeedState>({
    isInitialized: false,
    isFetching: false
  });
  const pageRef = useRef(0);
  
  const selectPosts = useCallback((state: ReturnType<typeof useFeedStore.getState>) => 
    state.posts, []);
  const selectHasMore = useCallback((state: ReturnType<typeof useFeedStore.getState>) => 
    state.hasMore, []);
  const selectLoadingState = useCallback((state: ReturnType<typeof useFeedStore.getState>) => 
    state.loadingState, []);
  const selectError = useCallback((state: ReturnType<typeof useFeedStore.getState>) => 
    state.error, []);

  const posts = useFeedStore(selectPosts);
  const hasMore = useFeedStore(selectHasMore);
  const loadingState = useFeedStore(selectLoadingState);
  const error = useFeedStore(selectError);
  
  const {
    appendPosts,
    setHasMore,
    setLoadingState,
    setError,
    resetFeed
  } = useFeedStore();

  const updateLoadingState = useCallback((state: LoadingState) => {
    setLoadingState(state);
  }, [setLoadingState]);

  const loadFeed = useCallback(async () => {
    if (feedStateRef.current.isFetching) return;
    
    try {
      feedStateRef.current.isFetching = true;
      updateLoadingState('loading');
      
      const response = await feedApi.getFeedItems(pageRef.current);
      
      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      appendPosts(response.data);
      setHasMore(response.hasMore);
      setError(null);
      updateLoadingState('success');
      
      pageRef.current += 1;
    } catch (err) {
      const apiError = err instanceof Error 
        ? {
            message: err.message,
            code: 'UNKNOWN_ERROR',
            status: 500
          } 
        : err as ApiError;
      
      setError(apiError);
      updateLoadingState('error');
    } finally {
      feedStateRef.current.isFetching = false;
    }
  }, [appendPosts, setHasMore, updateLoadingState, setError]);

  const loadMore = useCallback(async () => {
    if (!hasMore || feedStateRef.current.isFetching || loadingState === 'loading') return;
    await loadFeed();
  }, [hasMore, loadingState, loadFeed]);

  const retry = useCallback(async () => {
    if (loadingState === 'error') {
      setError(null);
      updateLoadingState('idle');
      await loadFeed();
    }
  }, [loadFeed, setError, updateLoadingState, loadingState]);

  useEffect(() => {
    const initializeFeed = async () => {
      if (!feedStateRef.current.isInitialized) {
        feedStateRef.current.isInitialized = true;
        resetFeed();
        pageRef.current = 0;
        await loadFeed();
      }
    };

    initializeFeed();
    
    return () => {
      feedStateRef.current = {
        isInitialized: false,
        isFetching: false
      };
    };
  }, [resetFeed, loadFeed]);

  return {
    posts,
    hasMore,
    isLoading: loadingState === 'loading',
    error,
    loadMore,
    retry
  };
};