
//Chat GPT helped 
//needs to be reviewed 
//sql is wrong but probably the closest to the right
import dbConnector from '../dbConnector';
import { Request, Response } from 'express-serve-static-core';
import { logError } from '../utils/logger';
import { EventEmitter } from 'events';
import { EventService } from '../Services/eventService';

// 2. Fetch event types
export async function getEventTypes(): Promise<any[]> {
  const sql = `SELECT id, name FROM Event_Type`;
  const result = await dbConnector.runQuery(sql);
  return result;
}

// 3. Fetch event logs based on user or event type
export async function getEventLogs(userId?: number, eventType?: string): Promise<any[]> {
  let sql = `SELECT e.id, e.occurred_time, e.event_log, et.name AS event_type, u.email AS user_email 
             FROM Event e
             JOIN Event_Type et ON e.event_type_id = et.id
             JOIN User u ON e.user_id = u.id`;

  const params: any[] = [];

  // Add filters for user or event type if provided
  if (userId) {
    sql += ` WHERE e.user_id = ?`;
    params.push(userId);
  }

  if (eventType) {
    sql += userId ? ` AND et.name = ?` : ` WHERE et.name = ?`;
    params.push(eventType);
  }

  const result = await dbConnector.runQuery(sql, params);
  return result;
}

//Chat Gpt helped
// Handler to get all event types
export async function getEventTypesHandler(req: Request, res: Response) {
  try {
    const eventTypes = await getEventTypes();
    return res.status(200).json(eventTypes);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching event types' });
  }
}

//GPT
//needs review
//adding Server Sent Event Stream Handler 

const eventStream = new EventEmitter();

// SSE handler for streaming event logs
export async function streamEventLogsHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();  // Send headers to establish the SSE connection

  const sendEventLog = (eventLog: any) => {
    res.write(`data: ${JSON.stringify(eventLog)}\n\n`);
  };

  // Attach listener to the event stream
  eventStream.on('new_event', sendEventLog);

  // Clean up when the connection is closed
  req.on('close', () => {
    eventStream.removeListener('new_event', sendEventLog);
    res.end();
  });
}

// Overwrite the logEvent function to emit events via SSE
export async function logEvent(userId: number, eventType: string, eventLog: string): Promise<void> {
  // Log the event in the database (as before)
  const eventTypeResult = await dbConnector.runQuery(
    `SELECT id FROM Event_Type WHERE name = ?`, 
    [eventType]
  );

  if (eventTypeResult.length === 0) {
    throw new Error(`Event type ${eventType} not found`);
  }

  const eventTypeId = eventTypeResult[0].id;

  const sql = `INSERT INTO Event (occurred_time, event_log, event_type_id, user_id) 
               VALUES (NOW(), ?, ?, ?)`;
  await dbConnector.runQuery(sql, [eventLog, eventTypeId, userId]);

  // Emit the event to the SSE clients
  const newEvent = { userId, eventType, eventLog, timestamp: new Date() };
  eventStream.emit('new_event', newEvent);
}
//GPT helped 
//advanced filtering, SQL is probably wrong

// Handler to fetch event logs (extended with time range filtering)
export async function getEventLogsHandler(req: Request, res: Response) {
  const { userId, eventType, startDate, endDate } = req.query;
  let sql = `SELECT e.id, e.occurred_time, e.event_log, et.name AS event_type, u.email AS user_email 
             FROM Event e
             JOIN Event_Type et ON e.event_type_id = et.id
             JOIN User u ON e.user_id = u.id`;

  const params: any[] = [];

  // Add filters for user, event type, and time range
  if (userId) {
    sql += ` WHERE e.user_id = ?`;
    params.push(userId);
  }

  if (eventType) {
    sql += userId ? ` AND et.name = ?` : ` WHERE et.name = ?`;
    params.push(eventType);
  }

  if (startDate && endDate) {
    sql += eventType || userId ? ` AND` : ` WHERE`;
    sql += ` e.occurred_time BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  try {
    const eventLogs = await dbConnector.runQuery(sql, params);
    return res.status(200).json(eventLogs);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching event logs' });
  }
}

//gpt
//used to get all events, and retrieve event by Id
export async function getAllEvents(req: Request, res: Response) {
  try {
    const events = await EventService.getAllEvents();
    if (!events || events.length === 0) {
      return res.status(404).json({ error: 'No events found' });
    }
    res.status(200).json(events);
  } catch (error) {
    logError(error);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
}

export async function getEventById(req: Request, res: Response) {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }
    const event = await EventService.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    logError(error);
    res.status(500).json({ error: 'Failed to retrieve event' });
  }
}

// Function to create a new event
export async function createEvent(req: Request, res: Response) {
  const { eventType, eventLog, userId } = req.body;

  if (!eventType || !eventLog || !userId) {
    return res.status(400).json({ error: 'Missing required fields: eventType, eventLog, or userId' });
  }

  try {
    // Find event type ID
    const eventTypeResult = await dbConnector.runQuery(`SELECT id FROM Event_Type WHERE name = ?`, [eventType]);

    if (eventTypeResult.length === 0) {
      return res.status(400).json({ error: `Event type ${eventType} not found` });
    }

    const eventTypeId = eventTypeResult[0].id;

    // Insert new event into the Event table
    const sql = `INSERT INTO Event (occurred_time, event_log, event_type_id, user_id) VALUES (NOW(), ?, ?, ?)`;
    await dbConnector.runQuery(sql, [eventLog, eventTypeId, userId]);

    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    logError(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
}

// Function to update an event by ID
export async function updateEvent(req: Request, res: Response) {
  const eventId = parseInt(req.params.id);
  const { eventLog, eventType } = req.body;

  if (isNaN(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    // Find the event type ID
    const eventTypeResult = await dbConnector.runQuery(`SELECT id FROM Event_Type WHERE name = ?`, [eventType]);

    if (eventTypeResult.length === 0) {
      return res.status(400).json({ error: `Event type ${eventType} not found` });
    }

    const eventTypeId = eventTypeResult[0].id;

    // Update the event
    const sql = `UPDATE Event SET event_log = ?, event_type_id = ? WHERE id = ?`;
    await dbConnector.runQuery(sql, [eventLog, eventTypeId, eventId]);

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    logError(error);
    res.status(500).json({ error: 'Failed to update event' });
  }
}

// Function to delete an event by ID
export async function deleteEvent(req: Request, res: Response) {
  const eventId = parseInt(req.params.id);

  if (isNaN(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    // Delete the event from the Event table
    const sql = `DELETE FROM Event WHERE id = ?`;
    await dbConnector.runQuery(sql, [eventId]);

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    logError(error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
}
