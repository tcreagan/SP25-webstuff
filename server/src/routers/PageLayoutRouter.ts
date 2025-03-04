const express = require('express');  // CommonJS import style
import DBConnector from "../db/dbConnector"
import { Models } from "../db/initConnection"
import { Request, Response } from 'express-serve-static-core'

/**
 * Defines the router which handles requests going to /api/PageLayouts
 * 
 * Created By: Chris Morgan
 * Last Edited By: Chris Morgan
 * Last Edited: 2/6/2024
 */

  const router = express.Router()
  const PageLayout = Models.PageLayout

  /**
   * Get PageLayouts index
   */
  router.get("/", async (req: Request, res: Response) => {
    let records = await PageLayout.findAll()

    if(!records || records.length === 0){
      res.sendStatus(404);
    }

    res.json(records.map(r => r.columns))
    res.sendStatus(200)
  })

  /**
   * Get PageLayout details
   */
  router.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    let record = await PageLayout.find(id)

    if(!record){
      res.sendStatus(404)
    }

    res.json(record.columns)
    res.sendStatus(200)
  })

  /**
   * Create new PageLayout
   */
  router.put("/new", async (req: Request, res: Response) => {
    let record = await PageLayout.create(req.body)

    record.save()

    res.json(record.columns)
    res.sendStatus(200)
  })


  /**
   * Update Page Layout with given ID
   */
  router.patch("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    let record = await PageLayout.create(req.body)

    if(record.columns.id !== id){
      res.sendStatus(400)
    }

    record.save()

    res.sendStatus(200)
  })

  /**
   * Delete Page Layout with given ID
   */
  router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    let record = await PageLayout.find(id)
    if(!record){
      res.sendStatus(404)
    }

    record.delete()
    res.sendStatus(200)
  })

export default router;
