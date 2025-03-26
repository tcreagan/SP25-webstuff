// src/express.d.ts
import { JwtPayload } from 'jsonwebtoken'; // Used to handle user payload

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;  // Add your user property here
    }
  }
}
