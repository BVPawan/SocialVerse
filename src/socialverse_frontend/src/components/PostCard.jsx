import React, { useState, useEffect } from 'react';
import { createActor, canisterId } from '../../../declarations/socialverse_backend';
import { useUser } from '../UserContext';

const backend = createActor(canisterId);

const PostCard = ({ post, onLike }) => {
  const { user } = useUser();
  const userPrincipal = user && user.principal ? user.principal.toString() : null;
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const normalizedLikes = likes.map(like => like && like.toString ? like.toString() : String(like));
  const liked = userPrincipal ? normalizedLikes.includes(userPrincipal) : false;
  const likeCount = normalizedLikes.length;

  let imageUrl = null;
  if (Array.isArray(post.image) && post.image.length > 0 && typeof post.image[0] === 'string' && post.image[0]) {
    imageUrl = post.image[0];
  }

  const avatarUrl = post.author.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face';

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  // Always use local comments state for count
  const commentCount = comments.length;

  // Fetch comments only when showComments is true and not already loaded
  useEffect(() => {
    if (!showComments || commentsLoaded) return;
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const fetched = await backend.get_comments(BigInt(post.id));
        setComments(fetched);
        setCommentsLoaded(true);
      } catch (e) {
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [post.id, showComments, commentsLoaded]);

  // Toggle comments section and fetch if not loaded
  const handleToggleComments = () => {
    setShowComments((prev) => {
      const next = !prev;
      if (next && !commentsLoaded) {
        setCommentsLoaded(false); // will trigger fetch
      }
      return next;
    });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !userPrincipal) return;
    setAddingComment(true);
    try {
      const comment = {
        user_principal: user.principal,
        username: user.username,
        text: commentText,
        timestamp: BigInt(Date.now()),
      };
      await backend.add_comment(BigInt(post.id), comment);
      setCommentText('');
      // Always refetch comments and update count
      setLoadingComments(true);
      const fetched = await backend.get_comments(BigInt(post.id));
      setComments(fetched);
      setLoadingComments(false);
      setCommentsLoaded(true);
    } catch (e) {
      setLoadingComments(false);
      console.error('Failed to add comment:', e);
    } finally {
      setAddingComment(false);
    }
  };

  const handleLike = async () => {
    if (!userPrincipal) return;
    try {
      await backend.like_post(BigInt(post.id), user.principal);
      if (onLike) onLike();
    } catch (e) {
      console.error('Failed to like post:', e);
    }
  };

  return (
    <div className="border-b border-gray-200 p-6 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        {/* Avatar */}
        <img
          src={avatarUrl}
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
          {imageUrl && (
            <div className="mb-3">
              <img
                src={imageUrl}
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
              disabled={liked}
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
            <button
              className="flex items-center space-x-1 hover:text-blue-500 focus:outline-none"
              onClick={handleToggleComments}
            >
              {/* Instagram-style comment icon */}
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
                  d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"
                />
              </svg>
              <span>{commentCount}</span>
            </button>
          </div>
          {/* Comments Section - Instagram style, toggled */}
          {showComments && (
            <div className="mt-4">
              {loadingComments ? (
                <div className="text-gray-400 text-sm">Loading comments...</div>
              ) : (
                comments.length === 0 ? (
                  <div className="text-gray-400 text-sm">No comments yet.</div>
                ) : (
                  <div className="space-y-2">
                    {comments.map((c, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <img
                          src={post.author.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'}
                          alt={c.username}
                          className="w-7 h-7 rounded-full mt-1"
                        />
                        <div>
                          <span className="font-semibold text-xs text-gray-800">{c.username}</span>
                          <span className="text-gray-500 text-xs ml-2">{new Date(Number(c.timestamp)).toLocaleString()}</span>
                          <div className="text-gray-700 text-sm">{c.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
              {/* Add Comment Input */}
              <form className="flex items-center mt-3 space-x-2" onSubmit={handleAddComment}>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  disabled={addingComment}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-600 disabled:opacity-50"
                  disabled={addingComment || !commentText.trim()}
                >
                  {addingComment ? 'Posting...' : 'Post'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
