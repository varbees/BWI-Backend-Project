import express from 'express';

import {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authHandler.js';
import upload from '../middleware/uploadHandler.js';

const router = express.Router();

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', upload.none(), loginUser);

router.route('/').get(protect, admin, getAllUsers);
router.route('/:id').get(protect, admin, getUserById);

export default router;
