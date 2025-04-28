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

    // Get monthly progress summary with enhanced metrics
    const monthlyProgress = responses.reduce((acc, response) => {
      const month = response.createdAt.toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = {
          responses: [],
          metrics: {
            skinHealth: {},
            lifestyle: {},
            routineAdherence: {},
            productEfficacy: {}
          }
        };
      }
      acc[month].responses.push(response);
      return acc;
    }, {});

    const progressSummary = Object.entries(monthlyProgress).map(([month, monthData]) => {
      const numericalResponses = monthData.responses.filter(r => 
        r.question.type === 'NUMERICAL' || r.question.type === 'RATING'
      );

      // Calculate averages for different categories
      const averages = numericalResponses.reduce((acc, response) => {
        const value = parseFloat(response.answer);
        const category = response.question.category || 'general';
        
        if (!acc[category]) {
          acc[category] = {};
        }
        
        if (!acc[category][response.question.text]) {
          acc[category][response.question.text] = {
            sum: 0,
            count: 0,
            min: Infinity,
            max: -Infinity
          };
        }
        
        const metric = acc[category][response.question.text];
        metric.sum += value;
        metric.count += 1;
        metric.min = Math.min(metric.min, value);
        metric.max = Math.max(metric.max, value);
        
        return acc;
      }, {});

      // Calculate final metrics for each category
      const metrics = {};
      Object.entries(averages).forEach(([category, questions]) => {
        metrics[category] = {};
        Object.entries(questions).forEach(([question, data]) => {
          metrics[category][question] = {
            average: data.sum / data.count,
            range: {
              min: data.min,
              max: data.max
            },
            consistency: (data.max - data.min) / data.count
          };
        });
      });

      // Calculate trend indicators
      const trendIndicators = {};
      Object.entries(metrics).forEach(([category, questions]) => {
        trendIndicators[category] = {};
        Object.entries(questions).forEach(([question, data]) => {
          trendIndicators[category][question] = {
            direction: data.average > (data.range.min + data.range.max) / 2 ? 'improving' : 'declining',
            stability: data.consistency < 0.5 ? 'stable' : 'volatile'
          };
        });
      });

      return {
        month,
        metrics,
        trendIndicators,
        responseCount: monthData.responses.length
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