import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import NewMessage from './NewMessage';

const Navbar = () => {
  const [checkCondition, setCheckCondition] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const [newMsg, setNewMsg] = useState(false);

  const handleNewMsg = () => {
    console.log('handleNewMsg is called');
    setNewMsg(!newMsg);
  };

  useEffect(() => {
    // Check email status when the component mounts
    checkEmailApi();
  }, []);

  const checkEmailApi = async () => {
    try {
      const response = await fetch('http://localhost:5000/checkEmail');

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        setCheckCondition(true);
        console.log('condition two');
      } else if (response.status === 404) {
        console.log('condition one');
        setCheckCondition(false);
      } else {
        console.error('Error checking email:', response.status, response.statusText);
        setCheckCondition(false);
        console.log('condition Three');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setCheckCondition(false);
    }
  };

  useEffect(() => {
    // Update navItems after checkEmailApi is complete
    setNavItems([
      { label: 'Home', path: '/', active: false },
      { label: checkCondition ? '' : 'Register', path: checkCondition ? '' : '/register', active: false },
      { label: 'Voice Assistance', path: '/vasistant', active: false },
      checkCondition ? { label: 'New Message', path: '', active: false, onClick: handleNewMsg } : null,
      { label: 'View Doctors', path: '/dm', active: false },
      { label: checkCondition ? 'Online Pharmacy' : 'Login', path: checkCondition ? '/op' : '/login', active: false },
    ].filter(Boolean));
  }, [checkCondition]);

  const handleItemClick = (index) => {
    const updatedNavItems = navItems.map((item, i) => ({
      ...item,
      active: i === index,
    }));

    setNavItems(updatedNavItems);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content d-flex justify-content-between align-items-center">
          <div className="brandname">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <span className="brand-shape d-inline-block text-white">E</span>
              <span className="brand-text fw-7">Hospital</span>
            </Link>
          </div>

          <div className="navbar-box">
            <ul className="navbar-nav d-flex align-items-center">
              {navItems.map((item, index) => (
                item.label && (
                  <li className="nav-item" key={index}>
                    {item.path ? (
                      <Link
                        to={item.path}
                        className={`nav-link text-white ${item.active ? 'nav-active' : ''} text-nowrap`}
                        onClick={() => handleItemClick(index)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        className={`nav-link text-white ${item.active ? 'nav-active' : ''} text-nowrap`}
                        onClick={item.onClick}
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                )
              ))}
            </ul>
          </div>
        </div>
      </div>
      {newMsg && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={handleNewMsg}>
              &#10006;
            </span>
            <NewMessage />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
