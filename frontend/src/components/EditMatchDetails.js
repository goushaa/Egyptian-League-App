import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getTeams } from '../services/teamService';
import { getStadiums } from '../services/stadiumService';
import { viewMatch, editMatch } from '../services/matchService';
import styles from '../css/EditMatchDetails.module.css';

function EditMatchDetails() {
  const { matchId } = useParams();
  const [teams, setTeams] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [matchDetails, setMatchDetails] = useState({
    homeTeam: '',
    awayTeam: '',
    venue: '',
    date: '', 
    mainReferee: '',
    firstLinesman: '',
    secondLinesman: '',
    ticketPrice: ''
  });
  const [message, setMessage] = useState('');

  const fetchTeams = useCallback(async () => {
    try {
      const response = await getTeams();
      setTeams(response);
    } catch (error) {
      console.log(error);
      
    }
  }, []);

  const fetchStadiums = useCallback(async () => {
    try {
      const response = await getStadiums();
      setStadiums(response);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchMatchDetails = useCallback(async () => {
    try {
      const response = await viewMatch(matchId);
      setMatchDetails({
        ...response,
        date: response.dateTime.split('T')[0] // Extract date part only
      });
    } catch (error) {
        console.log(error);
    }
  }, [matchId]);

  useEffect(() => {
    fetchTeams();
    fetchStadiums();
    fetchMatchDetails();
  }, [fetchTeams, fetchStadiums, fetchMatchDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatchDetails({ ...matchDetails, [name]: value });
  };

  const handleEditMatch = async (e) => {
    e.preventDefault();
    try {
      await editMatch(matchId, {
        ...matchDetails,
        dateTime: matchDetails.date // Use date for dateTime
      });
      setMessage('Match edited successfully!');
    } catch (error) {
      setMessage(error.msg);
    }
  };

  return (
    <div className={styles.editMatchDetails_container}>
      <h2 className={styles.editMatchDetails_h2}>Edit Match</h2>
      {message && <p className={styles.editMatchDetails_message}>{message}</p>}
      <form className={styles.editMatchDetails_form} onSubmit={handleEditMatch}>
        <label className={styles.editMatchDetails_label}>Home Team</label>
        <select name="homeTeam" value={matchDetails.homeTeam} onChange={handleChange} className={styles.editMatchDetails_input} required>
          <option value="">Select Home Team</option>
          {teams.map(team => (
            <option key={team._id} value={team.name}>{team.name}</option>
          ))}
        </select>
        <label className={styles.editMatchDetails_label}>Away Team</label>
        <select name="awayTeam" value={matchDetails.awayTeam} onChange={handleChange} className={styles.editMatchDetails_input} required>
          <option value="">Select Away Team</option>
          {teams.map(team => (
            <option key={team._id} value={team.name}>{team.name}</option>
          ))}
        </select>
        <label className={styles.editMatchDetails_label}>Venue</label>
        <select name="venue" value={matchDetails.venue} onChange={handleChange} className={styles.editMatchDetails_input} required>
          <option value="">Select Venue</option>
          {stadiums.map(stadium => (
            <option key={stadium._id} value={stadium.name}>{stadium.name}</option>
          ))}
        </select>
        <label className={styles.editMatchDetails_label}>Date</label>
        <input type="date" name="date" value={matchDetails.date} onChange={handleChange} className={styles.editMatchDetails_input} required />
        <label className={styles.editMatchDetails_label}>Main Referee</label>
        <input type="text" name="mainReferee" placeholder="Main Referee" value={matchDetails.mainReferee} onChange={handleChange} className={styles.editMatchDetails_input} required />
        <label className={styles.editMatchDetails_label}>First Linesman</label>
        <input type="text" name="firstLinesman" placeholder="First Linesman" value={matchDetails.firstLinesman} onChange={handleChange} className={styles.editMatchDetails_input} required />
        <label className={styles.editMatchDetails_label}>Second Linesman</label>
        <input type="text" name="secondLinesman" placeholder="Second Linesman" value={matchDetails.secondLinesman} onChange={handleChange} className={styles.editMatchDetails_input} required />
        <label className={styles.editMatchDetails_label}>Ticket Price</label>
        <input type="number" name="ticketPrice" placeholder="Ticket Price" value={matchDetails.ticketPrice} onChange={handleChange} className={styles.editMatchDetails_input} required />
        <button type="submit" className={styles.editMatchDetails_button}>Edit Match</button>
      </form>
    </div>
  );
}

export default EditMatchDetails;