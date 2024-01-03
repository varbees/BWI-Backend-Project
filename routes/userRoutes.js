import express from 'express';

import {
  getAllUsers,
  getUser,
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  updateUser,
  deleteUser,
  deleteUserProfile,
  registerAdmin,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authHandler.js';
import upload from '../middleware/uploadHandler.js';

const router = express.Router();
//public routes
router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', upload.none(), loginUser);
//private routes
router
  .route('/profile')
  .put(protect, upload.single('profilePicture'), updateUserProfile)
  .get(protect, getUserProfile)
  .delete(protect, deleteUserProfile);
//admin routes
router
  .route('/')
  .get(protect, admin, getAllUsers)
  .post(protect, admin, upload.single('profilePicture'), registerAdmin);
router
  .route('/:id')
  .get(protect, admin, getUser)
  .put(protect, admin, upload.single('profilePicture'), updateUser)
  .delete(protect, admin, deleteUser);

export default router;
