//Chat GPT helped
//look over SQL and adjust
import { Request, Response, NextFunction } from 'express-serve-static-core';
import dbConnector from '../dbConnector';
import mysql from 'mysql';
import { JwtPayload } from 'jsonwebtoken';
//middleware tha handles user roles
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
//admin check needs to check event routes
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }//check user authorization

  // Ensure req.user is of type JwtPayload and contains roleId
  const user = req.user as JwtPayload;

  // Check if user.roleId exists
  if (!user || typeof user === 'string' || !user.roleId) {
    return res.status(403).json({ error: 'Forbidden: Role ID missing or invalid' });
  }
  const userRole = user.roleId;  // Assuming role is stored in the JWT token

  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
}
