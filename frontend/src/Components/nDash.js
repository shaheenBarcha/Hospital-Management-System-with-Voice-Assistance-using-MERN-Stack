import React, { useState } from 'react';
import './nDash.css';
import appointmentsIcon from './images/Appointments-icon.jpg';
import prescriptionsIcon from './images/Prescription-icon.jpg';
import viewDoctorsIcon from './images/doctor-icon.jpg';
import viewMedicationIcon from './images/medical-history-icon.jpg';
import myProfileIcon from './images/profile-icon.png';
import curveShape1 from './images/curve-shape-1.png';
import Messages from './Messages';
import DoctorsModal from './DoctorsModal';
import AppointmentManagementModal from './AppointmentManagementModal';
import PatientPrescriptionManagementModal from './PatientPrescriptionManagementModal.js';

const NDash = ({messages}) => {


  const [showMessages, setShowMessages] = useState(false);
  const [nweDoctorModals, setDoctorModals] = useState(false);
  const [newAppointments, setAppointments] = useState(false);
  const [NewPrescription, setPrescription] = useState(false);


  const handlePatientPrescription = () => {
    setPrescription(!NewPrescription);
  };
  const HandleAppointment = () => {
    setAppointments(!newAppointments);
  };
    

  const handleDoctorModals = () => {
    setDoctorModals(!nweDoctorModals);
  }

  const handleMessaging = () => {
    setShowMessages(!showMessages);
  };
  const handleDeleteMessage = (index) => {
    // Implement the logic to delete a message, either by updating the state or making a backend call
    console.log(`Delete message at index ${index}`);
  };

  const handleProfileClick = () => {

    window.location.href='/myProfile'
  }

  return (
    <section className="nurse-dashboard">
      <div className="services-shape">
        <img src={curveShape1} alt="" />
      </div>
      <div className="container">
        <div className="services-content">
          <div className="services-panel">
            {/* First Panel */}
            <div className="services-list">
              <div className="services-item" onClick={HandleAppointment}>
                <div className="item-icon">
                  <img src={appointmentsIcon} alt="appointments icon" />
                </div>
                <h5 className="item-title fw-7">See Appointments</h5>
                <p className="text">View the list of scheduled appointments.</p>
              </div>

              <div className="services-item" onClick={handlePatientPrescription}>
                <div className="item-icon">
                  <img src={prescriptionsIcon} alt="prescriptions icon" />
                </div>
                <h5 className="item-title fw-7">See Prescriptions</h5>
                <p className="text">Access and view patient prescriptions.</p>
              </div>
            </div>

            {/* Second Panel */}
            <div className="services-list">
              <div className="services-item" onClick={handleDoctorModals}>
                <div className="item-icon">
                  <img src={viewDoctorsIcon} alt="view doctors icon" />
                </div>
                <h5 className="item-title fw-7">View Doctors</h5>
                <p className="text">Explore the list of doctors and their details.</p>
              </div>

              <div className="services-item">
                <div className="item-icon">
                  <img src={viewMedicationIcon} alt="view medication icon" />
                </div>
                <h5 className="item-title fw-7">View Medication</h5>
                <p className="text">Browse and access information about medications.</p>
              </div>
            </div>

            {/* Third Panel */}
            <div className="services-list">
              <div className="services-item" onClick={handleProfileClick}>
                <div className="item-icon">
                  <img src={myProfileIcon} alt="my profile icon" />
                </div>
                <h5 className="item-title fw-7">My Profile</h5>
                <p className="text">View and manage your nurse profile.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showMessages && <Messages showPopup={showMessages} togglePopup={() => setShowMessages(!showMessages)} handleDeleteMessage={handleDeleteMessage} messages={messages} />}
       {/* Availability */}

       {nweDoctorModals && (
        <div className="modal">
          <div className='popup-panel'>

            <span className="close-icon" onClick={handleDoctorModals}>
              &#10006;
            </span>
            <DoctorsModal />
          </div>
        </div>
      )}

{newAppointments && (
  <div>
    <div className='popup-panel' style={{ backgroundColor: 'white', width: '80%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box', wordWrap: 'break-word', overflowWrap: 'break-word', height: '400px'}}>
      <AppointmentManagementModal />
    </div>
  </div>
    )}

  {/* Prescriptions     */}
{NewPrescription && (
        <div className="modal">
          <div style={{ backgroundColor: 'white', width: '80%', maxWidth: '1200px', margin: '0 auto', overflowX: 'auto', overflowY: 'auto', boxSizing: 'border-box', wordWrap: 'break-word', overflowWrap: 'break-word', height: '400px' }}>
            <span className="close-icon" onClick={handlePatientPrescription}>
              &#10006;
            </span>
            <PatientPrescriptionManagementModal />
          </div>
        </div>
      )}
    
    </section>
  );
};

export default NDash;
