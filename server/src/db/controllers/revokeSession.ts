import { Request, Response } from 'express-serve-static-core';
import { Session } from '../models/Session';  // Session model

export async function revokeSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;

    // Find the session and delete it
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await session.delete();
    return res.status(200).json({ message: 'Session revoked' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while revoking the session' });
  }
}
