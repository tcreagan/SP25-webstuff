//chat gpt generated 
//needs review 
import dbConnector from '../dbConnector';
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
  const userId = req.user.userId;

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
  const userId = req.user.userId;

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
  const userId = req.user.userId;
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
