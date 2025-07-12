import React, { useState, useEffect } from 'react';
import { createActor, canisterId } from '../../../declarations/socialverse_backend';
import { useUser } from '../UserContext';

const defaultImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';
const mockImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
];

const trendingTopics = [
  { tag: '#ICP_Community', posts: '105K posts' },
  { tag: '#Web3Innovations', posts: '52K posts' },
  { tag: '#DecentralizedFuture', posts: '23K posts' },
  { tag: '#BlockchainTech', posts: '11K posts' },
];

const peopleToFollow = [
  { name: 'Sophia Carter', desc: 'ICP Enthusiast', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Ethan Bennett', desc: 'Web3 Developer', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Olivia Hayes', desc: 'Crypto Analyst', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

const tabs = ['For you', 'Reels', 'Topics', 'Places', 'Audio'];

function Explore() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [followLoading, setFollowLoading] = useState({});
  const { user } = useUser();
  const backend = createActor(canisterId);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoadingProfiles(true);
      try {
        let result = [];
        if (search.trim() === '') {
          result = await backend.get_all_profiles();
        } else {
          result = await backend.search_profiles(search);
        }
        setProfiles(result);
      } catch (e) {
        setProfiles([]);
      }
      setLoadingProfiles(false);
    };
    fetchProfiles();
  }, [search]);

  // No need to filter client-side, profiles are already filtered from backend
  const filteredProfiles = profiles;

  // Check if current user is following a profile
  const isFollowing = (profilePrincipal) => {
    if (!user || !user.following) return false;
    if (Array.isArray(user.following)) {
      return user.following.some((p) => p === profilePrincipal || (p.toString && p.toString() === profilePrincipal));
    }
    return false;
  };

  // Follow/unfollow logic
  const handleFollow = async (profilePrincipal, currentlyFollowing) => {
    if (!user || !user.principal) return;
    setFollowLoading((prev) => ({ ...prev, [profilePrincipal]: true }));
    try {
      if (currentlyFollowing) {
        await backend.unfollow_user(user.principal, profilePrincipal);
      } else {
        await backend.follow_user(user.principal, profilePrincipal);
      }
      // Optionally, refetch profiles or update local state
    } catch (e) {}
    setFollowLoading((prev) => ({ ...prev, [profilePrincipal]: false }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-base font-bold mb-4 md:mb-0">Explore</h1>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search users by name or username..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm placeholder:text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex space-x-8 border-b mb-6">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                className={`py-3 px-2 text-sm font-semibold border-b-2 transition-colors duration-150 ${
                  activeTab === idx
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* User Search Results */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-base font-bold mb-4">User Search</h2>
            {loadingProfiles ? (
              <div className="text-gray-400 text-center py-8">Loading users...</div>
            ) : (
              <div className="space-y-4">
                {filteredProfiles.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">No users found.</div>
                ) : (
                  filteredProfiles.map((profile) => (
                    <div key={profile.user_principal.toString()} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={Array.isArray(profile.avatar) ? profile.avatar[0] : profile.avatar || defaultImage} alt={profile.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{profile.name}</h4>
                          <p className="text-gray-500 text-xs">@{profile.username}</p>
                        </div>
                      </div>
                      {user && user.principal !== profile.user_principal.toString() && (
                        <button
                          className={`bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-full text-xs font-medium hover:from-blue-600 hover:to-purple-600 transition-colors ${followLoading[profile.user_principal.toString()] ? 'opacity-60 cursor-not-allowed' : ''}`}
                          disabled={followLoading[profile.user_principal.toString()]}
                          onClick={() => handleFollow(profile.user_principal, isFollowing(profile.user_principal.toString()))}
                        >
                          {isFollowing(profile.user_principal.toString()) ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {/* Image Grid (keep for now) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {mockImages.map((img, idx) => (
              <div key={idx} className="aspect-square bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition flex items-center justify-center">
                <img src={img || defaultImage} alt="Post" className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Right Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-base font-bold mb-4">Trending Topics</h2>
            <div className="space-y-3">
              {trendingTopics.map((trend, idx) => (
                <div key={idx} className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                  <h3 className="font-semibold text-gray-900">{trend.tag}</h3>
                  <p className="text-xs text-gray-500">{trend.posts}</p>
                </div>
              ))}
              <button className="text-blue-600 text-sm hover:underline mt-2">Show more</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Explore;
