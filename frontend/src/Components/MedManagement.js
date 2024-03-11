import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const MedManagement = () => {
  const [medicineData, setMedicineData] = useState({
    medname: '',
    quantity: '',
    price: '',
    manufacturer: '',
    expiryDate: null,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [removedMedicine, setRemovedMedicine] = useState(null);
  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedicineData({
      ...medicineData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setMedicineData({
      ...medicineData,
      expiryDate: date,
    });
  };

  const validateAddMedicineForm = () => {
    const errors = {};

    if (!medicineData.medname.trim()) {
      errors.medname = 'Medicine name is required';
    }

    if (!medicineData.quantity.trim()) {
      errors.quantity = 'Quantity is required';
    }

    if (!medicineData.price.trim()) {
      errors.price = 'Price is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if there are no errors
  };

  const handleAddMedicine = () => {
    if (!validateAddMedicineForm()) {
      return;
    }

    fetch('http://localhost:5000/addMedicine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicineData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Medicine added successfully:', data);
        setShowAddMedicineForm(false);
        setMedicineData({
          medname: '',
          quantity: '',
          price: '',
          manufacturer: '',
          expiryDate: null,
        });
        setFormErrors({});
      })
      .catch(error => {
        console.error('Error adding medicine:', error);
      });
  };

  const handleSearchMedicine = () => {
    fetch(`http://localhost:5000/searchMedicine?search=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        console.log('Search results:', data);

        if (data.length === 0) {
          // If no results are found, display an error message
          setFormErrors({ search: 'No medicines found for the given search term' });
        } else {
          setSearchResults(data);
          setFormErrors({});
        }
      })
      .catch(error => {
        console.error('Error searching for medicine:', error);
        setFormErrors({ search: 'Error searching for medicine. Please try again later.' });
      });
  };

  const handleRemoveMedicine = (medname) => {
    if (!medname) {
      console.error('Invalid medname for removal');
      return;
    }

    fetch(`http://localhost:5000/removeMedicine/${medname}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Medicine removed successfully:', data);
        setRemovedMedicine(medname);
      })
      .catch(error => {
        console.error('Error removing medicine:', error);
      });
  };

  const toggleAddMedicineForm = () => {
    setShowAddMedicineForm(!showAddMedicineForm);
    setFormErrors({});
  };

  const [showMedManagement, setShowMedManagement] = useState(true);
  const handleCloseMedManagement = () => {
    setShowMedManagement(false);
  };

  return (
    <div className='abc' style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      zIndex: '999',
      width: '600px',
      textAlign: 'center',
      display: showMedManagement ? 'block' : 'none'
    }}>
      {/* Close icon for the main popup */}
      <button onClick={handleCloseMedManagement} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <h1>Medicine Management</h1>
      
      {/* Search Medicine */}
      <div>
        <h2>Search Medicine</h2>
        <label>Search Term:</label>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearchMedicine}>Search</button>
        <button onClick={toggleAddMedicineForm}>Add Medicine</button>
      </div>

      {/* Add Medicine Form Popup */}
      {showAddMedicineForm && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          zIndex: '999',
          width: '400px',
          textAlign: 'center',
        }}>
          <h2>Add Medicine</h2>
          <label>Name:</label>
          <input type="text" name="medname" value={medicineData.medname} onChange={handleInputChange} />
          {formErrors.medname && <p style={{ color: 'red' }}>{formErrors.medname}</p>}
          
          <label>Quantity:</label>
          <input type="text" name="quantity" value={medicineData.quantity} onChange={handleInputChange} />
          {formErrors.quantity && <p style={{ color: 'red' }}>{formErrors.quantity}</p>}
          
          <label>Price:</label>
          <input type="text" name="price" value={medicineData.price} onChange={handleInputChange} />
          {formErrors.price && <p style={{ color: 'red' }}>{formErrors.price}</p>}
          
          <label>Manufacturer:</label>
          <input type="text" name="manufacturer" value={medicineData.manufacturer} onChange={handleInputChange} />
          
          <label>Expiry Date:</label>
          <DatePicker
            selected={medicineData.expiryDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
          />
          <button onClick={handleAddMedicine}>Add Medicine</button>
          <button onClick={toggleAddMedicineForm}>Close</button>
        </div>
      )}

      {/* Display search results as a table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Manufacturer</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((result) => (
            <tr key={result.id}>
              <td>{result.medname}</td>
              <td>{result.quantity}</td>
              <td>{result.price}</td>
              <td>{result.manufacturer}</td>
              <td>{result.expiryDate}</td>
              <td>
                <button onClick={() => handleRemoveMedicine(result.medname)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display search errors */}
      {formErrors.search && (
        <p style={{ color: 'red' }}>{formErrors.search}</p>
      )}

      {/* Removed Medicine */}
      {removedMedicine && (
        <div>
          <h2>Removed Medicine</h2>
          <p>Medicine with ID {removedMedicine} has been removed.</p>
        </div>
      )}
    </div>
  );
};

export default MedManagement;
