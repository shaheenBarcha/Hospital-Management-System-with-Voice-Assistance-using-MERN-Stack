import React, { useState } from 'react';
import './Services.css'
import serviceIcon1 from './images/service-icon-1.png';
import serviceIcon2 from './images/service-icon-2.png';
import serviceIcon3 from './images/service-icon-3.png';
import serviceIcon4 from './images/service-icon-4.png';
import serviceIcon5 from './images/service-icon-5.png';
import serviceIcon6 from './images/service-icon-6.png';
import curveShape1 from './images/curve-shape-1.png';
import OnlinePharmacy from './OnlinePharmacy.js';

const Services = () => {

  const[newPharm, setPharm] = useState(false)

  const handlePharm = () => {
    console.log('clicked')
    setPharm(!newPharm)
  }
  return (
    <section className="sc-services">
      <div className="services-shape">
        <img src={curveShape1} alt="" />
      </div>
      <div className="container">
        <div className="services-content">
          <div className="services-list">
            <div className="services-item">
              <div className="item-icon">
                <img src={serviceIcon1} alt="service icon" />
              </div>
              <h5 className="item-title fw-7">Search doctor</h5>
              <p className="text">Choose your doctor form thousands of specialist, general and trusted hospitals.</p>
            </div>

            <div className="services-item" >
              <div className="item-icon" onClick={handlePharm}>
                <img src={serviceIcon2} alt="service icon" />
              </div>
              <h5 className="item-title fw-7">Online pharmacy</h5>
              <p className="text">Buy your medicines with our mobile application with a simple delivery system</p>
            </div>

            <div className="services-item">
              <div className="item-icon">
                <img src={serviceIcon3} alt="service icon" />
              </div>
              <h5 className="item-title fw-7">Consultation</h5>
              <p className="text">Free consultation with our trusted doctors and get the best recommendations.</p>
            </div>

            <div className="services-item">
              <div className="item-icon">
                <img src={serviceIcon4} alt="service icon" />
              </div>
              <h5 className="item-title fw-7">Details info</h5>
              <p className="text">Free consultation with our trusted doctors and get the best recommendations.</p>
            </div>

            <div className="services-item">
              <div className="item-icon">
                <img src={serviceIcon5} alt="service icon" />
              </div>
              <h5 className="item-title fw-7">Emergency care</h5>
              <p className="text">You can get 24/7 urgent care for yourself or your children and your lovely family.</p>
            </div>

            <div className="services-item">
              <div className="item-icon">
                <img src={serviceIcon6} alt="service icon" />
              </div>
              <h5 className="item-title fw-7">Tracking</h5>
              <p className="text">Track and save your mental history and health data</p>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-center services-main-btn">
            <button type="button" className="btn btn-primary-outline">Learn more</button>
          </div>
        </div>
      </div>
      {newPharm && (
        <OnlinePharmacy/>
      )}
    </section>
  );
};

export default Services;
