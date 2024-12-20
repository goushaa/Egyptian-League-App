import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUserTickets, reserveTicket, deleteTicket } from '../services/ticketService';
import { getMatches } from '../services/matchService';
import styles from '../css/ReserveTicket.module.css';

function ReserveTicket({ authData }) {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [creditCard, setCreditCard] = useState({ number: '', pin: '' });
  const [message, setMessage] = useState('');
  const [userTickets, setUserTickets] = useState([]);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await getMatches();
      setMatches(response.matches);
      if (selectedMatch) {
        const match = response.matches.find((match) => match._id === selectedMatch);
        if (match) {
          setAvailableSeats(match.seats);
        }
      }
    } catch (error) {
      setMessage(error.error);
    }
  }, [selectedMatch]);

  const fetchUserTickets = useCallback(async () => {
    try {
      const response = await getUserTickets();
      setUserTickets(response.tickets);
    } catch (error) {
      setMessage(error.error);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    fetchUserTickets();

    const ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'seatUpdate' && data.matchId === selectedMatch) {
        setAvailableSeats(data.seats);
      }
    };

    return () => {
      ws.close();
    };
  }, [selectedMatch, fetchMatches, fetchUserTickets]);

  const handleMatchChange = (e) => {
    const matchId = e.target.value;
    setSelectedMatch(matchId);
    const match = matches.find((match) => match._id === matchId);
    if (match) {
      setAvailableSeats(match.seats);
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

  const validateCreditCard = (number) => {
    const regex = /^[0-9]{16}$/;
    return regex.test(number);
  };

  const validatePin = (pin) => {
    const regex = /^[0-9]{4}$/;
    return regex.test(pin);
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!validateCreditCard(creditCard.number)) {
      setMessage('Invalid credit card number');
      return;
    }
    if (!validatePin(creditCard.pin)) {
      setMessage('Invalid PIN');
      return;
    }
    if (selectedSeats.length === 0) {
      setMessage('Please select at least one seat');
      return;
    }
    try {
      await reserveTicket({
        matchId: selectedMatch,
        seatNumbers: selectedSeats,
        creditCardNumber: creditCard.number,
        pin: creditCard.pin,
      });
      setMessage('Reservation successful!');
      fetchUserTickets();
      fetchMatches(); // Fetch the latest matches to update the seats
      setSelectedSeats([]); // Clear selected seats
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleCancelReservation = async (ticketId) => {
    try {
      await deleteTicket(ticketId);
      setMessage('Reservation cancelled successfully!');
      fetchUserTickets();
      fetchMatches(); // Fetch the latest matches to update the seats
    } catch (error) {
      setMessage(error.error);
    }
  };

  return (
    <div className={styles.reserveTicket_container}>
      <div className={styles.reserveTicket_left}>
        <h2 className={styles.reserveTicket_h2}>Reserve Ticket</h2>
        {message && <p className={styles.reserveTicket_message}>{message}</p>}
        <form className={styles.reserveTicket_form} onSubmit={handleReserve}>
          <select value={selectedMatch} onChange={handleMatchChange} className={styles.reserveTicket_input} required>
            <option value="">Select Match</option>
            {matches.map((match) => (
              <option key={match._id} value={match._id}>
                {match.homeTeam} vs {match.awayTeam} - {new Date(match.dateTime).toLocaleDateString()}
              </option>
            ))}
          </select>
          <div className={styles.reserveTicket_seats}>
            {availableSeats.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.reserveTicket_row}>
                <span className={styles.reserveTicket_rowLabel}>{String.fromCharCode(65 + rowIndex)}</span>
                {row.map((seat) => (
                  <button
                    key={seat.number}
                    type="button"
                    className={`${styles.reserveTicket_seat} ${
                      seat.isReserved
                        ? styles.reserveTicket_seat_reserved
                        : selectedSeats.includes(seat.number)
                        ? styles.reserveTicket_seat_selected
                        : styles.reserveTicket_seat_vacant
                    }`}
                    onClick={() => !seat.isReserved && handleSeatSelection(seat.number)}
                    disabled={seat.isReserved}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <input
            type="text"
            name="number"
            placeholder="Credit Card Number"
            value={creditCard.number}
            onChange={handleCreditCardChange}
            className={styles.reserveTicket_input}
            required
          />
          <input
            type="password"
            name="pin"
            placeholder="PIN"
            value={creditCard.pin}
            onChange={handleCreditCardChange}
            className={styles.reserveTicket_input}
            required
          />
          <button type="submit" className={styles.reserveTicket_button}>
            Reserve
          </button>
        </form>
      </div>
      <div className={styles.reserveTicket_right}>
        <h3 className={styles.reserveTicket_h3}>Your Reservations</h3>
        <ul>
          {userTickets.map((ticket) => {
            const match = matches.find((match) => match._id === ticket.matchId);
            if (!match) return null;
            return (
              <li key={ticket._id} className={styles.reserveTicket_ticketItem}>
                <Link to={`/view-match/${ticket.matchId}`} className={styles.reserveTicket_link}>
                  {match.homeTeam} vs {match.awayTeam}
                </Link>
                <div className={styles.reserveTicket_seats}>
                  Seats: {ticket.seatNumbers.join(', ')}
                </div>
                <button
                  onClick={() => handleCancelReservation(ticket._id)}
                  className={styles.reserveTicket_button}
                >
                  Cancel
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ReserveTicket;