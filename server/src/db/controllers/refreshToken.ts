//gpt generated 
//needs review
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function refreshAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Unauthorized, no refresh token provided' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }  // Access token expires in 1 hour
    );

    // Send the new access token in an HTTP-only cookie
    res.cookie('token', newAccessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

    return res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
}
