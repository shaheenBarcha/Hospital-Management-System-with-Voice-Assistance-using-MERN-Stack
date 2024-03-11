// Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cellNumber, setCellNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      // Validation checks
      if (!username || !email || !password || !confirmPassword || !cellNumber || !selectedRole) {
        setError('All fields are required. Please fill in all the details.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Password and Confirm Password must match.');
        return;
      }

      // Perform registration
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
        confirmPassword,
        cellNumber,
        role: selectedRole,
      });

      console.log(response.data);

      // If the selected role is "Patient," call the PatientProfile API
      if (selectedRole === 'Patient') {
        const patientProfileResponse = await axios.post('http://localhost:5000/PatientProfile', {
          name: username,
          cell: cellNumber,
          // Add other relevant fields as needed
        });

        console.log(patientProfileResponse.data);
      }

      // Show success alert
      alert('User added successfully!');

      // Navigate to login page upon successful registration
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  };

  const handleCheckboxChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <section className="register-container">
      <div className="container">
        <div className="register-content">
          <div className="register-form">
            <h3 className="register-title">Register</h3>
            <form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cellNumber">Cell Number</label>
                <input
                  type="tel"
                  id="cellNumber"
                  value={cellNumber}
                  onChange={(e) => setCellNumber(e.target.value)}
                  placeholder="Enter your cell number"
                />
              </div>

              {/* Radio buttons for user roles */}
              <div className="form-group checkbox-group">
                <label>Select Role:</label>
                <div className="checkbox-options">
                  <div className="checkbox-option">
                    <label>
                      <input
                        type="radio"
                        name="role"
                        checked={selectedRole === 'Patient'}
                        onChange={() => handleCheckboxChange('Patient')}
                      />
                      Patient
                    </label>
                  </div>
                  <div className="checkbox-option">
                    <label>
                      <input
                        type="radio"
                        name="role"
                        checked={selectedRole === 'Doctor'}
                        onChange={() => handleCheckboxChange('Doctor')}
                      />
                      Doctor
                    </label>
                  </div>
                  <div className="checkbox-option">
                    <label>
                      <input
                        type="radio"
                        name="role"
                        checked={selectedRole === 'Nurse'}
                        onChange={() => handleCheckboxChange('Nurse')}
                      />
                      Nurse
                    </label>
                  </div>
                  <div className="checkbox-option">
                    <label>
                      <input
                        type="radio"
                        name="role"
                        checked={selectedRole === 'Pharmacist'}
                        onChange={() => handleCheckboxChange('Pharmacist')}
                      />
                      Pharmacist
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={handleRegister}>
                  Register
                </button>
              </div>

              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
