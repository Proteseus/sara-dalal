import express from 'express';
import {
  getQuestions, 
  submitResponses, 
  getUserResponses,
  getSkinProfile,
  getSkinProfileHistory,
  submitFeedback,
  getFeedbackQuestions
} from '../controllers/questionnaireController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route to get all questions
router.get('/questions', getQuestions);

// Protected routes for user responses
router.get('/feedback-questions', authenticateToken, getFeedbackQuestions);
router.post('/responses', authenticateToken, submitResponses);
router.get('/responses', authenticateToken, getUserResponses);
router.get('/profile', authenticateToken, getSkinProfile);
router.get('/profile/history', authenticateToken, getSkinProfileHistory);
router.post('/feedback', authenticateToken, submitFeedback);

export default router;