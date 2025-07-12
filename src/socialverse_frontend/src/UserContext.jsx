import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const defaultUser = {
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  username: 'sophia.art',
  name: 'Sophia Bennett',
  bio: 'Digital Artist | Nature Lover | Dreamer',
  about: '🌻 Exploring the intersection of technology and creativity. Passionate about ICP and decentralized futures.',
  link: 'https://connecticp.com/sophia',
  posts: 123,
  followers: '456K',
  following: 789,
  principal: null,
};

function getStoredUser() {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : defaultUser;
  } catch {
    return defaultUser;
  }
}
function getStoredSavedPosts() {
  try {
    const stored = localStorage.getItem('savedPosts');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
function getStoredLoggedIn() {
  try {
    return localStorage.getItem('loggedIn') === 'true';
  } catch {
    return false;
  }
}

// Utility to always get avatar as a string
export function getAvatarString(avatar) {
  if (!avatar) return '';
  if (Array.isArray(avatar)) return avatar[0] || '';
  return avatar;
}

export function UserProvider({ children }) {
  const [user, _setUser] = useState(getStoredUser());
  const [loggedIn, setLoggedIn] = useState(getStoredLoggedIn());
  const [savedPosts, setSavedPosts] = useState(getStoredSavedPosts());

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn ? 'true' : 'false');
  }, [loggedIn]);
  useEffect(() => {
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  const login = (userData) => {
    _setUser({ ...defaultUser, ...userData, avatar: getAvatarString(userData?.avatar), principal: userData?.principal || null });
    setLoggedIn(true);
  };
  const setUser = (userData) => {
    _setUser({ ...userData, avatar: getAvatarString(userData?.avatar) });
    setLoggedIn(true);
  };
  const savePost = (postId) => {
    const idStr = postId.toString();
    setSavedPosts((prev) => prev.includes(idStr) ? prev : [...prev, idStr]);
  };
  const unsavePost = (postId) => {
    const idStr = postId.toString();
    setSavedPosts((prev) => prev.filter(id => id !== idStr));
  };
  const logout = () => {
    setLoggedIn(false);
    _setUser(defaultUser);
    setSavedPosts([]);
    localStorage.removeItem('user');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('savedPosts');
  };
  return (
    <UserContext.Provider value={{ user, setUser, loggedIn, login, logout, savedPosts, savePost, unsavePost }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 