import axios from 'axios';

const STADIUMS_API_URL = 'http://localhost:3000/api/stadiums';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getStadiums = async () => {
  try {
    const response = await axios.get(STADIUMS_API_URL);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const createStadium = async (stadiumData) => {
  try {
    const response = await axios.post(STADIUMS_API_URL, stadiumData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};