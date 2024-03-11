import React, { useState, useEffect } from 'react';

const DoctorsModal = () => {
  const [doctorsData, setDoctorsData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    fetch('http://localhost:5000/doctors')  // Assuming the backend is running on the same server at port 5000
      .then(response => response.json())
      .then(data => setDoctorsData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="services-list" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '100%', width: '350px', height: '400px', margin: 'auto' }}>
      <h2>Doctors Availability</h2>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Days</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {doctorsData.map((doctor, index) => (
            <tr key={index}>
              <td>{doctor.name}</td>
              <td>{doctor.days}</td>
              <td>{doctor.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsModal;