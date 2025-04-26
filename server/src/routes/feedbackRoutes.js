import express from 'express';
import {
  submitProductFeedback,
  submitRoutineFeedback,
  getRoutineFeedback,
  getProductFeedback
} from '../controllers/feedbackController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes for feedback
router.post('/product', authenticateToken, submitProductFeedback);
router.post('/routine', authenticateToken, submitRoutineFeedback);
router.get('/routine/:routineId', authenticateToken, getRoutineFeedback);
router.get('/product/:productId', authenticateToken, getProductFeedback);

export default router; 