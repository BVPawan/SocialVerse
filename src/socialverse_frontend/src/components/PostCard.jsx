import React, { useState } from 'react';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
  };

  return (
    <div className="border-b border-gray-200 p-6 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        {/* Avatar */}
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-base">{post.author.name}</h3>
            <span className="text-gray-500 text-sm">{post.author.username}</span>
            <span className="text-gray-500 text-xs">·</span>
            <span className="text-gray-500 text-xs">{post.time}</span>
          </div>
          {/* Content */}
          <p className="text-gray-900 text-base mb-3">{post.content}</p>
          {/* Image */}
          {post.image && (
            <div className="mb-3">
              <img
                src={post.image}
                alt="Post visual"
                className="w-full rounded-xl max-h-96 object-cover"
              />
            </div>
          )}
          {/* Actions */}
          <div className="flex space-x-6 text-gray-500 text-sm mt-2 items-center">
            <button
              className={`flex items-center space-x-1 focus:outline-none ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
              onClick={handleLike}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={liked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10 0V6a4 4 0 00-8 0v2m8 0H7"
                />
              </svg>
              <span>{post.comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
