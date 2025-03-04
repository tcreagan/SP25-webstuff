import { Request, Response, Router } from "express-serve-static-core"
import DBConnector from "../db/dbConnector"
import { table } from "console";
import { Models } from "../db/initConnection";
import { getEventLogs, getEventById, createEvent, updateEvent, deleteEvent } from '../db/controllers/eventController';
import { validateEvent, validateEventId } from '../db/validators/eventValidator';  // Assuming validation functions
const express = require('express');  // CommonJS import style
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
  router.get("/", async (req: Request, res: Response) => {
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
  router.get("/:id", async (req: Request, res: Response) => {
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
  router.put("/new", async (req: Request, res: Response) => {
    let record = await Event.create(req.body)

    record.save()

    res.json(record.columns)
    res.sendStatus(200)
  })


  router.patch("/:id", async (req: Request, res: Response) => {
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

  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }

      let record = await Event.find(id);

      if (!record) {
        return res.sendStatus(404);
      }

      await record.delete();
      res.sendStatus(204);  // 204 No Content on successful deletion
      } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  })

  



/**
 * GET /api/Events - Get all events
 */
router.get('/', getEventLogs);

/**
 * GET /api/Events/:id - Get an event by ID
 */
router.get('/:id', validateEventId, getEventById);

/**
 * PUT /api/Events/new - Create a new event
 */
router.put('/new', validateEvent, createEvent);

/**
 * PATCH /api/Events/:id - Update an event
 */
router.patch('/:id', validateEventId, validateEvent, updateEvent);

/**
 * DELETE /api/Events/:id - Delete an event
 */
router.delete('/:id', validateEventId, deleteEvent);
  return router
}

export default buildRouter;
