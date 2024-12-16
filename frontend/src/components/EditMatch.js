import React, { useEffect, useState } from 'react';
import { getTeams } from '../services/teamService';
import { createMatch, editMatch, viewMatch, viewMatches } from '../services/matchService';
import styles from '../css/EditMatch.module.css';

function EditMatch() {
  const [teams, setTeams] = useState([]);
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

  useEffect(() => {
    fetchTeams();
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

  const handleEditMatch = async (matchId) => {
    try {
      await editMatch(matchId, matchDetails);
      setMessage('Match edited successfully!');
      fetchMatches();
    } catch (error) {
      setMessage(error.error);
    }
  };

  const handleViewMatch = async (matchId) => {
    try {
      const response = await viewMatch(matchId);
      setMatchDetails(response);
    } catch (error) {
      setMessage(error.error);
    }
  };

  return (
    <div className={styles.editMatch_container}>
      <h2 className={styles.editMatch_h2}>Manage Matches</h2>
      {message && <p className={styles.editMatch_message}>{message}</p>}
      <form className={styles.editMatch_form} onSubmit={handleCreateMatch}>
        <select name="homeTeam" value={matchDetails.homeTeam} onChange={handleChange} className={styles.editMatch_input} required>
          <option value="">Select Home Team</option>
          {teams.map(team => (
            <option key={team._id} value={team.name}>{team.name}</option>
          ))}
        </select>
        <select name="awayTeam" value={matchDetails.awayTeam} onChange={handleChange} className={styles.editMatch_input} required>
          <option value="">Select Away Team</option>
          {teams.map(team => (
            <option key={team._id} value={team.name}>{team.name}</option>
          ))}
        </select>
        <input type="text" name="venue" placeholder="Venue" value={matchDetails.venue} onChange={handleChange} className={styles.editMatch_input} required />
        <input type="datetime-local" name="dateTime" value={matchDetails.dateTime} onChange={handleChange} className={styles.editMatch_input} required />
        <input type="text" name="mainReferee" placeholder="Main Referee" value={matchDetails.mainReferee} onChange={handleChange} className={styles.editMatch_input} required />
        <input type="text" name="firstLinesman" placeholder="First Linesman" value={matchDetails.firstLinesman} onChange={handleChange} className={styles.editMatch_input} required />
        <input type="text" name="secondLinesman" placeholder="Second Linesman" value={matchDetails.secondLinesman} onChange={handleChange} className={styles.editMatch_input} required />
        <input type="number" name="ticketPrice" placeholder="Ticket Price" value={matchDetails.ticketPrice} onChange={handleChange} className={styles.editMatch_input} required />
        <button type="submit" className={styles.editMatch_button}>Create Match</button>
      </form>
      <div className={styles.editMatch_section}>
        <h3 className={styles.editMatch_h3}>Existing Matches</h3>
        <ul className={styles.editMatch_ul}>
          {matches.map(match => (
            <li key={match._id} className={styles.editMatch_matchItem}>
              {match.homeTeam} vs {match.awayTeam} - {new Date(match.dateTime).toLocaleDateString()}
              <button onClick={() => handleViewMatch(match._id)} className={styles.editMatch_button}>View</button>
              <button onClick={() => handleEditMatch(match._id)} className={styles.editMatch_button}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EditMatch;