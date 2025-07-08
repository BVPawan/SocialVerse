import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { createActor, canisterId } from '../../../declarations/socialverse_backend';
import PostCard from '../components/PostCard';
import { AuthClient } from "@dfinity/auth-client";

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
  const [userPosts, setUserPosts] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const avatarInputRef = React.useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save profile to backend
    const backend = createActor(canisterId);
    let principal = "";
    try {
      const authClient = await AuthClient.create();
      principal = authClient.getIdentity().getPrincipal();
    } catch (e) {
      // fallback or error
    }
    const profileToSave = {
      ...form,
      avatar: avatarPreview ? [avatarPreview] : [],
      user_principal: principal,
    };
    try {
      await backend.add_or_update_profile(profileToSave);
      setUser(profileToSave);
      setEditing(false);
    } catch (err) {
      alert('Failed to save profile');
      console.error("Profile save error:", err);
      if (err && err.message) {
        alert("Error details: " + err.message);
      }
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      const backend = createActor(canisterId);
      try {
        const allPosts = await backend.get_posts();
        // Filter posts by current user's username (or principal if available)
        const filtered = allPosts.filter(
          (post) => post.author === user.username || post.author === user.name
        );
        setUserPosts(filtered);
      } catch (e) {
        setUserPosts([]);
      }
    };
    fetchUserPosts();
  }, [user]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const backend = createActor(canisterId);
      try {
        // Fetch profile by username (replace with principal if available)
        const profile = await backend.get_profile(user.username);
        if (profile) {
          setForm(profile);
          setAvatarPreview(profile.avatar || '');
        }
      } catch (e) {
        // No profile found, keep defaults
      }
    };
    fetchUserProfile();
  }, [user.username]);

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
            <div className="mt-4 w-full max-w-xl mx-auto bg-white rounded-xl shadow p-6 flex flex-col items-center">
              {/* Avatar Upload */}
              <div className="relative mb-4">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <circle cx="12" cy="8" r="1" />
                    </svg>
                  </div>
                )}
                <button
                  className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-full text-xs shadow hover:bg-blue-700"
                  onClick={() => avatarInputRef.current.click()}
                  type="button"
                >
                  {avatarPreview ? 'Change' : 'Upload'}
                </button>
                {avatarPreview && (
                  <button
                    className="absolute top-0 left-0 bg-white bg-opacity-80 text-gray-700 px-2 py-1 rounded-full text-xs shadow hover:bg-red-100"
                    onClick={handleRemoveAvatar}
                    type="button"
                  >
                    Remove
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
              <form className="w-full space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input name="username" value={form.username} onChange={handleFormChange} placeholder="Username" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <input name="bio" value={form.bio} onChange={handleFormChange} placeholder="Bio" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <input name="about" value={form.about} onChange={handleFormChange} placeholder="About" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input name="link" value={form.link} onChange={handleFormChange} placeholder="Link" className="w-full border p-2 rounded" />
                </div>
                <div className="flex space-x-2">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posts</label>
                    <input name="posts" value={form.posts} onChange={handleFormChange} placeholder="Posts" className="w-full border p-2 rounded" />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Followers</label>
                    <input name="followers" value={form.followers} onChange={handleFormChange} placeholder="Followers" className="w-full border p-2 rounded" />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Following</label>
                    <input name="following" value={form.following} onChange={handleFormChange} placeholder="Following" className="w-full border p-2 rounded" />
                  </div>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm w-full mt-2">Save</button>
              </form>
            </div>
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
        {userPosts.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">No posts yet.</div>
        ) : (
          userPosts.map((post, idx) => (
            <PostCard key={post.id || idx} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;