import React, { useEffect, useState, useCallback } from 'react';
import { getUser, editUser } from '../services/userService';
import styles from '../css/EditProfile.module.css';

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
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await getUser(authData._id); // Pass the user ID
      setFormData({ ...response.user, password: '' }); // Initialize password as empty
    } catch (error) {
      setMessage(error.error);
    }
  }, [authData._id]);

  useEffect(() => {
    if (authData && authData._id) {
      fetchUserData();
    }
  }, [authData, fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { ...formData };
    if (!updatedData.password) {
      delete updatedData.password; // Remove password if it's empty
    }
    try {
      await editUser(updatedData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.error);
    }
  };

  const togglePasswordInput = () => {
    setIsPasswordEnabled(!isPasswordEnabled);
  };

  return (
    <div className={styles.editProfile_container}>
      <h2 className={styles.editProfile_h2}>Edit Profile</h2>
      {message && <p className={styles.editProfile_message}>{message}</p>}
      <form className={styles.editProfile_form} onSubmit={handleSubmit}>
        <label className={styles.editProfile_label}>Username</label>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className={styles.editProfile_input}
          required
          disabled
        />
        <div className={styles.editProfile_passwordContainer}>
          <label className={styles.editProfile_label}>Password</label>
          <button type="button" onClick={togglePasswordInput} className={styles.editProfile_toggleButton}>
            {isPasswordEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.editProfile_input}
          autoComplete="new-password" // Prevent autocomplete for password
          disabled={!isPasswordEnabled}
        />
        <label className={styles.editProfile_label}>First Name</label>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.editProfile_input}
          required
        />
        <label className={styles.editProfile_label}>Last Name</label>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.editProfile_input}
          required
        />
        <label className={styles.editProfile_label}>Birth Date</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate ? formData.birthDate.split('T')[0] : ''}
          onChange={handleChange}
          className={styles.editProfile_input}
          required
          autoComplete="off" // Prevent autocomplete for birthdate
        />
        <label className={styles.editProfile_label}>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={styles.editProfile_input}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label className={styles.editProfile_label}>City</label>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className={styles.editProfile_input}
          required
        />
        <label className={styles.editProfile_label}>Address</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className={styles.editProfile_input}
        />
        <label className={styles.editProfile_label}>Email Address</label>
        <input
          type="email"
          name="emailAddress"
          placeholder="Email Address"
          value={formData.emailAddress}
          onChange={handleChange}
          className={styles.editProfile_input}
          required
        />
        <button type="submit" className={styles.editProfile_button}>
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default EditProfile;