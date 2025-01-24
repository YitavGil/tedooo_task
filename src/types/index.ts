export interface User {
    id: string;
    name: string;
    avatar: string;
    shopName: string;
  }
  
  export interface PostImage {
    id: string;
    url: string;
    alt?: string;
  }
  
  export interface Post {
    id: string;
    userId: string;
    username: string;
    shopId: string;
    shopName: string;
    avatar: string;
    text: string;
    images: string[];
    date: string;
    likes: number | { total: number; isLiked: boolean };
    didLike: boolean;
    comments: number;
    premium: boolean;
  }
  
  export interface FeedResponse {
    data: Post[];
    hasMore: boolean;
  }
  
  export type LoadingState = 'idle' | 'loading' | 'error' | 'success';
  
  export interface ApiError {
    message: string;
    code?: string;
    status?: number;
  }
  
  export interface FeedParams {
    skip: number;
    limit: number;
  }
  
  
  export interface FeedState {
    posts: Post[];
    hasMore: boolean;
    loadingState: LoadingState;
    error: ApiError | null;
    lastUpdated: number | null;
    impressions: Set<string>;
  }
  
  export type PostInteractionType = 'like' | 'unlike' | 'impression';
  
  export interface PostInteractionParams {
    postId: string;
    type: PostInteractionType;
  }