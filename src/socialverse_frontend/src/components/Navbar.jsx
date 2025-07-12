import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';

const Navbar = () => {
  const { user, logout } = useUser();
  const location = useLocation();

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-12 py-4 flex items-center justify-between z-50 shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center gap-5">
        <Link to="/home" className="flex items-center gap-3 select-none">
          <span className="inline-block bg-gradient-to-tr from-purple-500 to-purple-300 p-2 rounded-2xl">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32"><rect x="6" y="6" width="20" height="20" rx="6" fill="#a78bfa" /><g><path d="M16 11v10M11 16h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></g></svg>
          </span>
          <span className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text tracking-tight">SocialVerse</span>
        </Link>
      </div>
      {/* Center: Nav Links */}
      <div className="flex-1 flex items-center justify-center gap-12">
        <Link to="/home" className={`flex items-center gap-2 text-base font-semibold transition-colors duration-150 ${location.pathname === '/home' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>{/* Home icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9" /><path d="M9 21V9h6v12" /></svg>
          Home
        </Link>
        <Link to="/explore" className={`flex items-center gap-2 text-base font-semibold transition-colors duration-150 ${location.pathname === '/explore' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>{/* Compass icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M16.24 7.76l-4.24 1.41-1.41 4.24 4.24-1.41z" /></svg>
          Explore
        </Link>
        <Link to="/profile" className={`flex items-center gap-2 text-base font-semibold transition-colors duration-150 ${location.pathname === '/profile' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>{/* User icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2" /></svg>
          Profile
        </Link>
        <Link to="/create" className={`flex items-center gap-2 text-base font-semibold transition-colors duration-150 ${location.pathname === '/create' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>{/* Plus icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
          Create Post
        </Link>
      </div>
      {/* Right: Search, Avatar & Logout */}
      <div className="flex items-center gap-8">
        {user?.avatar && (
          <Link to="/profile" className="block">
            <span className="block w-12 h-12 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-1">
              <img
                src={Array.isArray(user.avatar) ? user.avatar[0] : user.avatar}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
            </span>
          </Link>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-base font-semibold text-red-500 hover:text-red-600 transition px-3 py-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /><path d="M3 12a9 9 0 0118 0 9 9 0 01-18 0z" /></svg>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
