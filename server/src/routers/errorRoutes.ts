//gpt helped 

const express = require('express');  // CommonJS import style
import { streamErrorLogsHandler } from '../db/controllers/errorController';
import { authenticateJWT } from '../db/controllers/authController';  // Ensure only authenticated users can access

const router = express.Router();

// Route to stream real-time error logs (SSE)
router.get('/stream', authenticateJWT, streamErrorLogsHandler);

export default router;
