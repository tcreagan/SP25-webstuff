//Chat GPT generated 
//needs to be reviewed
//sql is wrong
import dbConnector from '../dbConnector';

// 1. Create a new page
export async function createPage(projectId: number, content: string): Promise<number> {
  const sql = `INSERT INTO Page (project_id, content) VALUES (?, ?)`;
  const result = await dbConnector.runQuery(sql, [projectId, content]);
  return result.insertId; // Return the new page ID
}

// 2. Fetch all pages for a project
export async function getPagesForProject(projectId: number): Promise<any[]> {
  const sql = `SELECT id, content, created_at FROM Page WHERE project_id = ?`;
  const result = await dbConnector.runQuery(sql, [projectId]);
  return result;
}

// 3. Fetch details of a specific page
export async function getPageDetails(pageId: number): Promise<any> {
  const sql = `SELECT id, content, created_at FROM Page WHERE id = ?`;
  const result = await dbConnector.runQuery(sql, [pageId]);
  return result[0]; // Return the first matching result (the page details)
}

// 4. Update page content
export async function updatePageContent(pageId: number, content: string): Promise<void> {
  const sql = `UPDATE Page SET content = ? WHERE id = ?`;
  await dbConnector.runQuery(sql, [content, pageId]);
}

// 5. Delete a page
export async function deletePage(pageId: number): Promise<void> {
  const sql = `DELETE FROM Page WHERE id = ?`;
  await dbConnector.runQuery(sql, [pageId]);
}

// 6. Set permissions for a page
export async function setPagePermissions(projectPermissionId: number, pageId: number, canRead: boolean, canWrite: boolean): Promise<void> {
  const sql = `
    INSERT INTO Project_Permission_Page (project_permission_id, page_id, can_read, can_write)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE can_read = ?, can_write = ?
  `;
  await dbConnector.runQuery(sql, [projectPermissionId, pageId, canRead, canWrite, canRead, canWrite]);
}
