import express, { Router } from "express"
import DBConnector from "../db/dbConnector"
import { Models } from "../db/initConnection"

/**
 * Defines the router which handles requests going to /api/Projects
 * 
 * Created By: Chris Morgan
 */


  const router = express.Router()

  const Project = Models.Project

  /**
   * Get Projects index
   */
  router.get("/", async (req, res) => {
    let records = await Project.findAll()

    if(!records || records.length === 0){
      res.sendStatus(404);
    }

    res.json(records.map(r => r.columns))
    res.sendStatus(200)
  })

  /**
   * Get Project details
   */
  router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = await Project.find(id)

    if(!record){
      res.sendStatus(404)
    }

    res.json(record.columns)
    res.sendStatus(200)
  })

  /**
   * Create new Project
   */
  router.put("/new", async (req, res) => {
    let record = await Project.create(req.body)

    record.save()

    res.json(record.columns)
    res.sendStatus(200)
  })


  /**
   * Update Page Layout with given ID
   */
  router.patch("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = Project.create(req.body)

    if(record.columns.id !== id){
      res.sendStatus(400)
    }

    await record.save()

    res.sendStatus(200)
  })

  /**
   * Delete Project with given ID
   */
  router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = await Project.find(id)
    if(!record){
      res.sendStatus(404)
    }

    record.delete()
    res.sendStatus(200)
  })
//gpt generated
//used to authenticate user login
// Route to create a new project (authenticated users only)
router.post('/', authenticateJWT, requireProjectPermission('write'), createProjectHandler);

// Route to add a page to a project (authenticated users only)
router.post('/:projectId/pages', authenticateJWT, requireProjectPermission('write'), createPageHandler);

// Route to fetch project details (authenticated users only)
router.get('/:projectId', authenticateJWT, requireProjectPermission('read'), getProjectDetailsHandler);

export default router;
