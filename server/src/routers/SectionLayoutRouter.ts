import express, { Router } from "express"
import DBConnector from "../db/dbConnector";
import { Models } from "../db/initConnection";

/**
 * Defines the router which handles requests going to /api/SectionLayouts
 * 
 * Created By: Chris Morgan
 */

  const router = express.Router()


  const SectionLayout = Models.SectionLayout

  /**
   * Get SectionLayouts index
   */
  router.get("/", async (req, res) => {
    let records = await SectionLayout.findAll()

    if (!records || records.length === 0) {
      res.sendStatus(404);
    }
  
    res.json(records.map(r => r.columns))
    res.sendStatus(200)
  })

  /**
   * Get SectionLayout details
   */
  router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = await SectionLayout.find(id)
  
    if (!record) {
      res.sendStatus(404)
    }
  
    res.json(record.columns)
    res.sendStatus(200)
  })

  /**
   * Create new SectionLayout
   */
  router.put("/new", async (req, res) => {
    let record = await SectionLayout.create(req.body)

    record.save()
  
    res.json(record.columns)
    res.sendStatus(200)
  })


  /**
   * Update Page Layout with given ID
   */
  router.patch("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = SectionLayout.create(req.body)
  
    if (record.columns.id !== id) {
      res.sendStatus(400)
    }
  
    await record.save()
  
    res.sendStatus(200)
  })

  /**
   * Delete SectionLayout with given ID
   */
  router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = await SectionLayout.find(id)
    if (!record) {
      res.sendStatus(404)
    }
  
    record.delete()
    res.sendStatus(200)
  })

export default router;