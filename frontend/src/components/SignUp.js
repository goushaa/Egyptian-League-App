import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { signUp } from '../services/authService';
import styles from '../css/SignUp.module.css'; // Import CSS module

function SignUp() {
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
    role: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  // Role and gender options
  const roleOptions = [
    { label: 'Manager', value: 'manager' },
    { label: 'Fan', value: 'fan' },
  ];

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signUp(formData); // Assuming signUp is an API call
      console.log('Success Response:', response);
      setMessage({text:`${response.userName} Sign-up Successful!`, type: 'success' });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error Response:', error.error);
      setMessage({ text: error.error, type: 'error' });
    }
  };

  return (
    <div className={styles.signUp_container}>
      <h2 className={styles.signUp_title}>Sign Up</h2>
      <form className={styles.signUp_form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className={styles.signUp_input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.signUp_input}
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.signUp_input}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.signUp_input}
          required
        />
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className={styles.signUp_input}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={styles.signUp_input}
          required
        >
          <option value="">Select Gender</option>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className={styles.signUp_input}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className={styles.signUp_input}
        />
        <input
          type="email"
          name="emailAddress"
          placeholder="Email Address"
          value={formData.emailAddress}
          onChange={handleChange}
          className={styles.signUp_input}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={styles.signUp_input}
          required
        >
          <option value="">Select Role</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" className={styles.signUp_button}>
          Sign Up
        </button>
      </form>
{message && (
      <p className={`${styles.signUp_message} ${message.type === 'error' ? styles.signUp_message_error : styles.signUp_message_success}`}>
        {message.text}
      </p>
    )}    </div>
  );
}

export default SignUp;