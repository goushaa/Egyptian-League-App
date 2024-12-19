import axios from 'axios';

const TEAMS_API_URL = 'http://localhost:3000/api/teams';

export const getTeams = async () => {
  try {
    const response = await axios.get(TEAMS_API_URL);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const getTeamLogo = async (teamName) => {
  try {
    const response = await axios.get(`${TEAMS_API_URL}/logo/${teamName}`);
    return response.data.teamImageURL;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};