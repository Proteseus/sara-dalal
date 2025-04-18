import express from 'express';
import {
  getQuestions, 
  submitResponses, 
  getUserResponses,
  getSkinProfile
} from '../controllers/questionnaireController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route to get all questions
router.get('/questions', getQuestions);

// Protected routes for user responses
router.post('/responses', authenticateToken, submitResponses);
router.get('/responses', authenticateToken, getUserResponses);
router.get('/profile', authenticateToken, getSkinProfile);

export default router;