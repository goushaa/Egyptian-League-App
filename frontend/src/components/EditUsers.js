import React, { useEffect, useState } from 'react';
import { getAllUsers, getUnauthorizedUsers, approveUser, deleteUser } from '../services/userService';
import styles from './EditUsers.module.css';

function EditUsers() {
  const [users, setUsers] = useState([]);
  const [unauthorizedUsers, setUnauthorizedUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchUnauthorizedUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.users);
    } catch (error) {
      setMessage(error.error);
    }
  };

  const fetchUnauthorizedUsers = async () => {
    try {
      const response = await getUnauthorizedUsers();
      setUnauthorizedUsers(response.users);
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      setMessage('User approved successfully!');
      fetchUnauthorizedUsers(); // Re-fetch unauthorized users
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
      fetchUnauthorizedUsers(); // Re-fetch unauthorized users
    } catch (error) {
      setMessage(error.error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Users</h2>
      {message && <p className={styles.message}>{message}</p>}
      <div className={styles.section}>
        <h3>Unauthorized Users</h3>
        <ul>
          {unauthorizedUsers.map(user => (
            <li key={user._id} className={styles.userItem}>
              {user.userName} - {user.role}
              <button onClick={() => handleApprove(user._id)} className={styles.button}>Approve</button>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.section}>
        <h3>All Users</h3>
        <ul>
          {users.map(user => (
            <li key={user._id} className={styles.userItem}>
              {user.userName} - {user.role}
              <button onClick={() => handleDelete(user._id)} className={styles.button}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EditUsers;