import express from 'express';
import {
  getProgressReport,
  getProgressSummary
} from '../controllers/progressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get progress report comparing responses between two dates
router.get('/report', getProgressReport);

// Get monthly progress summary
router.get('/summary', getProgressSummary);

export default router; 