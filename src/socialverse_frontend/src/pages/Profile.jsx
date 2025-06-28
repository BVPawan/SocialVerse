import React from 'react';

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="/api/placeholder/100/100" alt="Profile" />
        </div>
        <div className="profile-info">
          <h2>User Name</h2>
          <p>@username</p>
          <p>Bio: This is a sample bio</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <strong>0</strong>
          <span>Posts</span>
        </div>
        <div className="stat">
          <strong>0</strong>
          <span>Followers</span>
        </div>
        <div className="stat">
          <strong>0</strong>
          <span>Following</span>
        </div>
      </div>

      <div className="profile-posts">
        <h3>Posts</h3>
        <p>No posts yet</p>
      </div>
    </div>
  );
};

export default Profile;