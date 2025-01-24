import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Post } from '../../../types';
import { useImpressions } from '../../../hooks/useImpressions';
import FeedItemHeader from './FeedItemHeader';
import FeedItemContent from './FeedItemContent';
import FeedItemFooter from './FeedItemFooter';

interface FeedItemProps {
 post: Post;
}

export const FeedItem: React.FC<FeedItemProps> = ({ post }) => {
 const { trackImpression, hasBeenImpressed } = useImpressions();
 const { ref, inView } = useInView({
   threshold: 0.5,
   triggerOnce: true,
   delay: 1000
 });

 useEffect(() => {
   if (inView && !hasBeenImpressed(post.id)) {
     trackImpression(post.id);
   }
 }, [inView, post.id, trackImpression, hasBeenImpressed]);

 return (
   <article ref={ref} className="bg-white rounded-lg shadow-sm overflow-hidden">
     <div className="p-4">
       <FeedItemHeader 
         username={post.username}
         shopName={post.shopName}
         avatar={post.avatar}
         date={post.date}
         premium={post.premium}
       />
       
       <FeedItemContent 
         text={post.text}
         images={post.images}
       />
       
       <FeedItemFooter 
         postId={post.id}
         likes={post.likes}
         didLike={post.didLike}
         comments={post.comments}
       />
     </div>
   </article>
 );
};