// src/components/feed/FeedItem/FeedItem.tsx

import React from 'react';
import { Post } from '../../../types';
import FeedItemHeader from './FeedItemHeader';
import FeedItemContent from './FeedItemContent';
import FeedItemFooter from './FeedItemFooter';

interface FeedItemProps {
  post: Post;
}

export const FeedItem: React.FC<FeedItemProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
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