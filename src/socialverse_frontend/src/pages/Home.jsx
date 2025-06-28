import React, { useState } from 'react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('foryou');

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
      shares: 2
    },
    {
      id: 2,
      author: {
        name: 'Olivia Bennett',
        username: '@olivia.b',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face'
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
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
      isFollowing: false
    },
    {
      name: 'NFT Art Weekly',
      username: '@nftartweekly',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      isFollowing: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full" style={{ width: "23rem" }}>
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-3 mb-8" style={{ width: "0rem" }}>
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
              alt="Sophia"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">Sophia</h3>
              <p className="text-gray-500 text-sm">@sophia.miller</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
              </svg>
              <span className="font-medium">Home</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              <span>Explore</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
              </svg>
              <span>Notifications</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
              </svg>
              <span>Messages</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span>Profile</span>
            </a>
          </nav>

          {/* Post Button */}
          <button className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Post
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64" style={{ marginLeft: "-4rem" }}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-6 text-center ${activeTab === 'foryou'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
                onClick={() => setActiveTab('foryou')}
              >
                For you
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center ${activeTab === 'following'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
                onClick={() => setActiveTab('following')}
              >
                Following
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="bg-white">
            {posts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 p-6 hover:bg-gray-50">
                <div className="flex space-x-3">
                  {/* Avatar */}
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                      <span className="text-gray-500">{post.author.username}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500">{post.time}</span>
                      <div className="ml-auto">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-900 mb-3">{post.content}</p>

                    {/* Image */}
                    {post.image && (
                      <div className="mb-3">
                        <img
                          src={post.image}
                          alt="Post image"
                          className="w-full rounded-xl max-h-96 object-cover"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between max-w-md">
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-red-600 group">
                        <div className="p-2 rounded-full group-hover:bg-red-50">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <span className="text-sm">{post.likes}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 group">
                        <div className="p-2 rounded-full group-hover:bg-blue-50">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className="text-sm">{post.comments}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 group">
                        <div className="p-2 rounded-full group-hover:bg-green-50">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </div>
                        <span className="text-sm">{post.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 fixed right-0 h-full overflow-y-auto" style={{ width: "26rem" }}>
        <div className="p-6">
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