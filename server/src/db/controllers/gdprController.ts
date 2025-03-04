//chat gpt helped
import dbConnector from '../dbConnector';
import { Request, Response } from 'express-serve-static-core';
import { JwtPayload } from 'jsonwebtoken'; //added imports
//for data access
// 1. Retrieve all personal data for a specific user
export async function getUserPersonalData(userId: number): Promise<any> {
  const userSql = `SELECT email FROM User WHERE id = ?`;
  const userData = await dbConnector.runQuery(userSql, [userId]);

  const eventSql = `SELECT event_log FROM Event WHERE user_id = ?`;
  const eventData = await dbConnector.runQuery(eventSql, [userId]);

  return { userData, eventData };
}

// 2. Handler for users to request their personal data
export async function getUserPersonalDataHandler(req: Request, res: Response) {
  
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  } //check if user is authorized 

  // Cast req.user to JwtPayload and handle cases where req.user could be a string
  const user = req.user as JwtPayload;
  if (!user || typeof user === 'string' || !user.userId) {
    return res.status(401).json({ error: 'Invalid token or user not found' });
  }

  const userId = parseInt(user.userId as string, 10);  // Convert userId to a number

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  } //checking userID
  try {
    const personalData = await getUserPersonalData(userId);
    return res.status(200).json(personalData);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving personal data' });
  }
}

//for data deletion 
// 3. Delete a user's personal data (Right to be Forgotten)
export async function deleteUserPersonalData(userId: number): Promise<void> {
  // Delete user data from the User table
  const userSql = `DELETE FROM User WHERE id = ?`;
  await dbConnector.runQuery(userSql, [userId]);

  // Delete user's event logs
  const eventSql = `DELETE FROM Event WHERE user_id = ?`;
  await dbConnector.runQuery(eventSql, [userId]);
}

// 4. Handler for users to request deletion of their personal data
export async function deleteUserPersonalDataHandler(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }//check user authorization

  // Cast req.user to JwtPayload and handle cases where req.user could be a string
  const user = req.user as JwtPayload;
  if (!user || typeof user === 'string' || !user.userId) {
    return res.status(401).json({ error: 'Invalid token or user not found' });
  }//user token check

  const userId = parseInt(user.userId as string, 10);  // Convert userId to a number

  try {
    await deleteUserPersonalData(userId);
    return res.status(200).json({ message: 'Personal data deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting personal data' });
  }
}

//for data export
import { parse } from 'json2csv';  // To generate CSV files

// 5. Export user's personal data in CSV format
export async function exportUserPersonalData(userId: number, format: 'json' | 'csv'): Promise<any> {
  const personalData = await getUserPersonalData(userId);

  if (format === 'csv') {
    const csv = parse(personalData);
    return csv;
  }

  return personalData;  // Default to JSON format
}

// 6. Handler for users to export their personal data
export async function exportUserPersonalDataHandler(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }//check authorization

  // Cast req.user to JwtPayload and handle cases where req.user could be a string
  const user = req.user as JwtPayload;
  if (!user || typeof user === 'string' || !user.userId) {
    return res.status(401).json({ error: 'Invalid token or user not found' });
  }//check token

  const userId = parseInt(user.userId as string, 10);  // Convert userId to a number

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }//check userID
  const format = req.query.format === 'csv' ? 'csv' : 'json';

  try {
    const data = await exportUserPersonalData(userId, format);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment;filename=personal_data.csv');
      return res.status(200).send(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error exporting personal data' });
  }
}
