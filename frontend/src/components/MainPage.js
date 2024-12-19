import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMatches } from '../services/matchService';
import { getTeamLogo } from '../services/teamService';
import styles from '../css/MainPage.module.css';

function MainPage() {
  const [matches, setMatches] = useState([]);
  const [teamLogos, setTeamLogos] = useState({});

  const fetchTeamLogos = useCallback(async (matches) => {
    const logos = {};
    for (const match of matches) {
      if (!logos[match.homeTeam]) {
        logos[match.homeTeam] = await getTeamLogo(match.homeTeam);
      }
      if (!logos[match.awayTeam]) {
        logos[match.awayTeam] = await getTeamLogo(match.awayTeam);
      }
    }
    setTeamLogos(logos);
  }, []);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await getMatches();
      setMatches(response.matches);
      fetchTeamLogos(response.matches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  }, [fetchTeamLogos]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

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
              <div className={`${styles.mainPage_team} ${styles.home}`}>
                <span>{match.homeTeam}</span>
                {teamLogos[match.homeTeam] && (
                  <img
                    src={teamLogos[match.homeTeam]}
                    alt={`${match.homeTeam} logo`}
                    className={styles.mainPage_teamLogo}
                  />
                )}
                <div className={styles.mainPage_teamLabel}>Home Team</div>
              </div>
              <div className={styles.mainPage_vs}>
                <span>VS</span>
                <Link to={`/vacant-seats/${match._id}`} className={styles.mainPage_seatsLink}>
                  Seats
                </Link>
              </div>
              <div className={`${styles.mainPage_team} ${styles.away}`}>
                {teamLogos[match.awayTeam] && (
                  <img
                    src={teamLogos[match.awayTeam]}
                    alt={`${match.awayTeam} logo`}
                    className={styles.mainPage_teamLogo}
                  />
                )}
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