import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { viewMatch } from '../services/matchService';
import { getTeamLogo } from '../services/teamService';
import styles from '../css/ViewMatch.module.css';

function ViewMatch() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [message, setMessage] = useState('');
  const [teamLogos, setTeamLogos] = useState({});

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await viewMatch(matchId);
        setMatch(response);
        fetchTeamLogos(response);
      } catch (error) {
        setMessage(error.error);
      }
    };

    const fetchTeamLogos = async (match) => {
      try {
        const homeTeamLogo = await getTeamLogo(match.homeTeam);
        const awayTeamLogo = await getTeamLogo(match.awayTeam);
        setTeamLogos({
          homeTeam: homeTeamLogo,
          awayTeam: awayTeamLogo,
        });
      } catch (error) {
        console.error('Error fetching team logos:', error);
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
      <div className={styles.viewMatch_teams}>
        <div className={styles.viewMatch_team}>
          {teamLogos.homeTeam && (
            <img
              src={teamLogos.homeTeam}
              alt={`${match.homeTeam} logo`}
              className={styles.viewMatch_teamLogo}
            />
          )}
          <span>{match.homeTeam}</span>
        </div>
        <div className={styles.viewMatch_vs}>VS</div>
        <div className={styles.viewMatch_team}>
          {teamLogos.awayTeam && (
            <img
              src={teamLogos.awayTeam}
              alt={`${match.awayTeam} logo`}
              className={styles.viewMatch_teamLogo}
            />
          )}
          <span>{match.awayTeam}</span>
        </div>
      </div>
      <div className={styles.viewMatch_details}>
        <div className={styles.viewMatch_detailItem}>
          <i className="fas fa-map-marker-alt"></i>
          <p><strong>Venue:</strong> {match.venue}</p>
        </div>
        <div className={styles.viewMatch_detailItem}>
          <i className="fas fa-calendar-alt"></i>
          <p><strong>Date:</strong> {new Date(match.dateTime).toLocaleDateString()}</p>
        </div>
        <div className={styles.viewMatch_detailItem}>
          <i className="fas fa-whistle"></i>
          <p><strong>Main Referee:</strong> {match.mainReferee}</p>
        </div>
        <div className={styles.viewMatch_detailItem}>
          <i className="fas fa-flag"></i>
          <p><strong>First Linesman:</strong> {match.firstLinesman}</p>
        </div>
        <div className={styles.viewMatch_detailItem}>
          <i className="fas fa-flag"></i>
          <p><strong>Second Linesman:</strong> {match.secondLinesman}</p>
        </div>
        <div className={styles.viewMatch_detailItem}>
          <i className="fas fa-ticket-alt"></i>
          <p><strong>Ticket Price:</strong> ${match.ticketPrice}</p>
        </div>
      </div>
      <h3 className={styles.viewMatch_seatsTitle}>Match Seats</h3>
      <div className={styles.viewMatch_seats}>
        {match.seats.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.viewMatch_row}>
            {row.map((seat) => (
              <div
                key={seat.number}
                className={`${styles.viewMatch_seat} ${
                  seat.isReserved ? styles.viewMatch_seat_reserved : styles.viewMatch_seat_vacant
                }`}
              >
                {seat.number}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewMatch;