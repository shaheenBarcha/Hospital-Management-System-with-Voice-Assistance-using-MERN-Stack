// Sidebar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.css';
import avatarImage from './images/doctor-icon.jpg';
import NewMessage from './NewMessage';


const Sidebar = () => {
  
  const [isModalOpen, setModalOpen] = useState(false);



  const handleWriteMessageClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [isProfileOpen, setProfileOpen] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data from your backend API
        const response = await axios.get('http://localhost:5000/fetchProfile');

        // Set the user profile with the fetched data
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.message || 'Error fetching user profile');
      }
    };

    // Fetch data only when the sidebar is open
    if (isSidebarOpen) {
      fetchData();
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setProfileOpen(isProfileOpen);
    setSidebarOpen(!isSidebarOpen);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleLogout = async () => {
    window.location.href = '/';
    try {
      // Send a request to the backend to indicate logout
      await axios.post('http://localhost:5000/logout', { loggedOut: true });

      // Navigate to the home page
      
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleSaveClick = async () => {
    try {
      await axios.put('http://localhost:5000/updateProfile', {
        username: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
      });

      setEditMode(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError(error.message || 'Error updating user profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          {/* Brand content */}
        </div>

        <div className="sidebar-content">
          <div onClick={toggleSidebar}>
            <span style={{ color: 'black', fontSize: '2em' }}>&#x2630;</span>
          </div>

          <div className="profile-section">
            {isProfileOpen && (
              <div className="profile-details">
                <div className="user-avatar">
                  <img src={avatarImage} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                </div>
                <div className="user-info">
                  {isEditMode ? (
                    <>
                      <label className='na' style={{color:'black'}}>
                        Name:
                        <input
                          type="text"
                          name="name"
                          value={userProfile.name}
                          onChange={handleInputChange}
                        />
                      </label>
                      <label style={{color:'black'}}>
                        Email:
                        <input
                          type="text"
                          name="email"
                          value={userProfile.email}
                          onChange={handleInputChange}
                        />
                      </label>
                      <label style={{color:'black'}}>
                        Role:
                        <input
                          type="text"
                          name="role"
                          value={userProfile.role}
                          onChange={handleInputChange}
                        />
                      </label >
                    </>
                  ) : (
                    <>
                      {userProfile.name ? (
                        <>
                          <p style={{color:'black'}}><strong>Name:</strong> {userProfile.name}</p>
                          <p style={{color:'black'}}><strong>Email:</strong> {userProfile.email}</p>
                          <p style={{color:'black'}}><strong>Role:</strong> {userProfile.role}</p>
                        </>
                      ) : (
                        <p style={{color:'black'}}>No profile data available.</p>
                      )}
                    </>
                  )}
                  
                </div>
 

                {!isEditMode && (
                  
                  <button className="editButton" onClick={handleEditClick} style={{color:'black'}}>
                    Edit Profile
                  </button>
                )}
                
                {isEditMode && (
                  <>
                    <button className="saveButton" onClick={handleSaveClick} style={{color:'black'}}>
                      Save
                    </button>
                    <button className="cancelButton" onClick={() => setEditMode(false)} style={{color:'black'}}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
            
          </div>
             {/* Write Message and Logout buttons outside sidebar-content */}
        <div className="bottom-buttons">
          <button onClick={handleWriteMessageClick} style={{ color: 'black' }}>
            Write Message
          </button>
          <button onClick={handleLogout} style={{ color: 'black' }}>
            Logout
          </button>
          {isModalOpen && <NewMessage onClose={handleCloseModal} />}
        </div>
          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Error: {error}
            </div>
          )}
        </div>
        
      </div>
      
    </>
  );
};

export default Sidebar;
