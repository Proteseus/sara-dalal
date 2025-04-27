import express from 'express';
import {
  createRoutine,
  getUserRoutines,
  getUserRoutine,
  updateRoutine,
  deleteRoutine,
  toggleRoutineStatus
} from '../controllers/routineController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new routine
router.post('/', createRoutine);

// Get all routines for the authenticated user
router.get('/', getUserRoutines);

// Get a routine for the authenticated user
router.get('/:id', getUserRoutine);

// Update a routine
router.put('/:id', updateRoutine);

// Delete a routine
router.delete('/:id', deleteRoutine);

// Toggle routine active status
router.patch('/:id/toggle', toggleRoutineStatus);

export default router; 