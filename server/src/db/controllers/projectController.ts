import dbConnector from '../dbConnector';
//Chat GPT generated 
//fix SQL because it is not exactly right, there are more parameters
//result also need to be double checked
// 1. Create a new project
export async function createProject(ownerId: number, projectName: string): Promise<number> {
  const sql = `INSERT INTO Project (owner_id, project_name) VALUES (?, ?)`; //fix
  const result = await dbConnector.runQuery(sql, [ownerId, projectName]);
  return result.insertId; // Return new project ID
}

// 2. Assign permissions to a project
export async function assignProjectPermissions(projectId: number, defaultRead: boolean, defaultWrite: boolean, admin: boolean): Promise<void> {
  const sql = `INSERT INTO Project_Permission (project_id, default_read_new, default_write_new, admin) 
               VALUES (?, ?, ?, ?)`; //fix
  await dbConnector.runQuery(sql, [projectId, defaultRead, defaultWrite, admin]);
}

// 3. Add a page to a project
export async function createPage(projectId: number, content: string): Promise<number> {
  const sql = `INSERT INTO Page (project_id, content) VALUES (?, ?)`; //fix
  const result = await dbConnector.runQuery(sql, [projectId, content]);
  return result.insertId; // Return new page ID
}

// 4. Set page-specific permissions
export async function setPagePermissions(projectPermissionId: number, pageId: number, canRead: boolean, canWrite: boolean): Promise<void> {
  const sql = `INSERT INTO Project_Permission_Page (project_permission_id, page_id, can_read, can_write)
               VALUES (?, ?, ?, ?)`; //fix
  await dbConnector.runQuery(sql, [projectPermissionId, pageId, canRead, canWrite]);
}

// 5. Fetch project details
export async function getProjectDetails(projectId: number): Promise<any> {
  const sql = `
    SELECT p.project_name, p.created_at, u.email AS owner_email
    FROM Project p
    JOIN User u ON p.owner_id = u.id
    WHERE p.id = ?;
  `; //fix
  const result = await dbConnector.runQuery(sql, [projectId]);
  return result[0]; // Return the first record (project details)
}
//Chat GPT code generated 
//code is generalized API route connections are probably slightly different
import { Request, Response } from 'express';
import { createProject, assignProjectPermissions, createPage, getProjectDetails } from './projectController';

// Handler for creating a new project
export async function createProjectHandler(req: Request, res: Response) {
  const { projectName, defaultRead, defaultWrite, admin } = req.body;
  const ownerId = parseInt(req.params.userId);  // Assuming userId is passed in URL params

  if (!projectName) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  try {
    const projectId = await createProject(ownerId, projectName);

    // Assign default project permissions (for owner/admin)
    await assignProjectPermissions(projectId, defaultRead, defaultWrite, admin);

    return res.status(201).json({ message: 'Project created', projectId });
  } catch (error) {
    return res.status(500).json({ error: 'Error creating project' });
  }
}

// Handler for adding a page to a project
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

// Handler for fetching project details
export async function getProjectDetailsHandler(req: Request, res: Response) {
  const projectId = parseInt(req.params.projectId);

  try {
    const project = await getProjectDetails(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching project details' });
  }
}
