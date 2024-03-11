import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import AddUser from './AddUser'; // Import your AddUser component
import './uModel.css';

const PatientListModal = () => {
  const [patients, setPatients] = useState([]);
  const [newPatientName, setNewPatientName] = useState('');
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);

  useEffect(() => {
    // Fetch patients from the backend
    fetch('http://localhost:5000/patients')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error));
  }, []); // The empty dependency array ensures the effect runs once when the component mounts

  const handleDeletePatient = (index) => {
    // Perform the necessary database update to remove the patient
    // After the update is successful, you can fetch the updated list of patients and set the state
    // For simplicity, this example just removes the patient from the local state
    const updatedPatients = [...patients];
    updatedPatients.splice(index, 1);
    setPatients(updatedPatients);
  };

  return (
    <div className="admin-dashboard">
      <div className="modal">
        <div className="modal-content">
          
          <h2>Patient List</h2>
          <ul>
            {patients.map((patient, index) => (
              <li key={index} className="message">
                {patient.username} {/* Assuming each patient object has a 'username' property */}
                <span onClick={() => handleDeletePatient(index)}>
                  <FaTrash />
                </span>
              </li>
            ))}
          </ul>
          <div>
            <button style={{ backgroundColor: 'white', color: 'red' }} onClick={() => setShowAddPatientForm(true)}>
              Add Patient
            </button>
            {showAddPatientForm && <AddUser onClose={() => setShowAddPatientForm(false)} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientListModal;
