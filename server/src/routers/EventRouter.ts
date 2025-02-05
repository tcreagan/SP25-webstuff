import express, { Router } from "express"
import DBConnector from "../db/dbConnector"
import { table } from "console";
import { Models } from "../db/initConnection";

/**
 * Defines the router which handles requests going to /api/Events
 * 
 * Created By: Chris Morgan
 */
//first main change

const buildRouter = (con: DBConnector): Router => {
  const router = express.Router()

  let Event = Models.Event

  /**
   * Get Events index
   */
  router.get("/", async (req, res) => {
    let records = await Event.findAll()

    if(!records || records.length === 0){
      res.sendStatus(404);
    }

    res.json(records.map(r => r.columns))
    res.sendStatus(200)
  })

  /**
   * Get Event details
   */
  router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = await Event.find(id)

    if(!record){
      res.sendStatus(404)
    }

    res.json(record.columns)
    res.sendStatus(200)
  })

  /**
   * Create new Event
   */
  router.put("/new", async (req, res) => {
    let record = await Event.create(req.body)

    record.save()

    res.json(record.columns)
    res.sendStatus(200)
  })


  /**
   * Routes not used for the time being
   */

  // router.patch("/:id", (req, res) => {

  // })

  // router.delete("/:id", (req, res) => {

  // })

  return router
}

export default buildRouter;
