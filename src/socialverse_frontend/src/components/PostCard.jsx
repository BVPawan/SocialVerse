import React, { useState, useEffect, useRef } from 'react';
import { createActor, canisterId } from '../../../declarations/socialverse_backend';
import { useUser } from '../UserContext';

const backend = createActor(canisterId);

const PostCard = ({ post, onLike }) => {
  const { user, savedPosts, savePost, unsavePost } = useUser();
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
  const commentInputRef = useRef(null);

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

  // Auto-focus comment input when opening
  useEffect(() => {
    if (showComments && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [showComments]);

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

  // Like animation state
  const [likeAnim, setLikeAnim] = useState(false);
  const handleLike = async () => {
    if (!userPrincipal) return;
    try {
      await backend.like_post(BigInt(post.id), user.principal);
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 400);
      if (onLike) onLike();
    } catch (e) {
      console.error('Failed to like post:', e);
    }
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

  const postIdStr = post.id.toString();
  const isSaved = savedPosts && savedPosts.includes(postIdStr);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6 transition-all duration-200 hover:shadow-lg">
      <div className="flex space-x-4">
        {/* Avatar */}
        <img
          src={avatarUrl}
          alt={post.author.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{post.author.name}</h3>
            <span className="text-gray-500 text-sm font-mono">@{post.author.username}</span>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-gray-400 text-xs">{post.time}</span>
          </div>
          {/* Content */}
          <p className="text-gray-900 text-base mb-3 leading-snug">{post.content}</p>
          {/* Image */}
          {imageUrl && (
            <div className="mb-3 rounded-xl overflow-hidden border border-gray-100">
              <img
                src={imageUrl}
                alt="Post visual"
                className="w-full rounded-xl max-h-96 object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          )}
          {/* Actions */}
          <div className="flex space-x-8 text-gray-500 text-base mt-2 items-center">
            <button
              className={`flex items-center space-x-1 focus:outline-none transition-colors duration-150 ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
              onClick={handleLike}
              disabled={liked}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={liked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`w-6 h-6 transition-transform duration-200 ${likeAnim ? 'scale-125' : ''}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="font-semibold text-sm">{likeCount}</span>
            </button>
            <button
              className="flex items-center space-x-1 hover:text-blue-500 focus:outline-none transition-colors duration-150"
              onClick={handleToggleComments}
            >
              {/* Comment icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"
                />
              </svg>
              <span className="font-semibold text-sm">{commentCount}</span>
            </button>
            {/* Share button */}
            <button className="flex items-center space-x-1 hover:text-purple-500 focus:outline-none transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v2a4 4 0 004 4h8a4 4 0 004-4v-2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 6l-4-4-4 4m4-4v16" /></svg>
              <span className="font-semibold text-sm">Share</span>
            </button>
            {/* Save button */}
            <button
              type="button"
              className={`flex items-center space-x-1 focus:outline-none transition-colors duration-150 ${isSaved ? 'text-green-600' : 'hover:text-green-500'}`}
              onClick={() => isSaved ? unsavePost(postIdStr) : savePost(postIdStr)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
              </svg>
              <span className="font-semibold text-sm">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
          {/* Comments Section - Instagram style, toggled */}
          {showComments && (
            <div className="mt-4 animate-fadein">
              {loadingComments ? (
                <div className="text-gray-400 text-sm">Loading comments...</div>
              ) : (
                commentCount === 0 ? (
                  <div className="text-gray-400 text-sm">No comments yet.</div>
                ) : (
                  <div className="space-y-3">
                    {comments.map((c, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <img
                          src={post.author.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'}
                          alt={c.username}
                          className="w-8 h-8 rounded-full mt-1 border border-gray-200"
                        />
                        <div>
                          <span className="font-semibold text-xs text-gray-800">{c.username}</span>
                          <span className="text-gray-400 text-xs ml-2">{new Date(Number(c.timestamp)).toLocaleString()}</span>
                          <div className="text-gray-700 text-sm mt-0.5">{c.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
              {/* Add Comment Input */}
              <form className="flex items-center mt-4 space-x-2" onSubmit={handleAddComment}>
                <input
                  ref={commentInputRef}
                  type="text"
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm transition-all duration-150"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  disabled={addingComment}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow hover:bg-blue-600 transition-colors duration-150 disabled:opacity-50"
                  disabled={addingComment || !commentText.trim()}
                >
                  {addingComment ? (
                    <span className="flex items-center"><svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>Posting...</span>
                  ) : 'Post'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add fade-in animation
// Add this to your global CSS or index.scss:
// .animate-fadein { animation: fadeIn 0.3s ease; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none; } }

export default PostCard;
