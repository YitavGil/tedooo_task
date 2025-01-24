import { apiClient } from './client';
import { FeedResponse } from '../../types';

export class FeedApiService {
  private static readonly PAGINATION_SIZE = 6;
  private static readonly BASE_URL = 'https://backend.tedooo.com';
  private static readonly IMPRESSION_TIMEOUT = 5000;

  static async getFeedItems(page = 0): Promise<FeedResponse> {
    const skip = page * this.PAGINATION_SIZE;
    
    if (skip < 0) {
      throw new Error('Invalid pagination parameters');
    }

    const response = await apiClient.get<FeedResponse>(`${this.BASE_URL}/hw/feed.json`, {
      params: { skip },
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response?.data?.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid server response format');
    }

    return response.data;
  }

  static async toggleLike(postId: string): Promise<{total: number}> {
    if (!postId) throw new Error('Post ID is required');

    const endpoint = `${this.BASE_URL}/hw/like/${postId}`;
    const response = await apiClient.post<{totalLikes: number}>(endpoint);
    
    return { total: response.data.totalLikes };
  }

  static async trackImpression(postId: string): Promise<void> {
    if (!postId) throw new Error('Post ID is required');

    await apiClient.post(`${this.BASE_URL}/?itemId=${postId}`, null, {
      timeout: this.IMPRESSION_TIMEOUT
    });
  }

  static async batchTrackImpressions(postIds: string[]): Promise<void> {
    if (!postIds?.length) return;

    await Promise.allSettled(
      postIds.map(id => this.trackImpression(id))
    ).catch(error => {
      console.warn('Some impression tracking requests failed:', error);
    });
  }
}

export const feedApi = FeedApiService;