//Chat GPT helped 

import { logEvent } from '../controllers/eventController';
import { JwtPayload } from 'jsonwebtoken';
// Apply the logError middleware to log errors globally


//more generated 
//needs review 
//real time error logging
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { EventEmitter } from 'events';

// Create an event stream for real-time error tracking
const errorEventStream = new EventEmitter();

// Middleware to log errors and emit real-time error events via SSE
export function logError(err: Error, req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Cast req.user to JwtPayload and handle cases where req.user could be a string
  const user = req.user as JwtPayload;
  if (!user || typeof user === 'string' || !user.userId) {
    return res.status(401).json({ error: 'Invalid token or user not found' });
  }

  const userId = parseInt(user.userId as string, 10);  // Convert userId to a number

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  } // Default to system-level error if no user is logged in
  const errorLog = `Error: ${err.message} at ${req.method} ${req.url}`;

  logEvent(userId, 'SYSTEM_ERROR', errorLog).catch(console.error);  // Log the error to the database

  // Emit the error event to all connected SSE clients
  const errorEvent = { errorLog, timestamp: new Date().toISOString(), userId };
  errorEventStream.emit('new_error', errorEvent);

  // Respond with a generic error message
  res.status(500).json({ error: 'Internal Server Error' });
}

// SSE handler for streaming real-time error logs
export async function streamErrorLogsHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();  // Send headers to establish the SSE connection

  // Send the error log to the client via SSE
  const sendErrorLog = (errorLog: any) => {
    res.write(`data: ${JSON.stringify(errorLog)}\n\n`);
  };

  // Listen for new error events and send them to the client
  errorEventStream.on('new_error', sendErrorLog);

  // Clean up when the client disconnects
  req.on('close', () => {
    errorEventStream.removeListener('new_error', sendErrorLog);
    res.end();
  });
}
