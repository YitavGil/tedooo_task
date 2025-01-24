import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useFeedStore } from '@/store/slices/feedSlice';
import { FeedSkeleton } from './FeedSkeleton';
import { FeedItem } from '../FeedItem/FeedItem';
import { feedApi } from '@/services/api/feedApi';

const FeedContainer: React.FC = () => {
  const { posts, hasMore, loadingState, appendPosts, setHasMore, setLoadingState } = useFeedStore();
  const pageRef = useRef(0);
  
  const { ref, inView } = useInView({
    threshold: 0.5,
    delay: 100
  });

  const fetchPosts = async () => {
    if (loadingState === 'loading' || !hasMore) return;

    try {
      setLoadingState('loading');
      const response = await feedApi.getFeedItems(pageRef.current);
      
      if (response.data) {
        appendPosts(response.data);
        setHasMore(response.hasMore);
        pageRef.current += 1;
      }
      
      setLoadingState('success');
    } catch (error) {
      setLoadingState('error');
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {
    if (inView && hasMore) {
      fetchPosts();
    }
  }, [inView, hasMore]);

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, []);

  return (
    <div className="max-w-[1250px] mx-auto py-6 space-y-6 sans-content">
      {posts.map((post) => (
        <FeedItem key={post.id} post={post} />
      ))}
      
      <div ref={ref} className="h-20">
        {loadingState === 'loading' && <FeedSkeleton />}
      </div>
      
      {loadingState === 'error' && (
        <div className="text-center py-4 text-red-500">
          Failed to load posts. Please try again later.
        </div>
      )}
    </div>
  );
};

export default FeedContainer;