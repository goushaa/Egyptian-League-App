import React, { useEffect, useState } from 'react';
import { getAllUsers, approveUser, deleteUser } from '../services/userService';
import styles from '../css/EditUsers.module.css';

function EditUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      const sortedUsers = response.users.sort((a, b) => b.isPending - a.isPending);
      setUsers(sortedUsers);
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      setMessage('User approved successfully!');
      fetchUsers(); // Re-fetch all users
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setMessage('User deleted successfully!');
      fetchUsers(); // Re-fetch all users
    } catch (error) {
      setMessage(error.error);
    }
  };

  return (
    <div className={styles.editUsers_container}>
      <h2 className={styles.editUsers_h2}>Manage Users</h2>
      {message && <p className={styles.editUsers_message}>{message}</p>}
      <div className={styles.editUsers_section}>
        <ul className={styles.editUsers_userList}>
          {users.map(user => (
            <li key={user._id} className={styles.editUsers_userItem}>
              <div className={styles.editUsers_userDetails}>
                <p><strong>Username:</strong> {user.userName}</p>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.emailAddress}</p>
                <p><strong>City:</strong> {user.city}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Birth Date:</strong> {new Date(user.birthDate).toLocaleDateString()}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Status:</strong> {user.isPending ? 'Pending' : 'Approved'}</p>
              </div>
              <div className={styles.editUsers_userActions}>
                {user.isPending && (
                  <button onClick={() => handleApprove(user._id)} className={styles.editUsers_button}>Approve</button>
                )}
                <button onClick={() => handleDelete(user._id)} className={styles.editUsers_button}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EditUsers;