import { PrismaClient } from '@prisma/client';
import { compareResponses } from '../utils/feedbackComparison.js';

const prisma = new PrismaClient();

/**
 * Get comprehensive dashboard data for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        skinProfile: true,
        createdAt: true
      }
    });

    // Get active routines
    const routines = await prisma.userRoutine.findMany({
      where: {
        userId,
        isActive: true
      },
      include: {
        steps: {
          include: {
            product: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: [
        // { isFavorite: 'desc' },
        { updatedAt: 'desc' }
      ]
    });

    // Get recent questionnaire responses
    const recentResponses = await prisma.userResponse.findMany({
      where: { userId },
      include: {
        question: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Get progress data
    const responses = await prisma.userResponse.findMany({
      where: { userId },
      include: {
        question: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Generate progress report if there are enough responses
    let progressReport = null;
    if (responses.length >= 2) {
      const groupedResponses = responses.reduce((acc, response) => {
        const date = response.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(response);
        return acc;
      }, {});

      const dates = Object.keys(groupedResponses).sort();
      const firstResponses = groupedResponses[dates[0]];
      const lastResponses = groupedResponses[dates[dates.length - 1]];

      progressReport = compareResponses(firstResponses, lastResponses);
    }

    // Get monthly progress summary
    const monthlyProgress = responses.reduce((acc, response) => {
      const month = response.createdAt.toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(response);
      return acc;
    }, {});

    const progressSummary = Object.entries(monthlyProgress).map(([month, monthResponses]) => {
      const numericalResponses = monthResponses.filter(r => 
        r.question.type === 'NUMERICAL' || r.question.type === 'RATING'
      );

      const averages = numericalResponses.reduce((acc, response) => {
        const value = parseFloat(response.answer);
        if (!acc[response.question.text]) {
          acc[response.question.text] = {
            sum: 0,
            count: 0
          };
        }
        acc[response.question.text].sum += value;
        acc[response.question.text].count += 1;
        return acc;
      }, {});

      Object.keys(averages).forEach(question => {
        averages[question] = averages[question].sum / averages[question].count;
      });

      return {
        month,
        averages
      };
    });

    // Get upcoming routine reminders
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const upcomingSteps = routines.flatMap(routine => 
      routine.steps
        .filter(step => step.time && step.time >= now.toTimeString().slice(0, 5))
        .map(step => ({
          routineId: routine.id,
          routineName: routine.name,
          ...step
        }))
    ).sort((a, b) => a.time.localeCompare(b.time));

    // Get recent product recommendations
    const recentRecommendations = await prisma.product.findMany({
      where: {
        routineSteps: {
          some: {
            routine: {
              userId
            }
          }
        }
      },
      take: 5,
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        routines,
        recentResponses,
        progress: {
          report: progressReport,
          summary: progressSummary
        },
        upcomingSteps,
        recentRecommendations
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
}; 