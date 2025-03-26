const express = require('express');
import { registerUser, loginUser, getUserDetails } from './authController';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/:id', getUserDetails);

export const authRouter = router; 
