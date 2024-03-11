import React, { useState } from 'react';
import './pharmacy.css';
import medicineIcon from './images/medicine-icon.png';
import profileIcon from './images/profile-icon.png';
import messagingIcon from './images/messaging-icon.jpg';
import prescriptionIcon from './images/Prescription-icon.jpg';
import curveShape1 from './images/service-icon-5.png';
import Messages from './Messages';
import MedManagement from './MedManagement';
import ViewPrescriptions from './ViewPrescriptions';

const Pharmacy = ({ messages }) => {

  const handleProfileClick = () => {
    window.location.href = '/myProfile'
  }
  const [showMessages, setShowMessages] = useState(false);
  const [newMedManagement, setMedManagement] = useState(false);
  const [newPres, setNewPres] = useState(false);

  const handlePrescriptions = () => {
    setNewPres(!newPres)
  }

  const handleMedManagement = () => {
    setMedManagement(!newMedManagement);
  };

  const handleMessaging = () => {
    setShowMessages(!showMessages);
  };

  const handleDeleteMessage = (index) => {
    // Implement the logic to delete a message, either by updating the state or making a backend call
    console.log(`Delete message at index ${index}`);
  };

  return (
    <section className="pharmacy-dashboard">
      <div className="services-shape">
        <img src={curveShape1} alt="" />
      </div>
      <div className="container">
        <div className="services-content">
          <div className="services-panel">
            {/* First Panel */}
            <div className="services-list">
              <div className="services-item" onClick={handleMedManagement}>
                <div className="item-icon">
                  <img src={medicineIcon} alt="medicine icon" />
                </div>
                <h5 className="item-title fw-7">Manage Medicines</h5>
                <p className="text">Manage the list of available medicines and their details.</p>
              </div>

              <div className="services-item" onClick={handleProfileClick}> 
                <div className="item-icon">
                  <img src={profileIcon} alt="profile icon" />
                </div>
                <h5 className="item-title fw-7">My Profile</h5>
                <p className="text">View and manage your user profile.</p>
              </div>
            </div>

            {/* Second Panel */}
            <div className="services-list">
              <div className="services-item" onClick={handleMessaging}>
                <div className="item-icon">
                  <img src={messagingIcon} alt="messaging icon" />
                </div>
                <h5 className="item-title fw-7">Messaging</h5>
                <p className="text">Communicate with patients through messaging.</p>
              </div>

              <div className="services-item" onClick={handlePrescriptions}>
                <div className="item-icon">
                  <img src={prescriptionIcon} alt="prescription icon" />
                </div>
                <h5 className="item-title fw-7">Prescriptions and Medicines requests</h5>
                <p className="text">View prescriptions submitted by patients.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showMessages && <Messages showPopup={showMessages} togglePopup={() => setShowMessages(!showMessages)} handleDeleteMessage={handleDeleteMessage} messages={messages} />}
      {newMedManagement && (
         <MedManagement />
      )}
      {newPres && (
        <ViewPrescriptions/>
      )}
    </section>
  );
};

export default Pharmacy;
