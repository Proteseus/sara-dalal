import express from 'express';
import { 
  initializeQuestions, 
  getQuestions, 
  submitResponses, 
  getUserResponses,
  getSkinProfile
} from '../controllers/questionnaireController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Admin route to initialize questions (protected)
router.post('/initialize', authenticateToken, initializeQuestions);

// Public route to get all questions
router.get('/questions', getQuestions);

// Protected routes for user responses
router.post('/responses', authenticateToken, submitResponses);
router.get('/responses', authenticateToken, getUserResponses);
router.get('/profile', authenticateToken, getSkinProfile);

export default router; 