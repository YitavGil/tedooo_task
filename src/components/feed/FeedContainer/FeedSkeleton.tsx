// src/components/feed/FeedContainer/FeedSkeleton.tsx

import React from 'react';

export const FeedSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 w-full animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        {/* Avatar skeleton */}
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        
        {/* User info skeleton */}
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>

      {/* Image skeleton */}
      <div className="mt-4 h-48 bg-gray-200 rounded" />

      {/* Actions skeleton */}
      <div className="flex items-center space-x-4 mt-4">
        <div className="h-8 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
};