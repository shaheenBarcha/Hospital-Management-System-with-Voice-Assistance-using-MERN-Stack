import React, { useState } from 'react';
import './pDashboard.css';
import timeSlotsIcon from './images/timeSlotIcon.png';
import appointmentsIcon from './images/Appointments-icon.jpg';
import medicalHistoryIcon from './images/medical-history-icon.jpg';
import messagingIcon from './images/messaging-icon.jpg';
import diagnosticResultsIcon from './images/Diagnostic-report.png';
import billingIcon from './images/Billing-icon.jpg';
import feedbacksIcon from './images/feedback.png';
import curveShape1 from './images/curve-shape-1.png';
import Messages from './Messages.js';
import NewMessage from './NewMessage.js';
import DoctorsModal from './DoctorsModal.js';
import AppointmentForm from './Appointmentform.js';
import PatientHistory from './PatientHistory.js';
import axios from 'axios';


const PDashboard = ({ messages }) => { 
  const [showMessages, setShowMessages] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [newDoctorModal, setDoctorModal] = useState(false);
  const [newCheckAppointment, setCheckAppointment] = useState(false);
  const [newAppointment, setNewAppointment ] = useState(false);
  const [newPatientHistory, setNewPatientHistory] = useState(false);

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


  const handlePatientHistory = () => {

    setNewPatientHistory(!newPatientHistory);
  
  }

  const handleAppointments = () => {
    setNewAppointment(!newAppointment);
  }

  const handleCheckAppointment = () => {

    setCheckAppointment(!newCheckAppointment);
  }

  const handleDoctorModal = () => {
     setDoctorModal(!newDoctorModal)

  }


  const WriteMessage = () => {
    setNewMessage(!newMessage);
  };
  
  const handleMessaging = () => {
    setShowMessages(!showMessages);
  };
  const handleDeleteMessage = (index) => {
    // Implement the logic to delete a message, either by updating the state or making a backend call
    console.log(`Delete message at index ${index}`);
  };
  return (
    <section className="pd-dashboard">
      <div className="services-shape">
        <img src={curveShape1} alt="" />
      </div>
      <div className="container">
        <div className="services-content">
          <div className="services-panel">
            {/* First Panel */}
            <div className="services-list" >
              <div className="services-item" onClick={handleDoctorModal}>
                <div className="item-icon">
                  <img src={timeSlotsIcon} alt="time slots icon" />
                </div>
                <h5 className="item-title fw-7">View Available Time Slots</h5>
                <p className="text">Browse available time slots for appointments.</p>
              </div>

              <div className="services-item" onClick={handleCheckAppointment}>
                <div className="item-icon">
                  <img src={appointmentsIcon} alt="appointments icon" />
                </div>
                <h5 className="item-title fw-7">Appointments Availability</h5>
                <p className="text">Check the availability of appointments with doctors.</p>
              </div>
            </div>
            
            {/* Second Panel */}
            <div className="services-list">
              <div className="services-item" onClick={handlePatientHistory}>
                <div className="item-icon">
                  <img src={medicalHistoryIcon} alt="medical history icon" />
                </div>
                <h5 className="item-title fw-7">My Medical History</h5>
                <p className="text">Access and review your personal medical history.</p>
              </div>

              <div className="services-item" onClick={handleMessaging}>
                <div className="item-icon">
                  <img src={messagingIcon} alt="messaging icon" />
                </div>
                <h5 className="item-title fw-7">Messaging from Doctors</h5>
                <p className="text">Receive and respond to messages from your doctors.</p>
              </div>
            </div>

            {/* Third Panel */}
            <div className="services-list">
              <div className="services-item" onClick={generatePDF}>
                <div className="item-icon">
                  <img src={diagnosticResultsIcon} alt="diagnostic results icon" />
                </div>
                <h5 className="item-title fw-7">Diagnostic Results (PDF)</h5>
                <p className="text">View and download your diagnostic test results in PDF format.</p>
              </div>

              <div className="services-item">
                <div className="item-icon">
                  <img src={billingIcon} alt="billing icon" />
                </div>
                <h5 className="item-title fw-7">Billing and Invoicing</h5>
                <p className="text">Access billing information and invoices.</p>
              </div>
            </div>

            {/* Fourth Panel */}
            <div className="services-list" onClick={WriteMessage}>
              <div className="services-item">
                <div className="item-icon">
                  <img src={feedbacksIcon} alt="feedbacks icon" />
                </div>
                <h5 className="item-title fw-7">Feedbacks</h5>
                <p className="text">Provide feedback on your healthcare experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showMessages && <Messages showPopup={showMessages} togglePopup={() => setShowMessages(!showMessages)} handleDeleteMessage={handleDeleteMessage} messages={messages} />}
      {newMessage && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={WriteMessage}>
              &#10006;
            </span>
            <NewMessage />
          </div>
        </div>
      )}
      
      {/* Availability */}

      {newDoctorModal && (
        <div className="modal">
          <div className='popup-panel'>

            <span className="close-icon" onClick={handleDoctorModal}>
              &#10006;
            </span>
            <DoctorsModal />
          </div>
        </div>
      )}

      {/* CheckAppointments */}
      {newCheckAppointment && (
        <div className="modal">
          <div className='popup-panel'>
            <span className="close-icon" onClick={handleCheckAppointment}>
              &#10006;
            </span>
            <DoctorsModal />
            <button style={{color:'red'}} onClick={handleAppointments}>Apply for Appointment</button>
          </div>
        </div>
      )}
      
      {/* Appointment */}

       {/* CheckAppointments */}
       {newAppointment && (
        <div className="modal">
          <div className='popup-panel'>
            <span className="close-icon" onClick={handleAppointments}>
              &#10006;
            </span>
            <AppointmentForm />
            <button style={{color:'red'}}>Apply for Appointment</button>
          </div>
        </div>
      )}
      {/* Check History */}

      {newPatientHistory && (  
            <PatientHistory />
      )}


    </section>
  );
};

export default PDashboard;
