import React, { useEffect, useState } from 'react';
import { getMatches } from '../services/matchService';
import styles from './MainPage.module.css';

function MainPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await getMatches();
        setMatches(response.matches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Upcoming Egyptian League Matches</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>Venue</th>
            <th>Main Referee</th>
            <th>First Linesman</th>
            <th>Second Linesman</th>
            <th>Ticket Price</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => (
            <tr key={match._id}>
              <td>{new Date(match.dateTime).toLocaleDateString()}</td>
              <td>{match.homeTeam}</td>
              <td>{match.awayTeam}</td>
              <td>{match.venue}</td>
              <td>{match.mainReferee}</td>
              <td>{match.firstLinesman}</td>
              <td>{match.secondLinesman}</td>
              <td>{match.ticketPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MainPage;