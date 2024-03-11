import React, { useState } from 'react';

const OnlinePharmacy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineDetails, setMedicineDetails] = useState(null);
  const [cart, setCart] = useState([]);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    nameOnCard: '',
    cardNumber: '',
    cvv: '',
    expiryDate: '',
  });
  const [paymentError, setPaymentError] = useState('');
  const [showMedicineRequestForm, setShowMedicineRequestForm] = useState(false);
  const [medicineRequest, setMedicineRequest] = useState({
    patientName: '',
    cell: '',
    medicineName: '',
  });

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/searchMedicine?search=${searchTerm}`);
      const medicines = await response.json();

      if (medicines.length > 0) {
        setMedicineDetails({ ...medicines[0], quantity: 1 });
        setShowMedicineRequestForm(false);
      } else {
        setMedicineDetails(null);
        setShowMedicineRequestForm(true);
      }
    } catch (error) {
      console.error('Error searching medicines:', error);
    }
  };

  const handleAddToCart = () => {
    if (medicineDetails) {
      const existingMedicineIndex = cart.findIndex(item => item.medname === medicineDetails.medname);

      if (existingMedicineIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingMedicineIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...medicineDetails }]);
      }
    }
  };

  const handleIncreaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
  };

  const handleDecreaseQuantity = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
    }
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handleProceedToPayment = () => {
    setShowPaymentPanel(true);
  };

  const handlePayNow = async () => {
    if (!paymentInfo.nameOnCard || !paymentInfo.cardNumber || !paymentInfo.cvv || !paymentInfo.expiryDate) {
      setPaymentError('Please fill in all the required fields.');
      return;
    }

    try {
      console.log('Processing payment with:', paymentInfo);

      await fetch('http://localhost:5000/updateQuantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });

      setCart([]);
      setShowPaymentPanel(false);
      setPaymentInfo({
        nameOnCard: '',
        cardNumber: '',
        cvv: '',
        expiryDate: '',
      });
      setPaymentError('');
      window.alert('Success');
      console.log('Medicine quantities updated successfully.');
    } catch (error) {
      console.error('Error updating medicine quantities:', error);
      setPaymentError('Error processing payment. Please try again.');
    }
  };

  const handleAddMedicineRequest = () => {
    setShowMedicineRequestForm(true);
  };

  const handleMedicineRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/medrequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicineRequest),
      });

      if (response.ok) {
        console.log('Medicine request submitted successfully.');
        setShowMedicineRequestForm(false);
        setMedicineRequest({
          patientName: '',
          cell: '',
          medicineName: '',
        });
      } else {
        const responseData = await response.json();
        console.error('Error submitting medicine request:', responseData.error);
      }
    } catch (error) {
      console.error('Error submitting medicine request:', error);
    }
  };

  return (
    <>
      <div
        className='abc'
        style={{
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
        }}
      >
        <h1>Online Pharmacy</h1>
        <div>
          <label>Search Medicine:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {medicineDetails && (
          <div>
            <h2>Medicine Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Manufacturer</th>
                  <th>Expiry Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{medicineDetails.medname}</td>
                  <td>{medicineDetails.price}</td>
                  <td>{medicineDetails.manufacturer}</td>
                  <td>{new Date(medicineDetails.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={handleAddToCart}>Add to Cart</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            background: '#f0f0f0',
            textAlign: 'left',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h2>Shopping Cart</h2>
          {cart.map((item, index) => (
            <div key={index}>
              <p>Name: {item.medname}</p>
              <p>Price: {item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: {item.price * item.quantity}</p>
              <button onClick={() => handleIncreaseQuantity(index)}>+</button>
              <button onClick={() => handleDecreaseQuantity(index)}>-</button>
              <button style={{ color: 'red' }} onClick={() => handleRemoveFromCart(index)}>Remove</button>
            </div>
          ))}
          <p>Total Amount: {cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
          <button onClick={handleProceedToPayment}>Proceed to Payment</button>
        </div>
      )}

      {showPaymentPanel && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#f0f0f0',
            textAlign: 'center',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            zIndex: '999',
            width: '400px',
          }}
        >
          <h2>Payment Details</h2>
          <label>Name on Card:</label>
          <input
            type="text"
            value={paymentInfo.nameOnCard}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
          />
          <br />
          <label>Card Number:</label>
          <input
            type="text"
            value={paymentInfo.cardNumber}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
          />
          <br />
          <label>CVV:</label>
          <input
            type="text"
            value={paymentInfo.cvv}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
          />
          <br />
          <label>Expiry Date:</label>
          <input
            type="text"
            value={paymentInfo.expiryDate}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
          />
          <br />
          <p style={{ color: 'red' }}>{paymentError}</p>
          <button onClick={handlePayNow}>Pay Now</button>
        </div>
      )}

{showMedicineRequestForm && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#f0f0f0',
            textAlign: 'center',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            zIndex: '999',
            width: '400px',
          }}
        >
          <h2>No Medicine Found</h2>
          <p>Do you want to add a medicine request?</p>
          <form onSubmit={handleMedicineRequestSubmit}>
            <label>Patient Name:</label>
            <input
              type="text"
              value={medicineRequest.patientName}
              onChange={(e) => setMedicineRequest({ ...medicineRequest, patientName: e.target.value })}
            />
            <br />
            <label>Cell:</label>
            <input
              type="text"
              value={medicineRequest.cell}
              onChange={(e) => setMedicineRequest({ ...medicineRequest, cell: e.target.value })}
            />
            <br />
            <label>Medicine Name:</label>
            <input
              type="text"
              value={medicineRequest.medicineName}
              onChange={(e) => setMedicineRequest({ ...medicineRequest, medicineName: e.target.value })}
            />
            <br />
            <button type="button" onClick={() => setShowMedicineRequestForm(false)}>Cancel</button>
            <button type="submit">Submit Request</button>
          </form>
        </div>
      )}
    </>
  );
};

export default OnlinePharmacy;
