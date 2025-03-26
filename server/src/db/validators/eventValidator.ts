//gpt generated 
//needs review
import { Request, Response, NextFunction } from 'express-serve-static-core';
import Joi from 'joi';

// Joi schema to validate event data
const eventSchema = Joi.object({
  event_log: Joi.string().min(3).required(),
  event_type_id: Joi.number().required(),
  user_id: Joi.number().required(),
});

// Middleware to validate event data before creation or update
export function validateEvent(req: Request, res: Response, next: NextFunction) {
  const { error } = eventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

// Validate event ID
export function validateEventId(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }
  next();
}
