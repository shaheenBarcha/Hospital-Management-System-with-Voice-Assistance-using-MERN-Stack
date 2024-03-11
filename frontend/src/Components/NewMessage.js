import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewMessage = () => {
  const [recipient, setRecipient] = useState('');
  const [messageText, setMessageText] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch the logged-in user's email when the component mounts
    const fetchSenderEmail = async () => {
      try {
        const response = await axios.get('http://localhost:5000/checkEmail');
        setSenderEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchSenderEmail();
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const sendMessage = async () => {
    try {
      // Basic form validation
      if (!recipient || !messageText) {
        setErrorMessage('Please fill in all fields');
        // Hide error message after 3 seconds (3000 milliseconds)
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }

      const response = await axios.post('http://localhost:5000/messages', {
        sender: senderEmail,
        recipient,
        message: messageText,
      });

      setSuccessMessage('Message sent successfully');
      // Hide success message after 3 seconds (3000 milliseconds)
      setTimeout(() => setSuccessMessage(''), 3000);
      console.log('Message sent successfully', response.data);

      // Optionally, you can reset the form or navigate back to the previous screen here
      // resetForm();
    } catch (error) {
      console.error('Error sending message', error);
      setErrorMessage('Error sending message. Please try again.');
      // Hide error message after 3 seconds (3000 milliseconds)
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <>
      <div className="modal-body">
        <form>
          <div className="form-group">
            <label htmlFor="recipient-name" className="col-form-label">
              Recipient:
            </label>
            <input
              type="text"
              className="form-control"
              id="recipient-name"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message-text" className="col-form-label">
              Message:
            </label>
            <textarea
              className="form-control"
              id="message-text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            ></textarea>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <button
          type="button"
          className="btn btn-primary"
          onClick={sendMessage}
        >
          Send message
        </button>
      </div>
    </>
  );
};

export default NewMessage;
