//gpt helped
//used to create authentication API for login and register
import { Router } from 'express';
import { registerUserHandler, loginUserHandler } from '../controllers/authController';
import { authenticateJWT } from './middlewares/authMiddleware';
import { getUserProfile } from './controllers/userController';

const router = Router();

// Route to register a new user
router.post('/register', registerUserHandler);

// Route to log in a user
router.post('/login', loginUserHandler);

// Example of a protected route (user profile)
router.get('/profile', authenticateJWT, getUserProfile);

export default router;
