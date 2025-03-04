const express = require('express');  // Import express to initialize the router
import { registerUserHandler, loginUserHandler } from '../db/controllers/authController';

// Initialize the router
const router = express.Router();

// Route to register a new user
router.post('/register', registerUserHandler);

// Route to log in a user
router.post('/login', loginUserHandler);

export default router;
