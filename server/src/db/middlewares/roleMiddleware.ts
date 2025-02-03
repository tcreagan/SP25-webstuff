//Chat GPT generated
//look over SQL and adjust
import { Request, Response, NextFunction } from 'express';
import dbConnector from '../dbConnector';

export function requireRole(requiredRole: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;

    const sql = `
      SELECT r.name
      FROM User_Role ur
      JOIN Role r ON ur.role_id = r.id
      WHERE ur.user_id = ? AND r.name = ?;
    `;
    const result = await dbConnector.runQuery(mysql.format(sql, [userId, requiredRole]));

    if (result.length > 0) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  };
}
