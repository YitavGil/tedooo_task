import React from 'react';

interface FeedItemHeaderProps {
  username: string;
  shopName: string;
  avatar: string;
  date: string;
  premium: boolean;
}

const FeedItemHeader: React.FC<FeedItemHeaderProps> = ({
  username,
  shopName,
  avatar,
  date,
}) => {
  const formatDate = (dateString: string) => {
    const timeAgo = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffInHours = Math.floor((now - timeAgo) / (1000 * 60 * 60));
    return diffInHours;
  };

  return (
    <div className="flex items-start gap-2.5 mb-2">
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-medium text-gray-900">{username}</span>
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-blue-600">{shopName}</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500">{formatDate(date)}h</span>
        </div>
      </div>
    </div>
  );
};

export default FeedItemHeader;