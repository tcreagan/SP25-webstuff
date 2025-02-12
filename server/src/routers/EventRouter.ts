import express, { Router } from "express"
import DBConnector from "../db/dbConnector"
import { table } from "console";
import { Models } from "../db/initConnection";

/**
 * Defines the router which handles requests going to /api/Events
 * 
 * Created By: Chris Morgan
 */


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


  router.patch("/:id", (req, res) => {
     try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }

      let record = await Event.find(id);

      if (!record) {
        return res.sendStatus(404);
      }

      // Update the record with fields from req.body
      Object.assign(record, req.body);
      await record.save();

      res.json(record.columns);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  })

  router.delete("/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }

      let record = await Event.find(id);

      if (!record) {
        return res.sendStatus(404);
      }

      await record.destroy();
      res.sendStatus(204);  // 204 No Content on successful deletion
      } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  })

  return router
}

export default buildRouter;
