import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tickets';

// Helper function to get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getUserTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const reserveTicket = async (ticketData) => {
  try {
    const response = await axios.post(API_URL, ticketData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const response = await axios.delete(`${API_URL}/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};