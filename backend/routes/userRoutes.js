// routes/userRoutes.js

import express from 'express';
import { getUsers, registerUser, loginUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/', protect, getUsers); // Optional: get all users (e.g., admin use)

export default router;
 