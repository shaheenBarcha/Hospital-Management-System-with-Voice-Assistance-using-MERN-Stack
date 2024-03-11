import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedRequests = () => {
  const [medicineRequests, setMedicineRequests] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API endpoint
    axios.get('http://localhost:5000/viewMedreq')  // Update with your backend API URL
      .then(response => {
        setMedicineRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array to fetch data only once on component mount

  return (
    <div>
      <h1>Medicine Requests</h1>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Patient Cell</th>
            <th>Medicine Name</th>
          </tr>
        </thead>
        <tbody>
          {medicineRequests.map(request => (
            <tr key={request._id}>
              <td>{request.patientName}</td>
              <td>{request.cell}</td>
              <td>{request.medicineName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedRequests;
