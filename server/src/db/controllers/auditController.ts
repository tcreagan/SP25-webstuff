import { logEvent } from '../controllers/eventController';

// 9. Log personal data access
export async function logDataAccess(userId: number, action: string, dataAccessed: string): Promise<void> {
  const logMessage = `User ${userId} ${action} personal data: ${dataAccessed}`;
  await logEvent(userId, 'DATA_ACCESS', logMessage);
}
