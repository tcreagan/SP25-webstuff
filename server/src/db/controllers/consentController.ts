import dbConnector from "../dbConnector";
import { Request, Response } from 'express-serve-static-core'
import { JwtPayload } from "jsonwebtoken";

//GPT helped
// 7. Store user's consent for data processing
export async function recordUserConsent(userId: number, consentGiven: boolean): Promise<void> {
  const sql = `UPDATE User SET consent_given = ? WHERE id = ?`;
  await dbConnector.runQuery(sql, [consentGiven, userId]);
}

// 8. Handler for users to provide or withdraw consent
export async function recordUserConsentHandler(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Cast req.user to JwtPayload and handle cases where req.user could be a string
  const user = req.user as JwtPayload;
  if (!user || typeof user === 'string' || !user.userId) {
    return res.status(401).json({ error: 'Invalid token or user not found' });
  }

  const userId = parseInt(user.userId as string, 10);  // Convert userId to a number

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const consentGiven = req.body.consentGiven === true;

  try {
    await recordUserConsent(userId, consentGiven);
    return res.status(200).json({ message: 'Consent updated' });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating consent' });
  }
}
