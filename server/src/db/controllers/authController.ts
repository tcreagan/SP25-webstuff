import bcrypt from 'bcryptjs';
import jwt, { JwtPayload }  from 'jsonwebtoken';
import dbConnector from '../dbConnector';
import { logEvent } from './eventController';
import { Request, Response } from 'express-serve-static-core';
import { assignUserRole } from '../controllers/userController'
import { isTokenBlacklisted, addTokenToBlacklist } from '../utils/tokenBlacklist';
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
export const authenticateJWT = async (req: Request, res: Response, next: Function) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ error: 'Token has been invalidated' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    // Add tokens to blacklist
    if (token) {
      addTokenToBlacklist(token, 24 * 60 * 60 * 1000); // 24 hours
    }
    if (refreshToken) {
      addTokenToBlacklist(refreshToken, 7 * 24 * 60 * 60 * 1000); // 7 days
    }

    // Clear cookies
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Error during logout' });
  }
};

// 1. Log when a user registers
export async function registerUserHandler(req: Request, res: Response) {
  const { email, password } = req.body as AuthRequestBody;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    await registerUser(email, password);
    await logEvent(0, 'USER_REGISTERED', `User registered with email ${email}`);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error registering user' });
  }
}

// 2. Log when a user logs in
export async function loginUserHandler(req: Request, res: Response) {
  const { email, password } = req.body as AuthRequestBody;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }



  try {
    const token = await loginUser(email, password);
    const user = req.user as JwtPayload;
  if (!user || typeof user === 'string') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = user.userId;
    await logEvent(userId, 'USER_LOGGED_IN', `User ${userId} logged in`);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
}

// 3. Log when a role is assigned to a user
export async function assignUserRoleHandler(req: Request, res: Response) {
  const { roleId } = req.body as RoleAssignmentRequestBody;
  const userId = parseInt(req.params.userId);

  try {
    await assignUserRole(userId, roleId);
    await logEvent(userId, 'USER_ROLE_ASSIGNED', `Role ID ${roleId} assigned to user ID ${userId}`);
    return res.status(200).json({ message: 'Role assigned' });
  } catch (error) {
    return res.status(500).json({ error: 'Error assigning role' });
  }
}
