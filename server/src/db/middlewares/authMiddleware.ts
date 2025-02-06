//gpt generated 
// needs review
// checks if incoming requests contrain valid JWT 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user info to the request
    next();  // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
