import React from 'react';

const Sidebar = ({ userProfile, onNavigate }) => {
  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
        </svg>
      ),
      active: true
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
        </svg>
      ),
      active: false
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
        </svg>
      ),
      active: false
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
        </svg>
      ),
      active: false
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
        </svg>
      ),
      active: false
    }
  ];

  const defaultUserProfile = {
    name: 'Sophia',
    username: '@sophia.miller',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  };

  const profile = userProfile || defaultUserProfile;

  const handleMenuClick = (itemId) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  const handlePostClick = () => {
    if (onNavigate) {
      onNavigate('post');
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
      <div className="p-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-3 mb-8">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{profile.name}</h3>
            <p className="text-gray-500 text-sm">{profile.username}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {item.icon}
              <span className={item.active ? 'font-medium' : ''}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Post Button */}
        <button
          onClick={handlePostClick}
          className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Sidebar;