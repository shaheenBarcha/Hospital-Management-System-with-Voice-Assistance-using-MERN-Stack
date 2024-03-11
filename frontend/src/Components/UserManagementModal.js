import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import AddUser from './AddUser';
import './uModel.css';

const UserManagementModal = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/usersList');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleDeleteUser = async (index) => {
    try {
      const userEmail = users[index]?.email;

      if (!userEmail) {
        console.error('Error deleting user: Invalid user email. Users:', users);
        return;
      }

      console.log('Deleting user with email:', userEmail);

      const response = await fetch(`http://localhost:5000/Deleteusers/${userEmail}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the user list after deleting a user
        fetchUsers();
        console.log('User deleted successfully');
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div
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
      <div className="modal-content">
        <h2>User List</h2>
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Cell</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.cell}</td>
                <td>
                  <button style={{ backgroundColor: 'white', color: 'red' }} onClick={() => handleDeleteUser(index)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button style={{ backgroundColor: 'white', color: 'red' }} onClick={() => setShowAddUserForm(true)}>
            Add User
          </button>
          <button style={{ backgroundColor: 'white', color: 'red', marginLeft: '10px' }} onClick={() => setShowAddUserForm(false)}>
            Close
          </button>
        </div>
      </div>

      {showAddUserForm && <AddUser onClose={() => setShowAddUserForm(false)} />}
    </div>
  );
};

export default UserManagementModal;
