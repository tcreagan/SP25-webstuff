import dbConnector from '../dbConnector';
import { logEvent } from './eventController';
import { JwtPayload } from 'jsonwebtoken'; //added webtoken import
//Chat GPT helped
//fix SQL because it is not exactly right, there are more parameters
//used for handling project logic
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
  `; 
  const result = await dbConnector.runQuery(sql, [projectId]);
  return result[0]; // Return the first record (project details)
}
//Chat GPT code generated 
//code is generalized API route connections are probably slightly different
import { Request, Response } from 'express-serve-static-core'; // imported static core

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
//Chat GPT generated 

// Handler for creating a new project (extended to log the event)
export async function createProjectHandler(req: Request, res: Response) {
  const { projectName } = req.body;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Cast req.user to JwtPayload and handle cases where req.user could be a string
  const user = req.user as JwtPayload;
  if (!user || typeof user === 'string' || !user.userId) {
    return res.status(401).json({ error: 'Invalid token or user not found' });
  }

  const ownerId = parseInt(user.userId as string, 10);  // Convert userId to a number

  if (isNaN(ownerId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  } // User ID from JWT payload

  if (!projectName) {
    return res.status(400).json({ error: 'Project name is required' });
  }//check for project name


  try {
    const projectId = await createProject(ownerId, projectName);

    // Log the event (PROJECT_CREATED)
    await logEvent(ownerId, 'PROJECT_CREATED', `User ${ownerId} created project ${projectName}`);

    return res.status(201).json({ message: 'Project created', projectId });
  } catch (error) {
    return res.status(500).json({ error: 'Error creating project' });
  }
}
