import User from '../models/userModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Singup user and TODO: get token
// @route   POST /api/users/login
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password, profilePicture } = req.body;

  const query = {};
  if (email) query.email = email;
  if (phoneNumber) query.phoneNumber = phoneNumber;

  const userExists = await User.findOne(query);

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    phoneNumber,
    password,
    profilePicture,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user and TODO: get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  const query = {};
  if (email) {
    query.email = email;
  } else {
    query.phoneNumber = phoneNumber;
  }
  const user = await User.findOne(query);
  if (user && user.matchPassword(password)) {
    // TODO: Generate Token Here
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error(`Invalid email/phone number or password`);
  }
});

// @desc    Get All Users
// @route   GET /api/users/
// @access  Public For now later move to only admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (users.length > 0) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error(`Error getting users`);
  }
});

// @desc    Get User By Id
// @route   GET /api/users/:id
// @access  Public For now later move to only admin
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error(`User not found`);
  }
});

export { registerUser, loginUser, getAllUsers, getUserById };
