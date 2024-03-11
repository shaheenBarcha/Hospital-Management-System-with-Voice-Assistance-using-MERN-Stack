import React, { useState } from 'react';
import './Theme.css';

// Import images
import elementImg1 from './images/treatment-icon.png';
import bannerImage from './images/treatment-icon.png';

const Home = () => {


  const handlClickPharmacy = () => {
    window.location.href = '/op'
  }
  const handleClickDoctors = () => {
    // alert('doctor')
    window.location.href = '/dm'
  }

  const handleClick =  () =>{
    window.location.href = '/vasistant'
  }
  return (
    <header className="header">

      <div className="element-one">
        <img src={elementImg1} alt="" />
      </div>

      <div className="banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-left">
              <div className="content-wrapper">
                <h3 className="banner-title">E-Hospital </h3>
                <p className="text text-black">Discover a revolutionary eHospital web app! Admin, doctors, pharmacists, patients, and nurses seamlessly connected. User-friendly interfaces, streamlined management, and inclusive voice assistant for disabled patients. Elevate healthcare with us!</p>
                <a href="#" className="btn btn-secondary" onClick={handleClick}>Click for Voice Help</a>
                <a href="#" className="btn btn-secondary" onClick={handleClickDoctors}>Click for View Doctors</a>
                <a href="#" className="btn btn-secondary" onClick={handlClickPharmacy}>Click for Online Pharmacy</a>
              </div>
            </div>
            <div className="banner-right d-flex align-items-center justify-content-end">
              <img src={bannerImage} alt="" />
            </div>
          </div>
        </div>
      </div>
     
    </header>
    
  );
};

export default Home;
