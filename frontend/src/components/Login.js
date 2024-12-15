import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import styles from '../css/Login.module.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);      
      onLogin(response.token, response.userName, response.role); // Call onLogin with the token, userName, and role
      setMessage('Login Successful!');
      navigate('/');
    } catch (error) {
      setMessage(error.error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className={styles.input}
          required
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
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      <p className={styles.signUpPrompt}>
        Don’t have an account?{' '}
        <button className={styles.signUpLink} onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;