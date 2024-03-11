import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const modalStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    maxWidth: '600px',
    width: '100%',
  },
};

const titleStyles = {
  textAlign: 'center',
  marginBottom: '20px',
};

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thTdStyles = {
  border: '1px solid black',
  padding: '10px',
  textAlign: 'left',
};

const closeButtonStyles = {
  marginTop: '20px',
  alignSelf: 'flex-end',
  padding: '10px',  // Added padding for better visibility
};

const PatientHistory = () => {
  const [patientData, setPatientData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(true); // Open the modal by default

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getPrescriptionsAndInstructions');
        const { prescriptions, specialInstructions } = response.data;

        const combinedData = prescriptions.map((prescription, index) => ({
          prescription,
          instruction: specialInstructions[index] || '',
          date: '2022-01-01',
        }));

        setPatientData(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Patient History Modal"
        appElement={document.getElementById('root')}
        style={modalStyles}
      >
        <h2 style={titleStyles}>Patient History</h2>

        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thTdStyles}>Prescriptions</th>
              <th style={thTdStyles}>Special Instructions</th>
              <th style={thTdStyles}>Date</th>
            </tr>
          </thead>
          <tbody>
            {patientData.map((entry, index) => (
              <tr key={index}>
                <td style={thTdStyles}>{entry.prescription}</td>
                <td style={thTdStyles}>{entry.instruction}</td>
                <td style={thTdStyles}>{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className= 'closebtn' style={{ color:'red', marginTop: '20px',alignSelf: 'flex-end',paddingTop:'100%',paddingLeft: '250px',}} onClick={() => setModalIsOpen(false)}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default PatientHistory;
