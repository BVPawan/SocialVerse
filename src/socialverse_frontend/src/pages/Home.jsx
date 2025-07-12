import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { createActor, canisterId } from '../../../declarations/socialverse_backend';
import { useUser, getAvatarString } from '../UserContext';

const backend = createActor(canisterId);

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('foryou');
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const defaultImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendPosts = await backend.get_posts();
        const backendProfiles = await backend.get_all_profiles();
        setPosts(backendPosts);
        setProfiles(backendProfiles);
      } catch (error) {
        console.error('Failed to fetch posts or profiles from backend:', error);
      }
    };
    fetchData();
  }, []);

  const trends = [
    { tag: '#ICPLaunch', posts: '15.5K Posts' },
    { tag: 'Web3Future', posts: '8,234 Posts' },
    { tag: 'IndieGameDev', posts: '21K Posts' }
  ];

  const suggestions = [
    {
      name: 'CryptoDevDAO',
      username: '@cryptodevdao',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isFollowing: false
    },
    {
      name: 'NFT Art Weekly',
      username: '@nftartweekly',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isFollowing: false
    },
    {
      name: 'Sophia Carter',
      username: '@sophia.carter',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      isFollowing: false
    },
    {
      name: 'Ethan Bennett',
      username: '@ethan.bennett',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      isFollowing: false
    },
    {
      name: 'Olivia Hayes',
      username: '@olivia.hayes',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      isFollowing: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] flex justify-center">
      {/* Left Sidebar */}
      <div className="hidden lg:flex flex-col w-80 px-8 pt-12 space-y-10">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 flex flex-col items-center mb-4">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-purple-100" />
          <h3 className="font-bold text-lg text-gray-900 mb-1">{user.name}</h3>
          <p className="text-gray-500 text-sm mb-5">{user.username}</p>
          <button
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2.5 rounded-full shadow transition-colors duration-150"
            onClick={() => navigate('/create')}
          >
            Post
          </button>
        </div>
        {/* Removed Trends Card and Who to follow Card from left sidebar */}
      </div>

      {/* Center Feed */}
      <main className="flex-1 max-w-2xl px-4 pt-12 mx-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-10">
          <button
            className={`flex-1 py-4 text-center text-lg font-semibold transition-colors duration-150 ${activeTab === 'foryou' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-gray-400 hover:text-purple-600'}`}
            onClick={() => setActiveTab('foryou')}
          >
            For you
          </button>
        </div>
        {/* Posts Feed */}
        <div className="space-y-10">
          {posts.map((post) => {
            // Match by principal, not username
            const authorProfile = profiles.find(
              (profile) =>
                profile.user_principal &&
                post.author_principal &&
                profile.user_principal.toString() === post.author_principal.toString()
            );
            // If this is the current user's post, always use user.avatar from context
            let avatar = '';
            if (
              post.author_principal &&
              user.principal &&
              post.author_principal.toString() === user.principal.toString()
            ) {
              avatar = getAvatarString(user.avatar);
            } else if (authorProfile && authorProfile.avatar) {
              avatar = Array.isArray(authorProfile.avatar) ? authorProfile.avatar[0] : authorProfile.avatar;
            }
            const postWithProfile = {
              ...post,
              author: {
                ...(authorProfile || { name: post.author, username: post.author, avatar: '', bio: '', about: '', link: '' }),
                avatar,
              },
            };
            return <PostCard key={post.id} post={postWithProfile} onLike={async () => {
              try {
                const backendPosts = await backend.get_posts();
                setPosts(backendPosts);
              } catch (e) {
                console.error('Failed to refresh posts after like:', e);
              }
            }} />;
          })}
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="hidden xl:flex flex-col w-80 px-8 pt-12 space-y-10">
        {/* Trends Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-7 mb-4">
          <h4 className="text-gray-900 font-bold mb-5">Trends for you</h4>
          <p className="text-xs text-gray-400 mb-3">Trending in YourCountry</p>
          <ul className="space-y-3">
            {trends.map((trend, idx) => (
              <li key={idx}>
                <span className="text-purple-600 font-semibold cursor-pointer hover:underline">{trend.tag}</span>
                <span className="block text-xs text-gray-400 ml-1">{trend.posts}</span>
              </li>
            ))}
          </ul>
          <button className="text-purple-600 text-sm mt-4 hover:underline">Show more</button>
        </div>
        {/* Who to follow Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-7">
          <h4 className="text-gray-900 font-bold mb-5">Who to follow</h4>
          <ul className="space-y-5">
            {suggestions.slice(0,3).map((s, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{s.name}</h3>
                    <p className="text-gray-500 text-xs">{s.username}</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-full text-xs font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">Follow</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;