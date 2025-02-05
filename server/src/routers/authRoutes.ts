//gpt generated 
//needs review
//used to create authentication API for login and register
import { Router } from 'express';
import { registerUserHandler, loginUserHandler } from '../controllers/authController';

const router = Router();

// Route to register a new user
router.post('/register', registerUserHandler);

// Route to log in a user
router.post('/login', loginUserHandler);

export default router;
