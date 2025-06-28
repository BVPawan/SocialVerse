import React, { useState } from 'react';

const CreatePost = () => {
  const [postText, setPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim()) return;

    setIsLoading(true);

    try {
      // TODO: Add blockchain/canister call here
      console.log('Creating post:', postText);

      // Reset form
      setPostText('');
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h2>Create New Post</h2>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="post-input-container">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            rows="4"
            maxLength="280"
            className="post-textarea"
          />
          <div className="character-count">
            {postText.length}/280
          </div>
        </div>

        <div className="post-actions">
          <div className="post-options">
            <button type="button" className="option-btn">
              📷 Photo
            </button>
            <button type="button" className="option-btn">
              🎬 Video
            </button>
            <button type="button" className="option-btn">
              📍 Location
            </button>
          </div>

          <button
            type="submit"
            className="post-submit-btn"
            disabled={!postText.trim() || isLoading}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;