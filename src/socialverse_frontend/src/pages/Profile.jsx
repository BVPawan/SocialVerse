import React, { useState } from 'react';
import { useUser } from '../UserContext';

const tabs = [
  { label: 'POSTS' },
  { label: 'SAVED' },
  { label: 'TAGGED' },
];

const postPlaceholders = Array(6).fill(null);

const Profile = () => {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(!user?.username); // If no user, show create profile form
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(form);
    setEditing(false);
  };

  // If no user profile, show Create Profile button and form
  if (!user?.username && !editing) {
    return (
      <div className="max-w-md mx-auto pt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setEditing(true)}
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-12 pb-10 border-b border-gray-200">
        <div className="flex-shrink-0 flex justify-center w-full md:w-auto mb-6 md:mb-0">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-36 h-36 rounded-full border-2 border-gray-300 object-cover shadow-sm"
          />
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
            <span className="text-2xl font-semibold mr-2 text-gray-900">{user.username}</span>
            <button
              className="inline-flex items-center bg-white border border-blue-600 text-blue-600 px-4 py-1.5 rounded-lg font-semibold text-sm shadow-sm hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => setEditing((v) => !v)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17.25V21h3.75l11.06-11.06a2.121 2.121 0 00-3-3L3 17.25z" /></svg>
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
            <div className="flex space-x-2 mt-3 md:mt-0">
              <button className="bg-blue-600 text-white px-5 py-1.5 rounded font-semibold text-sm hover:bg-blue-700 transition">Follow</button>
              <button className="bg-gray-100 text-gray-800 px-5 py-1.5 rounded font-semibold text-sm hover:bg-gray-200 transition">Message</button>
              <button className="bg-gray-100 px-3 py-1.5 rounded text-xl hover:bg-gray-200 transition">...</button>
            </div>
          </div>
          <div className="flex space-x-8 justify-center md:justify-start mb-4 text-center md:text-left">
            <div>
              <span className="font-bold text-lg text-gray-900">{user.posts}</span>
              <span className="ml-1 text-gray-600">posts</span>
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900">{user.followers}</span>
              <span className="ml-1 text-gray-600">followers</span>
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900">{user.following}</span>
              <span className="ml-1 text-gray-600">following</span>
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold block text-gray-900">{user.name}</span>
            <div className="text-gray-700 text-sm leading-snug">
              {user.bio && <span>{user.bio}<br /></span>}
              {user.about && <span>{user.about}<br /></span>}
              {user.link && <a href={user.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{user.link}</a>}
            </div>
          </div>
          {editing && (
            <form className="mt-4 space-y-2" onSubmit={handleSubmit}>
              <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="Avatar URL" className="w-full border p-2 rounded" />
              <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full border p-2 rounded" />
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" />
              <input name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" className="w-full border p-2 rounded" />
              <input name="about" value={form.about} onChange={handleChange} placeholder="About" className="w-full border p-2 rounded" />
              <input name="link" value={form.link} onChange={handleChange} placeholder="Link" className="w-full border p-2 rounded" />
              <div className="flex space-x-2">
                <input name="posts" value={form.posts} onChange={handleChange} placeholder="Posts" className="w-1/3 border p-2 rounded" />
                <input name="followers" value={form.followers} onChange={handleChange} placeholder="Followers" className="w-1/3 border p-2 rounded" />
                <input name="following" value={form.following} onChange={handleChange} placeholder="Following" className="w-1/3 border p-2 rounded" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded font-semibold text-sm">Save</button>
            </form>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-12 border-b border-gray-200 mt-8">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`py-4 px-2 text-sm font-semibold tracking-widest border-b-2 transition-colors duration-150 ${
              activeTab === idx
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-6 mt-10">
        {postPlaceholders.map((_, idx) => (
          <div key={idx} className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 hover:shadow-md transition">
            <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 21l-6-6-3 3-4-4" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;