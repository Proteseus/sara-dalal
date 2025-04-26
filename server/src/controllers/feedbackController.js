import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Submit product feedback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const submitProductFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, usage, discomfort, discomfortImproving, positiveChanges } = req.body;

    const feedback = await prisma.productFeedback.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {
        usage,
        discomfort,
        discomfortImproving,
        positiveChanges
      },
      create: {
        userId,
        productId,
        usage,
        discomfort,
        discomfortImproving,
        positiveChanges
      }
    });

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error submitting product feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit product feedback'
    });
  }
};

/**
 * Submit routine feedback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const submitRoutineFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      routineId,
      satisfaction,
      skinChanges,
      easeOfUse,
      unnecessaryProductId,
      primaryConcern,
      routinePreference
    } = req.body;

    const feedback = await prisma.routineFeedback.upsert({
      where: {
        userId_routineId: {
          userId,
          routineId
        }
      },
      update: {
        satisfaction,
        skinChanges,
        easeOfUse,
        unnecessaryProductId,
        primaryConcern,
        routinePreference
      },
      create: {
        userId,
        routineId,
        satisfaction,
        skinChanges,
        easeOfUse,
        unnecessaryProductId,
        primaryConcern,
        routinePreference
      }
    });

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error submitting routine feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit routine feedback'
    });
  }
};

/**
 * Get feedback for a specific routine
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRoutineFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineId } = req.params;

    const feedback = await prisma.routineFeedback.findUnique({
      where: {
        userId_routineId: {
          userId,
          routineId: parseInt(routineId)
        }
      },
      include: {
        unnecessaryProduct: true
      }
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching routine feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch routine feedback'
    });
  }
};

/**
 * Get feedback for a specific product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProductFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const feedback = await prisma.productFeedback.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId)
        }
      }
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching product feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product feedback'
    });
  }
}; 