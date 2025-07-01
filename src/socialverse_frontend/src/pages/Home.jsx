import React, { useState } from 'react';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeTab, setActiveTab] = useState('foryou');

  const defaultImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';
  const posts = [
    {
      id: 1,
      author: {
        name: 'Liam Carter',
        username: '@liam.c',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      time: '1d ago',
      content: "Just finished reading 'The Silent Patient' by Alex Michaelides. What a twist! Highly recommend for mystery lovers.",
      likes: 23,
      comments: 5,
      shares: 2,
      image: defaultImage
    },
    {
      id: 2,
      author: {
        name: 'Olivia Bennett',
        username: '@olivia.b',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
      },
      time: '2d ago',
      content: "Exploring the city's hidden gems today. Found this cozy cafe with the best coffee! ☕",
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
      likes: 45,
      comments: 12,
      shares: 8
    }
  ];

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 fixed h-full" style={{ width: '15rem' }}>
        <div className="p-4">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
              alt="Sophia"
              className="w-10 h-10 rounded-full mb-2"
            />
            <div className="leading-tight text-center">
              <h3 className="font-semibold text-gray-900 text-sm">Sophia</h3>
              <p className="text-gray-500 text-xs">@sophia.miller</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link to="/home" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
              </svg>
              <span className="font-medium">Home</span>
            </Link>

            <Link to="/explore" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              <span>Explore</span>
            </Link>

            <Link to="/notifications" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
              </svg>
              <span>Notifications</span>
            </Link>

            <Link to="/messages" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
              </svg>
              <span>Messages</span>
            </Link>

            <Link to="/profile" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span>Profile</span>
            </Link>
          </nav>

          {/* Post Button */}
          <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
            Post
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-56 mr-96 flex justify-center">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-md">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-2">
              <button
                className={`flex-1 py-2 px-4 text-center text-sm font-semibold transition-colors duration-150 ${activeTab === 'foryou' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('foryou')}
              >
                For you
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center text-sm font-semibold transition-colors duration-150 ${activeTab === 'following' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('following')}
              >
                Following
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="bg-white">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 fixed right-0 h-full overflow-y-auto" style={{ width: '24rem' }}>
        <div className="p-4">
          {/* Trends */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Trends for you</h2>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">Trending in YourCountry</p>
              {trends.map((trend, index) => (
                <div key={index} className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                  <h3 className="font-bold text-gray-900">{trend.tag}</h3>
                  <p className="text-sm text-gray-500">{trend.posts}</p>
                </div>
              ))}
              <button className="text-blue-600 text-sm hover:underline">Show more</button>
            </div>
          </div>

          {/* Who to follow */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Who to follow</h2>

            <div className="space-y-4">
              {suggestions.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3" >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.username}</p>
                    </div>
                  </div>
                  <button className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800">
                    Follow
                  </button>
                </div>
              ))}
              <button className="text-blue-600 text-sm hover:underline">Show more</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;