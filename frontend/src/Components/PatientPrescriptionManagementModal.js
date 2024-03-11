import React, { useState } from 'react';

const PatientPrescriptionManagementModal = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptionInput, setPrescriptionInput] = useState('');
  const [specialInstructionsInput, setSpecialInstructionsInput] = useState('');
  const [billingAmountInput, setBillingAmountInput] = useState('');
  const [searchValidation, setSearchValidation] = useState({ success: true, message: '' });
  const [updateValidation, setUpdateValidation] = useState({ success: true, message: '' });

    const handleDetails = async (cellNumber) => {
    try {
      const response = await fetch(`http://localhost:5000/patientDetails/${cellNumber}`);
      const patient = await response.json();

      setSelectedPatient(patient);
      setPrescriptionInput(patient.prescription || '');
      setSpecialInstructionsInput(patient.specialInstructions || '');
      setBillingAmountInput(patient.billingAmount || '');
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };
  const handleSearch = async () => {
    try {
      if (searchInput.trim() === '') {
        setSearchValidation({ success: false, message: 'Please enter a search query' });
        return;
      }

      const response = await fetch(`http://localhost:5000/searchPatient?query=${searchInput}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch patient details. Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
      setSearchValidation({ success: true, message: '' });
    } catch (error) {
      console.error(`Error fetching patient details: ${error.message}`);
      setSearchValidation({ success: false, message: 'Error fetching patient details' });
    }
  };

  const handleUpdatePatientInfo = async () => {
    try {
      if (
        prescriptionInput.trim() === '' ||
        specialInstructionsInput.trim() === '' ||
        String(billingAmountInput).trim() === ''

      ) {
        setUpdateValidation({ success: false, message: 'Please fill in all fields' });
        return;
      }

      const response = await fetch(`http://localhost:5000/updatePatientInfo/${searchInput}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prescription: prescriptionInput,
          specialInstructions: specialInstructionsInput,
          billingAmount: billingAmountInput,
        }),
      });

      if (response.ok) {
        console.log('Patient information updated successfully');
        setSelectedPatient((prevPatient) => ({
          ...prevPatient,
          prescription: prescriptionInput,
          specialInstructions: specialInstructionsInput,
          billingAmount: billingAmountInput,
        }));
        setUpdateValidation({ success: true, message: 'Patient information updated successfully' });
      } else {
        console.error('Failed to update patient information');
        setUpdateValidation({ success: false, message: 'Failed to update patient information' });
      }
    } catch (error) {
      console.error('Error updating patient information:', error);
      setUpdateValidation({ success: false, message: 'Error updating patient information' });
    }
  };

  return (
    <div style={{ backgroundColor: 'white', width: '80%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box', wordWrap: 'break-word', overflowWrap: 'break-word', height: '400px' }}>
      <div className="modal-content">
        <span className="close">&times;</span>

        <h2>Patient Prescription </h2>
        <div>
          <label htmlFor="searchInput">Search Patient:</label>
          <input
            type="text"
            id="searchInput"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button style={{ color: 'blue' }} onClick={handleSearch}>
            Search
          </button>
          {searchValidation.message && (
            <div style={{ color: searchValidation.success ? 'green' : 'red' }}>{searchValidation.message}</div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div>
            <h3>Results:</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cell #</th>
                  <th>Appointment Date</th>
                  <th>Prescription</th>
                  <th>Spiecal Instructions</th>
                  <th>billingAmount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((patient) => (
                  <tr key={patient._id}>
                    <td>{patient.name}</td>
                    <td>{patient.cell}</td>
                    <td>{patient.appointmentDate}</td>
                    <td>{patient.prescription}</td>
                    <td>{patient.specialInstructions}</td>
                    <td>{patient.billingAmount}</td>
                    <td>
                      <button
                        style={{ color: 'red' }}
                        onClick={() => handleDetails(patient.cell)}
                      >
                        View / Edit Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedPatient && (
          <div>
            <h3>Details:</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cell #</th>
                  <th>Appointment Date</th>
                  <th>Prescription</th>
                  <th>Special Instructions</th>
                  <th>Billing Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr key={selectedPatient._id}>
                  <td>{selectedPatient.name}</td>
                  <td>{selectedPatient.cell}</td>
                  <td>{selectedPatient.appointmentDate}</td>
                  <td>
                    <input
                      type="text"
                      value={prescriptionInput}
                      onChange={(e) => setPrescriptionInput(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={specialInstructionsInput}
                      onChange={(e) => setSpecialInstructionsInput(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={billingAmountInput}
                      onChange={(e) => setBillingAmountInput(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <button onClick={handleUpdatePatientInfo} style={{ color: 'red' }}>
                Update Patient Information
              </button>
              {updateValidation.message && (
                <div style={{ color: updateValidation.success ? 'green' : 'red' }}>{updateValidation.message}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptionManagementModal;
