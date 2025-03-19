//gpt helped
//refresh tokens for login/logout
import { Request, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted, addTokenToBlacklist } from '../utils/tokenBlacklist';

export async function refreshAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Unauthorized, no refresh token provided' });
  }

  // Check if the refresh token is blacklisted
  if (isTokenBlacklisted(refreshToken)) {
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
      { userId: (decoded as any).userId }, // Assuming the token has a userId field
      JWT_SECRET, 
      { expiresIn: '1h' }  // Access token expires in 1 hour
    );
    
    // Blacklist the old refresh token
    addTokenToBlacklist(refreshToken, 7 * 24 * 60 * 60 * 1000); // 7 days

    // Send the new access token in an HTTP-only cookie
    res.cookie('token', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    
    return res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
}
