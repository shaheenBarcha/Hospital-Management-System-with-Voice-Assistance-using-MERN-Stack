import React, { useState, useEffect } from 'react';
import './myProfile.css';
import profileIcon from './images/profile-icon.png';
import axios from 'axios';

const MyProfile = ({ isLoggedIn }) => { 
  isLoggedIn = true
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    password: '',
    cellNumber: '',
    role: '',
    // Add more attributes here
    // Example: firstName: '', lastName: '', age: '', etc.
  });

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fetchProfileP');
      
      if (response.status === 200) {
        setProfileData(response.data);
      } else {
        console.error('Error fetching user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    try {
      const response = await axios.put('http://localhost:5000/updateProfileP', {
        username: profileData.username,
        email: profileData.email,
        password: profileData.password,
        cellNumber: profileData.cellNumber,
        role: profileData.role,
        // Add more attributes here
        // Example: firstName: profileData.firstName, lastName: profileData.lastName, age: profileData.age, etc.
      });

      if (response.status === 200) {
        // Update successful, fetch the updated profile
        fetchProfile();
        setIsEditing(false);
      } else {
        const data = await response.data;
        console.error('Error updating user profile:', data.message);
      }
    } catch (error) {
      console.error('Error updating user profile:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  return (
    <div div className='abc'
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      zIndex: '999',
      width: '300px',
      textAlign: 'center'
    }}>
      <div className="profile-picture-container">
        <img className="profile-picture" src={profileIcon} alt="Profile" />
      </div>

      {isEditing ? (
        <>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Cell Number:
            <input
              type="text"
              name="cellNumber"
              value={profileData.cellNumber}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Role:
            <input
              type="text"
              name="role"
              value={profileData.role}
              onChange={handleInputChange}
            />
          </label>
          {/* Add more input fields for additional attributes */}
        </>
      ) : (
        <>
          <h2>{profileData.username}</h2>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Password:</strong> ********</p>
          <p><strong>Cell Number:</strong> {profileData.cellNumber}</p>
          <p><strong>Role:</strong> {profileData.role}</p>
          {/* Display additional attributes here */}
        </>
      )}

      {isLoggedIn && (
        <div className="profile-buttons">
          {!isEditing ? (
            <button style={{color:'black'}} onClick={handleEditClick}>Edit</button>
          ) : (
            <>
              <button style={{color:'black'}} onClick={handleUpdateClick}>Update Profile</button>
              <button style={{color:'black'}} onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
