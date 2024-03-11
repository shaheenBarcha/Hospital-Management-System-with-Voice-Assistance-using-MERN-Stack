// DDashboard.js
import React, { useState, useEffect } from 'react';
import './dDashboard.css';
import doctorIcon from './images/doctor-icon.jpg';
import prescriptionIcon from './images/Prescription-icon.jpg';
import appointmentIcon from './images/Appointments-icon.jpg';
import treatmentIcon from './images/treatment-icon.png';
import messagingIcon from './images/messaging-icon.jpg';
import doctorsAppointmentIcon from './images/doctor-appointment.png';
import emergencyIcon from './images/emergency-icon.jpg';
import curveShape1 from './images/service-icon-5.png';
import PatientListModal from './PatientlistModal.js';
import PatientPrescriptionManagementModal from './PatientPrescriptionManagementModal.js';
import Messages from './Messages';
import AppointmentManagementModal from './AppointmentManagementModal.js';

const DDashboard = ({ messages }) => {
  
  const [patientList, setPatientList] = useState(false);
  const [NewPrescription, setPrescription] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [newAppointments, setAppointments] = useState(false);

const HandleAppointment = () => {
  setAppointments(!newAppointments);
};
  
  useEffect(() => {
    // Fetch messages from the backend or pass them as a prop from the parent component
  }, []);

  const handlePatientPrescription = () => {
    setPrescription(!NewPrescription);
  };

  const handlePatientList = () => {
    setPatientList(!patientList);
  };

  const handleMessaging = () => {
    setShowMessages(!showMessages);
  };



  const handleDeleteMessage = (index) => {
    // Implement the logic to delete a message, either by updating the state or making a backend call
    console.log(`Delete message at index ${index}`);
  };

  return (
    <section className="dd-dashboard">
      <div className="services-shape">
        <img src={curveShape1} alt="" />
      </div>
      <div className="container">
        <div className="services-content">
          <div className="services-panel">
            {/* First Panel */}
            <div className="services-list">
              <div className="services-item" onClick={handlePatientList}>
                <div className="item-icon">
                  <img src={doctorIcon} alt="doctor icon" />
                </div>
                <h5 className="item-title fw-7">View Patients List</h5>
                <p className="text">View the list of patients and their details.</p>
              </div>

              <div className="services-item" onClick={handlePatientPrescription}>
                <div className="item-icon">
                  <img src={prescriptionIcon} alt="prescription icon" />
                </div>
                <h5 className="item-title fw-7">See Patient Details (Add Prescription)</h5>
                <p className="text">See detailed information about patients and add prescriptions.</p>
              </div>
            </div>

            {/* Second Panel */}
            <div className="services-list">
              <div className="services-item" onClick={HandleAppointment}>
                <div className="item-icon">
                  <img src={appointmentIcon} alt="appointment icon" />
                </div>
                <h5 className="item-title fw-7">View, Edit, and Delete Appointments</h5>
                <p className="text">Manage appointments with the ability to view, edit, and delete.</p>
              </div>

              <div className="services-item" onClick={handlePatientPrescription}>
                <div className="item-icon" >
                  <img src={treatmentIcon} alt="treatment icon" />
                </div>
                <h5 className="item-title fw-7">Instructions About Treatment</h5>
                <p className="text">Provide instructions about the treatment process.</p>
              </div>
            </div>
          </div>

          {/* Third Panel */}
          <div className="services-list">
            <div className="services-item" onClick={handleMessaging}>
              <div className="item-icon">
                <img src={messagingIcon} alt="messaging icon" />
              </div>
              <h5 className="item-title fw-7">Messaging</h5>
              <p className="text">Communicate with users through messaging.</p>
            </div>

            <div className="services-item" onClick={HandleAppointment}>
              <div className="item-icon">
                <img src={doctorsAppointmentIcon} alt="doctor's appointment icon" />
              </div>
              <h5 className="item-title fw-7">View Doctors and Their Appointments</h5>
              <p className="text">Explore other doctors and their scheduled appointments.</p>
            </div>

            <div className="services-item">
              <div className="item-icon">
                <img src={emergencyIcon} alt="emergency icon" />
              </div>
              <h5 className="item-title fw-7">Emergency Alarms</h5>
              <p className="text">Receive and manage emergency alarms.</p>
            </div>
          </div>
        </div>
      </div>

   
      {patientList && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={handlePatientList}>
              &#10006;
            </span>
            <PatientListModal />
          </div>
        </div>
      )}

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

      {/* Render Messages component */}
      {showMessages && <Messages showPopup={showMessages} togglePopup={() => setShowMessages(!showMessages)} handleDeleteMessage={handleDeleteMessage} messages={messages} />}

{newAppointments && (
  <div>
    <div className='popup-panel' style={{ backgroundColor: 'white', width: '80%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box', wordWrap: 'break-word', overflowWrap: 'break-word', height: '400px'}}>
      <AppointmentManagementModal />
    </div>
  </div>
    )}
    </section>
  );
};

export default DDashboard;
