import express from 'express';

import {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
} from '../controllers/userController.js';
import upload from '../middleware/uploadHandler.js';

const router = express.Router();

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', upload.none(), loginUser);

router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
