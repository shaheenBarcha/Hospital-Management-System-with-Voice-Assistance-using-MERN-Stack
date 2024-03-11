import React, { useState } from 'react';
import './adminDashboard.css';
import appointmentRequestsIcon from './images/Appointments-icon.jpg';
import messagingIcon from './images/messaging-icon.jpg';
import profileIcon from './images/profile-icon.png';
import userManagementIcon from './images/user-management.png';
import appointmentManagementIcon from './images/doctor-appointment.png';
import viewMedicinesIcon from './images/medicine-icon.png';
import curveShape1 from './images/service-icon-5.png';
import MyProfile from './myProfile';
import axios from 'axios';
import NewMsg from './NewMessage.js'
import UserManagementModal  from './UserManagementModal.js'
import AppointmentManagementModal from './AppointmentManagementModal.js';
import MedModal from './medModal.js';
import Messages from './Messages.js';


const AdminDashboard = ({messages}) => {


  const [showProfile, setShowProfile] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [Management, setManagement] = useState(false);
  const [newAppointments,setAppointments] = useState(false);
  const [newMed, setMed] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const handleOnlinePharmacy = () => {
    window.location.href='/op'
  }

  const generatePDF = async () => {
    try {
      const response = await axios.get('http://localhost:5000/generatePDF', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'patient_profiles.pdf';
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleMed = () => {
    setMed(!newMed);
  }
  
  const HandleAppointment = () => {
    setAppointments(!newAppointments);
  }

  const handUserManagement = () => {
    setManagement(!Management);
  }

  const WriteMessage = () => {
    setNewMessage(!newMessage)
  }
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleMessaging = () => {
    setShowMessages(!showMessages);
  };
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientCell: '',
    appointmentDate: '',
  });
  const [selectedMessage, setSelectedMessage] = useState(null);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    setSelectedMessage(null);
  };

  const handleAddAppointment = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getTranscriptions');
      const transcriptions = response.data.transcriptions;
  
      if (transcriptions && transcriptions.length > 0) {
        // Assuming you want the latest transcription
        const latestTranscription = transcriptions[0];
  
        setFormData(prevState => ({
          ...prevState,
          text: latestTranscription.text,
          createdAt: latestTranscription.createdAt,
        }));
      } else {
        console.warn('No transcriptions found.');
      }
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
    }
  
    toggleModal();
  };
  

  const handleMessageClick = (message) => {

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/Addappointments', formData);
      console.log('Appointment added successfully');
      toggleModal();
      setFormData({
        patientName: '',
        doctorName: '',
        patientCell: '',
        appointmentDate: '',
      });
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };
  

  const dummyText = "This is some dummy text for the selected message.";

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  
  const handleDeleteMessage = (index) => {
    // Implement the logic to delete a message, either by updating the state or making a backend call
    console.log(`Delete message at index ${index}`);
  };
  return (
    <section className="admin-dashboard">
      <div className="services-shape">
        <img src={curveShape1} alt="" />
      </div>
      <div className="container">
        <div className="services-content">
          <div className="services-panel">
            <div className="services-list">

              {/* First Panel */}
              <div className="services-item" onClick={handleAddAppointment}>
                <div className="item-icon">
                  <img src={appointmentRequestsIcon} alt="appointment requests icon" />
                </div>
                <h5 className="item-title fw-7">Appointment Requests</h5>
                <p className="text">Manage incoming appointment requests from users.</p>
              </div>
              {/* Second Panel */}
              <div className="services-item" onClick={handleMessaging}>
                <div className="item-icon">
                  <img src={messagingIcon} alt="messaging icon" />
                </div>
                <h5 className="item-title fw-7">Messaging</h5>
                <p className="text">Communicate with users through messaging.</p>
              </div>
            </div>
              {/* Third Panel */}
              <div className="services-list">
        <div className="services-item" onClick={toggleProfile}>
          <div className="item-icon">
            {/* Use your own profile icon */}
            <img src={profileIcon} alt="profile icon" />
          </div>
          <h5 className="item-title fw-7">My Profile</h5>
          <p className="text">View and manage your admin profile.</p>
        </div>

            {/* Fourth Panel */}
              <div className="services-item" onClick={handUserManagement}>
                <div className="item-icon">
                  <img src={userManagementIcon} alt="user management icon" />
                </div>
                <h5 className="item-title fw-7">User Management</h5>
                <p className="text">Manage user accounts and roles.</p>
              </div>
            </div>
          {/* Fifth Panel */}
            <div className="services-list">
              <div className="services-item" onClick={HandleAppointment}>
                <div className="item-icon">
                  <img src={appointmentManagementIcon} alt="appointment management icon" />
                </div>
                <h5 className="item-title fw-7">Appointment Management System</h5>
                <p className="text">Manage and organize appointments across the system.</p>
              </div>

          {/* Sixth Panel */}
              <div className="services-item" onClick={handleOnlinePharmacy}>
                <div className="item-icon">
                  <img src={viewMedicinesIcon} alt="view medicines icon" />
                </div>
                <h5 className="item-title fw-7">View Medicines</h5>
                <p className="text">View the list of available medicines and their details.</p>
              </div>


            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span style={{color:'red'}} onClick={toggleModal}>&times;</span>
            {selectedMessage ? (
              <div>
                <h2>Full Message</h2>
                <p>{dummyText}</p>
              </div>
            ) : (
              <div>
                <h2>Add Appointment</h2>
                <div className="messages-list">
                <div className="message" onClick={() => handleMessageClick('Message')}>
                  Message :  {formData.text}
                </div>
                <div className="message" onClick={() => handleMessageClick('Message - 1')}>
                  Date :  {formData.createdAt}
                </div>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <label>
                    Patient Name:
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Doctor Name:
                    <input
                      type="text"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Patient's Cell:
                    <input
                      type="tel"
                      name="patientCell"
                      value={formData.patientCell}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Appointment Date:
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                    />
                  </label>
                  <button style={{color:'black'}}>
                    Save Appointment
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

{/* Messaging */}
{showMessages && <Messages showPopup={showMessages} togglePopup={() => setShowMessages(!showMessages)} handleDeleteMessage={handleDeleteMessage} messages={messages} />}

{showProfile && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={toggleProfile}>&#10006;</span>
            <MyProfile />
          </div>
        </div>
      )}

{newMessage && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={WriteMessage}>&#10006;</span>
            <NewMsg/>
          </div>
        </div>
      )}
{Management && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={handUserManagement}>&#10006;</span>
            <UserManagementModal />
          </div>
        </div>
      )} 
{/* Appointments */}

{newAppointments && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={HandleAppointment}>&#10006;</span>
            <AppointmentManagementModal />
          </div>
        </div>
       )} 
  {/* Medicine    */}

  {newMed && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={handleMed}>&#10006;</span>
            <MedModal/>
          </div>
        </div>
       )} 
    </section>
  );
};

export default AdminDashboard;
