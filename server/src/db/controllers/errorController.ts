//Chat GPT generated 
//needs review 

import { logEvent } from './eventController';

// Middleware to log errors
export function logError(err: Error, req: Request, res: Response, next: NextFunction) {
  const userId = req.user ? req.user.userId : 0;  // Default to system-level error if no user is logged in
  const errorLog = `Error: ${err.message} at ${req.method} ${req.url}`;

  logEvent(userId, 'SYSTEM_ERROR', errorLog).catch(console.error);  // Log the error to the event system

  res.status(500).json({ error: 'Internal Server Error' });
}
import { logError } from './controllers/errorController';

// Apply the logError middleware to log errors globally
app.use(logError);

//more generated 
//needs review 
//real time error logging
import { Request, Response, NextFunction } from 'express';
import { logEvent } from './eventController';
import { EventEmitter } from 'events';

// Create an event stream for real-time error tracking
const errorEventStream = new EventEmitter();

// Middleware to log errors and emit real-time error events via SSE
export function logError(err: Error, req: Request, res: Response, next: NextFunction) {
  const userId = req.user ? req.user.userId : 0;  // Default to system-level error if no user is logged in
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
