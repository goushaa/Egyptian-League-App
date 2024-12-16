import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStadium } from '../services/stadiumService';
import styles from '../css/AddStadium.module.css';

function AddStadium() {
  const [stadiumData, setStadiumData] = useState({
    name: '',
    city: '',
    address: '',
    rows: '',
    rowSeats: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStadiumData({ ...stadiumData, [name]: value });
  };

  const handleRowsAndSeatsChange = (e) => {
    const [rows, rowSeats] = e.target.value.split('x').map(Number);
    setStadiumData({ ...stadiumData, rows, rowSeats });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStadium(stadiumData);
      setMessage('Stadium created successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage(error.error);
    }
  };

  return (
    <div className={styles.addStadium_container}>
      <h2 className={styles.addStadium_h2}>Add Stadium</h2>
      {message && <p className={styles.addStadium_message}>{message}</p>}
      <form className={styles.addStadium_form} onSubmit={handleSubmit}>
        <label className={styles.addStadium_label}>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Stadium Name"
          value={stadiumData.name}
          onChange={handleChange}
          className={styles.addStadium_input}
          required
        />
        <label className={styles.addStadium_label}>City</label>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={stadiumData.city}
          onChange={handleChange}
          className={styles.addStadium_input}
          required
        />
        <label className={styles.addStadium_label}>Address</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={stadiumData.address}
          onChange={handleChange}
          className={styles.addStadium_input}
          required
        />
        <label className={styles.addStadium_label}>Rows and Seats</label>
        <select
          name="rowsAndSeats"
          onChange={handleRowsAndSeatsChange}
          className={styles.addStadium_input}
          required
        >
          <option value="">Select Rows and Seats</option>
          <option value="5x5">5x5</option>
          <option value="6x6">6x6</option>
          <option value="7x7">7x7</option>
          <option value="8x8">8x8</option>
          <option value="9x9">9x9</option>
          <option value="10x10">10x10</option>
        </select>
        <button type="submit" className={styles.addStadium_button}>Add Stadium</button>
      </form>
    </div>
  );
}

export default AddStadium;