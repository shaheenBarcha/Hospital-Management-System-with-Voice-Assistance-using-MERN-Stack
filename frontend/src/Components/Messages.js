// Messages.js
import React, { useState, useEffect } from 'react';
import NewMsg from './NewMessage.js';

const Messages = ({ showPopup, togglePopup, handleDeleteMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const WriteMessage = () => {
    setNewMessage(!newMessage);
  };

  const handleOpenFullMessage = (message) => {
    setSelectedMessage(message);
  };

  const handleCloseFullMessage = () => {
    setSelectedMessage(null);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/messages-list');
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <>
      {showPopup && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={togglePopup}>
              &#10006;
            </span>
            <h2>Messages</h2>
            {messages.length > 0 ? (
              <ul>
                {messages.map((message, index) => (
                  <li key={index} onClick={() => handleOpenFullMessage(message)}>
                    <strong>{message.senderEmail}: </strong>
                    {message.message.length > 20 ? `${message.message.substring(0, 20)}...` : message.message}
                    <span onClick={() => handleDeleteMessage(index)}>Delete</span>
                  </li>
                ))}
                <button style={{ border: '10px', color: 'black', display: 'block', margin: 'auto', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }} onClick={WriteMessage}>
                  New Message
                </button>
              </ul>
            ) : (
              <p>No messages</p>
            )}
          </div>
        </div>
      )}
      {newMessage && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={WriteMessage}>
              &#10006;
            </span>
            <NewMsg />
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className="modal">
          <div className="popup-panel">
            <span className="close-icon" onClick={handleCloseFullMessage}>
              &#10006;
            </span>
            <h2>Full Message</h2>
            <p>{selectedMessage.message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Messages;
