//gpt helped
const express = require('express');  // CommonJS import style
import { getUserPersonalDataHandler, deleteUserPersonalDataHandler, exportUserPersonalDataHandler } from '../db/controllers/gdprController';
import { recordUserConsentHandler } from '../db/controllers/consentController';
import { authenticateJWT } from '../db/controllers/authController';

const router = express.Router();

// Route to request user's personal data
router.get('/personal-data', authenticateJWT, getUserPersonalDataHandler);

// Route to delete user's personal data
router.delete('/personal-data', authenticateJWT, deleteUserPersonalDataHandler);

// Route to export user's personal data
router.get('/personal-data/export', authenticateJWT, exportUserPersonalDataHandler);

// Route to record user consent
router.post('/consent', authenticateJWT, recordUserConsentHandler);

export default router;
