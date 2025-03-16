//gpt helped
// checks if incoming requests contain valid web token for user sessions 

import { Request, Response, NextFunction } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../utils/tokenBlacklist';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if token is blacklisted
  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ error: 'Token is invalidated, please log in again' });
  }
  
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  } //created to fix direct .env error

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach user info to request
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Session expired, please log in again' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
}
