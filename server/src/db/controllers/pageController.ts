//Chat GPT helped
//sql is wrong
//handles page logic
import dbConnector from '../dbConnector';
import { Request, Response } from 'express-serve-static-core'; //added serve static core import 

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

//Chat GPT generated 
//needs to be reviewed
// Handler for creating a new page
export async function createPageHandler(req: Request, res: Response) {
  const projectId = parseInt(req.params.projectId);
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Page content is required' });
  }

  try {
    const pageId = await createPage(projectId, content);
    return res.status(201).json({ message: 'Page created', pageId });
  } catch (error) {
    return res.status(500).json({ error: 'Error creating page' });
  }
}

// Handler for fetching all pages in a project
export async function getPagesHandler(req: Request, res: Response) {
  const projectId = parseInt(req.params.projectId);

  try {
    const pages = await getPagesForProject(projectId);
    return res.status(200).json(pages);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching pages' });
  }
}

// Handler for fetching a specific page's details
export async function getPageDetailsHandler(req: Request, res: Response) {
  const pageId = parseInt(req.params.pageId);

  try {
    const page = await getPageDetails(pageId);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    return res.status(200).json(page);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching page details' });
  }
}

// Handler for updating a page's content
export async function updatePageHandler(req: Request, res: Response) {
  const pageId = parseInt(req.params.pageId);
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Page content is required' });
  }

  try {
    await updatePageContent(pageId, content);
    return res.status(200).json({ message: 'Page updated' });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating page' });
  }
}

// Handler for deleting a page
export async function deletePageHandler(req: Request, res: Response) {
  const pageId = parseInt(req.params.pageId);

  try {
    await deletePage(pageId);
    return res.status(200).json({ message: 'Page deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting page' });
  }
}
