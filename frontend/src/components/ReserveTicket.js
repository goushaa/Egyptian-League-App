import React, { useEffect, useState } from 'react';
import { getUserTickets, reserveTicket, deleteTicket } from '../services/ticketService';
import { getMatches } from '../services/matchService';
import styles from './ReserveTicket.module.css';

function ReserveTicket({ authData }) {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [creditCard, setCreditCard] = useState({ number: '', pin: '' });
  const [message, setMessage] = useState('');
  const [userTickets, setUserTickets] = useState([]);

  useEffect(() => {
    fetchMatches();
    fetchUserTickets();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await getMatches();
      setMatches(response.matches);
    } catch (error) {
      setMessage(error.error);
    }
  };

  const fetchUserTickets = async () => {
    try {
      const response = await getUserTickets();
      setUserTickets(response.tickets);
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleMatchChange = (e) => {
    const matchId = e.target.value;
    setSelectedMatch(matchId);
    const match = matches.find((match) => match._id === matchId);
    if (match) {
      const vacantSeats = match.seats.flat().filter((seat) => !seat.isReserved);
      setAvailableSeats(vacantSeats);
    }
  };

  const handleSeatSelection = (seatNumber) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatNumber)
        ? prevSelectedSeats.filter((seat) => seat !== seatNumber)
        : [...prevSelectedSeats, seatNumber]
    );
  };

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setCreditCard({ ...creditCard, [name]: value });
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    try {
      await reserveTicket({
        matchId: selectedMatch,
        seatNumbers: selectedSeats,
        creditCardNumber: creditCard.number,
        pin: creditCard.pin,
      });
      setMessage('Reservation successful!');
      fetchUserTickets();
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleCancelReservation = async (ticketId) => {
    try {
      await deleteTicket(ticketId);
      setMessage('Reservation cancelled successfully!');
      fetchUserTickets();
    } catch (error) {
      setMessage(error.error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Reserve Ticket</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form className={styles.form} onSubmit={handleReserve}>
        <select value={selectedMatch} onChange={handleMatchChange} className={styles.input} required>
          <option value="">Select Match</option>
          {matches.map((match) => (
            <option key={match._id} value={match._id}>
              {match.homeTeam} vs {match.awayTeam} - {new Date(match.dateTime).toLocaleDateString()}
            </option>
          ))}
        </select>
        <div className={styles.seats}>
          {availableSeats.map((seat) => (
            <button
              key={seat.number}
              type="button"
              className={`${styles.seat} ${selectedSeats.includes(seat.number) ? styles.selected : ''}`}
              onClick={() => handleSeatSelection(seat.number)}
            >
              {seat.number}
            </button>
          ))}
        </div>
        <input
          type="text"
          name="number"
          placeholder="Credit Card Number"
          value={creditCard.number}
          onChange={handleCreditCardChange}
          className={styles.input}
          required
        />
        <input
          type="password"
          name="pin"
          placeholder="PIN"
          value={creditCard.pin}
          onChange={handleCreditCardChange}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Reserve
        </button>
      </form>
      <div className={styles.section}>
        <h3>Your Reservations</h3>
        <ul>
          {userTickets.map((ticket) => (
            <li key={ticket._id} className={styles.ticketItem}>
              Match: {ticket.matchId}, Seats: {ticket.seatNumbers.join(', ')}
              <button onClick={() => handleCancelReservation(ticket._id)} className={styles.button}>
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ReserveTicket;