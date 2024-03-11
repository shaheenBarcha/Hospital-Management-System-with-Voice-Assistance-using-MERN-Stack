import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './uModel.css';

const MedModal = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    fetchMedicines(); // Fetch medicines when the component mounts
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`/medicines?search=${searchTerm}`);
      setMedicines(response.data);
      setSearchError('');
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setSearchError('Error fetching medicines. Please try again.');
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchError('Please enter a search term.');
      return;
    }

    fetchMedicines(); // Trigger fetching medicines when the search term changes
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close">&times;</span>

        {/* Search input and button */}
        <div>
          <input
            type="text"
            placeholder="Search Medicine"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={{ color: 'red' }} onClick={handleSearch}>
            Search
          </button>
        </div>

        <h2>Pharmacy</h2>

        {searchError && <p style={{ color: 'red' }}>{searchError}</p>}

        {medicines.length === 0 && !searchError && (
          <p>No results found for the given search term.</p>
        )}

        {medicines.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Available Quantity</th>
                <th>Price</th>
                <th>Expiry Date</th>
                <th>Formula</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through the medicines and display them */}
              {medicines.map((medicine, index) => (
                <tr key={index}>
                  <td>{medicine.name}</td>
                  <td>{medicine.quantity}</td>
                  <td>{medicine.price}</td>
                  <td>{medicine.expiryDate}</td>
                  <td>{medicine.formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MedModal;
