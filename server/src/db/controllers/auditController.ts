// 9. Log personal data access
export async function logDataAccess(userId: number, action: string, dataAccessed: string): Promise<void> {
  const logMessage = `User ${userId} ${action} personal data: ${dataAccessed}`;
  await logEvent(userId, 'DATA_ACCESS', logMessage);
}

// Example: Integrating data access logging into the getUserPersonalDataHandler
export async function getUserPersonalDataHandler(req: Request, res: Response) {
  const userId = req.user.userId;

  try {
    const personalData = await getUserPersonalData(userId);

    // Log that the user accessed their personal data
    await logDataAccess(userId, 'viewed', 'personal data');

    return res.status(200).json(personalData);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving personal data' });
  }
}
