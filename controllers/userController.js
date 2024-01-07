import User from '../models/userModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import generateImageURL from '../utils/generateImageURL.js';
import validationHandler from '../middleware/validationHandler.js';

// @desc    Singup user
// @route   POST /api/users/login
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  let profilePicture;
  if (req.file) {
    profilePicture = req.file.path;
  }
  validationHandler(res, { email, phoneNumber });

  const query = {};
  if (email) query.email = email;
  if (phoneNumber) query.phoneNumber = phoneNumber;

  let userExists;
  userExists = query.email && (await User.findOne({ email: query.email }));
  if (!userExists)
    userExists =
      query.phoneNumber &&
      (await User.findOne({ phoneNumber: query.phoneNumber }));

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
    generateToken(res, user._id);
    user.profilePicture = generateImageURL(req, user.profilePicture);
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

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  const query = {};
  if (email !== undefined && email !== null) {
    query.email = { $eq: email, $ne: null };
  } else {
    query.phoneNumber = { $eq: phoneNumber, $ne: null };
  }
  const user = await User.findOne(query);
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    user.profilePicture = generateImageURL(req, user.profilePicture);
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
    throw new Error(`Invalid email/phone or password`);
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.profilePicture = generateImageURL(req, user.profilePicture);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      profilePicture: user.profilePicture,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error(`User not found`);
  }
});

// @desc    update name and profilePicture
// @route   UPDATE /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    if (req.file) {
      user.profilePicture = req.file.path || user.profilePicture;
    }
  }
  const updatedUser = await user.save();
  updatedUser.profilePicture = generateImageURL(
    req,
    updatedUser.profilePicture
  );
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    profilePicture: updatedUser.profilePicture,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber,
    isAdmin: updatedUser.isAdmin,
  });
});

// @desc    delete user profile
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    await user.deleteOne();
    res.clearCookie('jwt');
    res.status(200).json({ message: `user: ${user._id} deleted successfully` });
  }
});

// @desc    Create admin account
// @route   POST /api/users/
// @access  Private/Admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  let profilePicture;
  if (req.file) {
    profilePicture = req.file.path;
  }
  validationHandler(res, { email, phoneNumber });
  const query = {};
  if (email) query.email = email;
  if (phoneNumber) query.phoneNumber = phoneNumber;

  let userExists;
  userExists = query.email && (await User.findOne({ email: query.email }));
  if (!userExists)
    userExists =
      query.phoneNumber &&
      (await User.findOne({ phoneNumber: query.phoneNumber }));

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
    isAdmin: true,
  });
  if (user) {
    user.profilePicture = generateImageURL(req, user.profilePicture);
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

// @desc    Get All Users
// @route   GET /api/users/
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (users.length > 0) {
    users.map(user => {
      user.profilePicture = generateImageURL(req, user.profilePicture);
    });
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error(`Error getting users`);
  }
});

// @desc    Get User By Id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    user.profilePicture = generateImageURL(req, user.profilePicture);
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error(`User not found`);
  }
});

// @desc    Update a user by id
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.isAdmin = req.body.isAdmin || user.isAdmin;
    if (user.email === 'admin@email.com') {
      user.isAdmin = true;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.file) {
      user.profilePicture = req.file.path || user.profilePicture;
    }

    const updatedUser = await user.save();
    updatedUser.profilePicture = generateImageURL(
      req,
      updatedUser.profilePicture
    );
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      profilePicture: updatedUser.profilePicture,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error(`User not found`);
  }
});

// @desc    Delete a user by id
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.status(200).json({
      message: `user: ${user._id} deleted successfully`,
    });
  } else {
    res.status(404);
    throw new Error(`User does not exist`);
  }
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  registerAdmin,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
