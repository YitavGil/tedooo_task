import React from 'react';

interface FeedItemContentProps {
  text: string;
  images: string[];
}

const FeedItemContent: React.FC<FeedItemContentProps> = ({ text, images }) => {
    
  return (
    <div className="feed-content -mx-4 mb-3">
      <p className="text-[14px] leading-[20px] text-gray-800 mb-4 max-w-[1070px] px-4 whitespace-pre-wrap">
        {text}
      </p>
      
      {images.length > 0 && (
        <div className="bg-[#B8C248] w-full ">
          <div className={`grid ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
            {images.map((image, index) => (
              <div 
                key={index}
                className={`relative ${images.length === 1 ? 'h-[440px]' : 'h-64'}`}
              >
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedItemContent;