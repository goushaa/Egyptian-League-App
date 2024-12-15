import axios from 'axios';

// API base URLs
const SIGNUP_API_URL = 'http://localhost:3000/api/auth/signup';
const LOGIN_API_URL = 'http://localhost:3000/api/auth/login';

export const signUp = async (userData) => {
  try {
    const response = await axios.post(SIGNUP_API_URL, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(LOGIN_API_URL, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Something went wrong';
  }
};
