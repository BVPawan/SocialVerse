import React from 'react';
import { useUser } from '../UserContext';

const Sidebar = ({ suggestions = [], trends = [], onNavigate }) => {
  const { user } = useUser();
  const defaultUserProfile = {
    name: 'Sophia',
    username: '@sophia.miller',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  };

  const profile = user || defaultUserProfile;

  const handlePostClick = () => {
    if (onNavigate) {
      onNavigate('post');
    }
  };

  return (
    <aside className="w-64 bg-white/90 backdrop-blur shadow-lg rounded-2xl border border-gray-100 p-6 fixed h-full flex flex-col items-center font-sans transition-all duration-200">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-10">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-16 h-16 rounded-full border-2 border-blue-200 shadow-md mb-2 object-cover"
        />
        <h3 className="font-bold text-lg text-gray-900 leading-tight">{profile.name}</h3>
        <p className="text-gray-500 text-sm font-mono">{profile.username}</p>
      </div>

      {/* Post Button */}
      <button
        onClick={handlePostClick}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-full shadow transition-colors duration-150 mb-8 text-base"
      >
        Post
      </button>

      {/* Trends Section */}
      {trends && trends.length > 0 && (
        <div className="w-full mb-8">
          <h4 className="text-gray-800 font-semibold mb-3 text-base">Trends for you</h4>
          <ul className="space-y-2">
            {trends.map((trend, idx) => (
              <li key={idx} className="text-blue-600 hover:underline cursor-pointer text-sm">{trend.tag} <span className="text-gray-400">{trend.posts}</span></li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions Section */}
      {suggestions && suggestions.length > 0 && (
        <div className="w-full">
          <h4 className="text-gray-800 font-semibold mb-3 text-base">Who to follow</h4>
          <ul className="space-y-4">
            {suggestions.map((user, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{user.name}</h3>
                    <p className="text-gray-500 text-xs font-mono">{user.username}</p>
                  </div>
                </div>
                <button className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors">Follow</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;