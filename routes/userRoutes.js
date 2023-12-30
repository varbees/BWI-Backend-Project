import express from 'express';
import {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/login', loginUser);

router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
