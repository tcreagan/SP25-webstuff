import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnector from '../dbConnector';
import { logEvent } from './eventController';
import { Request, Response } from 'express-serve-static-core';
import { assignUserRole } from '../controllers/userController'
//added imports and interfaces

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // Store secret key in .env

// Define interfaces for request body
interface AuthRequestBody {
  email: string;
  password: string;
}

// Define interfaces for role assignment
interface RoleAssignmentRequestBody {
  roleId: number;
}

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
export function authenticateJWT(req: Request, res: Response, next: any) { //changed req and res from any
  const authHeader = Array.isArray(req.headers['authorization']) 
    ? req.headers['authorization'][0] 
    : req.headers['authorization']; //fixed header for authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
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
