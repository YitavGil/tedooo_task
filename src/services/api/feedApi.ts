
import { apiClient } from './client';
import { FeedResponse, Post } from '../../types';
import { useFeedStore } from '../../store/slices/feedSlice';

export class FeedApiService {
  private static readonly PAGINATION_SIZE = 6;
  
  static async getFeedItems(page = 0): Promise<FeedResponse> {
    try {
      const skip = page * this.PAGINATION_SIZE;
      
      if (skip < 0) {
        throw new Error('Invalid pagination parameters');
      }

      const response = await apiClient.get<FeedResponse>('/hw/feed.json', {
        params: { skip },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        throw new Error('Invalid server response format');
      }

      return response.data;
    } catch (error) {
      console.error('Failed to fetch feed items:', error);
      throw error;
    }
  }

  static async toggleLike(postId: string, isLiked: boolean): Promise<Post['likes']> {
    try {
      const endpoint = `/hw/${isLiked ? 'like' : 'unlike'}/${postId}`;
      const response = await apiClient.post<{totalLikes: number}>(endpoint);
      
      // השינוי פה
      const currentPost = useFeedStore.getState().posts.find(p => p.id === postId);
      if (!currentPost) throw new Error('Post not found');
      
      return {
        total: response.data.totalLikes,
        isLiked: !currentPost.didLike
      };
    } catch (error) {
      console.error(`Failed to ${isLiked ? 'like' : 'unlike'} post:`, error);
      throw error;
    }
  }

  static async trackImpression(postId: string): Promise<void> {
    try {
      await apiClient.post(`/hw/impression/${postId}`);
    } catch (error) {
      console.warn('Failed to track impression:', error);
    }
  }

  static async batchTrackImpressions(postIds: string[]): Promise<void> {
    if (!postIds.length) return;

    try {
      await Promise.allSettled(
        postIds.map(id => this.trackImpression(id))
      );
    } catch (error) {
      console.warn('Failed to batch track impressions:', error);
    }
  }
}

export const feedApi = FeedApiService;