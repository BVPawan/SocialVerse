import React, { createContext, useContext, useState } from 'react';

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

export function UserProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [loggedIn, setLoggedIn] = useState(false);
  const login = (userData) => {
    setUser({ ...defaultUser, ...userData, principal: userData?.principal || null });
    setLoggedIn(true);
  };
  const logout = () => {
    setLoggedIn(false);
  };
  return (
    <UserContext.Provider value={{ user, setUser, loggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 