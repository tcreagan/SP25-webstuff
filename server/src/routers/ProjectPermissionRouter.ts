const express = require('express');  // CommonJS import style
import DBConnector from "../db/dbConnector"
import { Models } from "../db/initConnection"
import { Request, Response } from 'express-serve-static-core'

/**
 * Defines the router which handles requests going to /api/ProjectPermissions
 * 
 * Created By: Chris Morgan
 */


const router = express.Router()
const ProjectPermission = Models.ProjectPermission

/**
 * Get ProjectPermissions index
 */
router.get("/", async (req: Request, res: Response) => {
  let records = await ProjectPermission.findAll()

  if (!records || records.length === 0) {
    res.sendStatus(404);
  }

  res.json(records.map(r => r.columns))
  res.sendStatus(200)
})

/**
 * Get ProjectPermission details
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  let record = await ProjectPermission.find(id)

  if (!record) {
    res.sendStatus(404)
  }

  res.json(record.columns)
  res.sendStatus(200)
})

/**
 * Create new ProjectPermission
 */
router.put("/new", async (req: Request, res: Response) => {
  let record = ProjectPermission.create(req.body)

  await record.save()

  res.json(record.columns)
  res.sendStatus(200)
})


/**
 * Update ProjectPermission with given ID
 */
router.patch("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  let record = ProjectPermission.create(req.body)

  if (record.columns.id !== id) {
    res.sendStatus(400)
  }

  await record.save()

  res.sendStatus(200)
})

/**
 * Delete ProjectPermission with given ID
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  let record = await ProjectPermission.find(id)
  if (!record) {
    res.sendStatus(404)
  }

  record.delete()
  res.sendStatus(200)
})

export default router
