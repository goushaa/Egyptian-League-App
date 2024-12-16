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
      onLogin(response.token, response.userName, response.role, response._id); // Call onLogin with the token, userName, and role
      setMessage('Login Successful!');
      navigate('/');
    } catch (error) {
      setMessage(error.error);
    }
  };

  return (
    <div className={styles.login_container}>
      <h2 className={styles.login_title}>Login</h2>
      <form className={styles.login_form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className={styles.login_input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.login_input}
          required
        />
        <button type="submit" className={styles.login_button}>
          Login
        </button>
      </form>
      {message && <p className={styles.login_message}>{message}</p>}
      <p className={styles.login_signUpPrompt}>
        Don’t have an account?{' '}
        <button className={styles.login_signUpLink} onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;