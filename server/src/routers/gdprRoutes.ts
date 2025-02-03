//gpt generated 
//needs review
import { Router } from 'express';
import { getUserPersonalDataHandler, deleteUserPersonalDataHandler, exportUserPersonalDataHandler } from '../controllers/gdprController';
import { recordUserConsentHandler } from '../controllers/consentController';
import { authenticateJWT } from '../controllers/authController';

const router = Router();

// Route to request user's personal data
router.get('/personal-data', authenticateJWT, getUserPersonalDataHandler);

// Route to delete user's personal data
router.delete('/personal-data', authenticateJWT, deleteUserPersonalDataHandler);

// Route to export user's personal data
router.get('/personal-data/export', authenticateJWT, exportUserPersonalDataHandler);

// Route to record user consent
router.post('/consent', authenticateJWT, recordUserConsentHandler);

export default router;
