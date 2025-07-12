import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import { createActor, canisterId } from '../../../declarations/socialverse_backend';
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from '@dfinity/principal';
import { getAvatarString } from '../UserContext';

const badges = [
  { label: 'Early Adopter', color: 'bg-purple-700' },
  { label: 'DAO Contributor', color: 'bg-blue-700' },
  { label: 'Smart Contract Auditor', color: 'bg-green-700' },
  { label: 'DeFi Pioneer', color: 'bg-yellow-600' },
];

const stats = [
  { label: 'Following', value: '2.1K', icon: '👥', growth: '+12%' },
  { label: 'Followers', value: '5.8K', icon: '💙', growth: '+24%' },
  { label: 'Posts', value: '342', icon: '💬', growth: '+8%' },
  { label: 'Reputation', value: '8.9', icon: '⭐', growth: '+0.3' },
];

const tabs = [
  { label: 'Posts', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
  ) },
  { label: 'Saved', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" /></svg>
  ) },
];

const Profile = () => {
  const { user, login, savedPosts } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [userPosts, setUserPosts] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState('followers'); // 'followers' or 'following'
  const [modalProfiles, setModalProfiles] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const avatarInputRef = useRef();
  const [allPosts, setAllPosts] = useState([]);

  // The profile being viewed (could be self or another user)
  const profilePrincipal = form.principal || form.user_principal || user.principal;
  const currentPrincipal = user.principal;

  useEffect(() => {
    const fetchUserPosts = async () => {
      const backend = createActor(canisterId);
      try {
        const allPosts = await backend.get_posts();
        setAllPosts(allPosts);
        const filtered = allPosts.filter(
          (post) => post.author === form.username || post.author === form.name
        );
        setUserPosts(filtered);
      } catch (e) {
        setUserPosts([]);
        setAllPosts([]);
      }
    };
    fetchUserPosts();
  }, [form]);

  // Fetch followers/following and follow state
  useEffect(() => {
    const fetchFollowData = async () => {
      const backend = createActor(canisterId);
      try {
        const [foll, wing] = await Promise.all([
          backend.get_followers(profilePrincipal),
          backend.get_following(profilePrincipal),
        ]);
        setFollowers(foll);
        setFollowing(wing);
        setIsFollowing(foll.some((p) => p.toString && p.toString() === currentPrincipal?.toString()));
      } catch (e) {
        setFollowers([]);
        setFollowing([]);
        setIsFollowing(false);
      }
    };
    if (profilePrincipal && currentPrincipal) fetchFollowData();
  }, [profilePrincipal, currentPrincipal, editing]);

  useEffect(() => {
    if (!showFollowModal) return;
    const fetchProfilesForModal = async () => {
      setLoadingModal(true);
      try {
        const backend = createActor(canisterId);
        const allProfiles = await backend.get_all_profiles();
        const principalList = followModalType === 'followers' ? followers : following;
        // Convert all principals to string for comparison
        const principalStrings = principalList.map(p => p.toString());
        const filtered = allProfiles.filter(profile => principalStrings.includes(profile.user_principal.toString()));
        setModalProfiles(filtered);
      } catch (e) {
        setModalProfiles([]);
      }
      setLoadingModal(false);
    };
    fetchProfilesForModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFollowModal, followModalType, followers, following]);

  // Edit form handlers (same as before)
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
    console.log('handleSubmit called');
    e.preventDefault();
    const backend = createActor(canisterId);
    let principal = user.principal;
    try {
      const authClient = await AuthClient.create();
      principal = authClient.getIdentity().getPrincipal();
    } catch (e) {}
    const avatarValueRaw = avatarPreview || form.avatar;
    const avatarValue = Array.isArray(avatarValueRaw) ? avatarValueRaw[0] : avatarValueRaw;
    console.log("avatarPreview:", avatarPreview, "form.avatar:", form.avatar, "avatarValue:", avatarValue, "profileToSave.avatar:", avatarValue ? [avatarValue] : []);
    const profileToSave = {
      ...form,
      avatar: avatarValue ? [avatarValue] : [],
      user_principal: principal,
    };
    try {
      await backend.add_or_update_profile(profileToSave);
      console.log('Profile sent to backend:', profileToSave);
      // Fetch the latest profile from backend
      const fresh = await backend.get_profile(principal.toString());
      console.log('Fresh profile from backend:', fresh);
      if (fresh && fresh[0]) {
        login({ ...fresh[0], principal, avatar: getAvatarString(fresh[0].avatar) });
        setForm({ ...fresh[0], avatar: getAvatarString(fresh[0].avatar), principal });
        setAvatarPreview(getAvatarString(fresh[0].avatar));
      } else {
        login({ ...profileToSave, avatar: getAvatarString(profileToSave.avatar) });
        setForm({ ...profileToSave, avatar: getAvatarString(profileToSave.avatar) });
        setAvatarPreview(getAvatarString(profileToSave.avatar));
      }
      setEditing(false);
    } catch (err) {
      console.error('Profile save error:', err);
      alert('Failed to save profile');
    }
  };

  // Dark mode wrapper
  return (
    <div className="min-h-screen bg-[#fafbfc] flex justify-center">
      <div className="w-full max-w-5xl mx-auto pt-10 px-8 md:px-0">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 flex flex-col items-center mb-8">
          {/* Avatar with purple ring */}
          <div className="relative mb-4">
            <span className="block w-36 h-36 rounded-full bg-gradient-to-tr from-purple-500 via-blue-400 to-pink-400 p-1">
              <img
                src={avatarPreview || user.avatar}
                alt={user.username}
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-1">{user.name || user.username}</h2>
          <div className="text-lg text-gray-500 mb-4">@{user.username}</div>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {badges.map((b, idx) => (
              <span key={idx} className={`px-4 py-1 rounded-full text-xs font-semibold text-white ${b.color}`}>{b.label}</span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-4 text-gray-500 text-base">
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10 0V6a4 4 0 00-8 0v2m8 0H7" /></svg>0x1234...5678</span>
            {user.link && <a href={user.link} className="text-purple-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer"><svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>{user.link}</a>}
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" /></svg>San Francisco, CA</span>
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Joined March 2022</span>
          </div>
          <div className="text-center text-gray-700 max-w-2xl mb-8 text-base font-medium">
            {user.bio || 'Building the future of decentralized web. Passionate about blockchain technology, smart contracts, and creating user-friendly dApps. Contributing to open source projects and sharing knowledge with the community.'}
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-8">
            <div
              className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center relative border border-gray-100 cursor-pointer hover:bg-purple-50 transition"
              onClick={async () => {
                setFollowModalType('following');
                setShowFollowModal(true);
              }}
            >
              <span className="text-2xl font-bold mb-1 text-gray-900">{following.length}</span>
              <span className="text-gray-500 text-sm flex items-center gap-1">Following</span>
            </div>
            <div
              className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center relative border border-gray-100 cursor-pointer hover:bg-purple-50 transition"
              onClick={async () => {
                setFollowModalType('followers');
                setShowFollowModal(true);
              }}
            >
              <span className="text-2xl font-bold mb-1 text-gray-900">{followers.length}</span>
              <span className="text-gray-500 text-sm flex items-center gap-1">Followers</span>
            </div>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center relative border border-gray-100">
              <span className="text-2xl font-bold mb-1 text-gray-900">{userPosts.length}</span>
              <span className="text-gray-500 text-sm flex items-center gap-1">Posts</span>
            </div>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center relative border border-gray-100">
              <span className="text-2xl font-bold mb-1 text-gray-900">8.9</span>
              <span className="text-gray-500 text-sm flex items-center gap-1">Reputation</span>
              <span className="text-xs text-green-500 font-medium mt-1">+0.3</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="bg-[#fafbfc] rounded-2xl border border-gray-100 shadow p-6 mb-8">
            <div className="flex flex-nowrap justify-center items-center gap-x-4">
              <button
                className={`bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white font-bold text-base px-6 py-2 rounded-xl shadow transition-colors duration-150 w-48 flex items-center justify-center ${loadingFollow ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loadingFollow || !currentPrincipal || currentPrincipal.toString() === profilePrincipal?.toString()}
                onClick={async () => {
                  if (!currentPrincipal || !profilePrincipal || currentPrincipal.toString() === profilePrincipal.toString()) return;
                  setLoadingFollow(true);
                  const backend = createActor(canisterId);
                  try {
                    if (isFollowing) {
                      await backend.unfollow_user(currentPrincipal, profilePrincipal);
                    } else {
                      await backend.follow_user(currentPrincipal, profilePrincipal);
                    }
                    // Refetch follow state
                    const foll = await backend.get_followers(profilePrincipal);
                    setFollowers(foll);
                    setIsFollowing(foll.some((p) => p.toString && p.toString() === currentPrincipal.toString()));
                  } catch (e) {}
                  setLoadingFollow(false);
                }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
              <button className="bg-white border border-gray-200 text-gray-900 font-bold text-base px-6 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition flex items-center justify-center w-48">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M8 7V5a4 4 0 018 0v2" /></svg>
                Message
              </button>
              <button className="bg-black text-white font-bold text-base px-6 py-2 rounded-xl shadow-sm hover:bg-gray-900 transition flex items-center justify-center w-48">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
                Connect Wallet
              </button>
              <button className="bg-white border border-gray-200 text-gray-900 font-bold text-base px-6 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition flex items-center justify-center w-48" onClick={() => setEditing(true)}>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17.25V21h3.75l11.06-11.06a2.121 2.121 0 00-3-3L3 17.25z" /></svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        {/* Edit Profile Modal/Card */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <form className="w-full max-w-lg bg-[#23263a] rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6 relative" onSubmit={handleSubmit}>
              <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setEditing(false)}>&times;</button>
              {/* Avatar with colored ring and change/remove */}
              <div className="relative mb-2">
                <span className="block w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600 via-blue-500 to-pink-500 p-1">
                  <img
                    src={avatarPreview || user.avatar}
                    alt={user.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#23263a] shadow-lg"
                  />
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow cursor-pointer hover:bg-blue-600 transition-colors">Change</label>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow hover:bg-red-600 transition-colors"
                  >Remove</button>
                )}
              </div>
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Username</label>
                  <input name="username" value={form.username} onChange={handleFormChange} placeholder="Username" className="w-full bg-[#181c24] border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-150" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" className="w-full bg-[#181c24] border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-150" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Bio</label>
                  <input name="bio" value={form.bio} onChange={handleFormChange} placeholder="Bio" className="w-full bg-[#181c24] border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-150" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">About</label>
                  <input name="about" value={form.about} onChange={handleFormChange} placeholder="About" className="w-full bg-[#181c24] border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-150" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Link</label>
                  <input name="link" value={form.link} onChange={handleFormChange} placeholder="Link" className="w-full bg-[#181c24] border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-150" />
                </div>
              </div>
              <div className="flex space-x-4 mt-2 w-full justify-center">
                <button type="submit" onClick={() => console.log('Save button clicked')} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-2 rounded-full font-semibold shadow hover:from-blue-500 hover:to-purple-500 transition text-base">Save</button>
                <button type="button" className="bg-[#181c24] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#23263a] transition text-base" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        {/* Tabs Bar */}
        <div className="flex justify-center space-x-4 bg-[#181c24] rounded-xl p-2 mb-6">
          {tabs.map((tab, idx) => (
            <button
              key={tab.label}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 ${activeTab === idx ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#23263a]'}`}
              onClick={() => setActiveTab(idx)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        {/* Posts Feed (light cards) */}
        <div className="bg-white rounded-2xl shadow p-8 mt-10">
          {activeTab === 0 ? (
            userPosts.length === 0 ? (
              <div className="text-center text-gray-500">No posts yet.</div>
            ) : (
              userPosts.map((post, idx) => (
                <div key={post.id || idx} className="bg-white rounded-xl shadow p-6 text-gray-900 mb-8">
                  <div className="flex items-center mb-3">
                    <img src={avatarPreview || user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 mr-3" />
                    <div>
                      <span className="font-bold text-gray-900">{user.name || user.username}</span>
                      <span className="text-gray-400 text-xs ml-2">@{user.username}</span>
                    </div>
                    <span className="ml-auto text-xs text-gray-500">2h ago</span>
                  </div>
                  <div className="text-base mb-2">{post.content}</div>
                  {Array.isArray(post.image) && post.image.length > 0 && post.image[0] && (
                    <img src={post.image[0]} alt="Post" className="rounded-lg mt-2 max-h-72 object-cover w-full" />
                  )}
                </div>
              ))
            )
          ) : (
            (() => {
              const saved = allPosts.filter(post => savedPosts.includes(post.id.toString()));
              if (saved.length === 0) {
                return <div className="text-center text-gray-500">No saved posts yet.</div>;
              }
              return saved.map((post, idx) => (
                <div key={post.id || idx} className="bg-white rounded-xl shadow p-6 text-gray-900 mb-8">
                  <div className="flex items-center mb-3">
                    <img src={avatarPreview || user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 mr-3" />
                    <div>
                      <span className="font-bold text-gray-900">{user.name || user.username}</span>
                      <span className="text-gray-400 text-xs ml-2">@{user.username}</span>
                    </div>
                    <span className="ml-auto text-xs text-gray-500">2h ago</span>
                  </div>
                  <div className="text-base mb-2">{post.content}</div>
                  {Array.isArray(post.image) && post.image.length > 0 && post.image[0] && (
                    <img src={post.image[0]} alt="Post" className="rounded-lg mt-2 max-h-72 object-cover w-full" />
                  )}
                </div>
              ));
            })()
          )}
        </div>
      </div>
      {/* Followers/Following Modal */}
      {showFollowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowFollowModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadein"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowFollowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
              {followModalType === 'followers' ? 'Followers' : 'Following'}
            </h2>
            {loadingModal ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : modalProfiles.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No users found.</div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {modalProfiles.map((profile, idx) => (
                  <li key={profile.user_principal.toString()} className="flex items-center gap-4 py-4">
                    <img
                      src={Array.isArray(profile.avatar) ? profile.avatar[0] : profile.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                      alt={profile.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-base">{profile.name || profile.username}</div>
                      <div className="text-gray-500 text-sm font-mono">@{profile.username}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;