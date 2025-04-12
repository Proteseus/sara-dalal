import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get comprehensive dashboard data
router.get('/', getDashboardData);

export default router; 