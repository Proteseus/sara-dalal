import { PrismaClient } from '@prisma/client';
import { sendRoutineReminder } from '../utils/notifications.js';

const prisma = new PrismaClient();

/**
 * Create a new skincare routine
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createRoutine = async (req, res) => {
  try {
    const { name, steps, isActive = true } = req.body;
    const userId = req.user.id;

    const routine = await prisma.routine.create({
      data: {
        name,
        isActive,
        userId,
        steps: {
          create: steps.map(step => ({
            productId: step.productId,
            order: step.order,
            time: step.time,
            notes: step.notes
          }))
        }
      },
      include: {
        steps: {
          include: {
            product: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: routine
    });
  } catch (error) {
    console.error('Error creating routine:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create routine'
    });
  }
};

/**
 * Get all routines for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserRoutines = async (req, res) => {
  try {
    const userId = req.user.id;

    const routines = await prisma.routine.findMany({
      where: { userId },
      include: {
        steps: {
          include: {
            product: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: routines
    });
  } catch (error) {
    console.error('Error fetching routines:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch routines'
    });
  }
};

/**
 * Update a routine
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, steps, isActive } = req.body;
    const userId = req.user.id;

    // Verify routine ownership
    const existingRoutine = await prisma.routine.findFirst({
      where: { id, userId }
    });

    if (!existingRoutine) {
      return res.status(404).json({
        success: false,
        error: 'Routine not found'
      });
    }

    const routine = await prisma.routine.update({
      where: { id },
      data: {
        name,
        isActive,
        steps: {
          deleteMany: {},
          create: steps.map(step => ({
            productId: step.productId,
            order: step.order,
            time: step.time,
            notes: step.notes
          }))
        }
      },
      include: {
        steps: {
          include: {
            product: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: routine
    });
  } catch (error) {
    console.error('Error updating routine:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update routine'
    });
  }
};

/**
 * Delete a routine
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify routine ownership
    const routine = await prisma.routine.findFirst({
      where: { id, userId }
    });

    if (!routine) {
      return res.status(404).json({
        success: false,
        error: 'Routine not found'
      });
    }

    await prisma.routine.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Routine deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting routine:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete routine'
    });
  }
};

/**
 * Toggle routine active status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const toggleRoutineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify routine ownership
    const routine = await prisma.routine.findFirst({
      where: { id, userId }
    });

    if (!routine) {
      return res.status(404).json({
        success: false,
        error: 'Routine not found'
      });
    }

    const updatedRoutine = await prisma.routine.update({
      where: { id },
      data: {
        isActive: !routine.isActive
      }
    });

    res.status(200).json({
      success: true,
      data: updatedRoutine
    });
  } catch (error) {
    console.error('Error toggling routine status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle routine status'
    });
  }
}; 