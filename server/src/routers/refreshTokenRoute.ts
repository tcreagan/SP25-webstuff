//gpt generated 
// needs review 
// generates new access token and verifies 
//client sends to server and is validated
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export async function refreshAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate a new access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the new access token in an HTTP-only cookie
    res.cookie('token', newAccessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

    return res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
}
