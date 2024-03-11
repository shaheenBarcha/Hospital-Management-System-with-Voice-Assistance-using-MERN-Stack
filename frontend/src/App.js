import DoctorsModal from './Components/DoctorsModal.js';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Services from './Components/Services.js';
import Home from './Components/Home';
import Login from './Components/Login';
import Navbar from './Components/Navbar.js';
import Register from './Components/Register.js';
import Vasistant from './Components/Vasistant.js';
import DDash from './Components/dDashboard.js';
import PDash from './Components/pDashboard.js';
import PHDash from './Components/pharmacy.js';
import ADash from './Components/adminDasboard.js';
import NDash from './Components/nDash.js';
import newMessage from './Components/NewMessage.js';
import MyProfile from './Components/myProfile.js';
import AddUser from './Components/AddUser.js';
import AppointmentForm from './Components/Appointmentform.js';
import MedModal from './Components/medModal.js' 
import PatientListModal from './Components/PatientlistModal.js';
import Sidebar from './Components/Sidebar.js';
import Messages from './Components/Messages.js';
import PatientPrescriptionManagementModal from './Components/PatientPrescriptionManagementModal.js';
import PatientHistory from './Components/PatientHistory.js';
import './App.css'; // Import the CSS file
import OnlinePharmacy from './Components/OnlinePharmacy.js';
import ViewPrescriptions from './Components/ViewPrescriptions.js';

function App() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    // Check email status when the component mounts
    checkEmailApi();
  }, []);

  const checkEmailApi = async () => {
    try {
      const response = await fetch('http://localhost:5000/checkEmail');
      const data = await response.json();

      console.log('API Response:', data);

      // If the email is null, hide the sidebar
      setSidebarVisible(!!data.email);
    } catch (error) {
      console.error('Error checking email:', error);
      setSidebarVisible(false);
    }
  };

  return (
    <Router>
      <div className="app-container">
        
        <div className="content-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Service" element={<Services />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vasistant" element={<Vasistant />} />
            <Route path="/dDash" element={<DDash />} />
            <Route path="/pDash" element={<PDash />} />
            <Route path="/phDash" element={<PHDash />} />
            <Route path="/aDash" element={<ADash />} />
            <Route path="/nDash" element={<NDash />} />
            <Route path="/newMsg" element={<newMessage />} />
            <Route path="/addUser" element={<AddUser />} />
            <Route path="/appointmentform" element={<AppointmentForm />} />
            <Route path="/medmodal" element={<MedModal />} />
            <Route path="/PatientListModal" element={<PatientListModal />} />
            <Route path="/msg" element={<Messages />} />
            <Route path="/PPM" element={<PatientPrescriptionManagementModal />} />
            <Route path="/dm" element={<DoctorsModal />} />
            <Route path="/ph" element={<PatientHistory />} />
            <Route path="/op" element={<OnlinePharmacy />} />
            <Route path="/vp" element={<ViewPrescriptions />} />
            <Route path="/myProfile" element={<MyProfile />} />
          </Routes>
        </div>
        <div className={`sidebar-container ${isSidebarVisible ? 'visible' : 'hidden'}`}>
          {isSidebarVisible && <Sidebar />}
        </div>
      </div>
    </Router>
  );
}

export default App;
