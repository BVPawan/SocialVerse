import React, { useState } from 'react';

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
                placeholder="Search posts, topics..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm placeholder:text-sm"
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
          {/* Image Grid */}
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
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-base font-bold mb-4">People to Follow</h2>
            <div className="space-y-4">
              {peopleToFollow.map((person, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{person.name}</h4>
                      <p className="text-xs text-gray-500">{person.desc}</p>
                    </div>
                  </div>
                  <button className="bg-gray-100 hover:bg-blue-100 text-blue-600 font-semibold px-4 py-1 rounded-lg text-xs">Follow</button>
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
