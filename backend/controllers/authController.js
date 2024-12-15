const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Function to create a JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// Login controller
const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await userModel.login(userName, password);
    const token = createToken(user._id);
    const { _id, role } = user;

    return res.status(200).json({ _id, userName, token, role });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Signup controller
const signup = async (req, res) => {
  const {
    userName,
    password,
    firstName,
    lastName,
    birthDate,
    gender,
    city,
    address,
    emailAddress,
    role
  } = req.body;

  try {
    const user = await userModel.signup(
      userName,
      password,
      firstName,
      lastName,
      birthDate,
      gender,
      city,
      address,
      emailAddress,
      role
    );
    const { _id } = user;

    return res.status(200).json({ _id, userName, role });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { login, signup };
