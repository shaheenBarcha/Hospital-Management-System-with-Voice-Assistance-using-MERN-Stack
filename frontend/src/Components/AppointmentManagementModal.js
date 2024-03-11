import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './uModel.css';
import AppointmentForm from './Appointmentform';

const AppointmentManagementModal = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState(false);

  const handleAddAppointment = () => {
    setNewAppointment(!newAppointment);
  };

  const handleCloseModal = () => {
    setNewAppointment(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/appointments');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:5000/Deleteappointments/${appointmentId}`);

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', width: '80%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box', wordWrap: 'break-word', overflowWrap: 'break-word', height: '400px' }}>
      <div className="modal-content">
        <span className="close-icon" onClick={handleCloseModal}>
          &times;
        </span>
        <h2>Appointments</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Patient Cell</th>
              <th>Appointment Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={appointment._id}>
                <td>{index + 1}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.patientCell}</td>
                <td>{appointment.appointmentDate}</td>
                <td>
                  <button
                    style={{color:'red'}}
                    onClick={() => handleDelete(appointment._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddAppointment} style={{color:'black'}}>
          Add Appointment
        </button>
      </div>

      {newAppointment && (
        <div className="modal-content">
          <div className="popup-panel">
            <AppointmentForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagementModal;
