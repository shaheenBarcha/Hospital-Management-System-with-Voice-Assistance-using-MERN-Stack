import React, { useState } from 'react';
import axios from 'axios';
import './AppointmentForm.css'

const AppointmentForm = () => {

  const [isModalOpen, setIsModalOpen] = useState(true);

  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    patientCell: '',
    appointmentDate: '',
  });
  const [isNumberAvailable, setIsNumberAvailable] = useState(true);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyNumber = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/verifyNumber?cell=${formData.patientCell}`);

      if (response.data.available) {
        setIsNumberAvailable(true);
      } else {
        setIsNumberAvailable(false);
        setError('Phone number is already associated with a patient.');
      }
    } catch (error) {
      console.error('Error verifying number:', error);
      setError('Error verifying phone number. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isNumberAvailable) {
        // Number is available, proceed with creating appointment and updating PatientProfile
        await axios.post('http://localhost:5000/Addappointments', formData);

        // Update PatientProfile with additional data
        await axios.post('http://localhost:5000/PatientProfile', {
          name: formData.patientName,
          cell: formData.patientCell,
          appointmentDate: formData.appointmentDate,
          // Add other fields if needed
        });
      }

      // Optionally, you can reset the form fields after successful submission
      setFormData({
        patientName: '',
        doctorName: '',
        patientCell: '',
        appointmentDate: '',
      });

      // You can also close the modal or perform any other necessary actions
    setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  return ( 
    isModalOpen && (
      <div className="modal">
        <div className="newModal">
          <span
            style={{ color: 'red' }}
            className="close"
            onClick={() => setIsModalOpen(false)} // Close the modal when the close button is clicked
          >
            &times;
          </span>

          <div>
            <h2>Add Appointment</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Patient Name:
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Doctor:
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Patient's Cell:
                <input
                  type="tel"
                  name="patientCell"
                  value={formData.patientCell}
                  onChange={handleChange}
                />
                <button type="button" onClick={handleVerifyNumber}>
                  Verify Number
                </button>
                {!isNumberAvailable && <p style={{ color: 'red' }}>{error}</p>}
              </label>
              <label>
                Appointment Date:
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                />
              </label>
              <button style={{ color: 'black' }} type="submit">
                Save Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};


export default AppointmentForm;
