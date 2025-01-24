import { useCallback, useState } from 'react';
import { useFeedStore } from '../store/slices/feedSlice';
import type { ApiError } from '../types';

interface UseLikesOutput {
 toggleLike: (postId: string) => Promise<void>;
 isLoading: boolean;
 error: ApiError | null;
}

export const useLikes = (): UseLikesOutput => {
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<ApiError | null>(null);
 const { toggleLike: toggleLikeInStore } = useFeedStore();

 const toggleLike = useCallback(async (postId: string) => {
   if (isLoading) return;
   setIsLoading(true);
   
   try {
     toggleLikeInStore(postId);
   } catch (err) {
     const apiError: ApiError = {
       message: err instanceof Error ? err.message : 'Unknown error occurred',
       code: 'UNKNOWN_ERROR',
       status: 500
     };
     setError(apiError);
   } finally {
     setIsLoading(false);
   }
 }, [isLoading, toggleLikeInStore]);

 return {
   toggleLike,
   isLoading,
   error
 };
};