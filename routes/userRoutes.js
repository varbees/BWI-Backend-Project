import express from 'express';
import multer from 'multer';

import {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
} from '../controllers/userController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    cb(null, true);
  },
});

router.post('/register', upload.single('profilePicture'), registerUser);
router.get('/login', loginUser);

router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
