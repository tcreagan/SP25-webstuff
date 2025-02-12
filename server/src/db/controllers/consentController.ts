//GPT helped
// 7. Store user's consent for data processing
export async function recordUserConsent(userId: number, consentGiven: boolean): Promise<void> {
  const sql = `UPDATE User SET consent_given = ? WHERE id = ?`;
  await dbConnector.runQuery(sql, [consentGiven, userId]);
}

// 8. Handler for users to provide or withdraw consent
export async function recordUserConsentHandler(req: Request, res: Response) {
  const userId = req.user.userId;
  const consentGiven = req.body.consentGiven === true;

  try {
    await recordUserConsent(userId, consentGiven);
    return res.status(200).json({ message: 'Consent updated' });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating consent' });
  }
}
