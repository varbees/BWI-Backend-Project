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
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Routes for user authentication
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - profilePicture
 *             oneOf:
 *               - required: [email]
 *                 properties:
 *                   email:
 *                   type: string
 *               - required: [phoneNumber]
 *                 properties:
 *                   phoneNumber:
 *                     type: string
 *             properties:
 *               name:
 *                 type: string
 *                 example: dwaraka
 *               email:
 *                 type: string
 *                 example: dwaraka@email.com
 *               phoneNumber:
 *                 type: string
 *                 example: 0101010101
 *               password:
 *                 type: string
 *                 example: dwaraka
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: User's profile picture. Only image files (JPEG, PNG, GIF) are allowed.
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid User Data Or User already exists
 */
router.post('/register', upload.single('profilePicture'), registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login a user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - required: [email]
 *                 properties:
 *                   email:
 *                     type: string
 *               - required: [phoneNumber]
 *                 properties:
 *                   phoneNumber:
 *                     type: string
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', upload.none(), loginUser);

//private routes
/**
 * @swagger
 * tags:
 *   name: Private
 *   description: Routes for private user operations
 */

/**
 * @swagger
 * /api/users/profile:
 *  put:
 *    tags: [Private]
 *    summary: Update user profile
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              profilePicture:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: Profile updated
 *  get:
 *    tags: [Private]
 *    summary: Get user profile
 *    responses:
 *      200:
 *        description: Profile fetched
 *      404:
 *        description: User not found
 *  delete:
 *    tags: [Private]
 *    summary: Delete user profile
 *    responses:
 *      200:
 *        description: Profile deleted successfully
 *      401:
 *        description: Unauthorized
 *
 */
router
  .route('/profile')
  .put(protect, upload.single('profilePicture'), updateUserProfile)
  .get(protect, getUserProfile)
  .delete(protect, deleteUserProfile);

//admin routes
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Routes for admin operations
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users must be an Admin user
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Admin]
 *     summary: Register a new admin
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - profilePicture
 *             oneOf:
 *               - required: [email]
 *                 properties:
 *                   email:
 *                   type: string
 *               - required: [phoneNumber]
 *                 properties:
 *                   phoneNumber:
 *                     type: string
 *             properties:
 *               name:
 *                 type: string
 *                 example: phoenix
 *               email:
 *                 type: string
 *                 example: phoenix@email.com
 *               phoneNumber:
 *                 type: string
 *                 example: 0001000100
 *               password:
 *                 type: string
 *                 example: phoenix
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Admnin's profile picture. Only image files (JPEG, PNG, GIF) are allowed.
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Invalid Admin Data Or Admin already exists
 */
router
  .route('/')
  .get(protect, admin, getAllUsers)
  .post(protect, admin, upload.single('profilePicture'), registerAdmin);

/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *    tags: [Admin]
 *    summary: Update user by ID (Admin only)
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Enter id of the user
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              profilePicture:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: Profile updated
 *  get:
 *    tags: [Admin]
 *    summary: Get user by ID (Admin only)
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Enter id of the user
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Profile fetched
 *      404:
 *        description: User not found
 *  delete:
 *    tags: [Admin]
 *    summary: Delete user by ID (Admin only)
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Enter id of the user
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: deleted successfully
 *      401:
 *        description: Unauthorized
 *
 */
router
  .route('/:id')
  .get(protect, admin, getUser)
  .put(protect, admin, upload.single('profilePicture'), updateUser)
  .delete(protect, admin, deleteUser);

export default router;
