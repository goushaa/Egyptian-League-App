import axios from 'axios';

const MATCHES_API_URL = 'http://localhost:3000/api/matches';

// Helper function to get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const createMatch = async (matchData) => {
  try {
    const response = await axios.post(MATCHES_API_URL, matchData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const editMatch = async (matchId, matchData) => {
  try {
    const response = await axios.put(`${MATCHES_API_URL}/${matchId}`, matchData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const viewMatch = async (matchId) => {
  try {
    const response = await axios.get(`${MATCHES_API_URL}/${matchId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const viewMatches = async () => {
  try {
    const response = await axios.get(MATCHES_API_URL, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

// Add the missing getMatches function
export const getMatches = async () => {
  try {
    const response = await axios.get(MATCHES_API_URL);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};