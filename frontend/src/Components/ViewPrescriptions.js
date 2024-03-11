import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import MedRequests from './medRequests';

const ViewPrescriptions = () => {

    const [newMedRequest, setMedRequests] = useState(false)

    const handleMedRequests = () => {
        setMedRequests(!newMedRequest);
    }
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Fetch prescriptions from backend when the component mounts
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/pharmacyPrescriptions');
      const prescriptionsData = await response.json();
      setPrescriptions(prescriptionsData);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const [showMedManagement, setShowMedManagement] = useState(true);
  const handleCloseMedManagement = () => {
    setShowMedManagement(false);
  };
  return (
    <div className='abc'
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      zIndex: '999',
      width: '600px',
      textAlign: 'center',
      display: showMedManagement ? 'block' : 'none'
    }}>
         <button onClick={handleCloseMedManagement} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h1>View Prescriptions</h1>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Prescription</th>
            <th>Special Instructions</th>
            <th>Appointment Date</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription, index) => (
            <tr key={index}>
              <td>{prescription.name}</td>
              <td>{prescription.prescription.join(', ')}</td>
              <td>{prescription.specialInstructions.join(', ')}</td>
              <td>{new Date(prescription.appointmentDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleMedRequests}>View Medicine Requests</button>
      {newMedRequest && (
    <MedRequests/>
        )}
    </div>
    
  );
};

export default ViewPrescriptions;
