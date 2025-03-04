const express = require('express');  // CommonJS import style
import DBConnector from "../db/dbConnector"
import { Models } from "../db/initConnection"
import { Request, Response } from 'express-serve-static-core'

/**
 * Defines the router which handles requests going to /api/Widgets
 * 
 * Created By: Chris Morgan
 */
const router = express.Router()

const Widget = Models.Widget

/**
 * Get Widgets index
 */
router.get("/", async (req: Request, res: Response) => {
  let records = await Widget.findAll()

  if (!records || records.length === 0) {
    res.sendStatus(404);
  }

  res.json(records.map(r => r.columns))
  res.sendStatus(200)
})

/**
 * Get Widget details
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  let record = await Widget.find(id)

  if (!record) {
    res.sendStatus(404)
  }

  res.json(record.columns)
  res.sendStatus(200)
})

/**
 * Create new Widget
 */
router.put("/new", async (req: Request, res: Response) => {
  let record = Widget.create(req.body)

  await record.save()

  res.json(record.columns)
  res.sendStatus(200)
})


/**
 * Update Page Layout with given ID
 */
router.patch("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  let record = Widget.create(req.body)

  if (record.columns.id !== id) {
    res.sendStatus(400)
  }

  await record.save()

  res.sendStatus(200)

})

/**
 * Delete Widget with given ID
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  let record = await Widget.find(id)
  if (!record) {
    res.sendStatus(404)
  }

  record.delete()
  res.sendStatus(200)
})

router;

export default router;
