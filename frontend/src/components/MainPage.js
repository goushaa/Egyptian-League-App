import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMatches } from '../services/matchService';
import styles from '../css/MainPage.module.css';

function MainPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await getMatches();
      setMatches(response.matches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.mainPage_container}>
      <h1 className={styles.mainPage_h1}>Upcoming Matches</h1>
      <div className={styles.mainPage_fixtures}>
        {matches.map((match) => (
          <div key={match._id} className={styles.mainPage_fixture}>
            <div className={styles.mainPage_teams}>
              <div className={styles.mainPage_team}>
                <span>{match.homeTeam}</span>
                <div className={styles.mainPage_teamLabel}>Home Team</div>
              </div>
              <div className={styles.mainPage_vs}>
                <span>VS</span>
                <Link to={`/vacant-seats/${match._id}`} className={styles.mainPage_seatsLink}>
                  Seats
                </Link>
              </div>
              <div className={styles.mainPage_team} style={{ textAlign: 'right' }}>
                <span>{match.awayTeam}</span>
                <div className={styles.mainPage_teamLabel}>Away Team</div>
              </div>
            </div>

            <div className={styles.mainPage_details}>
              <div className={styles.mainPage_details_left}>
                <div className={styles.mainPage_detailItem}><strong>Ticket Price:</strong> ${match.ticketPrice}</div>
                <div className={styles.mainPage_detailItem}><strong>Date:</strong> {formatDate(match.dateTime)}</div>
                <div className={styles.mainPage_detailItem}><strong>Venue:</strong> {match.venue}</div>
              </div>
              <div className={styles.mainPage_details_right}>
                <div className={styles.mainPage_detailItem}><strong>Main Referee:</strong> {match.mainReferee}</div>
                <div className={styles.mainPage_detailItem}><strong>First Linesman:</strong> {match.firstLinesman}</div>
                <div className={styles.mainPage_detailItem}><strong>Second Linesman:</strong> {match.secondLinesman}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
