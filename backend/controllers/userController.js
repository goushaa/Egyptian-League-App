const userModel = require('../models/userModel');

// Get a user by ID
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUser(id);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userModel.deleteUser(id);
    return res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Edit a user by ID
const editUser = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  try {
    const user = await userModel.editUser(id, userData);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get all unauthorized users
const unauthorizedUsers = async (req, res) => {
  try {
    const users = await userModel.getUnauthorizedUsers();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Approve a user by ID
const approveUser = async (req, res) => {
  const { id } = req.params;
  if (req.user.role != "admin") {
    return res.status(400).json({ error: 'Unauthorized access' });
  }
  try {
    const user = await userModel.approveUser(id);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  deleteUser,
  editUser,
  unauthorizedUsers,
  approveUser,
  getAllUsers,
};
