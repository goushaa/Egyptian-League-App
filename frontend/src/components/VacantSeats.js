import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { viewMatch } from '../services/matchService';
import styles from '../css/VacantSeats.module.css';

function VacantSeats() {
  const { matchId } = useParams();
  const [seats, setSeats] = useState([]);
  const [message, setMessage] = useState('');

  const fetchMatchSeats = useCallback(async () => {
    try {
      const response = await viewMatch(matchId);
      setSeats(response.seats);
    } catch (error) {
      setMessage(error.error);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatchSeats();
  }, [fetchMatchSeats]);

  const countVacantSeats = () => {
    return seats.flat().filter(seat => !seat.isReserved).length;
  };

  return (
    <div className="centerWrapper">
      <div className={styles.vacantSeats_container}>
        <h2 className={styles.vacantSeats_h2}>Vacant Seats</h2>
        {message && <p className={styles.vacantSeats_message}>{message}</p>}
        <div className={styles.vacantSeats_grid}>
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.vacantSeats_row}>
              {row.map((seat) => (
                <div
                  key={seat.number}
                  className={`${styles.vacantSeats_seat} ${
                    seat.isReserved
                      ? styles.vacantSeats_seat_reserved
                      : styles.vacantSeats_seat_vacant
                  }`}
                >
                  {seat.number}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className={styles.vacantSeats_footer}>
          {countVacantSeats()} seats left!
        </p>
      </div>
    </div>
  );
  
}

export default VacantSeats;