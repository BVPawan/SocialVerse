import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

const CreatePost = () => {
  const [media, setMedia] = useState(defaultImage);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setMedia(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;
    setIsLoading(true);
    try {
      // TODO: Add blockchain/canister call here
      setCaption('');
      setHashtags('');
      setMedia(defaultImage);
      alert('Post created successfully!');
      navigate('/home');
    } catch (error) {
      alert('Error creating post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-0 w-full max-w-lg flex flex-col items-center relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={() => navigate(-1)}
          aria-label="Close"
        >
          ×
        </button>
        {/* Media Preview */}
        <div className="w-full flex justify-center rounded-t-2xl overflow-hidden relative" style={{height: '260px', background: '#f5f5f5'}}>
          <img src={media} alt="Preview" className="object-cover w-full h-full" />
          <button
            className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700 text-sm"
            onClick={() => fileInputRef.current.click()}
            type="button"
          >
            Change Media
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleMediaChange}
          />
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full p-8 pt-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-gray-800 text-sm placeholder:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags</label>
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="Add hashtags (e.g. #ICP #SocialVerse)"
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-800 text-sm placeholder:text-sm"
            />
            <div className="text-xs text-gray-400 mt-1">Separate hashtags with spaces or commas.</div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2 transition disabled:opacity-50"
            disabled={!caption.trim() || isLoading}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;