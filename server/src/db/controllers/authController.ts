//Chat GPT generated code 
//for the login/logout implementation, might be out of scope
//needs to be reviewed still
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnector from '../dbConnector';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // Store secret key in .env

// 1. Register a new user
export async function registerUser(email: string, password: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password with salt rounds
  const sql = `INSERT INTO User (email, password_hash) VALUES (?, ?)`;
  await dbConnector.runQuery(sql, [email, hashedPassword]);
}

// 2. Login and generate JWT token
export async function loginUser(email: string, password: string): Promise<string> {
  const sql = `SELECT id, password_hash FROM User WHERE email = ?`;
  const result = await dbConnector.runQuery(sql, [email]);

  if (result.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result[0];

  // Compare the hashed password with the input password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

  return token;  // Return the JWT token
}

// 3. Middleware to protect routes (JWT verification)
export function authenticateJWT(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

//Chat GPT generated 
//needs to be reviewed
import { Request, Response } from 'express';
import { registerUser, loginUser } from './authController';

// Handler to register a new user
export async function registerUserHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    await registerUser(email, password);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error registering user' });
  }
}

// Handler to log in a user and generate a JWT token
export async function loginUserHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const token = await loginUser(email, password);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
}
