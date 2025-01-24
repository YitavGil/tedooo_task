import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FeedState, Post, ApiError } from '../../types';

const initialState: FeedState = {
 posts: [],
 hasMore: true,
 loadingState: 'idle',
 error: null,
 lastUpdated: null,
 impressions: new Set<string>()
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

export const useFeedStore = create<FeedState & FeedActions>()(
 persist(
   devtools(
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
           impressions: new Set([...Array.from(state.impressions), postId])
         })),

       resetFeed: () => set({ 
         ...initialState,
         impressions: new Set<string>()
       })
     }),
     { name: 'feed-store' }
   ),
   {
     name: 'feed-storage',
     partialize: (state) => ({
       posts: state.posts,
       lastUpdated: state.lastUpdated,
       impressions: Array.from(state.impressions)
     }),
     onRehydrateStorage: () => (state) => {
       if (state && Array.isArray(state.impressions)) {
         state.impressions = new Set(state.impressions);
       }
     }
   }
 )
);

export const selectPosts = (state: FeedState) => state.posts;
export const selectHasMore = (state: FeedState) => state.hasMore;
export const selectLoadingState = (state: FeedState) => state.loadingState;
export const selectError = (state: FeedState) => state.error;
export const selectIsPostImpressed = (postId: string) => 
 (state: FeedState) => state.impressions.has(postId);