//gpt helped
//refresh tokens for login/logout
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import redicClient from '../utils/redisClient';

export async function refreshAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Unauthorized, no refresh token provided' });
  }

  // Check if the refresh token is blacklisted
  const isBlacklisted = await redisClient.get(refreshToken);
  if (isBlacklisted) {
    return res.status(403).json({ error: 'Refresh token is blacklisted, please log in again' });
  }

  try {
      // Ensure JWT_REFRESH_SECRET is defined
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not defined in the environment variables');
    }
     // Verify the refresh token
      let decoded;
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      //Ensuring JWT_SECRET is defined
      const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }  // Access token expires in 1 hour
    );
   // Optionally blacklist the old refresh token (if rotating)
    await redisClient.set(refreshToken, 'blacklisted', {
      EX: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),  // Blacklist for 7 days
    });
    // Send the new access token in an HTTP-only cookie
    res.cookie('token', newAccessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    
    return res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
}
