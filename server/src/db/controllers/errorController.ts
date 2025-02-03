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
