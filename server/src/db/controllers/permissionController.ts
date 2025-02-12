// Chat GPT helped 
//used to handle permissions
import dbConnector from '../dbConnector';

// Check project-level permissions
export async function checkProjectPermissions(userId: number, projectId: number, permissionType: 'read' | 'write' | 'admin'): Promise<boolean> {
  const sql = `
    SELECT can_read, can_write, is_admin
    FROM Project_Permission
    WHERE user_id = ? AND project_id = ?
  `;
  
  const result = await dbConnector.runQuery(sql, [userId, projectId]);

  if (result.length === 0) {
    return false;  // No permissions found for the user
  }

  const permissions = result[0];

  // Check for the specific permission type
  switch (permissionType) {
    case 'read':
      return permissions.can_read || permissions.is_admin;
    case 'write':
      return permissions.can_write || permissions.is_admin;
    case 'admin':
      return permissions.is_admin;
    default:
      return false;
  }
}

// Check page-level permissions
export async function checkPagePermissions(userId: number, projectId: number, pageId: number, permissionType: 'read' | 'write'): Promise<boolean> {
  // First check project-level permissions
  const projectPermissions = await checkProjectPermissions(userId, projectId, permissionType);
  if (projectPermissions) {
    return true;  // If the user has project-wide permissions, allow access
  }

  // Check page-specific permissions
  const sql = `
    SELECT can_read, can_write
    FROM Project_Permission_Page pp
    JOIN Project_Permission p ON pp.project_permission_id = p.id
    WHERE p.user_id = ? AND pp.page_id = ?
  `;

  const result = await dbConnector.runQuery(sql, [userId, pageId]);

  if (result.length === 0) {
    return false;  // No page-specific permissions found
  }

  const permissions = result[0];

  switch (permissionType) {
    case 'read':
      return permissions.can_read;
    case 'write':
      return permissions.can_write;
    default:
      return false;
  }
}
