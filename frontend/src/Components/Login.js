import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      console.log(response.data);

      // Check the role and navigate accordingly
      const role = response.data.role;

      switch (role) {
        case 'Patient':
          window.location.href = '/pDash'
          break;
        case 'Doctor':
          window.location.href = '/dDash'
          break;
        case 'Nurse':
          window.location.href = '/nDash'
          break;
        case 'Admin':
          window.location.href = '/aDash'
          break;
        case 'Pharmacist':
          window.location.href = '/phDash'
          break;
        default:
          // Handle unknown role
          break;
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError('Invalid credentials. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response received from the server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error during request setup. Please try again.');
      }
    }
  };

  return (
    <section className="login-container">
      <div className="container">
        <div className="login-content">
          <div className="login-form">
            <h3 className="login-title">Login</h3>
            <form>
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
                <button type="button" className="btn btn-primary" onClick={handleLogin}>
                  Login
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

export default Login;
