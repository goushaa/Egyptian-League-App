const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 50,
    lowercase: true,
    required: [true, "Please tell us your username!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15,
    lowercase: true,
  },
  address: {
    type: String,
    default: "",
  },
  emailAddress: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["manager", "fan", "admin"],
    required: true,
  },
  isPending: {
    type: Boolean,
    default: true,
    required: true,
  },
  createdIn: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Signup
userSchema.statics.signup = async function(
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
) {
  if (
    !userName ||
    !password ||
    !firstName ||
    !lastName ||
    !birthDate ||
    !gender ||
    !city ||
    !emailAddress ||
    !role
  ) {
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(emailAddress)) {
    throw new Error("Email is not valid");
  }

  const userExists = await this.findOne({ userName });
  if (userExists) {
    throw new Error("This username already exists!");
  }

  const emailExists = await this.findOne({ emailAddress });
  if (emailExists) {
    throw new Error("This email already exists!");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password.toString(), salt);

  const user = await this.create({
    userName,
    password: hash,
    firstName,
    lastName,
    birthDate,
    gender,
    city,
    address,
    emailAddress,
    role,
  });

  return user;
};

// Login
userSchema.statics.login = async function(userName, password) {
  if (!userName || !password) {
    throw new Error("All fields are required");
  }

  const user = await this.findOne({ userName });
  if (!user) {
    throw new Error("Incorrect username!");
  }

  if (user.role !== "admin" && user.isPending) {
    throw new Error(
      "You can't login now, you aren't authorized by the admin yet!"
    );
  }

  const match = await bcrypt.compare(password.toString(), user.password);
  if (!match) {
    throw new Error("Incorrect password!");
  }

  return user;
};

// Get User
userSchema.statics.getUser = async function(_id) {
  const user = await this.findOne({ _id });
  if (!user) {
    throw new Error("No user found!");
  }

  return user;
};

// Edit User
userSchema.statics.editUser = async function(_id, body) {
  const user = await this.findOneAndUpdate({ _id }, body, { new: true });
  if (!user) {
    throw new Error("No user found to be updated!");
  }

  return user;
};

// Delete User
userSchema.statics.deleteUser = async function(_id) {
  const user = await this.deleteOne({ _id });
  if (!user) {
    throw new Error("No user found to be deleted!");
  }

  return user;
};

// Get Unauthorized Users
userSchema.statics.getUnauthorizedUsers = async function() {
  const rolesToFind = ["manager", "fan"];
  const users = await this.find({
    isPending: true,
    role: { $in: rolesToFind },
  });
  if (!users) {
    throw new Error("No pending users found!");
  }

  return users;
};

// Approve User
userSchema.statics.approveUser = async function(_id) {
  const user = await this.findOneAndUpdate(
    { _id },
    { isPending: false },
    { new: true }
  );
  if (!user) {
    throw new Error("No user found!");
  }

  return user;
};

// Get All Users
userSchema.statics.getAllUsers = async function() {
  const rolesToFind = ["manager", "fan"];
  const users = await this.find({ role: { $in: rolesToFind } });
  if (!users) {
    throw new Error("No users found!");
  }

  return users;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
