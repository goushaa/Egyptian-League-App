import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { viewMatch } from '../services/matchService';
import styles from '../css/ViewMatch.module.css';

function ViewMatch() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await viewMatch(matchId);
        setMatch(response);
      } catch (error) {
        setMessage(error.error);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (!match) {
    return <div>{message || 'Loading...'}</div>;
  }

  return (
    <div className={styles.viewMatch_container}>
      <h2 className={styles.viewMatch_h2}>Match Details</h2>
      <div className={styles.viewMatch_details}>
        <p><strong>Home Team:</strong> {match.homeTeam}</p>
        <p><strong>Away Team:</strong> {match.awayTeam}</p>
        <p><strong>Venue:</strong> {match.venue}</p>
        <p><strong>Date and Time:</strong> {new Date(match.dateTime).toLocaleString()}</p>
        <p><strong>Main Referee:</strong> {match.mainReferee}</p>
        <p><strong>First Linesman:</strong> {match.firstLinesman}</p>
        <p><strong>Second Linesman:</strong> {match.secondLinesman}</p>
        <p><strong>Ticket Price:</strong> ${match.ticketPrice}</p>
      </div>
    </div>
  );
}

export default ViewMatch;