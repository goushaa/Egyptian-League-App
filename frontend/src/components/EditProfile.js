import React, { useEffect, useState } from 'react';
import { getUser, editUser } from '../services/userService';
import styles from './EditProfile.module.css';

function EditProfile({ authData }) {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    city: '',
    address: '',
    emailAddress: '',
    role: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authData && authData._id) {
      fetchUserData();
    }
  }, [authData]);

  const fetchUserData = async () => {
    try {
      const response = await getUser(authData._id); // Pass the user ID
      setFormData(response.user);
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editUser(formData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit Profile</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className={styles.input}
          required
          disabled
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="email"
          name="emailAddress"
          placeholder="Email Address"
          value={formData.emailAddress}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default EditProfile;