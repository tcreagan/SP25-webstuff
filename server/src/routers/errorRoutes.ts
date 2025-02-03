//Chat gpt generated 
//needs review 
import { Router } from 'express';
import { streamErrorLogsHandler } from '../controllers/errorController';
import { authenticateJWT } from '../controllers/authController';  // Ensure only authenticated users can access

const router = Router();

// Route to stream real-time error logs (SSE)
router.get('/stream', authenticateJWT, streamErrorLogsHandler);

export default router;
