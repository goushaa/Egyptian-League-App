import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeams } from '../services/teamService';
import { getStadiums } from '../services/stadiumService';
import { createMatch, viewMatches } from '../services/matchService';
import styles from '../css/EditMatch.module.css';

function EditMatch() {
  const [teams, setTeams] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchDetails, setMatchDetails] = useState({
    homeTeam: '',
    awayTeam: '',
    venue: '',
    dateTime: '',
    mainReferee: '',
    firstLinesman: '',
    secondLinesman: '',
    ticketPrice: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
    fetchStadiums();
    fetchMatches();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await getTeams();
      setTeams(response);
    } catch (error) {
      setMessage(error.error);
    }
  };

  const fetchStadiums = async () => {
    try {
      const response = await getStadiums();
      setStadiums(response);
    } catch (error) {
      setMessage(error.error);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await viewMatches();
      setMatches(response.matches);
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatchDetails({ ...matchDetails, [name]: value });
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    try {
      await createMatch(matchDetails);
      setMessage('Match created successfully!');
      fetchMatches();
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleEditMatch = (matchId) => {
    navigate(`/edit-match/${matchId}`);
  };

  return (
    <div className={styles.editMatch_container}>
      <div className={styles.editMatch_left}>
        <h2 className={styles.editMatch_h2}>Create Match</h2>
        {message && <p className={styles.editMatch_message}>{message}</p>}
        <form className={styles.editMatch_form} onSubmit={handleCreateMatch}>
          <label className={styles.editMatch_label}>Home Team</label>
          <select name="homeTeam" value={matchDetails.homeTeam} onChange={handleChange} className={styles.editMatch_input} required>
            <option value="">Select Home Team</option>
            {teams.map(team => (
              <option key={team._id} value={team.name}>{team.name}</option>
            ))}
          </select>
          <label className={styles.editMatch_label}>Away Team</label>
          <select name="awayTeam" value={matchDetails.awayTeam} onChange={handleChange} className={styles.editMatch_input} required>
            <option value="">Select Away Team</option>
            {teams.map(team => (
              <option key={team._id} value={team.name}>{team.name}</option>
            ))}
          </select>
          <label className={styles.editMatch_label}>Venue</label>
          <select name="venue" value={matchDetails.venue} onChange={handleChange} className={styles.editMatch_input} required>
            <option value="">Select Venue</option>
            {stadiums.map(stadium => (
              <option key={stadium._id} value={stadium.name}>{stadium.name}</option>
            ))}
          </select>
          <label className={styles.editMatch_label}>Date and Time</label>
          <input type="datetime-local" name="dateTime" value={matchDetails.dateTime} onChange={handleChange} className={styles.editMatch_input} required />
          <label className={styles.editMatch_label}>Main Referee</label>
          <input type="text" name="mainReferee" placeholder="Main Referee" value={matchDetails.mainReferee} onChange={handleChange} className={styles.editMatch_input} required />
          <label className={styles.editMatch_label}>First Linesman</label>
          <input type="text" name="firstLinesman" placeholder="First Linesman" value={matchDetails.firstLinesman} onChange={handleChange} className={styles.editMatch_input} required />
          <label className={styles.editMatch_label}>Second Linesman</label>
          <input type="text" name="secondLinesman" placeholder="Second Linesman" value={matchDetails.secondLinesman} onChange={handleChange} className={styles.editMatch_input} required />
          <label className={styles.editMatch_label}>Ticket Price</label>
          <input type="number" name="ticketPrice" placeholder="Ticket Price" value={matchDetails.ticketPrice} onChange={handleChange} className={styles.editMatch_input} required />
          <button type="submit" className={styles.editMatch_button}>Create Match</button>
        </form>
      </div>
      <div className={styles.editMatch_right}>
        <h3 className={styles.editMatch_h3}>Existing Matches</h3>
        <ul className={styles.editMatch_ul}>
          {matches.map(match => (
            <li key={match._id} className={styles.editMatch_matchItem}>
              {match.homeTeam} vs {match.awayTeam} - {new Date(match.dateTime).toLocaleDateString()}
              <button onClick={() => handleEditMatch(match._id)} className={styles.editMatch_button}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EditMatch;