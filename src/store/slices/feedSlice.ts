import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { FeedState, Post, ApiError } from '../../types';

const initialState: FeedState = {
  posts: [],
  hasMore: true,
  loadingState: 'idle',
  error: null,
  lastUpdated: null,
  impressions: new Set()
};

interface FeedActions {
  setPosts: (posts: Post[]) => void;
  appendPosts: (newPosts: Post[]) => void;
  setHasMore: (hasMore: boolean) => void;
  setLoadingState: (state: FeedState['loadingState']) => void;
  setError: (error: ApiError | null) => void;
  toggleLike: (postId: string) => void;
  updatePostLikes: (postId: string, totalLikes: number, isLiked: boolean) => void;
  batchUpdatePosts: (updates: Array<{ id: string; changes: Partial<Post> }>) => void;
  markAsImpressed: (postId: string) => void;
  resetFeed: () => void;
}

type FeedStore = FeedState & FeedActions;

export const useFeedStore = create<FeedStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setPosts: (posts) => 
          set({ 
            posts, 
            lastUpdated: Date.now(),
            loadingState: 'success' 
          }),

        appendPosts: (newPosts) => {
          const currentPosts = get().posts;
          const uniqueNewPosts = newPosts.filter(
            newPost => !currentPosts.some(post => post.id === newPost.id)
          );
          
          set((state) => ({
            posts: [...state.posts, ...uniqueNewPosts],
            lastUpdated: Date.now()
          }));
        },

        setHasMore: (hasMore) => set({ hasMore }),

        setLoadingState: (loadingState) => set({ loadingState }),

        setError: (error) => 
          set((state) => ({
            error,
            loadingState: error ? 'error' : state.loadingState,
            posts: state.posts
          })),

        toggleLike: (postId) => {
          const post = get().posts.find(p => p.id === postId);
          if (!post) return;

          const currentLikes = typeof post.likes === 'number' ? 
            { total: post.likes, isLiked: post.didLike } :
            post.likes;

          set((state) => ({
            posts: state.posts.map(post =>
              post.id === postId
                ? {
                    ...post,
                    likes: {
                      total: currentLikes.total + (post.didLike ? -1 : 1),
                      isLiked: !post.didLike
                    },
                    didLike: !post.didLike
                  }
                : post
            )
          }));
        },

        updatePostLikes: (postId, totalLikes, isLiked) => {
          const postIndex = get().posts.findIndex(p => p.id === postId);
          if (postIndex === -1) return;

          set((state) => {
            const newPosts = [...state.posts];
            newPosts[postIndex] = {
              ...newPosts[postIndex],
              likes: { total: totalLikes, isLiked },
              didLike: isLiked
            };
            return { posts: newPosts };
          });
        },

        batchUpdatePosts: (updates) =>
          set((state) => {
            const postsMap = new Map(state.posts.map(post => [post.id, post]));
            
            updates.forEach(({ id, changes }) => {
              if (postsMap.has(id)) {
                postsMap.set(id, { ...postsMap.get(id)!, ...changes });
              }
            });
            
            return { 
              posts: Array.from(postsMap.values()),
              lastUpdated: Date.now()
            };
          }),

        markAsImpressed: (postId) =>
          set((state) => ({
            impressions: new Set([...state.impressions, postId])
          })),

        resetFeed: () => set(initialState)
      }),
      {
        name: 'feed-storage',
        partialize: (state) => ({
          lastUpdated: state.lastUpdated,
          impressions: Array.from(state.impressions)
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.impressions = new Set(Array.isArray(state?.impressions) ? state.impressions : []);
          }
        }
      }
    ),
    { name: 'feed-store' }
  )
);

export const selectPosts = (state: FeedStore) => state.posts;
export const selectHasMore = (state: FeedStore) => state.hasMore;
export const selectLoadingState = (state: FeedStore) => state.loadingState;
export const selectError = (state: FeedStore) => state.error;
export const selectIsPostImpressed = (postId: string) => 
  (state: FeedStore) => state.impressions.has(postId);