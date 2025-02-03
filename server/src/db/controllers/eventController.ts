//Chat GPT generated 
//needs to be reviewed 
//sql is wrong but probably the closest to the right
import dbConnector from '../dbConnector';
import ( Request, Response } from 'express';
import { getEventTypes, getEventLogs } from './eventController';

// 1. Log an event
export async function logEvent(userId: number, eventType: string, eventLog: string): Promise<void> {
  // Get the event type ID based on the eventType name
  const eventTypeResult = await dbConnector.runQuery(
    `SELECT id FROM Event_Type WHERE name = ?`, 
    [eventType]
  );

  if (eventTypeResult.length === 0) {
    throw new Error(`Event type ${eventType} not found`);
  }

  const eventTypeId = eventTypeResult[0].id;

  // Insert the event into the Event table
  const sql = `INSERT INTO Event (occurred_time, event_log, event_type_id, user_id) 
               VALUES (NOW(), ?, ?, ?)`;
  await dbConnector.runQuery(sql, [eventLog, eventTypeId, userId]);
}

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

//Chat Gpt generated 
//needs review 

// Handler to get all event types
export async function getEventTypesHandler(req: Request, res: Response) {
  try {
    const eventTypes = await getEventTypes();
    return res.status(200).json(eventTypes);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching event types' });
  }
}

// Handler to fetch event logs (filtered by user or event type)
export async function getEventLogsHandler(req: Request, res: Response) {
  const { userId, eventType } = req.query;

  try {
    const eventLogs = await getEventLogs(
      userId ? parseInt(userId as string) : undefined,
      eventType as string
    );
    return res.status(200).json(eventLogs);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching event logs' });
  }
}
