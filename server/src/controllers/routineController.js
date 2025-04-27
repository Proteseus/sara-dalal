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

    const routine = await prisma.userRoutine.create({
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

    const routines = await prisma.userRoutine.findMany({
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
 * Get a routine for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const i = parseInt(id);

    const routine = await prisma.userRoutine.findUnique({
      where: { id: i, userId },
      include: {
        steps: {
          include: {
            product: {
              include: {
                category: true
              }
            },
            alternatives: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: routine
    });
  } catch (error) {
    console.error('Error fetching routine:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch routine'
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

    const i = parseInt(id);

    // Verify routine ownership
    const existingRoutine = await prisma.userRoutine.findFirst({
      where: { id: i, userId }
    });

    if (!existingRoutine) {
      return res.status(404).json({
        success: false,
        error: 'Routine not found'
      });
    }

    const routine = await prisma.userRoutine.update({
      where: { id: i },
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

    const i = parseInt(id);

    // Verify routine ownership
    const routine = await prisma.userRoutine.findFirst({
      where: { id: i, userId }
    });

    if (!routine) {
      return res.status(404).json({
        success: false,
        error: 'Routine not found'
      });
    }

    // First delete all steps associated with the routine
    await prisma.routineStep.deleteMany({
      where: { routineId: i }
    });

    // Then delete the routine
    await prisma.userRoutine.delete({
      where: { id: i }
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

    const i = parseInt(id);

    // Verify routine ownership
    const routine = await prisma.userRoutine.findFirst({
      where: { id: i, userId }
    });

    if (!routine) {
      return res.status(404).json({
        success: false,
        error: 'Routine not found'
      });
    }

    const updatedRoutine = await prisma.userRoutine.update({
      where: { id: i },
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


/**
 * Pick default product for a step
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const pickDefaultProduct = async (req, res) => {
  try {
    const { stepId } = req.params;
    const { defaultProductId } = req.body;
    const userId = req.user.id;

    // Verify the step belongs to a routine owned by the user
    const step = await prisma.routineStep.findFirst({
      where: {
        id: parseInt(stepId),
        routine: {
          userId: userId
        }
      },
      include: {
        alternatives: true
      }
    });

    if (!step) {
      return res.status(404).json({ error: 'Step not found' });
    }

    // Verify the default product is either the main product or one of the alternatives
    const validProductIds = [step.productId, ...step.alternatives.map(a => a.productId)];
    if (!validProductIds.includes(defaultProductId)) {
      return res.status(400).json({ error: 'Invalid default product' });
    }

    const updatedStep = await prisma.routineStep.update({
      where: { id: parseInt(stepId) },
      data: { defaultProductId },
      include: {
        product: true,
        defaultProduct: true,
        alternatives: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(updatedStep);
  } catch (error) {
    console.error('Error updating default product:', error);
    res.status(500).json({ error: 'Failed to update default product' });
  }
};
