import React from "react";
import { useLikes } from "@/hooks/useLikes";
import likeImg from "@/assets/like.png";

interface FeedItemFooterProps {
  postId: string;
  likes: number | { total: number; isLiked: boolean };
  didLike: boolean;
  comments: number;
}

const FeedItemFooter: React.FC<FeedItemFooterProps> = ({
  postId,
  likes,
  didLike,
  comments,
}) => {
  const { toggleLike, isLoading } = useLikes();

  const handleLike = async () => {
    if (!isLoading) {
      await toggleLike(postId);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center text-sm text-gray-500 px-2">
        <div className="flex gap-3">
          <img width={18} height={18} src={likeImg} alt="like" />
          <span>{typeof likes === "object" ? likes.total : likes} Likes</span>
        </div>

        <span>{comments} Comments</span>
      </div>

      <div className="w-[99%] mx-auto h-px bg-gray-200 my-3" />

      <div className="flex justify-center items-center md:gap-[30%] gap-5">
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center space-x-1 py-2 px-4 rounded-lg transition-colors ${
            didLike
              ? "text-[#0A66C2] hover:bg-blue-50"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-4.5 h-4.5"
            fill="none"
            stroke={didLike ? "#1D9BF0" : "currentColor"}
            strokeWidth={didLike ? "2" : "1.5"}
            viewBox="0 0 24 24"
          >
            <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905c0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>Like</span>
        </button>

        <button className="flex items-center space-x-2 py-2 px-4 rounded-lg text-gray-500 hover:bg-gray-50">
          <svg
            className="w-4.5 h-4.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default FeedItemFooter;
