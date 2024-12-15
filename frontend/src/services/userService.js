import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

// Helper function to get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const getUnauthorizedUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/unauthorized`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const approveUser = async (userId) => {
  try {
    const response = await axios.patch(`${API_URL}/approve/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const editUser = async (userData) => {
  try {
    const response = await axios.patch(API_URL, userData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};