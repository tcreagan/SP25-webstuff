//Chat GPT helped
//middleware for enforcing project and page permissions
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { checkProjectPermissions, checkPagePermissions } from '../controllers/permissionController';

// Middleware to enforce project-level permissions
export function requireProjectPermission(permissionType: 'read' | 'write' | 'admin') {
  return async function (req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.userId);  // Assuming userId is passed in URL params
    const projectId = parseInt(req.params.projectId);

    const hasPermission = await checkProjectPermissions(userId, projectId, permissionType);

    if (hasPermission) {
      next();  // Permission granted
    } else {
      return res.status(403).json({ error: 'Access denied: insufficient project permissions' });
    }
  };
}

// Middleware to enforce page-level permissions
export function requirePagePermission(permissionType: 'read' | 'write') {
  return async function (req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.userId);  // Assuming userId is passed in URL params
    const projectId = parseInt(req.params.projectId);
    const pageId = parseInt(req.params.pageId);

    const hasPermission = await checkPagePermissions(userId, projectId, pageId, permissionType);

    if (hasPermission) {
      next();  // Permission granted
    } else {
      return res.status(403).json({ error: 'Access denied: insufficient page permissions' });
    }
  };
}
